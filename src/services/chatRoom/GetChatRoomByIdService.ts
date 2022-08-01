import { injectable } from "tsyringe";
import ChatRoom, {ChatRoom as IChatRoom} from "../../Schemas/ChatRoom";

injectable();
class GetChatRoomByIdService {
    async execute(id_chat_room:string ):Promise<IChatRoom>  {
        const room = await ChatRoom.findOne({
            id_chat_room
        })
        .populate('id_users')
        .exec();
        
        return room;
    }
}

export { GetChatRoomByIdService };