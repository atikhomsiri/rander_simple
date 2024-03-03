const controller = {};
const db = require('./db');
const jwt = require('jsonwebtoken');

controller.home =  (req,res) => { 
    res.render('./user/userhome');
}

controller.logout =  (req,res) => { 
    req.session.token = null;
    res.redirect('/');
}

module.exports = controller;