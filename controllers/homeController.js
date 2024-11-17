const controller = {};
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

controller.index =  (req,res) => { 
    res.render('index');
}

controller.signup =  (req,res) => { 
    res.render('signup');
}

controller.register = (req,res) => { 

        const data = req.body;        
        let dd = new Date().toLocaleDateString('en-US');
       //res.send(dd);
        // res.send("NAME : "+data.name+" EMAIL :  "+data.email+" PHONE : "+data.phone);
       db.query('INSERT INTO register(name,email,phone,registerdate) VALUES ($1,$2,$3,$4)',[data.name,data.email,data.phone,dd],function(err,result){
            if (err) {res.send(err);console.error(err);return;}
            res.send("Register OK");
        });
    
        //const value =  await db.query('INSERT INTO register(name,email,phone,registerdate) VALUES ($1,$2,$3,GETDATE())',[data.name,data.email,data.phone]);
       // res.redirect('/');
};


controller.logout =  (req,res) => { 
    req.session.token = null;
    res.redirect('/');
}

controller.login =  async (req,res) => { 
    const username = req.body.username;
    const password = req.body.password;
    

    if(username == "mirot" && password == "Passw0rd"){
        const accessToken = jwt.sign({ user: username,  role: "admin" }, "thesaban.secret");
        req.session.token = accessToken;
        res.redirect('/home')
    }else{
        const value =  await db.query('SELECT * FROM register JOIN iotuser ON register.rid=iotuser.registerid WHERE email= $1',[username], (err) => {
            if(err){res.json(err);}
        });
        
        if(value.rowCount>0){
            const match = await bcrypt.compare(password,value.rows[0].hash);   
            if(match){
                const uid= value.rows[0].uid;
                const accessToken = jwt.sign({ user: username, uid: uid,  role: "user" }, "thesaban.secret");
                req.session.token = accessToken;

                res.redirect('/user/home')
            }else{
                res.redirect('/')
            }
        }else{
            res.redirect('/')
        }
    }
}

controller.home =  (req,res) => { 

    db.query('SELECT count(*) as hardware FROM hardware',function(err,hardwaredata){
        db.query('SELECT count(*) as software FROM software',function(err,softwaredata){
        db.query('SELECT count(*) as device FROM device',function(err,devicedata){
            db.query('SELECT count(*) as register FROM register',function(err,registerdata){
                db.query('SELECT count(*) as user FROM iotuser',function(err,userdata){
                    db.query('SELECT count(*) as site FROM site',function(err,sitedata){
                        db.query('SELECT count(*) as room FROM room',function(err,roomdata){
                            db.query('SELECT count(*) as owner FROM deviceowner',function(err,ownerdata){
                                if (err) {console.error(err);return;}
        res.render('home',{hardware:hardwaredata.rows[0],software:softwaredata.rows[0],device:devicedata.rows[0],register:registerdata.rows[0],user:userdata.rows[0],site:sitedata.rows[0],room:roomdata.rows[0],owner:ownerdata.rows[0],session:req.session});
   
    });  });  });  });  });  }); }); });

   
   
    
    
   // res.render('home',{hardware:hardwaredata[0],device:devicedata[0],register:registerdata[0],user:userdata[0],site:sitedata[0],room:roomdata[0],owner:ownerdata[0],session:req.session});
   
};
  
module.exports = controller;