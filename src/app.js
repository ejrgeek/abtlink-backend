const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const apiRoutes = require("./routes/apiRoutes");
const redirectRoutes = require("./routes/redirectRoutes");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
  })
);

app.use(express.json({ limit: "1mb" }));

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - Saude
 *     summary: Verifica se a API esta online.
 *     responses:
 *       200:
 *         description: API online.
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "abtlink-backend",
  });
});

app.use("/api", apiRoutes);
app.use("/api", notFoundMiddleware);
app.use(redirectRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
