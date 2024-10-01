import {Module} from "@nestjs/common";

import {MovieModule} from "./movie/movie.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import * as Joi from "joi";
import {Movie} from "./movie/entities/movie.entity";
import {MovieDetail} from "./movie/entities/movie-detail.entity";
import {DirectorModule} from "./director/director.module";
import {Director} from "./director/entities/director.entity";
import {GenreModule} from "./genre/genre.module";
import {Genre} from "./genre/entities/genre.entity";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: Joi.object({
                    ENV: Joi.string().valid("dev", "prod").required(),
                    DB_TYPE: Joi.string().valid("postgres").required(),
                    DB_HOST: Joi.string().required(),
                    DB_PORT: Joi.number().required(),
                    DB_USERNAME: Joi.string().required(),
                    DB_PASSWORD: Joi.string().required(),
                    DB_DATABASE: Joi.string().required()
                })
            }
        ),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: configService.get<string>("DB_TYPE") as "postgres",
                host: configService.get<string>("DB_HOST"),
                port: configService.get<number>("DB_PORT"),
                username: configService.get<string>("DB_USERNAME"),
                password: configService.get<string>("DB_PASSWORD"),
                database: configService.get<string>("DB_DATABASE"),
                entities: [
                    Movie,
                    MovieDetail,
                    Director,
                    Genre
                ],
                synchronize: true
            }),
            inject: [ConfigService]
        }),
        MovieModule,
        DirectorModule,
        GenreModule,
        AuthModule,
        UserModule]
})
export class AppModule {
}
