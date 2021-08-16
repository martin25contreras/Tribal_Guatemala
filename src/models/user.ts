import { ObjectId } from 'mongodb';
import {Schema, model, Document} from 'mongoose';

export interface User extends Document{
  id: ObjectId;
  nombre: string;
  userName: string;
  password: string;
}

const schema = new Schema({
  id: ObjectId,
  nombre: {type: String},
  userName: {type: String, require: true, unique: true},
  password: {type: String, require: true,},
 
});
const User = model<User>('user', schema);

export default User;