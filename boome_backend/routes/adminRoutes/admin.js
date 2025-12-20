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
} = require("../../controllers/adminsController/admin");
const { Checkrole, CheckroleonAll } = require("../../middlewares/role");
const authmiddleware = require("../../middlewares/auth");
const { allbuses } = require("../../controllers/adminsController/bus");
const router = express.Router();

router.post("/login", LoginAdmin);
router.post("/staff/register", authmiddleware, Checkrole, registerNewStaff);
router.get("/allguests", authmiddleware, Checkrole, getUsers);
router.get("/alldrivers", authmiddleware, Checkrole, getDrivers);
router.get("/driver", authmiddleware, Checkrole, getOneDriver); //query name
router.get("/Admin/buses", authmiddleware, Checkrole, allbuses);
router.post("/driver/register", authmiddleware, registerNewDriver);
router.delete("/delete/driver/:id", authmiddleware, deleteDriver);
router.get("/delete/sta/:id", authmiddleware, getStaffandDelete);
router.get("/delete/:id", authmiddleware, deleteUser);
router.get("/:id", authmiddleware, Checkrole, getUserById);

module.exports = router;
