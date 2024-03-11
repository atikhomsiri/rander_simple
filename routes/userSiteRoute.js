const express = require("express");
const router = express.Router();

const Controller = require("../controllers/userSiteController");
const Validator = require("../controllers/userValidator");
const verifyToken =require('../controllers/userjwt');

router.get('/',verifyToken,Controller.list);
router.get('/add',verifyToken,Controller.add);
router.post('/new',verifyToken,Validator.siteadd,Controller.new);
//router.get('/new/:id',verifyToken,Controller.new);
//router.get('/delete/:id',verifyToken,Controller.delete);


module.exports = router;