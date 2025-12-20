const { request } = require("express");
const BusSchema = require("../../modules/addBus");
const {
  validateaddingBus,
  validateBoardingBus,
} = require("../../validations/adminValidations/admin");
const driverModule = require("../../modules/driver.module");

const { cloudinary } = require("../../middlewares/cloud");

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
      console.log("Deleted driver");
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
    console.log("bus");
    const allbuses = await BusSchema.find({}).populate("Driver", "name email");

    res.status(200).json({ message: "success", allbuses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const Bus_Boarding = async (req, res) => {
  console.log(req.params.id);
  const Bus_id = req.params.id;
  const { error, value } = validateBoardingBus.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const existing_bus = await BusSchema.findById(Bus_id);
    // find bus no is existing
    if (!existing_bus) {
      return res.status(404).json({ mesage: "bus not found" });
    }
    const Board = await BusSchema.findByIdAndUpdate(Bus_id, value, {
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
  console.log(BusNo);
  try {
    const allbuses = await BusSchema.find({ bus_no: BusNo }).populate(
      "Driver",
      "name email"
    );
    if (!allbuses) {
      return res.status(404).json({ mesage: "bus not found" });
    }
    return res.status(200).json({ mesage: "success", allbuses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { add_Bus, deleteBus, allbuses, Bus_Boarding, queryBus };
