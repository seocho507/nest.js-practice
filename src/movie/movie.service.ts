import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./entities/movie.entity";
import { Like, Repository } from "typeorm";
import { getLikeStatement } from "./util/utils";
import { MovieDetail } from "./entities/movie-detail.entity";
import { Director } from "../director/entities/director.entity";

@Injectable()
export class MovieService {


  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>
  ) {
  }

  async create(createMovieDto: CreateMovieDto) {
    await this.findOneByTitle(createMovieDto.title).then((movie) => {
      if (movie) {
        throw new NotFoundException("Movie already exists with title: " + createMovieDto.title);
      }
    });

    const director = await this.directorRepository.findOne({
      where: {
        id: createMovieDto.directorId
      }
    });

    if (!director) {
      throw new NotFoundException("Director not found with id: " + createMovieDto.directorId);
    }

    // Cascade 옵션을 적용하지 않은 경우
    // const movieDetail: MovieDetail = await this.movieDetailRepository.save({
    //   detail: createMovieDto.detail
    // }) as MovieDetail;

    // Cascade 옵션을 적용한 경우
    return await this.movieRepository.save({
      title: createMovieDto.title,
      genre: createMovieDto.genre,
      detail: {
        detail: createMovieDto.detail
      },
      director: director
    }) as Movie;
  }

  async findAll() {
    return await this.movieRepository.find();
  }

  async findOne(id: number) {
    return this.movieRepository.findOne({
      where: {
        id
      },
      relations: ["detail", "director"]
    });
  }

  async findOneByTitle(title: string) {
    return this.movieRepository.findOne({
      where: {
        title: title
      },
      relations: ["detail"]
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


  // TODO : Transaction 처리
  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie: Movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException("Movie not found with id: " + id);
    }

    const { detail, directorId, ...movieInfo } = updateMovieDto;

    let directorToUpdate: Director;

    if (directorId) {
      const director = await this.directorRepository.findOne({
        where: {
          id: directorId
        }
      });

      if (!director) {
        throw new NotFoundException("Director not found with id: " + directorId);
      }
      directorToUpdate = director;
    }

    const movieUpdateFields = {
      ...movieInfo,
      ...(directorToUpdate && {
        director: directorToUpdate
      })
    };

    await this.movieRepository.update(
      id,
      movieUpdateFields
    );

    if (detail) {
      await this.movieDetailRepository.update(
        movie.detail.id,
        {
          detail: detail
        }
      );
    }

    return await this.findOne(id);
  }

  async remove(id: number) {
    const movie: Movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException("Movie not found with id: " + id);
    }

    await this.movieDetailRepository.delete(movie.detail.id);
    await this.movieRepository.delete(id);
  }
}
