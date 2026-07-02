import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { products, verify } from "../utils/api";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "manufacturer") { navigate("/login"); return; }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await products.getAll();
      setProductList(data.products || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleShowQR = async (serialNumber) => {
    setQrModal(serialNumber); setQrCode(null);
    try {
      const data = await verify.getQR(serialNumber);
      setQrCode(data.qrCode);
    } catch (err) { console.error(err); }
  };

  const stats = [
    { label: "Total Products", value: productList.length, icon: "📦", color: "#2563eb", bg: "rgba(37,99,235,0.06)", border: "rgba(37,99,235,0.12)" },
    { label: "Verified On-Chain", value: productList.filter(p => p.txHash).length, icon: "🔗", color: "#16a34a", bg: "rgba(22,163,74,0.06)", border: "rgba(22,163,74,0.12)" },
    { label: "Wallet", value: user?.walletAddress ? `${user.walletAddress.slice(0,8)}...${user.walletAddress.slice(-6)}` : "Not connected", icon: "🦊", color: "#7c3aed", bg: "rgba(124,58,237,0.06)", border: "rgba(124,58,237,0.12)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0f4ff 0%, #f8f9fc 60%, #faf5ff 100%)", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 100, padding: "0.35rem 1rem", fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", marginBottom: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              🏭 Manufacturer Dashboard
            </div>
            <h1 style={{ fontFamily: "var(--font-head)", fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.35rem", letterSpacing: "-0.02em" }}>
              Welcome back, {user?.company || user?.name} 👋
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
              {productList.length} product{productList.length !== 1 ? "s" : ""} registered on the Sepolia blockchain
            </p>
          </div>
          <Link to="/register-product" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "0.85rem 1.5rem", background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              color: "#fff", border: "none", borderRadius: 12,
              fontWeight: 700, fontFamily: "var(--font-mono)", cursor: "pointer",
              fontSize: "0.9rem", boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.35)"; }}
            >+ Register New Product</button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "2.5rem" }}>
          {stats.map(stat => (
            <div key={stat.label} style={{
              background: "#fff", borderRadius: 16, padding: "1.75rem",
              border: `1px solid ${stat.border}`,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              display: "flex", alignItems: "center", gap: "1.25rem",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: stat.bg, border: `1px solid ${stat.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem",
              }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-head)", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.35rem", fontWeight: 500 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Products Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem", color: "#64748b", background: "#fff", borderRadius: 20, border: "1px solid #e2e6f0" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⏳</div>
            Loading products...
          </div>
        ) : productList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem", background: "#fff", borderRadius: 20, border: "1px solid #e2e6f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📭</div>
            <h3 style={{ fontFamily: "var(--font-head)", color: "#0f172a", marginBottom: "0.5rem", fontSize: "1.4rem" }}>No products yet</h3>
            <p style={{ color: "#64748b", marginBottom: "1.75rem", fontSize: "0.95rem" }}>Start registering products on the blockchain</p>
            <Link to="/register-product" style={{ textDecoration: "none" }}>
              <button style={{ padding: "0.85rem 2rem", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontFamily: "var(--font-mono)", cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
                Register First Product
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e6f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #e2e6f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1rem", color: "#0f172a", fontWeight: 700 }}>Registered Products</h3>
              <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontFamily: "var(--font-mono)" }}>{productList.length} total</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "#f8f9fc" }}>
                    {["Product Name", "Serial Number", "Category", "Registered", "On-Chain", "Actions"].map(h => (
                      <th key={h} style={{ padding: "0.9rem 1.5rem", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid #e2e6f0", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productList.map((p, i) => (
                    <tr key={p._id || i}
                      style={{ borderBottom: i < productList.length - 1 ? "1px solid #f1f3f8" : "none", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8f9fc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "1.1rem 1.5rem", fontWeight: 700, color: "#0f172a" }}>{p.name}</td>
                      <td style={{ padding: "1.1rem 1.5rem", fontFamily: "var(--font-mono)", color: "#64748b", fontSize: "0.8rem" }}>{p.serialNumber}</td>
                      <td style={{ padding: "1.1rem 1.5rem" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "0.25rem 0.75rem", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em", background: "rgba(8,145,178,0.08)", color: "#0891b2", border: "1px solid rgba(8,145,178,0.2)", textTransform: "uppercase" }}>{p.category}</span>
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem", color: "#64748b", fontSize: "0.82rem" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "1.1rem 1.5rem" }}>
                        {p.txHash
                          ? <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.75rem", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, background: "rgba(22,163,74,0.08)", color: "#16a34a", border: "1px solid rgba(22,163,74,0.2)" }}>✓ On-Chain</span>
                          : <span style={{ display: "inline-flex", alignItems: "center", padding: "0.25rem 0.75rem", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, background: "rgba(217,119,6,0.08)", color: "#d97706", border: "1px solid rgba(217,119,6,0.2)" }}>DB only</span>}
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {[
                            { label: "Verify", action: () => navigate(`/verify/${p.serialNumber}`) },
                            { label: "QR", action: () => handleShowQR(p.serialNumber) },
                          ].map(btn => (
                            <button key={btn.label} onClick={btn.action} style={{
                              padding: "0.4rem 0.9rem", borderRadius: 8,
                              border: "1.5px solid #e2e6f0", background: "#fff",
                              color: "#475569", fontSize: "0.75rem", fontWeight: 600,
                              fontFamily: "var(--font-mono)", cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.background = "rgba(37,99,235,0.04)"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e6f0"; e.currentTarget.style.color = "#475569"; e.currentTarget.style.background = "#fff"; }}
                            >{btn.label}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}
          onClick={() => { setQrModal(null); setQrCode(null); }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "2.5rem", maxWidth: 380, width: "90%", textAlign: "center", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>QR Code for</div>
            <h3 style={{ fontFamily: "var(--font-head)", color: "#0f172a", marginBottom: "1.5rem", fontSize: "1.2rem" }}>{qrModal}</h3>
            {qrCode
              ? <img src={qrCode} alt="QR" style={{ width: 220, height: 220, borderRadius: 16, border: "1px solid #e2e6f0" }} />
              : <div style={{ width: 220, height: 220, background: "#f8f9fc", borderRadius: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", border: "1px solid #e2e6f0" }}>Loading...</div>}
            <br />
            <button onClick={() => { setQrModal(null); setQrCode(null); }} style={{ marginTop: "1.5rem", padding: "0.75rem 2rem", border: "1.5px solid #e2e6f0", background: "#fff", borderRadius: 10, color: "#475569", fontWeight: 600, fontFamily: "var(--font-mono)", cursor: "pointer", fontSize: "0.9rem" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}