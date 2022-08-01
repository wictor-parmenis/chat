import { ObjectId } from "mongoose";
import { injectable } from "tsyringe";
import ChatRoom, {ChatRoom as IChatRoom} from "../../Schemas/ChatRoom";

@injectable()
class GetChatRoomByUsersService {
    async execute(idUsers: ObjectId[]) {
        const room = await ChatRoom.findOne({
            id_users: {
                $all: idUsers
            }
        }).exec();
        return room;
    }
}

export {
    GetChatRoomByUsersService
}