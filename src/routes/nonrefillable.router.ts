import express from 'express';
import defaultDataSource from '../datasource';
import { NonRefillable } from '../entities/nonrefillable';

const router = express.Router();

interface CreateNonRefillableParams {
    reason: string;
}

interface UpdateNonRefillableParams {
    reason?: string;


}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const NonRefillables = await defaultDataSource.getRepository(NonRefillable).find();
  
      // vasta artiklite kogumikuga JSON formaadis
      return res.status(200).json({ data: NonRefillables });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
      return res.status(500).json({ message: "Could not fetch NonRefillables" });
    }
});
  
  
// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { reason } = req.body as CreateNonRefillableParams;

    // TODO: validate & santize
    if (!reason) {
    return res
        .status(400)
        .json({ error: "NonRefillables has to have first name, last name and title" });
    }


    // create new Author with given parameters
    const nonRefillable = NonRefillable.create({
    reason: reason.trim() ?? "",
    });

    //save Author to database
    const result = await nonRefillable.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch NonRefillables" });
}
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // tavaline ORM päring koos "relation" entity sisuga
    const nonRefillable = await defaultDataSource
    .getRepository(NonRefillable)
    .findOne({ where:{id: parseInt(id)}, relations: ['articles'] });

    // Querybuildering tehtud samalaadne päring (leftjoin tüttu hetkel ainult 1)
    // const drugArticles = await defaultDataSource.createQueryBuilder()
    // .select("*")
    // .from("nonRefillable", "nonRefillable")
    // .leftJoin("article", "articles", "articles.drugId = nonRefillable.id")
    // .where("nonRefillable.id = :id", {id: id})
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

    return res.status(200).json({ data: nonRefillable });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch NonRefillables" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { reason } = req.body as UpdateNonRefillableParams;

    const nonRefillable = await defaultDataSource
    .getRepository(NonRefillable)
    .findOneBy({ id: parseInt(id) });

    if (!nonRefillable) {
    return res.status(404).json({ error: "Author not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    nonRefillable.reason = reason ?? nonRefillable.reason;

    

    //salvestame muudatused andmebaasi 
    const result = await nonRefillable.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update NonRefillables" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const nonRefillable = await defaultDataSource
        .getRepository(NonRefillable)
        .findOneBy({ id: parseInt(id) });
    
        if (!nonRefillable) {
        return res.status(404).json({ error: "NonRefillable not found" });
        }

        const result = await nonRefillable.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update NonRefillables" });
    }
});

export default router;