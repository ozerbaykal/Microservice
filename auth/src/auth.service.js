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
  async validateToken(token) {
    try {
      //Acsesstoken geçerli mi kontrol et
      const decoted = jwt.verify(token, process.env.JWT_SECRET);

      //kullanıcıyı id sinden buluyoruz
      const user = await User.findById(decoted.userId);

      //kullanıcı hala aktif mi kontrol et
      if (!user || !user.isActive) {
        throw new Error("Artık bu kullanıcı bulunamıyor");
      }

      //token in içerisinden alınan verileri return ets
      return user;
    } catch (error) {
      throw error;
    }
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
  async login(email, password) {
    try {
      //bu mailde kullanıcı var mı
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Kullanıcı bulunamadı");
      }
      // kullanıcı hesabı aktif mi ?
      if (!user.isActive) {
        throw new Error("Kullanıcı hesabı inaktif");
      }

      //yazılan şifre doğrumu
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new Error("Şifre yanlış");
      }
      // son giriş tarihini güncelle
      user.lastLogin = new Date();
      await user.save();
      //tokenlerı oluştur
      const tokens = this.generateTokens(user);

      //verileri return et
      return { ...tokens, user };
    } catch (error) {
      throw error;
    }
  }
  async refresh(token) {
    try {
      //refresh token geçerli mi kontrol et
      const decoted = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      //kullanıcıyı id sinden buluyoruz
      const user = await User.findById(decoted.userId);

      //kullanıcı hala aktif mi kontrol et
      if (!user || !user.isActive) {
        throw new Error("Artık bu kullanıcı bulunamıyor");
      }
      //yeni accesstoken oluştur
      const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      //yeni accessToken i return et
      return accessToken;
    } catch (error) {
      throw error;
    }
  }
  async logout() {}
}
module.exports = new AuthService();
