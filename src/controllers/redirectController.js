const AppError = require("../utils/appError");
const ClickModel = require("../models/clickModel");
const LinkModel = require("../models/linkModel");
const { getRequestInfo } = require("../utils/requestInfo");

async function redirect(req, res) {
  const link = await LinkModel.findByUsernameAndSlug(req.params.username, req.params.slug);

  if (!link) {
    throw new AppError("Link nao encontrado.", 404);
  }

  if (link.expiresAt && link.expiresAt <= new Date()) {
    throw new AppError("Link expirado.", 410);
  }

  await ClickModel.createClick({
    linkId: link.id,
    userId: link.userId,
    ...getRequestInfo(req),
  });

  await LinkModel.incrementClickCount(link.id);

  res.redirect(302, link.originalUrl);
}

module.exports = {
  redirect,
};
