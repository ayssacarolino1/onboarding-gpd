import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("API em http://localhost:3000");
});