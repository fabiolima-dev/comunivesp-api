const express = require("express");
const {
  getUser,
  listarEixos,
  atualizarUsuario,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Rotas públicas
router.get("/eixos", listarEixos);
router.get("/usuario/:id", getUser);

// Rotas protegidas
router.put("/usuario/:id", authMiddleware, atualizarUsuario);

module.exports = router;
