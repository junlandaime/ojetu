import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const ALLOWED_PHOTO_EXTS = [".jpg", ".jpeg", ".png", ".webp"];
const ALLOWED_DOC_EXTS = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];
const ALLOWED_PAYMENT_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];

const ensureUploadsDir = (subdir = "") => {
  const uploadsDir = path.join(__dirname, "../uploads");
  const targetDir = subdir ? path.join(uploadsDir, subdir) : uploadsDir;

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
};

const getBaseUrl = (req) => {
  const envUrl = process.env.API_URL || process.env.BACKEND_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }
  return `${req.protocol}://${req.get("host")}`;
};

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDir("photos");
    cb(null, path.join(__dirname, "../uploads/photos"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_PHOTO_EXTS.includes(ext)) {
      return cb(new Error("Ekstensi foto tidak valid. Hanya format JPG, JPEG, PNG, dan WebP yang diizinkan."));
    }
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `photo-${uniqueSuffix}${ext}`);
  },
});

const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDir("documents");
    cb(null, path.join(__dirname, "../uploads/documents"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_DOC_EXTS.includes(ext)) {
      return cb(new Error("Ekstensi dokumen tidak valid. Hanya JPG, PNG, PDF, atau DOC/DOCX yang diizinkan."));
    }
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const docType = (req.body.type || "document").replace(/[^a-zA-Z0-9_-]/g, "");
    cb(null, `${docType}-${uniqueSuffix}${ext}`);
  },
});

const paymentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDir("payments");
    cb(null, path.join(__dirname, "../uploads/payments"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_PAYMENT_EXTS.includes(ext)) {
      return cb(new Error("Ekstensi bukti pembayaran tidak valid. Hanya JPG, JPEG, PNG, WebP, atau PDF yang diizinkan."));
    }
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `payment-${uniqueSuffix}${ext}`);
  },
});

const createFileFilter = (allowedMimes, allowedExts, errorMessage) => {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(errorMessage), false);
    }
  };
};

const uploadPhoto = multer({
  storage: photoStorage,
  fileFilter: createFileFilter(
    ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    ALLOWED_PHOTO_EXTS,
    "Hanya file gambar (JPEG, JPG, PNG, WebP) yang diizinkan untuk foto!"
  ),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: createFileFilter(
    [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    ALLOWED_DOC_EXTS,
    "Hanya file JPG, PNG, PDF, atau DOC/DOCX yang diizinkan untuk dokumen!"
  ),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const uploadPayment = multer({
  storage: paymentStorage,
  fileFilter: createFileFilter(
    ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"],
    ALLOWED_PAYMENT_EXTS,
    "Hanya file gambar atau PDF yang diizinkan untuk bukti pembayaran!"
  ),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Seluruh endpoint upload wajib login
router.use(requireAuth);

router.post("/photo", uploadPhoto.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada file foto yang diupload",
      });
    }

    const filePath = `/uploads/photos/${req.file.filename}`;

    res.json({
      success: true,
      message: "Foto berhasil diupload",
      data: {
        file_path: filePath,
        file_name: req.file.filename,
        original_name: req.file.originalname,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        full_url: `${getBaseUrl(req)}${filePath}`,
      },
    });
  } catch (error) {
    console.error("❌ Error uploading photo:", error);

    if (req.file) {
      fs.unlink(req.file.path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Gagal mengupload foto",
    });
  }
});

router.post("/document", uploadDocument.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada file yang diupload",
      });
    }

    const docType = (req.body.type || "document").replace(/[^a-zA-Z0-9_-]/g, "");
    const filePath = `/uploads/documents/${req.file.filename}`;

    res.json({
      success: true,
      message: "Dokumen berhasil diupload",
      data: {
        file_path: filePath,
        file_name: req.file.filename,
        original_name: req.file.originalname,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        document_type: docType,
        full_url: `${getBaseUrl(req)}${filePath}`,
      },
    });
  } catch (error) {
    console.error("❌ Error uploading document:", error);

    if (req.file) {
      fs.unlink(req.file.path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Gagal mengupload dokumen",
    });
  }
});

