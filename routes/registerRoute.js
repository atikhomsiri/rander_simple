const express = require("express");
const router = express.Router();

const Controller = require("../controllers/registerController");
const validator = require("../controllers/registerValidator");
const verifyToken =require('../controllers/jwt');

router.get('/',verifyToken,Controller.list);
router.get('/add',verifyToken,Controller.add);
router.post('/new',verifyToken,validator.add,Controller.new);
router.get('/delete/:id',verifyToken,Controller.delete);
router.get('/edit/:id',verifyToken,Controller.edit);
router.post('/update/:id',verifyToken,validator.update,Controller.update);

module.exports = router;