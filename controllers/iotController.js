const controller = {};
const conn = require('./db');

controller.project = async (req,res) => { 
   
        conn.query('SELECT * FROM hardware',function(error,result){
            if(error) throw error;
            res.render('iotProject',{data:result.rows});
        });
      
           

};

module.exports = controller;