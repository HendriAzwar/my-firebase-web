// backend/firebaseAdmin.js
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kosan-gang-saleh-default-rtdb.asia-southeast1.firebasedatabase.app" // ✅ RTDB di sini
  });
}

const db = admin.firestore();        // Firestore
const rtdb = admin.database();       // ✅ Tambahkan Realtime Database instance

export { db, rtdb };

