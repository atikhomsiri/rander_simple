const express = require("express");
const router = express.Router();

const Controller = require("../controllers/iotController");
const verifyToken =require('../controllers/jwt');

router.get('/sos/:did/:uid',verifyToken,Controller.sos);

router.get('/soscenter/:did/:uid',verifyToken,Controller.soscenter);

router.get('/airpollution/:did/:uid',verifyToken,Controller.airpollution);

router.get('/noise/:did/:uid',verifyToken,Controller.noise);

router.get('/people/:did/:uid',verifyToken,Controller.people);

router.get('/monitor/:did/:uid',verifyToken,Controller.monitor);

router.get('/nodemcu/:did/:uid',verifyToken,Controller.nodemcu);

router.get('/esp01/:did/:uid',verifyToken,Controller.esp01);

module.exports = router;