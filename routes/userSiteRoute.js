const express = require("express");
const router = express.Router();

const Controller = require("../controllers/userSiteController");
const Validator = require("../controllers/userValidator");
const verifyToken =require('../controllers/userjwt');

router.get('/',verifyToken,Controller.list);
router.get('/add',verifyToken,Controller.add);
router.post('/new',verifyToken,Validator.siteadd,Controller.new);
router.get('/delete/:id',verifyToken,Controller.delete);
router.get('/edit/:id',verifyToken,Controller.edit);
router.post('/update/:id',verifyToken,Validator.siteupdate,Controller.update);

module.exports = router;