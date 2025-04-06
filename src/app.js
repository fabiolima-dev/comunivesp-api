const express = require("express");
const cors = require("cors");
const pool = require("./db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/usuarios", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM usuarios");
    res.json(resultado.rows);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).send("Erro interno no servidor");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}!`);
});
