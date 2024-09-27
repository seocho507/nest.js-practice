import {Column, Entity, OneToOne} from "typeorm";
import {Movie} from "./movie.entity";
import {BaseTable} from "../../common/base-table.entity";

@Entity("movie_details")
export class MovieDetail extends BaseTable {

    @Column()
    detail: string;

    @OneToOne(
        () => Movie,
        (movie: Movie) => movie.id)
    movie: Movie;
}