"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

type Story = {
  id: string;
  title: string;
  caption: string | null;
  festival: string;
  festival_year: number;
  media_type: "photo" | "video";
  media_path: string;
  contributor_name: string;
  flat_no: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type AdminAccessRequest = {
  id: string;
  user_id: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const BUCKET = "community-stories";

export default function AdminStoriesPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savingStoryId, setSavingStoryId] = useState<string | null>(null);
  const [adminRequests, setAdminRequests] = useState<AdminAccessRequest[]>([]);
  const [reviewingRequestId, setReviewingRequestId] = useState<string | null>(null);

  const loadStories = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { data: userResult, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        setError(`Could not check your login session: ${authError.message}`);
        setIsAdmin(false);
        return;
      }

      if (!userResult.user) {
        setIsAdmin(false);
        setMessage(
          "You are not signed in to Supabase in this browser. Open the admin dashboard, sign in, then return here."
        );
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userResult.user.id)
        .maybeSingle();

      if (profileError) {
        setIsAdmin(false);
        setError(
          `Could not verify your admin role: ${profileError.message}. Check the profiles SELECT policy for the signed-in user.`
        );
        return;
      }

      if (profile?.role !== "admin") {
        setIsAdmin(false);
        setMessage("Admin access is required. Sign in with an account whose public.profiles role is admin.");
        return;
      }

      setIsAdmin(true);

      const { data, error: storiesError } = await supabase
        .from("community_stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (storiesError) {
        setError(
          `Could not load stories: ${storiesError.message}. Check the community_stories SELECT policy for admins.`
        );
        return;
      }

      setStories((data ?? []) as Story[]);

      const { data: requestData, error: requestError } = await supabase
        .from("admin_access_requests")
        .select("id, user_id, reason, status, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (requestError) {
        setError(`Stories loaded, but admin access requests could not be loaded: ${requestError.message}`);
      } else {
        setAdminRequests((requestData ?? []) as AdminAccessRequest[]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error loading stories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStories();
  }, [loadStories]);

  async function reviewAdminRequest(request: AdminAccessRequest, decision: "approved" | "rejected") {
    if (!isAdmin) {
      setError("Only existing admins can review admin access requests.");
      return;
    }

    setError("");
    setMessage("");
    setReviewingRequestId(request.id);

    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) {
        setError("Your session has expired. Please sign in again.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", auth.user.id)
        .maybeSingle();

      if (profileError || profile?.role !== "admin") {
        setError("Admin permission could not be verified.");
        return;
      }

      const { error: reviewError } = await supabase.rpc("review_admin_access_request", {
        p_request_id: request.id,
        p_decision: decision,
      });

      if (reviewError) {
        setError(`Could not ${decision} this request: ${reviewError.message}`);
        return;
      }

      setMessage(
        decision === "approved"
          ? "Admin access approved. The user's role is now admin."
          : "Admin access request rejected."
      );
      await loadStories();
    } finally {
      setReviewingRequestId(null);
    }
  }

  async function updateStory(
    story: Story,
    updates: Pick<Story, "title" | "caption" | "festival" | "festival_year" | "contributor_name" | "flat_no">
  ): Promise<boolean> {
    if (!isAdmin) {
      setError("Only authorized admins can edit stories.");
      return false;
    }

    setMessage("");
    setError("");
    setSavingStoryId(story.id);

    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) {
        setError("Your session has expired. Please sign in again.");
        return false;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", auth.user.id)
        .maybeSingle();

      if (profileError || profile?.role !== "admin") {
        setError("Admin permission could not be verified. Please sign in again or contact the site admin.");
        return false;
      }

      const { error: updateError } = await supabase
        .from("community_stories")
        .update({
          title: updates.title.trim(),
          caption: updates.caption?.trim() || null,
          festival: updates.festival.trim(),
          festival_year: updates.festival_year,
          contributor_name: updates.contributor_name.trim(),
          flat_no: updates.flat_no?.trim() || null,
        })
        .eq("id", story.id);

      if (updateError) {
        setError(`Could not edit this story: ${updateError.message}`);
        return false;
      }

      setMessage("Story details updated.");
      await loadStories();
      return true;
    } finally {
      setSavingStoryId(null);
    }
  }

  async function reviewStory(story: Story, status: "approved" | "rejected") {
    if (!isAdmin) {
      setError("Only authorized admins can approve or reject stories.");
      return;
    }
    setError("");

    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) {
      setMessage("Your session has expired. Open Admin Login and sign in again.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      setError("Admin permission could not be verified.");
      return;
    }

    const { error: updateError } = await supabase
      .from("community_stories")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: auth.user.id,
      })
      .eq("id", story.id);

    if (updateError) {
      setError(`Could not update this story: ${updateError.message}`);
      return;
    }

    setMessage(status === "approved" ? "Story approved and published." : "Story rejected.");
    await loadStories();
  }

  async function deleteStory(story: Story) {
    if (!isAdmin) {
      setError("Only authorized admins can delete stories.");
      return;
    }
    if (!window.confirm(`Delete "${story.title}" and its uploaded media?`)) return;

    setMessage("");
    setError("");

    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      setError("Admin permission could not be verified.");
      return;
    }

    const { error: rowError } = await supabase
      .from("community_stories")
      .delete()
      .eq("id", story.id);

    if (rowError) {
      setError(`Could not delete story: ${rowError.message}`);
      return;
    }

    const { error: fileError } = await supabase.storage
      .from(BUCKET)
      .remove([story.media_path]);

    setMessage(
      fileError
        ? `Story deleted, but media cleanup failed: ${fileError.message}`
        : "Story and media deleted."
    );

    await loadStories();
  }

  const pending = stories.filter((story) => story.status === "pending");
  const reviewed = stories.filter((story) => story.status !== "pending");

  if (loading) {
    return (
      <main style={shell}>
        <h1 style={heading}>Our Stories review</h1>
        <p style={muted}>Checking your login and loading submissions…</p>
      </main>
    );
  }

  return (
    <main style={shell}>
      <header style={header}>
        <div>
          <p style={eyebrow}>WONDERWALL · COMMUNITY DASHBOARD</p>
          <h1 style={heading}>Our Stories review</h1>
          <p style={muted}>
            Approve resident memories before they appear in the public gallery.
          </p>
        </div>
        <nav style={nav}>
          <Link href="/admin" style={link}>← Dashboard / Sign in</Link>
          <Link href="/stories" style={link}>Public gallery ↗</Link>
        </nav>
      </header>

      {message && <p role="status" style={notice}>{message}</p>}
      {error && <p role="alert" style={errorNotice}>{error}</p>}

      {!isAdmin ? (
        <section style={panel}>
          <h2 style={subheading}>Admin access required</h2>
          <p style={muted}>
            Sign in using Admin Login. Only accounts with role = "admin" in
            {" "}public.profiles can review or manage community stories.
          </p>
          <button style={secondaryButton} onClick={() => void loadStories()}>
            Check again
          </button>
        </section>
      ) : (
        <>
          <section style={panel}>
            <h2 style={subheading}>
              Admin access requests <span style={pill}>{adminRequests.length}</span>
            </h2>
            <p style={muted}>
              Review requests from registered users. Approving a request changes that user’s role to admin.
            </p>
            {adminRequests.length === 0 ? (
              <p style={muted}>No pending admin access requests.</p>
            ) : (
              <div style={grid}>
                {adminRequests.map((request) => (
                  <article key={request.id} style={card}>
                    <div style={{ padding: 16 }}>
                      <div style={cardTitleRow}>
                        <strong>Admin access request</strong>
                        <span style={statusBadge("pending")}>pending</span>
                      </div>
                      <p style={small}>User ID: {request.user_id}</p>
                      <p style={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{request.reason}</p>
                      <p style={small}>
                        Submitted {new Date(request.created_at).toLocaleString()}
                      </p>
                      <div style={actions}>
                        <button
                          type="button"
                          style={approve}
                          disabled={reviewingRequestId === request.id}
                          onClick={() => void reviewAdminRequest(request, "approved")}
                        >
                          {reviewingRequestId === request.id ? "Processing…" : "Approve admin"}
                        </button>
                        <button
                          type="button"
                          style={reject}
                          disabled={reviewingRequestId === request.id}
                          onClick={() => void reviewAdminRequest(request, "rejected")}
                        >
                          Reject request
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section style={panel}>
            <h2 style={subheading}>
              Pending review <span style={pill}>{pending.length}</span>
            </h2>
            {pending.length === 0 ? (
              <p style={muted}>No submissions waiting for review.</p>
            ) : (
              <div style={grid}>
                {pending.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onReview={reviewStory}
                    onDelete={deleteStory}
                    onSaveEdit={updateStory}
                    saving={savingStoryId === story.id}
                  />
                ))}
              </div>
            )}
          </section>

          <section style={panel}>
            <h2 style={subheading}>
              Previously reviewed <span style={pill}>{reviewed.length}</span>
            </h2>
            {reviewed.length === 0 ? (
              <p style={muted}>Reviewed stories will appear here.</p>
            ) : (
              <div style={grid}>
                {reviewed.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onReview={reviewStory}
                    onDelete={deleteStory}
                    onSaveEdit={updateStory}
                    saving={savingStoryId === story.id}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

function StoryCard({
  story,
  onReview,
  onDelete,
  onSaveEdit,
  saving,
}: {
  story: Story;
  onReview: (story: Story, status: "approved" | "rejected") => void | Promise<void>;
  onDelete: (story: Story) => void | Promise<void>;
  onSaveEdit: (
    story: Story,
    updates: Pick<Story, "title" | "caption" | "festival" | "festival_year" | "contributor_name" | "flat_no">
  ) => Promise<boolean>;
  saving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: story.title,
    caption: story.caption ?? "",
    festival: story.festival,
    festival_year: String(story.festival_year),
    contributor_name: story.contributor_name,
    flat_no: story.flat_no ?? "",
  });
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(story.media_path);

  return (
    <article style={card}>
      <div style={media}>
        {story.media_type === "video" ? (
          <video
            src={data.publicUrl}
            controls
            playsInline
            preload="metadata"
            style={mediaContent}
          />
        ) : (
          <img src={data.publicUrl} alt={story.title} style={mediaContent} />
        )}
      </div>
      <div style={{ padding: 16 }}>
        <div style={cardTitleRow}>
          <strong>{story.title}</strong>
          <span style={statusBadge(story.status)}>{story.status}</span>
        </div>
        <p style={muted}>{story.festival} · {story.festival_year}</p>
        {story.caption && <p style={captionStyle}>{story.caption}</p>}
        <p style={small}>
          Submitted by {story.contributor_name}
          {story.flat_no ? ` · ${story.flat_no}` : ""}
        </p>

        {editing && (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const year = Number(editForm.festival_year);
              if (!Number.isInteger(year) || year < 1900 || year > 2200) {
                window.alert("Enter a valid festival year.");
                return;
              }
              const saved = await onSaveEdit(story, {
                title: editForm.title,
                caption: editForm.caption || null,
                festival: editForm.festival,
                festival_year: year,
                contributor_name: editForm.contributor_name,
                flat_no: editForm.flat_no || null,
              });
              if (saved) setEditing(false);
            }}
            style={{ display: "grid", gap: 8, marginTop: 12 }}
          >
            <label>Title<input required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></label>
            <label>Festival<input required value={editForm.festival} onChange={(e) => setEditForm({ ...editForm, festival: e.target.value })} /></label>
            <label>Festival year<input required type="number" min="1900" max="2200" value={editForm.festival_year} onChange={(e) => setEditForm({ ...editForm, festival_year: e.target.value })} /></label>
            <label>Contributor name<input required value={editForm.contributor_name} onChange={(e) => setEditForm({ ...editForm, contributor_name: e.target.value })} /></label>
            <label>Flat number<input value={editForm.flat_no} onChange={(e) => setEditForm({ ...editForm, flat_no: e.target.value })} /></label>
            <label>Caption<textarea rows={3} value={editForm.caption} onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })} /></label>
            <div style={actions}>
              <button type="submit" style={approve} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
              <button type="button" style={secondaryButton} onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
            </div>
          </form>
        )}

        <div style={actions}>
          {!editing && <button type="button" style={secondaryButton} onClick={() => {
            setEditForm({
              title: story.title,
              caption: story.caption ?? "",
              festival: story.festival,
              festival_year: String(story.festival_year),
              contributor_name: story.contributor_name,
              flat_no: story.flat_no ?? "",
            });
            setEditing(true);
          }}>Edit story</button>}
          {story.status !== "approved" && (
            <button style={approve} onClick={() => void onReview(story, "approved")}>
              Approve & publish
            </button>
          )}
          {story.status !== "rejected" && (
            <button style={reject} onClick={() => void onReview(story, "rejected")}>
              Reject
            </button>
          )}
          <button style={deleteButton} onClick={() => void onDelete(story)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

const shell: React.CSSProperties = {
  minHeight: "100vh",
  background: "#fbf8ef",
  color: "#24382c",
  padding: "clamp(20px, 5vw, 64px)",
  fontFamily: "Arial, Helvetica, sans-serif",
};
const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 24,
  flexWrap: "wrap",
  marginBottom: 28,
};
const nav: React.CSSProperties = { display: "flex", gap: 16, flexWrap: "wrap" };
const eyebrow: React.CSSProperties = {
  color: "#9a762c",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: ".16em",
};
const heading: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: "clamp(32px, 5vw, 48px)",
  fontWeight: 500,
  margin: "8px 0",
};
const muted: React.CSSProperties = { color: "#6b756a", fontSize: 13, lineHeight: 1.7 };
const link: React.CSSProperties = { color: "#254733", fontWeight: 700, fontSize: 13 };
const notice: React.CSSProperties = {
  background: "#f4edda",
  padding: 14,
  borderRadius: 6,
  fontSize: 13,
  lineHeight: 1.6,
  overflowWrap: "anywhere",
};
const errorNotice: React.CSSProperties = {
  background: "#fbe9e7",
  color: "#8a2e28",
  border: "1px solid #e8c3bf",
  padding: 14,
  borderRadius: 6,
  fontSize: 13,
  lineHeight: 1.6,
  overflowWrap: "anywhere",
};
const panel: React.CSSProperties = {
  background: "#fffdf8",
  border: "1px solid #e5dcc8",
  borderRadius: 10,
  padding: 22,
  marginTop: 22,
};
const subheading: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontWeight: 500,
  fontSize: 26,
  marginTop: 0,
};
const pill: React.CSSProperties = {
  fontFamily: "Arial",
  fontSize: 12,
  background: "#efe5cc",
  padding: "5px 9px",
  borderRadius: 20,
};
const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
  gap: 18,
};
const card: React.CSSProperties = {
  border: "1px solid #e6dfcf",
  borderRadius: 9,
  overflow: "hidden",
  background: "#fffefa",
};
const media: React.CSSProperties = { height: 220, background: "#eee7d8" };
const mediaContent: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};
const cardTitleRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 8,
  alignItems: "center",
};
const captionStyle: React.CSSProperties = { lineHeight: 1.6 };
const small: React.CSSProperties = { fontSize: 11, color: "#737e72" };
const actions: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 14,
};
const approve: React.CSSProperties = {
  background: "#245039",
  color: "white",
  border: 0,
  borderRadius: 5,
  padding: "10px 12px",
  fontWeight: 700,
  cursor: "pointer",
};
const reject: React.CSSProperties = {
  background: "#f2e5cf",
  color: "#70451e",
  border: 0,
  borderRadius: 5,
  padding: "10px 12px",
  fontWeight: 700,
  cursor: "pointer",
};
const deleteButton: React.CSSProperties = {
  background: "#fff",
  color: "#963f37",
  border: "1px solid #e3c5c0",
  borderRadius: 5,
  padding: "10px 12px",
  fontWeight: 700,
  cursor: "pointer",
};
const secondaryButton: React.CSSProperties = {
  background: "#245039",
  color: "white",
  border: 0,
  borderRadius: 5,
  padding: "10px 12px",
  fontWeight: 700,
  cursor: "pointer",
};
const statusBadge = (status: Story["status"]): React.CSSProperties => ({
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: ".08em",
  fontWeight: 800,
  borderRadius: 20,
  padding: "5px 8px",
  background: status === "approved" ? "#e1efe1" : status === "rejected" ? "#f8e4e1" : "#f5edcf",
  color: status === "approved" ? "#2b653b" : status === "rejected" ? "#963f37" : "#82631f",
});