const { check } = require('express-validator');

exports.add = [check("rid","Register Error!").notEmpty()];

exports.new = [check("password1","Password 1 not Match min 8 : number and character!").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),check("password2","Password 2 not Match min 8 : number and character!").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")];


exports.siteadd = [check("sitename","Site Name Error!").notEmpty()];

exports.siteupdate = [check("sitename","Site Name Error!").notEmpty()];

exports.roomadd = [check("siteId","Site Error!").isInt(),check("roomname","Room Name Error!").notEmpty()];

exports.roomupdate = [check("siteId","Site Error!").isInt(),check("roomname","Room Name Error!").notEmpty()];

//exports.update = [check("email","Email Error!").isEmail(),check("name","Name Error!").notEmpty(),check("registerDate","Register Date Error!").isDate()];
