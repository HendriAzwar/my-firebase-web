import express from "express";
import { db, rtdb } from "../firebaseAdmin.js";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Function kirim pesan telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("[Telegram] Bot token atau Chat ID belum di-set di .env");
}

async function kirimPesanTelegram(pesan) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: pesan,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
    };

    console.log("[Telegram] Mengirim pesan ke:", url);
    console.log("[Telegram] Payload:", payload);

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log("[Telegram] Status:", res.status, "ok?", data.ok);
        if (!res.ok || !data.ok) throw new Error(data.description || res.statusText);
        console.log("[Telegram] Sent message_id", data.result.message_id);
        return true;
    } catch (err) {
        console.error("[Telegram] Exception saat kirim:", err.message);
        return false;
    }
}

// Function penilaian status penggunaan
function evaluateStatus(penggunaan, batas) {
    if (batas === null || batas === "-" || isNaN(batas)) return "AMAN";
    const numericBatas = parseFloat(batas);
    const threshold = numericBatas - 10;
    if (penggunaan >= numericBatas) return "OVERLIMIT";
    if (penggunaan >= threshold) return "PERINGATAN";
    return "AMAN";
}

// Konfigurasi MCB
const MCB_CONFIG = {
    mcb1: { collection: "monitoring_listrik_mcb1", rooms: [1, 2, 3] },
    mcb2: { collection: "monitoring_listrik_mcb2", rooms: [4, 5, 6] },
    mcb3: { collection: "monitoring_listrik_mcb3", rooms: [7, 8, 9] },
    mcb4: { collection: "monitoring_listrik_mcb4", rooms: [10, 11, 12] },
};

function getMCBCollectionByRoomId(roomId) {
    for (const key in MCB_CONFIG) {
        if (MCB_CONFIG[key].rooms.includes(Number(roomId))) {
            return MCB_CONFIG[key].collection;
        }
    }
    return null;
}

// Sinkronisasi penggunaan_kwh ke kamar_kos
async function updatePenggunaanKwh(roomId) {
    try {
        console.log(`[UPDATE] Room ${roomId}`);
        const ref = db.collection('kamar_kos').doc(roomId);
        const snap = await ref.get();
        if (!snap.exists) return;

        const data = snap.data();
        const { tanggal_masuk, sisa_hari, batas_kwh, penggunaan_kwh = 0, status_penggunaan: oldStatus } = data;
        if (!tanggal_masuk || !sisa_hari) return;

        const col = getMCBCollectionByRoomId(roomId);
        if (!col) return;

        // Compute total usage
        const start = tanggal_masuk.toDate();
        const end = new Date(start);
        end.setDate(end.getDate() + Number(sisa_hari));
        const usageSnap = await db.collection(col)
            .where('kamar','==',+roomId)
            .where('timestamp','>=',start)
            .where('timestamp','<=',end)
            .get();
        const total = usageSnap.docs.reduce((sum, d) => sum + (d.data().kWh||0), 0);

        const newStatus = evaluateStatus(total, batas_kwh);
        console.log(`[UPDATE] ${total.toFixed(2)}kWh: ${oldStatus} → ${newStatus}`);

        // Update Firestore and RTDB
        await ref.update({ penggunaan_kwh: total, status_penggunaan: newStatus });
        await rtdb.ref(`kamar_kos/${roomId}/relay_status`).set(newStatus==='OVERLIMIT'?'OFF':'ON');

        // Notify if status changed
        if (newStatus !== oldStatus) {
            let pesan;
            if (newStatus === 'PERINGATAN') pesan = `⚠️ *PERINGATAN* kamar *${roomId}*: ${total.toFixed(2)} kWh (Batas ${batas_kwh})`;
            else if (newStatus === 'OVERLIMIT') pesan = `🚨 *OVERLIMIT* kamar *${roomId}*: ${total.toFixed(2)} kWh (Batas ${batas_kwh})`;
            if (pesan) await kirimPesanTelegram(pesan);
        }
    } catch (e) {
        console.error(`[UPDATE] Error room ${roomId}:`, e);
    }
}


