"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { supabase } from "../lib/supabase";

const rituals = [
  {
    title: "Nahay Khay",
    image: "/chhath-day-1-nahay-khay.png",
    alt: "Traditional meal prepared for Nahay Khay",
    day: "DAY 01",
    date: "13 November 2026",
    description:
      "The first day begins with a holy bath and the cleaning of the home and the path to the ghat. Devotees prepare a simple, sattvik meal, traditionally including lauki (bottle gourd), chana dal and rice, and offer it as bhog. This day marks the beginning of the vrat with purity and discipline.",
    icon: "♨",
  },
  {
    title: "Kharna",
    image: "/chhath-day-2-kharna.png",
    alt: "Traditional Kharna prasad",
    day: "DAY 02",
    date: "14 November 2026",
    description:
      "On Kharna, devotees fast through the day. In the evening, after worship, they prepare and offer gur ki kheer (jaggery-sweetened rice pudding) and roti. The prasad is shared with family and others, after which the devotee begins the more rigorous period of fasting associated with Chhath.",
    icon: "❧",
  },
  {
    title: "Sandhya Arghya",
    image: "/chhath-day-3-sandhya-arghya.png",
    alt: "Devotees offering arghya to the setting Sun",
    day: "DAY 03",
    date: "15 November 2026",
    description:
      "Families prepare thekua, kasar, seasonal fruits and other offerings, arranged in bamboo baskets or soop. At sunset, devotees gather at a river, pond or other suitable water body and offer arghya to the setting Sun. Chhath songs and family prayers make this evening the festival's central public gathering.",
    icon: "☼",
  },
  {
    title: "Usha Arghya",
    image: "/chhath-day-4-usha-arghya.png",
    alt: "Devotees offering arghya to the rising Sun",
    day: "DAY 04",
    date: "16 November 2026",
    description:
      "Before sunrise, devotees return to the ghat to offer arghya to the rising Sun. They pray for the well-being of their children and family, and for peace and prosperity. The fast concludes with Paran (Parana), when devotees break their fast after the morning rituals and offerings.",
    icon: "☀",
  },
];

const MUSIC_TRACKS = [
  "/audio/chhath-instrumental.mp3",
  "/audio/chhath-song-5.mp3",
  "/audio/chhath-song-4.mp3",
  "/audio/chhath-song-3.mp3",
  "/audio/chhath-song-2.mp3",
];

