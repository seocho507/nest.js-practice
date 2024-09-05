import { IsNotEmpty, IsString } from "class-validator";

export class CreateMovieDto {

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly genre: string;
}
