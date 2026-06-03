const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../config/swagger");

const router = express.Router();

router.get("/docs.json", (req, res) => {
  res.json(swaggerSpec);
});

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
