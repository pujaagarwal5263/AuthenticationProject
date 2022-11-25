const dotenv=require("dotenv");
const express=require('express');
var cookieParser=require("cookie-parser");
const bodyParser=require("body-parser");

const routes = require("./src/routes/index");
require("./db-connection");

const app=express();

app.use(routes);
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(3000,()=>{
    console.log("Server is running");
})