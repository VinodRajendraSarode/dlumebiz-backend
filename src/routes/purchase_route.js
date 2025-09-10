const purchaseOrderControler = require("../controllers/purchase_order_controller");



const purchaseRouter = require("express").Router();

purchaseRouter.post("/purchases", purchaseOrderControler.create);
purchaseRouter.get("/purchases", purchaseOrderControler.fetch);
purchaseRouter.get("/purchases/company/:id", purchaseOrderControler.fetchByCompany);
purchaseRouter.delete("/purchases/:id", purchaseOrderControler.delete);
purchaseRouter.put("/purchases/:id", purchaseOrderControler.update);
purchaseRouter.get("/purchases/:id", purchaseOrderControler.fetchOrder);

module.exports = purchaseRouter;