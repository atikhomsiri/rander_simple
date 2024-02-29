const express = require("express");
const router = express.Router();
const Controller = require("../controllers/iotController");

//router.get('/project/',Controller.project);

router.get('/',Controller.project);

router.get('/iot',Controller.iot);

module.exports = router;