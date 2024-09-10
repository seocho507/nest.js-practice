import { PartialType } from "@nestjs/mapped-types";
import { CreateMovieDto } from "./create-movie.dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateMovieDto extends PartialType(CreateMovieDto) {

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly genre?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly detail?: string;
}
