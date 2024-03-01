const express = require("express");
const router = express.Router();

const Controller = require("../controllers/registerController");
const validator = require("../controllers/registerValidator");

router.get('/',Controller.list);
router.get('/add',Controller.add);
router.post('/new',validator.add,Controller.new);
router.get('/delete/:id',Controller.delete);
router.get('/edit/:id',Controller.edit);
router.post('/update/:id',validator.update,Controller.update);

module.exports = router;