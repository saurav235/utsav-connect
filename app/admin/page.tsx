"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import styles from "./admin.module.css";

type EventItem = {
  id: number;
  name: string;
  event_date: string | null;
  start_date: string | null;
  end_date: string | null;
  venue: string | null;
  description: string | null;
  status: "upcoming" | "ongoing" | "completed";
};

type Responsibility = {
  id: number;
  event_id: number;
  task: string;
  person_name: string | null;
  flat_no: string | null;
  phone: string | null;
  status: "assigned" | "in_progress" | "completed";
};

type Contribution = {
  id: number;
  event_id: number;
  contributor_name: string;
  flat_no: string;
  amount: number;
  payment_status: "pending" | "received";
  payment_method: string | null;
  payment_date: string | null;
  notes: string | null;
};

type Tab = "overview" | "events" | "responsibilities" | "contributions";

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const dateLabel = (date: string | null) => {
  if (!date) return "Not set";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [requestReason, setRequestReason] = useState("");
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [requestBusy, setRequestBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);

  const [eventForm, setEventForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
    venue: "",
    description: "",
  });
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [taskForm, setTaskForm] = useState({
    event_id: "",
    task: "",
    person_name: "",
    flat_no: "",
    phone: "",
    status: "assigned" as Responsibility["status"],
  });
  const [contributionForm, setContributionForm] = useState({
    event_id: "",
    contributor_name: "",
    flat_no: "",
    amount: "",
    payment_status: "received",
    payment_method: "",
    payment_date: "",
    notes: "",
  });

  const checkAdminRole = useCallback(async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setCurrentUserId(null);
        setIsAdmin(false);
        setRoleChecked(true);
        return;
      }
      setCurrentUserId(user.id);
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      const admin = !profileError && profile?.role === "admin";
      setIsAdmin(admin);
      if (admin) {
        setRequestStatus("admin");
      } else {
        const { data: request, error: requestError } = await supabase
          .from("admin_access_requests")
          .select("status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (requestError) {
          console.error("Unable to load admin-access request:", requestError.message);
        } else {
          setRequestStatus(request?.status ?? null);
        }
      }
    } catch (error) {
      console.error("Unable to check admin role:", error);
      setIsAdmin(false);
    } finally {
      setRoleChecked(true);
    }
  }, []);

  useEffect(() => {
    void checkAdminRole();
  }, [checkAdminRole]);

  async function submitAdminRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUserId) {
      setMessage("Please sign in before requesting admin access.");
      return;
    }
    const reason = requestReason.trim();
    if (reason.length < 10) {
      setMessage("Please provide a reason of at least 10 characters.");
      return;
    }
    setRequestBusy(true);
    setMessage("");
    const { error } = await supabase.from("admin_access_requests").insert({
      user_id: currentUserId,
      reason,
      status: "pending",
    });
    if (error) {
      setMessage(error.code === "23505"
        ? "You already have a pending admin-access request."
        : `Could not submit request: ${error.message}`);
    } else {
      setRequestStatus("pending");
      setRequestReason("");
      setMessage("Your admin-access request was submitted. An existing admin can review it under Stories Review.");
    }
    setRequestBusy(false);
  }

  const loadData = useCallback(async () => {
    setMessage("Loading dashboard data...");

    try {
      // Do not sort yet: this isolates missing/incorrect date-column issues.
      const [eventResult, taskResult, contributionResult] = await Promise.all([
        supabase.from("community_events").select("*"),
        supabase.from("event_responsibilities").select("*"),
        supabase.from("community_contributions").select("*"),
      ]);

      console.log("WONDERWALL EVENTS RESULT", {
        count: eventResult.data?.length ?? 0,
        error: eventResult.error,
        data: eventResult.data,
      });
      console.log("WONDERWALL RESPONSIBILITIES RESULT", {
        count: taskResult.data?.length ?? 0,
        error: taskResult.error,
        data: taskResult.data,
      });
      console.log("WONDERWALL CONTRIBUTIONS RESULT", {
        count: contributionResult.data?.length ?? 0,
        error: contributionResult.error,
        data: contributionResult.data,
      });

      const errors = [
        eventResult.error && `Events: ${eventResult.error.message}`,
        taskResult.error && `Responsibilities: ${taskResult.error.message}`,
        contributionResult.error && `Contributions: ${contributionResult.error.message}`,
      ].filter(Boolean);

      setEvents((eventResult.data ?? []) as EventItem[]);
      setResponsibilities((taskResult.data ?? []) as Responsibility[]);
      setContributions((contributionResult.data ?? []) as Contribution[]);

      if (errors.length) {
        setMessage(errors.join(" | "));
      } else {
        setMessage(
          `Loaded ${eventResult.data?.length ?? 0} events, ${taskResult.data?.length ?? 0} responsibilities, and ${contributionResult.data?.length ?? 0} contributions.`
        );
      }
    } catch (error) {
      console.error("Unexpected dashboard loading error:", error);
      setMessage(
        error instanceof Error ? error.message : "Unable to load dashboard data."
      );
    }
  }, []);

  useEffect(() => {
    void loadData()
      .catch((error) => {
        console.error("Unexpected dashboard loading error:", error);
        setMessage(error instanceof Error ? error.message : "Unable to load dashboard data.");
      })
      .finally(() => setLoading(false));
  }, [loadData]);

  function startEditEvent(item: EventItem) {
    setEditingEventId(item.id);
    setEventForm({
      name: item.name,
      start_date: item.start_date || item.event_date || "",
      end_date: item.end_date || item.event_date || "",
      venue: item.venue || "",
      description: item.description || "",
    });
    setTab("events");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditEvent() {
    setEditingEventId(null);
    setEventForm({ name: "", start_date: "", end_date: "", venue: "", description: "" });
  }

  async function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (eventForm.start_date && eventForm.end_date && eventForm.end_date < eventForm.start_date) {
      setMessage("End date cannot be before start date.");
      return;
    }

    setSaving(true);
    setMessage("");
    const payload = {
      name: eventForm.name.trim(),
      start_date: eventForm.start_date || null,
      end_date: eventForm.end_date || null,
      event_date: eventForm.start_date || null,
      venue: eventForm.venue.trim() || null,
      description: eventForm.description.trim() || null,
    };

    const result = editingEventId
      ? await supabase.from("community_events").update(payload).eq("id", editingEventId)
      : await supabase.from("community_events").insert({ ...payload, status: "upcoming" });

    if (result.error) setMessage(result.error.message);
    else {
      setMessage(editingEventId ? "Event updated successfully." : "Event created successfully.");
      cancelEditEvent();
      await loadData();
    }
    setSaving(false);
  }

  function startEditTask(item: Responsibility) {
    setEditingTaskId(item.id);
    setTaskForm({
      event_id: String(item.event_id),
      task: item.task,
      person_name: item.person_name || "",
      flat_no: item.flat_no || "",
      phone: item.phone || "",
      status: item.status,
    });
    setTab("responsibilities");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditTask() {
    setEditingTaskId(null);
    setTaskForm({
      event_id: "",
      task: "",
      person_name: "",
      flat_no: "",
      phone: "",
      status: "assigned",
    });
  }

  async function addResponsibility(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!taskForm.event_id) {
      setMessage("Please select an event.");
      return;
    }
    if (!taskForm.task.trim()) {
      setMessage("Please enter a task name.");
      return;
    }

    setSaving(true);
    setMessage("");
    const payload = {
      event_id: Number(taskForm.event_id),
      task: taskForm.task.trim(),
      person_name: null,
      flat_no: null,
      phone: null,
      status: "assigned" as Responsibility["status"],
    };

    const result = editingTaskId !== null
      ? await supabase.from("event_responsibilities").update(payload).eq("id", editingTaskId)
      : await supabase.from("event_responsibilities").insert(payload);

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage(editingTaskId !== null ? "Task updated." : "Task created. Residents can now join it.");
      cancelEditTask();
      await loadData();
    }
    setSaving(false);
  }

  async function joinResponsibility(eventId: number, task: string, person: { person_name: string; flat_no: string; phone: string }) {
    if (!person.person_name.trim()) {
      setMessage("Please enter your name to join this task.");
      return;
    }
    setSaving(true);
    setMessage("");
    const { error } = await supabase.from("event_responsibilities").insert({
      event_id: eventId,
      task,
      person_name: person.person_name.trim(),
      flat_no: person.flat_no.trim() || null,
      phone: person.phone.trim() || null,
      status: "assigned",
    });
    if (error) setMessage(error.message);
    else {
      setMessage(`You joined "${task}" successfully.`);
      await loadData();
    }
    setSaving(false);
  }

  async function addContribution(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const { error } = await supabase.from("community_contributions").insert({
      event_id: Number(contributionForm.event_id),
      contributor_name: contributionForm.contributor_name.trim(),
      flat_no: contributionForm.flat_no.trim(),
      amount: Number(contributionForm.amount),
      payment_status: contributionForm.payment_status,
      payment_method: contributionForm.payment_method.trim() || null,
      payment_date: contributionForm.payment_date || null,
      notes: contributionForm.notes.trim() || null,
    });
    if (error) setMessage(error.message);
    else {
      setContributionForm({
        event_id: "", contributor_name: "", flat_no: "", amount: "",
        payment_status: "received", payment_method: "", payment_date: "", notes: "",
      });
      setMessage("Contribution recorded successfully.");
      await loadData();
    }
    setSaving(false);
  }

  async function updateEventStatus(id: number, status: EventItem["status"]) {
    const { error } = await supabase.from("community_events").update({ status }).eq("id", id);
    if (error) setMessage(error.message);
    else await loadData();
  }

  async function updateTaskStatus(id: number, status: Responsibility["status"]) {
    const { error } = await supabase.from("event_responsibilities").update({ status }).eq("id", id);
    if (error) setMessage(error.message);
    else await loadData();
  }

  async function updateContributionStatus(id: number, status: Contribution["payment_status"]) {
    const { error } = await supabase.from("community_contributions")
      .update({ payment_status: status, payment_date: status === "received" ? new Date().toISOString().slice(0, 10) : null })
      .eq("id", id);
    if (error) setMessage(error.message);
    else await loadData();
  }

  async function deleteRecord(
    table: "community_events" | "event_responsibilities" | "community_contributions",
    id: number,
    label: string
  ) {
    if (!window.confirm(`Delete this ${label}? This cannot be undone.`)) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) setMessage(error.message);
    else {
      setMessage(`${label} deleted.`);
      await loadData();
    }
  }

  const eventName = (id: number) => events.find((item) => item.id === id)?.name ?? "Unknown event";
  const received = contributions.filter((item) => item.payment_status === "received").reduce((sum, item) => sum + Number(item.amount), 0);
  const pending = contributions.filter((item) => item.payment_status === "pending").reduce((sum, item) => sum + Number(item.amount), 0);
  const completedTasks = responsibilities.filter((item) => item.status === "completed").length;
  const dateRange = (item: EventItem) => {
    const start = item.start_date || item.event_date;
    const end = item.end_date || item.event_date;
    if (!start && !end) return "Dates not set";
    if (!end || start === end) return dateLabel(start);
    if (!start) return `Until ${dateLabel(end)}`;
    return `${dateLabel(start)} – ${dateLabel(end)}`;
  };

  if (loading) return <main className={styles.loading}>Loading your community dashboard…</main>;

  return (
    <main className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>☼</span>
          <span className={styles.brandName}>CHHATH MAHOTSAV 2026<small>BY WONDERWALL</small></span>
        </Link>
        <div className={styles.navLabel}>WORKSPACE</div>
        <nav className={styles.nav}>
          <button className={tab === "overview" ? styles.navActive : ""} onClick={() => setTab("overview")}><span>⌂</span> Overview</button>
          <button className={tab === "events" ? styles.navActive : ""} onClick={() => setTab("events")}><span>▦</span> Events</button>
          <button className={tab === "responsibilities" ? styles.navActive : ""} onClick={() => setTab("responsibilities")}><span>♧</span> Responsibilities</button>
          <button className={tab === "contributions" ? styles.navActive : ""} onClick={() => setTab("contributions")}><span>₹</span> Contributions</button>
        </nav>
        <div className={styles.sidebarBottom}>
          <div className={styles.sidebarArtwork}>☼　✦　♧</div>
          <p>Our Culture<br />Our Community<br />Our Pride</p>
          <Link href="/stories">Community stories ↗</Link>
          {isAdmin && <Link href="/admin/stories">Stories & admin approvals ↗</Link>}
          <Link href="/">View public website ↗</Link>
        </div>
      </aside>

      <section className={styles.mainArea}>
        <header className={styles.topbar}>
          <div>Wonderwall <span>·</span> Community management</div>
          <div className={styles.account}><span className={styles.avatar}>W</span><span className={styles.accountEmail}>Community Dashboard</span></div>
        </header>
        <div className={styles.content}>
          <div className={styles.welcome}>
            <div><p className={styles.kicker}>YOUR COMMUNITY, ONE PLACE</p>
              <h1>{tab === "overview" ? "Welcome to your dashboard" : tab[0].toUpperCase() + tab.slice(1)}</h1>
              <p className={styles.muted}>Manage community events, volunteer tasks and contributions in one place.</p>
            </div>
            <div className={styles.hindiNote}>शहर बेंगलुरु, दिल में बिहार।<span /></div>
          </div>

          {!roleChecked && <div className={styles.notice} role="status">Checking permissions…</div>}
          {message && <div className={styles.notice} role="status">{message}<button onClick={() => setMessage("")} aria-label="Dismiss message">×</button></div>}

          {roleChecked && currentUserId && <section className={styles.panel} aria-labelledby="admin-access-heading">
            <div className={styles.panelHeader}><div><span className={styles.panelIcon}>♙</span><h2 id="admin-access-heading">Admin access</h2></div></div>
            {isAdmin || requestStatus === "admin" ? <p className={styles.emptyText}>Your account already has admin access.</p>
              : requestStatus === "pending" ? <p className={styles.emptyText}>Your admin-access request is pending review. An existing admin can approve it under Stories Review.</p>
              : requestStatus === "rejected" ? <p className={styles.emptyText}>Your previous request was rejected. You can submit a new request below.</p>
              : <form className={styles.form} onSubmit={submitAdminRequest}>
                  <p className={styles.muted}>Request permission to help manage Wonderwall. An existing admin must approve your request.</p>
                  <label htmlFor="admin-request-reason">Why would you like admin access? *</label>
                  <textarea id="admin-request-reason" required minLength={10} maxLength={1000} rows={4} value={requestReason} onChange={(e) => setRequestReason(e.target.value)} placeholder="For example, I would like to help manage festival stories and community content." />
                  <button className={styles.primaryButton} type="submit" disabled={requestBusy}>{requestBusy ? "Submitting…" : "Request admin access"}</button>
                </form>}
          </section>}

          <div className={styles.stats}>
            <article className={styles.statCard}><span className={`${styles.statIcon} ${styles.greenIcon}`}>▦</span><div><p>Total events</p><strong>{events.length}</strong><small>All community events</small></div><button onClick={() => setTab("events")} aria-label="View events">›</button></article>
            <article className={styles.statCard}><span className={`${styles.statIcon} ${styles.goldIcon}`}>♧</span><div><p>Responsibilities</p><strong>{responsibilities.length}</strong><small>{completedTasks} completed</small></div><button onClick={() => setTab("responsibilities")} aria-label="View tasks">›</button></article>
            <article className={styles.statCard}><span className={`${styles.statIcon} ${styles.greenIcon}`}>₹</span><div><p>Received</p><strong>{money(received)}</strong><small>Contributions collected</small></div><button onClick={() => setTab("contributions")} aria-label="View contributions">›</button></article>
            <article className={styles.statCard}><span className={`${styles.statIcon} ${styles.goldIcon}`}>◷</span><div><p>Pending</p><strong>{money(pending)}</strong><small>Contributions pending</small></div><button onClick={() => setTab("contributions")} aria-label="View pending contributions">›</button></article>
          </div>

          {tab === "overview" && <>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><span className={styles.panelIcon}>▦</span><h2>Community events</h2></div><button className={styles.textButton} onClick={() => setTab("events")}>Manage events →</button></div>
              {events.length === 0 ? <div className={styles.emptyState}><span>▦</span><strong>No events yet</strong><p>Create your first community event.</p><button className={styles.primaryButton} onClick={() => setTab("events")}>＋ Add event</button></div> :
                <div className={styles.tableWrap}><table><thead><tr><th>Event</th><th>Dates</th><th>Venue</th><th>Status</th><th>Actions</th></tr></thead><tbody>{events.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{dateRange(item)}</td><td>{item.venue || "—"}</td><td><select aria-label={`Status for ${item.name}`} value={item.status} onChange={(e) => updateEventStatus(item.id, e.target.value as EventItem["status"])}><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select></td><td className={styles.actionCell}>{isAdmin && <><button type="button" className={styles.textButton} onClick={() => startEditEvent(item)}>Edit</button><button className={styles.deleteButton} onClick={() => deleteRecord("community_events", item.id, "event")}>Delete</button></>}</td></tr>)}</tbody></table></div>}
            </section>
            <section className={styles.panel}><div className={styles.panelHeader}><div><span className={styles.panelIcon}>♧</span><h2>Responsibilities and people</h2></div><button className={styles.textButton} onClick={() => setTab("responsibilities")}>Manage tasks →</button></div><ResponsibilityTable items={responsibilities} eventName={eventName} onStatus={updateTaskStatus} onDelete={(id) => deleteRecord("event_responsibilities", id, "task")} onEdit={startEditTask} onJoin={joinResponsibility} saving={saving} isAdmin={isAdmin} /></section>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><span className={styles.panelIcon}>₹</span><h2>All contributions</h2></div><button className={styles.textButton} onClick={() => setTab("contributions")}>Manage contributions →</button></div>
              {!contributions.length ? <p className={styles.emptyText}>No contributions recorded yet.</p> : <div className={styles.tableWrap}><table><thead><tr><th>Contributor</th><th>Event</th><th>Flat</th><th>Amount</th><th>Status</th><th>Update</th></tr></thead><tbody>{contributions.map((item) => <tr key={item.id}><td><strong>{item.contributor_name}</strong></td><td>{eventName(item.event_id)}</td><td>{item.flat_no}</td><td>{money(Number(item.amount))}</td><td><span className={`${styles.badge} ${styles[item.payment_status]}`}>{item.payment_status}</span></td><td className={styles.actionCell}>{isAdmin ? <><select aria-label={`Payment status for ${item.contributor_name}`} value={item.payment_status} onChange={(e) => updateContributionStatus(item.id, e.target.value as Contribution["payment_status"])}><option value="received">Received</option><option value="pending">Pending</option></select><button className={styles.deleteButton} onClick={() => deleteRecord("community_contributions", item.id, "contribution")}>Delete</button></> : <span>{item.payment_status}</span>}</td></tr>)}</tbody></table></div>}
            </section>
          </>}

          {tab === "events" && <div className={styles.managementGrid}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><span className={styles.panelIcon}>＋</span><h2>{editingEventId !== null ? "Edit event" : "Create an event"}</h2></div></div>
              <form className={styles.form} onSubmit={addEvent}>
                <label>Event name *<input required value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} placeholder="e.g. Chhath Puja 2026" /></label>
                <label>Start date<input type="date" value={eventForm.start_date} onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value, end_date: e.target.value && eventForm.end_date && eventForm.end_date < e.target.value ? "" : eventForm.end_date })} /></label>
                <label>End date<input type="date" min={eventForm.start_date || undefined} value={eventForm.end_date} onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })} /></label>
                <label>Venue<input value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} placeholder="e.g. Society clubhouse" /></label>
                <label>Description<textarea rows={4} value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Any details people should know…" /></label>
                <button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : editingEventId !== null ? "Save changes" : "＋ Create event"}</button>
                {editingEventId !== null && <button type="button" className={styles.textButton} onClick={cancelEditEvent}>Cancel edit</button>}
              </form>
            </section>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><span className={styles.panelIcon}>▦</span><h2>All events <span className={styles.count}>{events.length}</span></h2></div></div>
              {!events.length ? <p className={styles.emptyText}>No events added yet.</p> : <div className={styles.eventList}>{events.map((item) => <article className={styles.eventItem} key={item.id}>
                <div className={styles.eventDate}><strong>{(item.start_date || item.event_date)?.slice(8, 10) || "—"}</strong><span>{(item.start_date || item.event_date) ? new Date(`${item.start_date || item.event_date}T00:00:00`).toLocaleDateString("en-IN", { month: "short" }) : "Date"}</span></div>
                <div className={styles.eventInfo}><strong>{item.name}</strong><small>{item.venue || "Venue not set"} · {dateRange(item)}</small><select aria-label={`Status for ${item.name}`} value={item.status} onChange={(e) => updateEventStatus(item.id, e.target.value as EventItem["status"])}><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select></div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {isAdmin && <><button type="button" className={styles.textButton} onClick={() => startEditEvent(item)}>Edit</button>
                  <button className={styles.deleteButton} onClick={() => deleteRecord("community_events", item.id, "event")}>Delete</button></>}
                </div>
              </article>)}</div>}
            </section>
          </div>}

          {tab === "responsibilities" && <div className={styles.managementGrid}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><span className={styles.panelIcon}>＋</span><h2>Add a task</h2></div></div>
              {!events.length ? <p className={styles.emptyText}>Create an event first, then add tasks.</p> : <form className={styles.form} onSubmit={addResponsibility}>
                <p className={styles.muted}>Anyone can add a task. Fill in only the details you know; only event and task are required.</p>
                <label>Event *<select required value={taskForm.event_id} onChange={(e) => setTaskForm({ ...taskForm, event_id: e.target.value })}><option value="">Select event</option>{events.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                <label>Task *<input required value={taskForm.task} onChange={(e) => setTaskForm({ ...taskForm, task: e.target.value })} placeholder="What needs to be done?" /></label>
                {editingTaskId !== null && <>
                  <label>Person name (optional)<input value={taskForm.person_name} onChange={(e) => setTaskForm({ ...taskForm, person_name: e.target.value })} placeholder="Responsible person's name" /></label>
                  <label>Flat number (optional)<input value={taskForm.flat_no} onChange={(e) => setTaskForm({ ...taskForm, flat_no: e.target.value })} placeholder="e.g. D-104" /></label>
                  <label>Phone number (optional)<input type="tel" value={taskForm.phone} onChange={(e) => setTaskForm({ ...taskForm, phone: e.target.value })} placeholder="Contact number" /></label>
                  <label>Status<select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as Responsibility["status"] })}><option value="assigned">Assigned</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select></label>
                </>}
                <button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : editingTaskId !== null ? "Save volunteer changes" : "＋ Create task"}</button>
                {editingTaskId !== null && <button type="button" className={styles.textButton} onClick={cancelEditTask}>Cancel edit</button>}
              </form>}
            </section>
            <section className={styles.panel}><div className={styles.panelHeader}><div><span className={styles.panelIcon}>♧</span><h2>All responsibilities</h2></div></div><ResponsibilityTable items={responsibilities} eventName={eventName} onStatus={updateTaskStatus} onDelete={(id) => deleteRecord("event_responsibilities", id, "task")} onEdit={startEditTask} onJoin={joinResponsibility} saving={saving} isAdmin={isAdmin} /></section>
          </div>}

          {tab === "contributions" && <div className={styles.managementGrid}>
            <section className={styles.panel}><div className={styles.panelHeader}><div><span className={styles.panelIcon}>＋</span><h2>Record contribution</h2></div></div>
              {!isAdmin ? <p className={styles.emptyText}>Only authorized admins can add or edit contributions.</p> : !events.length ? <p className={styles.emptyText}>Create an event first, then record contributions.</p> : <form className={styles.form} onSubmit={addContribution}>
                <label>Event *<select required value={contributionForm.event_id} onChange={(e) => setContributionForm({ ...contributionForm, event_id: e.target.value })}><option value="">Select event</option>{events.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                <label>Contributor name *<input required value={contributionForm.contributor_name} onChange={(e) => setContributionForm({ ...contributionForm, contributor_name: e.target.value })} /></label>
                <label>Flat number *<input required value={contributionForm.flat_no} onChange={(e) => setContributionForm({ ...contributionForm, flat_no: e.target.value })} /></label>
                <label>Amount (₹) *<input required type="number" min="1" step="0.01" value={contributionForm.amount} onChange={(e) => setContributionForm({ ...contributionForm, amount: e.target.value })} /></label>
                <label>Payment status<select value={contributionForm.payment_status} onChange={(e) => setContributionForm({ ...contributionForm, payment_status: e.target.value })}><option value="received">Received</option><option value="pending">Pending</option></select></label>
                <label>Payment method (optional)<input value={contributionForm.payment_method} onChange={(e) => setContributionForm({ ...contributionForm, payment_method: e.target.value })} placeholder="Cash, UPI, bank transfer…" /></label>
                <label>Payment date (optional)<input type="date" value={contributionForm.payment_date} onChange={(e) => setContributionForm({ ...contributionForm, payment_date: e.target.value })} /></label>
                <label>Notes (optional)<textarea rows={3} value={contributionForm.notes} onChange={(e) => setContributionForm({ ...contributionForm, notes: e.target.value })} /></label>
                <button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : "＋ Save contribution"}</button>
              </form>}
            </section>
            <section className={styles.panel}><div className={styles.panelHeader}><div><span className={styles.panelIcon}>₹</span><h2>Contribution register</h2></div></div>
              <div className={styles.amountTiles}><div><small>Received</small><strong>{money(received)}</strong></div><div><small>Pending</small><strong>{money(pending)}</strong></div></div>
              {!contributions.length ? <p className={styles.emptyText}>No contributions recorded yet.</p> : <div className={styles.tableWrap}><table><thead><tr><th>Contributor</th><th>Event</th><th>Flat</th><th>Amount</th><th>Status / actions</th></tr></thead><tbody>{contributions.map((item) => <tr key={item.id}>
                <td><strong>{item.contributor_name}</strong></td><td>{eventName(item.event_id)}</td><td>{item.flat_no}</td><td>{money(Number(item.amount))}</td>
                <td className={styles.actionCell}>{isAdmin ? <><select aria-label={`Payment status for ${item.contributor_name}`} value={item.payment_status} onChange={(e) => updateContributionStatus(item.id, e.target.value as Contribution["payment_status"])}><option value="received">Received</option><option value="pending">Pending</option></select><button className={styles.deleteButton} onClick={() => deleteRecord("community_contributions", item.id, "contribution")}>Delete</button></> : <span>{item.payment_status}</span>}</td>
              </tr>)}</tbody></table></div>}
            </section>
          </div>}

          <footer className={styles.footer}><span>☼</span><strong>WONDERWALL · CHHATH MAHOTSAV 2026</strong><p>Keeping our traditions alive, together.</p><small>शहर बेंगलुरु, दिल में बिहार। जय छठी मैया।</small></footer>
        </div>
      </section>
    </main>
  );
}

