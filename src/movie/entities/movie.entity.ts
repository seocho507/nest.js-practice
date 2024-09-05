import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class Movie {

  private id: number;

  @Expose()
  private title: string;

  @Expose()
  @Transform(({ value }) => value.toString().toUpperCase())
  private genre: string;

  private constructor(id: number, title: string, genre: string) {
    this.id = id;
    this.title = title;
    this.genre = genre;
  }

  public static of(id: number, title: string, genre: string): Movie {
    return new Movie(id, title, genre);
  }
}
