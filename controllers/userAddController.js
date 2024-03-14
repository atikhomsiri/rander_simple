const controller = {};
const { validationResult } = require("express-validator");
const db = require('./db');
const {InfluxDB, Point} = require('@influxdata/influxdb-client')

const token = "pUSqccneRAiNvKTtiTdnhnlbYynyUcPLtffybhAaZ3Wp6FvlZz15IPu201jKaXfPctbW4iJGeaFZm4mrxgZuGw=="
const url = 'https://eu-central-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = `e266c442dcee6ac5`
let bucket = `THESABAN`

var macdata=[];
var emaildata=[];

controller.list = (req,res) => { 
    db.query('SELECT * FROM hardware',function(err,hwdata){
        if (err) {console.error(err);return;}
        res.render('user/useradd',{datapoint:"",datahw:hwdata.rows,session:req.session});
    }); 
};

controller.register = async (req,res) => { 
    const { id } = req.params;
    const uid = req.session.uid;
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
        const data2 =  await db.query('SELECT * FROM iotuser JOIN register ON iotuser.registerid=register.rid WHERE email= $1 AND uid=$2',[x,uid], (err) => {
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
    res.render('user/userRegister',{datapointid:datapointid,datapoint:datapoint,datam:sendmac,datadid:senddid,dataemail:sendemail,datatype:sendtype,datauid:senduid,datahw:null,session:req.session});
}
influxgo()    
    },
    })  
};


controller.add = async (req,res) => { 
    const { id,did } = req.params;
    const uid = req.session.uid;
    var datapoint;
    var datapoint=id;
    
    const data4 =  await db.query('SELECT * FROM device WHERE did= $1',[did], (err) => {
        if(err){res.json(err);}
    });

    const data5 =  await db.query('SELECT * FROM iotuser JOIN register ON iotuser.registerid=register.rid WHERE uid=$1',[uid], (err) => {
        if(err){res.json(err);}
    });

    const data6 =  await db.query('SELECT * FROM deviceowner WHERE deviceid= $1',[did], (err) => {
        if(err){res.json(err);}
    });

    //console.log(data4.rows[0].mac);
    //console.log(data5.rows[0].email);
    //console.log(data6.rows.length);

    const datamac = data4.rows[0].mac;
    const dataemail = data5.rows[0].email;
    let queryClient = client.getQueryApi(org)
    let fluxQuery = `from(bucket: "`+bucket+`")
    |> range(start: -5m)
    |> filter(fn: (r) => r._measurement == "`+datapoint+`")
    |> filter(fn: (r) => r["device"] == "`+datamac+`")
    |> filter(fn: (r) => r["device"] == "`+dataemail+`")
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

        const step = (prop) => {
            return new Promise(resolve => {
                setTimeout(() =>
                resolve(`done ${prop}`), 200);
            })
        }
        console.log(uid);
        console.log(did);
        if(macdata.length>0 && emaildata.length>0 && emaildata.length==macdata.length){
            if(uid>0 && did>0){ 
                            
                if(data6.rows.length>0){
                    req.session.topic="Change Device success";
                    req.session.success=true;
                    const value =  db.query('UPDATE deviceowner SET userid= $1,siteid=NULL,roomid=NULL,adddate=DATE(NOW()) WHERE deviceid= $2',[uid,did], (err) => {
                        if(err){res.json(err);}
                    });
                    res.redirect('/user/owner/');
                }else{ 
                    req.session.topic="Add Device success";
                    req.session.success=true;
                    const value =  db.query('INSERT INTO deviceowner(deviceid,userid,adddate) VALUES ($1,$2,DATE(NOW()))',[did,uid], (err) => {
                        if(err){res.json(err);}
                    });
                    res.redirect('/user/owner/');
                } 
        
            }else{
                res.redirect('/owner/');
            }
        }
   
         },
    })  
};

module.exports = controller;