function ResponsibilityTable({
  items,
  eventName,
  onStatus,
  onDelete,
  onEdit,
  onJoin,
  saving,
  isAdmin,
}: {
  items: Responsibility[];
  eventName: (id: number) => string;
  onStatus: (id: number, status: Responsibility["status"]) => void;
  onDelete: (id: number) => void;
  onEdit: (item: Responsibility) => void;
  onJoin: (eventId: number, task: string, person: { person_name: string; flat_no: string; phone: string }) => void;
  saving: boolean;
  isAdmin: boolean;
}) {
  const [joiningKey, setJoiningKey] = useState<string | null>(null);
  const [joinForm, setJoinForm] = useState({ person_name: "", flat_no: "", phone: "" });

  if (!items.length) return <p className={styles.emptyText}>No responsibilities added yet.</p>;

  const groups = new Map<string, Responsibility[]>();
  items.forEach((item) => {
    const key = `${item.event_id}::${item.task.trim().toLowerCase()}`;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  });

  return <div className={styles.tableWrap}><table>
    <thead><tr><th>Task</th><th>Event</th><th>People responsible</th><th>Actions</th></tr></thead>
    <tbody>{Array.from(groups.entries()).map(([key, group]) => {
      const first = group[0];
      const volunteers = group.filter((item) => item.person_name || item.flat_no || item.phone);
      return <tr key={key}>
        <td><strong>{first.task}</strong><small className={styles.cellSub}>{volunteers.length} volunteer{volunteers.length === 1 ? "" : "s"}</small></td>
        <td>{eventName(first.event_id)}</td>
        <td>
          {volunteers.length ? volunteers.map((person) => <div key={person.id} style={{ marginBottom: 8, padding: "8px 10px", border: "1px solid #d9e5dc", borderRadius: 8, background: "#f5faf6" }}>
            <strong style={{ display: "block", color: "#174d37" }}>{person.person_name || "Name not specified"}</strong>
            <small className={styles.cellSub} style={{ display: "block", fontWeight: 600 }}>Flat: {person.flat_no || "Not specified"}</small>
            <small className={styles.cellSub} style={{ display: "block", fontWeight: 600 }}>Phone: {person.phone || "Not provided"}</small>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
              <select aria-label={`Status for ${person.person_name || first.task}`} value={person.status} onChange={(e) => onStatus(person.id, e.target.value as Responsibility["status"])}><option value="assigned">Assigned</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select>
              <button type="button" className={styles.textButton} onClick={() => onEdit(person)}>Edit</button>
              {isAdmin && <button type="button" className={styles.deleteButton} onClick={() => onDelete(person.id)}>Delete</button>}
            </div>
          </div>) : <span style={{ color: "#777" }}>No volunteers yet</span>}
          {joiningKey === key && <form onSubmit={(e) => { e.preventDefault(); onJoin(first.event_id, first.task, joinForm); setJoinForm({ person_name: "", flat_no: "", phone: "" }); setJoiningKey(null); }} style={{ marginTop: 10, padding: 12, border: "1px solid #d9e5dc", borderRadius: 8 }}>
            <strong>Join {first.task}</strong>
            <label>Your name *<input required value={joinForm.person_name} onChange={(e) => setJoinForm({ ...joinForm, person_name: e.target.value })} placeholder="Your name" /></label>
            <label>Flat number<input value={joinForm.flat_no} onChange={(e) => setJoinForm({ ...joinForm, flat_no: e.target.value })} placeholder="e.g. D-104" /></label>
            <label>Phone number<input type="tel" value={joinForm.phone} onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })} placeholder="Phone number (optional)" /></label>
            <button type="submit" className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : "Confirm join"}</button>
            <button type="button" className={styles.textButton} onClick={() => { setJoiningKey(null); setJoinForm({ person_name: "", flat_no: "", phone: "" }); }}>Cancel</button>
          </form>}
        </td>
        <td className={styles.actionCell}>
          <button type="button" className={styles.primaryButton} onClick={() => { setJoiningKey(joiningKey === key ? null : key); setJoinForm({ person_name: "", flat_no: "", phone: "" }); }}>＋ Join this task</button>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <button type="button" className={styles.textButton} onClick={() => onEdit(first)}>Edit task</button>
            {isAdmin && <button type="button" className={styles.deleteButton} onClick={async () => {
              if (!window.confirm(`Delete task "${first.task}" and all its volunteer rows? This cannot be undone.`)) return;
              const { error } = await supabase.from("event_responsibilities").delete().eq("event_id", first.event_id).eq("task", first.task);
              if (error) window.alert(error.message);
              else window.location.reload();
            }}>Delete task</button>}
          </div>
        </td>
      </tr>;
    })}</tbody>
  </table></div>;
}
