import {BadRequestException, ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto, UpdatePasswordDto, User} from "./user.model";
import * as fs from "fs";
import * as path from "path";
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class UserService {
    users: User[] = [];
    usersDirPath: string = path.join(__dirname, 'users.json')

    constructor() {
        this.getUsers().then((users) => {
            this.users = users || [];
        });
    }

    private async readUsers() {
        let fileContent: User[] = [];
        // await fs.readFile(this.usersDirPath, (err, data)=>{
        //     if (err) throw err;
        //     fileContent.push(...JSON.parse(data.toString()).users)
        // })
        return fileContent;
    }

    async getUsers(): Promise<User[]> {
        return await this.readUsers();
    }

    getUserById(id: string) {
        this.checkUserId(id);
    }

    createUser(userDto: CreateUserDto) {
        if (!(userDto.login && userDto.password)) {
            throw new BadRequestException('Invalid data'); // 400
        }

        const newUser = {
            id: uuidv4(),
            login: userDto.login,
            password: userDto.password,
            version: 1,
            createdAt: Number(Date.now()),
            updatedAt: Number(Date.now()),
        };
        this.users.push(newUser);
        this.writeFile(JSON.stringify({users: this.users}))
        return newUser;
    }

    updatePassword(id: string, updateUserDto: UpdatePasswordDto) {
        if (
            !(updateUserDto.oldPassword && updateUserDto.newPassword) ||
            typeof updateUserDto.oldPassword !== 'string' ||
            typeof updateUserDto.newPassword !== 'string'
        ) {
            throw new BadRequestException('Invalid data');
        }

        const oldUser = this.checkUserId(id);
        if (updateUserDto.oldPassword !== oldUser.password) {
            throw new ForbiddenException('Old password is wrong');
        }

        const version = oldUser.version + 1;
        const newUser = {
            ...oldUser,
            password: updateUserDto.newPassword,
            version: version,
            updatedAt: Number(Date.now()),
        };

        const index = this.users.findIndex((user) => user.id === id);
        this.users[index] = newUser;

        this.writeFile(JSON.stringify({users: this.users}))
        return newUser;
    }

    deleteUser(id: string): string {
        this.checkUserId(id);
        this.users = this.users.filter(user => user.id !== id)
        this.writeFile(JSON.stringify({users: this.users}))
        return 'deleted successfully';
    }

    private writeFile(content: string) {
        fs.writeFile(this.usersDirPath, content, (err) => {
            if (err) throw err;
        })
    }

    private checkUserId(id: string) {
        const user = this.users.find((user) => user.id === id);
        if (!user) {
            throw new NotFoundException('This user is not exist');
        }

        return user;
    }
}
