const { check } = require('express-validator');

exports.add = [check("siteId","Site Error!").isInt(),check("roomname","Name Error!").notEmpty()];

exports.update = [check("siteId","Site Error!").isInt(),check("roomname","Name Error!").notEmpty()];
