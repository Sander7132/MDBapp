import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()

export class Hospital extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar", length: 50})
    name!: string;

    @Column({type:"varchar", length: 50})
    address!: string;

    @Column({type:"varchar"})
    phoneNumber!: string;

}