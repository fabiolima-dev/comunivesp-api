require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const duvidaRoutes = require("./routes/duvidaRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/perfil", userRoutes);
app.use("/duvidas", duvidaRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`✅ Servidor rodando em: ${process.env.BASE_URL}`);
});
