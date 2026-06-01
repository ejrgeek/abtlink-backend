const AppError = require("../utils/appError");
const { verifyToken } = require("../utils/jwt");
const UserModel = require("../models/userModel");

async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      throw new AppError("Token ausente.", 401);
    }

    const payload = verifyToken(token);
    const user = await UserModel.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new AppError("Token invalido.", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Token ausente, invalido ou expirado.", 401));
  }
}

module.exports = authenticate;
