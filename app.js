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

const iotRoute = require("./routes/iotRoute");
app.use("/",iotRoute);

app.listen("3000");