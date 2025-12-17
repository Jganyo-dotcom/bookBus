const Joi = require("joi");

const validationForRegisterSchema = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validationForLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validationForBookingSchema = Joi.object({
  seatNumber: Joi.number().required(),
  financial_Status: Joi.string().min(6).default("pending"),
});

module.exports = {
  validationForRegisterSchema,
  validationForLogin,
  validationForBookingSchema,
};
