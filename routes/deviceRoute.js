const express = require("express");
const router = express.Router();

const validator = require("../controllers/deviceValidator");

const deviceController = require("../controllers/deviceController");
router.get('/',deviceController.list);
router.get('/add',deviceController.add);
router.post('/new',validator.add,deviceController.new);
router.get('/delete/:id',deviceController.delete);
router.get('/edit/:id',deviceController.edit);
router.post('/update/:id',validator.update,deviceController.update);

module.exports = router;