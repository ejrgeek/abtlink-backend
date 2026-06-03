const express = require("express");
const LinkController = require("../controllers/linkController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @openapi
 * /api/links:
 *   post:
 *     tags:
 *       - Links
 *     summary: Cria um link encurtado com QR Code.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 example: https://loja.example.com/produto
 *               slug:
 *                 type: string
 *                 example: minha-loja
 *               title:
 *                 type: string
 *                 example: Minha loja
 *               description:
 *                 type: string
 *                 example: Link da minha loja principal
 *     responses:
 *       201:
 *         description: Link criado.
 *       401:
 *         description: Token ausente ou invalido.
 */
router.post("/", authenticate, LinkController.create);

/**
 * @openapi
 * /api/links:
 *   get:
 *     tags:
 *       - Links
 *     summary: Lista links do usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de links.
 *       401:
 *         description: Token ausente ou invalido.
 */
router.get("/", authenticate, LinkController.listMine);

module.exports = router;
