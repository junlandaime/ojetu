import express from "express";
import { body, validationResult } from "express-validator";
import db from "../config/database.js";

const router = express.Router();

const ensureAdmin = (req, res, next) => {
  if (!req.user || req.user.userType !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya admin yang dapat mengelola success story.",
    });
  }
  return next();
};

const mapRowToStory = (row) => ({
  id: row.id,
  title: row.title,
  excerpt: row.excerpt,
  content: row.content,
  image_url: row.image_url,
  is_published: row.is_published === 1,
  published_at: row.published_at,
  created_at: row.created_at,
  updated_at: row.updated_at,
  created_by: row.created_by,
  updated_by: row.updated_by,
  author_name: row.author_name,
  editor_name: row.editor_name,
});

router.get("/", async (req, res) => {
  try {
    const includeDrafts = req.user?.userType === "admin" && req.query.includeDrafts === "true";
    const queryParts = [
      "SELECT ss.*, creator.full_name AS author_name, editor.full_name AS editor_name",
      "FROM success_stories ss",
      "LEFT JOIN users creator ON ss.created_by = creator.id",
      "LEFT JOIN users editor ON ss.updated_by = editor.id",
    ];
    const params = [];
    if (!includeDrafts) {
      queryParts.push("WHERE ss.is_published = 1");
    }
    queryParts.push("ORDER BY ss.published_at DESC, ss.created_at DESC");

    const [rows] = await db.promise().query(queryParts.join(" "), params);
    return res.json({
      success: true,
      data: rows.map(mapRowToStory),
    });
  } catch (error) {
    console.error("Failed to fetch success stories", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data success story",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db
      .promise()
      .query(
        `SELECT ss.*, creator.full_name AS author_name, editor.full_name AS editor_name
         FROM success_stories ss
         LEFT JOIN users creator ON ss.created_by = creator.id
         LEFT JOIN users editor ON ss.updated_by = editor.id
         WHERE ss.id = ?`,
        [id]
      );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Success story tidak ditemukan",
      });
    }

    const story = mapRowToStory(rows[0]);
    if (!story.is_published && req.user?.userType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Success story belum dipublikasikan",
      });
    }

    return res.json({ success: true, data: story });
  } catch (error) {
    console.error("Failed to fetch success story detail", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail success story",
    });
  }
});

const storyValidators = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Judul wajib diisi")
    .isLength({ max: 255 })
    .withMessage("Judul maksimal 255 karakter"),
  body("excerpt")
    .optional({ checkFalsy: true })
    .isLength({ max: 800 })
    .withMessage("Ringkasan maksimal 800 karakter"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Konten wajib diisi"),
  body("image_url")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("URL gambar tidak valid"),
  body("is_published")
    .optional()
    .isBoolean()
    .withMessage("Status publikasi harus bernilai boolean"),
  body("published_at")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Tanggal publikasi tidak valid"),
];

router.post("/", ensureAdmin, storyValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { title, excerpt, content, image_url, is_published, published_at } = req.body;

  try {
    const [result] = await db
      .promise()
      .query(
        `INSERT INTO success_stories (title, excerpt, content, image_url, is_published, published_at, created_by, updated_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          excerpt || null,
          content,
          image_url || null,
          is_published ? 1 : 0,
          published_at || (is_published ? new Date() : null),
          req.user.userId,
          req.user.userId,
        ]
      );

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
      },
      message: "Success story berhasil dibuat",
    });
  } catch (error) {
    console.error("Failed to create success story", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat success story",
    });
  }
});

router.put("/:id", ensureAdmin, storyValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { id } = req.params;
  const { title, excerpt, content, image_url, is_published, published_at } = req.body;

  try {
    const [existing] = await db
      .promise()
      .query("SELECT * FROM success_stories WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Success story tidak ditemukan",
      });
    }

    const publishedAtValue = is_published
      ? published_at || existing[0].published_at || new Date()
      : null;

    await db
      .promise()
      .query(
        `UPDATE success_stories
         SET title = ?, excerpt = ?, content = ?, image_url = ?, is_published = ?, published_at = ?, updated_by = ?, updated_at = NOW()
         WHERE id = ?`,
        [
          title,
          excerpt || null,
          content,
          image_url || null,
          is_published ? 1 : 0,
          publishedAtValue,
          req.user.userId,
          id,
        ]
      );

    return res.json({
      success: true,
      message: "Success story berhasil diperbarui",
    });
  } catch (error) {
    console.error("Failed to update success story", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui success story",
    });
  }
});

router.delete("/:id", ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db
      .promise()
      .query("SELECT id FROM success_stories WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Success story tidak ditemukan",
      });
    }

    await db.promise().query("DELETE FROM success_stories WHERE id = ?", [id]);
    return res.json({
      success: true,
      message: "Success story berhasil dihapus",
    });
  } catch (error) {
    console.error("Failed to delete success story", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus success story",
    });
  }
});

export default router;