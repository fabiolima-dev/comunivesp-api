function errorHandler(err, req, res, next) {
  console.error("Erro:", err);

  const status = err.statusCode || 500;
  const message = err.message || "Erro interno no servidor";

  res.status(status).json({
    success: false,
    error: message,
  });
}

module.exports = errorHandler;
