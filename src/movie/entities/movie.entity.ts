import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseTable } from "../../common/base-table.entity";
import { MovieDetail } from "./movie-detail.entity";

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
}
