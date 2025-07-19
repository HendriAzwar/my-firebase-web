// backend/cronSisaHari.js
import cron from "node-cron";
import { db, rtdb } from "./firebaseAdmin.js";

// Fungsi utama untuk mengurangi sisa_hari setiap hari
export const startSisaHariCron = () => {
  // Cron berjalan setiap hari jam 00:00
  cron.schedule("45 0 * * *", async () => {
    console.log("⏰ Cron: Mengurangi sisa_hari...");

    try {
      const snapshot = await db.collection("kamar_kos").where("status_kamar", "==", 1).get();
      const batch = db.batch();

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const currentSisaHari = parseInt(data.sisa_hari);
        const kamarId = doc.id;

        if (!isNaN(currentSisaHari) && currentSisaHari > 0) {
          const docRef = db.collection("kamar_kos").doc(kamarId);
          batch.update(docRef, { sisa_hari: currentSisaHari - 1 });

          // Jika setelah dikurangi menjadi 0, matikan relay
          if (currentSisaHari === 1) {
            await rtdb.ref(`kamar_kos/${kamarId}/relay_status`).set("OFF");
            console.log(`🔌 Relay kamar ${kamarId} dimatikan karena sisa_hari habis`);
          }
        }
      }

      await batch.commit();
      console.log("✅ Update sisa_hari selesai");
    } catch (err) {
      console.error("❌ Error dalam cron sisa_hari:", err);
    }
  });
};
