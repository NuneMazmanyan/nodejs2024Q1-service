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
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdatePasswordDto} from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) {
    }

    @Get()
    getUsers() {
        return this.UserService.getUsers().then();
    }

    @Post()
    @HttpCode(201)
    create(@Body() userDto: CreateUserDto) {
        return this.UserService.createUser(userDto);
    }

    @Get(':id')
    getUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.UserService.getUserById(id);
    }

    @Put(':id')
    @HttpCode(200)
    updateUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdatePasswordDto,
    ) {
        return this.UserService.updatePassword(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.UserService.deleteUser(id);
    }
}
