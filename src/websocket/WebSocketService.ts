import { container } from "tsyringe";
import { io } from "../http";
import { CreateUserService } from '../services/user/CreateUserService'
import { GetAllUsersService } from "../services/user/GetAllUsersService";
import { CreateChatRoomService } from "../services/chatRoom/CreateChatRoomService";
import { GetUserBySocketIdService } from "../services/user/GetUserBySocketIdService";
import { GetChatRoomByUsersService } from "../services/chatRoom/GetChatRoomByUsersService";
import { GetChatRoomByIdService } from "../services/chatRoom/GetChatRoomByIdService";
import { CreateMessageService } from "../services/message/CreateMessageService";
import { GetMessagesByChatRoomService } from "../services/message/GetMessagesByChatRoomService";

io.on('connect', (socket) => {
    socket.on('start', async (data) => {
        const {email, avatar, name} = data;
        const createUserService = container.resolve(CreateUserService);

        const user = await createUserService.execute({
            name,
            socket_id: socket.id,
            email,
            avatar,
        }).catch((err) => {
            console.log(err, 'error create user');
        })

        socket.broadcast.emit('new_users', user);
    });

    socket.on('get_users', async (callback) => {
        const getAllUsersService = container.resolve(GetAllUsersService);
        const users = await getAllUsersService.execute();
        callback(users);
    });

    socket.on('start_chat', async (data, callback) => {
        const createChatRoomService = container.resolve(CreateChatRoomService);
        const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
        const getChatRoomByUsersService = container.resolve(GetChatRoomByUsersService);
        const getMessagesByChatRoomService = container.resolve(GetMessagesByChatRoomService);

        const userLogged = await getUserBySocketIdService.execute(socket.id);
        let room = await getChatRoomByUsersService.execute( [userLogged._id, data.idUser] );
        if (!room) { 
            room = await createChatRoomService.execute([userLogged._id, data.idUser]);
        }

        socket.join(room.id_chat_room);

        const messages = await getMessagesByChatRoomService.execute(room.id_chat_room);

        callback({room, messages});
    })

    socket.on('message', async (data) => {
        const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
        const createMessageService = container.resolve(CreateMessageService);
        const getChatRoomByIdService = container.resolve(GetChatRoomByIdService);
        const user = await getUserBySocketIdService.execute(socket.id);

        const message = await createMessageService.execute({
            to: user._id,
            text: data.message,
            room_id: data.idChatRoom
        })

        io.to(data.idChatRoom).emit('message', {
            message,
            user,
        });

        const room = await getChatRoomByIdService.execute(data.idChatRoom);
        const users = room.id_users;

        const userFrom = users.find(response => String(response._id) !== String(user._id));

        io.to(userFrom.socket_id).emit('notification', { 
            new_message: true,
            room_id: data.idChatRoom,
            from: user,
        })
    })
})