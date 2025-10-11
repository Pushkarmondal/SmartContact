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
                privacyLevel: privacyLevel as PrivacyLevel,
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

router.get("/getContacts", authMiddleware, async(req, res) => {
    try {
        const contacts = await prisma.contact.findMany({
            where: {
                user: {
                    id: req.user!.id
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true
                    }
                }
            }
        })
        return res.status(200).json({ message: "Contacts fetched successfully", contacts })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error in Get Contacts routes" })
    }
})

router.get("/getContact/:id", authMiddleware, async(req, res) => {
    try {
        const contact = await prisma.contact.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true
                    }
                }
            }
        })
        if(!contact) {
            return res.status(404).json({ error: "Contact not found!" })
        }
        return res.status(200).json({ message: "Contact fetched successfully", contact })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error in Get Contact routes" })
    }
})

router.put("/updateContact/:id", authMiddleware, async(req, res) => {
    try {
        const contact = await prisma.contact.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        if(!contact) {
            return res.status(404).json({ error: "Contact not found!" })
        }
        const updateContact = await prisma.contact.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                notes: req.body.notes,
                privacyLevel: req.body.privacyLevel
            }
        })
        return res.status(200).json({ message: "Contact updated successfully", contact: updateContact })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error in Update Contact routes" })
    }
})

router.delete("/deleteContact/:id", authMiddleware, async(req, res) => {
    try {
        const contact = await prisma.contact.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        if(!contact) {
            return res.status(404).json({ error: "Contact not found!" })
        }
        const deleteContact = await prisma.contact.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        return res.status(200).json({ message: "Contact deleted successfully", contact: deleteContact })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error in Delete Contact routes" })
    }
})

export default router;