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
    
controller.delete = async (req,res) => { 
        req.session.topic="Delete site success";
        req.session.success=true;
        const { id } = req.params;
        const uid = req.session.uid;
        try {
           const value =  await db.query('DELETE FROM site WHERE sid= $1 AND userid= $2',[id,uid], (err) => {
                if(err){console.error(err);return;}
             });    
             if(value.rowCount==0){
                let error = {msg:"Error Cannot Delete Site!", type:'Delete',location: 'body',  value:'errors'};
                req.session.error = {"errors":[error]};
                req.session.topic=null;
                req.session.success=false;
             }
             
        } catch (err) {
            let error = {msg:"Error Cannot Delete Site!", type:'Delete',location: 'body',  value:'errors'};
            req.session.error = {"errors":[error]};
            req.session.topic=null;
            req.session.success=false;
        } finally {
               
            res.redirect('/user/site/');
        } 
    
    };
    

    controller.edit = async (req,res) => { 
        const { id } = req.params;
        const uid = req.session.uid;
        const sitedata =  await db.query('SELECT * FROM site WHERE sid= $1 AND userid= $2',[id,uid], (err) => {
            if(err){res.json(err);}
        });
        if(sitedata.rowCount>0){
            res.render('user/userSiteForm',{sitedata:sitedata.rows[0],session:req.session});
        }else{
                let error = {msg:"Error Cannot Edit Site!", type:'Edit',location: 'body',  value:'errors'};
                req.session.error = {"errors":[error]};
                req.session.topic=null;
                req.session.success=false;  
                res.redirect('/user/site/');
        }
    };


controller.update = async (req,res) => { 
        const { id } = req.params;
        const uid = req.session.uid;
        const data = req.body;
        const error = validationResult(req);
        if(!error.isEmpty()){
            req.session.error=error;
            req.session.success=false;
            res.redirect('/user/site/edit/'+id)
        }else{
            req.session.topic="Edit site success";
            req.session.success=true;
            const value =  await db.query('UPDATE site SET sitename=$1,scomment=$2 WHERE sid= $3 AND userid= $4',[data.sitename,data.scomment,id,uid], (err) => {
                if(err){res.json(err);}
              });
              if(value.rowCount>0){
                res.redirect('/user/site/');
              }else{
                let error = {msg:"Error Cannot Edit Site!", type:'Edit',location: 'body',  value:'errors'};
                req.session.error = {"errors":[error]};
                req.session.topic=null;
                req.session.success=false;  
                res.redirect('/user/site/');
              }
              
        }
        
};

module.exports = controller;