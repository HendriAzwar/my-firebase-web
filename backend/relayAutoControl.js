import dotenv from 'dotenv';
import { rtdb } from './firebaseAdmin.js';

dotenv.config();

console.log('🔍 process.env.BACKEND_URL_KAMAR =', process.env.BACKEND_URL_KAMAR);

const BACKEND_URL = process.env.BACKEND_URL_KAMAR;
const BATAS_ARUS_TOTAL = 1.0;               // Ampere
const COLLECTION = 'monitoring_listrik_mcb1';

const arusPerKamar = {1:0,2:0,3:0};

console.log('🚀 relayAutoControl aktif, backend:', BACKEND_URL);

rtdb.ref(COLLECTION).on('child_added', async snap => {
  const d = snap.val();
  if (!d.kamar || typeof d.arus!=='number') return;
  arusPerKamar[d.kamar] = d.arus;
  const total = Object.values(arusPerKamar).reduce((a,b)=>a+b,0);
  console.log(`Total arus=${total.toFixed(2)}A`);
  if (total > BATAS_ARUS_TOTAL) {
    const kamarMax = Object.entries(arusPerKamar)
                          .sort(([,a],[,b])=>b-a)[0][0];
    console.log(`Overload → OFF relay kamar ${kamarMax}`);
    try {
      const res = await fetch(
        `${BACKEND_URL}/kamar/${kamarMax}/relay`,
        { method:'PUT',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({relay_status:'OFF'})
        }
      );
      if (!res.ok) throw new Error(res.status);
      console.log(`Relay ${kamarMax} OFF sukses`);
    } catch(err){
      console.error('Gagal OFF relay:', err.message);
    }
  }
});
