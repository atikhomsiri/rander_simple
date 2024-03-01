const controller = {};
const { validationResult } = require("express-validator");
const {InfluxDB, Point} = require('@influxdata/influxdb-client')
const db = require('./db');

const token = "pUSqccneRAiNvKTtiTdnhnlbYynyUcPLtffybhAaZ3Wp6FvlZz15IPu201jKaXfPctbW4iJGeaFZm4mrxgZuGw=="
const url = 'https://eu-central-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = `e266c442dcee6ac5`
let bucket = `THESABAN`

var macdata=[];
var emaildata=[];


controller.list = (req,res) => { 
    db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid',function(err,ownerdata){
        if (err) {console.error(err);return;}
        res.render('owner',{data:ownerdata.rows,session:req.session});  
    });
};

controller.menuinflux = (req,res) => { 
    db.query('SELECT * FROM hardware',function(err,hwdata){
        if (err) {console.error(err);return;}
        res.render('influxMenu',{datapoint:"",datahw:hwdata.rows,session:req.session});
    }); 
};

controller.readinflux = async (req,res) => { 
    const { id } = req.params;
    var datapoint;
    var datapointid=id;
    const data4 =  await db.query('SELECT * FROM hardware WHERE hwid= $1',[id], (err) => {
        if(err){res.json(err);}
    });

    datapoint=data4.rows[0].datapoint;             
    let queryClient = client.getQueryApi(org)
    let fluxQuery = `from(bucket: "`+bucket+`")
    |> range(start: -5m)
    |> filter(fn: (r) => r._measurement == "`+datapoint+`")
    |> filter(fn: (r) => r._value == 1)
    |> filter(fn: (r) => r._field == "register")`
    var j=0;
    queryClient.queryRows(fluxQuery, {
    next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row)
        macdata[j]=tableObject.device;
        emaildata[j]=tableObject.email;
        j++;
    },
    error: (error) => {
        console.error('\nError', error)
    },
    complete: () => {

    var udata;
    var mdata=[];
    
const step = (prop) => {
    return new Promise(resolve => {
        setTimeout(() =>
        resolve(`done ${prop}`), 200);
    })
}
//console.log(macdata);
//console.log(emaildata);
var k=0;
var p=0;
var sendmac=[];
var sendemail=[];
var senddid=[];
var senduid=[];
var sendtype=[];
const influxgo = async () => {
    for (const prop of macdata) { 
        var y=prop;
        var x=emaildata[k];
        k++;
        const data2 =  await db.query('SELECT * FROM iotuser JOIN register ON iotuser.registerid=register.rid WHERE email= $1',[x], (err) => {
            if(err){res.json(err);}
        });

        const data1 =  await db.query('SELECT * FROM device WHERE mac= $1 AND hardwareid= $2',[y,datapointid], (err) => {
            if(err){res.json(err);}
        });

        const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN device ON deviceowner.deviceid=device.did JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE mac= $1',[y], (err) => {
            if(err){res.json(err);}
        });
      
        if(data2.rows.length>0 && data1.rows.length>0){
            checkmac=0;
            //console.log(ownerdata);
            for(var z=0;z<sendmac.length;z++){ if(y==sendmac[z] && x==sendemail[z])checkmac=1; }
                if(data1.rows[0].did>0 && data2.rows[0].uid>0 && checkmac==0) { 
                    if(ownerdata.rows.length==0){sendtype[p]=0;}else if(ownerdata.rows[0].email==x){sendtype[p]=2;}else{sendtype[p]=1;}
                sendmac[p]=y;
                sendemail[p]=x;
                senddid[p]=data1.rows[0].did;
                senduid[p]=data2.rows[0].uid;
                p++;
                }
            }
        await step(prop);
    }
    res.render('influxRead',{datapointid:datapointid,datapoint:datapoint,datam:sendmac,datadid:senddid,dataemail:sendemail,datatype:sendtype,datauid:senduid,datahw:null,session:req.session});
}
influxgo()    
    },
    })  
};

