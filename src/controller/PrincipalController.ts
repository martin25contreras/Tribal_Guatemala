import {Request, Response} from 'express';
import User from "../models/user";
import Comment from "../models/coment";
import request from "request";

// REGISTRO DE PRODUCTOS
export const createProduct = async (req: Request, res: Response) : Promise <void> =>{
    const {nombre, user_name, password} = req.body;

    if( user_name == '' && password == '')
        res.send({message: "datos vacios"});
    else if( user_name == '')
        res.send({message: "Nombre de usuario Vacio"});
    else if( password == '')
        res.send({message: "Password vacio"});

    const UserAux = await User.find({"userName": user_name});
    if (UserAux.length > 0) {
        res.send({message: "Usuario ya registrado", data: UserAux});
    } else {
        const user = await User.create({
            nombre, 
            userName: user_name, 
            password,
        });
    
        res.send(user);
    }
};

export const getSeries = async (req: Request, res: Response) : Promise <void> =>{
    const resRequest = request('https://api.tvmaze.com/shows', (error: any, response: any, body: string) =>{
        
        if(error) console.log('Error:', error);
        else{
            const users = JSON.parse(body);
            res.send(users);
        }

    });
};

export const getSeriesById = async (req: Request, res: Response) : Promise <void> =>{
    const id = req.params.idSerie;

    const resRequest = request('https://api.tvmaze.com/shows/'+id, (error: any, response: any, body: string) =>{
        
        if(error) console.log('Error:', error);
        else{
            const users = JSON.parse(body);
            res.send(users);
        }
    });
};

//VARIACION DE PRODUCTOS
export const CreateComment = async (req: Request, res: Response) : Promise <void> =>{
    const {id_serie, comentario} = req.body;

    const resRequest = request('https://api.tvmaze.com/shows/'+id_serie, async (error: any, response: any, body: string) =>{
        
        if(error) console.log('Error:', error);
        else{
            const users = JSON.parse(body);
            const comment = await Comment.create({id_serie, comentario});

            res.send({data: users, comentario: comment});
        }
    });

    const comment = await Comment.create({id_serie, comentario});

    res.send(comment);
    
};

export const updateStock = async (req: Request, res: Response) : Promise <void> =>{
    
    const {codigo, cantidad, estatus} = req.body;

    if(estatus != true || estatus != false){
        res.send({message: "Estatus tiene valores incorrectos"});
    }else if(cantidad < 0){
        res.send({message: "La cantidad no puede ser negativa"});
    }else{
        const updateProduct = await User.findOneAndUpdate({"codigo": codigo}, {
            cantidad, 
            estatus,
        });
    
        if (updateProduct) {
            res.send({data: "OK"});
        } else {
            res.status(404).send({});
        }
    }
};

export const getKeyProduct = async (req: Request, res: Response) : Promise <void> =>{
    
    const keyId = req.params.keyId;

    const nombre = await User.find({"nombre": keyId});

    if (nombre.length>0) {
        res.send(nombre);
    } else {
            const reg = new RegExp(keyId);//creo una expresion regular para buscar coincidencia del texto buscado en la descripcion
            const descripcion = await User.find ({ "descripcion": reg });

            if (descripcion.length>0){
                res.send(descripcion);
            }else{
                res.send('No se encuentra ningun Producto con esa palabra clave');
            }
        }
};

export const getClasificacionProduct= async (req: Request, res: Response) : Promise <void> =>{
    
    const categoryId = req.params.categoryId;
    
    const categories = await User.find({ "categoria":  categoryId});

    if(categories.length >0){
        res.send(categories);
    }else{
        res.send('Este tipo de venta no se encuentra registrado en nuestros productos, solo contamos con: (Lacteos, Granos, Frijoles o Carnes)');
    }
};