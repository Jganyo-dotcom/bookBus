const mongoose = require("mongoose");

const DriversSchema = new mongoose.Schema(
  {
    name: {
      type: String  ,    required: true,
    },
    email: { type: String, unique: true, required: true },
    password: { type: String, minlength: 6, required: true, select: false },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drivers", DriversSchema);
