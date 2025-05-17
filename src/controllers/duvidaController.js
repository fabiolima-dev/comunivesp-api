const prisma = require("../lib/prisma");

const duvidaController = {
  async create(req, res) {
    try {
      const { titulo, descricao, alunoId } = req.body;

      // Verifica se o aluno existe
      const aluno = await prisma.usuarios.findUnique({
        where: { id: alunoId },
      });

      if (!aluno) {
        return res.status(404).json({ error: "Aluno não encontrado" });
      }

      const duvida = await prisma.duvidas.create({
        data: {
          titulo,
          descricao,
          alunoId,
          status: "ABERTA", // Status padrão
        },
        include: {
          aluno: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      return res.status(201).json(duvida);
    } catch (error) {
      console.error("Erro ao criar dúvida:", error);
      return res.status(500).json({ error: "Erro ao criar dúvida" });
    }
  },

  async list(req, res) {
    try {
      const duvidas = await prisma.duvidas.findMany({
        include: {
          aluno: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
        orderBy: {
          dataCriacao: "desc",
        },
      });

      return res.json(duvidas);
    } catch (error) {
      console.error("Erro ao listar dúvidas:", error);
      return res.status(500).json({ error: "Erro ao listar dúvidas" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const duvida = await prisma.duvidas.findUnique({
        where: { id: Number(id) },
        include: {
          aluno: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          professor: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      if (!duvida) {
        return res.status(404).json({ error: "Dúvida não encontrada" });
      }

      return res.json(duvida);
    } catch (error) {
      console.error("Erro ao buscar dúvida:", error);
      return res.status(500).json({ error: "Erro ao buscar dúvida" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.usuarioId; // Corrigido para usar usuarioId do middleware

      // Busca a dúvida para verificar se existe e se o usuário tem permissão
      const duvida = await prisma.duvidas.findUnique({
        where: { id: Number(id) },
      });

      if (!duvida) {
        return res.status(404).json({ error: "Dúvida não encontrada" });
      }

      // Verifica se o usuário é o autor da dúvida
      if (duvida.alunoId !== userId) {
        return res
          .status(403)
          .json({ error: "Você não tem permissão para deletar esta dúvida" });
      }

      // Deleta todas as mensagens relacionadas primeiro
      await prisma.mensagens.deleteMany({
        where: { duvidaId: Number(id) },
      });

      // Deleta a dúvida
      await prisma.duvidas.delete({
        where: { id: Number(id) },
      });

      return res.status(204).send(); // Retorna 204 No Content para deleção bem-sucedida
    } catch (error) {
      console.error("Erro ao deletar dúvida:", error);
      return res.status(500).json({ error: "Erro ao deletar dúvida" });
    }
  },

  async getComentarios(req, res) {
    try {
      const { id } = req.params;

      // Verifica se a dúvida existe
      const duvida = await prisma.duvidas.findUnique({
        where: { id: Number(id) },
      });

      if (!duvida) {
        return res.status(404).json({ error: "Dúvida não encontrada" });
      }

      // Busca todas as mensagens da dúvida
      const mensagens = await prisma.mensagens.findMany({
        where: { duvidaId: Number(id) },
        orderBy: {
          dataEnvio: "asc",
        },
      });

      return res.json(mensagens);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
      return res.status(500).json({ error: "Erro ao buscar comentários" });
    }
  },

  async createComentario(req, res) {
    try {
      const { id } = req.params;
      const { conteudo } = req.body;
      const autorId = req.usuarioId;

      // Verifica se a dúvida existe
      const duvida = await prisma.duvidas.findUnique({
        where: { id: Number(id) },
      });

      if (!duvida) {
        return res.status(404).json({ error: "Dúvida não encontrada" });
      }

      // Busca informações do autor
      const autor = await prisma.usuarios.findUnique({
        where: { id: autorId },
      });

      if (!autor) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Cria a mensagem
      const mensagem = await prisma.mensagens.create({
        data: {
          conteudo,
          duvidaId: Number(id),
          autorId,
          autorNome: autor.nome,
        },
      });

      return res.status(201).json(mensagem);
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      return res.status(500).json({ error: "Erro ao criar comentário" });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, professorId } = req.body;

      // Verifica se a dúvida existe
      const duvida = await prisma.duvidas.findUnique({
        where: { id: Number(id) },
      });

      if (!duvida) {
        return res.status(404).json({ error: "Dúvida não encontrada" });
      }

      // Atualiza o status da dúvida
      const updatedDuvida = await prisma.duvidas.update({
        where: { id: Number(id) },
        data: { status, professorId },
      });

      return res.json(updatedDuvida);
    } catch (error) {
      console.error("Erro ao atualizar status da dúvida:", error);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar status da dúvida" });
    }
  },
};

module.exports = duvidaController;
