const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

let Product;
try { Product = require("../models/Product"); } catch(e) {}

// GET /api/products — get only the logged-in manufacturer's products
router.get("/", protect, async (req, res) => {
  try {
    if (!Product) return res.json({ products: [] });

    const productList = await Product.find({ manufacturerId: req.user.id }).sort({ createdAt: -1 });
    res.json({ products: productList });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products
router.post("/", protect, async (req, res) => {
  try {
    console.log("req.user:", JSON.stringify(req.user));
    console.log("req.user.id:", req.user.id);
    
    const { name, serialNumber, description, category, txHash, blockNumber, manufacturerWallet, manufacturer } = req.body;
    // ... rest stays the same
    if (Product) {
      const exists = await Product.findOne({ serialNumber });
      if (exists) return res.status(400).json({ message: "Serial number already registered" });

      const product = await Product.create({
        name,
        serialNumber,
        manufacturer: manufacturer || req.user.company || req.user.name || req.user.email,
        manufacturerWallet: manufacturerWallet || req.user.walletAddress || "",
        manufacturerId: req.user.id,
        description,
        category,
        txHash,
        blockNumber,
      });
      return res.status(201).json({ product });
    }

    res.status(503).json({ message: "Database not available" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:serial
router.get("/:serial", async (req, res) => {
  try {
    if (!Product) return res.status(404).json({ message: "Not found" });
    const product = await Product.findOne({ serialNumber: req.params.serial });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;