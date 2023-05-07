import express from 'express';
import defaultDataSource from '../datasource';
import { InitialVisit } from '../entities/initialVisit';

const router = express.Router();

interface CreateInitialVisitParams {
    initalDiagnosis: string;
}

interface UpdateInitialVisitParams {
    initalDiagnosis?: string;


}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const Drugs = await defaultDataSource.getRepository(InitialVisit).find();
  
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
    const { initalDiagnosis } = req.body as CreateInitialVisitParams;

    // TODO: validate & santize
    if (!initalDiagnosis) {
    return res
        .status(400)
        .json({ error: "initalVisit has to have first name, last name and title" });
    }


    // create new Author with given parameters
    const initialVisit = InitialVisit.create({
    initialDiagnosis: initalDiagnosis.trim() ?? "",
    });

    //save Author to database
    const result = await initialVisit.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch Drugs" });
}
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // tavaline ORM päring koos "relation" entity sisuga
    const initialVisit = await defaultDataSource
    .getRepository(InitialVisit)
    .findOne({ where:{id: parseInt(id)}, relations: ['articles'] });

    // Querybuildering tehtud samalaadne päring (leftjoin tüttu hetkel ainult 1)
    // const drugArticles = await defaultDataSource.createQueryBuilder()
    // .select("*")
    // .from("initialVisit", "initialVisit")
    // .leftJoin("article", "articles", "articles.drugId = initialVisit.id")
    // .where("initialVisit.id = :id", {id: id})
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

    return res.status(200).json({ data: initialVisit });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch initalVisit" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { initalDiagnosis } = req.body as UpdateInitialVisitParams;

    const initialVisit = await defaultDataSource
    .getRepository(InitialVisit)
    .findOneBy({ id: parseInt(id) });

    if (!initialVisit) {
    return res.status(404).json({ error: "Author not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    initialVisit.initialDiagnosis = initalDiagnosis ?? initialVisit.initialDiagnosis;

    

    //salvestame muudatused andmebaasi 
    const result = await initialVisit.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update initalVisit" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const initialVisit = await defaultDataSource
        .getRepository(InitialVisit)
        .findOneBy({ id: parseInt(id) });
    
        if (!initialVisit) {
        return res.status(404).json({ error: "InitialVisit not found" });
        }

        const result = await initialVisit.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update InitialVisit" });
    }
});

export default router;