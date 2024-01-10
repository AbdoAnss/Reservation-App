const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
// const path = require("path");
// const mysql = require("mysql");

router.post("/register", authController.register);



module.exports = router;