const express = require("express");
const router = express.Router();

const Controller = require("../controllers/useriotController");
const validator = require("../controllers/userValidator");
const verifyToken =require('../controllers/userjwt');

router.get('/sos/:did',verifyToken,Controller.sos);

router.get('/noise/:did',verifyToken,Controller.noise);

router.get('/airpollution/:did',verifyToken,Controller.airpollution);

router.get('/people/:did',verifyToken,Controller.people);

router.get('/monitor/:did',verifyToken,Controller.monitor);


module.exports = router;