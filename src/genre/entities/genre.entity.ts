import { BaseTable } from "../../common/base-table.entity";
import { Column, Entity, ManyToMany } from "typeorm";
import { Movie } from "../../movie/entities/movie.entity";

@Entity("genres")
export class Genre extends BaseTable {

  @Column({
    unique: true
  })
  name: string;

  @ManyToMany(
    () => Movie,
    (movie: Movie) => movie.genres
  )
  movies: Movie[];
}
