import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { signupSchema } from "../utils/auth.validations";
import bcrypt from "bcrypt"

const router = Router();
const prisma = new PrismaClient();

router.post("/api/v1/signup", async(req, res) => {
    try {
        const {name, email, password} = signupSchema.parse(req.body)
        if(!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all inputs!" })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword
            },
            select: {
                name: true,
                email: true,
                createdAt: true
            }
        })
        return res.status(200).json({ message: "user Created Successfully!", user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error in Signup routes" })
    }
})

export default router;
