const AppError = require("../utils/appError");
const env = require("../config/env");
const LinkModel = require("../models/linkModel");
const { generateQRCodeDataUrl } = require("../utils/qrCode");
const { randomSlug, sanitizeSlug } = require("../utils/slug");

function validateUrl(value) {
  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("invalid protocol");
    }

    return url.toString();
  } catch (error) {
    throw new AppError("URL original invalida.", 400);
  }
}

async function resolveAvailableSlug(userId, desiredSlug) {
  const slug = sanitizeSlug(desiredSlug);

  if (slug) {
    const existing = await LinkModel.findByUserAndSlug(userId, slug);

    if (existing) {
      throw new AppError("Slug ja usado por este usuario.", 409);
    }

    return slug;
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const generated = randomSlug();
    const existing = await LinkModel.findByUserAndSlug(userId, generated);

    if (!existing) {
      return generated;
    }
  }

  throw new AppError("Nao foi possivel gerar um slug unico.", 500);
}

async function create(req, res, next) {
  try {
    const originalUrl = validateUrl(String(req.body.originalUrl || "").trim());
    const slug = await resolveAvailableSlug(req.user.id, req.body.slug);
    const shortUrl = `${env.shortDomain}/${req.user.username}/${slug}`;
    const qrCodeBase64 = await generateQRCodeDataUrl(shortUrl);

    const link = await LinkModel.createLink({
      userId: req.user.id,
      originalUrl,
      domain: env.shortDomain,
      slug,
      shortUrl,
      title: req.body.title ? String(req.body.title).trim() : null,
      description: req.body.description ? String(req.body.description).trim() : null,
      qrCodeBase64,
    });

    res.status(201).json({
      message: "Link criado com sucesso.",
      link,
    });
  } catch (error) {
    next(error);
  }
}

async function listMine(req, res, next) {
  try {
    const links = await LinkModel.listByUser(req.user.id);

    res.json({
      links,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  listMine,
};
