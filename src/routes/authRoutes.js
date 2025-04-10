const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Cadastro
router.post("/solicitacao-cadastro", authController.requestRegistration);
router.get("/verificar-email", authController.verificarEmailHandler);
router.patch("/finalizar-cadastro", authController.finalizarCadastro);

// Login
router.post("/login", authController.login);

module.exports = router;
