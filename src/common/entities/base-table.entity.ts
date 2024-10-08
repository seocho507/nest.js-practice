import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn} from "typeorm";
import {Exclude} from "class-transformer";

export abstract class BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    @Exclude()
    createdAt: Date;

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date;

    @VersionColumn()
    @Exclude()
    version: number;
}