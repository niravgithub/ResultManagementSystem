// jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const User = require("./models/admin");
const app = express();
const adminRoutes = require("./routes/admin");
const dashboardRoutes = require("./routes/dashboard");
const resultRoutes = require("./routes/result");
const excelRoutes = require("./routes/excelUpload");



app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, "public")));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
const port = 3000;

app.get("/", (req, res) => {
  res.render("student", { navLink: "Admin Login" });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/admin/login");
});

app.use("/result", resultRoutes);

app.use("/admin", adminRoutes);

app.use("/dashboard", dashboardRoutes);

app.use("/excel", excelRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "an unknown error occured" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
