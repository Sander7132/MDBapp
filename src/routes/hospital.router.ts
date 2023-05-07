import express from 'express';
import defaultDataSource from '../datasource';
import { Hospital } from '../entities/hospital';

const router = express.Router();

interface CreateHospitalParams {
    name: string;
    address: string;
    phoneNumber: string;

}

interface UpdateHospitalParams {
    name?: string;
    address?: string;
    phoneNumber?: string;


}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const Hospitals = await defaultDataSource.getRepository(Hospital).find();
  
      // vasta artiklite kogumikuga JSON formaadis
      return res.status(200).json({ data: Hospitals });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
      return res.status(500).json({ message: "Could not fetch Hospital" });
    }
});
  
  
// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { name, address, phoneNumber } = req.body as CreateHospitalParams;

    // TODO: validate & santize
    if (!name || !address || !phoneNumber) {
    return res
        .status(400)
        .json({ error: "hospital has to have first name, last name and title" });
    }


    // create new Author with given parameters
    const hospital = Hospital.create({
    name: name.trim() ?? "",
    address: address.trim() ?? "",
    phoneNumber: phoneNumber.trim() ?? "",
    });

    //save Author to database
    const result = await hospital.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch Hospitals" });
}
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // tavaline ORM päring koos "relation" entity sisuga
    const hospital = await defaultDataSource
    .getRepository(Hospital)
    .findOne({ where:{id: parseInt(id)}, relations: ['articles'] });

    // Querybuildering tehtud samalaadne päring (leftjoin tüttu hetkel ainult 1)
    // const hospitalArticles = await defaultDataSource.createQueryBuilder()
    // .select("*")
    // .from("hospital", "hospital")
    // .leftJoin("article", "articles", "articles.hospitalId = hospital.id")
    // .where("hospital.id = :id", {id: id})
    // .getRawOne();
    
    // return res.status(200).json({ data: {
    //     id:hospitalArticles.id,
    //     firstName:hospitalArticles.firstName,
    //     lastName:hospitalArticles.lastName,
    //     article: {
    //         title: hospitalArticles.title,
    //         body: hospitalArticles.body,
    //     }
    //  }});

    return res.status(200).json({ data: hospital });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch hospital" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { name, address, phoneNumber} = req.body as UpdateHospitalParams;

    const hospital = await defaultDataSource
    .getRepository(Hospital)
    .findOneBy({ id: parseInt(id) });

    if (!hospital) {
    return res.status(404).json({ error: "Author not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    hospital.name = name ? name : hospital.name;
    hospital.address = address ? address : hospital.address;
    hospital.phoneNumber = phoneNumber ? phoneNumber : hospital.phoneNumber;

    

    //salvestame muudatused andmebaasi 
    const result = await hospital.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update Hospital" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const hospital = await defaultDataSource
        .getRepository(Hospital)
        .findOneBy({ id: parseInt(id) });
    
        if (!hospital) {
        return res.status(404).json({ error: "Hospital not found" });
        }

        const result = await hospital.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update Hospitals" });
    }
});

export default router;