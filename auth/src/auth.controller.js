const AuthService = require("./auth.service");
const Joi = require("joi");

class AuthController {
  constructor() {}
  async register(req, res) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      role: Joi.string().valid("user", "admin").default("user"),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    res.status(201).json(value);
  }
  async login(req, res) {}
  async refresh(req, res) {}
  async logout(req, res) {}
}

module.exports = new AuthController();
