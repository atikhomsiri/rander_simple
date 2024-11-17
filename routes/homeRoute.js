const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const verifyToken =require('../controllers/jwt');

const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 20,
    message: "Too Many Request",
});

router.get('/home',verifyToken,homeController.home);

router.get('/logout',homeController.logout);

router.get('/',homeController.index);

router.get('/signup',homeController.signup);

router.post('/',homeController.register);

router.post('/',limiter,homeController.login);

module.exports = router;