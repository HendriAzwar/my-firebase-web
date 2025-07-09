// backend/server.js
import dotenv from "dotenv";
dotenv.config(); // ⬅️ Pindahkan ke paling atas

import express from "express";
import cors from "cors";
import graphRoutes from "./routes/graph.js";
import roomRoutes from "./routes/room.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: "https://golden-seahorse-ff992c.netlify.app"
}));
app.use(express.json());

app.use("/api/grafik", graphRoutes);
app.use("/api", roomRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend API is running successfully 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
