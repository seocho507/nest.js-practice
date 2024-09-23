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
import { DirectorService } from "./director.service";
import { CreateDirectorDto } from "./dto/create-director.dto";
import { UpdateDirectorDto } from "./dto/update-director.dto";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("/api/v1/directors")
export class DirectorController {
  constructor(private readonly directorService: DirectorService) {
  }

  @Post()
  create(@Body() createDirectorDto: CreateDirectorDto) {
    return this.directorService.create(createDirectorDto);
  }

  @Get()
  findAll() {
    return this.directorService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.directorService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateDirectorDto: UpdateDirectorDto) {
    return this.directorService.update(+id, updateDirectorDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.directorService.remove(+id);
  }
}
