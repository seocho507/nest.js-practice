import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseTable } from "../../common/base-table.entity";
import { MovieDetail } from "./movie-detail.entity";
import { Director } from "../../director/entities/director.entity";

@Entity("movies")
export class Movie extends BaseTable {

  @Column()
  title: string;

  @Column()
  genre: string;

  @OneToOne(
    () => MovieDetail,
    (movieDetail: MovieDetail) => movieDetail.id,
    {
      cascade: true
    })
  @JoinColumn()
  detail: MovieDetail;

  @ManyToOne(
    () => Director,
    (director: Director) => director.id
  )
  director: Director;
}
