const express = require("express");
const app = express();

app.set("view engine","ejs");

const session = require("express-session");
app.use(session({secret:"Passw0rd"}));

const body = require("body-parser");
app.use(body());


const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')))

const iotRoute = require("./routes/iotRoute");
app.use("/",iotRoute);

app.listen("3000");