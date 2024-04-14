const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = (req,res) => { 
    db.query('SELECT * FROM software JOIN hardware ON software.hardwareid=hardware.hwid',function(err,result){
        if (err) {console.error(err);return;}
        res.render('software',{data:result.rows,session:req.session});
    });
};


controller.add = (req,res) => { 
    db.query('SELECT * FROM  hardware',function(err,hwdata){
        if (err) {console.error(err);return;}
        res.render('softwareForm',{data:null,hwdata:hwdata.rows,session:req.session});
    });
   
};

controller.new = async (req,res) => { 
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/software/add')
    }else{
        req.session.topic="Add software success";
        req.session.success=true;
        const data = req.body;
       const value =  await db.query('INSERT INTO software(version,hardwareid,versiondate,comment) VALUES ($1,$2,$3,$4)',[data.version,data.hardwareId,data.versiondate,data.comment]);
        res.redirect('/software/');
    }
    
};


controller.delete = async (req,res) => { 
    req.session.topic="Delete software success";
    req.session.success=true;
    const { id } = req.params;
    try {
        const value =  await db.query('DELETE FROM software WHERE swid= $1',[id], (err) => {
            if(err){console.error(err);return;}
          });    
    } catch (err) {
        let error = {msg:"Error Cannot Delete Software!", type:'Delete',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
    } finally {
        res.redirect('/software/');
    } 
};


controller.edit = async (req,res) => { 
    const { id } = req.params;
    const softwaredata =  await db.query('SELECT * FROM software WHERE swid= $1',[id], (err) => {
        if(err){res.json(err);}
    });
    
    db.query('SELECT * FROM  hardware',function(err,hwdata){
        if (err) {console.error(err);return;}
        res.render('softwareForm',{data:softwaredata.rows[0],hwdata:hwdata.rows,session:req.session}); 
    });

};

controller.update = async (req,res) => { 
    const { id } = req.params;
    const data = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/software/edit/'+id)
    }else{
        req.session.topic="Edit software success";
        req.session.success=true;
        
        const value =  await db.query('UPDATE software SET version=$1,hardwareid=$2,versiondate=$3,comment=$4 WHERE swid= $5',[data.version,data.hardwareId,data.versiondate,data.comment,id], (err) => {
            if(err){res.json(err);}
          });
        res.redirect('/software/');    
    }
    
};

module.exports = controller;