const saleOrderControler = require("../controllers/sale_order_controller");




const salesRouter = require("express").Router();

salesRouter.post("/sales", saleOrderControler.create);
salesRouter.get("/sales", saleOrderControler.fetch);
salesRouter.get("/sales/company/:id", saleOrderControler.fetchByCompany);
salesRouter.delete("/sales/:id", saleOrderControler.delete);
salesRouter.put("/sales/:id", saleOrderControler.update);
salesRouter.get("/sales/:id", saleOrderControler.fetchOrder);

module.exports = salesRouter;