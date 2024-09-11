import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Genre } from "./entities/genre.entity";
import { Repository } from "typeorm";
import { UpdateGenreDto } from "./dto/update-genre.dto";

@Injectable()
export class GenreService {

  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>
  ) {
  }

  async create(createGenreDto: CreateGenreDto) {
    const genre = await this.findOneByName(createGenreDto.name);
    if (genre) {
      throw new NotFoundException(`Genre with name ${createGenreDto.name} already exists`);
    }

    return await this.genreRepository.save(createGenreDto);
  }

  async findAll() {
    return await this.genreRepository.find();
  }

  async findOne(id: number) {
    return await this.genreRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async findOneByName(name: string) {
    return await this.genreRepository.findOne({
      where: {
        name: name
      }
    });
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.findOne(id);
    if (!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }

    const genreUpdateFields = {
      ...updateGenreDto
    };

    await this.genreRepository.update(id, genreUpdateFields);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const genre = await this.findOne(id);
    if (!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }

    return await this.genreRepository.delete(genre);
  }
}