// GET all kamar
router.get("/kamar", async (req, res) => {
    try {
        const snap = await db.collection("kamar_kos").orderBy("id").get();
        const data = snap.docs.map((doc) => {
            const docData = doc.data();
            
            // Convert Firebase Timestamps to ISO strings
            if (docData.tanggal_masuk && docData.tanggal_masuk.toDate) {
                docData.tanggal_masuk = docData.tanggal_masuk.toDate().toISOString();
            }
            if (docData.tanggal_keluar && docData.tanggal_keluar.toDate) {
                docData.tanggal_keluar = docData.tanggal_keluar.toDate().toISOString();
            }
            
            return docData;
        });
        res.json(data);
    } catch (err) {
        console.error("Error get kamar:", err);
        res.status(500).json({ error: "Gagal ambil data kamar" });
    }
});

// GET kamar by id
router.get("/kamar/:id", async (req, res) => {
    try {
        const snap = await db.collection("kamar_kos").doc(req.params.id).get();
        if (!snap.exists) return res.status(404).json({ error: "Kamar tidak ditemukan" });
        
        const docData = snap.data();
        
        // Convert Firebase Timestamps to ISO strings
        if (docData.tanggal_masuk && docData.tanggal_masuk.toDate) {
            docData.tanggal_masuk = docData.tanggal_masuk.toDate().toISOString();
        }
        if (docData.tanggal_keluar && docData.tanggal_keluar.toDate) {
            docData.tanggal_keluar = docData.tanggal_keluar.toDate().toISOString();
        }
        
        res.json(docData);
    } catch (err) {
        console.error("Error get kamar id:", err);
        res.status(500).json({ error: "Gagal ambil data kamar" });
    }
});

// POST /kamar/:id/register
router.post("/kamar/:id/register", async (req, res) => {
    const { nama_lengkap, nomor_telepon_pengguna_kos, batas_kwh, sisa_hari } = req.body;
    const id = req.params.id;
    try {
        const ref = db.collection("kamar_kos").doc(id);
        const snap = await ref.get();
        if (!snap.exists) return res.status(404).json({ error: "Kamar tidak ditemukan" });

        const data = snap.data();
        if (data.status_kamar === 1) return res.status(400).json({ error: "Kamar sudah ditempati" });

        await ref.update({
            nama_lengkap,
            nomor_telepon_pengguna_kos,
            status_kamar: 1,
            sisa_hari: Number(sisa_hari) || 30,
            penggunaan_kwh: 0,
            batas_kwh: Number(batas_kwh) || null,
            tanggal_masuk: admin.firestore.Timestamp.now(),
            status_penggunaan: "AMAN"
        });
        await updatePenggunaanKwh(id);
        res.json({ message: "Pendaftaran berhasil", roomId: id, nama_lengkap });
    } catch (err) {
        console.error("Register kamar gagal:", err);
        res.status(500).json({ error: "Gagal registrasi kamar" });
    }
});

// PUT /kamar/:id/tenant
router.put("/kamar/:id/tenant", async (req, res) => {
    console.log("[ROUTER] PUT /kamar/:id/tenant dipanggil, id =", req.params.id, "body =", req.body);
    const id = req.params.id;
    const { nama_lengkap, nomor_telepon_pengguna_kos, batas_kwh } = req.body;
    try {
        const ref = db.collection("kamar_kos").doc(id);
        const snap = await ref.get(); 
        if (!snap.exists) return res.status(404).json({ error: "Kamar tidak ditemukan" });
        const old = snap.data();
        
        // Update data dan batas
        await ref.update({ 
            nama_lengkap, 
            nomor_telepon_pengguna_kos, 
            batas_kwh: Number(batas_kwh) 
        });
        
        // Evaluate status berdasarkan penggunaan current dan batas baru
        const usage = old.penggunaan_kwh || 0;
        const status = evaluateStatus(usage, batas_kwh);
        
        await ref.update({ status_penggunaan: status });
        await updatePenggunaanKwh(id);
        await rtdb.ref(`kamar_kos/${id}/relay_status`).set(status === 'OVERLIMIT' ? 'OFF' : 'ON');
        
        // ✅ TAMBAHAN: Kirim notifikasi manual jika status berubah menjadi PERINGATAN/OVERLIMIT
        if(status === "PERINGATAN") {
            const pesan = `⚠️ *Peringatan KWH* untuk kamar *${id}*!
            _Penggunaan_: ${usage.toFixed(2)} kWh
            _Batas Baru_: ${batas_kwh} kWh
            _Berhematlah dalam penggunaan listrik dan jangan terlalu boros, batas penggunaan listrik anda hampir mencapai batas._`;
            const sukses = await kirimPesanTelegram(pesan);
            console.log(`[Telegram] Notifikasi PERINGATAN kamar ${id} sukses?`, sukses);
        }else if (status === 'OVERLIMIT') {
            const pesan = `🚨 *OVERLIMIT* untuk kamar *${id}*!
            _Penggunaan_: ${usage.toFixed(2)} kWh
            _Batas Baru_: ${batas_kwh} kWh
            _Relay telah dimatikan otomatis, harap hubungi pemilik kos untuk penambahan kWh._`;
            const sukses = await kirimPesanTelegram(pesan);
            console.log(`[Telegram] Notifikasi OVERLIMIT kamar ${id} sukses?`, sukses);
        }
        res.json({ message: "Update berhasil", roomId: id, status_penggunaan: status });
    } catch (err) {
        console.error("Update tenant gagal:", err);
        res.status(500).json({ error: "Gagal update data" });
    }
});

