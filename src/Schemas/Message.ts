import mongoose, { Document, Schema } from "mongoose";

export type Message = Document & { 
    to: string;
    text: String;
    created_at: Date,
    room_id: String,
}

const MessageSchema = new Schema({
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    text: String,
    created_at: {
        type: Date,
        default: Date.now(),
    },
    room_id: {
        type: String,
        ref: 'ChatRoom'
    },
})

const message = mongoose.model<Message>('Message', MessageSchema);

export default message;