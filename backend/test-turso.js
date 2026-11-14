
import "dotenv/config";
import { createClient } from "@libsql/client";

console.log("Checking Turso configuration...");

console.log("Database URL:", process.env.TURSO_DATABASE_URL ? "Found" : "Missing");
console.log("Auth Token:", process.env.TURSO_AUTH_TOKEN ? "Found" : "Missing");

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});

try {
    console.log("Connecting to Turso...");

    const result = await client.execute("SELECT 1 AS connection_test");

    console.log("Connection successful!");
    console.log("Result:", result.rows);

} catch (error) {
    console.error("Turso connection failed:");
    console.error(error);
} finally {
    client.close();
}
