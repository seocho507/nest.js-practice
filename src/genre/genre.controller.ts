import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors
} from "@nestjs/common";
import { GenreService } from "./genre.service";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("/api/v1/genres")
export class GenreController {
  constructor(private readonly genreService: GenreService) {
  }

  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  findAll() {
    return this.genreService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.genreService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number,
         @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(+id, updateGenreDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.genreService.remove(+id);
  }
}
