const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');

controller.list = (req,res) => { 
    db.query('SELECT * FROM hardware',function(err,result){
        if (err) {console.error(err);return;}
        res.render('hardware',{data:result.rows,session:req.session});
    });
};

controller.delete = async (req,res) => { 
    req.session.topic="Delete hardware success";
    req.session.success=true;
    const { id } = req.params;
    try {
        const value =  await db.query('DELETE FROM hardware WHERE hwid= $1',[id], (err) => {
            if(err){console.error(err);return;}
          });    
    } catch (err) {
        let error = {msg:"Error Cannot Delete Hardware!", type:'Delete',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
    } finally {
        res.redirect('/hardware/');
    } 
};

controller.edit = async (req,res) => { 
    const { id } = req.params;
    const value =  await db.query('SELECT * FROM hardware WHERE hwid= $1',[id], (err) => {
        if(err){res.json(err);}
    });
    res.render('hardwareForm',{data:value.rows[0],session:req.session});   
};

controller.update = async (req,res) => { 
    const { id } = req.params;
    const data = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/hardware/edit/'+id)
    }else{
        req.session.topic="Edit hardware success";
        req.session.success=true;
        const value =  await db.query('UPDATE hardware SET hwname=$1,datapoint=$2,cpu=$3,input=$4,output=$5,hcomment=$6 WHERE hwid= $7',[data.hwname,data.datapoint,data.cpu,data.input,data.output,data.comment,id], (err) => {
            if(err){res.json(err);}
          });
        res.redirect('/hardware/');    
    }
    
};

controller.add = (req,res) => { 
            res.render('hardwareForm',{data:null,session:req.session});
};

controller.new = async (req,res) => { 
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/hardware/add')
    }else{
        req.session.topic="Add hardware success";
        req.session.success=true;
        const data = req.body;
        const value =  await db.query('INSERT INTO hardware(hwname,datapoint,cpu,input,output,hcomment) VALUES ($1,$2,$3,$4,$5,$6)',[data.hwname,data.datapoint,data.cpu,data.input,data.output,data.comment]);
        res.redirect('/hardware/');
    }
    
};

module.exports = controller;