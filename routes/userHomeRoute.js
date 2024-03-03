const express = require("express");
const router = express.Router();
const homeController = require("../controllers/userHomeController");
const userVerifyToken =require('../controllers/userjwt');

router.get('/home',userVerifyToken,homeController.home);

router.get('/logout',homeController.logout);


module.exports = router;