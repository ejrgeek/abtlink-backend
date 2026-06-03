function notFoundMiddleware(req, res) {
  res.status(404).json({
    message: "Rota nao encontrada.",
    path: req.originalUrl,
  });
}

module.exports = notFoundMiddleware;
