import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import db, { testConnection } from "./config/database.js";
import { authenticateRequest } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from "./routes/auth.js";
import programRoutes from "./routes/programs.js";
import registrationRoutes from "./routes/registrations.js";
import paymentRoutes from "./routes/payments.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/users.js";
import userDashboardRoutes from "./routes/userDashboard.js";
import selectionRoutes from "./routes/selection.js";
import placementRoutes from "./routes/placement.js";
import reportRoutes from "./routes/reports.js";
import programCategoriesRoutes from "./routes/program-categories.js";
import wilayahRoutes from "./routes/wilayah.js";
import uploadRoutes from "./routes/uploads.js";

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Konfigurasi daftar origin CORS yang diizinkan (fleksibel untuk production & staging)
const rawOrigins = [
  process.env.APP_URL,
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ALLOWED_ORIGINS || "").split(","),
  "http://localhost:3000",
  "http://localhost:5173",
  "https://registrasi.fitalenta.co.id",
  "https://try.fitalenta.co.id",
];

const allowedOrigins = rawOrigins
  .filter(Boolean)
  .map((url) => url.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // Mengizinkan request tanpa origin (mobile apps, server-to-server, curl)
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(normalized) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Autentikasi global middleware
app.use(authenticateRequest);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get("/api/health", async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: dbStatus ? "Connected" : "Disconnected",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user-dashboard", userDashboardRoutes);
app.use("/api/selection", selectionRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/program-categories", programCategoriesRoutes);
app.use("/api/wilayah", wilayahRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("Cannot start server without database connection");
      process.exit(1);
    }

    const fs = await import("fs");
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Created uploads directory");
    }

    app.listen(PORT, () => {
      console.log("Server started successfully!");
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Backend URL: http://localhost:${PORT}`);
      console.log(`API Health: http://localhost:${PORT}/api/health`);
      console.log(
        `Frontend URL: ${process.env.APP_URL || "http://localhost:3000"}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
