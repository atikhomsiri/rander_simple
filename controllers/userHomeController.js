const controller = {};
const db = require('./db');
const jwt = require('jsonwebtoken');

controller.home =  async (req,res) => { 
    const uid = req.session.uid;
    const roomnum =  await db.query('SELECT count(*) FROM room JOIN site ON room.siteid=site.sid JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE userid=$1',[uid], (err) => {
                if(err){res.json(err);}
    });
    const sitenum =  await db.query('SELECT count(*) FROM site JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE uid=$1',[uid], (err) => {
        if(err){res.json(err);}
    });
    const devicenum =  await db.query('SELECT count(*) FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE uid=$1',[uid], (err) => {
        if(err){res.json(err);}
    });
    
    res.render('user/userhome',{site:sitenum.rows[0].count,room:roomnum.rows[0].count,owner:devicenum.rows[0].count,session:req.session});
}

controller.logout =  (req,res) => { 
    req.session.token = null;
    res.redirect('/');
}

module.exports = controller;