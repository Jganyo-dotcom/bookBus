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
  date: Joi.date().required(),
  section: Joi.string().required(),
  Time_Boarding: Joi.string().default("N/A").optional(),
  price: Joi.string().default("N/A").optional(),
});

//patch for Buses to Board
const validateBoardingBus = Joi.object({
  Boarding: Joi.boolean().optional(),
  terminal: Joi.string().optional().min(6),
  section: Joi.string().optional().min(5),
  Time_Boarding: Joi.string().optional().min(2),
  section: Joi.string().optional().min(6),
  to: Joi.string().optional().min(2),
  from: Joi.string().optional().min(2),
  seats: Joi.number().optional(),
  type: Joi.string().min(6).optional(),
  date: Joi.date().optional(),
  price: Joi.string().optional(),
});

module.exports = {
  validationStaffSchema,
  validationAdminLogin,
  validateaddingBus,
  validationDriverSchema,
  validateBoardingBus,
};
