const express = require("express");
const { LoginStaff, getUserById } = require("../controllers/staff");
const router = express.Router();

router.post("/login", LoginStaff);
router.get("/User/:id", getUserById);

module.exports = router;
