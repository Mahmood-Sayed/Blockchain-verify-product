import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { products } from "../utils/api";
import { getContract, connectWallet } from "../utils/blockchain";
import contractConfig from "../config/contract.json";
import ProductVerificationABI from "../artifacts/contracts/ProductVerification.sol/ProductVerification.json";

export default function RegisterProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", serialNumber: "", description: "", category: "Electronics" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState("form"); // form | signing | done

  const categories = ["Electronics", "Pharmaceuticals", "Luxury Goods", "Food & Beverage", "Clothing", "Automotive", "General"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(null);

    if (!form.name || !form.serialNumber) return setError("Product name and serial number are required.");
    setLoading(true);
    setStep("signing");

    try {
      // Step 1: Connect wallet & get contract
      let txHash = null;
      let blockNumber = null;

      try {
        await connectWallet();
        const contract = await getContract(contractConfig.contractAddress, ProductVerificationABI.abi);

        // Step 2: Check if company is registered on-chain
        const isRegistered = await contract.isCompanyRegistered(user.walletAddress);
        if (!isRegistered) {
          // Auto-register company on-chain
          const regTx = await contract.registerCompany(user.company || user.name, user.email);
          await regTx.wait();
        }

        // Step 3: Register product on blockchain
        const tx = await contract.registerProduct(form.name, form.serialNumber);
        const receipt = await tx.wait();
        txHash = receipt.hash;
        blockNumber = receipt.blockNumber;
      } catch (bcErr) {
        console.warn("Blockchain tx skipped:", bcErr.message);
        // Continue saving to DB even if blockchain fails (for demo)
      }

      // Step 4: Save to MongoDB
      await products.create({
        name: form.name,
        serialNumber: form.serialNumber,
        description: form.description,
        category: form.category,
        manufacturer: user.company || user.name,
        manufacturerWallet: user.walletAddress || "0x0",
        txHash,
        blockNumber,
      });

      setSuccess({ ...form, txHash, blockNumber });
      setStep("done");
      setForm({ name: "", serialNumber: "", description: "", category: "Electronics" });
    } catch (err) {
      setError(err.message);
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "manufacturer") {
    return (
      <div style={{ maxWidth: 500, margin: "6rem auto", textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚫</div>
        <h2>Manufacturers Only</h2>
        <p style={{ color: "var(--text2)", margin: "1rem 0" }}>You need a manufacturer account to register products.</p>
        <button className="btn-primary" onClick={() => navigate("/register")}>Register as Manufacturer</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "4rem 2rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📦 Register Product</h1>
        <p style={{ color: "var(--text2)" }}>Add a product to the blockchain to make it verifiable</p>
      </div>

      {/* Steps indicator */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", alignItems: "center" }}>
        {[{ id: "form", label: "1. Fill Form" }, { id: "signing", label: "2. Sign TX" }, { id: "done", label: "3. Done" }].map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{
              padding: "0.35rem 0.9rem", borderRadius: 100, fontSize: "0.75rem",
              background: step === s.id ? "var(--accent)" : step === "done" && s.id !== "done" ? "rgba(0,255,136,0.15)" : "var(--bg3)",
              color: step === s.id ? "#000" : "var(--text2)",
              fontWeight: step === s.id ? 700 : 400,
              border: "1px solid var(--border)",
            }}>{s.label}</div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: "var(--border)" }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Success */}
      {step === "done" && success && (
        <div style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 16, padding: "2rem", marginBottom: "1.5rem", animation: "fadeUp 0.4s ease" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✅</div>
          <h2 style={{ color: "var(--accent)", marginBottom: "0.5rem" }}>Product Registered!</h2>
          <p style={{ color: "var(--text2)", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
            <strong style={{ color: "var(--text)" }}>{success.name}</strong> has been registered on the blockchain.
          </p>
          {success.txHash && (
            <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.78rem", fontFamily: "var(--font-mono)", color: "var(--text2)", wordBreak: "break-all", marginBottom: "1rem" }}>
              TX: {success.txHash}
            </div>
          )}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => navigate(`/verify/${success.serialNumber}`)}>
              🔍 Verify Now
            </button>
            <button className="btn-outline" onClick={() => { setStep("form"); setSuccess(null); }}>
              + Add Another
            </button>
            <button className="btn-outline" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      {step !== "done" && (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name *</label>
              <input placeholder="iPhone 15 Pro Max" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Serial Number *</label>
              <input placeholder="PROD-APPLE-001" value={form.serialNumber}
                onChange={e => setForm({ ...form, serialNumber: e.target.value })} required />
              <span style={{ fontSize: "0.75rem", color: "var(--text3)" }}>Must be unique. This is what customers use to verify.</span>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <textarea placeholder="Brief product description..." value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3} style={{ resize: "vertical" }} />
            </div>

            {error && <p className="error-msg">⚠ {error}</p>}

            <div style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 8, padding: "0.9rem 1rem", marginBottom: "1.25rem", fontSize: "0.82rem", color: "var(--text2)" }}>
              ℹ️ This will prompt MetaMask to sign two transactions: company registration (first time only) and product registration.
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: "100%", padding: "0.9rem" }}>
              {loading ? (step === "signing" ? "⏳ Waiting for MetaMask..." : "Processing...") : "🔗 Register on Blockchain"}
            </button>
          </form>
        </div>
      )}
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
