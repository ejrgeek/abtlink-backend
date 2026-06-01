const AppError = require("../utils/appError");

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Usuario nao autenticado.", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Acesso restrito a administradores.", 403));
    }

    return next();
  };
}

const requireAdmin = requireRole("ADMIN");

module.exports = {
  requireAdmin,
  requireRole,
};
