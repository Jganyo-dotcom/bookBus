const {
  validationForRegisterSchema,
  validationForLogin,
  validationForBookingSchema,
  validateBookingBus,
} = require("../validations/user");
const Joi = require("joi");
const UserSchema = require("../modules/users.module");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validateBoardingBus,
} = require("../validations/adminValidations/admin");
const bookedbusesSchema = require("../modules/booked_buses");
const BusSchema = require("../modules/addBus");

const registerNewUser = async (req, res) => {
  const { error, value } = validationForRegisterSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // find email is existing
  const existing_user = await UserSchema.findOne({ email: value.email });
  if (existing_user) {
    return res.status(400).json({ mesage: "email already exist" });
  }

  try {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(value.password, salt);

    // go on to register user
    const User_info = await UserSchema({
      email: value.email,
      name: value.name,
      role: "Guest",
      password: hashed_password,
    });
    await User_info.save();
    //send back the user
    const newUser = {
      email: value.email,
      name: value.name,
    };
    res.status(201).json({ message: "user successfully registered", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "something went wrong if error persists kindly contact the administrator",
    });
  }
};

const LoginUser = async (req, res) => {
  const { error, value } = validationForLogin.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //find the user
  const tryingToLoginUser = await UserSchema.findOne({ email: value.email });
  if (!tryingToLoginUser) {
    res.status(404).json({ message: "user not found" });
  }
  console.log(tryingToLoginUser.password);
  //compare passwords and login
  const compare_passwords = await bcrypt.compare(
    value.password,
    tryingToLoginUser.password
  );
  if (!compare_passwords) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: tryingToLoginUser._id,
      name: tryingToLoginUser.name,
      email: tryingToLoginUser.email,
      role: "Guest",
    },
    process.env.JWT_SECRETE,
    { expiresIn: process.env.EXPIRES_IN }
  );

  //if password is right
  res
    .status(200)
    .json({ message: "login was successful", tryingToLoginUser, token });
};
// get taken seats
const AlreadyBookedseats = async (req, res) => {
  const BusId = req.params.busId;
  console.log(BusId);
  try {
    const full = await bookedbusesSchema.find(
      { Bus: BusId },
      { seatNumber: 1, _id: 0 }
    );
    const bookedSeats = full.map((b) => b.seatNumber);
    return res.status(200).json({ message: "succcess", bookedSeats });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "something went wrong while booking your bus",
    });
  }
};

const availableBuses = async (req, res) => {
  try {
    const { error, value } = validateBookingBus.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    if (value.Boarding === "true") {
      const Boarding = true;
    } else {
      Boarding = false;
    }
    console.log(value.seats);
    const Buses = await BusSchema.find({
      from: value.from,
      to: value.to,
      type: value.type,
      date: value.date,
      seats: parseInt(value.seats),
      section: value.section,
      Boarding: Boarding,
    });
    console.log(value.seats);
    console.log(typeof Boarding);
    console.log("searched");
    if (!Buses || Buses.length === 0)
      return res.status(404).json({ message: "No Buses available" });
    console.log(Buses);
    return res.status(200).json({ message: "Success", Buses });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong while getting avalable buses" });
  }
};

const BookBus = async (req, res) => {
  const busId = req.params.id;
  console.log(busId);
  const { error, value } = validationForBookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const taken = await bookedbusesSchema.findOne({
    Bus: busId,
    seatNumber: value.seatNumber,
  });
  if (taken) {
    return res.status(400).json({ message: "Already booked" });
  }
  const validateseat = await BusSchema.findById({ _id: busId });
  console.log(validateseat.seats);
  if (value.seatNumber > validateseat.seats)
    return res.status(400).json({ error: "exceeded maxi seat" });
  try {
    const BookBus = bookedbusesSchema({
      Bus: busId,
      seatNumber: value.seatNumber,
      financial_status: value.financial_status,
      passenger: req.user.id,
    });
    await BookBus.save();
    res.status(201).json({
      message: "booking is awaiting payment to complete transaction",
      BookBus,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong while booking your bus",
    });
  }
};

const CancelBooking = async (req, res) => {
  const passengerId = req.user.id;
  const busId = req.params.busId;
  const seatNumber = parseInt(req.query.seat);
  try {
    if (req.user.id !== passengerId)
      return res.status(400).json({ message: "Not allowed" });
    const findBus = await bookedbusesSchema.findOne({
      Bus: busId,
      passenger: passengerId,
      seatNumber: seatNumber,
    });
    if (!findBus) return res.status(404).json({ message: "booking not found" });
    const cancelledBus = await bookedbusesSchema.findOneAndDelete({
      Bus: busId,
      passenger: passengerId,
      seatNumber: seatNumber,
    });
    res.status(200).json({ messagee: "Ride is cancelled" });
  } catch (error) {
    message: "something went wrong while booking your bus";
  }
};

module.exports = {
  registerNewUser,
  LoginUser,
  BookBus,
  AlreadyBookedseats,
  CancelBooking,
  availableBuses,
};
