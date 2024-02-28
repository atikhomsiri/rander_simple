const express = require("express");
const app = express();
const { Client } = require('pg');

app.set("view engine","ejs");

const dotenv = require('dotenv');
dotenv.config();

const iotRoute = require("./routes/iotRoute");
app.use("/",iotRoute);

app.listen("3000");