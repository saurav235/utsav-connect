"use client";

import Link from "next/link";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <span className={styles.sun} aria-hidden="true">☀</span>
        <span className={styles.brandText}>
          <strong>WONDERWALL</strong>
          <small>CHHATH MAHOTSAV 2026</small>
        </span>
      </Link>

      <nav className={styles.nav}>
        <Link href="/admin" className={styles.dashboard}>
          Dashboard
        </Link>
      </nav>
    </header>
  );
}