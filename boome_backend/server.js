const express = require("express");
const connection = require("./src/database/connection");
const userRoute = require("./src/routes/user");
const registerAdminfunction = require("./src/controllers/admin.setup");
const staffRoute = require("./src/routes/staff");
const adminRoute = require("./src/routes/adminRoutes/admin");
const BusRoute = require("./src/routes/adminRoutes/busRoutes");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 5555;
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { init } = require("./utils/socket");

connection();
app.use(express.urlencoded({ extended: true })); // for forms
app.use(express.json());

init(server);
app.use(express.static(path.join(__dirname, "src/public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
