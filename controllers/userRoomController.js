const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = async (req,res) => { 
        const uid = req.session.uid;
        const value =  await db.query('SELECT * FROM room JOIN site ON room.siteid=site.sid JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE userid=$1',[uid], (err) => {
                if(err){res.json(err);}
        });
        res.render('user/userroom',{data:value.rows,session:req.session});  
};

controller.add = async (req,res) => { 
        const uid = req.session.uid;
        const value =  await db.query('SELECT * FROM site JOIN iotuser ON site.userid=iotuser.uid  WHERE uid=$1',[uid], (err) => {
                if(err){res.json(err);}
        });
        res.render('user/userRoomForm',{roomdata:null,data:value.rows,session:req.session});
};

controller.new = async (req,res) => { 
        const error = validationResult(req);
        const uid = req.session.uid;
        if(!error.isEmpty()){
            req.session.error=error;
            req.session.success=false;
            res.redirect('/user/room/add')
        }else{
            req.session.topic="Add room success";
            req.session.success=true;
            const data = req.body;   
            const value =  await db.query('SELECT * FROM site JOIN iotuser ON site.userid=iotuser.uid WHERE sid=$1 AND userid=$2',[data.siteId,uid], (err) => {
                if(err){res.json(err);}
                });
                
                if(value.rowCount==1){
                        const value =  await db.query('INSERT INTO room(siteid,roomname,rcomment) VALUES ($1,$2,$3)',[data.siteId,data.roomname,data.rcomment]);
                }else{
                        let error = {msg:"Error cannot add room!", type:'Delete',location: 'body',  value:'errors'};
                        req.session.error = {"errors":[error]};
                        req.session.topic=null;
                        req.session.success=false;
                }
                res.redirect('/user/room/');
        } 
};

  
controller.delete = async (req,res) => {        
        const { id } = req.params;
        const uid = req.session.uid;
        try {
                const value2 =  await db.query('SELECT * FROM room JOIN site ON room.siteid=site.sid JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE roid= $1 AND userid= $2',[id,uid], (err) => {
                        if(err){res.json(err);}
                });
             if(value2.rowCount==1){
                const value =  await db.query('DELETE FROM room WHERE roid= $1 ',[id], (err) => {
                        if(err){console.error(err);return;}
                 });  
                req.session.topic="Delete room success";
                req.session.success=true;
                
             }else{
                let error = {msg:"Error Cannot Delete Room!", type:'Delete',location: 'body',  value:'errors'};
                req.session.error = {"errors":[error]};
                req.session.topic=null;
                req.session.success=false;
             }
             
        } catch (err) {
            let error = {msg:"Error Cannot Delete Room!", type:'Delete',location: 'body',  value:'errors'};
            req.session.error = {"errors":[error]};
            req.session.topic=null;
            req.session.success=false;
        } finally {        
            res.redirect('/user/room/');
        } 
    
};
 
controller.edit = async (req,res) => { 
        const { id } = req.params;
        const uid = req.session.uid;
        const value2 =  await db.query('SELECT * FROM room JOIN site ON room.siteid=site.sid JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE roid= $1 AND userid= $2',[id,uid], (err) => {
                if(err){res.json(err);}
        });
        if(value2.rowCount==1){
                const value =  await db.query('SELECT * FROM site JOIN iotuser ON site.userid=iotuser.uid  WHERE uid=$1',[uid], (err) => {
                        if(err){res.json(err);}
                });
                            res.render('user/userRoomForm',{roomdata:value2.rows[0],data:value.rows,session:req.session}); 
        }else{
                let error = {msg:"Error Cannot Edit Room!", type:'Edit',location: 'body',  value:'errors'};
                req.session.error = {"errors":[error]};
                req.session.topic=null;
                req.session.success=false;     
                res.redirect('/user/room/');
        }
        
    };

controller.update = async (req,res) => { 
        const { id } = req.params;
        const data = req.body;
        const error = validationResult(req);
        if(!error.isEmpty()){
            req.session.error=error;
            req.session.success=false;
            res.redirect('/user/room/edit/'+id)
        }else{
        const uid = req.session.uid;
        const value2 =  await db.query('SELECT * FROM room JOIN site ON room.siteid=site.sid JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE roid= $1 AND userid= $2',[id,uid], (err) => {
                if(err){res.json(err);}
        });
                if(value2.rowCount==1){
                        req.session.topic="Edit room success";
                        req.session.success=true;
                        const value =  await db.query('UPDATE room SET siteid=$1,roomname=$2,rcomment=$3 WHERE roid= $4',[data.siteId,data.roomname,data.rcomment,id], (err) => {
                        if(err){res.json(err);}
                        });
                        res.redirect('/user/room/'); 
                }else{
                        let error = {msg:"Error Cannot Edit Room!", type:'Edit',location: 'body',  value:'errors'};
                        req.session.error = {"errors":[error]};
                        req.session.topic=null;
                        req.session.success=false;
                        res.redirect('/user/room/edit/'+id)
                }    
        }       
};

module.exports = controller;