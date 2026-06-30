const express = require("express");
const router = express.Router();
const { getContract } = require("../middleware/blockchain");
const QRCode = require("qrcode");

let Product;
try { Product = require("../models/Product"); } catch(e) {}

// GET /api/verify/:serialNumber
router.get("/:serialNumber", async (req, res) => {
  try {
    const { serialNumber } = req.params;
    const contract = getContract();

    let blockchainData = null;
    if (contract) {
      try {
        const result = await contract.verifyProduct(serialNumber);
        blockchainData = {
          exists: result[0],
          isAuthentic: result[1],
          name: result[2],
          manufacturer: result[3],
          registeredAt: result[4] ? new Date(Number(result[4]) * 1000).toISOString() : null,
        };
      } catch (bcErr) {
        console.error("Blockchain query error:", bcErr.message);
      }
    }

    let dbData = null;
    if (Product) {
      dbData = await Product.findOne({ serialNumber });
    }

    if (!blockchainData?.exists && !dbData) {
      return res.json({ verified: false, message: "Product not found. May be counterfeit." });
    }

    res.json({
      verified: blockchainData?.isAuthentic ?? dbData?.isAuthentic ?? false,
      product: {
        name: blockchainData?.name || dbData?.name,
        serialNumber,
        manufacturer: blockchainData?.manufacturer || dbData?.manufacturer,
        registeredAt: blockchainData?.registeredAt || dbData?.createdAt,
        txHash: dbData?.txHash || null,
        category: dbData?.category || "General",
      },
      source: blockchainData?.exists ? "blockchain" : "database",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/verify/qr/:serialNumber — generate QR code
router.get("/qr/:serialNumber", async (req, res) => {
  try {
    const { serialNumber } = req.params;
    const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify/${serialNumber}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 300, margin: 2 });
    res.json({ qrCode: qrDataUrl, url: verifyUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
