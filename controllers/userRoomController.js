const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = (req,res) => { 
        res.render('user/userroom');
  
};


module.exports = controller;