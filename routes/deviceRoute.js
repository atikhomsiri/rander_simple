const express = require("express");
const router = express.Router();
const validator = require("../controllers/deviceValidator");
const deviceController = require("../controllers/deviceController");
const verifyToken =require('../controllers/jwt');

router.get('/',verifyToken,deviceController.list);
router.get('/add',verifyToken,deviceController.add);
router.post('/new',verifyToken,validator.add,deviceController.new);
router.get('/delete/:id',verifyToken,deviceController.delete);
router.get('/edit/:id',verifyToken,deviceController.edit);
router.post('/update/:id',verifyToken,validator.update,deviceController.update);

module.exports = router;