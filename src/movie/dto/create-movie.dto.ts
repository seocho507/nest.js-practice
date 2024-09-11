import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMovieDto {

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly genre: string;

  @IsString()
  @IsNotEmpty()
  readonly detail: string;

  @IsNotEmpty()
  @IsNumber()
  readonly directorId: number;
}