controller.add = async (req,res) => { 
    const { uid } = req.params;
    const { did } = req.params;
    if(uid>0 && did>0){ 
        const ownerdata =  await db.query('SELECT * FROM deviceowner WHERE deviceId= $1',[did], (err) => {
            if(err){res.json(err);}
        });
        
        if(ownerdata.rows.length>0){
            req.session.topic="Change Device Owner success";
            req.session.success=true;
            const value =  await db.query('UPDATE deviceowner SET userid= $1,siteid=NULL,roomid=NULL,adddate=DATE(NOW()) WHERE deviceid= $2',[uid,did], (err) => {
                if(err){res.json(err);}
            });
            res.redirect('/owner/');
        }else{ 
            req.session.topic="Add Device Owner success";
            req.session.success=true;
            const value =  await db.query('INSERT INTO deviceowner(deviceid,userid,adddate) VALUES ($1,$2,DATE(NOW()))',[did,uid], (err) => {
                if(err){res.json(err);}
            });
            res.redirect('/owner/');
        } 

    }else{
        res.redirect('/owner/');
    }
    
  };

controller.delete = async (req,res) => { 
    req.session.topic="Delete Device Owner success";
    req.session.success=true;
    const { did } = req.params;
    const { uid } = req.params;
    try {
        const value =  await db.query('DELETE FROM deviceowner WHERE deviceid= $1 and userid = $2',[did,uid], (err) => {
            if(err){console.error(err);return;}
          });    
    } catch (err) {
        let error = {msg:"Error Cannot Delete Device Owner!", type:'Delete',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
    } finally {
        res.redirect('/owner/');
    } 

};

controller.site = async (req,res) => { 
    const { did } = req.params;
    const { uid } = req.params;

    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 and uid = $2',[did,uid], (err) => {
        if(err){res.json(err);}
    });

    const sitedata =  await db.query('SELECT * FROM site JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE iotuser.uid=$1',[uid], (err) => {
        if(err){res.json(err);}
    });

    res.render('ownerSite',{data:ownerdata.rows[0],sdata:sitedata.rows,session:req.session});
};

controller.addsite = async (req,res) => { 
    const data = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/owner/site/'+data.deviceId+"/"+data.userId)
    }else{
        req.session.topic="Site assign success";
        req.session.success=true;
        const value =  await db.query('UPDATE deviceowner SET siteid=$1 WHERE deviceid= $2 and userid=$3',[data.siteId,data.deviceId,data.userId], (err) => {
            if(err){res.json(err);}
          });
        res.redirect('/owner/'); 
    } 
};

controller.clearsite = async (req,res) => { 
    const { did } = req.params;
    const { uid } = req.params;
        req.session.topic="Site clear success!";
        req.session.success=true;
        const value =  await db.query('UPDATE deviceowner SET siteid=NULL,roomid=NULL WHERE deviceid= $1 AND userid=$2',[did,uid], (err) => {
            if(err){res.json(err);}
          });
        res.redirect('/owner/'); 

};


controller.room = async(req,res) => { 
    const { did } = req.params;
    const { uid } = req.params;
    const { sid } = req.params;

    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid = $2 AND sid = $3',[did,uid,sid], (err) => {
        if(err){res.json(err);}
    });

    const roomdata =  await db.query('SELECT * FROM room JOIN site ON room.siteid=site.sid JOIN iotuser ON site.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid WHERE iotuser.uid=$1 AND site.sid= $2',[uid,sid], (err) => {
        if(err){res.json(err);}
    });
    res.render('ownerRoom',{data:ownerdata.rows[0],rdata:roomdata.rows,session:req.session});
};


controller.addroom = async (req,res) => { 
    const data = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        req.session.error=error;
        req.session.success=false;
        res.redirect('/owner/room/'+data.deviceId+"/"+data.userId+"/"+data.siteId)
    }else{
        req.session.topic="Room assign success";
        req.session.success=true;
        const value =  await db.query('UPDATE deviceowner SET roomId=$1 WHERE deviceId= $2 AND userId=$3 AND siteId=$4',[data.roomId,data.deviceId,data.userId,data.siteId], (err) => {
            if(err){res.json(err);}
        });
        res.redirect('/owner/');  
    }  
};

controller.clearroom = async (req,res) => { 
    const { did } = req.params;
    const { uid } = req.params;
        req.session.topic="Room clear success!";
        req.session.success=true;
        const value =  await db.query('UPDATE deviceowner SET roomid=NULL WHERE deviceid= $1 AND userid=$2',[did,uid], (err) => {
            if(err){res.json(err);}
        });
        res.redirect('/owner/');

};

module.exports = controller;