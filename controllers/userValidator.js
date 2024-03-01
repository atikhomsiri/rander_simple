const { check } = require('express-validator');

exports.add = [check("rid","Register Error!").notEmpty()];

//exports.update = [check("email","Email Error!").isEmail(),check("name","Name Error!").notEmpty(),check("registerDate","Register Date Error!").isDate()];
