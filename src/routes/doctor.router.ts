import express from 'express';
import defaultDataSource from '../datasource';
import { Doctor } from '../entities/doctor';

const router = express.Router();

interface CreateDoctorParams {
    fName: string;
    lName: string;
    address: string
    phoneNumber: string;
    speciality: string;
}

interface UpdateDoctorParams {
    fName?: string;
    lName?: string;
    address?: string;
    phoneNumber?: string;
    speciality?: string;

}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const Doctors = await defaultDataSource.getRepository(Doctor).find();
  
      // vasta artiklite kogumikuga JSON formaadis
      return res.status(200).json({ data: Doctors });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
      return res.status(500).json({ message: "Could not fetch Doctors" });
    }
});
  
  
// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { fName, lName, address, phoneNumber, speciality  } = req.body as CreateDoctorParams;

    // TODO: validate & santize
    if (!fName || !lName || !address || !phoneNumber || !speciality) {
    return res
        .status(400)
        .json({ error: "doctor has to have first name, last name and title" });
    }


    // create new Author with given parameters
    const doctor = Doctor.create({
    fName: fName.trim() ?? "",
    lName: lName.trim() ?? "",
    address: address.trim() ?? "",
    phoneNumber: phoneNumber.trim() ?? "",
    speciality: speciality.trim() ?? "",
    });

    //save Author to database
    const result = await doctor.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch doctor" });
}
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // tavaline ORM päring koos "relation" entity sisuga
    const doctor = await defaultDataSource
    .getRepository(Doctor)
    .findOne({ where:{id: parseInt(id)}, relations: ['articles'] });

    // Querybuildering tehtud samalaadne päring (leftjoin tüttu hetkel ainult 1)
    // const doctorArticles = await defaultDataSource.createQueryBuilder()
    // .select("*")
    // .from("doctor", "doctor")
    // .leftJoin("article", "articles", "articles.doctorId = doctor.id")
    // .where("doctor.id = :id", {id: id})
    // .getRawOne();
    
    // return res.status(200).json({ data: {
    //     id:doctorArticles.id,
    //     firstName:doctorArticles.firstName,
    //     lastName:doctorArticles.lastName,
    //     article: {
    //         title: doctorArticles.title,
    //         body: doctorArticles.body,
    //     }
    //  }});

    return res.status(200).json({ data: doctor });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch doctor" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { fName, lName, address, phoneNumber, speciality } = req.body as UpdateDoctorParams;

    const doctor = await defaultDataSource
    .getRepository(Doctor)
    .findOneBy({ id: parseInt(id) });

    if (!doctor) {
    return res.status(404).json({ error: "Author not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    doctor.fName = fName ? fName : doctor.fName;
    doctor.lName = lName ? lName : doctor.lName;
    doctor.address = address ? address : doctor.address;
    doctor.phoneNumber = phoneNumber ? phoneNumber : doctor.phoneNumber;
    doctor.speciality = speciality ? speciality : doctor.speciality;

    

    //salvestame muudatused andmebaasi 
    const result = await doctor.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update doctor" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const doctor = await defaultDataSource
        .getRepository(Doctor)
        .findOneBy({ id: parseInt(id) });
    
        if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
        }

        const result = await doctor.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update Doctors" });
    }
});

export default router;