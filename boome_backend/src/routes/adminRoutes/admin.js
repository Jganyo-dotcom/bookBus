const express = require("express");
const {
  registerNewStaff,
  getUsers,
  getUserById,
  LoginAdmin,
  getStaffandDelete,
  deleteUser,
  registerNewDriver,
  getDrivers,
  getOneDriver,
  deleteDriver,
  canceltrip,
} = require("../../controllers/adminsController/admin");
const { Checkrole, CheckroleonAll } = require("../../middlewares/role");
const authmiddleware = require("../../middlewares/auth");
const { allbuses } = require("../../controllers/adminsController/bus");
const { getPassengers } = require("../../controllers/user");
const router = express.Router();

router.post("/login", LoginAdmin);
router.post("/staff/register", authmiddleware, Checkrole, registerNewStaff);
router.get("/allguests", authmiddleware, getUsers);
router.get("/alldrivers", authmiddleware, Checkrole, getDrivers);
router.get("/driver", authmiddleware, Checkrole, getOneDriver); //query name
router.get("/Admin/buses", authmiddleware, Checkrole, allbuses);
router.post("/driver/register", authmiddleware, Checkrole,registerNewDriver);
router.delete("/delete/driver/:id", authmiddleware, Checkrole,deleteDriver);
router.get("/delete/sta/:id", authmiddleware,Checkrole, getStaffandDelete);
router.delete("/delete/trip/:id/:di", authmiddleware, Checkrole,canceltrip); // del a trip
router.get("/delete/:id", authmiddleware, Checkrole,deleteUser);
router.get("/:id/passengers", authmiddleware, Checkrole,getPassengers); // get the passengers
router.get("/:id", authmiddleware, Checkrole, getUserById);

module.exports = router;
