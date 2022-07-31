import User, { User as IUser } from "../../Schemas/User";
import { injectable } from 'tsyringe';

export interface ICreateUserDTO {
    name: string;
    email: string;
    socket_id: string;
    avatar: string;
}

injectable()
export class CreateUserService {
    async execute({
        name,
        socket_id,
        email,
        avatar,
    }: ICreateUserDTO):Promise<IUser> {
       
        const userAlreadyExist = await this.userAlreadyExist({
            name,
            socket_id,
            email,
            avatar,
        });

        if (userAlreadyExist) { 
            return userAlreadyExist;
        } else {
            const user = await User.create({
                name,
                socket_id,
                email,
                avatar,
            });

            return user;
        }
       
    }

    async userAlreadyExist ({
        name,
        socket_id,
        email,
        avatar,
    }: ICreateUserDTO):Promise<IUser | null> {
        const userAlreadyExist = await User.findOne({
            email,
        }).exec();

        if (userAlreadyExist) { 
            const user = await User.findOneAndUpdate(
                {
                    _id: userAlreadyExist._id,
                },
                {
                    $set: { name, socket_id, avatar },
                }
            )

            return user;
        }

        return null;
    }
}