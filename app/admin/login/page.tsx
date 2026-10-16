"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      if (!data.user) {
        setError("Unable to verify your account. Please try again.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) {
        await supabase.auth.signOut();
        setError("Unable to verify admin permissions. Please try again.");
        return;
      }

      if (!profile) {
        setError("Your account profile is not ready yet. Please try again in a moment or contact the site administrator.");
        return;
      }

      // Both regular users and admins can access the community dashboard.
      // Admin-only controls remain conditional on profiles.role === "admin".
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      console.error("Admin login failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#fbf5e8",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "430px",
          padding: "36px",
          border: "1px solid #e9dfcc",
          borderRadius: "16px",
          background: "#fffdf8",
          boxShadow: "0 12px 36px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              color: "#b78b39",
              fontSize: "42px",
              marginBottom: "8px",
            }}
            aria-hidden="true"
          >
            ☼
          </div>

          <h1
            style={{
              margin: "0 0 8px",
              color: "#155a46",
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: "28px",
            }}
          >
            Sign in to Wonderwall
          </h1>

          <p style={{ margin: 0, color: "#68736a", lineHeight: 1.6 }}>
            Wonderwall · Chhath Mahotsav 2026
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#26392f",
              fontWeight: 600,
            }}
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            required
            style={{
              boxSizing: "border-box",
              width: "100%",
              padding: "13px",
              marginBottom: "20px",
              border: "1px solid #d9d2c3",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          />

          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#26392f",
              fontWeight: 600,
            }}
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            style={{
              boxSizing: "border-box",
              width: "100%",
              padding: "13px",
              marginBottom: "18px",
              border: "1px solid #d9d2c3",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          />

          {error && (
            <p
              role="alert"
              style={{
                padding: "12px",
                margin: "0 0 18px",
                borderRadius: "8px",
                background: "#fff0ed",
                color: "#a52a2a",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "8px",
              background: loading ? "#68736a" : "#155a46",
              color: "#fffdf5",
              fontSize: "15px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", margin: "22px 0 0", color: "#68736a", fontSize: "14px" }}>
          New to Wonderwall?{" "}
          <Link href="/admin/register" style={{ color: "#155a46", fontWeight: 700, textDecoration: "none" }}>Create an account</Link>
        </p>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Link href="/" style={{ color: "#155a46", fontSize: "14px", textDecoration: "none" }}>← Back to homepage</Link>
        </div>
      </section>
    </main>
  );
}
