"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Please use a password with at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { display_name: displayName.trim() },
          emailRedirectTo: typeof window !== "undefined"
            ? `${window.location.origin}/admin`
            : undefined,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        setMessage("Your account has been created. You can now request admin access from the dashboard.");
        router.replace("/admin");
        router.refresh();
        return;
      }

      setMessage("Account created. Check your email to confirm your address, then sign in to access the dashboard and request admin access.");
    } catch (err) {
      console.error("Registration failed:", err);
      setError("We couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    boxSizing: "border-box" as const,
    width: "100%",
    padding: "13px",
    marginBottom: "18px",
    border: "1px solid #d9d2c3",
    borderRadius: "8px",
    fontSize: "15px",
    background: "#fff",
  };
  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "#26392f",
    fontWeight: 600 as const,
    fontSize: "14px",
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "#fbf5e8", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <section style={{ width: "100%", maxWidth: "460px", padding: "36px", border: "1px solid #e9dfcc", borderRadius: "16px", background: "#fffdf8", boxShadow: "0 12px 36px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div aria-hidden="true" style={{ color: "#b78b39", fontSize: "42px", marginBottom: "8px" }}>☼</div>
          <h1 style={{ margin: "0 0 8px", color: "#155a46", fontFamily: 'Georgia, "Times New Roman", serif', fontSize: "28px" }}>Create your account</h1>
          <p style={{ margin: 0, color: "#68736a", lineHeight: 1.6 }}>Wonderwall · Chhath Mahotsav 2026</p>
        </div>

        <form onSubmit={handleRegister}>
          <label htmlFor="displayName" style={labelStyle}>Full name</label>
          <input id="displayName" autoComplete="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Enter your name" required maxLength={100} style={inputStyle} />

          <label htmlFor="email" style={labelStyle}>Email address</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />

          <label htmlFor="password" style={labelStyle}>Password</label>
          <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8} style={inputStyle} />

          <label htmlFor="confirmPassword" style={labelStyle}>Confirm password</label>
          <input id="confirmPassword" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required minLength={8} style={inputStyle} />

          <p style={{ margin: "0 0 18px", color: "#68736a", fontSize: "13px", lineHeight: 1.5 }}>Registration gives you a regular account. Admin access requires a separate request and approval by an existing admin.</p>

          {error && <p role="alert" style={{ padding: "12px", margin: "0 0 18px", borderRadius: "8px", background: "#fff0ed", color: "#a52a2a", fontSize: "14px", lineHeight: 1.5 }}>{error}</p>}
          {message && <p role="status" style={{ padding: "12px", margin: "0 0 18px", borderRadius: "8px", background: "#edf8ef", color: "#155a46", fontSize: "14px", lineHeight: 1.5 }}>{message}</p>}

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", border: "none", borderRadius: "8px", background: loading ? "#68736a" : "#155a46", color: "#fffdf5", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Creating account…" : "Register"}</button>
        </form>

        <p style={{ textAlign: "center", margin: "22px 0 0", color: "#68736a", fontSize: "14px" }}>Already registered? <Link href="/admin/login" style={{ color: "#155a46", fontWeight: 700, textDecoration: "none" }}>Sign in</Link></p>
        <div style={{ textAlign: "center", marginTop: "16px" }}><Link href="/" style={{ color: "#155a46", fontSize: "14px", textDecoration: "none" }}>← Back to homepage</Link></div>
      </section>
    </main>
  );
}
