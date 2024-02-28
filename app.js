const express = require("express");
const app = express();
const { Client } = require('pg');

app.set("view engine","ejs");

const client = new Client({
    user: 'sql_thesaban_user',
    password: 'passwords4q0wCqmsxZZbhLvf9EgGrUC2FvU05pl',
    host: 'hostdpg-cnakvida73kc73eng0v0-a.oregon-postgres.render.com',
    port: '5432',
    database: 'sql_thesaban',
  });

  client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });
  
const iotRoute = require("./routes/iotRoute");
app.use("/",iotRoute);

app.listen("3000");