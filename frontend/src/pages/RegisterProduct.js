import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { products } from "../utils/api";
import { getContract, connectWallet } from "../utils/blockchain";
import contractConfig from "../config/contract.json";
import ProductVerificationABI from "../artifacts/contracts/ProductVerification.sol/ProductVerification.json";

const CATEGORIES = ["Electronics", "Pharmaceuticals", "Luxury Goods", "Food & Beverage", "Clothing", "Automotive", "General"];

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  padding: "0.85rem 1rem",
  fontSize: "0.95rem", borderRadius: 10,
  border: "1.5px solid #e2e6f0",
  background: "#f8f9fc", color: "#0f172a",
  outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "var(--font-mono)",
};
const labelStyle = {
  display: "block", fontSize: "0.78rem", fontWeight: 700,
  color: "#374151", marginBottom: "0.45rem",
  textTransform: "uppercase", letterSpacing: "0.07em",
};

export default function RegisterProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", serialNumber: "", description: "", category: "Electronics" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState("form");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(null);
    if (!form.name || !form.serialNumber) return setError("Product name and serial number are required.");
    setLoading(true); setStep("signing");
    try {
      let txHash = null, blockNumber = null;
      try {
        await connectWallet();
        const contract = await getContract(contractConfig.contractAddress, ProductVerificationABI.abi);
        const isRegistered = await contract.isCompanyRegistered(user.walletAddress);
        if (!isRegistered) {
          const regTx = await contract.registerCompany(user.company || user.name, user.email);
          await regTx.wait();
        }
        const tx = await contract.registerProduct(form.name, form.serialNumber);
        const receipt = await tx.wait();
        txHash = receipt.hash; blockNumber = receipt.blockNumber;
      } catch (bcErr) {
        console.warn("Blockchain tx skipped:", bcErr.message);
      }
      await products.create({
        name: form.name, serialNumber: form.serialNumber,
        description: form.description, category: form.category,
        manufacturer: user.company || user.name,
        manufacturerWallet: user.walletAddress || "0x0",
        txHash, blockNumber,
      });
      setSuccess({ ...form, txHash, blockNumber });
      setStep("done");
      setForm({ name: "", serialNumber: "", description: "", category: "Electronics" });
    } catch (err) {
      setError(err.message); setStep("form");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "manufacturer") {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", background: "#fff", borderRadius: 20, padding: "3rem", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e6f0", maxWidth: 420 }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚫</div>
          <h2 style={{ fontFamily: "var(--font-head)", color: "#0f172a", marginBottom: "0.5rem" }}>Manufacturers Only</h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem" }}>You need a manufacturer account to register products.</p>
          <button onClick={() => navigate("/register")} style={{ padding: "0.85rem 2rem", background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontFamily: "var(--font-mono)", cursor: "pointer", fontSize: "0.95rem" }}>
            Register as Manufacturer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0f4ff 0%, #f8f9fc 60%, #faf5ff 100%)", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 660, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 100, padding: "0.35rem 1rem", fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", marginBottom: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            🔗 Blockchain Registration
          </div>
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
            📦 Register Product
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Add a product to the Sepolia blockchain to make it permanently verifiable.</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", gap: 0 }}>
          {[
            { id: "form", num: "1", label: "Fill Form" },
            { id: "signing", num: "2", label: "Sign TX" },
            { id: "done", num: "3", label: "Done" },
          ].map((s, i) => {
            const isActive = step === s.id;
            const isDone = (step === "signing" && i === 0) || (step === "done" && i < 2);
            return (
              <React.Fragment key={s.id}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: isDone ? "#16a34a" : isActive ? "linear-gradient(135deg,#2563eb,#7c3aed)" : "#e2e6f0",
                    color: isDone || isActive ? "#fff" : "#94a3b8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", fontWeight: 700,
                    boxShadow: isActive ? "0 2px 10px rgba(37,99,235,0.3)" : "none",
                    transition: "all 0.3s",
                  }}>
                    {isDone ? "✓" : s.num}
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: isActive ? 700 : 400, color: isActive ? "#0f172a" : "#94a3b8", whiteSpace: "nowrap" }}>{s.label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: isDone ? "#16a34a" : "#e2e6f0", margin: "0 0.75rem", transition: "background 0.3s", minWidth: 20 }} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Success card */}
        {step === "done" && success && (
          <div style={{ background: "linear-gradient(135deg, rgba(22,163,74,0.05), rgba(22,163,74,0.02))", border: "1.5px solid rgba(22,163,74,0.25)", borderRadius: 20, padding: "2.5rem", marginBottom: "1.5rem", animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h2 style={{ fontFamily: "var(--font-head)", color: "#16a34a", marginBottom: "0.5rem", fontSize: "1.6rem" }}>Product Registered!</h2>
            <p style={{ color: "#475569", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
              <strong style={{ color: "#0f172a" }}>{success.name}</strong> ({success.serialNumber}) has been permanently stored on the Sepolia blockchain.
            </p>
            {success.txHash && (
              <div style={{ background: "#f8f9fc", border: "1px solid #e2e6f0", borderRadius: 10, padding: "0.85rem 1rem", fontSize: "0.78rem", fontFamily: "var(--font-mono)", color: "#64748b", wordBreak: "break-all", marginBottom: "1.5rem" }}>
                <span style={{ color: "#94a3b8", display: "block", marginBottom: "0.25rem", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>Transaction Hash</span>
                {success.txHash}
              </div>
            )}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {[
                { label: "🔍 Verify Now", action: () => navigate(`/verify/${success.serialNumber}`), primary: true },
                { label: "+ Add Another", action: () => { setStep("form"); setSuccess(null); }, primary: false },
                { label: "Dashboard", action: () => navigate("/dashboard"), primary: false },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action} style={{
                  padding: "0.75rem 1.25rem", borderRadius: 10, border: btn.primary ? "none" : "1.5px solid #e2e6f0",
                  background: btn.primary ? "linear-gradient(135deg,#2563eb,#7c3aed)" : "#fff",
                  color: btn.primary ? "#fff" : "#475569",
                  fontWeight: 700, fontFamily: "var(--font-mono)", cursor: "pointer",
                  fontSize: "0.88rem",
                  boxShadow: btn.primary ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
                }}>{btn.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Form card */}
        {step !== "done" && (
          <div style={{ background: "#ffffff", borderRadius: 20, padding: "2.5rem", boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)", border: "1px solid #e2e6f0" }}>

            {/* Signing overlay */}
            {step === "signing" && (
              <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem", animation: "spin 2s linear infinite", display: "inline-block" }}>⏳</div>
                <h3 style={{ fontFamily: "var(--font-head)", color: "#0f172a", marginBottom: "0.5rem" }}>Waiting for MetaMask...</h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Please confirm the transaction(s) in your MetaMask popup.</p>
              </div>
            )}

            {step === "form" && (
              <form onSubmit={handleSubmit}>

                {/* Product Name */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>Product Name *</label>
                  <input
                    placeholder="e.g. iPhone 15 Pro Max"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e6f0"; e.target.style.background = "#f8f9fc"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Serial Number */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>Serial Number *</label>
                  <input
                    placeholder="e.g. PROD-APPLE-001"
                    value={form.serialNumber}
                    onChange={e => setForm({ ...form, serialNumber: e.target.value })}
                    required
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e6f0"; e.target.style.background = "#f8f9fc"; e.target.style.boxShadow = "none"; }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.35rem" }}>Must be unique — this is what customers scan to verify.</p>
                </div>

                {/* Category */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e6f0"; e.target.style.boxShadow = "none"; }}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={labelStyle}>Description <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                  <textarea
                    placeholder="Brief product description, specifications, or notes..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                    onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e6f0"; e.target.style.background = "#f8f9fc"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Info box */}
                <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 10, padding: "0.9rem 1rem", marginBottom: "1.5rem", fontSize: "0.83rem", color: "#475569", display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0 }}>ℹ️</span>
                  <span>MetaMask will prompt you to sign up to two transactions: company registration (first time only) and product registration. Both are on Sepolia testnet.</span>
                </div>

                {/* Error */}
                {error && (
                  <div style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1.25rem", color: "#dc2626", fontSize: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
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
                    transition: "all 0.2s", letterSpacing: "0.02em",
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.45)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)"; }}
                >
                  🔗 Register on Blockchain
                </button>
              </form>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}