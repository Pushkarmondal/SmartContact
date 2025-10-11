import {z} from "zod"

export const relationshipSchema = z.object({
    contactId: z.number(),
    relatedContactId: z.number(),
    relationshipType: z.enum(["FRIEND", "FAMILY", "COLLEAGUE", "SERVICE_PROVIDER", "ACQUAINTANCE", "KNOWN_TO_EACH_OTHER", "OTHER"]),
    strength: z.number().optional().default(5)
})