import { Router } from "express";
import { eq, asc } from "drizzle-orm";
import { db } from "../db/client.js";
import { customers } from "../db/schema.js";

const router = Router();

function validateCustomer(body) {
  const fields = ["name", "email", "phone", "city"];
  const values = {};
  for (const field of fields) {
    const value = body?.[field];
    if (typeof value !== "string" || value.trim() === "") {
      return { error: `${field} is required.` };
    }
    values[field] = value.trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return { error: "Please provide a valid email address." };
  }
  return { values };
}

// Insert a customer into the database

router.post("/", async (req, res, next) => {
  try {
    const { values, error } = validateCustomer(req.body);
    if (error) return res.status(400).json({ message: error });

    const [created] = await db.insert(customers).values(values).returning();
    return res.status(201).json(created);
  } catch (error) {
    if (String(error.message).toLowerCase().includes("unique")) {
      return res.status(409).json({ message: "A customer with this email already exists." });
    }
    next(error);
  }
});

// Get all customers from the database
router.get("/", async (_req, res, next) => {
  try {
    const result = await db.select().from(customers).orderBy(asc(customers.id));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get a single customer from the database
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Invalid customer ID." });

    const [customer] = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
    if (!customer) return res.status(404).json({ message: "Customer not found." });
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

// Update a customer in the database

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Invalid customer ID." });

    const { values, error } = validateCustomer(req.body);
    if (error) return res.status(400).json({ message: error });

    const [updated] = await db.update(customers).set(values)
      .where(eq(customers.id, id)).returning();
    if (!updated) return res.status(404).json({ message: "Customer not found." });
    res.json(updated);
  } catch (error) {
    if (String(error.message).toLowerCase().includes("unique")) {
      return res.status(409).json({ message: "A customer with this email already exists." });
    }
    next(error);
  }
});

// Delete a customer from the database

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Invalid customer ID." });

    const [deleted] = await db.delete(customers).where(eq(customers.id, id)).returning();
    if (!deleted) return res.status(404).json({ message: "Customer not found." });
    res.json({ message: "Customer deleted successfully.", customer: deleted });
  } catch (error) {
    next(error);
  }
});

export default router;
