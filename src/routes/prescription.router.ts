import express from 'express';
import defaultDataSource from '../datasource';
import { Prescription } from '../entities/prescription';

const router = express.Router();

interface CreatePrescriptionParams {
    datePrescribed: string;
    dosage: string;
    duration: string;
}

interface UpdatePrescriptionParams {
    datePrescribed: string;
    dosage: string;
    duration: string;
    


}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const Drugs = await defaultDataSource.getRepository(Prescription).find();
  
      // vasta artiklite kogumikuga JSON formaadis
      return res.status(200).json({ data: Drugs });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
      return res.status(500).json({ message: "Could not fetch Drugs" });
    }
});
  
  
// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { datePrescribed, dosage, duration } = req.body as CreatePrescriptionParams;

    // TODO: validate & santize
    if (!datePrescribed || !dosage || !duration) {
    return res
        .status(400)
        .json({ error: "prescription has to have first name, last name and title" });
    }


    // create new Author with given parameters
    const prescription = Prescription.create({
    datePrescribed: datePrescribed.trim() ?? "",
    dosage: dosage.trim() ?? "",
    duration: duration.trim() ?? "",
    });

    //save Author to database
    const result = await prescription.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch prescription" });
}
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // tavaline ORM päring koos "relation" entity sisuga
    const prescription = await defaultDataSource
    .getRepository(Prescription)
    .findOne({ where:{id: parseInt(id)}, relations: ['articles'] });

    // Querybuildering tehtud samalaadne päring (leftjoin tüttu hetkel ainult 1)
    // const drugArticles = await defaultDataSource.createQueryBuilder()
    // .select("*")
    // .from("prescription", "prescription")
    // .leftJoin("article", "articles", "articles.drugId = prescription.id")
    // .where("prescription.id = :id", {id: id})
    // .getRawOne();
    
    // return res.status(200).json({ data: {
    //     id:drugArticles.id,
    //     firstName:drugArticles.firstName,
    //     lastName:drugArticles.lastName,
    //     article: {
    //         title: drugArticles.title,
    //         body: drugArticles.body,
    //     }
    //  }});

    return res.status(200).json({ data: prescription });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch prescription" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { datePrescribed, dosage, duration } = req.body as UpdatePrescriptionParams;

    const prescription = await defaultDataSource
    .getRepository(Prescription)
    .findOneBy({ id: parseInt(id) });

    if (!prescription) {
    return res.status(404).json({ error: "Author not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    prescription.datePrescribed = datePrescribed.trim() ?? "";

    

    //salvestame muudatused andmebaasi 
    const result = await prescription.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update prescription" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const prescription = await defaultDataSource
        .getRepository(Prescription)
        .findOneBy({ id: parseInt(id) });
    
        if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" });
        }

        const result = await prescription.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update Prescription" });
    }
});

export default router;