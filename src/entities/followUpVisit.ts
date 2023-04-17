import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne} from "typeorm";
import { Office_Visit } from "./office_visit";

@Entity()

export class FollowUpVisit extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar"})
    diagnosisStatus!: string;

    @OneToOne ((type) => Office_Visit, (officeVisit) => officeVisit.followUpVisit)
    officeVisit!: Office_Visit;
}