const express = require("express");
const app = express();

app.set("view engine","ejs");

const session = require("express-session");
const MemoryStore = require('memorystore')(session)

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: 'secret!'
}))     
    
const body = require("body-parser");
app.use(body());


const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')))

const hardwareRoute = require("./routes/hardwareRoute");
app.use("/hardware",hardwareRoute);

const deviceRoute = require("./routes/deviceRoute");
app.use("/device",deviceRoute);

const registerRoute = require("./routes/registerRoute");
app.use("/register",registerRoute);

const userRoute = require("./routes/userRoute");
app.use("/user",userRoute);

const siteRoute = require("./routes/siteRoute");
app.use("/site",siteRoute);

const roomRoute = require("./routes/roomRoute");
app.use("/room",roomRoute);

const ownerRoute = require("./routes/ownerRoute");
app.use("/owner",ownerRoute);

const homeRoute = require("./routes/homeRoute");
app.use("/",homeRoute);

const iotRoute = require("./routes/iotRoute");
app.use("/iot",iotRoute);

app.listen("3000");