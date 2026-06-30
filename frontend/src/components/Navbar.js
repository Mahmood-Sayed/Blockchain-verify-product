import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e6f0",
        padding: "0 2rem",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
            <div style={{
              width: 38, height: 38,
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", fontWeight: 900, color: "#fff",
              fontFamily: "var(--font-head)",
              boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
            }}>B</div>
            <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.15rem", color: "#0f172a", letterSpacing: "-0.02em" }}>
              Block<span style={{ color: "#2563eb" }}>Verify</span>
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
            <NavLink to="/" label="Home" active={isActive("/")} />
            <NavLink to="/verify" label="🔍 Verify" active={isActive("/verify")} />
            {user?.role === "manufacturer" && (
              <NavLink to="/dashboard" label="Dashboard" active={isActive("/dashboard")} />
            )}
            {user?.role === "manufacturer" && (
              <NavLink to="/register-product" label="Register Product" active={isActive("/register-product")} />
            )}
          </div>

          {/* Auth Area */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user ? (
              <>
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  background: "#f1f3f8", borderRadius: 100,
                  padding: "0.35rem 0.9rem",
                  border: "1px solid #e2e6f0",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", color: "#fff", fontWeight: 700,
                  }}>
                    {(user.name || user.email || "U")[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 600 }}>
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "0.4rem 1rem", fontSize: "0.8rem",
                    background: "transparent",
                    border: "1.5px solid #e2e6f0",
                    borderRadius: 8, color: "#475569",
                    cursor: "pointer", fontFamily: "var(--font-mono)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.target.style.borderColor = "#dc2626"; e.target.style.color = "#dc2626"; }}
                  onMouseLeave={e => { e.target.style.borderColor = "#e2e6f0"; e.target.style.color = "#475569"; }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button style={{
                    padding: "0.45rem 1.1rem", fontSize: "0.85rem",
                    background: "transparent",
                    border: "1.5px solid #c8cfe0",
                    borderRadius: 8, color: "#475569",
                    cursor: "pointer", fontFamily: "var(--font-mono)",
                    transition: "all 0.2s",
                    fontWeight: 600,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#c8cfe0"; e.currentTarget.style.color = "#475569"; }}>
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button style={{
                    padding: "0.45rem 1.1rem", fontSize: "0.85rem",
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    border: "none", borderRadius: 8,
                    color: "#fff", cursor: "pointer",
                    fontFamily: "var(--font-mono)", fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.3)"; }}>
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}

function NavLink({ to, label, active }) {
  return (
    <Link to={to} style={{
      padding: "0.4rem 0.85rem",
      borderRadius: 8,
      fontSize: "0.85rem",
      color: active ? "#2563eb" : "#475569",
      background: active ? "rgba(37,99,235,0.08)" : "transparent",
      textDecoration: "none",
      transition: "all 0.2s",
      fontFamily: "var(--font-mono)",
      fontWeight: active ? 700 : 500,
      borderBottom: active ? "2px solid #2563eb" : "2px solid transparent",
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.background = "rgba(37,99,235,0.05)"; }}}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "#475569"; e.currentTarget.style.background = "transparent"; }}}>
      {label}
    </Link>
  );
}
