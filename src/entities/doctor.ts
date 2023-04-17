import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Office_Visit } from "./office_visit";
import { Patient } from "./patient";
import { Prescription } from "./prescription";

@Entity()

export class Doctor extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar", length: 50})
    fName!: string;

    @Column({type:"varchar", length: 50})
    lName!: string;

    @Column({type:"varchar"})
    address!: string;

    @Column({type:"varchar" })
    phoneNumber!: string;

    @Column({type: "varchar" })
    speciality!: string;

    @OneToMany ((type) => Patient, (patient) => patient.doctor )
    patients!: Patient[];

    @OneToMany ((type) => Prescription, (prescription) => prescription.doctor)
    prescription!: Prescription;

    @OneToMany ((type) => Office_Visit, (officeVisit) => officeVisit.doctor)
    officeVisit!: Office_Visit;

    

}
    