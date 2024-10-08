import {Module} from "@nestjs/common";
import {CommonService} from "./common.service";
import {SelectQueryBuilder} from "typeorm";
import {PagePaginationDto} from "./dto/page-pagination.dto";

@Module(
    {
        imports: [],
        controllers: [],
        providers: [CommonService],
        exports: [CommonService],
    }
)
export class CommonModule {
}