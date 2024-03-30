const express = require("express");
const app = express();

app.set('trust proxy', 1);

app.set("view engine","ejs");

const session = require("express-session");
const MemoryStore = require('memorystore')(session)

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: 'secret!',
    saveUninitialized: true
}))     
    
const body = require("body-parser");

app.use(express.json()) //For JSON requests
app.use(express.urlencoded({extended: true}));

process.env.TZ = "Asia/Bangkok";

const UserData=[ {
  username: "admin",
  password: "Passw0rd!"
},
{
  username: "mirot",
  password: "Passw0rd!"
} ]

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

// User Mode
const userHomeRoute = require("./routes/userHomeRoute");
app.use("/user",userHomeRoute);

const userSiteRoute = require("./routes/userSiteRoute");
app.use("/user/site",userSiteRoute);

const userRoomRoute = require("./routes/userRoomRoute");
app.use("/user/room",userRoomRoute);

const userOwnerRoute = require("./routes/userOwnerRoute");
app.use("/user/owner",userOwnerRoute);

const userAddRoute = require("./routes/userAddRoute");
app.use("/user/add",userAddRoute);

const useriotRoute = require("./routes/useriotRoute");
const { publicEncrypt } = require("crypto");
app.use("/user/iot",useriotRoute);

let downloadCounter = 1;
const LAST_VERSION = 0.2;
app.get('/iot/update', (request, response) => {
    const version = (request.header("x-esp8266-version"))?parseFloat(request.header("x-esp8266-version")):0;
     console.log(version);
    if (version>0 && !(version==LAST_VERSION)){
        // If you need an update go here
        if(version==0.3){
          console.log("GO3");
        response.status(200).download(path.join(__dirname,'public/iot/OTI4.bin'), 'OTI.bin', (err)=>{
            if (err) {
                console.error("Problem on download firmware: ", err)
            }else{
                downloadCounter++;
            }
        });
      }
        if(version==0.4){
          console.log("GO4");
        response.status(200).download(path.join(__dirname,'public/iot/OTI3.bin'), 'OTI.bin', (err)=>{
          if (err) {
              console.error("Problem on download firmware: ", err)
          }else{
              downloadCounter++;
          }
        });
      }

        console.log('Your file has been downloaded '+downloadCounter+' times!')
    }else{
        response.status(304).send('No update needed!')
    }
});

app.listen("3000");