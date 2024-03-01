const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = (req,res) => { 
    db.query('SELECT * FROM site JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid ORDER BY userid',function(err,sitedata){
        if (err) {console.error(err);return;}
        res.render('site',{data:sitedata.rows,session:req.session});
    });
};


controller.find = async (req,res) => { 
    const { id } = req.params;
    const value =  await db.query('SELECT * FROM site JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE uid= $1',[id], (err) => {
        if(err){res.json(err);}
    });
    res.render('site',{data:value.rows,session:req.session});
};


controller.add = (req,res) => { 
    db.query('SELECT * FROM iotuser JOIN register ON iotuser.registerid=register.rid',function(err,userdata){
        if (err) {console.error(err);return;}
        res.render('siteForm',{sitedata:null,data:userdata.rows,session:req.session});
    });
  };

  
controller.new = async (req,res) => { 
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/site/add')
    }else{
        req.session.topic="Add site success";
        req.session.success=true;
        const data = req.body;
        console.log(data);
        const value =  await db.query('INSERT INTO site(userid,sitename,scomment) VALUES ($1,$2,$3)',[data.userId,data.sitename,data.scomment]);
        res.redirect('/site/');

    }
    
};


controller.delete = async (req,res) => { 
    req.session.topic="Delete site success";
    req.session.success=true;
    const { id } = req.params;
    try {
        const value =  await db.query('DELETE FROM site WHERE sid= $1',[id], (err) => {
            if(err){console.error(err);return;}
          });    
    } catch (err) {
        let error = {msg:"Error Cannot Delete Site!", type:'Delete',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
    } finally {
        res.redirect('/site/');
    } 

};


controller.edit = async (req,res) => { 
    const { id } = req.params;
    const sitedata =  await db.query('SELECT * FROM site WHERE sid= $1',[id], (err) => {
        if(err){res.json(err);}
    });
    db.query('SELECT * FROM iotuser JOIN register ON iotuser.registerid=register.rid',function(err,userdata){
        if (err) {console.error(err);return;}
        res.render('siteForm',{sitedata:sitedata.rows[0],data:userdata.rows,session:req.session});
    });

};


controller.update = async (req,res) => { 
    const { id } = req.params;
    const data = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/site/edit/'+id)
    }else{
        req.session.topic="Edit site success";
        req.session.success=true;
        const value =  await db.query('UPDATE site SET userid=$1,sitename=$2,scomment=$3 WHERE sid= $4',[data.userId,data.sitename,data.scomment,id], (err) => {
            if(err){res.json(err);}
          });
          res.redirect('/site/');
    }
    
};

module.exports = controller;