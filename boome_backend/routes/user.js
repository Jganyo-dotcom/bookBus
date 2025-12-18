const express = require("express");
const {
  registerNewUser,
  LoginUser,
  BookBus,
  AlreadyBookedseats,
  CancelBooking,
  availableBuses,
} = require("../controllers/user");
const authmiddleware = require("../middlewares/auth");
const router = express.Router();

router.post("/register", registerNewUser);
router.post("/login", LoginUser);
router.post("/booking", authmiddleware, availableBuses);
router.get("/bookedBus/:busId", authmiddleware, AlreadyBookedseats);
router.post("/booking/:id", authmiddleware, BookBus);
router.delete("/cancel_booking/:busId", authmiddleware, CancelBooking);

module.exports = router;
