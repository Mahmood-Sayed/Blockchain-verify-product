import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{
        maxWidth: 1200, margin: "0 auto", padding: "6rem 2rem 4rem",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center"
      }}>
        <div>
          <div className="badge badge-info" style={{ marginBottom: "1.5rem" }}>
            🔗 Blockchain-Powered
          </div>
          <h1 style={{ fontSize: "3.5rem", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            Verify Product<br />
            <span style={{ color: "var(--accent)" }}>Authenticity</span><br />
            On-Chain
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 480 }}>
            A decentralized product verification platform. Manufacturers register products on the blockchain.
            Customers verify authenticity in real-time — tamper-proof, transparent, trustworthy.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/verify">
              <button className="btn-primary" style={{ padding: "0.9rem 2rem", fontSize: "1rem" }}>
                🔍 Verify a Product
              </button>
            </Link>
            <Link to="/register">
              <button className="btn-outline" style={{ padding: "0.9rem 2rem", fontSize: "1rem" }}>
                Register as Manufacturer
              </button>
            </Link>
          </div>
        </div>

        {/* Animated Block Visual */}
        <div style={{ position: "relative", height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Chain />
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "0.75rem" }}>How It Works</h2>
          <p style={{ textAlign: "center", color: "var(--text2)", marginBottom: "3.5rem" }}>
            Three simple steps to verify any product
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {[
              { step: "01", icon: "🏭", title: "Manufacturer Registers", desc: "Manufacturers create an account, connect their wallet, and register their products on the blockchain via a smart contract." },
              { step: "02", icon: "📦", title: "Product Gets a QR Code", desc: "Each registered product receives a unique serial number and QR code backed by an immutable blockchain record." },
              { step: "03", icon: "✅", title: "Customer Verifies", desc: "Customers scan the QR code or enter the serial number. The app queries the blockchain and returns instant verification." },
            ].map(item => (
              <div key={item.step} className="card" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", top: -10, right: -10,
                  fontSize: "4rem", fontFamily: "var(--font-head)", fontWeight: 800,
                  color: "rgba(0,255,136,0.06)", lineHeight: 1
                }}>{item.step}</div>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{item.icon}</div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>{item.title}</h3>
                <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "3rem" }}>Tech Stack</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
          {["React.js", "Node.js", "Express.js", "MongoDB", "Solidity", "Hardhat", "Ethers.js", "MetaMask"].map(tech => (
            <span key={tech} style={{
              padding: "0.5rem 1.25rem",
              border: "1px solid var(--border-bright)",
              borderRadius: 100,
              fontSize: "0.85rem",
              color: "var(--text2)",
              fontFamily: "var(--font-mono)",
            }}>{tech}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "2rem", textAlign: "center", color: "var(--text3)", fontSize: "0.8rem" }}>
        BlockVerify — MCA Project by Mahmood Sayed (24P00169) | Presidency College | Guide: Ms. Jitha Janardhanan
      </footer>
    </div>
  );
}

function Chain() {
  const blocks = [
    { label: "GENESIS", hash: "0x000...abc", color: "#7c3aed" },
    { label: "PRODUCT A", hash: "0x1f2...d4e", color: "#06b6d4" },
    { label: "PRODUCT B", hash: "0x9a3...f12", color: "#00ff88" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, alignItems: "center" }}>
      {blocks.map((b, i) => (
        <React.Fragment key={b.label}>
          <div style={{
            background: "var(--bg3)", border: `1px solid ${b.color}44`,
            borderRadius: 12, padding: "1rem 1.5rem", width: 260,
            boxShadow: `0 0 20px ${b.color}22`,
            animation: `fadeUp 0.5s ease ${i * 0.15}s both`,
          }}>
            <div style={{ fontSize: "0.65rem", color: "var(--text3)", marginBottom: 4, letterSpacing: "0.1em" }}>BLOCK #{i}</div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: b.color, marginBottom: 4 }}>{b.label}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{b.hash}</div>
          </div>
          {i < blocks.length - 1 && (
            <div style={{ width: 2, height: 28, background: `linear-gradient(${b.color}, ${blocks[i+1].color})`, opacity: 0.5 }} />
          )}
        </React.Fragment>
      ))}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
