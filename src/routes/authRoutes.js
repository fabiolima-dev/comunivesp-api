const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

router.post("/solicitacao-cadastro", authController.requestRegistration);

module.exports = router;
