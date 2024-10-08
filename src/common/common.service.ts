import {Injectable} from "@nestjs/common";
import {SelectQueryBuilder} from "typeorm";

@Injectable()
export class CommonService {

    constructor() {
    }

    applyPagePaginationParamsToQueryBuilder<T>(
        qb: SelectQueryBuilder<T>,
        page: number,
        take: number
    ) {
        const skip = (page - 1) * take;
        qb.skip(skip).take(take);
    }

    applyCursorPaginationParamsToQueryBuilder<T>(
        qb: SelectQueryBuilder<T>,
        order: "ASC" | "DESC",
        id: number,
        take: number
    ) {
        if (id) {
            const direction = order === "ASC" ? " > " : " < "
            qb.where(`${qb.alias}.id ${direction} :id`, {id});
        }

        qb.orderBy(`${qb.alias}.id`, order);
        qb.take(take);
    }
}