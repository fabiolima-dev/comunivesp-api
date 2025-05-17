const { Router } = require("express");
const duvidaController = require("../controllers/duvidaController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

// Rota para listar todas as dúvidas
router.get("/", duvidaController.list);

// Rota para buscar uma dúvida específica
router.get("/:id", duvidaController.getById);

// Rota para atualizar status da duvida
router.patch("/:id/ajudar", duvidaController.atualizarStatus);

// Rota para buscar os comentários de uma dúvida
router.get("/:id/comentarios", duvidaController.getComentarios);

// Rota para criar um novo comentário em uma dúvida
router.post(
  "/:id/comentarios",
  authMiddleware,
  duvidaController.createComentario
);

// Rota para criar uma nova dúvida (requer autenticação)
router.post("/", authMiddleware, duvidaController.create);

// Rota para deletar uma dúvida (requer autenticação)
router.delete("/:id", authMiddleware, duvidaController.delete);

module.exports = router;
