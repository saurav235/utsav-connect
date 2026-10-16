# Bihar Ki Bhavna — by Wonderwall

A mobile-first bilingual cultural website starter built with Next.js, TypeScript and Supabase. It includes public culture pages, Chhath's four-day explainer, a stories page, WhatsApp sharing, Open Graph metadata, and an admin sign-in/publishing screen backed by Supabase Auth + Row Level Security.

## Included
- `/` — public landing page
- `/chhath` — four-day guide in English and Hindi
- `/culture` — starter Bihari culture library
- `/stories` — displays published resident stories
- `/admin` — authenticated content publishing for stories and articles
- `supabase/schema.sql` — database tables and row-level security policies
- `/.env.example` — environment template

## Requirements
- Node.js 20+
- A Supabase project

## Run locally
1. Copy `.env.example` to `.env.local`.
2. Add your Supabase project URL and anon/publishable key.
3. In Supabase SQL Editor, run `supabase/schema.sql`.
4. Create an admin user in Supabase Dashboard → Authentication → Users. Disable public sign-ups if they are not needed.
5. Copy the user's UUID and run the final `insert into public.profiles...` statement in `supabase/schema.sql` after replacing `AUTH_USER_UUID`.
6. Install and start:
   ```bash
   npm install
   npm run dev
   ```
7. Open http://localhost:3000.

## Deploy
- Push this folder to a private/public Git repository.
- Import the repo into Vercel or deploy to Azure Static Web Apps with a compatible Next.js hosting setup.
- Configure `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the hosting environment.
- Set `NEXT_PUBLIC_SITE_URL` to the production HTTPS URL so social sharing metadata points to the right domain.

## Security notes
- The Supabase anon key is intended for browser use; never put a service-role key in client code or any `NEXT_PUBLIC_` variable.
- RLS is the security boundary. Only accounts with `profiles.role = 'admin'` can publish/update/delete.
- The starter admin page publishes English article rows and stories. To manage Hindi translations, images, video URLs and events, extend the form and add the corresponding fields to the insert payload.
- No public story submission is enabled by default; this avoids unmoderated or consent-sensitive uploads. Add a moderated submission workflow before inviting residents to submit content.
- For public-facing content, obtain consent for names, images and personal stories; confirm cultural details with knowledgeable community members. Rituals vary regionally.

## Important starter limitations
This is a working starter scaffold, not a production-complete CMS. Before launch, add automated tests, rate limiting/monitoring, admin audit logs, media storage policies, a richer article editor, bilingual content editing, event management UI, and production metadata/image assets. The language toggle in the header is a starter UI control; the content pages currently show both languages on the ritual detail page, while most homepage copy is English. Implement full translation routing/state before treating the site as fully bilingual.
