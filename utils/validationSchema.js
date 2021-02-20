const joi = require("joi");

const registerUserSchema = joi
  .object({
    name: joi.string().required().label("Name").trim(),
    email: joi.string().email().lowercase().required().label("Email").trim(),
    password: joi
      .string()
      .pattern(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      )
      .required()
      .label("Password")
      .trim(),
    role: joi.string().valid("user", "admin").label("User Role"),
  })
  .options({ abortEarly: false });// to show a detailed error message instead of aborting on the first occurrence of the error which is the default behavior of joi

const loginUserSchema = joi
  .object({
    email: joi.string().email().lowercase().required().label("Email").trim(),
    password: joi
      .string()
      .pattern(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      )
      .required()
      .label("Password")
      .trim(),
  })
  .options({ abortEarly: false });//to show a detailed error message instead of aborting on the first occurrence of the error which is the default behavior of joi

const forgotPasswordSchema = joi
  .object({
    email: joi.string().email().lowercase().required().label("Email").trim(),
  })
  .options({ abortEarly: false });//to show a detailed error message instead of aborting on the first occurrence of the error which is the default behavior of joi

const resetPasswordSchema = joi
  .object({
    password: joi
      .string()
      .pattern(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      )
      .required()
      .label("Password")
      .trim(),
    repeatPassword: joi
      .string()
      .pattern(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      )
      .required()
      .trim()
      .valid(joi.ref("password"))
      .label("Confirm Password"),
  })
  .options({ abortEarly: false });//to show a detailed error message instead of aborting on the first occurrence of the error which is the default behavior of joi

module.exports = {
  registerUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
