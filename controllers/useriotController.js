const controller = {};
const { validationResult } = require("express-validator");
const {InfluxDB, Point} = require('@influxdata/influxdb-client')
const db = require('./db');


const token = "pUSqccneRAiNvKTtiTdnhnlbYynyUcPLtffybhAaZ3Wp6FvlZz15IPu201jKaXfPctbW4iJGeaFZm4mrxgZuGw=="
const url = 'https://eu-central-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = `e266c442dcee6ac5`
let bucket = `THESABAN`


controller.esp01 = async (req,res) => { 
    const { did } = req.params;
    const { uid } = req.params;  
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);

        var value=null;
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
                value=tableObject._value;
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
                res.render('iotESP01',{data:ownerdata.rows[0],valuedata:value,session:req.session});
            } 
        }); 
      
    

 };

controller.nodemcu = async (req,res) => { 
    const { did } = req.params;
    const { uid } = req.params; 

        const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
        var value=null;
        let queryClient = client.getQueryApi(org)
        let fluxQuery = `from(bucket: "`+bucket+`")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "nodemcu")
        |> filter(fn: (r) => r["device"] == "`+ownerdata.rows[0].mac+`")
        |> filter(fn: (r) => r["_field"] == "rssi")
        |> last()`
        var j=0;
        queryClient.queryRows(fluxQuery, {   
            next: (row, tableMeta) => {
                const tableObject = tableMeta.toObject(row)
                //console.log(tableObject._value);
                value=tableObject._value;
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
                res.render('iotNodemcu',{data:ownerdata.rows[0],valuedata:value,session:req.session});
               
            } 
        });
 };


controller.airpollution = async (req,res) => { 
    const { did } = req.params;
    const { uid } = req.params;  
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
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
                
                res.render('iotAir',{data:ownerdata.rows[0],pm25data:pm25value,session:req.session});       
            } 
        });

};


controller.sos = async (req,res) => { 
    const { did } = req.params;
    const { uid } = req.params;  

    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
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
            
            res.render('iotSOS',{data:ownerdata.rows[0],sosdata:sosvalue,session:req.session});
                 
        } 
    });

    
};

controller.noise = async (req,res) => { 
    const { did } = req.params;
    const { uid } = req.params;  
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
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
                
                res.render('iotNoise',{data:ownerdata.rows[0],noisedata:noisevalue,session:req.session});       
            } 
        });

};

controller.people = async (req,res) => { 
    const { did } = req.params;
    const { uid } = req.params;  
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
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
                
                res.render('iotPeople',{data:ownerdata.rows[0],countdata:countvalue,session:req.session});       
            } 
        });

};


controller.monitor = async (req,res) => { 
    const { did } = req.params;
    const { uid } = req.params;  
    const ownerdata =  await db.query('SELECT * FROM deviceowner JOIN iotuser ON deviceowner.userid=iotuser.uid JOIN register ON iotuser.registerid=register.rid JOIN device ON deviceowner.deviceid=device.did JOIN hardware ON device.hardwareid=hardware.hwid LEFT JOIN site ON deviceowner.siteid=site.sid LEFT JOIN room ON deviceowner.roomid=room.roid WHERE deviceid= $1 AND uid= $2 ',[did,uid]);
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
                
                res.render('iotMonitor',{data:ownerdata.rows[0],showdata:showvalue,session:req.session});       
            } 
        });

};

module.exports = controller;