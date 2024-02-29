const controller = {};
const conn = require('./db');

controller.project = (req,res) => { 
   
        conn.query('SELECT * FROM hardware',function(error,result){
            if(error) throw error;
            res.render('iotProject',{data:result.rows});
        });
      
           

};

controller.iot = (req,res) => { 
   
  res.end("IOT Hello!");
};

module.exports = controller;