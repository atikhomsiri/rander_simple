const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');
const bcrypt = require("bcrypt");

controller.list = (req,res) => { 
    db.query('SELECT * FROM iotuser JOIN register ON iotuser.registerid=register.rid ORDER BY commitdate DESC',function(err,userdata){
        if (err) {console.error(err);return;}
        res.render('user',{data:userdata.rows,session:req.session});
    });
};


controller.delete = async (req,res) => { 
    req.session.topic="Delete user success";
    req.session.success=true;
    const { id } = req.params;
    try {
        const value =  await db.query('DELETE FROM iotuser WHERE uid= $1',[id], (err) => {
            if(err){console.error(err);return;}
          });    
    } catch (err) {
        let error = {msg:"Error Cannot Delete User!", type:'Delete',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
    } finally {
        res.redirect('/user/');
    } 

};

controller.add = async (req,res) =>{
    const { id } = req.params;
    const value =  await db.query('SELECT * FROM register WHERE rid= $1',[id], (err) => {
        if(err){res.json(err);}
    });
    res.render('userForm',{data:value.rows[0],session:req.session});
}

controller.new = async (req,res) => { 
    const { id } = req.params;
    const data = req.body;
    const error = validationResult(req);
    
    if(!error.isEmpty()){  
        req.session.error=error;
        req.session.success=false;
        res.redirect('/user/add/'+id)
    }else{
        
        if(data.password1==data.password2){
            req.session.topic="Admit user success";
            req.session.success=true;
            const hashvalue= await bcrypt.hash(data.password1,parseInt(5));
            //console.log(hashvalue);
           const value =  await db.query('INSERT INTO iotuser (registerid,hash,commitdate) VALUES ($1,$2,DATE(NOW()))',[id,hashvalue]);
           res.redirect('/user/');
        }else{
            let error = {msg:"Error Password not Matches!", type:'Add',location: 'body',  value:'errors'};
            req.session.error = {"errors":[error]};
            req.session.topic=null;
            req.session.success=false;
            res.redirect('/user/add/'+id)
        }
       
    };
           

}

    
   

module.exports = controller;