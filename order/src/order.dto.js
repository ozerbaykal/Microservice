const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

async function validateDto(data, schema) {
  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    const messages = error.details.map((detail) => detail.message).join(",");
    throw new Error(messages);
  }
  return value;
}

module.exports = { validateDto, loginSchema, registerSchema };
