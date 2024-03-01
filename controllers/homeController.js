const controller = {};
const db = require('./db');

controller.index =  (req,res) => { 
    res.render('index');
}

controller.login =  (req,res) => { 
    const username = req.body.username;
    const password = req.body.password;

    if(username == "mirot" && password == "Passw0rd"){
        res.send("OK")
    }else{
        res.send("ERROR")
    }
}

controller.home =  (req,res) => { 

    db.query('SELECT count(*) as hardware FROM hardware',function(err,hardwaredata){
        db.query('SELECT count(*) as device FROM device',function(err,devicedata){
            db.query('SELECT count(*) as register FROM register',function(err,registerdata){
                db.query('SELECT count(*) as user FROM iotuser',function(err,userdata){
                    db.query('SELECT count(*) as site FROM site',function(err,sitedata){
                        db.query('SELECT count(*) as room FROM room',function(err,roomdata){
                            db.query('SELECT count(*) as owner FROM deviceowner',function(err,ownerdata){
                                if (err) {console.error(err);return;}
        res.render('home',{hardware:hardwaredata.rows[0],device:devicedata.rows[0],register:registerdata.rows[0],user:userdata.rows[0],site:sitedata.rows[0],room:roomdata.rows[0],owner:ownerdata.rows[0],session:req.session});
   
    });  });  });  });  });  }); });

   
   
    
    
   // res.render('home',{hardware:hardwaredata[0],device:devicedata[0],register:registerdata[0],user:userdata[0],site:sitedata[0],room:roomdata[0],owner:ownerdata[0],session:req.session});
   
};

module.exports = controller;