import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { connectWallet } from "../utils/blockchain";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer", company: "", walletAddress: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    try {
      const addr = await connectWallet();
      setForm(f => ({ ...f, walletAddress: addr }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.role === "manufacturer" && !form.walletAddress) {
      return setError("Manufacturers must connect a wallet.");
    }
    setLoading(true);
    try {
      const res = await auth.register(form);
      login(res.user, res.token);
      navigate(form.role === "manufacturer" ? "/dashboard" : "/verify");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isManufacturer = form.role === "manufacturer";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 500,
      }}>

        {/* Logo + Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 60, height: 60,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.6rem", fontWeight: 900,
            fontFamily: "var(--font-head)",
            margin: "0 auto 1rem",
            border: "1px solid rgba(255,255,255,0.25)",
          }}>B</div>
          <h1 style={{
            fontFamily: "var(--font-head)", fontSize: "1.9rem",
            fontWeight: 800, color: "#fff",
            marginBottom: "0.4rem", letterSpacing: "-0.02em",
          }}>Create your account 🚀</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
            Join the BlockVerify network today — it's free
          </p>
        </div>

        {/* Role Toggle */}
        <div style={{
          display: "flex", gap: "0.5rem",
          background: "rgba(255,255,255,0.1)",
          padding: "0.35rem", borderRadius: 12,
          marginBottom: "1.25rem",
          border: "1px solid rgba(255,255,255,0.15)",
        }}>
          {[
            { value: "customer", label: "👤 Customer" },
            { value: "manufacturer", label: "🏭 Manufacturer" },
          ].map(opt => (
            <button key={opt.value} type="button"
              onClick={() => setForm(f => ({ ...f, role: opt.value }))}
              style={{
                flex: 1, padding: "0.65rem",
                borderRadius: 9,
                background: form.role === opt.value ? "#ffffff" : "transparent",
                color: form.role === opt.value ? "#2563eb" : "rgba(255,255,255,0.8)",
                fontWeight: form.role === opt.value ? 700 : 500,
                border: "none", cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "var(--font-mono)", fontSize: "0.85rem",
                boxShadow: form.role === opt.value ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
              }}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: "2rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}>
          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <Field label="Full Name" icon="👤">
              <input
                placeholder="Mahmood Sayed"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>

            {/* Email */}
            <Field label="Email Address" icon="✉️">
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </Field>

            {/* Password */}
            <Field label="Password" icon="🔑">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required minLength={6}
                style={{ paddingRight: "3rem" }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "0.9rem", top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", fontSize: "0.9rem",
                  color: "#94a3b8", padding: 0,
                }}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </Field>

            {/* Manufacturer-only fields */}
            {isManufacturer && (
              <>
                <Field label="Company Name" icon="🏭">
                  <input
                    placeholder="Acme Corp Ltd."
                    value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    required
                  />
                </Field>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{
                    display: "block", fontSize: "0.78rem", fontWeight: 700,
                    color: "#374151", marginBottom: "0.45rem",
                    textTransform: "uppercase", letterSpacing: "0.07em",
                  }}>Wallet Address</label>
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                    <div style={{
                      flex: 1, position: "relative",
                      display: "flex", alignItems: "center",
                    }}>
                      <span style={{
                        position: "absolute", left: "0.9rem",
                        fontSize: "0.95rem", pointerEvents: "none", zIndex: 1,
                      }}>💼</span>
                      <input
                        placeholder="Click Connect →"
                        value={form.walletAddress
                          ? form.walletAddress.slice(0, 14) + "..." + form.walletAddress.slice(-6)
                          : ""}
                        readOnly
                        style={{
                          width: "100%",
                          padding: "0.85rem 1rem 0.85rem 2.6rem",
                          fontSize: "0.82rem",
                          borderRadius: 10,
                          border: "1.5px solid #e2e6f0",
                          background: "#f8f9fc",
                          color: "#0f172a",
                          outline: "none",
                          fontFamily: "var(--font-mono)",
                          cursor: "default",
                        }}
                      />
                    </div>
                    <button type="button" onClick={handleConnectWallet}
                      style={{
                        flexShrink: 0,
                        padding: "0.85rem 1.1rem",
                        whiteSpace: "nowrap",
                        background: form.walletAddress
                          ? "rgba(22,163,74,0.1)"
                          : "linear-gradient(135deg, #f97316, #ea580c)",
                        color: form.walletAddress ? "#16a34a" : "#fff",
                        border: form.walletAddress ? "1.5px solid rgba(22,163,74,0.3)" : "none",
                        borderRadius: 10, fontSize: "0.82rem",
                        fontFamily: "var(--font-mono)", fontWeight: 700,
                        cursor: "pointer", transition: "all 0.2s",
                        boxShadow: form.walletAddress ? "none" : "0 2px 8px rgba(249,115,22,0.35)",
                      }}>
                      {form.walletAddress ? "✅ Connected" : "🦊 Connect"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(220,38,38,0.06)",
                border: "1px solid rgba(220,38,38,0.2)",
                borderRadius: 10, padding: "0.75rem 1rem",
                marginBottom: "1rem",
                color: "#dc2626", fontSize: "0.85rem",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>⚠️ {error}</div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
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
                marginTop: "0.25rem",
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.45)"; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)"; }}>
              {loading ? "⏳ Creating account..." : "Create Account →"}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#fff", fontWeight: 700, textDecoration: "underline" }}>
            Sign in →
          </Link>
        </p>
        <p style={{ textAlign: "center", marginTop: "0.75rem", color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>
          🔒 Secured by blockchain technology
        </p>
      </div>
    </div>
  );
}

// Reusable field wrapper
function Field({ label, icon, children }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{
        display: "block", fontSize: "0.78rem", fontWeight: 700,
        color: "#374151", marginBottom: "0.45rem",
        textTransform: "uppercase", letterSpacing: "0.07em",
      }}>{label}</label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{
          position: "absolute", left: "0.9rem",
          fontSize: "0.95rem", pointerEvents: "none", zIndex: 1,
        }}>{icon}</span>
        {React.Children.map(children, child => {
          if (child.type === "input") {
            return React.cloneElement(child, {
              style: {
                width: "100%",
                padding: "0.85rem 1rem 0.85rem 2.6rem",
                fontSize: "0.95rem",
                borderRadius: 10,
                border: "1.5px solid #e2e6f0",
                background: "#f8f9fc",
                color: "#0f172a",
                outline: "none",
                transition: "all 0.2s",
                fontFamily: "var(--font-mono)",
                ...child.props.style,
              },
              onFocus: e => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; },
              onBlur:  e => { e.target.style.borderColor = "#e2e6f0"; e.target.style.background = "#f8f9fc"; e.target.style.boxShadow = "none"; },
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}
