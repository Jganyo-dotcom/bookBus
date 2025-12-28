const { request } = require("express");
const BusSchema = require("../../models/addBus");
const {
  validateaddingBus,
  validateBoardingBus,
} = require("../../validations/adminValidations/admin");
const driverModule = require("../../models/driver.module");

const { cloudinary } = require("../../middlewares/cloud");
const booked_buses = require("../../models/booked_buses");
const { getIO } = require("../../../utils/socket");
const pastpassengers = require("../../models/pastpassengers");

const add_Bus = async (req, res) => {
  const { error, value } = validateaddingBus.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // check if bus already exists by bus_no
  const existing_bus = await BusSchema.findOne({ bus_no: value.bus_no });
  if (existing_bus) {
    return res.status(400).json({ message: "Bus already exists" });
  }

  try {
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "buses",
      });
      imageUrl = result.secure_url;
    }

    const newbus = new BusSchema({
      Driver: value.Driver,
      Busname: value.Busname,
      from: value.from,
      to: value.to,
      seats: value.seats,
      bus_no: value.bus_no,
      imageUrl: imageUrl, // now Cloudinary URL
      type: value.type,
      Boarding: value.Boarding,
      terminal: value.terminal,
      date: value.date,
      Time_Boarding: value.Time_Boarding,
      section: value.section,
    });

    await newbus.save();
    res.status(201).json({ message: "Bus has been created", bus: newbus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong while saving bus" });
  }
};

const deleteBus = async (req, res) => {
  const id = req.params.id;
  const driverId = req.params.di;

  try {
    // check bus exists
    const bus_exists = await BusSchema.findById(id);
    if (!bus_exists) {
      return res.status(404).json({ message: "Bus not found" });
    }
    const bus = await BusSchema.findByIdAndDelete(id);
    // delete driver if exists
    const bus_driver = await driverModule.findById(driverId);
    if (bus_driver) {
      await driverModule.findByIdAndDelete(driverId);
    } else {
      console.log("Driver not found");
    }

    // delete bus image from Cloudinary if present
    if (bus_exists.imageUrl) {
      // Cloudinary URLs look like: https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/bus-images/filename.jpg
      // You need the public_id (folder/filename without extension)
      const parts = bus_exists.imageUrl.split("/");
      const publicIdWithExt = parts.slice(-2).join("/"); // e.g. "bus-images/filename.jpg"
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // remove extension

      await cloudinary.uploader.destroy(publicId);
      console.log("Deleted image from Cloudinary:", publicId);
    }

    // delete bus record
    await BusSchema.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Bus and related data deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while deleting bus" });
  }
};

//request for all buses
const allbuses = async (req, res) => {
  try {
    const allbuses = await BusSchema.find({}).populate("Driver", "name email");

    res.status(200).json({ message: "success", allbuses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const Bus_Boarding = async (req, res) => {
  const Bus_id = req.params.id;
  const { error, value } = validateBoardingBus.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // check bus existence
    const existing_bus = await BusSchema.findById(Bus_id);
    if (!existing_bus) {
      return res.status(404).json({ message: "bus not found" });
    }

    // check bookings
    const bookings = await booked_buses.find({ Bus: Bus_id });
    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ message: "No bookings yet wai" });
    }


    // update past passengers for this bus
    const test = await pastpassengers.updateMany({ Bus: Bus_id }, value, {
      runValidators: true,
    });
    console.log(test);

    // update all confirmed bookings
    await booked_buses.updateMany(
      { Bus: Bus_id, financial_Status: "confirmed" },
      value,
      { runValidators: true }
    );

    // re‑query the updated confirmed bookings so you can emit to each passenger
    const updatedBookings = await booked_buses.find({
      Bus: Bus_id,
      financial_Status: "confirmed",
    });

    if (!updatedBookings || updatedBookings.length === 0) {
      return res.status(200).json({ message: "none has paid yet" });
    }

    // emit socket events to each passenger and to the admin
    const io = getIO();
    updatedBookings.forEach((b) => {
      if (b.passenger) {
        io.to(b.passenger.toString()).emit("bookingUpdated", b);
      }
    });
    io.to(req.user.id.toString()).emit("bookingUpdated", updatedBookings);

    return res
      .status(200)
      .json({ message: "Success", bookings: updatedBookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

const updateBus = async (req, res) => {
  const Bus_id = req.params.id;
  console.log(Bus_id);
  const { error, value } = validateBoardingBus.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const existing_Bus = await BusSchema.findById(Bus_id);
    // find bus no is existing
    if (!existing_Bus) {
      return res.status(404).json({ mesage: "bus not found" });
    }
    console.log(existing_Bus);
    const board = await BusSchema.findByIdAndUpdate(Bus_id, value, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

const queryBus = async (req, res) => {
  const BusNo = req.query.number;

  try {
    const allbuses = await BusSchema.find({ bus_no: BusNo }).populate(
      "Driver",
      "name email"
    );

    if (!allbuses) {
      return res.status(404).json({ mesage: "bus not found" });
    }
    console.log(allbuses);
    return res.status(200).json({ message: "success", allbuses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = {
  add_Bus,
  deleteBus,
  allbuses,
  Bus_Boarding,
  queryBus,
  updateBus,
};
