import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Prescription } from "./prescription";

@Entity()

export class NonRefillable extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar"})
    reason!: string;

    @OneToMany(() => Prescription, (prescription) => prescription.nonRefillable)
    prescription!: Prescription;
}


    