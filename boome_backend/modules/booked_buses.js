const mongoose = require("mongoose");

const BookedBusSchema = new mongoose.Schema(
  {
    Bus: { type: mongoose.Schema.Types.ObjectId, ref: "Buses", required: true },
    seatNumber: { type: Number, required: true },
    financial_Status: { type: String, required: true, default: "pending" },
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookedBuses", BookedBusSchema);
