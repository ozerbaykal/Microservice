const ampq = require("amqplib");
const Product = require("./product.model");
const { options } = require("joi");
//Business Logic'i yönetecek ve veritabanı ile iletişime geçecek

class ProductService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.init();
  }
  async init() {
    try {
      await this.initializeRabbitMq();
    } catch (error) {
      console.error("Hata: ", error);
    }
  }

  async initializeRabbitMq() {
    try {
      this.connection = await ampq.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(process.env.RABBITMQ_PRODUCT_QUEUE);
      //product kuyruğuna gelen mesajları dinle
      this.channel.consume(process.env.RABBITMQ_PRODUCT_QUEUE, async (data) => {
        try {
          //kanaldan gelen mesaja eriş
          const orderData = JSON.parse(data.content.toString());
          console.log("products kuyruğuna gelen mesaj", orderData);
          //stock'ları güncelleyecek methodu çaıştır
          await this.processOrder(orderData);
          //kuyruğa işlemin başarılı olduğunu bildir
          this.channel.ack(data);
        } catch (error) {
          //kuyruga işlemin başarısız olduğunu bildir
          this.channel.nack(data);
        }
      });

      console.log("RabbitMQ'ya bağlandı");
    } catch (error) {
      console.error(" RabbitMq'ya bağlanamadı", error);
    }
  }
  // sipariş edilne her ürünü için stock eksiltir
  async processOrder(orderData) {
    const { products } = orderData;

    for (const product of products) {
      await this.updateStock(product.productId, -product.quantity);
    }
  }
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw error;
    }
  }
  async getAllProducts(query = {}) {
    try {
      const filter = { isActive: true };
      if (query.title) filter.name = { $regex: query.title, $options: "i" };
      if (query.category) filter.category = query.category;
      if (query.minPrice) filter.price = { $gte: query.minPrice };
      if (query.maxPrice) filter.price = { ...filter.price, $lte: query.maxPrice };
      return await Product.find(filter);
    } catch (error) {
      throw error;
    }
  }
  async getProductById(procuctId) {
    try {
      return await Product.findById(procuctId);
    } catch (error) {
      throw error;
    }
  }
  async updateProduct(id, data) {
    try {
      return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    } catch (error) {
      throw error;
    }
  }

  async updateStock(id, quantity) {
    try {
      //ürün yoksa hata gönder
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Ürün bulunamadı");
      }
      //stock 0'ın altındaysa hata gönder
      const newStock = product.stock + quantity;
      if (newStock < 0) {
        throw new Error("Yetersiz stock");
      }
      //veritabanına yeni stockları ekle
      return await Product.findByIdAndUpdate(id, { $inc: { stock: quantity } }, { new: true });
    } catch (error) {
      throw error;
    }
  }
  async deleteProduct(id) {
    try {
      return await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductService();
