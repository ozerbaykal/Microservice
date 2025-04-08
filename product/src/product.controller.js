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
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Ürün bulunamadı" });
      }
      res.status(200).json({ product });
    } catch (error) {
      next(error);
    }
  }
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedProduct = await ProductService.updateProduct(id, updatedData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }

      res.status(200).json({ product: updatedProduct });
    } catch (error) {
      next(error);
    }
  }
  async updateStock(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== "number") {
        return res.status(400).json({ error: "Miktar,sayı değerinde olmalı" });
      }
      const updatedProduct = await ProductService.updateStock(id, quantity);

      res.status(200).json({ amount: updatedProduct.stock, stock: updatedProduct });
    } catch (error) {
      next(error);
    }
  }
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deletedProduct = await ProductService.deleteProduct(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }

      res.status(200).json({ message: " Ürün başarı ile silindi" });
    } catch (error) {}
  }
}

module.exports = new ProductController();
