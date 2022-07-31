import { injectable } from "tsyringe";
import User, { User as IUser } from "../../Schemas/User";

@injectable()
class GetAllUsersService {
    async execute(): Promise<IUser[]> {
        const users = await User.find();
        return users;
    }
}

export {
    GetAllUsersService,
}