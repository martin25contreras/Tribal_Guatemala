import { Application } from 'express';

//import pricesRouter from './prices-router';
//import productRouter from './product-router';
import * as PrincipalController from "../controller/PrincipalController";

const createRoutesV1 = (app: Application): void => {
//Productos
  app.post('/api/series/create', PrincipalController.Register);
  app.post('/api/series/login', PrincipalController.Login);
  app.get('/api/series/users', PrincipalController.getUsers);
  app.get('/api/series/listen', PrincipalController.getSeries);
  app.get('/api/series/:idSerie', PrincipalController.getSeriesById);
  app.post('/api/series/commet', PrincipalController.CreateComment);
  app.get('/api/series/commet/listen/:idSerie', PrincipalController.getComentarios);//ACTUALIZAR EL STOCK
  
};

export default createRoutesV1;