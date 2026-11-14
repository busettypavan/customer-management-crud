import "dotenv/config";
import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customerRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok", message: "Customer API is running." }));
app.use("/api/customers", customerRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong on the server." });
});

app.listen(port, () => {
  console.log(`Customer API running at http://localhost:${port}`);
});
