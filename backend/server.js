// backend/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import graphRoutes from "./routes/graph.js";
import roomRoutes from "./routes/room.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/grafik", graphRoutes);
app.use("/api", roomRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
