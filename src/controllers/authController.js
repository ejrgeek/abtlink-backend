const AppError = require("../utils/appError");
const UserModel = require("../models/userModel");
const { comparePassword, hashPassword } = require("../utils/password");
const { createToken } = require("../utils/jwt");
const { isReservedUsername, sanitizeSlug } = require("../utils/slug");

function validateRegisterBody(body) {
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const username = sanitizeSlug(body.username || "");
  const password = String(body.password || "");

  if (!name || !email || !username || !password) {
    throw new AppError("Nome, email, username e senha sao obrigatorios.", 400);
  }

  if (!email.includes("@")) {
    throw new AppError("Email invalido.", 400);
  }

  if (isReservedUsername(username)) {
    throw new AppError("Username reservado. Escolha outro.", 400);
  }

  if (password.length < 8) {
    throw new AppError("A senha deve ter pelo menos 8 caracteres.", 400);
  }

  return {
    name,
    email,
    username,
    password,
  };
}

async function register(req, res) {
  const data = validateRegisterBody(req.body);
  const existingUser = await UserModel.findByEmailOrUsername(data.email, data.username);

  if (existingUser) {
    throw new AppError("Email ou username ja cadastrado.", 409);
  }

  const passwordHash = await hashPassword(data.password);
  const user = await UserModel.createCustomer({
    name: data.name,
    email: data.email,
    username: data.username,
    passwordHash,
  });

  const token = createToken(user);

  res.status(201).json({
    message: "Usuario cadastrado com sucesso.",
    user,
    token,
  });
}

async function login(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    throw new AppError("Email e senha sao obrigatorios.", 400);
  }

  const user = await UserModel.findByEmailWithPassword(email);

  if (!user || !user.isActive) {
    throw new AppError("Credenciais invalidas.", 401);
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Credenciais invalidas.", 401);
  }

  const { passwordHash, ...safeUser } = user;
  const token = createToken(safeUser);

  res.json({
    message: "Login realizado com sucesso.",
    user: safeUser,
    token,
  });
}

async function me(req, res) {
  res.json({
    user: req.user,
  });
}

module.exports = {
  login,
  me,
  register,
};
