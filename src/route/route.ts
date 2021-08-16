import { Application } from 'express';

//import pricesRouter from './prices-router';
//import productRouter from './product-router';
import * as PrincipalController from "../controller/PrincipalController";

const createRoutesV1 = (app: Application): void => {
//Productos
  app.post('/api/series/create', PrincipalController.createProduct);
  app.get('/api/series/listen', PrincipalController.getSeries);
  app.get('/api/series/:idSerie', PrincipalController.getSeriesById);
  app.post('/api/series/commet', PrincipalController.CreateComment);
  app.put('/api/series/stock', PrincipalController.updateStock);//ACTUALIZAR EL STOCK
  app.get('/api/series/KeyProduct/:keyId', PrincipalController.getKeyProduct);//OBTENER PRODUCTOS CON ALGUNA PALABRA CLAVE
  app.get('/api/series/clasificacionProduct/:categoryId', PrincipalController.getClasificacionProduct);//OBTENER PRODUCTOS POR SU CLASFICACION
  
};

export default createRoutesV1;