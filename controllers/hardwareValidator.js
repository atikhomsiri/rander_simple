const { check } = require('express-validator');

exports.add = [check("hwname","Name Error!").notEmpty()];

exports.update = [check("hwname","Name Error!").notEmpty()];