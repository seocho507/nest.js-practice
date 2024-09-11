import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateDirectorDto } from "./dto/create-director.dto";
import { UpdateDirectorDto } from "./dto/update-director.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Director } from "./entities/director.entity";
import { Repository } from "typeorm";

@Injectable()
export class DirectorService {

  constructor(
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>
  ) {
  }

  async create(createDirectorDto: CreateDirectorDto) {
    return await this.directorRepository.save(createDirectorDto);
  }

  async findAll() {
    return this.directorRepository.find();
  }

  async findOne(id: number) {
    return await this.directorRepository.findOne({
      where: {
        id
      },
      relations: ["movies"]
    });
  }

  async findOneByName(name: string) {
    return await this.directorRepository.findOne({
      where: {
        name
      }
    });
  }

  async update(id: number, updateDirectorDto: UpdateDirectorDto) {
    const director = await this.findOne(id);
    if (!director) {
      throw new NotFoundException(`Director with id ${id} not found`);
    }

    await this.directorRepository.update(id, updateDirectorDto);
    return await this.findOne(id);
  }

  remove(id: number) {
    return this.directorRepository.delete(id);
  }
}
