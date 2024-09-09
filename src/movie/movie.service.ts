import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./entities/movie.entity";
import { Like, Repository } from "typeorm";
import { getLikeStatement } from "./util/utils";

@Injectable()
export class MovieService {


  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>
  ) {
  }

  async create(createMovieDto: CreateMovieDto) {
    await this.findOneByTitle(createMovieDto.title).then((movie) => {
      if (movie) {
        throw new NotFoundException("Movie already exists with title: " + createMovieDto.title);
      }
    });
    return await this.movieRepository.save(createMovieDto) as Movie;
  }

  async findAll() {
    return await this.movieRepository.find();
  }

  async findOne(id: number) {
    return this.movieRepository.findOne({
      where: {
        id
      }
    });
  }

  async findOneByTitle(title: string) {
    return this.movieRepository.findOne({
      where: {
        title: title
      }
    });
  }

  async findManyByTitle(title: string) {
    const titleLikeStatement = getLikeStatement(title);
    return this.movieRepository.find({
      where: {
        title: Like(titleLikeStatement)
      }
    });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie: Movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException("Movie not found with id: " + id);
    }
    await this.movieRepository.update(
      id,
      updateMovieDto
    );
    return await this.findOne(id);
  }

  async remove(id: number) {
    const movie: Movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException("Movie not found with id: " + id);
    }
    await this.movieRepository.delete(id);
  }
}
