"use strict";

import express, { Application, Request, Response } from 'express';
import { urlencoded, json } from 'body-parser';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import path from 'path';
import dotenv from 'dotenv';

import connectToDB from './database';
import apiV1 from './route/route';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = ["./swagger.json"];


dotenv.config();

const PORT = 5000;
const app: Application = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());
app.use((req, res, next) => {

  // Dominio que tengan acceso (ej. 'http://example.com')
     res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Metodos de solicitud que deseas permitir
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
  // Encabecedados que permites (ej. 'X-Requested-With,content-type')
     res.setHeader('Access-Control-Allow-Headers', '*');
  
  next();
  });

apiV1(app);

app.use((req: Request, res: Response) => {
  res.status(404).send('NOT FOUND');
});

app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

connectToDB().then((connected: boolean) => {
  if (connected) {
    console.log('Database connect')
    app.listen(PORT, () => {
      console.log('running on ' + PORT);
    });
  } else {
    console.log('Error mongo db');
  }
});