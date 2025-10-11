import { Router } from "express";
import { PrismaClient, RelationshipType } from "@prisma/client";
import { relationshipSchema } from "../utils/relationship.validations";
import { authMiddleware } from "../middleware/middleware";

const router = Router();
const prisma = new PrismaClient();

router.post("/createRelationship", authMiddleware, async (req, res) => {
  try {
    const { contactId, relatedContactId, relationshipType, strength } = relationshipSchema.parse(req.body);

    if (!contactId || !relatedContactId || !relationshipType || !strength) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Step 1: Verify both contacts belong to the same authenticated user
    const [contact, relatedContact] = await Promise.all([
      prisma.contact.findFirst({
        where: { id: contactId, userId: req.user!.id },
      }),
      prisma.contact.findFirst({
        where: { id: relatedContactId, userId: req.user!.id },
      }),
    ]);

    if (!contact || !relatedContact) {
      return res.status(403).json({ message: "Contacts must belong to the authenticated user" });
    }

    // ✅ Step 2: Check if relationship already exists
    const findRelationship = await prisma.relationship.findFirst({
      where: {
        contactId,
        relatedContactId,
      },
    });

    if (findRelationship) {
      return res.status(400).json({ message: "Relationship already exists" });
    }

    // ✅ Step 3: Create the relationship
    const createRelationship = await prisma.relationship.create({
      data: {
        contactId,
        relatedContactId,
        relationshipType: RelationshipType.FRIEND,
        strength,
        createdAt: new Date(),
      },
    });
    return res.status(201).json({ message: "Relationship created successfully", createRelationship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error in createRelationship" });
  }
});


export default router