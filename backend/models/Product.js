const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    serialNumber: { type: String, required: true, unique: true, trim: true },
    manufacturer: { type: String, required: true },
    manufacturerWallet: { type: String, required: true },
    manufacturerId: { type: String, default: null }, 
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    txHash: { type: String, default: null },
    blockNumber: { type: Number, default: null },
    isAuthentic: { type: Boolean, default: true },
    qrCode: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
