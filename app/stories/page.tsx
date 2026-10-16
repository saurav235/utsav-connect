"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import styles from "./stories.module.css";

type Story = {
  id: string;
  title: string;
  caption: string;
  festival: "Chhath Puja" | "Durga Puja" | "Other";
  festival_year: number;
  media_type: "photo" | "video";
  media_path: string;
  contributor_name: string;
  created_at: string;
};

const BUCKET = "community-stories";
const MAX_FILE_BYTES = 50 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [festival, setFestival] = useState<Story["festival"]>("Chhath Puja");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [contributor, setContributor] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function loadStories() {
    setLoading(true);

    const { data, error } = await supabase
      .from("community_stories")
      .select(
        "id,title,caption,festival,festival_year,media_type,media_path,contributor_name,created_at"
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(`Unable to load stories: ${error.message}`);
      setStories([]);
    } else {
      setStories((data ?? []) as Story[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadStories();
  }, []);

  async function submitStory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!file) {
      setMessage("Please choose a photo or video to submit.");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage("Choose a JPG, PNG, WEBP, GIF, MP4, WEBM or MOV file.");
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setMessage("File must be 50 MB or smaller.");
      return;
    }

    setSubmitting(true);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
      const mediaPath = `submissions/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(mediaPath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        setMessage(`Upload failed: ${uploadError.message}`);
        return;
      }

      const mediaType = file.type.startsWith("video/") ? "video" : "photo";

      const { error: insertError } = await supabase
        .from("community_stories")
        .insert({
          title: title.trim(),
          caption: caption.trim(),
          festival,
          festival_year: Number(year),
          media_type: mediaType,
          media_path: mediaPath,
          contributor_name: contributor.trim(),
          flat_no: flatNo.trim() || null,
          status: "pending",
        });

      if (insertError) {
        // The uploaded object is not referenced by a story if the insert fails.
        // An administrator can clean it up later.
        setMessage(
          `Your file uploaded, but the submission could not be saved: ${insertError.message}`
        );
      } else {
        setMessage(
          "Thank you! Your memory has been submitted and is waiting for admin approval."
        );
        setTitle("");
        setCaption("");
        setContributor("");
        setFlatNo("");
        setFile(null);

        const input = document.getElementById(
          "story-media"
        ) as HTMLInputElement | null;
        if (input) input.value = "";
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Submission failed: ${error.message}`
          : "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Wonderwall home">
          <span className={styles.sun} aria-hidden="true">
            ☼
          </span>
          <span className={styles.brandText}>
            <strong>WONDERWALL</strong>
            <small>CHHATH MAHOTSAV 2026</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/admin">My Contributions &amp; Activities</Link>
          <Link href="/culture">Chhath Puja Schedule &amp; Activities</Link>
          <Link href="/stories" aria-current="page">
            Memories &amp; Moments
          </Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>OUR CULTURE · OUR COMMUNITY · OUR PRIDE</p>
        <h1>Memories &amp; Moments</h1>
        <p>
          Every photo holds a memory. Every celebration brings us closer. Share
          your favourite moments from our community festivals.
        </p>
        <a href="#share-memory" className={styles.primaryLink}>
          Share a memory ↓
        </a>
      </section>

      <section className={styles.gallerySection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>MEMORIES WE SHARE</p>
            <h2>Celebrations through our eyes</h2>
          </div>
          <span className={styles.count}>
            {stories.length} {stories.length === 1 ? "memory" : "memories"}
          </span>
        </div>

        {loading ? (
          <p className={styles.notice}>Loading community memories…</p>
        ) : null}

        {!loading && stories.length === 0 ? (
          <div className={styles.empty}>
            <span aria-hidden="true">☼</span>
            <h3>The gallery is waiting for its first memories</h3>
            <p>
              Be the first to share a photo or video. Submissions appear here
              after admin approval.
            </p>
          </div>
        ) : null}

        <div className={styles.gallery}>
          {stories.map((story) => {
            const { data } = supabase.storage
              .from(BUCKET)
              .getPublicUrl(story.media_path);

            return (
              <article className={styles.card} key={story.id}>
                <div className={styles.media}>
                  {story.media_type === "video" ? (
                    <video
                      src={data.publicUrl}
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <a
                      href={data.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open photo: ${story.title}`}
                    >
                      <img
                        src={data.publicUrl}
                        alt={story.title}
                        loading="lazy"
                      />
                    </a>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.meta}>
                    <span>{story.festival}</span>
                    <span>{story.festival_year}</span>
                  </div>
                  <h3>{story.title}</h3>
                  {story.caption ? <p>{story.caption}</p> : null}
                  <small>Shared by {story.contributor_name}</small>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.submitSection} id="share-memory">
        <div className={styles.submitIntro}>
          <p className={styles.eyebrow}>YOUR MOMENT MATTERS</p>
          <h2>Be part of our story</h2>
          <p>
            Upload a photo or video from a community celebration. Our admin
            team will review it before it becomes visible in the public gallery.
          </p>
          <ul>
            <li>Photos and videos up to 50 MB</li>
            <li>JPG, PNG, WEBP, GIF, MP4, WEBM or MOV</li>
            <li>Your submission stays pending until approved</li>
          </ul>
        </div>

        <form className={styles.form} onSubmit={submitStory}>
          <label>
            Memory title
            <input
              required
              minLength={3}
              maxLength={120}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Chhath evening at the ghat"
            />
          </label>

          <div className={styles.twoCols}>
            <label>
              Festival
              <select
                value={festival}
                onChange={(event) =>
                  setFestival(event.target.value as Story["festival"])
                }
              >
                <option>Chhath Puja</option>
                <option>Durga Puja</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Year
              <input
                required
                type="number"
                min="2000"
                max="2100"
                value={year}
                onChange={(event) => setYear(event.target.value)}
              />
            </label>
          </div>

          <label>
            Caption (optional)
            <textarea
              maxLength={1200}
              rows={3}
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Tell us a little about this moment…"
            />
          </label>

          <label>
            Your name
            <input
              required
              maxLength={100}
              value={contributor}
              onChange={(event) => setContributor(event.target.value)}
              placeholder="Name"
            />
          </label>

          <label>
            Flat number (optional)
            <input
              maxLength={30}
              value={flatNo}
              onChange={(event) => setFlatNo(event.target.value)}
              placeholder="e.g. D-104"
            />
          </label>

          <label>
            Choose photo or video
            <input
              id="story-media"
              required
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>

          {message ? (
            <p className={styles.notice} role="status">
              {message}
            </p>
          ) : null}

          <button className={styles.submitButton} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit for approval"}
          </button>
          <small className={styles.privacy}>
            Submissions are reviewed before appearing in the gallery.
          </small>
        </form>
      </section>

      <footer className={styles.footer}>
        ☼ <span>WONDERWALL · CHHATH MAHOTSAV 2026</span>
      </footer>
    </main>
  );
}
