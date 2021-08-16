import {Request, Response} from 'express';

import Prices from '../models/coment';
import Products from "../models/user";

export const createPrice = async (req: Request, res: Response) : Promise <void> =>{
    let activar = false;
    let totales = 0;
    const pricesArray = [];
    const cantidadArray = [];
    const productosArray = [];
    const {factura, nombre_cliente, cedula_cliente, fecha_venta, product_id, cantidad, medio_pago, tipo_pago} = req.body;
    
    const fact = await Prices.find({"factura": factura});
    
    if(fact.length > 0){ // VERIFICA SI EL CODIGO DE LA FACTURA YA ESTA REGISTRADA ANTERIORMENTE
        res.send('Esta FACTURA ya se encuentra registrado');
    }else if(fact.length == 0){
        // CUANDO LOS PRODUCTOS ESTAN DENTRO DE UN ARRAY
        if(Array.isArray(product_id)){ 
            for (let index = 0; index < product_id.length; index++) {
                // IDENTIFICA EL CODIGO DEL PRODUCTO, PARA OBTENER LA INFORMACION DEL MISMO
                const productAux = await Products.find({"codigo": product_id[index]});
                if(productAux){
                    const id= productAux;                   
                    
                    productosArray[index] =id[0]['_id'];//SE INCRUSTA EL _id DEL PRODUCTO
                    cantidadArray[index] = cantidad[index];
                    pricesArray[index] = id[0]['precio'];//SE INCRUSTA EL PRECIO DEL PRODUCTO YA ALMACENADO                        
                    totales= totales + (cantidad[index] * id[0]['precio']);

                    console.log(id[0]['cantidad'] - cantidad[index])

                    Products.findOneAndUpdate({"codigo": product_id[index]}, {
                        cantidad: id[0]['cantidad'] - cantidad[index], 
                    });
                
                }else{
                    res.send('Este producto no se encuentra registrado');
                    activar = true;
                }
            }
            if(activar == false){
                
                const price = await Prices.create({
                    factura,
                    nombre_cliente,
                    cedula_cliente,
                    fecha_venta,
                    product_id: productosArray,//SE INCRUSTA EL _id DEL PRODUCTO
                    cantidad: cantidadArray,
                    precio: pricesArray,//SE INCRUSTA EL PRECIO DEL PRODUCTO YA ALMACENADO
                    medio_pago,
                    tipo_pago,
                    total: totales,
                });
                
                res.send(price);
            }else{
                res.send('Este producto no se encuentra registrado');
            }
        }else{ // CUANDO SOLO ES UN PRODUCTO
            const productAux = await Products.find({"codigo": product_id});
            if(productAux){
                const id = productAux;
                
                const price = await Prices.create({
                    factura,
                    nombre_cliente,
                    cedula_cliente,
                    product_id: id[0]['_id'],//SE INCRUSTA EL _id DEL PRODUCTO
                    cantidad,
                    precio: id[0]['precio'],//SE INCRUSTA EL PRECIO DEL PRODUCTO YA ALMACENADO
                    medio_pago,
                    tipo_pago,
                    total: cantidad * id[0]['precio'],
                });
                res.send(price);
            }else{
                res.send('Este producto no se encuentra registrado');
            }
        }
    }
};

export const getPrice = async (req: Request, res: Response) : Promise <void> =>{
    const itemsForPage = 3;
    const page: number = parseInt(req.query.page as string);
    const start = (page * 1) * itemsForPage;
    const total: number = await Prices.count();

    const price = await Prices.find().skip(start).limit(itemsForPage);
    res.send({
        page: page,
        per_page: itemsForPage,
        total: total,
        total_pages: Math.ceil(total / itemsForPage),
        data: price
    });
};

export const getPriceDay = async (req: Request, res: Response) : Promise <void> =>{
    const pipeline = [
        {   $group: { _id: { $dateToString: {format: "%d/%m/%Y" , date: "$fecha_venta"} }, total: { $sum: "$total"} } },
    ];
    const price = await Prices.aggregate(pipeline);

    res.send(price);
};

export const getPriceProductoDay = async (req: Request, res: Response) : Promise <void> =>{

    const pipeline = [
        {   $unwind: "$cantidad"},//DIVIDIMOS LOS ARREGLOS QUE SE ENCUENTREN EN LA CLAVE cantidad
        {   $project: {
                        fecha: { $dateToString: {format: "%d/%m/%Y" , date: "$fecha_venta"} },// FORMATEAMOS LA FECHA
                        cantidades: {$toInt: "$cantidad"},// CONVERTIMOS LAS CANTIDAD EN ENTEROS
                        ventas: {$toInt: "$total"},// CONVERTIMOS LAS CANTIDAD EN ENTEROS
        }},
        
        {   $group: { _id: {fecha: "$fecha"} , cantidades: { $sum: "$cantidades"}, totales: { $sum: "$ventas"} } },
    ];
    const price = await Prices.aggregate(pipeline);

    if(price.length >0){
        res.send(price);
    }else{
        res.send('Este metodo de pago no se encuentra registrado (Efectivo o Tarjeta)');
    }  
};

export const getMethodPayment= async (req: Request, res: Response) : Promise <void> =>{
    
    const pipeline = [            
        {   $group: { _id: "$medio_pago" , cantidades: { $sum: 1}, totales: { $sum: '$total'}} },
    ];
    const price = await Prices.aggregate(pipeline);

    if(price.length >0){
        res.send(price);
    }else{
        res.send('Este metodo de pago no se encuentra registrado (Efectivo o Tarjeta)');
    }    
};

export const getTypePrice= async (req: Request, res: Response) : Promise <void> =>{
    
    const pipeline = [            
        {   $group: { _id: "$tipo_pago" , cantidades: { $sum: 1}, totales: { $sum: '$total'}} },
    ];
    const types = await Prices.aggregate(pipeline);

    if(types.length >0){
        res.send(types);
    }else{
        res.send('Este tipo de venta no se encuentra registrado, solo contamos con: (en sitio, pick up, delivery)');
    }
};