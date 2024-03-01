const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = (req,res) => { 
    db.query('SELECT * FROM iotuser JOIN register ON iotuser.registerid=register.rid ORDER BY commitdate DESC',function(err,userdata){
        if (err) {console.error(err);return;}
        res.render('user',{data:userdata.rows,session:req.session});
    });
};


controller.delete = async (req,res) => { 
    req.session.topic="Delete user success";
    req.session.success=true;
    const { id } = req.params;
    try {
        const value =  await db.query('DELETE FROM iotuser WHERE uid= $1',[id], (err) => {
            if(err){console.error(err);return;}
          });    
    } catch (err) {
        let error = {msg:"Error Cannot Delete User!", type:'Delete',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
    } finally {
        res.redirect('/user/');
    } 

};

controller.new = async (req,res) => { 
    const { id } = req.params;
    req.session.topic="Admit user success";
    req.session.success=true;
    
    const value =  await db.query('INSERT INTO iotuser (registerid,commitdate) VALUES ($1,DATE(NOW()))',[id]);
    res.redirect('/user/');
    
};

module.exports = controller;