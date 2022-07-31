import { container } from "tsyringe";
import { io } from "../http";
import { CreateUserService } from '../services/user/CreateUserService'
import { GetAllUsersService } from "../services/user/GetAllUsersService";
import { CreateChatRoomService } from "../services/chatRoom/CreateChatRoomService";
import { GetUserBySocketIdService } from "../services/user/GetUserBySocketIdService";

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
        const userLogged = await getUserBySocketIdService.execute(socket.id);
        const chatRoom = await createChatRoomService.execute([userLogged._id, data.idUser]);

        console.log(chatRoom , 'chatRoom');
        callback({chatRoom});
    } )
})