function chooseRandomTrack(currentTrack?: string) {
  const choices = MUSIC_TRACKS.filter((track) => track !== currentTrack);
  const pool = choices.length > 0 ? choices : MUSIC_TRACKS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function HomePage() {
  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(MUSIC_TRACKS[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();
      if (mounted) {
        setIsLoggedIn(!error && Boolean(data.session));
        setAuthLoading(false);
      }
    }

    void loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setIsLoggedIn(Boolean(session));
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleAuthAction() {
    closeMenu();
    setAuthMessage("");

    if (!isLoggedIn) {
      window.location.href = "/admin/login";
      return;
    }

    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthMessage(`Unable to log out: ${error.message}`);
      setLoggingOut(false);
      return;
    }
    setIsLoggedIn(false);
    setLoggingOut(false);
    window.location.href = "/";
  }

  // Pick a random track when the homepage opens.
  useEffect(() => {
    setCurrentTrack(chooseRandomTrack());
  }, []);

  // Attempt to play the selected track. Browsers may block autoplay until
  // the visitor interacts with the page.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.2;
    const playPromise = audio.play();

    if (playPromise) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    return () => {
      audio.pause();
    };
  }, [currentTrack]);

  function playNextRandomTrack() {
    setCurrentTrack((current) => chooseRandomTrack(current));
  }

  // Play or pause the background music
  async function toggleMusic() {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Unable to play Chhath music:", error);
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  return (
    <main className={styles.page}>
      {/* Chhath background music */}
      <audio
        ref={audioRef}
        src={currentTrack}
        preload="auto"
        onEnded={playNextRandomTrack}
      />

      {/* Floating music button */}
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        title={isPlaying ? "Pause music" : "Play music"}
        style={{
          position: "fixed",
          right: "22px",
          bottom: "22px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "9px",
          padding: "12px 18px",
          border: "1px solid #e7c66a",
          borderRadius: "30px",
          background: "#123d32",
          color: "#fff8e9",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 600,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}
      >
        <span aria-hidden="true">{isPlaying ? "Ⅱ" : "♫"}</span>
        {isPlaying ? "Pause Music" : "Play Chhath Music"}
      </button>

      {/* Header */}
      <header className={styles.header}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="Wonderwall Chhath Mahotsav 2026 home"
          onClick={closeMenu}
        >
          <span className={styles.brandIcon} aria-hidden="true">
            ☼
          </span>

          <span className={styles.brandText}>
            <strong>WONDERWALL</strong>
            <small>CHHATH MAHOTSAV 2026</small>
          </span>
        </Link>

        <nav
          id="main-navigation"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
          aria-label="Main navigation"
        >
          <Link
            className={styles.dashboardLink}
            href="/admin"
            onClick={closeMenu}
          >
            My Contributions &amp; Activities
          </Link>
          <Link href="/culture" onClick={closeMenu}>
            Chhath Puja Schedule &amp; Activities
          </Link>
          <Link href="/stories" onClick={closeMenu}>
            Memories &amp; Moments
          </Link>
          {!authLoading && (
            <button
              type="button"
              className={styles.adminLoginLink}
              onClick={handleAuthAction}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out…" : isLoggedIn ? "Logout" : "Admin Login"}
            </button>
          )}
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      {authMessage ? (
        <p role="alert" style={{ margin: 0, padding: "10px 5%", background: "#fff0ec", color: "#8d2e22" }}>
          {authMessage}
        </p>
      ) : null}

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            WONDERWALL PRESENTS · OUR CULTURE, OUR PRIDE
          </p>

          <h1>
            CHHATH PUJA <span>2026</span>
          </h1>

          <div className={styles.sunDivider} aria-hidden="true">
            <span />
            ☼
            <span />
          </div>

          <h2>आस्था, परंपरा और प्रकृति का महापर्व</h2>

          <p className={styles.heroDescription}>
            Chhath is an ancient four-day festival dedicated to Surya Dev,
            the Sun God, and Chhathi Maiya. Devotees express gratitude for
            the life and energy the Sun gives, while praying for the health
            and well-being of their families through fasting, purity, and
            offerings at sunrise and sunset.
          </p>

          <a className={styles.exploreButton} href="#sacred-days">
            Explore the festival <span>↓</span>
          </a>
        </div>

        <p className={styles.heroCaption}>जय छठी मैया</p>
      </section>

      {/* Meaning of Chhath */}
      <section
        className={styles.introSection}
        aria-labelledby="meaning-heading"
      >
        <div className={styles.introCopy}>
          <p className={styles.sectionEyebrow}>THE MEANING OF CHHATH</p>

          <h2 id="meaning-heading">
            A celebration of gratitude, purity and family
          </h2>

          <p>
            Chhath Puja is observed especially across Bihar, Jharkhand,
            eastern Uttar Pradesh and parts of Nepal, and by communities
            around the world. Worship is offered to Surya Dev and Chhathi
            Maiya as devotees give thanks for life on Earth and pray for
            the well-being of their loved ones.
          </p>

          <p>
            The festival is known for its discipline and simplicity.
            Devotees observe ritual bathing and fasting, prepare traditional
            vegetarian prasad, and make offerings to both the setting and
            rising Sun. Thekua, seasonal fruits, sugarcane and other
            offerings are commonly arranged in bamboo baskets or soop.
          </p>

          <p className={styles.introHindi}>
            नहाय-खाय से उषा अर्घ्य तक — छठ महापर्व आस्था, संयम, स्वच्छता
            और प्रकृति के प्रति कृतज्ञता का संदेश देता है।
          </p>
        </div>

        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <span aria-hidden="true">☼</span>
            <strong>Surya Dev</strong>
            <small>Gratitude to the source of life and energy</small>
          </div>

          <div className={styles.valueCard}>
            <span aria-hidden="true">✧</span>
            <strong>Chhathi Maiya</strong>
            <small>Prayers for family and children's well-being</small>
          </div>

          <div className={styles.valueCard}>
            <span aria-hidden="true">♧</span>
            <strong>Purity &amp; discipline</strong>
            <small>Fasting, cleanliness and simple offerings</small>
          </div>
        </div>
      </section>

      {/* Four sacred days */}
      <section id="sacred-days" className={styles.sacredSection}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionEyebrow}>
            THE FOUR-DAY RITUAL JOURNEY
          </p>

          <h2>All four sacred days</h2>

          <div className={styles.smallSun} aria-hidden="true">
            ────── ☼ ──────
          </div>

          <p>Each day has its own rituals, offerings and meaning.</p>
        </div>

        <div className={styles.ritualGrid}>
          {rituals.map((ritual, index) => (
            <article className={styles.ritualCard} key={ritual.title}>
              <div className={styles.ritualImageWrap}>
                <img
                  src={ritual.image}
                  alt={ritual.alt}
                  className={styles.ritualImage}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>

              <div className={styles.ritualBody}>
                <span className={styles.ritualIcon} aria-hidden="true">
                  {ritual.icon}
                </span>

                <div className={styles.ritualText}>
                  <span className={styles.dayLabel}>{ritual.day} · {ritual.date}</span>
                  <h3>{ritual.title}</h3>
                  <p>{ritual.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.offeringsNote}>
          <h3>Traditional offerings of Chhath</h3>

          <p>
            Offerings often include <strong>thekua</strong>,{" "}
            <strong>kasar</strong>, seasonal fruits, sugarcane and other
            simple vegetarian prasad. Recipes and customs can vary by
            family and region; purity, devotion and gratitude remain at
            the heart of the observance.
          </p>
        </div>

        <div className={styles.closingNote}>
          <span aria-hidden="true">✦</span>
          <p>
            Tradition in our hearts. Gratitude in every offering.
            Together in devotion.
          </p>
          <strong>जय छठी मैया</strong>
        </div>
      </section>

    </main>
  );
}
