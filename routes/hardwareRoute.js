const express = require("express");
const router = express.Router();
const validator = require("../controllers/hardwareValidator");
const hardwareController = require("../controllers/hardwareController");
const verifyToken =require('../controllers/jwt');

router.get('/',verifyToken,hardwareController.list);
router.get('/delete/:id',verifyToken,hardwareController.delete);
router.get('/edit/:id',verifyToken,hardwareController.edit);
router.post('/update/:id',verifyToken,validator.update,hardwareController.update);
router.get('/add',verifyToken,hardwareController.add);
router.post('/new',verifyToken,validator.add,hardwareController.new);

module.exports = router;