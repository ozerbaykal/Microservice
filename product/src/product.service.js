const ampq = require("amqplib");
const Product = require("./product.model");
const { options } = require("joi");
//Business Logic'i yönetecek ve veritabanı ile iletişime geçecek

class ProductService {
  constructor() {
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
      const connection = await ampq.connect(process.env.RABBITMQ_URL);
      this.channel = await connection.createChannel();
      await this.channel.assertExchange(process.env.RABBITMQ_EXCHANGE, "topic", { durable: true });
      console.log(`Exchange ${process.env.RABBITMQ_EXCHANGE} başarıyla oluşturuldu.`);
      await this.channel.assertQueue(process.env.RABBITMQ_QUEUE);
    } catch (error) {
      console.error(" RabbitMq'ya bağlanamadı", error);
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
}

module.exports = new ProductService();
