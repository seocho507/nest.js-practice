import { Column, Entity } from "typeorm";
import { DefaultEntity } from "../../common/default.entity";

@Entity("movies")
export class Movie extends DefaultEntity {

  @Column()
  title: string;

  @Column()
  genre: string;
}
