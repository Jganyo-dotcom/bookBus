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
  from: Joi.string().min(2).required(),
  to: Joi.string().min(2).required(),
  type: Joi.string().min(6).required(),
  Boarding: Joi.boolean().default(false),
  date: Joi.date().optional(),
  section: Joi.string().required(),
  bus_no: Joi.string().required(),
});

const validateBookingBus = Joi.object({
  from: Joi.string().min(2).required(),
  to: Joi.string().min(2).required(),
  seats: Joi.number().required(),
  type: Joi.string().min(6).required(),
  Boarding: Joi.boolean().default(false),
  date: Joi.date().optional(),
  section: Joi.string().required(),
});

module.exports = {
  validationForRegisterSchema,
  validationForLogin,
  validationForBookingSchema,
  validateBookingBus,
};
