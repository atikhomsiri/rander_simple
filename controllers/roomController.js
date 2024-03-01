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


controller.delete = (req,res) => { 
    req.session.topic="Delete room success";
    req.session.success=true;
    const { id } = req.params;
    req.getConnection((err,conn)=>{
        conn.query('DELETE FROM room WHERE roid= ?',[id],(err)=>{
            if(err){res.json(err);}
            res.redirect('/room/');
        });
    });
};


controller.edit = (req,res) => { 
    const { id } = req.params;
    req.getConnection((err,conn)=>{
    conn.query('SELECT * FROM room WHERE roid= ?',[id],(err,roomdata)=>{
        conn.query('SELECT * FROM site JOIN user ON site.userId=user.uid JOIN register ON user.registerId=register.rid',(err,sitedata)=>{
            if(err){res.json(err);}
            res.render('roomForm',{roomdata:roomdata[0],data:sitedata,session:req.session});
            });
        });
    });
};


controller.update = (req,res) => { 
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
        req.getConnection((err,conn)=>{
            conn.query('UPDATE room SET ? WHERE roid= ?',[data,id],(err)=>{
                if(err){res.json(err);}
                res.redirect('/room/');
            });
        });
    }
    
};

module.exports = controller;