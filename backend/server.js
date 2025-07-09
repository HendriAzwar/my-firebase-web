// backend/server.js
import express from "express";
import cors from "cors";
// import bodyParser from "body-parser";
// import authRoutes from './routes/auth.js';
import graphRoutes from "./routes/graph.js";
import roomRoutes from "./routes/room.js";

const app = express();
const PORT = process.env.PORT || 5000; // ✅ penting untuk Railway / Render

app.use(cors({
  origin: "https://golden-seahorse-ff992c.netlify.app" // ganti dengan domain netlifymu
}));
app.use(express.json());

// app.use('/api/auth', authRoutes);
app.use("/api/grafik", graphRoutes);
app.use("/api", roomRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend API is running successfully 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
