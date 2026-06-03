const express = require("express");
const PlanController = require("../controllers/planController");

const router = express.Router();

/**
 * @openapi
 * /api/plans:
 *   get:
 *     tags:
 *       - Planos
 *     summary: Lista planos ativos.
 *     responses:
 *       200:
 *         description: Lista de planos.
 */
router.get("/", PlanController.list);

module.exports = router;
