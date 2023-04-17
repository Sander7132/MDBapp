import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()

export class Visit extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"datetime"})
    date!: string;

    @Column({type:"varchar"})
    symptoms!: string;

    @Column({type:"varchar"})
    diagnosis!: string;

}