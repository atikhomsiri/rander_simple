const express = require("express");
const app = express();

app.set("view engine","ejs");
const session = require("express-session");

const iotRoute = require("./routes/iotRoute");
app.use("/",iotRoute);

app.listen("3000");