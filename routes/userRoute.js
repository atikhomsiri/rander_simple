const express = require("express");
const router = express.Router();

const Controller = require("../controllers/userController");
const validator = require("../controllers/userValidator");

router.get('/',Controller.list);
//router.get('/add',Controller.add);
router.get('/new/:id',Controller.new);
//router.post('/new/:id',validator.add,Controller.new);
router.get('/delete/:id',Controller.delete);
//router.get('/edit/:id',Controller.edit);
//router.post('/update/:id',validator.update,Controller.update);

module.exports = router;