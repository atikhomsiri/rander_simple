const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const verifyToken =require('../controllers/jwt');

router.get('/home',verifyToken,homeController.home);

router.get('/logout',homeController.logout);

router.get('/',homeController.index);

router.post('/',homeController.login);

module.exports = router;