const { check } = require('express-validator');

exports.add = [check("mac","Mac Address Error!").notEmpty(),check("hardwareId","Hardware Error!").isInt()];

exports.update = [check("mac","Mac Address Error!").notEmpty(),check("hardwareId","Hardware Error!").isInt()];