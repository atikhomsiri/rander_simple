const controller = {};
const conn = require('./db');
const {InfluxDB, Point} = require('@influxdata/influxdb-client');

const token = "pUSqccneRAiNvKTtiTdnhnlbYynyUcPLtffybhAaZ3Wp6FvlZz15IPu201jKaXfPctbW4iJGeaFZm4mrxgZuGw=="
const url = 'https://eu-central-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = `e266c442dcee6ac5`
let bucket = `THESABAN`

controller.iot = (req,res) => { 
    let value=0;
    let queryClient = client.getQueryApi(org)
    let fluxQuery = `from(bucket: "THESABAN")
     |> range(start: -5m)
     |> filter(fn: (r) => r._measurement == "dht")
     |> filter(fn: (r) => r._field == "temp")
     |> last()`
     
    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row)
        value=tableObject._value;
        
      },
      error: (error) => {
        console.error('\nError', error)
      },
      complete: () => {
       
        res.end(value);

      },
    })
    
  };

controller.project = (req,res) => { 
   
        conn.query('SELECT * FROM hardware',function(error,result){
            if(error) throw error;
            res.render('iotProject',{data:result.rows});
        });
      
           

};


module.exports = controller;