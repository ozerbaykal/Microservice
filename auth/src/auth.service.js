const ampq = require("amqplib");
const jwt = require("jsonwebtoken");
const User = require("./auth.model");
//Business Logic'i yönetecek ve veritabanı ile iletişime geçecek

class AuthService {
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
  generateTokens(user) {
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  async register(userData) {
    //aynı maile kayıtlı  kullanıcı var mı ?
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Bu email'e ait kullanıcı var");
    }
    //kullanıcıyı veri tabanına kaydet
    const user = new User(userData);
    await user.save();
    //kullanıcının tokenlerini oluştur
    const tokens = this.generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    return { user, ...tokens };
  }
  async login() {}
  async refresh() {}
  async logout() {}
}
module.exports = new AuthService();
