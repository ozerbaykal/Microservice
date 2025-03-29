const ampq = require("amqplib ");
//Business Logic'i yönetecek ve veritabanı ile iletişime geçecek

class AuthService {
  constructor() {
    this.initializeRabbitMq();
  }
  async initializeRabbitMq() {
    try {
      const connection = await ampq.connect(process.env.RABBITMQ_URL);
      console.log("RabbitMq'ya bağlandı");
    } catch (error) {
      console.error(" RabbitMq'ya bağlanamadı", error);
    }
  }
  static async register() {}
  static async login() {}
  static async refresh() {}
  static async logout() {}
}

module.exports = new AuthService();
