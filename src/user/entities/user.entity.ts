import {Column, Entity} from "typeorm";
import {BaseTable} from "../../common/base-table.entity";
import {Exclude} from "class-transformer";

export enum Role {
    ADMIN,
    PAYED_USER,
    FREE_USER
}

@Entity("users")
export class User extends BaseTable {

    @Column({
        unique: true
    })
    email: string;

    @Column()
    @Exclude({
        toClassOnly: false,
        toPlainOnly: true
    })
    password: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.FREE_USER
    })
    role: Role;
}
