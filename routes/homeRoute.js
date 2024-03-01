const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.get('/home',homeController.home);

router.get('/',homeController.index);

router.post('/',homeController.login);

module.exports = router;