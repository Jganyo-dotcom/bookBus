const UserSchema = require("../modules/users.module");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validationStaffLogin = require("../validations/staff");

const LoginStaff = async (req, res) => {
  const { error, value } = validationStaffLogin.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //find the user
  const tryingToLoginStaff = await UserSchema.find({ email: value.email });
  if (!tryingToLoginUser) {
    res.status(404).json({ message: "user not found" });
  }
  //compare passwords and login
  const compare_passwords = await bcrypt.compare(password, value.password);
  if (!compare_passwords) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: tryingToLoginStaff._id,
      name: tryingToLoginStaff.name,
      email: tryingToLoginStaff.email,
      role: "Staff",
    },
    process.env.JWT_SECRETE,
    { expiresIn: process.env.EXPIRES_IN }
  );
  //if password is right
  res
    .status(200)
    .json({ message: "login was successful", tryingToLoginStaff }, token);
};

//get user by id
const getUserById = async (req, res) => {
  const id = req.params.id;
  console.log(req.user.name);
  try {
    if (req.user.role !== "Staff") {
      return res.status(403).json({ message: "you dont have permision" });
    }
    const that_user = await UserSchema.findById({ _id: id });
    if (!that_user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ message: "success", that_user });
  } catch (erorr) {}
};

module.exports = { LoginStaff, getUserById };
