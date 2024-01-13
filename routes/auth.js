const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
// const path = require("path");
// const mysql = require("mysql");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/reserv", authController.reserv);
router.post("/deleteReservation", authController.deleteReservation);
router.post("/modify-user", authController.modifyUser);


module.exports = router;