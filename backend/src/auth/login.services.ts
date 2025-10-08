import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { loginSchema } from "../utils/auth.validations";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = Router();
const prisma = new PrismaClient();


router.post("/api/v1/login", async (req, res) => {
    try {
        const {email, password} = loginSchema.parse(req.body)
        if(!email || !password) {
            return res.status(400).json({ message: "Please enter all inputs!" })
        }
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                name: true,
                email: true,
                password: true,
                createdAt: true
            }
        })
        if(!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        const {password: _, ...safeUser} = user
        if(!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" })
        }
        const token = jwt.sign({email: user.email}, process.env.JWT_SECRET!, { expiresIn: "24h" })
        return res.status(200).json({ message: "Login successful", user: safeUser, token })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error in login routes" })
    }
})

export default router;
