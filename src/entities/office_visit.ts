import {Entity, BaseEntity, PrimaryColumn, Column, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import { Doctor } from "./doctor";
import { FollowUpVisit } from "./followUpVisit";
import { InitialVisit } from "./initialVisit";
import { Patient } from "./patient";
import { RoutineVisit } from "./routineVisit";

@Entity()

export class Office_Visit extends BaseEntity {



    @Column({type:"varchar", length: 200})
    symptoms!: string;

    @PrimaryColumn({type:"datetime"})
    
    dateOfVisit!: Date;

    @ManyToOne ((type) => Patient, (patient) => patient.officeVisit )
    @JoinColumn({name:"patientId"})
    patient!: Patient;

    @ManyToOne ((type) => Doctor, (doctor) => doctor.officeVisit)
    @JoinColumn({name:"doctorId"})
    doctor!: Doctor;

    @OneToOne ((type) => InitialVisit, (initialVisit) => initialVisit.officeVisit, {nullable: true})
    initialVisit!: InitialVisit | null;

    @OneToOne ((type) => FollowUpVisit, (followUpVisit) => followUpVisit.officeVisit, {nullable: true})
    followUpVisit!: FollowUpVisit| null;

    @OneToOne ((type) => RoutineVisit,(routineVisit) => routineVisit.officeVisit, {nullable: true})
    routineVisit!: RoutineVisit | null;






}