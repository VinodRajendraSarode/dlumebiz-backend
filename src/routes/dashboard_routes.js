const dashboardControler = require("../controllers/dashboard_controller");

const dashboardRouter = require("express").Router();
dashboardRouter.get("/getTopSellingProducts", dashboardControler.getTopSellingProducts);
dashboardRouter.get("/getOutOfStocks", dashboardControler.getOutOfStocks);

module.exports = dashboardRouter;
