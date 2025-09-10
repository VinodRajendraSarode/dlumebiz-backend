const express = require("express");
const reportController = require("../controllers/report_controller");
const reportRouter = express.Router();

reportRouter.get("/reports/sales", reportController.salesReport);
reportRouter.get("/reports/purchses", reportController.purchaseReport);
reportRouter.get("/reports/stocks", reportController.stockReport);
reportRouter.get("/reports/low_stocks", reportController.lowStock);
reportRouter.get("/reports/balancesheet", reportController.balancesheet);
module.exports = reportRouter;
