const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = (req,res) => { 
        res.render('user/userowner');
  
};

controller.menuinflux = (req,res) => { 
    db.query('SELECT * FROM hardware',function(err,hwdata){
        if (err) {console.error(err);return;}
        res.render('user/useradd',{datapoint:"",datahw:hwdata.rows,session:req.session});
    }); 
};


module.exports = controller;