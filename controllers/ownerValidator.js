const { check } = require('express-validator');

exports.add = [check("uid","User Error!").isInt(),check("did","Device Error!").isInt()];

exports.addsite = [check("userId","User Error!").isInt(),check("deviceId","Device Error!").isInt(),check("siteId","Site Error!").isInt()];

exports.addroom = [check("userId","User Error!").isInt(),check("deviceId","Device Error!").isInt(),check("siteId","Site Error!").isInt(),check("roomId","Room Error!").isInt()];