import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()

export class Insurance_Company extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar", length: 50})
    name!: string;

    @Column({type:"varchar"})
    address!: string;

    @Column({type:"varchar"})
    phone!: string;
    
}