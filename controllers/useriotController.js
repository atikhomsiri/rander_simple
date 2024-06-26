const controller = {};
const { validationResult } = require("express-validator");
const {InfluxDB, Point} = require('@influxdata/influxdb-client')
const db = require('./db');


const token = "pUSqccneRAiNvKTtiTdnhnlbYynyUcPLtffybhAaZ3Wp6FvlZz15IPu201jKaXfPctbW4iJGeaFZm4mrxgZuGw=="
const url = 'https://eu-central-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = `e266c442dcee6ac5`
let bucket = `THESABAN`

controller.airpollution = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;

    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 AND datapoint=$3',[did,uid,"airpollution"]);
    
    if(ownerdata.rowCount>0){
        var pm25value=null;
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "airpollution")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> filter(fn: (r) => r["_field"] == "pm2_5")
        |> last()`
        var j=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                //console.log(tableObject._value);
                pm25value=tableObject._value;
                j++;
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotAir',{data:ownerdata.rows[0],pm25data:pm25value,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
};

controller.sos = async (req,res) => { 
    const { did } = req.params; 
    const uid = req.session.uid;
    
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid JOIN software ON device.softwareid=software.swid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 AND datapoint=$3',[did,uid,"sos"]);
    if(ownerdata.rowCount>0){
        var sosvalue=null;
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "sos")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> filter(fn: (r) => r["_field"] == "sosvalue")
        |> last()`
        var j=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                //console.log(tableObject._value);
                sosvalue=tableObject._value;
                j++;
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotSOS',{data:ownerdata.rows[0],sosdata:sosvalue,session:req.session});
                     
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
   

    
};

controller.esp01 = async (req,res) => { 
    const { did } = req.params; 
    const uid = req.session.uid;
    
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN software ON device.softwareid=software.swid LEFT JOIN (SELECT hardwareid,max(version) FROM software GROUP BY hardwareid) as b ON device.hardwareid=b.hardwareid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 AND datapoint=$3',[did,uid,"esp01"]);
    if(ownerdata.rowCount>0){
        
        var iotvalue=null;
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "esp01")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> filter(fn: (r) => r["_field"] == "rssi")
        |> last()`
        var j=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
        //console.log(tableObject._value);
                iotvalue=tableObject._value;
                j++;
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 

                res.render('user/useriotESP01',{data:ownerdata.rows[0],iotdata:iotvalue,session:req.session});
                     
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }    
};


controller.noise = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;

    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 AND datapoint=$3',[did,uid,"noise"]);
    if(ownerdata.rowCount>0){
        var pm25value=null;
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "noise")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> filter(fn: (r) => r["_field"] == "db")
        |> last()`
        var j=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                //console.log(tableObject._value);
                noisevalue=tableObject._value;
                j++;
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotNoise',{data:ownerdata.rows[0],noisedata:noisevalue,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
};

controller.people = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;

    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 AND datapoint=$3',[did,uid,"people"]);
    if(ownerdata.rowCount>0){
        var pm25value=null;
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "people")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> filter(fn: (r) => r["_field"] == "count")
        |> last()`
        var j=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                //console.log(tableObject._value);
                countvalue=tableObject._value;
                j++;
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotPeople',{data:ownerdata.rows[0],countdata:countvalue,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }

};


controller.monitor = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;

    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 AND datapoint=$3',[did,uid,"monitor"]);
    if(ownerdata.rowCount>0){
        var pm25value=null;
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "monitor")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> filter(fn: (r) => r["_field"] == "show")
        |> last()`
        var j=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                //console.log(tableObject._value);
                showvalue=tableObject._value;
                j++;
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotMonitor',{data:ownerdata.rows[0],showdata:showvalue,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }

};

controller.deviceupdate = async (req,res) => { 
    const { did } = req.params; 
    const uid = req.session.uid;
    
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN software ON device.softwareid=software.swid LEFT JOIN (SELECT hardwareid,swid as maxid,version as max FROM software ORDER BY version DESC) as b ON device.hardwareid=b.hardwareid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 AND datapoint=$3 ORDER BY MAX DESC LIMIT 1',[did,uid,"esp01"]);
   //console.log(ownerdata.rowCount);
    if(ownerdata.rowCount>0){
        if(ownerdata.rows[0].max>ownerdata.rows[0].version){
     
            //res.json(ownerdata.rows[0]);
            req.session.topic="Set update device software success";
            req.session.success=true;
            const value =  await db.query('UPDATE device SET softwareid=$1 WHERE did= $2',[ownerdata.rows[0].maxid,did], (err) => {
                if(err){res.json(err);}
              });
            res.redirect('/user/owner/');

        }else{
            res.send("NOT UPDATE");
        }
        
    }
}

