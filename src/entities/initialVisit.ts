import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne} from "typeorm";
import { Office_Visit } from "./office_visit";

@Entity()

export class InitialVisit extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar"})
    initialDiagnosis!: string;


    @OneToOne ((type) => Office_Visit, (officeVisit) => officeVisit.initialVisit)
    officeVisit!: Office_Visit;
}