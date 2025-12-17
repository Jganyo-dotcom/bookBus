const express = require("express");
const connection = require("./database/connection");
const userRoute = require("./routes/user");
const registerAdminfunction = require("./controllers/admin.setup");
const staffRoute = require("./routes/staff");
const adminRoute = require("./routes/adminRoutes/admin");
const BusRoute = require("./routes/adminRoutes/busRoutes");
const app = express();
const PORT = process.env.PORT || 5555;
const path = require("path");

connection(); // not called or a reason
app.use(express.urlencoded({ extended: true })); // for forms
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const mongoose = require("mongoose");

app.get("/", (req, res) => {
  res.status(200).send("All is well");
});

//user routes
app.use("/guest", userRoute);
//staff routes
app.use("/staff", staffRoute);
//admin routes
app.use("/admin", adminRoute);
//bus routes
app.use("/bus", BusRoute);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
