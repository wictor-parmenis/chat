import { injectable } from "tsyringe";
import ChatRoom, {ChatRoom as IChatRoom} from "../../Schemas/ChatRoom";

injectable();
class CreateChatRoomService {
    async execute(idUsers: string[]) {
        const room = await ChatRoom.create({id_users: idUsers});
        return room;
    }
}

export { CreateChatRoomService };