const express = require("express");
const router = express.Router();

const Controller = require("../controllers/userAddController");
const validator = require("../controllers/userValidator");
const verifyToken =require('../controllers/userjwt');

router.get('/',verifyToken,Controller.list);

router.get('/register/:id',verifyToken,Controller.register);

router.get('/add/:id/:did',verifyToken,Controller.add);

//router.get('/new/:id',verifyToken,Controller.new);
//router.get('/delete/:id',verifyToken,Controller.delete);


module.exports = router;