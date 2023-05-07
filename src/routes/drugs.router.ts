import express from 'express';
import defaultDataSource from '../datasource';
import { Drug } from '../entities/drug';

const router = express.Router();

interface CreateDrugParams {
    drugName: string;
    sideEffects: string;
    benefits: string;
}

interface UpdateDrugParams {
    drugName?: string;
    sideEffects?: string;
    benefits?: string;


}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const Drugs = await defaultDataSource.getRepository(Drug).find();
  
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
    const { drugName, sideEffects, benefits } = req.body as CreateDrugParams;

    // TODO: validate & santize
    if (!drugName || !sideEffects || !benefits) {
    return res
        .status(400)
        .json({ error: "drugs has to have first name, last name and title" });
    }


    // create new Author with given parameters
    const drug = Drug.create({
    drugName: drugName.trim() ?? "",
    sideEffects: sideEffects.trim() ?? "",
    benefits: benefits.trim() ?? "",
    });

    //save Author to database
    const result = await drug.save();

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
    const drug = await defaultDataSource
    .getRepository(Drug)
    .findOne({ where:{id: parseInt(id)}, relations: ['articles'] });

    // Querybuildering tehtud samalaadne päring (leftjoin tüttu hetkel ainult 1)
    // const drugArticles = await defaultDataSource.createQueryBuilder()
    // .select("*")
    // .from("drug", "drug")
    // .leftJoin("article", "articles", "articles.drugId = drug.id")
    // .where("drug.id = :id", {id: id})
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

    return res.status(200).json({ data: drug });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch drugs" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { drugName, sideEffects, benefits } = req.body as UpdateDrugParams;

    const drug = await defaultDataSource
    .getRepository(Drug)
    .findOneBy({ id: parseInt(id) });

    if (!drug) {
    return res.status(404).json({ error: "Author not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    drug.drugName = drugName ? drugName : drug.drugName;
    drug.sideEffects = sideEffects ? sideEffects : drug.sideEffects;
    drug.benefits = benefits ? benefits : drug.benefits;

    

    //salvestame muudatused andmebaasi 
    const result = await drug.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update drugs" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const drug = await defaultDataSource
        .getRepository(Drug)
        .findOneBy({ id: parseInt(id) });
    
        if (!drug) {
        return res.status(404).json({ error: "Drug not found" });
        }

        const result = await drug.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update Drugs" });
    }
});

export default router;