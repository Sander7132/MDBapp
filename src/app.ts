import express from "express";
import patientRouter from "./routes/patient.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 *
 */
app.get("/api", (req, res) => {
  // output APIdoc page
  res.end("Hello");
});

app.use("/api/patients" ,patientRouter);



export default app;