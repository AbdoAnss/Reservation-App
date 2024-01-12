const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");




//  1ere zone accesible par tous
router.get("/", authController.isLoggedIn,(req, res) => {
    res.render('index', {
        user: req.user
    });
});

router.get("/login", (req, res) => {
    res.render('Register');
});

router.get("/register", (req, res) => {
    res.render('Register');
});
router.get("/about-us",authController.isLoggedIn ,(req, res) => {
    res.render('about', {
        user: req.user
     });
});



// 2eme zone accesible par les utilisateurs connectés

router.get("/dashboard", authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('dashboard', {
            user: req.user
        });
    }
    else {
        res.redirect("/login");
    }
});

router.get("/settings",authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('settings', {
            user: req.user
        });
    }
    else {
        res.redirect("/login");
    }
});
router.get("/arena",authController.isLoggedIn,authController.userReservations, (req, res) => {
    if (req.user && req.reservations) {
        res.render('reserv', {
            user: req.user,
            reservations: req.reservations
        });
    }
    else {
        res.redirect("/login");
    }
    
});
router.get("/profile", authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('profile', {
            user: req.user
        });
    }else {
        res.redirect("/login");
    }
});




module.exports = router;