"use client";

import { useCallback, useEffect, useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type ScheduleItem = {
  id: number;
  title: string;
  day_number: number;
  day_label: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  venue: string | null;
  flat_no: string | null;
  organiser_name: string | null;
  organiser_phone: string | null;
  details: string | null;
  item_type: "ritual" | "prasad_distribution" | "announcement" | "other";
  display_order: number;
  is_published: boolean;
};

const days = [
  { value: "1", label: "Day 1 — Nahay Khay" },
  { value: "2", label: "Day 2 — Kharna" },
  { value: "3", label: "Day 3 — Sandhya Arghya" },
  { value: "4", label: "Day 4 — Usha Arghya" },
];
const blankForm = {
  title: "", day_number: "1", day_label: "Nahay Khay", event_date: "",
  start_time: "", end_time: "", venue: "", flat_no: "", organiser_name: "",
  organiser_phone: "", details: "",
  item_type: "ritual" as ScheduleItem["item_type"],
  display_order: "0", is_published: true,
};
const dateText = (value: string | null) => {
  if (!value) return "Date to be announced";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
};
const timeText = (value: string | null) => {
  if (!value) return "";
  const [h, m] = value.slice(0, 5).split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
};
const inputStyle: CSSProperties = { width: "100%", boxSizing: "border-box", padding: "11px 12px", border: "1px solid #cbd8ce", borderRadius: 9, background: "#fffdf7", color: "#173f34", font: "inherit", marginTop: 6 };
const labelStyle: CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, color: "#36584c" };
const buttonStyle: CSSProperties = { border: 0, borderRadius: 9, padding: "11px 15px", background: "#176b59", color: "white", fontWeight: 700, cursor: "pointer" };
const secondaryButton: CSSProperties = { ...buttonStyle, background: "#e8efe8", color: "#176b59" };

