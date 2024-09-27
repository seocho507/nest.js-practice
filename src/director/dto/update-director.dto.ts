import {PartialType} from "@nestjs/mapped-types";
import {CreateDirectorDto} from "./create-director.dto";
import {IsDateString, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateDirectorDto extends PartialType(CreateDirectorDto) {
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsOptional()
    @IsDateString()
    dateOfBirth?: Date;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    nationality?: string;
}
