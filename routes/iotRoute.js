const express = require("express");
const router = express.Router();

const Controller = require("../controllers/iotController");

router.get('/sos/:did/:uid',Controller.sos);

router.get('/airpollution/:did/:uid',Controller.airpollution);

router.get('/nodemcu/:did/:uid',Controller.nodemcu);

router.get('/esp01/:did/:uid',Controller.esp01);

module.exports = router;