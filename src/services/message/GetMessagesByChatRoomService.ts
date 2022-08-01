import { injectable } from "tsyringe"
import Message, {Message as IMessage} from "../../Schemas/Message";

injectable()
class GetMessagesByChatRoomService {
    async execute(chatRoomId):Promise<IMessage[]> {
        const messages = await Message.find({
            room_id: chatRoomId
        })
        .populate('to')
        .exec();
        
        return messages;
    }
}

export {
    GetMessagesByChatRoomService
}