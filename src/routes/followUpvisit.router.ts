import express from 'express';
import defaultDataSource from '../datasource';
import { FollowUpVisit } from '../entities/followUpVisit';

const router = express.Router();

interface CreateFollowUpVisitParams {
    diagnosisStatus: string;

}

interface UpdateFollowUpVisitParams {
    diagnosisStatus?: string;


}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const FollowUpVisits = await defaultDataSource.getRepository(FollowUpVisit).find();
  
      // vasta artiklite kogumikuga JSON formaadis
      return res.status(200).json({ data: FollowUpVisits });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
      return res.status(500).json({ message: "Could not fetch FollowUpVisit" });
    }
});
  
  
// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { diagnosisStatus } = req.body as CreateFollowUpVisitParams;

    // TODO: validate & santize
    if (!diagnosisStatus) {
    return res
        .status(400)
        .json({ error: "followUpVisits has to have first name, last name and title" });
    }


    // create new Author with given parameters
    const followUpVisit = FollowUpVisit.create({
    diagnosisStatus: diagnosisStatus.trim() ?? "", 
    });

    //save Author to database
    const result = await followUpVisit.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch FollowUpVisits" });
}
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // tavaline ORM päring koos "relation" entity sisuga
    const followUpVisit = await defaultDataSource
    .getRepository(FollowUpVisit)
    .findOne({ where:{id: parseInt(id)}, relations: ['articles'] });

    // Querybuildering tehtud samalaadne päring (leftjoin tüttu hetkel ainult 1)
    // const followUpVisitArticles = await defaultDataSource.createQueryBuilder()
    // .select("*")
    // .from("followUpVisit", "followUpVisit")
    // .leftJoin("article", "articles", "articles.followUpVisitId = followUpVisit.id")
    // .where("followUpVisit.id = :id", {id: id})
    // .getRawOne();
    
    // return res.status(200).json({ data: {
    //     id:followUpVisitArticles.id,
    //     firstName:followUpVisitArticles.firstName,
    //     lastName:followUpVisitArticles.lastName,
    //     article: {
    //         title: followUpVisitArticles.title,
    //         body: followUpVisitArticles.body,
    //     }
    //  }});

    return res.status(200).json({ data: followUpVisit });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch followUpVisits" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { diagnosisStatus } = req.body as UpdateFollowUpVisitParams;

    const followUpVisit = await defaultDataSource
    .getRepository(FollowUpVisit)
    .findOneBy({ id: parseInt(id) });

    if (!followUpVisit) {
    return res.status(404).json({ error: "Author not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    followUpVisit.diagnosisStatus = diagnosisStatus ?? followUpVisit.diagnosisStatus;
    

    //salvestame muudatused andmebaasi 
    const result = await followUpVisit.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update FollowUpVisit" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const followUpVisit = await defaultDataSource
        .getRepository(FollowUpVisit)
        .findOneBy({ id: parseInt(id) });
    
        if (!followUpVisit) {
        return res.status(404).json({ error: "FollowUpVisit not found" });
        }

        const result = await followUpVisit.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update FollowUpVisits" });
    }
});

export default router;