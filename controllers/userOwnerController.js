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


module.exports = controller;