import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./entities/movie.entity";
import { DataSource, In, Like, Repository } from "typeorm";
import { getLikeStatement } from "./util/utils";
import { MovieDetail } from "./entities/movie-detail.entity";
import { Director } from "../director/entities/director.entity";
import { Genre } from "../genre/entities/genre.entity";

@Injectable()
export class MovieService {


  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    private readonly dataSource: DataSource
  ) {
  }

  async create(createMovieDto: CreateMovieDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const director = await qr.manager.findOne(Director, {
        where: {
          id: createMovieDto.directorId
        }
      });

      const genres = await qr.manager.find(Genre, {
        where: {
          id: In(createMovieDto.genreIds)
        }
      });

      if (genres.length !== createMovieDto.genreIds.length) {
        throw new NotFoundException("Some genres not found with ids: " + createMovieDto.genreIds);
      }

      if (!director) {
        throw new NotFoundException("Director not found with id: " + createMovieDto.directorId);
      }

      const newMovie = await qr.manager.save(Movie, {
        title: createMovieDto.title,
        detail: {
          detail: createMovieDto.detail
        },
        director: director,
        genres: genres
      }) as Movie;
      await qr.commitTransaction();
      return newMovie;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async findAll() {
    return await this.movieRepository.find();
  }

  async findOne(id: number) {
    return this.movieRepository.findOne({
      where: {
        id
      },
      relations: ["detail", "director", "genres"]
    });
  }

  async findOneByTitle(title?: string) {
    const queryBuilder = this.movieRepository.createQueryBuilder("movie")
    .leftJoinAndSelect("movie.director", "director")
    .leftJoinAndSelect("movie.genres", "genres");

    if (title) {
      queryBuilder.where("movie.title LIKE :title", { title: `%${title}%` });
    }

    return queryBuilder.getManyAndCount();
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

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const {
        detail,
        directorId,
        genreIds,
        ...movieInfo
      } = updateMovieDto;

      let directorToUpdate: Director;

      if (directorId) {
        const director = await qr.manager.findOne(Director, {
          where: {
            id: directorId
          }
        });

        if (!director) {
          throw new NotFoundException("Director not found with id: " + directorId);
        }
        directorToUpdate = director;
      }

      let genresToUpdate: Genre[];

      if (genreIds) {
        const genres = await qr.manager.find(Genre, {
          where: {
            id: In(genreIds)
          }
        });

        if (genres.length !== genreIds.length) {
          throw new NotFoundException("Some genres not found with ids: " + genreIds);
        }

        genresToUpdate = genres;
      }

      const movieUpdateFields = {
        ...movieInfo,
        ...(directorToUpdate && {
          director: directorToUpdate
        })
      };

      await qr.manager.update(Movie,
        id,
        movieUpdateFields
      );

      if (detail) {
        await qr.manager.update(MovieDetail,
          movie.detail.id,
          {
            detail: detail
          }
        );
      }

      const newMovie = await qr.manager.findOne(Movie, {
        where: {
          id
        },
        relations: ["detail", "director", "genres"]
      });

      if (genresToUpdate) {
        newMovie.genres = genresToUpdate;
      }

      const entity = await qr.manager.save(Movie, newMovie);
      await qr.commitTransaction();
      return entity;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
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
