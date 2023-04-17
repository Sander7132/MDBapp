import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne} from "typeorm";
import { Office_Visit } from "./office_visit";

@Entity()

export class RoutineVisit extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar"})
    bloodPressure!: string;

    @Column({type:"varchar"})
    height!: string;

    @Column({type:"varchar"})
    weight!: string;

    @Column({type:"varchar"})
    diagnosis!: string;

    @OneToOne ((type) => Office_Visit, (officeVisit) => officeVisit.routineVisit)
    officeVisit!: Office_Visit;
    
}