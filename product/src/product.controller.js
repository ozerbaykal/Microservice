const ProductService = require("./product.service");
class ProductController {
  constructor() {}
  async createProduct(req, res, next) {
    try {
      res.status(200).json({ message: "başarılı" });
    } catch (error) {}
  }
  async getAllProducts(req, res, next) {
    try {
      res.status(200).json({ message: "başarılı" });
    } catch (error) {}
  }
  async getProduct(req, res, next) {
    try {
      res.status(200).json({ message: "başarılı" });
    } catch (error) {}
  }
  async updateProduct(req, res, next) {
    try {
      res.status(200).json({ message: "başarılı" });
    } catch (error) {}
  }
  async updateStock(req, res, next) {
    try {
      res.status(200).json({ message: "başarılı" });
    } catch (error) {}
  }
  async deleteProduct(req, res, next) {
    try {
      res.status(200).json({ message: "başarılı" });
    } catch (error) {}
  }
}

module.exports = new ProductController();
