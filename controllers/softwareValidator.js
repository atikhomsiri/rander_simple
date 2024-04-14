const { check } = require('express-validator');

exports.add = [check("hardwareId","Hareware Error!").isInt(),check("version","Version Error!").isInt()];

exports.update = [check("hardwareId","Hareware Error!").isInt(),check("version","Version Error!").isInt()];