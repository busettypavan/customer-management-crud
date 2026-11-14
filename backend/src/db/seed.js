import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./client.js";
import { customers } from "./schema.js";

const sampleCustomers = [
  { name: "Aarav Sharma", email: "aarav@example.com", phone: "+91 9876500001", city: "Bengaluru" },
  { name: "Diya Patel", email: "diya@example.com", phone: "+91 9876500002", city: "Mumbai" },
  { name: "Ishaan Rao", email: "ishaan@example.com", phone: "+91 9876500003", city: "Mysuru" },
  { name: "Meera Nair", email: "meera@example.com", phone: "+91 9876500004", city: "Kochi" },
  { name: "Kabir Verma", email: "kabir@example.com", phone: "+91 9876500005", city: "Hyderabad" }
];

for (const customer of sampleCustomers) {
  const existing = await db.select({ id: customers.id })
    .from(customers)
    .where(eq(customers.email, customer.email))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(customers).values(customer);
  }
}

console.log("Sample customers are ready.");
process.exit(0);
