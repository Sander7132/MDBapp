import express from 'express';
import defaultDataSource from '../datasource';
import { Insurance_Company } from '../entities/insurance_company';

const router = express.Router();

interface CreateInsuranceCompanyParams {
    name: string;
    address: string;
    phone: string;
}

interface UpdateInsuranceCompanyParams {
    name?: string;
    address?: string;
    phone?: string;


}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const InsuranceCompanys = await defaultDataSource.getRepository(Insurance_Company).find();
  
      // vasta artiklite kogumikuga JSON formaadis
      return res.status(200).json({ data: InsuranceCompanys });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
      return res.status(500).json({ message: "Could not fetch insurance company" });
    }
});
  
  
// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { name, address, phone } = req.body as CreateInsuranceCompanyParams;

    // TODO: validate & santize
    if (!name || !address || !phone) {
    return res
        .status(400)
        .json({ error: "insurance company has to have first name, last name and title" });
    }


    // create new Author with given parameters
    const insurance_Company = Insurance_Company.create({
    name: name.trim() ?? "",
    address: address.trim() ?? "",
    phone: phone.trim() ?? "",
    });

    //save Author to database
    const result = await insurance_Company.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch InsuranceCompanys" });
}
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // tavaline ORM päring koos "relation" entity sisuga
    const insurance_Company = await defaultDataSource
    .getRepository(Insurance_Company)
    .findOne({ where:{id: parseInt(id)}, relations: ['articles'] });

    // Querybuildering tehtud samalaadne päring (leftjoin tüttu hetkel ainult 1)
    // const drugArticles = await defaultDataSource.createQueryBuilder()
    // .select("*")
    // .from("insurance_Company", "insurance_Company")
    // .leftJoin("article", "articles", "articles.drugId = insurance_Company.id")
    // .where("insurance_Company.id = :id", {id: id})
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

    return res.status(200).json({ data: insurance_Company });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch insurance company" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { name, address, phone } = req.body as UpdateInsuranceCompanyParams;

    const insurance_Company = await defaultDataSource
    .getRepository(Insurance_Company)
    .findOneBy({ id: parseInt(id) });

    if (!insurance_Company) {
    return res.status(404).json({ error: "Author not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    insurance_Company.name = name ?? insurance_Company.name;
    insurance_Company.address = address ?? insurance_Company.address;
    insurance_Company.phone = phone ?? insurance_Company.phone;

    

    //salvestame muudatused andmebaasi 
    const result = await insurance_Company.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update insurance company" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const insurance_Company = await defaultDataSource
        .getRepository(Insurance_Company)
        .findOneBy({ id: parseInt(id) });
    
        if (!insurance_Company) {
        return res.status(404).json({ error: "Insurance_Company not found" });
        }

        const result = await insurance_Company.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update InsuranceCompanys" });
    }
});

export default router;