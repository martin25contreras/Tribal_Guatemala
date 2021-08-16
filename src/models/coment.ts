import { Schema, model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

interface Comment extends Document{
    id: ObjectId;
    id_serie: string;
    comentario: string;
}

const schema = new Schema({
    id: ObjectId,
    id_serie: {type: String, require: true,},
    comentario: {type: String, require: true, unique: true},   
});

const Comment = model<Comment>('comment', schema);

export default Comment;