export default function ChhathSchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chhath_schedule_items")
      .select("*")
      .order("day_number", { ascending: true })
      .order("display_order", { ascending: true })
      .order("start_time", { ascending: true });
    if (error) setMessage(`Could not load schedule: ${error.message}`);
    else setItems((data ?? []) as ScheduleItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    async function checkAdmin() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await supabase.from("profiles")
            .select("role").eq("id", user.id).maybeSingle();
          if (active) setIsAdmin(!error && profile?.role === "admin");
        }
      } finally {
        if (active) setRoleChecked(true);
      }
    }
    void checkAdmin();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    void loadSchedule();
  }, [loadSchedule]);

  function resetForm() {
    setForm(blankForm);
    setEditingId(null);
  }

  function editItem(item: ScheduleItem) {
    setEditingId(item.id);
    setForm({
      title: item.title, day_number: String(item.day_number), day_label: item.day_label,
      event_date: item.event_date || "", start_time: item.start_time?.slice(0, 5) || "",
      end_time: item.end_time?.slice(0, 5) || "", venue: item.venue || "",
      flat_no: item.flat_no || "", organiser_name: item.organiser_name || "",
      organiser_phone: item.organiser_phone || "", details: item.details || "",
      item_type: item.item_type, display_order: String(item.display_order ?? 0),
      is_published: item.is_published,
    });
    setShowEditor(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAdmin) return setMessage("Only an authorized admin can edit the schedule.");
    if (form.start_time && form.end_time && form.end_time < form.start_time) {
      return setMessage("End time must be later than start time.");
    }
    setSaving(true);
    setMessage("");
    const payload = {
      title: form.title.trim(), day_number: Number(form.day_number),
      day_label: form.day_label, event_date: form.event_date || null,
      start_time: form.start_time || null, end_time: form.end_time || null,
      venue: form.venue.trim() || null, flat_no: form.flat_no.trim() || null,
      organiser_name: form.organiser_name.trim() || null,
      organiser_phone: form.organiser_phone.trim() || null,
      details: form.details.trim() || null, item_type: form.item_type,
      display_order: Number(form.display_order) || 0, is_published: form.is_published,
    };
    const result = editingId === null
      ? await supabase.from("chhath_schedule_items").insert(payload)
      : await supabase.from("chhath_schedule_items").update(payload).eq("id", editingId);
    if (result.error) setMessage(`Could not save: ${result.error.message}`);
    else {
      setMessage(editingId === null ? "Schedule entry added." : "Schedule entry updated.");
      resetForm();
      await loadSchedule();
    }
    setSaving(false);
  }

  async function deleteItem(item: ScheduleItem) {
    if (!isAdmin || !window.confirm(`Delete "${item.title}"?`)) return;
    const { error } = await supabase.from("chhath_schedule_items").delete().eq("id", item.id);
    if (error) setMessage(`Could not delete: ${error.message}`);
    else { setMessage("Schedule entry deleted."); await loadSchedule(); }
  }

  async function togglePublished(item: ScheduleItem) {
    const { error } = await supabase.from("chhath_schedule_items")
      .update({ is_published: !item.is_published }).eq("id", item.id);
    if (error) setMessage(`Could not change publishing status: ${error.message}`);
    else await loadSchedule();
  }

  const visibleItems = items.filter(item => isAdmin || item.is_published);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.brand}>
          <span style={styles.sun}>☼</span>
          <span><strong>WONDERWALL</strong><small>CHHATH MAHOTSAV 2026</small></span>
        </Link>
        <nav style={styles.nav}>
          <Link href="/admin" style={styles.navLink}>My Contributions &amp; Activities</Link>
          <Link href="/culture" style={{ ...styles.navLink, ...styles.activeLink }}>Chhath Puja Schedule &amp; Activities</Link>
          <Link href="/stories" style={styles.navLink}>Memories &amp; Moments</Link>
        </nav>
      </header>

      <section style={styles.hero}>
        <p style={styles.eyebrow}>WONDERWALL · OUR COMMUNITY, OUR TRADITION</p>
        <h1 style={{ fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 1.1, margin: "0 0 18px" }}>
          Chhath Puja <span style={{ color: "#f0cd78" }}>Schedule &amp; Activities</span>
        </h1>
        <p>All four sacred days, Puja locations, timings and Prasad distribution information in one place.</p>
      </section>

      <section style={styles.content}>
        <div style={styles.sectionHeading}>
          <div><p style={styles.eyebrow}>THE FESTIVAL PROGRAMME</p><h2 style={{ fontSize: 30, margin: 0 }}>Chhath Puja programme</h2></div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" style={styles.adminLinkButton} onClick={() => void loadSchedule()} disabled={loading}>{loading ? "Refreshing…" : "Refresh schedule"}</button>
            {roleChecked && isAdmin && <button type="button" style={styles.primaryButton} onClick={() => { resetForm(); setShowEditor(!showEditor); }}>{showEditor ? "Close editor" : "＋ Edit Schedule"}</button>}
          </div>
        </div>

        {message && <div role="status" style={styles.message}>{message}<button type="button" onClick={() => setMessage("")} style={{ float: "right" }}>×</button></div>}

        {showEditor && isAdmin && (
          <section style={styles.editor}>
            <h2 style={{ marginTop: 0 }}>{editingId === null ? "Add schedule entry" : "Edit schedule entry"}</h2>
            <p style={styles.muted}>Create one entry for each ritual, Arghya, Prasad distribution point or announcement. You can leave unknown details blank and add them later.</p>
            <form onSubmit={saveItem} style={styles.formGrid}>
              <label style={styles.label}>Title *<input required style={styles.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Sandhya Arghya" /></label>
              <label style={styles.label}>Festival day *<select required style={styles.input} value={form.day_number} onChange={e => { const d = days.find(x => x.value === e.target.value)!; setForm({ ...form, day_number: d.value, day_label: d.label.split(" — ")[1] }); }}>{days.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}</select></label>
              <label style={styles.label}>Date<input type="date" style={styles.input} value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} /></label>
              <label style={styles.label}>Start time<input type="time" style={styles.input} value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} /></label>
              <label style={styles.label}>End time<input type="time" style={styles.input} value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} /></label>
              <label style={styles.label}>Entry type<select style={styles.input} value={form.item_type} onChange={e => setForm({ ...form, item_type: e.target.value as ScheduleItem["item_type"] })}><option value="ritual">Puja / Ritual</option><option value="prasad_distribution">Prasad distribution</option><option value="announcement">Announcement</option><option value="other">Other</option></select></label>
              <label style={styles.label}>Exact venue / location<input style={styles.input} value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="e.g. society pond, clubhouse, Tower D" /></label>
              <label style={styles.label}>Flat number<input style={styles.input} value={form.flat_no} onChange={e => setForm({ ...form, flat_no: e.target.value })} placeholder="e.g. D-104" /></label>
              <label style={styles.label}>Organiser name<input style={styles.input} value={form.organiser_name} onChange={e => setForm({ ...form, organiser_name: e.target.value })} /></label>
              <label style={styles.label}>Organiser phone (optional)<input type="tel" style={styles.input} value={form.organiser_phone} onChange={e => setForm({ ...form, organiser_phone: e.target.value })} /></label>
              <label style={styles.label}>Display order<input type="number" style={styles.input} value={form.display_order} onChange={e => setForm({ ...form, display_order: e.target.value })} /></label>
              <label style={{ ...styles.label, gridColumn: "1 / -1" }}>Details / instructions<textarea rows={4} style={styles.input} value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="Prasad collection instructions, gathering point, items to bring, etc." /></label>
              <label style={{ ...styles.label, display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> Publish this entry on the public page</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", gridColumn: "1 / -1" }}>
                <button type="submit" disabled={saving} style={styles.primaryButton}>{saving ? "Saving…" : editingId === null ? "＋ Add schedule entry" : "Save changes"}</button>
                {editingId !== null && <button type="button" style={styles.adminLinkButton} onClick={resetForm}>Cancel edit</button>}
              </div>
            </form>
          </section>
        )}

        {loading && <p style={styles.notice}>Loading the festival programme…</p>}
        {!loading && visibleItems.length === 0 && <div style={styles.empty}><span style={styles.emptyIcon}>☼</span><h3>Festival programme will appear here</h3><p>No published schedule details are available yet. An administrator can add dates, timings, locations and Prasad details using Edit Schedule.</p>{roleChecked && !isAdmin && <Link href="/admin/login" style={styles.primaryButton}>Admin Login</Link>}</div>}

        <div style={styles.dayGrid}>
          {days.map(day => {
            const dayItems = visibleItems.filter(item => String(item.day_number) === day.value);
            if (!dayItems.length) return null;
            return <section key={day.value} style={styles.dayCard}>
              <p style={styles.eyebrow}>{day.label}</p>
              <div style={{ display: "grid", gap: 12 }}>
                {dayItems.map(item => <article key={item.id} style={styles.scheduleItem}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 10, flexWrap: "wrap" }}>
                    <h3 style={{ margin: "0 0 8px", fontSize: 20 }}>{item.title}</h3>
                    <span style={styles.typeBadge}>{item.item_type === "prasad_distribution" ? "Prasad distribution" : item.item_type.replace("_", " ")}</span>
                  </div>
                  <p style={styles.detail}><strong>Date:</strong> {dateText(item.event_date)}{item.start_time ? ` · ${timeText(item.start_time)}` : ""}{item.end_time ? ` – ${timeText(item.end_time)}` : ""}</p>
                  {item.venue && <p style={styles.detail}><strong>Location:</strong> {item.venue}</p>}
                  {item.flat_no && <p style={styles.detail}><strong>Flat:</strong> {item.flat_no}</p>}
                  {item.organiser_name && <p style={styles.detail}><strong>Organiser:</strong> {item.organiser_name}{item.organiser_phone ? ` · ${item.organiser_phone}` : ""}</p>}
                  {item.details && <p style={styles.description}>{item.details}</p>}
                  {isAdmin && !item.is_published && <p style={{ color: "#9b5a24", fontWeight: 700, fontSize: 12 }}>Hidden from public visitors</p>}
                  {isAdmin && <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}><button type="button" style={styles.adminLinkButton} onClick={() => editItem(item)}>Edit</button><button type="button" style={styles.adminLinkButton} onClick={() => void togglePublished(item)}>{item.is_published ? "Unpublish" : "Publish"}</button><button type="button" style={styles.deleteButton} onClick={() => void deleteItem(item)}>Delete</button></div>}
                </article>)}
              </div>
            </section>;
          })}
        </div>
      </section>
      <footer style={styles.footer}><span>☼ WONDERWALL · CHHATH MAHOTSAV 2026</span><span>जय छठी मैया</span></footer>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: "#fbf8ef", color: "#173f34", fontFamily: "Arial, Helvetica, sans-serif" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap", padding: "18px clamp(18px, 5vw, 72px)", background: "#147d6d", color: "#fff8e8" },
  brand: { display: "flex", alignItems: "center", gap: 12, color: "inherit", textDecoration: "none" },
  sun: { fontSize: 38, color: "#f0cd78", lineHeight: 1 },
  nav: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  navLink: { color: "#fff8e8", textDecoration: "none", padding: "10px 12px", borderRadius: 24, fontSize: 13, fontWeight: 600 },
  activeLink: { border: "1px solid #f0cd78", color: "#fbe8b4" },
  hero: { padding: "64px clamp(20px, 8vw, 110px) 58px", background: "linear-gradient(135deg, #174b3d, #0d7564)", color: "#fff8e8" },
  eyebrow: { margin: "0 0 12px", color: "#b28c35", letterSpacing: 2, fontSize: 11, fontWeight: 700, textTransform: "uppercase" },
  content: { maxWidth: 1180, margin: "0 auto", padding: "42px 22px 64px" },
  sectionHeading: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap", marginBottom: 24 },
  adminLinkButton: { color: "#176b59", fontWeight: 700, textDecoration: "none", border: "1px solid #c8d9ce", borderRadius: 10, padding: "10px 14px", background: "#fffdf7", cursor: "pointer" },
  primaryButton: { display: "inline-block", marginTop: 4, padding: "12px 18px", background: "#176b59", color: "#fff", border: 0, borderRadius: 10, textDecoration: "none", fontWeight: 700, cursor: "pointer" },
  deleteButton: { ...buttonStyle, background: "#a33b2d" },
  notice: { padding: 18, background: "#edf4ef", borderRadius: 12 },
  message: { maxWidth: 1136, margin: "18px auto", padding: 14, borderRadius: 10, background: "#e9f2e9", color: "#176b59" },
  empty: { textAlign: "center", padding: "48px 22px", border: "1px dashed #c5d5ca", borderRadius: 18, background: "#fffdf7" },
  emptyIcon: { display: "block", fontSize: 42, color: "#c69e45" },
  dayGrid: { display: "grid", gap: 20 },
  dayCard: { background: "#fffdf7", border: "1px solid #e6e2d5", borderRadius: 16, padding: 22, boxShadow: "0 8px 24px rgba(28,65,51,.05)" },
  scheduleItem: { padding: 16, border: "1px solid #e1e8df", borderRadius: 12, background: "#fbfcf6" },
  typeBadge: { color: "#7c652c", background: "#f8efcf", borderRadius: 20, padding: "6px 9px", fontSize: 11, textTransform: "capitalize" },
  detail: { margin: "8px 0", color: "#45665b", fontSize: 14 },
  description: { lineHeight: 1.7, color: "#53685f", fontSize: 14, whiteSpace: "pre-wrap" },
  muted: { color: "#63786c", fontSize: 14, lineHeight: 1.6 },
  editor: { marginBottom: 24, padding: "clamp(18px, 3vw, 28px)", background: "#fffdf7", border: "1px solid #d8e3d8", borderRadius: 16 },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 700, color: "#36584c" },
  input: { width: "100%", boxSizing: "border-box", padding: "11px 12px", border: "1px solid #cbd8ce", borderRadius: 9, background: "#fffdf7", color: "#173f34", font: "inherit", marginTop: 6 },
  footer: { display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "22px clamp(18px, 5vw, 72px)", background: "#123f34", color: "#f3e5bd", fontSize: 12, letterSpacing: 1 },
};
