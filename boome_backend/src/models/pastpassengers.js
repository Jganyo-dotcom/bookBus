const mongoose = require("mongoose");

const BookedBusSchema = new mongoose.Schema(
  {
    Bus: { type: mongoose.Schema.Types.ObjectId, ref: "Buses", required: true },
    seatNumber: { type: Number, required: true },
    bus_no: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    Boarding: { type: Boolean, default: false, required: true },
    terminal: { type: String, default: "N/A", required: true },
    section: { type: String, required: true },
    Time_Boarding: { type: String, default: "N/A" },
    financial_Status: { type: String, required: true, default: "pending" },
    price: { type: String, default: "N/A", required: true },
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PastbookedBuses", BookedBusSchema);
