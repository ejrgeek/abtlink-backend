const express = require("express");
const AdminController = require("../controllers/adminController");
const authenticate = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(authenticate, requireAdmin);

/**
 * @openapi
 * /api/admin/overview:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Retorna indicadores gerais da plataforma.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Indicadores administrativos.
 *       403:
 *         description: Acesso restrito a administradores.
 */
router.get("/overview", AdminController.overview);

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Lista usuarios para administracao.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, CUSTOMER]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 */
router.get("/users", AdminController.listUsers);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Detalha um usuario.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado.
 *       404:
 *         description: Usuario nao encontrado.
 */
router.get("/users/:id", AdminController.getUser);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Atualiza role ou status ativo de um usuario.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, CUSTOMER]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario atualizado.
 */
router.patch("/users/:id", AdminController.updateUser);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Remove um usuario por soft delete.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario removido.
 */
router.delete("/users/:id", AdminController.deleteUser);

/**
 * @openapi
 * /api/admin/links:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Lista links de todos os usuarios.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, ARCHIVED, EXPIRED, BLOCKED]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de links.
 */
router.get("/links", AdminController.listLinks);

/**
 * @openapi
 * /api/admin/links/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Detalha um link.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Link encontrado.
 */
router.get("/links/:id", AdminController.getLink);

/**
 * @openapi
 * /api/admin/links/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Atualiza status ou metadados de um link.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, ARCHIVED, EXPIRED, BLOCKED]
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Link atualizado.
 */
router.patch("/links/:id", AdminController.updateLink);

/**
 * @openapi
 * /api/admin/links/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Remove um link por soft delete.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Link removido.
 */
router.delete("/links/:id", AdminController.deleteLink);

/**
 * @openapi
 * /api/admin/plans:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Lista todos os planos nao removidos.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de planos.
 */
router.get("/plans", AdminController.listPlans);

/**
 * @openapi
 * /api/admin/plans:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Cria um plano.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PlanInput"
 *     responses:
 *       201:
 *         description: Plano criado.
 */
router.post("/plans", AdminController.createPlan);

/**
 * @openapi
 * /api/admin/plans/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Detalha um plano.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plano encontrado.
 */
router.get("/plans/:id", AdminController.getPlan);

/**
 * @openapi
 * /api/admin/plans/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Atualiza um plano.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PlanInput"
 *     responses:
 *       200:
 *         description: Plano atualizado.
 */
router.patch("/plans/:id", AdminController.updatePlan);

/**
 * @openapi
 * /api/admin/plans/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Remove um plano por soft delete.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plano removido.
 */
router.delete("/plans/:id", AdminController.deletePlan);

module.exports = router;
