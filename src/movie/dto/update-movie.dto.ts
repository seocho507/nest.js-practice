import { PartialType } from "@nestjs/mapped-types";
import { CreateMovieDto } from "./create-movie.dto";
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";

export class UpdateMovieDto extends PartialType(CreateMovieDto) {

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsOptional()
  readonly genreIds?: number[];

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly detail?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  readonly directorId?: number;

}
