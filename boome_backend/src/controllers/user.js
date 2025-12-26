const {
  validationForRegisterSchema,
  validationForLogin,
  validationForBookingSchema,
  validateBookingBus,
  validatepayment,
} = require("../validations/user");
const Joi = require("joi");
const UserSchema = require("../models/users.module");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validateBoardingBus,
} = require("../validations/adminValidations/admin");
const bookedbusesSchema = require("../models/booked_buses");
const BusSchema = require("../models/addBus");
const PastbookedBuses = require("../models/pastpassengers");

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
    const Buses = await BusSchema.find({
      from: value.from,
      to: value.to,
      type: value.type,
      date: value.date,
      seats: parseInt(value.seats),
      section: value.section,
      Boarding: Boarding,
      price: value.price,
    });
    if (!Buses || Buses.length === 0)
      return res.status(404).json({ message: "No Buses available" });
    console.log(`${req.user.name} with email ${req.user.email} requested `);
    return res.status(200).json({ message: "Success", Buses });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while getting avalable buses" });
  }
};

/**
 * GET /guest/availableBuses
 * Query params:
 *  - page (default 1)
 *  - limit (default 9)
 *  - from, to, type, section, seats (optional filters)
 *
 * Response:
 *  { Buses: [...], totalPages, currentPage }
 */
const allAvalableBuses = async (req, res) => {
  try {
    // Parse pagination params with defaults
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, parseInt(req.query.limit || "9", 10));
    const skip = (page - 1) * limit;

    // Build filter object from query params
    const { from, to, type, section, seats, date } = req.query;
    const filter = {};

    if (from) filter.from = from;
    if (to) filter.to = to;
    if (type) filter.type = type;
    if (date) filter.date = date;
    if (section) filter.section = section;
    if (seats) {
      // If seats is provided, match buses with at least that many seats
      // (adjust logic if you want exact match instead)
      const seatsNum = parseInt(seats, 10);
      if (!Number.isNaN(seatsNum)) filter.seats = seatsNum;
    }

    // Count total matching documents
    const totalCount = await BusSchema.countDocuments(filter).exec();

    if (totalCount === 0) {
      return res.status(404).json({
        message: "No Buses available",
        Buses: [],
        totalPages: 0,
        currentPage: page,
      });
    }

    // Fetch paginated buses
    const buses = await BusSchema.find(filter)
      .sort({ createdAt: -1 }) // optional: newest first
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const totalPages = Math.ceil(totalCount / limit);

    // Optional logging for auditing
    if (req.user) {
      console.log(
        `${req.user.name} <${req.user.email}> requested available buses (page ${page}, limit ${limit})`
      );
    } else {
      console.log(
        `Anonymous request for available buses (page ${page}, limit ${limit})`
      );
    }

    return res.status(200).json({
      message: "Success",
      Buses: buses,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("allAvalableBuses error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong while getting available buses" });
  }
};

module.exports = {
  allAvalableBuses,
};

const MyBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const pastBookings = await PastbookedBuses.find({ passenger: req.user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const pastCount = await PastbookedBuses.countDocuments({
      passenger: req.user.id,
    });

    if (pastBookings.length === 0) {
      return res.status(404).json({ message: "No records were found" });
    }

    return res.status(200).json({
      message: "Success",
      pastBookings,
      pagination: {
        page,
        limit,
        total: pastCount,
        totalPages: Math.ceil(pastCount / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while getting available buses" });
  }
};

const BookBus = async (req, res) => {
  const busId = req.params.id;
  const { error, value } = validationForBookingSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const taken = await bookedbusesSchema.findOne({
    Bus: busId,
    seatNumber: value.seatNumber,
  });
  if (taken) return res.status(400).json({ message: "Already booked" });

  const validateseat = await BusSchema.findById(busId);
  if (value.seatNumber > validateseat.seats)
    return res.status(400).json({ error: "exceeded max seat" });

  try {
    const booking = new bookedbusesSchema({
      Bus: busId,
      seatNumber: value.seatNumber,
      from: value.from,
      to: value.to,
      type: value.type,
      Boarding: value.Boarding,
      date: value.date,
      financial_Status: "pending",
      passenger: req.user.id,
      bus_no: value.bus_no,
      section: value.section,
      price: value.price,
    });
    await booking.save();
    const pastP = new PastbookedBuses({
      Bus: busId,
      seatNumber: value.seatNumber,
      from: value.from,
      to: value.to,
      type: value.type,
      Boarding: value.Boarding,
      date: value.date,
      financial_Status: "pending",
      passenger: req.user.id,
      bus_no: value.bus_no,
      section: value.section,
      price: value.price,
      Booked_type: booking._id,
    });
    await pastP.save();

    res.status(201).json({
      message: "Booking is awaiting payment to complete transaction",
      booking,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong while booking your bus" });
  }
};

const CancelBooking = async (req, res) => {
  const passengerId = req.user.id;
  const bookingId = req.params.bookingId;
  try {
    const findBus = await bookedbusesSchema.findOne({
      _id: bookingId,
      passenger: passengerId,
    });
    const past_findBus = await PastbookedBuses.findOne({
      Bookin_type: bookingId,
      passenger: passengerId,
    });
    if (!findBus && !past_findBus)
      return res.status(404).json({ message: "booking not found" });
    const cancelledBus = await bookedbusesSchema.findOneAndDelete({
      _id: bookingId,
      passenger: passengerId,
    });
    const past_cancelledBus = await PastbookedBuses.findOneAndDelete({
      Booked_type: bookingId,
      passenger: passengerId,
    });
    res.status(200).json({ messagee: "Ride is deleted" });
  } catch (error) {
    message: "something went wrong while booking your bus";
  }
};

// Assume you have io available from your socket.io setup
// e.g. in server.js: const io = require("socket.io")(server);

const payment = async (req, res) => {
  try {
    console.log("Payment attempt");
    const bookingId = req.params.id;

    // validate body
    const { error, value } = validatepayment.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // find booking
    const bus = await bookedbusesSchema.findById(bookingId);
    if (!bus) return res.status(404).json({ message: "Booking not found" });

    // check price and passenger
    if (
      String(bus.price).trim() === String(value.price).trim() &&
      bus.passenger.toString() === req.user.id
    ) {
      // update booking
      const updatedBooking = await bookedbusesSchema.findByIdAndUpdate(
        bookingId,
        { financial_Status: "confirmed" },
        { new: true }
      );

      // update past bookings
      const associatedBus = await BusSchema.findById(bus.Bus);
      const updatethem = await PastbookedBuses.findOneAndUpdate(
        { bus_no: bus.bus_no, passenger: req.user.id },
        {
          financial_Status: "confirmed",
        },
        { new: true }
      );

      // since the pastboookings has the correct messages
      const updateMe = await bookedbusesSchema.findOneAndUpdate(
        { bus_no: bus.bus_no, passenger: req.user.id },
        {
          financial_Status: "confirmed",
          terminal: updatethem.terminal,
          Time_Boarding: updatethem.Time_Boarding,
        },
        { new: true }
      );

      return res.status(200).json({
        message: `Payment of ${value.price} confirmed for Elikem Transport`,
        booking: updateMe,
      });
    } else {
      return res.status(400).json({ message: "Invalid payment details" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error while processing payment" });
  }
};

const getPassengers = async (req, res) => {
  const busId = req.params.id;
  try {
    const passengers = await bookedbusesSchema
      .find({ Bus: busId })
      .populate("passenger", "name email");
    if (!passengers || passengers.length === 0)
      return res.status(404).json({ message: "not found" });
    return res.status(200).json({ message: "success", passengers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "an error occured" });
  }
};

module.exports = {
  registerNewUser,
  LoginUser,
  BookBus,
  AlreadyBookedseats,
  CancelBooking,
  availableBuses,
  allAvalableBuses,
  MyBookings,
  payment,
  getPassengers,
};
