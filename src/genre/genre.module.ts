import {Module} from "@nestjs/common";
import {GenreService} from "./genre.service";
import {GenreController} from "./genre.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Movie} from "../movie/entities/movie.entity";
import {Genre} from "./entities/genre.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Movie,
            Genre
        ])
    ],
    controllers: [GenreController],
    providers: [GenreService]
})
export class GenreModule {
}
