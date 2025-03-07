const express = require("express");

const excelControllers = require("../controllers/excelUpload");
const upload = require("../middlewares/upload");

const Router = express.Router();

Router.post("/uploadResult", upload.single("csv"), excelControllers.uploadResult);

Router.post("/uploadStudent", upload.single("csv"), excelControllers.uploadStudent);

module.exports = Router;
