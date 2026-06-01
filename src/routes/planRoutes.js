const express = require("express");
const RedirectController = require("../controllers/redirectController");

const router = express.Router();

/**
 * @openapi
 * /{username}/{slug}:
 *   get:
 *     tags:
 *       - Redirecionamento
 *     summary: Redireciona para a URL original de um link curto.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirecionamento para a URL original.
 *       404:
 *         description: Link nao encontrado.
 */
router.get("/:username/:slug", RedirectController.redirect);

module.exports = router;
