const express = require("express");
const AuthController = require("../controllers/authController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Autenticacao
 *     summary: Cadastra um cliente.
 *     description: Sempre cria usuario com role CUSTOMER. O campo role enviado no body e ignorado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - username
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Joao Benicio
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               username:
 *                 type: string
 *                 example: joao-benicio
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       201:
 *         description: Usuario cadastrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Dados invalidos.
 *       409:
 *         description: Email ou username ja cadastrado.
 */
router.post("/register", AuthController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Autenticacao
 *     summary: Autentica um usuario e retorna JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       401:
 *         description: Credenciais invalidas.
 */
router.post("/login", AuthController.login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Autenticacao
 *     summary: Retorna o usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado.
 *       401:
 *         description: Token ausente, invalido ou expirado.
 */
router.get("/me", authenticate, AuthController.me);

module.exports = router;
