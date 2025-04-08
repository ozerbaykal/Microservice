const { validateDto, productSchema } = require("./product.dto");
const ProductService = require("./product.service");
class ProductController {
  async createProduct(req, res, next) {
    try {
      //client'ten gelen veriyi kontrol et
      const productData = await validateDto(req.body, productSchema);

      //veritabanına ürünü kaydet
      const product = await ProductService.createProduct(productData);

      //client'a cevap gönder
      res.status(201).json({ product });
    } catch (error) {
      next(error);
    }
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
