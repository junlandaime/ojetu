import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import db, { testConnection } from "./config/database.js";
import rateLimiter from "./middleware/rateLimiter.js";
import authenticateRequest from "./middleware/auth.js";

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
import successStoriesRoutes from "./routes/successStories.js";

dotenv.config();

const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 5000;

const uniqueOrigins = (...origins) => {
  const allowed = new Set();
  origins
    .flatMap((entry) =>
      typeof entry === "string"
        ? entry
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        : []
    )
    .forEach((origin) => allowed.add(origin));

  return Array.from(allowed);
};

const allowedOrigins = uniqueOrigins(
  process.env.APP_URL,
  process.env.ADMIN_APP_URL,
  process.env.CORS_ALLOWED_ORIGINS
);

const corsMiddleware = cors({
  origin: allowedOrigins.length === 0 ? true : allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), fullscreen=(self)"
  );
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
  }

 next();
});

app.use((req, res, next) => {
   const origin = req.header("Origin");
  if (origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
    console.warn(`Blocked request from origin: ${origin}`);
    return res.status(403).json({
      success: false,
      message: "Origin tidak diizinkan oleh kebijakan CORS",
    });
  }

  return corsMiddleware(req, res, next);
});

app.use(rateLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
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
app.use("/api/success-stories", successStoriesRoutes);

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
