const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

router.post("/solicitacao-cadastro", authController.requestRegistration);

router.get("/verificar-email", authController.verificarEmailHandler);

router.patch("/finalizar-cadastro", authController.finalizarCadastro);

router.post("/login", authController.login);

module.exports = router;
