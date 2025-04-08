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
      //arama parametreleri ile gelen değerlere erişelim
      const query = {
        title: req.query.title,
        category: req.query.category,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      };

      //service katmanında veritabından verileri al
      const products = await ProductService.getAllProducts(query);
      //hiç ürün yoksa
      if (products.length < 1) {
        res.status(404).json({
          message: " Aranılan kriterlere uygun Ürün bulunamadı",
          products: [],
        });
      }
      //ürünler bulunduysa
      res.status(200).json({ results: products.length + " adet ürün bulundu.", products });
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
