import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { omit } from 'lodash';
import {DBService} from "../db/db.service";

@Injectable()
export class UserService {
    constructor(private readonly databaseService: DBService) {}

    async getUsers() {
        const users = await this.databaseService.user.findMany();
        return users;
    }

    async createUser(userDto: CreateUserDto) {
        if (!(userDto.login && userDto.password)) {
            throw new BadRequestException('Invalid data'); // 400
        }
        const user = await this.databaseService.user.create({ data: userDto });

        const newUser = omit(user, ['password']);
        return {
            ...newUser,
            createdAt: new Date(newUser.createdAt).getTime(),
            updatedAt: new Date(newUser.updatedAt).getTime(),
        };
    }

    async getUser(id: string) {
        const user = await this.databaseService.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException('This user does not exist'); // 404
        }

        return user;
    }

    async updateUser(id: string, updateUserDto: UpdatePasswordDto) {
        if (
            !(updateUserDto.oldPassword && updateUserDto.newPassword) ||
            typeof updateUserDto.oldPassword !== 'string' ||
            typeof updateUserDto.newPassword !== 'string'
        ) {
            throw new BadRequestException('Invalid data'); // 400
        }

        const user = await this.databaseService.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException('This user does not exist'); // 404
        }

        if (updateUserDto.oldPassword !== user.password) {
            throw new ForbiddenException('Old password is wrong'); // 403
        }

        const version = user.version + 1;
        const updatedUser = await this.databaseService.user.update({
            where: { id },
            data: {
                password: updateUserDto.newPassword,
                version: version,
                updatedAt: new Date(),
            },
        });

        const newUser = omit(updatedUser, ['password']);
        return {
            ...newUser,
            createdAt: new Date(newUser.createdAt).getTime(),
            updatedAt: new Date(newUser.updatedAt).getTime(),
        };
    }

    async deleteUser(id: string) {
        const user = await this.databaseService.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException('This user does not exist'); // 404 !
        }
        await this.databaseService.user.delete({
            where: { id },
        });
    }
}