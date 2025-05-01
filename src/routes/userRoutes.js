const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/usuario/:id", userController.getUser);

module.exports = router;
