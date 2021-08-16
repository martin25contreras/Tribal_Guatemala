import { Schema, model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

interface Comment extends Document{
    id: ObjectId;
    id_serie: string;
    comentario: string;
    data_serie: Array<any>;
}

const schema = new Schema({
    id: ObjectId,
    id_serie: {type: String, require: true,},
    comentario: {type: String, require: true},
    data_serie: {type: Array},
});

const Comment = model<Comment>('comment', schema);

export default Comment;