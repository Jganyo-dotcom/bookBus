const express = require("express");
const {
  registerNewUser,
  LoginUser,
  BookBus,
  AlreadyBookedseats,
  CancelBooking,
  availableBuses,
  MyBookings,
  allAvalableBuses,
} = require("../controllers/user");
const authmiddleware = require("../middlewares/auth");
const router = express.Router();

router.post("/register", registerNewUser);
router.post("/login", LoginUser);
router.post("/booking", authmiddleware, availableBuses);
router.get("/availableBuses", authmiddleware, allAvalableBuses);
router.get("/bookedseats/:busId", authmiddleware, AlreadyBookedseats);
router.post("/booking/:id", authmiddleware, BookBus);
router.get("/mybookings", authmiddleware, MyBookings);
router.delete("/cancel_booking/:bookingId", authmiddleware, CancelBooking);

module.exports = router;
