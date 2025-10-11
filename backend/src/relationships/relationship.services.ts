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

    // ✅ NEW: Prevent self-relationships
    if (contactId === relatedContactId) {
      return res.status(400).json({ message: "A contact cannot have a relationship with themselves" });
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

    // ✅ Step 2: Check if relationship already exists (bidirectional check)
    const findRelationship = await prisma.relationship.findFirst({
      where: {
        OR: [
          { contactId, relatedContactId },
          { contactId: relatedContactId, relatedContactId: contactId }, // Check reverse too
        ],
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
        relationshipType: relationshipType as RelationshipType,
        strength,
        createdAt: new Date(),
      },
    });
    
    return res.status(201).json({ 
      message: "Relationship created successfully", 
      relationship: createRelationship 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error in createRelationship" });
  }
});

router.get("/getRelationships", authMiddleware, async (req, res) => {
  try {
    const relationships = await prisma.relationship.findMany({
      where: {
        AND: [
          { contact: { userId: req.user!.id } },
          { relatedContact: { userId: req.user!.id } },
        ],
      },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            address: true,
            notes: true,
            privacyLevel: true,
          },
        },
        relatedContact: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            address: true,
            notes: true,
            privacyLevel: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({ 
      count: relationships.length,
      relationships 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error in getRelationships" });
  }
});

export default router