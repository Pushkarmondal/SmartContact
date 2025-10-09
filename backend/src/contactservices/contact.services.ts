import { Router } from "express";
import { PrismaClient, PrivacyLevel } from "@prisma/client";
import { authMiddleware } from "../middleware/middleware";
import { contactSchema } from "../utils/contact.validations";

const router = Router();
const prisma = new PrismaClient();

router.post("/createContact", authMiddleware, async(req, res) => {
    try {
        const {name, phone, email, address, notes, privacyLevel} = contactSchema.parse(req.body)
        if(!name || !phone || !email || !address || !notes || !privacyLevel) {
            return res.status(400).json({ error: "Please enter all inputs!" })
        }
        const contactExist = await prisma.contact.findFirst({
            where: {
                phone: phone
            }
        })
        if(contactExist) {
            return res.status(400).json({ error: "Contact already exists!" })
        }
        const createContact = await prisma.contact.create({
            data: {
                name,
                phone,
                email,
                address,
                notes,
                privacyLevel: PrivacyLevel.PRIVATE,
                user: {
                    connect: {
                        id: req.user!.id
                    }
                }
            }
        })
        return res.status(201).json({ message: "Contact created successfully", contact: createContact })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error in Create Contacts routes" })
    }
})

export default router;