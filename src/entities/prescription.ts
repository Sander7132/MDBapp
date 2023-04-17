import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Doctor } from "./doctor";
import { Drug } from "./drug";
import { Patient } from "./patient";
import { Refillable } from "./refillable";

@Entity()

export class Prescription extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar"})
    datePrescribed!: string;

    @Column({type:"varchar"})
    dosage!: string;

    @Column({type:"varchar"})
    duration!: string;

    @ManyToOne ((type) => Drug, (drug) => drug.prescriptions)
    drug!: Drug;

    @ManyToOne ((type) => Refillable, (refillable) => refillable.prescription)
    refillable!: Refillable;

    @ManyToOne ((type) => Doctor, (doctor) => doctor.prescription)
    doctor!: Doctor;

    @ManyToOne ((type) => Patient, (patient) => patient.prescription)
    patient!: Patient;

}