const express = require("express");
const router = express.Router();

const Controller = require("../controllers/ownerController");
const Validator = require("../controllers/ownerValidator");
const verifyToken =require('../controllers/jwt');

router.get('/',verifyToken,Controller.list);

router.get('/menuinflux',verifyToken,Controller.menuinflux);
router.get('/readinflux/:id',verifyToken,Controller.readinflux);

router.get('/add/:did/:uid',verifyToken,Controller.add);
router.get('/delete/:did/:uid',verifyToken,Controller.delete);

router.get('/site/:did/:uid',verifyToken,Controller.site);
router.post('/site',verifyToken,Validator.addsite,Controller.addsite);
router.get('/clearsite/:did/:uid',Controller.clearsite);

router.get('/room/:did/:uid/:sid',verifyToken,Controller.room);
router.post('/room',verifyToken,Validator.addroom,Controller.addroom);
router.get('/clearroom/:did/:uid',verifyToken,Controller.clearroom);

module.exports = router;