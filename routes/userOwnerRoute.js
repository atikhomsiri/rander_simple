const express = require("express");
const router = express.Router();

const Controller = require("../controllers/userOwnerController");
const Validator = require("../controllers/userValidator");
const verifyToken =require('../controllers/userjwt');

router.get('/',verifyToken,Controller.list);

router.get('/clearroom/:did',verifyToken,Controller.clearroom);
router.get('/room/:did/:sid',verifyToken,Controller.room);
router.post('/room',verifyToken,Validator.addroom,Controller.addroom);

router.get('/clearsite/:did',Controller.clearsite);
router.get('/site/:did',verifyToken,Controller.site);
router.post('/site',verifyToken,Validator.addsite,Controller.addsite);

router.get('/delete/:did',verifyToken,Controller.delete);

module.exports = router;