router.post("/payment", uploadPayment.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada file bukti pembayaran yang diupload",
      });
    }

    const filePath = `/uploads/payments/${req.file.filename}`;

    res.json({
      success: true,
      message: "Bukti pembayaran berhasil diupload",
      data: {
        file_path: filePath,
        file_name: req.file.filename,
        original_name: req.file.originalname,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        full_url: `${getBaseUrl(req)}${filePath}`,
      },
    });
  } catch (error) {
    console.error("❌ Error uploading payment proof:", error);

    if (req.file) {
      fs.unlink(req.file.path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Gagal mengupload bukti pembayaran",
    });
  }
});

router.post("/multiple", uploadDocument.array("files", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada file yang diupload",
      });
    }

    const baseUrl = getBaseUrl(req);
    const uploadedFiles = req.files.map((file) => {
      const filePath = `/uploads/documents/${file.filename}`;
      return {
        file_path: filePath,
        file_name: file.filename,
        original_name: file.originalname,
        file_size: file.size,
        mime_type: file.mimetype,
        full_url: `${baseUrl}${filePath}`,
      };
    });

    res.json({
      success: true,
      message: `${uploadedFiles.length} file berhasil diupload`,
      data: {
        files: uploadedFiles,
      },
    });
  } catch (error) {
    console.error("❌ Error uploading multiple files:", error);

    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (unlinkError) => {
          if (unlinkError) {
            console.error("Error deleting uploaded file:", unlinkError);
          }
        });
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Gagal mengupload file",
    });
  }
});

router.delete("/file", requireAdmin, async (req, res) => {
  try {
    const { file_path } = req.body;

    if (!file_path) {
      return res.status(400).json({
        success: false,
        message: "File path diperlukan",
      });
    }

    if (!file_path.startsWith("/uploads/")) {
      return res.status(400).json({
        success: false,
        message: "Path file tidak valid",
      });
    }

    const fullPath = path.join(__dirname, "..", file_path);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: "File tidak ditemukan",
      });
    }

    fs.unlinkSync(fullPath);

    res.json({
      success: true,
      message: "File berhasil dihapus",
    });
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Gagal menghapus file",
    });
  }
});

router.get("/health", requireAdmin, async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, "../uploads");
    const subdirs = ["photos", "documents", "payments"];

    const healthStatus = {
      uploads_dir: fs.existsSync(uploadsDir),
      subdirectories: {},
    };

    subdirs.forEach((subdir) => {
      const subdirPath = path.join(uploadsDir, subdir);
      healthStatus.subdirectories[subdir] = {
        exists: fs.existsSync(subdirPath),
        writable: false,
      };

      if (healthStatus.subdirectories[subdir].exists) {
        try {
          const testFile = path.join(subdirPath, `test-${Date.now()}.tmp`);
          fs.writeFileSync(testFile, "test");
          fs.unlinkSync(testFile);
          healthStatus.subdirectories[subdir].writable = true;
        } catch (error) {
          healthStatus.subdirectories[subdir].writable = false;
        }
      }
    });

    const allHealthy =
      healthStatus.uploads_dir &&
      Object.values(healthStatus.subdirectories).every(
        (dir) => dir.exists && dir.writable
      );

    res.json({
      success: true,
      data: {
        healthy: allHealthy,
        ...healthStatus,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Error checking upload health:", error);
    res.status(500).json({
      success: false,
      message: "Error checking upload health",
    });
  }
});

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    let message = "Error upload file";

    if (error.code === "LIMIT_FILE_SIZE") {
      message =
        "File terlalu besar. Maksimal 5MB untuk foto dan 10MB untuk dokumen.";
    } else if (error.code === "LIMIT_FILE_COUNT") {
      message = "Terlalu banyak file diupload";
    } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Field file tidak sesuai";
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

export default router;