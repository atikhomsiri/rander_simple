const express = require("express");
const router = express.Router();

const Controller = require("../controllers/iotController");
const verifyToken =require('../controllers/jwt');

router.get('/sos/:did/:uid',verifyToken,Controller.sos);

router.get('/airpollution/:did/:uid',verifyToken,Controller.airpollution);

router.get('/nodemcu/:did/:uid',verifyToken,Controller.nodemcu);

router.get('/esp01/:did/:uid',verifyToken,Controller.esp01);

module.exports = router;