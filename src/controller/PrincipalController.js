const client = require('../database');
const request = require("request");

const getSeries = (req, res) =>{
    request('https://api.tvmaze.com/search/shows?q=girls', (error, response, body) =>{
        
        if(error) console.log('Error:', error);
        else{
            const users = JSON.parse(body);
            console.log(users)
        }

    });
}