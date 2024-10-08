import {IsIn, IsInt, IsOptional} from "class-validator";

export class CursorPaginationDto {

    // TODO : implement cursor pagination with flexible cursor field

    @IsInt()
    @IsOptional()
    id?: number;

    @IsIn(["ASC", "DESC"])
    @IsOptional()
    order: "ASC" | "DESC" = "DESC";

    @IsInt()
    @IsOptional()
    take: number = 20;
}