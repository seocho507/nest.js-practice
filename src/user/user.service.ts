import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
    }

    async create(createUserDto: CreateUserDto) {
        return await this.userRepository.save(createUserDto);
    }

    async findAll() {
        return this.userRepository.find();
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id
            }
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.findOne(id);
        await this.userRepository.update(id, updateUserDto);
        return user;
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.userRepository.delete(id);
    }
}
