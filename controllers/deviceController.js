const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = (req,res) => { 
    db.query('SELECT * FROM device JOIN hardware ON device.hardwareId=hardware.hwid LEFT JOIN software ON device.softwareId=software.swid',function(err,devicedata){
        if (err) {console.error(err);return;}
        res.render('device',{data:devicedata.rows,session:req.session});
    });
};

controller.add = (req,res) => { 
    db.query('SELECT * FROM  hardware',function(err,hwdata){
        if (err) {console.error(err);return;}
        res.render('deviceForm',{devicedata:null,data:hwdata.rows,session:req.session});
    });
  };

controller.new = async (req,res) => { 
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/device/add')
    }else{
        req.session.topic="Add Device success";
        req.session.success=true;
        const data = req.body;
        const value =  await db.query('INSERT INTO device(mac,hardwareId,buildDate,comment) VALUES ($1,$2,$3,$4)',[data.mac,data.hardwareId,data.buildDate,data.comment]);
        res.redirect('/device/');
    }
    
};

controller.delete = async (req,res) => { 
    req.session.topic="Delete Device success";
    req.session.success=true;
    const { id } = req.params;
    try {
        const value =  await db.query('DELETE FROM device WHERE did= $1',[id], (err) => {
            if(err){console.error(err);return;}
          });    
    } catch (err) {
        let error = {msg:"Error Cannot Delete Device!", type:'Delete',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
    } finally {
        res.redirect('/device/');
    } 

};


controller.edit = async (req,res) => { 
    const { id } = req.params;

    const devicedata =  await db.query('SELECT * FROM device WHERE did= $1',[id], (err) => {
        if(err){res.json(err);}
    });

    db.query('SELECT * FROM  hardware',function(err,hwdata){
        if (err) {console.error(err);return;}
        res.render('deviceForm',{devicedata:devicedata.rows[0],data:hwdata.rows,session:req.session}); 
    });
    
};

controller.update = async (req,res) => { 
    const { id } = req.params;
    const data = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/device/edit/'+id)
    }else{
        req.session.topic="Edit Device success";
        req.session.success=true;
        const value =  await db.query('UPDATE device SET mac=$1,hardwareid=$2,builddate=$3,comment=$4 WHERE did= $5',[data.mac,data.hardwareId,data.buildDate,data.comment,id], (err) => {
            if(err){res.json(err);}
          });
        res.redirect('/device/');   
    }
    
};

controller.software = async (req,res) => { 
    const { id } = req.params;

    const devicedata =  await db.query('SELECT * FROM device JOIN hardware ON device.hardwareid=hardware.hwid WHERE did= $1',[id], (err) => {
        if(err){res.json(err);}
    });
    let hwid=devicedata.rows[0].hardwareid;
    const softwaredata =  await db.query('SELECT * FROM software WHERE hardwareid= $1',[hwid], (err) => {
        if(err){res.json(err);}
    });
    res.render('deviceSoftware',{devicedata:devicedata.rows[0],softwaredata:softwaredata.rows,session:req.session}); 
    
};

controller.version = async (req,res) => { 
    const { id } = req.params;
    const data = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/device/software/'+id)
    }else{
        req.session.topic="Set device software success";
        req.session.success=true;
        const value =  await db.query('UPDATE device SET softwareid=$1 WHERE did= $2',[data.softwareid,id], (err) => {
            if(err){res.json(err);}
          });
        res.redirect('/device/');   
    }
    
};


module.exports = controller;