import {CursorPaginationDto} from "../../common/dto/cursor-pagination.dto";
import {IsOptional, IsString} from "class-validator";

export class CursorGetMoviesDto extends CursorPaginationDto {

    @IsString()
    @IsOptional()
    title: string;
}