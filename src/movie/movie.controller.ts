import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseInterceptors
} from "@nestjs/common";
import {MovieService} from "./movie.service";
import {CreateMovieDto} from "./dto/create-movie.dto";
import {UpdateMovieDto} from "./dto/update-movie.dto";
import {MovieTitleValidationPipe} from "./pipe/movie-title-validation.pipe";
import {Public} from "../auth/decorator/public.decorator";
import {RBAC} from "../auth/decorator/rbac.decorator";
import {Role} from "../user/entities/user.entity";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiTags("movies")
@UseInterceptors(ClassSerializerInterceptor)
@Controller("/api/v1/movies")
export class MovieController {
    constructor(private readonly movieService: MovieService) {
    }

    @ApiBearerAuth()
    @RBAC(Role.ADMIN)
    @Post()
    create(@Body() createMovieDto: CreateMovieDto) {
        return this.movieService.create(createMovieDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.movieService.findAll();
    }

    @Public()
    @Get(":id")
    findOne(@Param("id", new ParseIntPipe(
        {
            exceptionFactory: () => new BadRequestException("Id must be a number")
        }
    )) id: number) {
        return this.movieService.findOne(id);
    }

    @Public()
    @Get("/search")
    findManyByTitle(@Query("title", MovieTitleValidationPipe) title: string) {
        return this.movieService.findManyByTitle(title);
    }

    @ApiBearerAuth()
    @RBAC(Role.ADMIN)
    @Patch(":id")
    update(@Param("id", ParseIntPipe) id: number,
           @Body() updateMovieDto: UpdateMovieDto) {
        return this.movieService.update(id, updateMovieDto);
    }

    @ApiBearerAuth()
    @RBAC(Role.ADMIN)
    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.movieService.remove(id);
    }
}
