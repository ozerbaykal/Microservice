const express = require("express");
const productController = require("./product.controller");

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.put("/:id/stock", productController.updateStock);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
