const { validateDto, loginSchema, registerSchema } = require("./auth.dto");
const AuthService = require("./auth.service");

class AuthController {
  async register(req, res, next) {
    try {
      //body den gelen veriyi kontrol et
      const value = await validateDto(req.body, registerSchema);
      //servis katmanı ile iletişime geç
      const { refreshToken, ...result } = await AuthService.register(value);
      res.cookie(refreshToken).status(201).json(result);
    } catch (error) {
      if (error.message === "Bu email'e ait kullanıcı var") {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = await validateDto(req.body, loginSchema);
      const { refreshToken, ...result } = await AuthService.login(email, password);

      res.cookie(refreshToken).status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  async refresh(req, res) {}
  async logout(req, res) {}
}

module.exports = new AuthController();
