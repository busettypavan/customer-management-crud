
import "dotenv/config";

export default {
  schema: "./src/db/schema.js",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  },
  out: "./drizzle"
};
