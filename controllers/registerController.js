const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = (req,res) => {
    db.query('SELECT * FROM register LEFT JOIN iotuser ON register.rid=iotuser.registerid',function(err,registerdata){
        if (err) {console.error(err);return;}
        res.render('register',{data:registerdata.rows,session:req.session}); 
    });
};

controller.add = (req,res) => { 
        res.render('registerForm',{data:null,session:req.session});
};


controller.new = async (req,res) => { 
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/register/add')
    }else{
        req.session.topic="Add register success";
        req.session.success=true;
        const data = req.body;          
        const value =  await db.query('INSERT INTO register(name,email,phone,registerdate,comment) VALUES ($1,$2,$3,$4,$5)',[data.name,data.email,data.phone,data.registerDate,data.comment]);
        res.redirect('/register/');
    }
};

controller.delete = async (req,res) => { 
    req.session.topic="Delete register success";
    req.session.success=true;
    const { id } = req.params;
    try {
        const value =  await db.query('DELETE FROM register WHERE rid= $1',[id], (err) => {
            if(err){console.error(err);return;}
          });    
    } catch (err) {
        let error = {msg:"Error Cannot Delete Register!", type:'Delete',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
    } finally {
        res.redirect('/register/');
    } 

};


controller.edit = async (req,res) => { 
    const { id } = req.params;
    const value =  await db.query('SELECT * FROM register WHERE rid= $1',[id], (err) => {
        if(err){res.json(err);}
    });
    res.render('registerForm',{data:value.rows[0],session:req.session});
};

controller.update = async (req,res) => { 
    const { id } = req.params;
    const data = req.body;
    const error = validationResult(req);
    
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/register/edit/'+id)
    }else{
        req.session.topic="Edit Register success";
        req.session.success=true;
        const value =  await db.query('UPDATE register SET name=$1,email=$2,phone=$3,registerdate=$4,comment=$5 WHERE rid= $6',[data.name,data.email,data.phone,data.registerDate,data.comment,id], (err) => {
            if(err){res.json(err);}
          });
          res.redirect('/register/');  

    }
    
};

module.exports = controller;