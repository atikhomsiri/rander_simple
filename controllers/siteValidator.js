const { check } = require('express-validator');

exports.add = [check("userId","User Error!").isInt(),check("sitename","Name Error!").notEmpty()];

exports.update = [check("userId","User Error!").isInt(),check("sitename","Name Error!").notEmpty()];

//exports.update = [check("mac","Mac Address Error!").notEmpty(),check("hardwareId","Hardware Error!").isInt()];