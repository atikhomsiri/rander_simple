const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = async (req,res) => { 
    const uid = req.session.uid;
        const value =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE uid=$1',[uid], (err) => {
                if(err){res.json(err);}
        });
    
    res.render('user/userowner',{data:value.rows,session:req.session});  
};

controller.menuinflux = (req,res) => { 
    db.query('SELECT * FROM hardware',function(err,hwdata){
        if (err) {console.error(err);return;}
        res.render('user/useradd',{datapoint:"",datahw:hwdata.rows,session:req.session});
    }); 
};


controller.clearroom = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;
    const ownerdata =  await db.query('SELECT * FROM deviceowner WHERE deviceid= $1 AND userid=$2',[did,uid]);
    if(ownerdata.rowCount>0){
        req.session.topic="Room clear success!";
        req.session.success=true;
        const value =  await db.query('UPDATE deviceowner SET roomid=NULL WHERE deviceid= $1 AND userid=$2',[did,uid], (err) => {
            if(err){res.json(err);}
        });
        res.redirect('/user/owner/');
    }else{
        let error = {msg:"Error Cannot Clear Room for IOT Device!", type:'clear',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }

};


controller.room = async(req,res) => { 
    const { did } = req.params;
    const { sid } = req.params;
    const uid = req.session.uid;

    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid = $2 AND sid = $3',[did,uid,sid], (err) => {
        if(err){res.json(err);}
    });

    const roomdata =  await db.query('SELECT * FROM room JOIN site ON room.siteid=site.sid JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE iotuser.uid=$1 AND site.sid= $2',[uid,sid], (err) => {
        if(err){res.json(err);}
    });
    res.render('user/userOwnerRoom',{data:ownerdata.rows[0],rdata:roomdata.rows,session:req.session});
};


controller.addroom = async (req,res) => { 
    const data = req.body;
    const uid = req.session.uid;
    const did = data.deviceId;
    const error = validationResult(req);

    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/user/owner/room/'+data.deviceId+"/"+data.siteId)
    }else{
        const ownerdata =  await db.query('SELECT * FROM deviceowner WHERE deviceid= $1 AND userid=$2',[did,uid]);
        if(ownerdata.rowCount>0){
            req.session.topic="Room assign success";
            req.session.success=true;
            const value =  await db.query('UPDATE deviceowner SET roomId=$1 WHERE deviceId= $2 AND userId=$3 AND siteId=$4',[data.roomId,did,uid,data.siteId], (err) => {
                if(err){res.json(err);}
            });
            res.redirect('/user/owner/');  
        }
    }  
};


controller.clearsite = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;
    const ownerdata =  await db.query('SELECT * FROM deviceowner WHERE deviceid= $1 AND userid=$2',[did,uid]);
    if(ownerdata.rowCount>0){
        req.session.topic="Site clear success!";
        req.session.success=true;
        const value =  await db.query('UPDATE deviceowner SET siteid=NULL,roomid=NULL WHERE deviceid= $1 AND userid=$2',[did,uid], (err) => {
            if(err){res.json(err);}
          });
        res.redirect('/user/owner/'); 
    }else{
        let error = {msg:"Error Cannot Clear Site for IOT Device!", type:'clear',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
};

controller.site = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;

    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 and uid = $2',[did,uid], (err) => {
        if(err){res.json(err);}
    });

    const sitedata =  await db.query('SELECT * FROM site JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE iotuser.uid=$1',[uid], (err) => {
        if(err){res.json(err);}
    });

    res.render('user/userOwnerSite',{data:ownerdata.rows[0],sdata:sitedata.rows,session:req.session});
};

controller.addsite = async (req,res) => { 
    const data = req.body;
    const uid = req.session.uid;
    const did = data.deviceId;
    const error = validationResult(req);
        if(!error.isEmpty()){
            req.session.error=error;
            req.session.success=false;
            res.redirect('/owner/site/'+data.deviceId+"/"+data.userId)
        }else{
            const ownerdata =  await db.query('SELECT * FROM deviceowner WHERE deviceid= $1 AND userid=$2',[did,uid]);
            if(ownerdata.rowCount>0){
            req.session.topic="Site assign success";
            req.session.success=true;
            const value =  await db.query('UPDATE deviceowner SET siteid=$1 WHERE deviceid= $2 and userid=$3',[data.siteId,did,uid], (err) => {
                if(err){res.json(err);}
                });
            res.redirect('/user/owner/'); 
            }else{
                let error = {msg:"Error Cannot Assign Site for IOT Device!", type:'set',location: 'body',  value:'errors'};
                req.session.error = {"errors":[error]};
                req.session.topic=null;
                req.session.success=false;
                res.redirect('/user/owner/');
            }
        } 
};


controller.delete = async (req,res) => { 
    req.session.topic="Delete Device success";
    req.session.success=true;
    const { did } = req.params;
    const uid = req.session.uid;

    try {
        const value =  await db.query('DELETE FROM deviceowner WHERE deviceid= $1 and userid = $2',[did,uid], (err) => {
            if(err){console.error(err);return;}
          });    
    } catch (err) {
        let error = {msg:"Error Cannot Delete Device!", type:'Delete',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
    } finally {
        res.redirect('/user/owner/');
    } 

};

module.exports = controller;