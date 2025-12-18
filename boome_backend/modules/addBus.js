const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema(
  {
    Busname: { type: String, minlength: 5, required: true },
    bus_no: { type: String, unique: true, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    imageUrl: { type: String, default: "no image" },
    seats: { type: Number, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: false, default: "N/A" },
    Boarding: { type: Boolean, default: false, required: true },
    terminal: { type: String, default: "N/A", required: true },
    section: { type: String, required: true },
    Time_Boarding: { type: String, required: true },
    Driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drivers",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Buses", BusSchema);
