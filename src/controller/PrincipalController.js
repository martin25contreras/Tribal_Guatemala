const {client} = require('../database');
const request = require("request");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

//client.connect();

//CREANDO USUARIO
const CreateUser = (req, res) =>{

    let {nombre, user_name, password} = req.body;
    const passwordHash = bcrypt.hashSync(password, saltRounds);
    
    client.query(
        `INSERT INTO users (nombre, user_name, password)
            VALUES ($1, $2, $3)
            RETURNING id, password`,
        [nombre, user_name, passwordHash],
        (err, results) => {
            if (err) {
            throw err;
            }
            console.log(results.rows);
            res.send(results.rows)
        }
        );

};

//MOSTRAR TODAS LAS SERIES
const getSeries = (req, res) =>{
    const resRequest = request('https://api.tvmaze.com/shows', (error, response, body) =>{
        
        if(error) console.log('Error:', error);
        else{
            const users = JSON.parse(body);
            res.send(users);
        }

    });
};

//MOSTRAR UNA SOLA SERIE
const getSeriesUnique = (req, res) =>{

    const id = req.params.idSerie;

    const resRequest = request('https://api.tvmaze.com/shows/'+id, (error, response, body) =>{
        
        if(error) console.log('Error:', error);
        else{
            const users = JSON.parse(body);
            res.send(users);
        }
    });
};

const logout = (req, res) => {
    res.send('Logout')
    req.logout();
    
}

module.exports = {
    getSeries, getSeriesUnique, CreateUser, logout
}