-- Run in Supabase SQL Editor. Create admin users through Supabase Auth dashboard.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 role text not null default 'reader' check (role in ('reader','admin')),
 display_name text,
 created_at timestamptz not null default now()
);
create table if not exists public.stories (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 body text not null,
 author_display text,
 published boolean not null default false,
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now()
);
create table if not exists public.articles (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 slug text not null unique,
 body text not null,
 language text not null default 'en' check(language in ('en','hi')),
 category text not null default 'culture',
 cover_image text,
 published boolean not null default false,
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.events (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 description text,
 starts_at timestamptz,
 venue text,
 published boolean not null default false,
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now()
);
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
 select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.articles enable row level security;
alter table public.events enable row level security;
create policy "users read own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads published stories" on public.stories for select to anon, authenticated using (published = true or public.is_admin());
create policy "admins manage stories" on public.stories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads published articles" on public.articles for select to anon, authenticated using (published = true or public.is_admin());
create policy "admins manage articles" on public.articles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads published events" on public.events for select to anon, authenticated using (published = true or public.is_admin());
create policy "admins manage events" on public.events for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.stories, public.articles, public.events to anon, authenticated;
grant insert, update, delete on public.stories, public.articles, public.events to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
-- After creating an admin user in Authentication > Users, run this with their UUID:
-- insert into public.profiles (id, role, display_name) values ('AUTH_USER_UUID', 'admin', 'Wonderwall Admin')
-- on conflict (id) do update set role='admin';
