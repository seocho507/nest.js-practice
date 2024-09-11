import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne } from "typeorm";
import { BaseTable } from "../../common/base-table.entity";
import { MovieDetail } from "./movie-detail.entity";
import { Director } from "../../director/entities/director.entity";
import { Genre } from "../../genre/entities/genre.entity";

@Entity("movies")
export class Movie extends BaseTable {

  @Column(
    {
      unique: true
    }
  )
  title: string;

  @ManyToMany(
    () => Genre,
    (genre: Genre) => genre.movies
  )
  genres: Genre[];

  @OneToOne(
    () => MovieDetail,
    (movieDetail: MovieDetail) => movieDetail.id,
    {
      cascade: true,
      nullable: false
    })
  @JoinColumn()
  detail: MovieDetail;

  @ManyToOne(
    () => Director,
    (director: Director) => director.id,
    {
      cascade: true,
      nullable: false
    }
  )
  director: Director;
}
