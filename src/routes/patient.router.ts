import express from 'express'; 
import { Patient } from '../entities/patient';
import defaultDataSource from '../datasource';


const router = express.Router();

interface CreatePatientParams {
    id: number;
    fName: string;
    lName: string;
    address:string;
    email: string;
    phoneNumber: string;

}

interface UpdatePatientParams {
    id?: number;
    fName?: string;
    lName?: string;
    address?:string;
    email?: string;
    phoneNumber?: string;
}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const patients = await defaultDataSource.getRepository(Patient).find();
  
      // vasta artiklite kogumikuga JSON formaadis
      return res.status(200).json({ data: patients });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
      return res.status(500).json({ message: "Could not fetch patients" });
    }
});
  
  
// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { fName, lName, address, email, phoneNumber } = req.body as CreatePatientParams;

    // TODO: validate & santize
    if (!fName || !lName || !address || !email || !phoneNumber) {
    return res
        .status(400)
        .json({ error: "Articles has to have title and body" });
    }


    // create new article with given parameters
    const patient = Patient.create({
    fName: fName.trim() ?? "",
    lName: lName.trim() ?? "",
    address: address.trim() ?? "",
    email: email.trim() ?? "",
    phoneNumber: phoneNumber.trim() ?? ""

    // author: author,
    });

    //save article to database
    const result = await patient.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch articles" });
}
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    const patient = await defaultDataSource
    .getRepository(Patient)
    .findOneBy({ id: parseInt(id) });

    return res.status(200).json({ data: patient });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch articles" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { fName, lName, address, email, phoneNumber } = req.body as UpdatePatientParams;

    const patient = await defaultDataSource
    .getRepository(Patient)
    .findOneBy({ id: parseInt(id) });

    if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
    }


    // uuendame andmed objektis (lokaalne muudatus)
    patient.fName = fName ? fName : patient.fName
    patient.lName = lName ? lName : patient.lName
    patient.address = address ? address : patient.address
    patient.email = email ? email : patient.email
    patient.phoneNumber = phoneNumber ? phoneNumber : patient.phoneNumber

    //salvestame muudatused andmebaasi 
    const result = await patient.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update articles" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const article = await defaultDataSource
        .getRepository(Patient)
        .findOneBy({ id: parseInt(id) });
    
        if (!article) {
        return res.status(404).json({ error: "Article not found" });
        }

        const result = await article.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update articles" });
    }
});

export default router;