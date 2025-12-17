const Joi = require("joi");
const UserSchema = require("../../modules/users.module");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validationStaffSchema,
  validationAdminLogin,
  validationDriverSchema,
} = require("../../validations/adminValidations/admin");
const DriversSchema = require("../../modules/driver.module");
const BusModel = require("../../modules/addBus");
const driverModule = require("../../modules/driver.module");

const LoginAdmin = async (req, res) => {
  const { error, value } = validationAdminLogin.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //find the user
  const tryingToLoginAdmin = await UserSchema.findOne({ email: value.email });
  if (!tryingToLoginAdmin) {
    return res.status(404).json({ message: "user not found" });
  }
  const tryingToLoginAdmins = await UserSchema.find({ email: value.email });
  //compare password
  console.log(tryingToLoginAdmin.password);
  const compare_passwords = await bcrypt.compare(
    value.password,
    tryingToLoginAdmin.password
  );
  if (!compare_passwords) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: tryingToLoginAdmin._id,
      name: tryingToLoginAdmin.name,
      email: tryingToLoginAdmin.email,
      role: "Admin",
    },
    process.env.JWT_SECRETE,
    { expiresIn: process.env.EXPIRES_IN }
  );
  //if password is right
  res
    .status(200)
    .json({ message: "login was successful", tryingToLoginAdmin, token });
};

const registerNewStaff = async (req, res) => {
  const { error, value } = validationStaffSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // find email is existing
  const existing_user = await UserSchema.findOne(value.email);
  if (existing_user) {
    return res.status(400).json({ mesage: "email already exist" });
  }

  try {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(value.password, salt);

    // go on to register user
    const Staff_info = new UserSchema({
      email: value.email,
      name: value.name,
      role: "Staff",
      password: hashed_password,
    });
    await Staff_info.save();
    //send back the user
    const newStaff = {
      email: value.email,
      name: value.name,
    };
    res
      .status(201)
      .json({ message: "Staff successfully registered", newStaff });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "something went wrong if error persists kindly contact the administrator",
    });
  }
};

//get all users
const getUsers = async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "you dont have permission" });
  }
  const Users = await UserSchema.find({});
  res.status(200).json({ message: "sucess", Users });
};

//get all drivers
const getDrivers = async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "you dont have permission" });
  }
  const Users = await BusModel.find({}).populate("Driver", "name email");
  res.status(200).json({ message: "sucess", Users });
};

//get driver by name
const getOneDriver = async (req, res) => {
  const name = req.query.name?.trim();

  console.log("Searching for driver:", name);

  const driver = await driverModule.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });

  if (!driver) {
    return res.status(404).json({
      message: "driver not found",
      allbuses: [],
    });
  }

  const allbuses = await BusModel.find({ Driver: driver._id }).populate(
    "Driver",
    "name email"
  );

  console.log("Buses found:", allbuses.length);

  return res.status(200).json({
    message: "success",
    allbuses,
  });
};

//delete account by admin
const getStaffandDelete = async (req, res) => {
  const id = req.params.id;
  try {
    const staff = await UserSchema.find({
      _id: id,
      role: "Staff",
    });
    if (!staff) {
      return res.status(404).json({ message: " Staff not found " });
    }
    const Staff = await UserSchema.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted Staff" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "something went wrong while trying to delete" });
  }
};

//get user by id
const getUserById = async (req, res) => {
  const id = req.params.id;
  console.log(req.user.name);
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "you dont have permision" });
    }
    const that_user = await UserSchema.findById({ _id: id });
    if (!that_user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ message: "success", that_user });
  } catch (erorr) {}
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  if (req.user !== "Admin")
    return res.status(403).json({ message: "you dont have permision" });

  try {
    const Guest = await UserSchema.find({
      _id: id,
      role: "Guest",
    });
    if (!Guest) return res.status(404).json({ message: "Guest not found" });
    const aboutToDeleteUser = await UserSchema.findByIdAndDelete(id);
    if (!aboutToDeleteUser)
      return res.status(404).json({ message: "user not found " });

    return res.status(200).json({ message: "Deleted Guest" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "something went wrong in deleting Guest" });
  }
};

// register driver
const registerNewDriver = async (req, res) => {
  const { error, value } = validationDriverSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // find email is existing
  const existing_user = await DriversSchema.findOne({ email: value.email });
  if (existing_user) {
    return res.status(400).json({ mesage: "email already exist" });
  }

  try {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(value.password, salt);

    // go on to register user
    const Driver_info = new DriversSchema({
      email: value.email,
      name: value.name,
      role: "Driver",
      password: hashed_password,
    });
    await Driver_info.save();
    //send back the user
    const newDriver = {
      id: Driver_info._id,
      email: value.email,
      name: value.name,
    };
    res
      .status(201)
      .json({ message: "Driver successfully registered", newDriver });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "something went wrong if error persists kindly contact the administrator",
    });
  }
};

module.exports = {
  registerNewStaff,
  getUsers,
  getUserById,
  LoginAdmin,
  deleteUser,
  getStaffandDelete,
  registerNewDriver,
  getDrivers,
  getOneDriver,
};
