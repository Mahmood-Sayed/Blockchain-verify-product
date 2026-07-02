import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #fff 70%)", borderBottom: "1px solid #e2e6f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "6rem 2rem 5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 100, padding: "0.4rem 1rem", fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", marginBottom: "1.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              🔗 Blockchain-Powered
            </div>
            <h1 style={{ fontFamily: "var(--font-head)", fontSize: "3.75rem", lineHeight: 1.08, fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
              Verify Product<br />
              <span style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Authenticity</span><br />
              On-Chain
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 460 }}>
              A decentralized product verification platform. Manufacturers register products on the blockchain. Customers verify authenticity in real-time — tamper-proof, transparent, trustworthy.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link to="/verify" style={{ textDecoration: "none" }}>
                <button style={{ padding: "1rem 2rem", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 700, fontFamily: "var(--font-mono)", cursor: "pointer", fontSize: "1rem", boxShadow: "0 4px 18px rgba(37,99,235,0.35)", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(37,99,235,0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(37,99,235,0.35)"; }}>
                  🔍 Verify a Product
                </button>
              </Link>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <button style={{ padding: "1rem 2rem", background: "#fff", color: "#0f172a", border: "1.5px solid #e2e6f0", borderRadius: 14, fontWeight: 700, fontFamily: "var(--font-mono)", cursor: "pointer", fontSize: "1rem", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e6f0"; e.currentTarget.style.color = "#0f172a"; }}>
                  Register as Manufacturer
                </button>
              </Link>
            </div>
          </div>

          {/* Block Chain Visual */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {[
              { label: "GENESIS", hash: "0x000...abc", color: "#7c3aed", bg: "rgba(124,58,237,0.06)", delay: "0s" },
              { label: "PRODUCT A", hash: "0x1f2...d4e", color: "#2563eb", bg: "rgba(37,99,235,0.06)", delay: "0.12s" },
              { label: "PRODUCT B", hash: "0x9a3...f12", color: "#0891b2", bg: "rgba(8,145,178,0.06)", delay: "0.24s" },
            ].map((b, i, arr) => (
              <React.Fragment key={b.label}>
                <div style={{
                  background: "#fff", border: `1.5px solid ${b.color}44`,
                  borderRadius: 16, padding: "1.25rem 1.75rem", width: 290,
                  boxShadow: `0 4px 24px ${b.color}18`,
                  animation: `fadeUp 0.5s ease ${b.delay} both`,
                }}>
                  <div style={{ fontSize: "0.62rem", color: "#94a3b8", marginBottom: "0.35rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Block #{i}</div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: b.color, fontSize: "1rem", marginBottom: "0.35rem" }}>{b.label}</div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontFamily: "var(--font-mono)" }}>{b.hash}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 2, height: 32, background: `linear-gradient(${b.color}88, ${arr[i+1].color}88)` }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "6rem 2rem", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.12)", borderRadius: 100, padding: "0.35rem 1rem", fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", marginBottom: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Simple Process
            </div>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "2.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>How It Works</h2>
            <p style={{ color: "#64748b", fontSize: "1rem" }}>Three simple steps to verify any product</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {[
              { step: "01", icon: "🏭", title: "Manufacturer Registers", desc: "Manufacturers create an account, connect their MetaMask wallet, and register products on the Sepolia blockchain via our smart contract.", color: "#7c3aed", bg: "rgba(124,58,237,0.06)", border: "rgba(124,58,237,0.12)" },
              { step: "02", icon: "📦", title: "Product Gets a QR Code", desc: "Each registered product gets a unique serial number and QR code backed by an immutable blockchain record — impossible to counterfeit.", color: "#2563eb", bg: "rgba(37,99,235,0.06)", border: "rgba(37,99,235,0.12)" },
              { step: "03", icon: "✅", title: "Customer Verifies", desc: "Customers scan the QR code or enter the serial number. The app queries the blockchain and returns instant, tamper-proof verification.", color: "#16a34a", bg: "rgba(22,163,74,0.06)", border: "rgba(22,163,74,0.12)" },
            ].map(item => (
              <div key={item.step} style={{ background: "#fff", border: `1.5px solid ${item.border}`, borderRadius: 20, padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -8, right: 12, fontSize: "4.5rem", fontFamily: "var(--font-head)", fontWeight: 900, color: item.bg, lineHeight: 1, opacity: 0.6 }}>{item.step}</div>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: item.bg, border: `1px solid ${item.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1.25rem" }}>{item.icon}</div>
                <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>{item.title}</h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ background: "linear-gradient(160deg, #f0f4ff, #f8f9fc)", borderTop: "1px solid #e2e6f0", borderBottom: "1px solid #e2e6f0", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>Built With</h2>
          <p style={{ color: "#64748b", marginBottom: "2.5rem", fontSize: "0.9rem" }}>Modern stack for a production-grade blockchain application</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            {[
              { name: "React.js", color: "#06b6d4" },
              { name: "Node.js", color: "#16a34a" },
              { name: "Express.js", color: "#64748b" },
              { name: "MongoDB", color: "#16a34a" },
              { name: "Solidity", color: "#7c3aed" },
              { name: "Hardhat", color: "#d97706" },
              { name: "Ethers.js", color: "#2563eb" },
              { name: "MetaMask", color: "#f97316" },
              { name: "Sepolia Testnet", color: "#7c3aed" },
            ].map(tech => (
              <span key={tech.name} style={{
                padding: "0.5rem 1.1rem",
                border: `1px solid ${tech.color}33`,
                background: `${tech.color}08`,
                borderRadius: 100, fontSize: "0.82rem",
                color: tech.color, fontFamily: "var(--font-mono)",
                fontWeight: 600,
              }}>{tech.name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.8rem", borderTop: "1px solid #f1f3f8" }}>
        BlockVerify — MCA Final Year Project by <strong style={{ color: "#64748b" }}>Mahmood Sayed</strong> (24P00169) | Presidency College | Guide: Ms. Jitha Janardhanan
      </footer>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}