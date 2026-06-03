const express = require("express");
const adminRoutes = require("./adminRoutes");
const authRoutes = require("./authRoutes");
const docsRoutes = require("./docsRoutes");
const linkRoutes = require("./linkRoutes");
const planRoutes = require("./planRoutes");

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/links", linkRoutes);
router.use("/plans", planRoutes);
router.use("/", docsRoutes);

module.exports = router;
