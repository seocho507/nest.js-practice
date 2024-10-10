import {Module} from "@nestjs/common";
import {MovieService} from "./movie.service";
import {MovieController} from "./movie.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Movie} from "./entities/movie.entity";
import {MovieDetail} from "./entities/movie-detail.entity";
import {Director} from "../director/entities/director.entity";
import {Genre} from "../genre/entities/genre.entity";
import {CommonModule} from "../common/common.module";
import {MulterModule} from "@nestjs/platform-express";

@Module(
    {
        imports: [
            TypeOrmModule.forFeature([
                Movie,
                MovieDetail,
                Director,
                Genre
            ]),
            CommonModule,
            MulterModule
        ],
        controllers: [MovieController],
        providers: [MovieService]
    })
export class MovieModule {
}
