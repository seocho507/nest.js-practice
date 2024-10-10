import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateMovieDto} from "./dto/create-movie.dto";
import {UpdateMovieDto} from "./dto/update-movie.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Movie} from "./entities/movie.entity";
import {DataSource, In, Like, QueryRunner, Repository} from "typeorm";
import {getLikeStatement} from "./util/utils";
import {MovieDetail} from "./entities/movie-detail.entity";
import {Director} from "../director/entities/director.entity";
import {Genre} from "../genre/entities/genre.entity";
import {withTransaction} from "../common/util/transaction-util";
import {CommonService} from "../common/common.service";

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
        private readonly dataSource: DataSource,
        private readonly commonService: CommonService
    ) {
    }

    async create(createMovieDto: CreateMovieDto, qr: QueryRunner) {
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

        const newMovie: Movie = await qr.manager.save(Movie, {
            title: createMovieDto.title,
            detail: {
                detail: createMovieDto.detail
            },
            director: director,
            genres: genres
        });

        return newMovie;
    }

    async findAll(
        page: number,
        take: number,
        title?: string
    ) {
        const queryBuilder = this.movieRepository.createQueryBuilder("movie")
            .leftJoinAndSelect("movie.director", "director")
            .leftJoinAndSelect("movie.genres", "genres");

        if (title) {
            const likeStatement = getLikeStatement(title);
            queryBuilder.where("movie.title LIKE :title", {title: likeStatement});
        }

        if (page && take) {
            this.commonService.applyPagePaginationParamsToQueryBuilder(queryBuilder, page, take);
        }

        const [movies, total] = await queryBuilder.getManyAndCount();
        return {movies, total};
    }

    async findAllWithCursor(
        id: number,
        order: "ASC" | "DESC",
        title: string,
        take: number) {
        const queryBuilder = this.movieRepository.createQueryBuilder("movie")
            .leftJoinAndSelect("movie.director", "director")
            .leftJoinAndSelect("movie.genres", "genres");

        if (title) {
            const likeStatement = getLikeStatement(title);
            queryBuilder.andWhere("movie.title LIKE :title", {title: likeStatement});
        }

        this.commonService.applyCursorPaginationParamsToQueryBuilder(queryBuilder, order, id, take);

        return await queryBuilder.getManyAndCount();
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
            queryBuilder.where("movie.title LIKE :title", {title: `%${title}%`});
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
        return withTransaction(this.dataSource, async (qr) => {
            const movie = await this.findOne(id);
            if (!movie) {
                throw new NotFoundException("Movie not found with id: " + id);
            }

            const {detail, directorId, genreIds, ...movieInfo} = updateMovieDto;
            let directorToUpdate: Director;
            let genresToUpdate: Genre[];

            if (directorId) {
                directorToUpdate = await qr.manager.findOne(Director, {
                    where: {id: directorId}
                });
                if (!directorToUpdate) {
                    throw new NotFoundException("Director not found with id: " + directorId);
                }
            }

            if (genreIds) {
                genresToUpdate = await qr.manager.find(Genre, {
                    where: {id: In(genreIds)}
                });
                if (genresToUpdate.length !== genreIds.length) {
                    throw new NotFoundException("Some genres not found with ids: " + genreIds);
                }
            }

            const movieUpdateFields = {
                ...movieInfo,
                ...(directorToUpdate && {director: directorToUpdate})
            };

            await qr.manager.update(Movie, id, movieUpdateFields);

            if (detail) {
                await qr.manager.update(MovieDetail, movie.detail.id, {detail});
            }

            const updatedMovie = await qr.manager.findOne(Movie, {
                where: {id},
                relations: ["detail", "director", "genres"]
            });

            if (genresToUpdate) {
                updatedMovie.genres = genresToUpdate;
            }

            return qr.manager.save(Movie, updatedMovie);
        });
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
