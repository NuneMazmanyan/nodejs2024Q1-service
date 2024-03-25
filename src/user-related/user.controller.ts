import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly UserServ: UserService) {}

    @Get()
    getUsers() {
        return this.UserServ.getUsers();
    }

    @Post()
    @HttpCode(201)
    create(@Body() userDto: CreateUserDto) {
        return this.UserServ.createUser(userDto);
    }

    @Get(':id')
    getUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.UserServ.getUser(id);
    }

    @Put(':id')
    @HttpCode(200)
    updateUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdatePasswordDto,
    ) {
        return this.UserServ.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.UserServ.deleteUser(id);
    }
}