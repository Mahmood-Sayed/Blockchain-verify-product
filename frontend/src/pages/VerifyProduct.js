import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { verify } from "../utils/api";

const detailRowStyle = {
  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
  padding: "0.9rem 0", borderBottom: "1px solid #f1f3f8", gap: "1rem",
};

export default function VerifyProduct() {
  const { serial: paramSerial } = useParams();
  const [serial, setSerial] = useState(paramSerial || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState(null);

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!serial.trim()) return;
    setError(""); setResult(null); setQrCode(null); setLoading(true);
    try {
      const data = await verify.check(serial.trim());
      setResult(data);
      if (data.verified) {
        try { const qr = await verify.getQR(serial.trim()); setQrCode(qr.qrCode); } catch {}
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  React.useEffect(() => { if (paramSerial) handleVerify(); }, [paramSerial]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0f4ff 0%, #f8f9fc 60%, #faf5ff 100%)", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 100, padding: "0.35rem 1rem", fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", marginBottom: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            🔍 Blockchain Verification
          </div>
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: "2.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            Verify Product
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
            Enter a serial number to instantly verify product authenticity on the blockchain
          </p>
        </div>

        {/* Search */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", border: "1px solid #e2e6f0", marginBottom: "1.5rem" }}>
          <form onSubmit={handleVerify} style={{ display: "flex", gap: "0.75rem" }}>
            <input
              value={serial}
              onChange={e => setSerial(e.target.value)}
              placeholder="Enter serial number (e.g. PROD-ABC-001)"
              style={{
                flex: 1, boxSizing: "border-box",
                padding: "0.9rem 1.25rem", fontSize: "0.95rem",
                borderRadius: 12, border: "1.5px solid #e2e6f0",
                background: "#f8f9fc", color: "#0f172a",
                outline: "none", fontFamily: "var(--font-mono)",
                transition: "all 0.2s",
              }}
              onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "#e2e6f0"; e.target.style.background = "#f8f9fc"; e.target.style.boxShadow = "none"; }}
            />
            <button type="submit" disabled={loading} style={{
              padding: "0.9rem 1.75rem", flexShrink: 0,
              background: loading ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #7c3aed)",
              color: "#fff", border: "none", borderRadius: 12,
              fontWeight: 700, fontFamily: "var(--font-mono)",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "0.95rem", whiteSpace: "nowrap",
              boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
              transition: "all 0.2s",
            }}>
              {loading ? "Checking..." : "Verify →"}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: "1.5rem", color: "#dc2626", fontSize: "0.9rem", display: "flex", gap: "0.65rem", alignItems: "center" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>

            {/* Banner */}
            <div style={{
              background: result.verified ? "linear-gradient(135deg, rgba(22,163,74,0.06), rgba(22,163,74,0.02))" : "linear-gradient(135deg, rgba(220,38,38,0.06), rgba(220,38,38,0.02))",
              border: `1.5px solid ${result.verified ? "rgba(22,163,74,0.25)" : "rgba(220,38,38,0.25)"}`,
              borderRadius: 20, padding: "2.5rem", marginBottom: "1.5rem", textAlign: "center",
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{result.verified ? "✅" : "❌"}</div>
              <h2 style={{
                fontFamily: "var(--font-head)", fontSize: "1.75rem", fontWeight: 800,
                color: result.verified ? "#16a34a" : "#dc2626",
                marginBottom: "0.75rem", letterSpacing: "-0.01em",
              }}>
                {result.verified ? "Authentic Product" : "Not Verified"}
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.95rem", maxWidth: 400, margin: "0 auto 1rem" }}>
                {result.verified
                  ? "This product is registered on the blockchain and verified as authentic."
                  : result.message || "This serial number was not found on the blockchain."}
              </p>
              {result.source && (
                <span style={{ display: "inline-flex", alignItems: "center", padding: "0.3rem 0.9rem", borderRadius: 100, fontSize: "0.75rem", fontWeight: 700, background: "rgba(8,145,178,0.08)", color: "#0891b2", border: "1px solid rgba(8,145,178,0.2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Source: {result.source}
                </span>
              )}
            </div>

            {/* Product Details */}
            {result.product && (
              <div style={{ background: "#fff", borderRadius: 20, padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #e2e6f0", marginBottom: "1.5rem" }}>
                <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1rem", color: "#0f172a", fontWeight: 700, marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "2px solid #f1f3f8" }}>
                  Product Details
                </h3>
                {[
                  { label: "Product Name", value: result.product.name, bold: true },
                  { label: "Serial Number", value: result.product.serialNumber, mono: true },
                  { label: "Manufacturer", value: result.product.manufacturer },
                  { label: "Category", value: result.product.category },
                  { label: "Registered On", value: result.product.registeredAt ? new Date(result.product.registeredAt).toLocaleString() : "N/A" },
                  { label: "TX Hash", value: result.product.txHash, mono: true },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{ ...detailRowStyle, borderBottom: i < arr.length - 1 ? "1px solid #f1f3f8" : "none" }}>
                    <span style={{ color: "#64748b", fontSize: "0.85rem", flexShrink: 0, paddingTop: "0.1rem" }}>{row.label}</span>
                    <span style={{
                      fontSize: "0.85rem", color: "#0f172a", textAlign: "right",
                      fontFamily: row.mono ? "var(--font-mono)" : "inherit",
                      fontWeight: row.bold ? 700 : 400,
                      wordBreak: "break-all", maxWidth: "60%",
                    }}>{row.value || "—"}</span>
                  </div>
                ))}
              </div>
            )}

            {/* QR Code */}
            {qrCode && (
              <div style={{ background: "#fff", borderRadius: 20, padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #e2e6f0", textAlign: "center" }}>
                <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1rem", color: "#0f172a", fontWeight: 700, marginBottom: "1.5rem" }}>
                  Verification QR Code
                </h3>
                <img src={qrCode} alt="QR Code" style={{ width: 200, height: 200, borderRadius: 16, border: "1px solid #e2e6f0" }} />
                <p style={{ color: "#94a3b8", fontSize: "0.78rem", marginTop: "0.85rem" }}>
                  Scan to share this product's verification page
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>🔍</div>
            <p style={{ fontSize: "0.9rem" }}>Enter a serial number above to check product authenticity</p>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}