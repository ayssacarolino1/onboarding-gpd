import express from "express";
import cors from "cors";
import prisma from "./lib/prisma.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("API em http://localhost:3000");
});

//testar conexão com o banco de dados
app.get("/api/test-db", async (_req, res) => {
  try {
    await prisma.$connect();

    res.json({
      status: "ok",
      message: "Conexão com PostgreSQL realizada com sucesso!"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Erro ao conectar com o banco de dados."
    });
  }
});

app.use("/api/auth", authRoutes);

