const { validateUserDto } = require("./auth.dto");
const AuthService = require("./auth.service");

class AuthController {
  constructor() {}
  async register(req, res, next) {
    try {
      const value = await validateUserDto(req.body);
    } catch (error) {
      next(error);
    }
    res.status(201).json(value);
  }
  async login(req, res) {}
  async refresh(req, res) {}
  async logout(req, res) {}
}

module.exports = new AuthController();
