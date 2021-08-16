import {Request, Response} from 'express';
import User from "../models/user";
import Comment from "../models/coment";
import request from "request";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
let token: string= '';


// REGISTRO DE PRODUCTOS
export const Register = async (req: Request, res: Response) : Promise <void> =>{
    const {nombre, user_name, password} = req.body;
    
    if(token == ''){
        if( user_name == '' && password == '')
            res.send({message: "datos vacios"});
        else if( user_name == '')
            res.send({message: "Nombre de usuario Vacio"});
        else if( password == '')
            res.send({message: "Password vacio"});

        let usuario = new User({
            nombre,
            userName: user_name,
            password: bcrypt.hashSync(password, 10),
        });
        usuario.save((err, usuarioDB) => {
            if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
            }
            res.json({
                ok: true,
                usuario: usuarioDB
                });
            })
    }else{
        res.send('Ya tiene una cuenta activa')
    }
};

export const getSeries = async (req: Request, res: Response) : Promise <void> =>{

    if(token){
        const resRequest = request('https://api.tvmaze.com/shows', (error: any, response: any, body: string) =>{
            
            if(error) console.log('Error:', error);
            else{
                const users = JSON.parse(body);
                res.send(users);
            }

        });
    }else{
        res.send('No se ha logeado')
    }
};

export const getSeriesById = async (req: Request, res: Response) : Promise <void> =>{
    const id = req.params.idSerie;

    if(token){
        const resRequest = request('https://api.tvmaze.com/shows/'+id, (error: any, response: any, body: string) =>{
            
            if(error) console.log('Error:', error);
            else{
                const users = JSON.parse(body);
                res.send(users);
            }
        });
    }else{
        res.send('No se ha logeado')
    }
};

//VARIACION DE PRODUCTOS
export const CreateComment = async (req: Request, res: Response) : Promise <void> =>{
    const {id_serie, comentario} = req.body;
    if(token){
        const resRequest = request('https://api.tvmaze.com/shows/'+id_serie, async (error: any, response: any, body: string) =>{
            
            if(error) console.log('Error:', error);
            else{
                const users = JSON.parse(body);
                console.log(users)
                if(users['id'].length > 0){
                    const comment = await Comment.create({id_serie, comentario, usuario: users});
                    res.send(comment);
                }
            }
        });

        const comment = await Comment.create({id_serie, comentario});

        res.send(comment);
    }else{
        res.send('No se ha logeado')
    }
};

export const getComentarios = async (req: Request, res: Response) : Promise <void> =>{

    let data= {};

    if(token){
        const comment = await Comment.find({id_serie: req.params.idSerie});

        const resRequest = request('https://api.tvmaze.com/shows/'+comment[0]['id_serie'], (error: any, response: any, body: string) =>{
            
            if(error) console.log('Error:', error);
            else{
                const users = JSON.parse(body);
                data = {
                    comentario: comment[0]['id_serie'],
                    serie_id: users.id,
                    name_serie: users.name,
                    type: users.type,
                    genres: users.genres,
                    url: users.url,
                    summary: users.summary,
                }
                console.log(data)
            }
        });
        
        res.json({data: comment});
    }else{
        res.send('No se ha logeado')
    }
};

export const Login = async (req: Request, res: Response) : Promise <void> =>{
    let body = req.body;

    User.findOne({ userName: body.userName }, (erro: any, UserDB: { password: string; })=>{
        if (erro) {
          return res.status(500).json({
             ok: false,
             err: erro
          })
       }
   // Verifica que exista un User con el mail escrita por el User.
      if (!UserDB) {
         return res.status(400).json({
           ok: false,
           err: {
               message: "User o contraseña incorrectos"
           }
        })
      }
   // Valida que la contraseña escrita por el User, sea la almacenada en la db
      if (! bcrypt.compareSync(body.password, UserDB.password)){
         return res.status(400).json({
            ok: false,
            err: {
              message: "User o contraseña incorrectos"
            }
         });
      }
   // Genera el token de autenticación
        token = jwt.sign({
              User: UserDB,
           }, process.env.SEED_AUTENTICACION, {
           expiresIn: process.env.CADUCIDAD_TOKEN
       })
       res.json({
           ok: true,
           User: UserDB,
           token,
       })
   })
    
};

export const getUsers = async (req: Request, res: Response) : Promise <void> =>{
    const price = await User.find();
    res.send(price);
}