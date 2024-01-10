const express = require("express");
const router = express.Router();
// const path = require("path");
// const mysql = require("mysql");



router.get("/", (req, res) => {
    res.render('index');
});

router.get("/login", (req, res) => {
    res.render('Register');
});

router.get("/register", (req, res) => {
    res.render('Register');
});

router.get("/dashboard", (req, res) => {
    res.render('dashboard');
});

router.get("/settings", (req, res) => {
    res.render('settings');
});

router.get("/about-us", (req, res) => {
    res.render('about');
});

router.get("/arena", (req, res) => {
    res.render('reserv');
});

router.get("/profile", (req, res) => {
    res.render('profile');
});


module.exports = router;