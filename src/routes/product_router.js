const productController = require("../controllers/product_controller");

const productRouter = require("express").Router();

productRouter.post("/product", productController.createProduct);
productRouter.get("/product/:id", productController.fetchProduct);
productRouter.get("/product/category/:id", productController.fetchByCategory);
productRouter.delete("/product/:id", productController.delete);
productRouter.put("/product/:id", productController.update);
productRouter.get("/product", productController.fetchProducts);

module.exports = productRouter;