const express = require("express");
const router = express.Router();

const Controller = require("../controllers/siteController");
const Validator = require("../controllers/siteValidator");

router.get('/',Controller.list);
router.get('/find/:id',Controller.find);
router.get('/add',Controller.add);
router.post('/new',Validator.add,Controller.new);
router.get('/delete/:id',Controller.delete);
router.get('/edit/:id',Controller.edit);
router.post('/update/:id',Validator.update,Controller.update);


module.exports = router;