import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()

export class NonRefillable extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar"})
    reason!: string;
}


    