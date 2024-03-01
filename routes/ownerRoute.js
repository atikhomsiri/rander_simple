const express = require("express");
const router = express.Router();

const Controller = require("../controllers/ownerController");
const Validator = require("../controllers/ownerValidator");

router.get('/',Controller.list);

router.get('/menuinflux',Controller.menuinflux);
router.get('/readinflux/:id',Controller.readinflux);

router.get('/add/:did/:uid',Controller.add);
router.get('/delete/:did/:uid',Controller.delete);

router.get('/site/:did/:uid',Controller.site);
router.post('/site',Validator.addsite,Controller.addsite);
router.get('/clearsite/:did/:uid',Controller.clearsite);

router.get('/room/:did/:uid/:sid',Controller.room);
router.post('/room',Validator.addroom,Controller.addroom);
router.get('/clearroom/:did/:uid',Controller.clearroom);

module.exports = router;