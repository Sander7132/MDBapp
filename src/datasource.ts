import { DataSource } from "typeorm";
import { config } from "./config";
import { Doctor } from "./entities/doctor";
import { Drug } from "./entities/drug";
import { FollowUpVisit } from "./entities/followUpVisit";
import { Hospital } from "./entities/hospital";
import { InitialVisit } from "./entities/initialVisit";
import { Insurance_Company } from "./entities/insurance_company";
import { NonRefillable } from "./entities/nonrefillable";
import { Office_Visit } from "./entities/office_visit";
import { Patient } from "./entities/patient";
import { Prescription } from "./entities/prescription";
import { Refillable } from "./entities/refillable";
import { RoutineVisit } from "./entities/routineVisit";
import { Visit } from "./entities/visit";

// andmebaasiühenduse konfguratsioon
const defaultDataSource = new DataSource({
  type: "mysql",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.db,
  entities: [Doctor, Patient, Drug, FollowUpVisit, Hospital, InitialVisit, Insurance_Company, NonRefillable, Office_Visit, Prescription, Refillable, RoutineVisit, Visit],
  synchronize: true,
});

// kontrollime üle kas andmebaasi ühendust on võimalik luua
defaultDataSource
  .initialize()
  .then(() => {
    console.log("Database initialized...");
  })
  .catch((err) => {
    console.log("Error initializing database", err);
  });

export default defaultDataSource;