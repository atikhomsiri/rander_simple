const express = require("express");
const router = express.Router();

const Controller = require("../controllers/userController");
const validator = require("../controllers/userValidator");
const verifyToken =require('../controllers/jwt');

router.get('/',verifyToken,Controller.list);
router.get('/new/:id',verifyToken,Controller.new);
router.get('/delete/:id',verifyToken,Controller.delete);


module.exports = router;