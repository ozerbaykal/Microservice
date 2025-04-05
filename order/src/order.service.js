const ampq = require("amqplib");
//Business Logic'i yönetecek ve veritabanı ile iletişime geçecek

class OrderService {
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
  static async createOrder() {}
  static async getOrder() {}
  static async refresh() {}
  static async logout() {}
}

module.exports = new OrderService();
