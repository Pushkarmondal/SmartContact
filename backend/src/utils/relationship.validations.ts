import {z} from "zod"

export const relationshipSchema = z.object({
    contactId: z.number(),
    relatedContactId: z.number(),
    relationshipType: z.enum(["FRIEND", "FAMILY", "WORK", "SERVICE_PROVIDER", "OTHER"]),
    strength: z.number().optional().default(5)
})