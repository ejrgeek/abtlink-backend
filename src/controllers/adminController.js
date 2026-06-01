const AppError = require("../utils/appError");
const AdminModel = require("../models/adminModel");

const userRoles = ["ADMIN", "CUSTOMER"];
const linkStatuses = ["ACTIVE", "ARCHIVED", "EXPIRED", "BLOCKED"];

const planIntegerFields = [
  "monthlyPriceCents",
  "annualPriceCents",
  "monthlyDiscountPercent",
  "annualDiscountPercent",
  "linkLimit",
  "qrCodeLimit",
  "customDomainLimit",
  "analyticsRetentionDays",
];

function parseBoolean(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new AppError(`${fieldName} deve ser booleano.`, 400);
}

function parseNonNegativeInteger(value, fieldName) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 0) {
    throw new AppError(`${fieldName} deve ser um inteiro maior ou igual a zero.`, 400);
  }

  return number;
}

function validatePlanPayload(body, { partial = false } = {}) {
  const data = {};

  if (body.name !== undefined) {
    const name = String(body.name || "").trim();

    if (!name) {
      throw new AppError("Nome do plano e obrigatorio.", 400);
    }

    data.name = name;
  } else if (!partial) {
    throw new AppError("Nome do plano e obrigatorio.", 400);
  }

  for (const field of planIntegerFields) {
    if (body[field] !== undefined) {
      data[field] = parseNonNegativeInteger(body[field], field);
    }
  }

  if (body.isActive !== undefined) {
    data.isActive = parseBoolean(body.isActive, "isActive");
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("Nenhum campo valido informado.", 400);
  }

  return data;
}

function handleUniqueError(error, message) {
  if (error.code === "P2002") {
    throw new AppError(message, 409);
  }

  throw error;
}

async function overview(req, res) {
  const overviewData = await AdminModel.getOverview();

  res.json({
    overview: overviewData,
  });
}

async function listUsers(req, res) {
  const role = req.query.role ? String(req.query.role).toUpperCase() : undefined;

  if (role && !userRoles.includes(role)) {
    throw new AppError("Role invalida.", 400);
  }

  const users = await AdminModel.listUsers({
    role,
    isActive: parseBoolean(req.query.isActive, "isActive"),
    search: req.query.search ? String(req.query.search).trim() : undefined,
  });

  res.json({
    users,
  });
}

async function getUser(req, res) {
  const user = await AdminModel.getUserById(req.params.id);

  if (!user) {
    throw new AppError("Usuario nao encontrado.", 404);
  }

  res.json({
    user,
  });
}

async function updateUser(req, res) {
  const target = await AdminModel.getUserById(req.params.id);

  if (!target) {
    throw new AppError("Usuario nao encontrado.", 404);
  }

  const data = {};

  if (req.body.role !== undefined) {
    const role = String(req.body.role).toUpperCase();

    if (!userRoles.includes(role)) {
      throw new AppError("Role invalida.", 400);
    }

    if (target.id === req.user.id && role !== "ADMIN") {
      throw new AppError("O admin nao pode remover o proprio perfil administrativo.", 400);
    }

    data.role = role;
  }

  if (req.body.isActive !== undefined) {
    const isActive = parseBoolean(req.body.isActive, "isActive");

    if (target.id === req.user.id && !isActive) {
      throw new AppError("O admin nao pode desativar a propria conta.", 400);
    }

    data.isActive = isActive;
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("Informe role ou isActive para atualizar.", 400);
  }

  const user = await AdminModel.updateUser(target.id, data);

  res.json({
    message: "Usuario atualizado com sucesso.",
    user,
  });
}

async function deleteUser(req, res) {
  const target = await AdminModel.getUserById(req.params.id);

  if (!target) {
    throw new AppError("Usuario nao encontrado.", 404);
  }

  if (target.id === req.user.id) {
    throw new AppError("O admin nao pode excluir a propria conta.", 400);
  }

  const user = await AdminModel.softDeleteUser(target.id);

  res.json({
    message: "Usuario removido com sucesso.",
    user,
  });
}

async function listLinks(req, res) {
  const status = req.query.status ? String(req.query.status).toUpperCase() : undefined;

  if (status && !linkStatuses.includes(status)) {
    throw new AppError("Status de link invalido.", 400);
  }

  const links = await AdminModel.listLinks({
    status,
    userId: req.query.userId ? String(req.query.userId) : undefined,
  });

  res.json({
    links,
  });
}

async function getLink(req, res) {
  const link = await AdminModel.getLinkById(req.params.id);

  if (!link) {
    throw new AppError("Link nao encontrado.", 404);
  }

  res.json({
    link,
  });
}

async function updateLink(req, res) {
  const target = await AdminModel.getLinkById(req.params.id);

  if (!target) {
    throw new AppError("Link nao encontrado.", 404);
  }

  const data = {};

  if (req.body.status !== undefined) {
    const status = String(req.body.status).toUpperCase();

    if (!linkStatuses.includes(status)) {
      throw new AppError("Status de link invalido.", 400);
    }

    data.status = status;
  }

  if (req.body.title !== undefined) {
    data.title = req.body.title ? String(req.body.title).trim() : null;
  }

  if (req.body.description !== undefined) {
    data.description = req.body.description ? String(req.body.description).trim() : null;
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("Informe status, title ou description para atualizar.", 400);
  }

  const link = await AdminModel.updateLink(target.id, data);

  res.json({
    message: "Link atualizado com sucesso.",
    link,
  });
}

async function deleteLink(req, res) {
  const target = await AdminModel.getLinkById(req.params.id);

  if (!target) {
    throw new AppError("Link nao encontrado.", 404);
  }

  const link = await AdminModel.softDeleteLink(target.id);

  res.json({
    message: "Link removido com sucesso.",
    link,
  });
}

async function listPlans(req, res) {
  const plans = await AdminModel.listPlans({ includeInactive: true });

  res.json({
    plans,
  });
}

async function getPlan(req, res) {
  const plan = await AdminModel.getPlanById(req.params.id);

  if (!plan) {
    throw new AppError("Plano nao encontrado.", 404);
  }

  res.json({
    plan,
  });
}

async function createPlan(req, res) {
  const data = validatePlanPayload(req.body);

  try {
    const plan = await AdminModel.createPlan(data);

    res.status(201).json({
      message: "Plano criado com sucesso.",
      plan,
    });
  } catch (error) {
    handleUniqueError(error, "Ja existe um plano com esse nome.");
  }
}

async function updatePlan(req, res) {
  const target = await AdminModel.getPlanById(req.params.id);

  if (!target) {
    throw new AppError("Plano nao encontrado.", 404);
  }

  const data = validatePlanPayload(req.body, { partial: true });

  try {
    const plan = await AdminModel.updatePlan(target.id, data);

    res.json({
      message: "Plano atualizado com sucesso.",
      plan,
    });
  } catch (error) {
    handleUniqueError(error, "Ja existe um plano com esse nome.");
  }
}

async function deletePlan(req, res) {
  const target = await AdminModel.getPlanById(req.params.id);

  if (!target) {
    throw new AppError("Plano nao encontrado.", 404);
  }

  const plan = await AdminModel.softDeletePlan(target.id);

  res.json({
    message: "Plano removido com sucesso.",
    plan,
  });
}

module.exports = {
  createPlan,
  deleteLink,
  deletePlan,
  deleteUser,
  getLink,
  getPlan,
  getUser,
  listLinks,
  listPlans,
  listUsers,
  overview,
  updateLink,
  updatePlan,
  updateUser,
};
