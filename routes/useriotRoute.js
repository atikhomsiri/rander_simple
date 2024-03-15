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

router.get('/day/:did',verifyToken,Controller.dayiot);
router.get('/week/:did',verifyToken,Controller.weekiot);
router.get('/month/:did',verifyToken,Controller.monthiot);

router.get('/max/day/:did',verifyToken,Controller.maxdayiot);
router.get('/max/week/:did',verifyToken,Controller.maxweekiot);
router.get('/max/month/:did',verifyToken,Controller.maxmonthiot);

router.get('/sum/day/:did',verifyToken,Controller.sumdayiot);
router.get('/sum/week/:did',verifyToken,Controller.sumweekiot);
router.get('/sum/month/:did',verifyToken,Controller.summonthiot);


module.exports = router;