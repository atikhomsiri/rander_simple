const controller = {};
const db = require('./db');

controller.project = async (req,res) => { 
    
    try {
        const result = await db.query('SELECT * FROM hardware');
        res.render('iotProject',{data:result.rows});
        //res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
           

};

module.exports = controller;