const { validateDto, loginSchema, registerSchema } = require("./auth.dto");
const authService = require("./auth.service");
const AuthService = require("./auth.service");

class AuthController {
  async register(req, res, next) {
    try {
      //body den gelen veriyi kontrol et
      const value = await validateDto(req.body, registerSchema);
      //servis katmanı ile iletişime geç
      const { refreshToken, ...result } = await AuthService.register(value);
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json(result);
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
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json(result);
    } catch (error) {
      next(error);
    }
  }
  async refresh(req, res, next) {
    try {
      //çerezlerle gelen refresh token'e eriş
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        next(new Error("Refresh tokena erişilemedi"));
      }

      //refresh token geçerli mi kontrol et
      const accessToken = await authService.refresh(refreshToken);

      //client'e gönder
      return res.status(200).json(accessToken);
    } catch (error) {
      next(error);
    }
  }
  async logout(req, res) {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  }
  async getProfile(req, res, next) {}
}

module.exports = new AuthController();
