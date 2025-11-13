import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import db from "../config/database.js";

const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Akses membutuhkan autentikasi",
    });
  }
  return next();
};

router.get("/me", ensureAuthenticated, async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        `SELECT id, email, full_name, phone, address, profile_picture, user_type,
                birth_place, birth_date, is_verified, allow_multiple_programs,
                last_login_at, created_at, updated_at
         FROM users WHERE id = ?`,
        [req.user.userId]
      );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
      });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Failed to fetch profile", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil profil pengguna",
    });
  }
});

const profileValidators = [
  body("full_name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Nama lengkap harus antara 3 hingga 255 karakter"),
  body("phone")
    .optional({ checkFalsy: true })
    .matches(/^[0-9+\-\s]{6,20}$/)
    .withMessage("Nomor telepon tidak valid"),
  body("address").optional({ checkFalsy: true }).isLength({ max: 500 }),
  body("birth_place").optional({ checkFalsy: true }).isLength({ max: 100 }),
  body("birth_date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Tanggal lahir tidak valid"),
  body("profile_picture")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("URL foto profil tidak valid"),
  body("new_password")
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password baru minimal 6 karakter"),
  body("current_password").custom((value, { req }) => {
    if (req.body.new_password && !value) {
      throw new Error("Password saat ini wajib diisi untuk mengganti password");
    }
    return true;
  }),
];

router.put("/me", ensureAuthenticated, profileValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const {
    full_name,
    phone,
    address,
    birth_place,
    birth_date,
    profile_picture,
    new_password,
    current_password,
  } = req.body;

  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    const [users] = await connection.query(
      "SELECT id, password FROM users WHERE id = ?",
      [req.user.userId]
    );

    if (users.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
      });
    }

    if (new_password) {
      const isPasswordValid = await bcrypt.compare(
        current_password,
        users[0].password
      );

      if (!isPasswordValid) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Password saat ini tidak sesuai",
        });
      }

      const hashedPassword = await bcrypt.hash(new_password, 12);
      await connection.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, req.user.userId]
      );
    }

    await connection.query(
      `UPDATE users
       SET full_name = COALESCE(?, full_name),
           phone = ?,
           address = ?,
           birth_place = ?,
           birth_date = ?,
           profile_picture = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        full_name || null,
        phone || null,
        address || null,
        birth_place || null,
        birth_date || null,
        profile_picture || null,
        req.user.userId,
      ]
    );

    await connection.commit();

    const [updated] = await db
      .promise()
      .query(
        `SELECT id, email, full_name, phone, address, profile_picture, birth_place, birth_date, updated_at
         FROM users WHERE id = ?`,
        [req.user.userId]
      );

    return res.json({
      success: true,
      message: "Profil berhasil diperbarui",
      data: updated[0],
    });
  } catch (error) {
     await connection.rollback();
    console.error("Failed to update profile", error);
    return res.status(500).json({
      success: false,
      mmessage: "Gagal memperbarui profil",
    });
    } finally {
    connection.release();
  }
});

export default router;
