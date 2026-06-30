import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verify } from "../utils/api";

export default function VerifyProduct() {
  const { serial: paramSerial } = useParams();
  const navigate = useNavigate();
  const [serial, setSerial] = useState(paramSerial || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState(null);

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!serial.trim()) return;
    setError(""); setResult(null); setQrCode(null);
    setLoading(true);
    try {
      const data = await verify.check(serial.trim());
      setResult(data);
      if (data.verified) {
        try {
          const qr = await verify.getQR(serial.trim());
          setQrCode(qr.qrCode);
        } catch {}
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { if (paramSerial) handleVerify(); }, [paramSerial]);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "4rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
          🔍 Verify Product
        </h1>
        <p style={{ color: "var(--text2)" }}>
          Enter a product serial number to verify its authenticity on the blockchain
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleVerify} style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
        <input
          value={serial}
          onChange={e => setSerial(e.target.value)}
          placeholder="Enter serial number (e.g. PROD-ABC-001)"
          style={{ flex: 1, fontSize: "1rem" }}
        />
        <button type="submit" className="btn-primary" disabled={loading}
          style={{ padding: "0.75rem 1.75rem", whiteSpace: "nowrap" }}>
          {loading ? "Checking..." : "Verify"}
        </button>
      </form>

      {error && (
        <div style={{ background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.3)", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem" }}>
          <p style={{ color: "var(--danger)" }}>⚠ {error}</p>
        </div>
      )}

      {result && (
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          {/* Result Banner */}
          <div style={{
            background: result.verified ? "rgba(0,255,136,0.06)" : "rgba(255,68,102,0.06)",
            border: `1px solid ${result.verified ? "rgba(0,255,136,0.3)" : "rgba(255,68,102,0.3)"}`,
            borderRadius: 16, padding: "2rem", marginBottom: "1.5rem", textAlign: "center"
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>
              {result.verified ? "✅" : "❌"}
            </div>
            <h2 style={{ fontSize: "1.75rem", color: result.verified ? "var(--accent)" : "var(--danger)", marginBottom: "0.5rem" }}>
              {result.verified ? "AUTHENTIC PRODUCT" : "NOT VERIFIED"}
            </h2>
            <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>
              {result.verified
                ? "This product is registered on the blockchain and is authentic."
                : result.message || "This serial number was not found on the blockchain."}
            </p>
            {result.source && (
              <span className="badge badge-info" style={{ marginTop: "1rem" }}>
                Source: {result.source}
              </span>
            )}
          </div>

          {/* Product Details */}
          {result.product && (
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ marginBottom: "1.25rem", fontSize: "1rem", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Product Details
              </h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {[
                  { label: "Product Name", value: result.product.name },
                  { label: "Serial Number", value: result.product.serialNumber },
                  { label: "Manufacturer", value: result.product.manufacturer },
                  { label: "Category", value: result.product.category },
                  { label: "Registered On", value: result.product.registeredAt ? new Date(result.product.registeredAt).toLocaleString() : "N/A" },
                  { label: "TX Hash", value: result.product.txHash || "On-chain" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--text2)", fontSize: "0.85rem" }}>{row.label}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text)", fontFamily: "var(--font-mono)", maxWidth: 280, textAlign: "right", wordBreak: "break-all" }}>{row.value || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR Code */}
          {qrCode && (
            <div className="card" style={{ textAlign: "center" }}>
              <h3 style={{ marginBottom: "1rem", fontSize: "0.85rem", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Verification QR Code
              </h3>
              <img src={qrCode} alt="QR Code" style={{ width: 200, height: 200, borderRadius: 8 }} />
              <p style={{ color: "var(--text3)", fontSize: "0.75rem", marginTop: "0.75rem" }}>
                Scan to verify this product
              </p>
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
