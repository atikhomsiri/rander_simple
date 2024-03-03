const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = (req,res) => { 
        res.render('user/usersite');
  
};


module.exports = controller;