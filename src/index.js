const express = require('express');
const apiRoute = require('./route/route')
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();

const PORT = 5000;
const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

apiRoute(app);

app.use((req, res)=>{
    res.status(404).send("NOT FOUND");
    res.end(); 
});


app.listen(PORT, ()=>{
    console.log("running on: "+ PORT);
});
