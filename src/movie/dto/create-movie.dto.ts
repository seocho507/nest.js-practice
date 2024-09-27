import {ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateMovieDto {

    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly detail: string;

    @IsNotEmpty()
    @IsNumber()
    readonly directorId: number;

    @ArrayNotEmpty()
    @IsArray()
    @IsNumber({}, {each: true})
    readonly genreIds: number[];
}
