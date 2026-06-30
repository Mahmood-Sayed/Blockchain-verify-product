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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowQR = async (serialNumber) => {
    setQrModal(serialNumber); setQrCode(null);
    try {
      const data = await verify.getQR(serialNumber);
      setQrCode(data.qrCode);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>Dashboard</h1>
          <p style={{ color: "var(--text2)" }}>
            {user?.company || user?.name} · {productList.length} product{productList.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Link to="/register-product">
          <button className="btn-primary">+ Register New Product</button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
        {[
          { label: "Total Products", value: productList.length, icon: "📦" },
          { label: "Verified On-Chain", value: productList.filter(p => p.txHash).length, icon: "🔗" },
          { label: "Wallet", value: user?.walletAddress ? `${user.walletAddress.slice(0,6)}...${user.walletAddress.slice(-4)}` : "Not connected", icon: "🦊" },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{stat.icon}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-head)", color: "var(--accent)" }}>{stat.value}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text2)", marginTop: "0.25rem" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text2)" }}>Loading products...</div>
      ) : productList.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
          <h3 style={{ marginBottom: "0.5rem" }}>No products yet</h3>
          <p style={{ color: "var(--text2)", marginBottom: "1.5rem" }}>Start registering products on the blockchain</p>
          <Link to="/register-product"><button className="btn-primary">Register First Product</button></Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.9rem", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Registered Products</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                  {["Product Name", "Serial Number", "Category", "Registered", "On-Chain", "Actions"].map(h => (
                    <th key={h} style={{ padding: "0.9rem 1.25rem", textAlign: "left", color: "var(--text2)", fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productList.map((p, i) => (
                  <tr key={p._id || i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "1rem 1.25rem", fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: "1rem 1.25rem", fontFamily: "var(--font-mono)", color: "var(--text2)", fontSize: "0.8rem" }}>{p.serialNumber}</td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span className="badge badge-info">{p.category}</span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "var(--text2)", fontSize: "0.8rem" }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      {p.txHash
                        ? <span className="badge badge-success">✓ Yes</span>
                        : <span className="badge badge-warning">DB only</span>}
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn-outline" onClick={() => navigate(`/verify/${p.serialNumber}`)}
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}>Verify</button>
                        <button className="btn-outline" onClick={() => handleShowQR(p.serialNumber)}
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}>QR</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={() => { setQrModal(null); setQrCode(null); }}>
          <div className="card" style={{ maxWidth: 380, width: "90%", textAlign: "center" }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: "0.5rem" }}>QR Code</h3>
            <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1.5rem", fontFamily: "var(--font-mono)" }}>{qrModal}</p>
            {qrCode
              ? <img src={qrCode} alt="QR" style={{ width: 240, height: 240, borderRadius: 12 }} />
              : <div style={{ width: 240, height: 240, background: "var(--bg3)", borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--text3)" }}>Loading...</div>}
            <br />
            <button className="btn-outline" onClick={() => { setQrModal(null); setQrCode(null); }} style={{ marginTop: "1.25rem" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