controller.dayiot = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;
    let fieldname= null;
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
    
    if(ownerdata.rows[0].datapoint=="airpollution"){fieldname="pm2_5";}
    if(ownerdata.rows[0].datapoint=="noise"){fieldname="db";}
    
    if(ownerdata.rowCount>0){
        var valuedata=[];
        var timedata=[];
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -24h)
        |> filter(fn: (r) => r["_measurement"] == "`+ownerdata.rows[0].datapoint+`")
        |> filter(fn: (r) => r["_field"] == "`+fieldname+`")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
        |> yield(name: "mean")`
        var i=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                valuedata[i]=tableObject._value;
                timedata[i]=tableObject._time;
                i++
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotDay',{data:ownerdata.rows[0],valuedata:valuedata,timedata:timedata,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
};


controller.weekiot = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;
    let fieldname= null;
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
    
    if(ownerdata.rows[0].datapoint=="airpollution"){fieldname="pm2_5";}
    if(ownerdata.rows[0].datapoint=="noise"){fieldname="db";}
    
    if(ownerdata.rowCount>0){
        var valuedata=[];
        var timedata=[];
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -7d)
        |> filter(fn: (r) => r["_measurement"] == "`+ownerdata.rows[0].datapoint+`")
        |> filter(fn: (r) => r["_field"] == "`+fieldname+`")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> aggregateWindow(every: 6h, fn: mean, createEmpty: false)
        |> yield(name: "mean")`
        var i=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                valuedata[i]=tableObject._value;
                timedata[i]=tableObject._time;
                i++
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotWeek',{data:ownerdata.rows[0],valuedata:valuedata,timedata:timedata,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
};


controller.monthiot = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;
    let fieldname= null;
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
    
    if(ownerdata.rows[0].datapoint=="airpollution"){fieldname="pm2_5";}
    if(ownerdata.rows[0].datapoint=="noise"){fieldname="db";}
    
    if(ownerdata.rowCount>0){
        var valuedata=[];
        var timedata=[];
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -30d)
        |> filter(fn: (r) => r["_measurement"] == "`+ownerdata.rows[0].datapoint+`")
        |> filter(fn: (r) => r["_field"] == "`+fieldname+`")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> aggregateWindow(every: 24h, fn: mean, createEmpty: false)
        |> yield(name: "mean")`
        var i=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                valuedata[i]=tableObject._value;
                timedata[i]=tableObject._time;
                i++
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotMonth',{data:ownerdata.rows[0],valuedata:valuedata,timedata:timedata,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
};

controller.maxdayiot = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;
    let fieldname= null;
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
    
    if(ownerdata.rows[0].datapoint=="airpollution"){fieldname="pm2_5";}
    if(ownerdata.rows[0].datapoint=="noise"){fieldname="db";}
    
    if(ownerdata.rowCount>0){
        var valuedata=[];
        var timedata=[];
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -24h)
        |> filter(fn: (r) => r["_measurement"] == "`+ownerdata.rows[0].datapoint+`")
        |> filter(fn: (r) => r["_field"] == "`+fieldname+`")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> aggregateWindow(every: 1h, fn: max, createEmpty: false)
        |> yield(name: "max")`
        var i=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                valuedata[i]=tableObject._value;
                timedata[i]=tableObject._time;
                i++
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotDayMax',{data:ownerdata.rows[0],valuedata:valuedata,timedata:timedata,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
};


