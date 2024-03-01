const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = (req,res) => { 
    db.query('SELECT * FROM room JOIN site ON room.siteid=site.sid JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid ORDER BY userid',function(err,roomdata){
        if (err) {console.error(err);return;}
        res.render('room',{data:roomdata.rows,session:req.session});
    });
};

controller.add = (req,res) => { 
    db.query('SELECT * FROM site JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid ORDER BY iotuser.uid',function(err,roomdata){
        if (err) {console.error(err);return;}
        res.render('roomForm',{roomdata:null,data:roomdata.rows,session:req.session});
    });
  };
  controller.new = async (req,res) => { 
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/room/add')
    }else{
        req.session.topic="Add room success";
        req.session.success=true;
        const data = req.body;
        const value =  await db.query('INSERT INTO room(siteid,roomname,rcomment) VALUES ($1,$2,$3)',[data.siteId,data.roomname,data.rcomment]);
        res.redirect('/room/');
    } 
};

controller.delete = async (req,res) => { 
    req.session.topic="Delete room success";
    req.session.success=true;
    const { id } = req.params;
    try {
        const value =  await db.query('DELETE FROM room WHERE roid= $1',[id], (err) => {
            if(err){console.error(err);return;}
          });    
    } catch (err) {
        let error = {msg:"Error Cannot Delete Room!", type:'Delete',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
    } finally {
        res.redirect('/room/');
    } 
};

controller.edit = async (req,res) => { 
    const { id } = req.params;
    const roomdata =  await db.query('SELECT * FROM room WHERE roid= $1',[id], (err) => {
        if(err){res.json(err);}
    });
    db.query('SELECT * FROM site JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid',function(err,sitedata){
        if (err) {console.error(err);return;}
        res.render('roomForm',{roomdata:roomdata.rows[0],data:sitedata.rows,session:req.session}); 
    });
};

controller.update = async (req,res) => { 
    const { id } = req.params;
    const data = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/room/edit/'+id)
    }else{
        req.session.topic="Edit room success";
        req.session.success=true;
        const value =  await db.query('UPDATE room SET siteid=$1,roomname=$2,rcomment=$3 WHERE roid= $4',[data.siteId,data.roomname,data.rcomment,id], (err) => {
            if(err){res.json(err);}
          });
          res.redirect('/room/');  
    }
    
};

module.exports = controller;