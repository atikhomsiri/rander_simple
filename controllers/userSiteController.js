const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = async (req,res) => { 
        const uid = req.session.uid;
        const value =  await db.query('SELECT * FROM site JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE uid=$1 ORDER BY userid',[uid], (err) => {
                if(err){res.json(err);}
        });
        res.render('user/usersite',{data:value.rows,session:req.session});  
};

controller.add = (req,res) => { 
            res.render('user/userSiteForm',{sitedata:null,session:req.session});
};
    
controller.new = async (req,res) => { 
        const error = validationResult(req);
        if(!error.isEmpty()){
            req.session.error=error;
            req.session.success=false;
            res.redirect('/user/site/add')
        }else{
            req.session.topic="Add site success";
            req.session.success=true;
            const data = req.body;
            const uid = req.session.uid;
            const value =  await db.query('INSERT INTO site(userid,sitename,scomment) VALUES ($1,$2,$3)',[uid,data.sitename,data.scomment]);
            res.redirect('/user/site/');
    
        }        
};
    


module.exports = controller;