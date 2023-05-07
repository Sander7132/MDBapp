import express from 'express';
import defaultDataSource from '../datasource';
import { RoutineVisit } from '../entities/routineVisit';

const router = express.Router();

interface CreateRoutineVisitParams {
    bloodPressure: string;
    height: string;
    weight: string;
    diagnosis: string;

}

interface UpdateRoutineVisitParams {
    bloodPressure?: string;
    height?: string;
    weight?: string;
    diagnosis?: string;


}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const RoutineVisits = await defaultDataSource.getRepository(RoutineVisit).find();
  
      // vasta artiklite kogumikuga JSON formaadis
      return res.status(200).json({ data: RoutineVisits });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
      return res.status(500).json({ message: "Could not fetch RoutineVisits" });
    }
});
  
  
// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { bloodPressure, height, weight, diagnosis } = req.body as CreateRoutineVisitParams;

    // TODO: validate & santize
    if (!bloodPressure || !height || !weight || !diagnosis) {
    return res
        .status(400)
        .json({ error: "routineVisit has to have first name, last name and title" });
    }


    // create new Author with given parameters
    const routineVisit = RoutineVisit.create({
    bloodPressure: bloodPressure.trim() ?? "",
    height: height.trim() ?? "",
    weight: weight.trim() ?? "",
    diagnosis: diagnosis.trim() ?? "",
    });

    //save Author to database
    const result = await routineVisit.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch RoutineVisits" });
}
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // tavaline ORM päring koos "relation" entity sisuga
    const routineVisit = await defaultDataSource
    .getRepository(RoutineVisit)
    .findOne({ where:{id: parseInt(id)}, relations: ['articles'] });

    // Querybuildering tehtud samalaadne päring (leftjoin tüttu hetkel ainult 1)
    // const routineVisitArticles = await defaultDataSource.createQueryBuilder()
    // .select("*")
    // .from("routineVisit", "routineVisit")
    // .leftJoin("article", "articles", "articles.routineVisitId = routineVisit.id")
    // .where("routineVisit.id = :id", {id: id})
    // .getRawOne();
    
    // return res.status(200).json({ data: {
    //     id:routineVisitArticles.id,
    //     firstName:routineVisitArticles.firstName,
    //     lastName:routineVisitArticles.lastName,
    //     article: {
    //         title: routineVisitArticles.title,
    //         body: routineVisitArticles.body,
    //     }
    //  }});

    return res.status(200).json({ data: routineVisit });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch routineVisit" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { bloodPressure, height, weight, diagnosis } = req.body as UpdateRoutineVisitParams;

    const routineVisit = await defaultDataSource
    .getRepository(RoutineVisit)
    .findOneBy({ id: parseInt(id) });

    if (!routineVisit) {
    return res.status(404).json({ error: "Author not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    routineVisit.bloodPressure = bloodPressure ?? routineVisit.bloodPressure;
    routineVisit.height = height ?? routineVisit.height;
    routineVisit.weight = weight ?? routineVisit.weight;
    routineVisit.diagnosis = diagnosis ?? routineVisit.diagnosis;

    

    //salvestame muudatused andmebaasi 
    const result = await routineVisit.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update routineVisit" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const routineVisit = await defaultDataSource
        .getRepository(RoutineVisit)
        .findOneBy({ id: parseInt(id) });
    
        if (!routineVisit) {
        return res.status(404).json({ error: "RoutineVisit not found" });
        }

        const result = await routineVisit.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update RoutineVisits" });
    }
});

export default router;