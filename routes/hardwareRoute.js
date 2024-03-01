const express = require("express");
const router = express.Router();

const validator = require("../controllers/hardwareValidator");

const hardwareController = require("../controllers/hardwareController");
router.get('/',hardwareController.list);
router.get('/delete/:id',hardwareController.delete);
router.get('/edit/:id',hardwareController.edit);
router.post('/update/:id',validator.update,hardwareController.update);
router.get('/add',hardwareController.add);
router.post('/new',validator.add,hardwareController.new);

module.exports = router;