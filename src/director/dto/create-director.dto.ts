import {IsDateString, IsNotEmpty, IsString} from "class-validator";

export class CreateDirectorDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsDateString()
    dateOfBirth: Date;

    @IsNotEmpty()
    @IsString()
    nationality: string;
}
