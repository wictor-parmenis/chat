import mongoose, { Document, Schema } from "mongoose";

export type User  = Document & {
    name: string;
    socket_id: string;
    email: string;
    avatar: string;
}

const UserSchema = new Schema({
    name: String,
    socket_id: String,
    email: String,
    avatar: String
})


const User = mongoose.model<User>('User', UserSchema)

export default User;