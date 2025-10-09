import {z} from "zod"

export const contactSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    privacyLevel: z.enum(["PRIVATE", "PUBLIC"]),
})