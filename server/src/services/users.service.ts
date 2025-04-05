import { User } from "../db/entity/User";
import dataSource from "../db/data-source";

interface IUser {
    firstName: string;
    lastName: string;
    username: string;
    cognitoId: string;
}

export class UserService {
    constructor(
        private readonly userRepository = dataSource.getRepository(User)
    ) {}

    async create(user: IUser) {
        const userObj = new User();
        userObj.firstName = user.firstName;
        userObj.lastName = user.lastName;
        userObj.username = user.username;
        userObj.cognitoId = user.cognitoId;
        return await this.userRepository.save(userObj);
    }

    async getAll() {
        return await this.userRepository.find();
    }
}

export default UserService;