controller.maxweekiot = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;
    let fieldname= null;
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
    
    if(ownerdata.rows[0].datapoint=="airpollution"){fieldname="pm2_5";}
    if(ownerdata.rows[0].datapoint=="noise"){fieldname="db";}
    
    if(ownerdata.rowCount>0){
        var valuedata=[];
        var timedata=[];
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -7d)
        |> filter(fn: (r) => r["_measurement"] == "`+ownerdata.rows[0].datapoint+`")
        |> filter(fn: (r) => r["_field"] == "`+fieldname+`")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> aggregateWindow(every: 6h, fn: max, createEmpty: false)
        |> yield(name: "max")`
        var i=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                valuedata[i]=tableObject._value;
                timedata[i]=tableObject._time;
                i++
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotWeekMax',{data:ownerdata.rows[0],valuedata:valuedata,timedata:timedata,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
};

controller.maxmonthiot = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;
    let fieldname= null;
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
    
    if(ownerdata.rows[0].datapoint=="airpollution"){fieldname="pm2_5";}
    if(ownerdata.rows[0].datapoint=="noise"){fieldname="db";}
    
    if(ownerdata.rowCount>0){
        var valuedata=[];
        var timedata=[];
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -30d)
        |> filter(fn: (r) => r["_measurement"] == "`+ownerdata.rows[0].datapoint+`")
        |> filter(fn: (r) => r["_field"] == "`+fieldname+`")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> aggregateWindow(every: 24h, fn: max, createEmpty: false)
        |> yield(name: "max")`
        var i=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                valuedata[i]=tableObject._value;
                timedata[i]=tableObject._time;
                i++
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotMonthMax',{data:ownerdata.rows[0],valuedata:valuedata,timedata:timedata,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
};


controller.summonthiot = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;
    let fieldname= null;
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
     if(ownerdata.rows[0].datapoint=="people"){fieldname="count";}
    
    if(ownerdata.rowCount>0){
        var valuedata=[];
        var timedata=[];
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -30d)
        |> filter(fn: (r) => r["_measurement"] == "`+ownerdata.rows[0].datapoint+`")
        |> filter(fn: (r) => r["_field"] == "`+fieldname+`")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> aggregateWindow(every: 24h, fn: sum, createEmpty: false)
        |> yield(name: "sum")`
        var i=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                valuedata[i]=tableObject._value;
                timedata[i]=tableObject._time;
                i++
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotMonthSum',{data:ownerdata.rows[0],valuedata:valuedata,timedata:timedata,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
};

controller.sumweekiot = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;
    let fieldname= null;
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
    if(ownerdata.rows[0].datapoint=="people"){fieldname="count";}
    
    if(ownerdata.rowCount>0){
        var valuedata=[];
        var timedata=[];
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -7d)
        |> filter(fn: (r) => r["_measurement"] == "`+ownerdata.rows[0].datapoint+`")
        |> filter(fn: (r) => r["_field"] == "`+fieldname+`")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> aggregateWindow(every: 6h, fn: sum, createEmpty: false)
        |> yield(name: "sum")`
        var i=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                valuedata[i]=tableObject._value;
                timedata[i]=tableObject._time;
                i++
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotWeekSum',{data:ownerdata.rows[0],valuedata:valuedata,timedata:timedata,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
};

controller.sumdayiot = async (req,res) => { 
    const { did } = req.params;
    const uid = req.session.uid;
    let fieldname= null;
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
    if(ownerdata.rows[0].datapoint=="people"){fieldname="count";}
    
    if(ownerdata.rowCount>0){
        var valuedata=[];
        var timedata=[];
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -24h)
        |> filter(fn: (r) => r["_measurement"] == "`+ownerdata.rows[0].datapoint+`")
        |> filter(fn: (r) => r["_field"] == "`+fieldname+`")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> aggregateWindow(every: 1h, fn: sum, createEmpty: false)
        |> yield(name: "sum")`
        var i=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                valuedata[i]=tableObject._value;
                timedata[i]=tableObject._time;
                i++
            },
            error: (error) => {
                console.error('\nError', error)
            },
            complete: () => {
                const step = (prop) => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                        resolve(`done ${prop}`), 100);
                    })
                } 
                
                res.render('user/useriotDaySum',{data:ownerdata.rows[0],valuedata:valuedata,timedata:timedata,session:req.session});       
            } 
        });
    }else{
        let error = {msg:"Error Cannot Show IOT Device!", type:'show',location: 'body',  value:'errors'};
        req.session.error = {"errors":[error]};
        req.session.topic=null;
        req.session.success=false;
        res.redirect('/user/owner/');
    }
};

module.exports = controller;