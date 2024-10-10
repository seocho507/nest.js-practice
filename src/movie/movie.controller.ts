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
    Request,
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
import {GetMoviesDto} from "./dto/get-movies.dto";
import {CursorGetMoviesDto} from "./dto/cursor-get-movies.dto";
import {TransactionInterceptor} from "../common/interceptor/transaction.interceptor";

@ApiTags("movies")
@UseInterceptors(ClassSerializerInterceptor)
@Controller("/api/v1/movies")
export class MovieController {
    constructor(private readonly movieService: MovieService) {
    }

    @ApiBearerAuth()
    @UseInterceptors(TransactionInterceptor)
    @RBAC(Role.ADMIN)
    @Post()
    create(
        @Body() createMovieDto: CreateMovieDto,
        @Request() request
    ) {
        return this.movieService.create(
            createMovieDto,
            request.queryRunner
        );
    }

    @Public()
    @Get()
    findAll(
        @Body() getMoviesDto: GetMoviesDto
    ) {
        return this.movieService.findAll(
            getMoviesDto.page,
            getMoviesDto.take,
            getMoviesDto.title,
        );
    }

    @Public()
    @Get("/cursor")
    findAllWithCursor(
        @Body() getMoviesDto: CursorGetMoviesDto
    ) {
        return this.movieService.findAllWithCursor(
            getMoviesDto.id,
            getMoviesDto.order,
            getMoviesDto.title,
            getMoviesDto.take
        );
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
