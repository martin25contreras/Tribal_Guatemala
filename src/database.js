const {Client} = require('pg');

const connectionData = {
    user: 'postgres',
    host: 'localhost',
    database: 'series',
    password: '1234',
    port: '5432'
}

const client = new Client(connectionData);

exports.module = client;