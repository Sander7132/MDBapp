import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Prescription } from "./prescription";

@Entity()

export class Drug extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar"})
    drugName!: string;

    @Column({type:"varchar"})
    sideEffects!: string;

    @Column({type:"varchar"})
    benefits!: string;

    @OneToMany ((type) => Prescription, (prescription) => prescription.drug )
    prescriptions!: Prescription[];
}