const express = require("express");
const router = express.Router();

const Controller = require("../controllers/roomController");
const Validator = require("../controllers/roomValidator");
const verifyToken =require('../controllers/jwt');

router.get('/',verifyToken,Controller.list);
router.get('/add',verifyToken,Controller.add);
router.post('/new',verifyToken,Validator.add,Controller.new);
router.get('/delete/:id',verifyToken,Controller.delete);
router.get('/edit/:id',verifyToken,Controller.edit);
router.post('/update/:id',verifyToken,Validator.update,Controller.update);

module.exports = router;