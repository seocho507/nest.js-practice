import { PartialType } from "@nestjs/mapped-types";
import { CreateDirectorDto } from "./create-director.dto";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateDirectorDto extends PartialType(CreateDirectorDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth: Date;

  @IsOptional()
  @IsString()
  nationality: string;
}
