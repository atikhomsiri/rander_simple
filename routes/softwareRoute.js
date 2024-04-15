const express = require("express");
const router = express.Router();
const validator = require("../controllers/softwareValidator");
const softwareController = require("../controllers/softwareController");
const verifyToken =require('../controllers/jwt');

router.get('/',verifyToken,softwareController.list);
router.get('/delete/:id',verifyToken,softwareController.delete);
router.get('/edit/:id',verifyToken,softwareController.edit);
router.post('/update/:id',verifyToken,validator.update,softwareController.update);
router.get('/add',verifyToken,softwareController.add);
router.post('/new',verifyToken,validator.add,softwareController.new);
router.get('/history',verifyToken,softwareController.history);

module.exports = router;