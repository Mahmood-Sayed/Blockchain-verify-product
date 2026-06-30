const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const verifyRoutes = require("./routes/verify");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/verify", verifyRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "BlockVerify API is running" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log("Backend running on http://localhost:" + process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    app.listen(process.env.PORT, () => {
      console.log("Backend running on http://localhost:" + process.env.PORT);
    });
  });
