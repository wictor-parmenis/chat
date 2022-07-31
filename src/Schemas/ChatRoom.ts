import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { User } from "./User";

export type ChatRoom = Document & { 
    id_users: User[];
    id_chat_room: string;
}

const ChatRoomSchema = new Schema({
    id_users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    id_chat_room: {
        type: String,
        default: uuid(),
    },
})

const chatRoom = mongoose.model<ChatRoom>('ChatRoom', ChatRoomSchema);

export default chatRoom;