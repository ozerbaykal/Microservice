const { validateUserDto } = require("./auth.dto");
const AuthService = require("./auth.service");

class AuthController {
  async register(req, res, next) {
    try {
      //body den gelen veriyi kontrol et
      const value = await validateUserDto(req.body);
      //servis katmanı ile iletişime geç
      const result = await AuthService.register(value);
      res.status(201).json(result);
    } catch (error) {
      if (error.message === "Bu email'e ait kullanıcı var") {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  }
  async login(req, res) {}
  async refresh(req, res) {}
  async logout(req, res) {}
}

module.exports = new AuthController();
