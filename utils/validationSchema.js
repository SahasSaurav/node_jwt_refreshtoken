const joi = require("joi");

const registerUserSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().lowercase().required(),
  password: joi
    .string()
    .pattern(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )
    )
    .required(),
  role: joi.string().valid("user", "admin"),
});

const loginUserSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi
    .string()
    .pattern(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )
    )
    .required(),
});

const forgotPasswordSchema = joi.object({
  email: joi.string().email().lowercase().required(),
});

const resetPasswordSchema = joi.object({
  password: joi
    .string()
    .pattern(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )
    )
    .required(),
  repeatPassword: joi.ref("password"),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