// DELETE /kamar/:id/tenant
router.delete("/kamar/:id/tenant", async (req, res) => {
    const id = req.params.id;
    try {
        const ref = db.collection("kamar_kos").doc(id);
        const snap = await ref.get();
        if (!snap.exists) return res.status(404).json({ error: "Kamar tidak ditemukan" });

        await ref.update({
            nama_lengkap: "-",
            nomor_telepon_pengguna_kos: "-",
            status_kamar: 0,
            sisa_hari: "-",
            penggunaan_kwh: "-",
            batas_kwh: "-",
            status_penggunaan: null,
            tanggal_masuk: null,
            tanggal_keluar: new Date()
        });

        res.json({ message: "Kamar dikosongkan", roomId: id });
    } catch (err) {
        console.error("Hapus tenant gagal:", err);
        res.status(500).json({ error: "Gagal hapus data" });
    }
});

// POST /kamar/:id/sinkron-kwh
router.post("/kamar/:id/sinkron-kwh", async (req, res) => {
    try {
        await updatePenggunaanKwh(req.params.id);
        res.json({ message: `Kamar ${req.params.id} disinkronkan.` });
    } catch (err) {
        console.error("Sinkronisasi gagal:", err);
        res.status(500).json({ error: "Gagal sinkronkan kWh" });
    }
});

// PUT /kamar/:id/kwh
router.put("/kamar/:id/kwh", async (req, res) => {
    const { penggunaan_kwh } = req.body;
    const id = req.params.id;
    try {
        const ref = db.collection("kamar_kos").doc(id);
        await ref.update({ penggunaan_kwh });
        await updatePenggunaanKwh(id);
        res.json({ message: "kWh diperbarui", roomId: id });
    } catch (err) {
        console.error("Update kWh gagal:", err);
        res.status(500).json({ error: "Gagal update kWh" });
    }
});

// PUT /kamar/:id/sisa-hari
router.put("/kamar/:id/sisa-hari", async (req, res) => {
    const { sisa_hari } = req.body;
    const id = req.params.id;
    try {
        const ref = db.collection("kamar_kos").doc(id);
        await ref.update({ sisa_hari: Number(sisa_hari) });
        await updatePenggunaanKwh(id);
        res.json({ message: "Sisa hari diperbarui", roomId: id });
    } catch (err) {
        console.error("Update sisa hari gagal:", err);
        res.status(500).json({ error: "Gagal update sisa hari" });
    }
});

router.post("/kamar/sinkron-semua", async (req, res) => {
    try {
        const snap = await db.collection("kamar_kos").where("status_kamar", "==", 1).get();
        const promises = snap.docs.map(doc => updatePenggunaanKwh(doc.id));
        await Promise.all(promises);
        res.json({ 
            message: `${snap.docs.length} kamar berhasil disinkronkan`,
            kamar_ids: snap.docs.map(doc => doc.id)
        });
    } catch (err) {
        console.error("Sinkronisasi semua kamar gagal:", err);
        res.status(500).json({ error: "Gagal sinkronkan semua kamar" });
    }
});

// PUT /kamar/:id/relay
router.put("/kamar/:id/relay", async (req, res) => {
    const { relay_status } = req.body;
    const id = req.params.id;
    if (!["ON", "OFF"].includes(relay_status)) {
        return res.status(400).json({ error: "relay_status harus 'ON' atau 'OFF'" });
    }
    try {
        await rtdb.ref(`kamar_kos/${id}/relay_status`).set(relay_status); // pakai rtdb
        res.json({ message: `Relay kamar ${id} berhasil diatur ke ${relay_status}` });
    } catch (err) {
        console.error("Gagal update relay:", err);
        res.status(500).json({ error: "Gagal update relay" });
    }
});

export default router;
