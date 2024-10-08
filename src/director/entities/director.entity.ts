import {Column, Entity, OneToMany} from "typeorm";
import {BaseTable} from "../../common/entities/base-table.entity";
import {Movie} from "../../movie/entities/movie.entity";

@Entity("directors")
export class Director extends BaseTable {

    @Column()
    name: string;

    @Column()
    dateOfBirth: Date;

    @Column()
    nationality: string;

    @OneToMany(
        () => Movie,
        (movie: Movie) => movie.director
    )
    movies: Movie[];
}
