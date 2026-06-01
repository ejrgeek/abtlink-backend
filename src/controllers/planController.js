const PlanModel = require("../models/planModel");

async function list(req, res) {
  const plans = await PlanModel.listActivePlans();

  res.json({
    plans,
  });
}

module.exports = {
  list,
};
