import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await auth.login(form);
      login(res.user, res.token);
      navigate(res.user?.role === "manufacturer" ? "/dashboard" : "/verify");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: "#f8f9fc",
    }}>
      {/* Left Panel — Branding */}
      <div style={{
        background: "linear-gradient(145deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "4rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background circles */}
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", top: -100, left: -100 }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", bottom: -80, right: -80 }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", top: "40%", left: "60%" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff" }}>
          <div style={{
            width: 72, height: 72,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: 20, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: "2rem", fontWeight: 900,
            fontFamily: "var(--font-head)",
            margin: "0 auto 2rem",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>B</div>

          <h1 style={{
            fontFamily: "var(--font-head)", fontSize: "2.5rem",
            fontWeight: 800, marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}>
            Block<span style={{ color: "#93c5fd" }}>Verify</span>
          </h1>

          <p style={{ fontSize: "1rem", opacity: 0.8, lineHeight: 1.7, maxWidth: 320, margin: "0 auto 3rem" }}>
            A decentralized product authentication platform powered by blockchain technology.
          </p>

          {/* Feature pills */}
          {["🔗 Blockchain Secured", "✅ Instant Verification", "🏭 Manufacturer Ready"].map(f => (
            <div key={f} style={{
              display: "inline-flex", alignItems: "center",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 100, padding: "0.45rem 1rem",
              fontSize: "0.8rem", margin: "0.3rem",
              backdropFilter: "blur(8px)",
            }}>{f}</div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "4rem 3rem",
      }}>
        <div style={{ width: "100%", maxWidth: 460 }}>

          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{
              fontFamily: "var(--font-head)", fontSize: "2rem",
              fontWeight: 800, color: "#0f172a",
              marginBottom: "0.5rem", letterSpacing: "-0.02em",
            }}>Welcome back 👋</h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
              Sign in to your BlockVerify account to continue
            </p>
          </div>

          {/* Form Card */}
          <div style={{
            background: "#ffffff",
            borderRadius: 20,
            padding: "2.5rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
            border: "1px solid #e2e6f0",
          }}>
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block", fontSize: "0.8rem",
                  fontWeight: 700, color: "#374151",
                  marginBottom: "0.5rem", textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute", left: "1rem", top: "50%",
                    transform: "translateY(-50%)", fontSize: "1rem",
                    pointerEvents: "none",
                  }}>✉️</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    style={{
                      width: "100%", boxSizing: "border-box", padding: "0.9rem 1rem 0.9rem 2.8rem",
                      fontSize: "0.95rem", borderRadius: 10,
                      border: "1.5px solid #e2e6f0",
                      background: "#f8f9fc",
                      color: "#0f172a",
                      outline: "none", transition: "all 0.2s",
                      fontFamily: "var(--font-mono)",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e6f0"; e.target.style.background = "#f8f9fc"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{
                    fontSize: "0.8rem", fontWeight: 700,
                    color: "#374151", textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}>Password</label>
                </div>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute", left: "1rem", top: "50%",
                    transform: "translateY(-50%)", fontSize: "1rem",
                    pointerEvents: "none",
                  }}>🔑</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                    style={{
                      width: "100%", boxSizing: "border-box", padding: "0.9rem 3rem 0.9rem 2.8rem",
                      fontSize: "0.95rem", borderRadius: 10,
                      border: "1.5px solid #e2e6f0",
                      background: "#f8f9fc",
                      color: "#0f172a",
                      outline: "none", transition: "all 0.2s",
                      fontFamily: "var(--font-mono)",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e6f0"; e.target.style.background = "#f8f9fc"; e.target.style.boxShadow = "none"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: "1rem", top: "50%",
                      transform: "translateY(-50%)",
                      background: "none", border: "none",
                      cursor: "pointer", fontSize: "0.9rem",
                      color: "#94a3b8", padding: 0,
                    }}
                  >{showPassword ? "🙈" : "👁️"}</button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  background: "rgba(220,38,38,0.06)",
                  border: "1px solid rgba(220,38,38,0.2)",
                  borderRadius: 10, padding: "0.75rem 1rem",
                  marginBottom: "1.25rem",
                  color: "#dc2626", fontSize: "0.85rem",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "1rem",
                  background: loading ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #7c3aed)",
                  color: "#fff", border: "none", borderRadius: 10,
                  fontSize: "1rem", fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
                  transition: "all 0.2s",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.45)"; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)"; }}
              >
                {loading ? "⏳ Signing in..." : "Sign In →"}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p style={{ textAlign: "center", marginTop: "1.75rem", color: "#64748b", fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
              Create one free →
            </Link>
          </p>

          <p style={{ textAlign: "center", marginTop: "2rem", color: "#94a3b8", fontSize: "0.75rem" }}>
            🔒 Secured by blockchain technology
          </p>
        </div>
      </div>
    </div>
  );
}