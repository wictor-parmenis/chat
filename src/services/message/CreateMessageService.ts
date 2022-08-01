import { ObjectId } from "mongoose";
import { injectable } from "tsyringe";
import Message, {Message as IMessage} from "../../Schemas/Message";

interface ICreateMessageServiceDTO {
    to: ObjectId,
    text: string,
    room_id: string
}

@injectable()
class CreateMessageService {
    async execute({to, text, room_id}: ICreateMessageServiceDTO):Promise<IMessage> {
        const messageCreated = await Message.create({
            to,
            text,
            room_id
        });
        return messageCreated;
     }
}

export {
    CreateMessageService
}