const express = require("express");
const {
  add_Bus,
  deleteBus,
  allbuses,
  Bus_Boarding,
  queryBus,
  updateBus,
} = require("../../controllers/adminsController/bus");
const {
  Checkrole,
  checkrole,
  CheckroleonAll,
} = require("../../middlewares/role");
const { AlreadyBookedseats } = require("../../controllers/user");
const { upload } = require("../../middlewares/cloud");
const authmiddleware = require("../../middlewares/auth");
const router = express.Router();

router.post("/add-bus", upload.single("image"), add_Bus);

router.get("/Staff/buses", authmiddleware, checkrole, allbuses);

router.get("/bus-number", authmiddleware, CheckroleonAll, queryBus); // route to query a bus by number
router.get("/takenSeats/:busId", authmiddleware, AlreadyBookedseats);
router.delete("/delete/:id/:di", authmiddleware, Checkrole, deleteBus);
router.patch("/update/:id", authmiddleware, Checkrole, updateBus); //update bus
router.patch("/boarding/:id", authmiddleware, Checkrole, Bus_Boarding); //set a bus as a boarding

module.exports = router;
