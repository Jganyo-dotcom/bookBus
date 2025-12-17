const Joi = require("joi");

//register new staff
const validationStaffSchema = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

//register new Driver
const validationDriverSchema = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validationAdminLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validateaddingBus = Joi.object({
  Driver: Joi.string().hex().length(24).required(),
  Busname: Joi.string().min(5).required(),
  imgeUrl: Joi.string(),
  from: Joi.string().min(2).required(),
  to: Joi.string().min(2).required(),
  bus_no: Joi.string().min(6).required(),
  seats: Joi.number().required(),
  type: Joi.string().min(6).required(),
  Boarding: Joi.boolean().default(false),
  terminal: Joi.string().default("N/A"),
  date: Joi.date().optional(),
  section: Joi.string().required(),
  Time_Boarding: Joi.string().default("N/A").optional(),
});

//patch for Buses to Board
const validateBoardingBus = Joi.object({
  Boarding: Joi.boolean().required(),
  terminal: Joi.string().required(),
  section: Joi.string().required(),
  Time_Boarding: Joi.string().required(),
});

module.exports = {
  validationStaffSchema,
  validationAdminLogin,
  validateaddingBus,
  validationDriverSchema,
  validateBoardingBus,
};
