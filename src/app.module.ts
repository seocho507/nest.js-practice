import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";

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
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {User} from "./user/entities/user.entity";
import {EnvironmentConstant} from "./common/constants/constant-env";
import {BearerTokenMiddleware} from "./auth/middleware/bearer-token.middleware";

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
                    DB_DATABASE: Joi.string().required(),
                    HASH_ROUNDS: Joi.number().required(),
                    ACCESS_TOKEN_SECRET: Joi.string().required(),
                    ACCESS_TOKEN_EXPIRES: Joi.string().required(),
                    REFRESH_TOKEN_SECRET: Joi.string().required(),
                    REFRESH_TOKEN_EXPIRES: Joi.string().required()
                })
            }
        ),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: configService.get<string>(EnvironmentConstant.DB_TYPE) as "postgres",
                host: configService.get<string>(EnvironmentConstant.DB_HOST),
                port: configService.get<number>(EnvironmentConstant.DB_PORT),
                username: configService.get<string>(EnvironmentConstant.DB_USERNAME),
                password: configService.get<string>(EnvironmentConstant.DB_PASSWORD),
                database: configService.get<string>(EnvironmentConstant.DB_DATABASE),
                entities: [
                    Movie,
                    MovieDetail,
                    Director,
                    Genre,
                    User,
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
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(
            BearerTokenMiddleware
        ).exclude({
            path: "api/v1/auth/*",
            method: RequestMethod.POST
        }).forRoutes("api/v1/*")
    }
}
