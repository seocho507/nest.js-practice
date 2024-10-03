import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseInterceptors
} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User} from "./entities/user.entity";
import {DeleteResult} from "typeorm";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("/api/v1/users")
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        try {
            return await this.userService.create(createUserDto);
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    @Get()
    async findAll(): Promise<User[]> {
        try {
            return await this.userService.findAll();
        } catch (error) {
            throw new Error(`Error fetching users: ${error.message}`);
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        try {
            return await this.userService.findOne(id);
        } catch (error) {
            throw new Error(`Error fetching user with ID ${id}: ${error.message}`);
        }
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        try {
            return await this.userService.update(id, updateUserDto);
        } catch (error) {
            throw new Error(`Error updating user with ID ${id}: ${error.message}`);
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        try {
            return await this.userService.remove(id);
        } catch (error) {
            throw new Error(`Error removing user with ID ${id}: ${error.message}`);
        }
    }
}
