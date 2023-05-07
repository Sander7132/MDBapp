import express from 'express';
import defaultDataSource from '../datasource';
import { Visit } from '../entities/visit';

const router = express.Router();

interface CreateVisitParams {
    date: string;
    symptoms: string;
    diagnosis: string;
}

interface UpdateVisitParams {
    date?: string;
    symptoms?: string;
    diagnosis?: string;


}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const Visits = await defaultDataSource.getRepository(Visit).find();
  
      // vasta artiklite kogumikuga JSON formaadis
      return res.status(200).json({ data: Visits });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
      return res.status(500).json({ message: "Could not fetch Visits" });
    }
});
  
  
// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { date, symptoms, diagnosis } = req.body as CreateVisitParams;

    // TODO: validate & santize
    if (!date || !symptoms || !diagnosis) {
    return res
        .status(400)
        .json({ error: "visit has to have first name, last name and title" });
    }


    // create new Author with given parameters
    const visit = Visit.create({
    date: date.trim() ?? "",
    symptoms: symptoms.trim() ?? "",
    diagnosis: diagnosis.trim() ?? "",
    });

    //save Author to database
    const result = await visit.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch Visits" });
}
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // tavaline ORM päring koos "relation" entity sisuga
    const visit = await defaultDataSource
    .getRepository(Visit)
    .findOne({ where:{id: parseInt(id)}, relations: ['articles'] });

    // Querybuildering tehtud samalaadne päring (leftjoin tüttu hetkel ainult 1)
    // const visitArticles = await defaultDataSource.createQueryBuilder()
    // .select("*")
    // .from("visit", "visit")
    // .leftJoin("article", "articles", "articles.visitId = visit.id")
    // .where("visit.id = :id", {id: id})
    // .getRawOne();
    
    // return res.status(200).json({ data: {
    //     id:visitArticles.id,
    //     firstName:visitArticles.firstName,
    //     lastName:visitArticles.lastName,
    //     article: {
    //         title: visitArticles.title,
    //         body: visitArticles.body,
    //     }
    //  }});

    return res.status(200).json({ data: visit });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch visit" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { date, symptoms, diagnosis } = req.body as UpdateVisitParams;

    const visit = await defaultDataSource
    .getRepository(Visit)
    .findOneBy({ id: parseInt(id) });

    if (!visit) {
    return res.status(404).json({ error: "Author not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    visit.date = date ?? visit.date;
    visit.symptoms = symptoms ?? visit.symptoms;
    visit.diagnosis = diagnosis ?? visit.diagnosis;
    

    //salvestame muudatused andmebaasi 
    const result = await visit.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update visit" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const visit = await defaultDataSource
        .getRepository(Visit)
        .findOneBy({ id: parseInt(id) });
    
        if (!visit) {
        return res.status(404).json({ error: "Visit not found" });
        }

        const result = await visit.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update Visits" });
    }
});

export default router;