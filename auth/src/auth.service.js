const ampq = require("amqplib");
//Business Logic'i yönetecek ve veritabanı ile iletişime geçecek

class AuthService {
  constructor() {
    this.channel = null;
    console.log("initializeRabbitMq fonksiyonu başlatılıyor...");
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
      console.log("RabbitMQ bağlantısı başlatılıyor...");

      const connection = await ampq.connect(process.env.RABBITMQ_URL);
      console.log("RabbitMQ bağlantısı sağlandı.");
      this.channel = await connection.createChannel();
      console.log("Kanal oluşturuldu.");
      await this.channel.assertExchange(process.env.RABBITMQ_EXCHANGE, "topic", { durable: true });
      console.log(`Exchange ${process.env.RABBITMQ_EXCHANGE} başarıyla oluşturuldu.`);
      await this.channel.assertQueue(process.env.RABBITMQ_QUEUE);
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
console.log("AuthService modülü başlatılıyor...");
module.exports = new AuthService();
