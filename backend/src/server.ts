import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDatabase } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import issueRoutes from "./routes/issueRoutes";
import pollRoutes from "./routes/pollRoutes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: clientUrl }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "VoteSphere API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/issues", issueRoutes);
app.use((_req, res) => {
  res.status(404).json({ message: "API endpoint not found." });
});
app.use(errorHandler);

async function start(): Promise<void> {
  try {
    await connectDatabase();
    app.listen(port, "0.0.0.0", () => {
      console.log(`VoteSphere API listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Could not start the server:", error);
    process.exit(1);
  }
}

void start();
