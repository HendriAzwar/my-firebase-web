// routes/graph.js (Firebase version)
import express from "express";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

// Get all usage data from monitoring_listrik_mcb1 (for testing or simple display)
router.get("/harian/mcb1", async (req, res) => {
  try {
    const snapshot = await db.collection("monitoring_listrik_mcb1").get();
    const data = snapshot.docs.map(doc => doc.data());
    res.json({ data });
  } catch (error) {
    console.error("Error getting monitoring data:", error);
    res.status(500).json({ error: "Gagal mengambil data grafik" });
  }
});

export default router;
