import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from "fs";
let swaggerDocument = ["./swagger.json"];

import * as PrincipalController from "../controller/PrincipalController";


const createRoutesV1 = (app: Application): void => {
//Productos
  app.post('/api/series/create', PrincipalController.Register);
  app.post('/api/series/login', PrincipalController.Login);
  app.post('/api/series/logout', PrincipalController.Logout);
  app.get('/api/series/users', PrincipalController.getUsers);
  app.get('/api/series/listen', PrincipalController.getSeries);
  app.get('/api/series/:idSerie', PrincipalController.getSeriesById);
  app.post('/api/series/commet', PrincipalController.CreateComment);
  app.get('/api/series/commet/listen/:idSerie', PrincipalController.getComentarios);
  app.get(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
};

export default createRoutesV1;