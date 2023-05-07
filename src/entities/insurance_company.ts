import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Patient } from "./patient";

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

    @OneToMany(() => Patient, (patient) => patient.insuranceCompany)
    patient!: Patient;
    
}