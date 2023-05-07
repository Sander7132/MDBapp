import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { Doctor } from "./doctor";
import { Office_Visit } from "./office_visit";
import { Prescription } from "./prescription";
import { Insurance_Company } from "./insurance_company";

@Entity()

export class Patient extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar", length: 50})
    fName!: string;

    @Column({type:"varchar", length: 50})
    lName!: string;

    @Column({type:"varchar"})
    address!: string;

    @Column({type:"varchar", length: 300})
    email!: string;

    @Column({type:"varchar" })
    phoneNumber!: string;

    @ManyToOne ((type) => Doctor, (doctor) => doctor.patients, {eager: true})
    doctor!: Doctor;

    @OneToMany ((type) => Prescription, (prescription) => prescription.patient)
    prescription!: Prescription;

    @OneToMany ((type) => Office_Visit, (officeVisit) => officeVisit.patient)
    officeVisit!: Office_Visit;

    @ManyToOne ((type) => Insurance_Company, (insuranceCompany) => insuranceCompany.patient, {eager: true})
    insuranceCompany!: Insurance_Company;
    
}