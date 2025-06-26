// routes/room.js (Firebase version)
import express from "express";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

// GET all room data
router.get("/kamar", async (req, res) => {
  try {
    const snapshot = await db.collection("kamar_kos").get();
    const kamarList = snapshot.docs.map(doc => doc.data());
    res.json(kamarList);
  } catch (error) {
    console.error("Error getting room data:", error);
    res.status(500).json({ error: "Gagal mengambil data kamar" });
  }
});

// GET kamar by ID
router.get("/kamar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const snapshot = await db.collection("kamar_kos").where("id", "==", parseInt(id)).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Kamar tidak ditemukan" });
    }

    res.json(snapshot.docs[0].data());
  } catch (error) {
    console.error("Error getting kamar by ID:", error);
    res.status(500).json({ error: "Gagal mengambil data kamar" });
  }
});

export default router;