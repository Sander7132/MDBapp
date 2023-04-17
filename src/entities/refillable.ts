import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Prescription } from "./prescription";

@Entity()

export class Refillable extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar", length: 50})
    refills!: string;

    @OneToMany ((type) => Prescription, (prescription) => prescription.refillable)
    prescription!: Prescription;
}