const express = require('express');
const apiRoute = require('./route/route')
const PORT = 5000;
const app = express();

apiV1(app);

app.listen((PORT) =>{
    console.log('running on: ', PORT);
});
