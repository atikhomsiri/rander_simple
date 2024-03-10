const express = require("express");
const router = express.Router();

const Controller = require("../controllers/userController");
const validator = require("../controllers/userValidator");
const verifyToken =require('../controllers/jwt');

router.get('/',verifyToken,Controller.list);
router.post('/new/:id',verifyToken,validator.new,Controller.new);
router.get('/add/:id',verifyToken,Controller.add);
router.get('/delete/:id',verifyToken,Controller.delete);


module.exports = router;