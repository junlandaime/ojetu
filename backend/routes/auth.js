import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
<<<<<<< HEAD
import crypto from "crypto";
import validator from "validator";
import db from "../config/database.js";
import {
  sendEmail,
  createVerificationEmailTemplate,
  createPasswordResetEmailTemplate,
} from "../services/emailService.js";
import {
  clearAuthCookie,
  getAuthToken,
  requireAuth,
  setAuthCookie,
} from "../middleware/auth.js";

const router = express.Router();

const VERIFICATION_TOKEN_EXPIRY_HOURS = parseInt(
  process.env.VERIFICATION_TOKEN_EXPIRY_HOURS || "24",
  10
);
const PASSWORD_RESET_TOKEN_EXPIRY_MINUTES = parseInt(
  process.env.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES || "30",
  10
);

const buildUserResponse = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    phone: user.phone,
    address: user.address,
    user_type: user.user_type,
  };

  if (user.user_type === "admin") {
    payload.role = "admin";
  }

  return payload;
};

const fetchUserById = async (userId) => {
  const [rows] = await db
    .promise()
    .query(
      `SELECT id, email, full_name, phone, address, user_type FROM users WHERE id = ?`,
      [userId]
    );

  return rows[0];
};

const checkAlreadyLoggedIn = (req, res, next) => {
  const token = getAuthToken(req);

  if (req.user && token) {
    return res.status(403).json({
      success: false,
      message: "Anda sudah login, tidak dapat mengakses halaman ini",
    });
  }

  if (token) {
    try {
         jwt.verify(token, process.env.JWT_SECRET);
         return res.status(403).json({
        success: false,
        message: "Anda sudah login, tidak dapat mengakses halaman ini",
      });
    } catch (error) {
      return next();
    }
  
  }
  
  return next();
};

const issueJwtToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const buildVerificationUrl = (token) => {
  const baseUrl = process.env.APP_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/verify-email/${token}`;
};

const buildResetPasswordUrl = (token) => {
  const baseUrl = process.env.APP_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/reset-password?token=${token}`;
=======
import db from "../config/database.js";

const router = express.Router();

// Middleware untuk cek apakah sudah login
const checkAlreadyLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Jika sudah login, tolak akses ke endpoint public
      return res.status(403).json({
        success: false,
        message: "Anda sudah login, tidak dapat mengakses halaman ini"
      });
    } catch (error) {
      // Token invalid, lanjutkan
      next();
    }
  } else {
    next();
  }
>>>>>>> perbaikan-website-fitalenta
};

// Register - hanya untuk participant
router.post("/register", checkAlreadyLoggedIn, async (req, res) => {
<<<<<<< HEAD
  const { email, password, full_name, phone, address } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({
      success: false,
      message: "Email, password, dan nama lengkap wajib diisi",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Format email tidak valid",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password minimal 6 karakter",
    });
  }

  const connection = await db.promise().getConnection();
  try {
    await connection.beginTransaction();

    const [existing] = await connection.query(
      "SELECT id, is_verified FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      if (existing[0].is_verified) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Pengguna dengan email tersebut sudah terdaftar",
        });
      }

      await connection.rollback();
      return res.status(400).json({
        success: false,
        message:
          "Email sudah pernah digunakan dan menunggu verifikasi. Periksa kotak masuk Anda atau gunakan menu kirim ulang verifikasi.",
=======
  try {
    const { email, password, full_name, phone, address } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and full name are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const [existingUsers] = await db
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
>>>>>>> perbaikan-website-fitalenta
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
<<<<<<< HEAD
    const [userResult] = await connection.query(
      `INSERT INTO users (email, password, full_name, phone, address, user_type, is_verified, verification_token_sent_at)
       VALUES (?, ?, ?, ?, ?, 'participant', 0, NOW())`,
      [email, hashedPassword, full_name, phone || null, address || null]
    );

    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + VERIFICATION_TOKEN_EXPIRY_HOURS);

    await connection.query(
      `INSERT INTO email_verifications (user_id, token, expires_at)
       VALUES (?, ?, ?)`,
      [userResult.insertId, verificationToken, expiresAt]
    );

    await connection.commit();

    try {
      await sendEmail({
        to: email,
        subject: "Verifikasi Akun Fitalenta",
        html: createVerificationEmailTemplate({
          fullName: full_name,
          verifyUrl: buildVerificationUrl(verificationToken),
        }),
      });
    } catch (emailError) {
      console.error("Failed to send verification email", emailError);
      return res.status(500).json({
        success: false,
        message:
          "Registrasi berhasil tetapi gagal mengirim email verifikasi. Silakan hubungi admin untuk bantuan.",
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "Registrasi berhasil. Silakan cek email Anda untuk melakukan verifikasi akun dalam 24 jam.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat proses registrasi",
    });
  } finally {
    connection.release();
  }
});

router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const [rows] = await db
      .promise()
      .query(
        `SELECT ev.id, ev.user_id, ev.expires_at, ev.used_at, u.is_verified
         FROM email_verifications ev
         INNER JOIN users u ON ev.user_id = u.id
         WHERE ev.token = ?`,
        [token]
      );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Token verifikasi tidak ditemukan",
      });
    }

    const verification = rows[0];
     if (verification.used_at || verification.is_verified) {
      return res.json({
        success: true,
        message:
          "Email sudah diverifikasi. Silakan login menggunakan akun Anda.",
      });
    }

    if (verification.expires_at && new Date(verification.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Token verifikasi sudah kedaluwarsa",
      });
    }

    await db
      .promise()
      .query(
        `UPDATE users SET is_verified = 1, verification_token_sent_at = NULL WHERE id = ?`,
        [verification.user_id]
      );

    await db
      .promise()
      .query(`UPDATE email_verifications SET used_at = NOW() WHERE id = ?`, [verification.id]);

    return res.json({
      success: true,
      message: "Email berhasil diverifikasi. Silakan login menggunakan akun Anda.",
    });
  } catch (error) {
    console.error("Verify email error", error);
    return res.status(500).json({
=======

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (email, password, full_name, phone, address, user_type) VALUES (?, ?, ?, ?, ?, 'participant')",
        [email, hashedPassword, full_name, phone, address]
      );

    const token = jwt.sign(
      { userId: result.insertId, email, userType: "participant" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: result.insertId,
          email,
          full_name,
          phone,
          address,
          user_type: "participant",
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
>>>>>>> perbaikan-website-fitalenta
      success: false,
      message: "Internal server error during registration",
    });
  }
});

// Login participant
<<<<<<< HEAD
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Email tidak valid",
    });
  }

  try {
    const [users] = await db
      .promise()
      .query(
        `SELECT id, full_name, is_verified, verification_token_sent_at
         FROM users WHERE email = ? AND user_type = 'participant'`,
        [email]
      );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Akun peserta dengan email tersebut tidak ditemukan",
      });
    }

    const user = users[0];
    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Akun sudah terverifikasi",
      });
    }

    if (user.verification_token_sent_at) {
      const lastSent = new Date(user.verification_token_sent_at).getTime();
      const now = Date.now();
      if (now - lastSent < 5 * 60 * 1000) {
        return res.status(429).json({
          success: false,
          message:
            "Permintaan verifikasi terlalu sering. Coba lagi setelah 5 menit.",
        });
      }
    }

    const newToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + VERIFICATION_TOKEN_EXPIRY_HOURS);

    await db
      .promise()
      .query(`UPDATE users SET verification_token_sent_at = NOW() WHERE id = ?`, [user.id]);

    await db
      .promise()
      .query(`UPDATE email_verifications SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL`, [user.id]);

    await db
      .promise()
      .query(
        `INSERT INTO email_verifications (user_id, token, expires_at)
         VALUES (?, ?, ?)`,
        [user.id, newToken, expiresAt]
      );

    await sendEmail({
      to: email,
      subject: "Verifikasi Akun Fitalenta",
      html: createVerificationEmailTemplate({
        fullName: user.full_name,
        verifyUrl: buildVerificationUrl(newToken),
      }),
    });

    return res.json({
      success: true,
      message: "Email verifikasi baru telah dikirim",
    });
  } catch (error) {
    console.error("Resend verification error", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengirim ulang email verifikasi",
    });
  }
});

router.post("/login", checkAlreadyLoggedIn, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email dan password wajib diisi",
    });
  }

  try {

    const [users] = await db
      .promise()
      .query(
        `SELECT * FROM users WHERE email = ? AND user_type = 'participant'`,
=======
router.post("/login", checkAlreadyLoggedIn, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const [users] = await db
      .promise()
      .query(
        'SELECT * FROM users WHERE email = ? AND user_type = "participant"',
>>>>>>> perbaikan-website-fitalenta
        [email]
      );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
<<<<<<< HEAD
         message: "Email atau password salah",
=======
        message: "Invalid email or password",
>>>>>>> perbaikan-website-fitalenta
      });
    }

    const user = users[0];
<<<<<<< HEAD
if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Email belum diverifikasi. Silakan cek kotak masuk Anda.",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const token = issueJwtToken({
      userId: user.id,
      email: user.email,
      userType: "participant",
    });

  setAuthCookie(res, token);
    
  await db
      .promise()
      .query(`UPDATE users SET last_login_at = NOW() WHERE id = ?`, [user.id]);

    return res.json({
      success: true,
      message: "Login berhasil",
      data: {
=======
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: "participant" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
>>>>>>> perbaikan-website-fitalenta
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          address: user.address,
          user_type: user.user_type,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
<<<<<<< HEAD
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat login",
=======
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
>>>>>>> perbaikan-website-fitalenta
    });
  }
});

<<<<<<< HEAD

router.post("/admin/login", checkAlreadyLoggedIn, async (req, res) => {
  
    const { username, password } = req.body;

if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username dan password wajib diisi",
    });
  }

   try {
    const [admins] = await db
      .promise()
      .query(
        `SELECT * FROM users WHERE email = ? AND user_type = 'admin'`,
        [username]
      );

=======
// Login admin
router.post("/admin/login", checkAlreadyLoggedIn, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const [admins] = await db
      .promise()
      .query('SELECT * FROM users WHERE email = ? AND user_type = "admin"', [
        username,
      ]);
>>>>>>> perbaikan-website-fitalenta

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
<<<<<<< HEAD
        message: "Kredensial admin salah",
=======
        message: "Invalid admin credentials",
>>>>>>> perbaikan-website-fitalenta
      });
    }

    const admin = admins[0];
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
<<<<<<< HEAD
       message: "Kredensial admin salah",
      });
    }

    const token = issueJwtToken({
      userId: admin.id,
      username: admin.email,
      userType: "admin",
    });

     setAuthCookie(res, token);

    await db
      .promise()
      .query(`UPDATE users SET last_login_at = NOW() WHERE id = ?`, [admin.id]);

    return res.json({
      success: true,
      message: "Login admin berhasil",
      data: {

=======
        message: "Invalid admin credentials",
      });
    }

    const token = jwt.sign(
      { userId: admin.id, username: admin.email, userType: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: "Admin login successful",
      data: {
        token,
>>>>>>> perbaikan-website-fitalenta
        user: {
          id: admin.id,
          email: admin.email,
          full_name: admin.full_name,
          user_type: admin.user_type,
          role: "admin",
        },
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
<<<<<<< HEAD
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat login admin",
=======
    res.status(500).json({
      success: false,
      message: "Internal server error during admin login",
>>>>>>> perbaikan-website-fitalenta
    });
  }
});

<<<<<<< HEAD
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Email tidak valid",
    });
  }

  try {
    const [users] = await db
      .promise()
      .query(`SELECT id, full_name FROM users WHERE email = ?`, [email]);

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "Jika email terdaftar, tautan reset kata sandi akan dikirimkan dalam beberapa menit.",
      });
    }

    const user = users[0];
    const resetToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

    await db
      .promise()
      .query(
        `UPDATE password_resets SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL`,
        [user.id]
      );

    await db
      .promise()
      .query(
        `INSERT INTO password_resets (user_id, token, expires_at)
         VALUES (?, ?, ?)`,
        [user.id, resetToken, expiresAt]
      );

    await sendEmail({
      to: email,
      subject: "Reset Kata Sandi Akun Fitalenta",
      html: createPasswordResetEmailTemplate({
        fullName: user.full_name,
        resetUrl: buildResetPasswordUrl(resetToken),
      }),
    });

   return res.json({
      success: true,
      message:
        "Jika email terdaftar, tautan reset kata sandi akan dikirimkan dalam beberapa menit.",
    });
  } catch (error) {
    console.error("Forgot password error", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memproses permintaan reset kata sandi",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, new_password } = req.body;

  if (!token || !new_password) {
    return res.status(400).json({
      success: false,
      message: "Token dan password baru wajib diisi",
    });
  }

  if (new_password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password baru minimal 6 karakter",
    });
  }

  try {
    const [records] = await db
      .promise()
      .query(
        `SELECT pr.id, pr.user_id, pr.expires_at, pr.used_at, u.email
         FROM password_resets pr
         INNER JOIN users u ON pr.user_id = u.id
         WHERE pr.token = ?`,
        [token]
      );

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Token reset kata sandi tidak valid",
      });
    }

    const record = records[0];
    if (record.used_at) {
      return res.status(400).json({
        success: false,
        message: "Token reset kata sandi sudah digunakan",
      });
    }

    if (record.expires_at && new Date(record.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Token reset kata sandi sudah kedaluwarsa",
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);

    await db
      .promise()
      .query(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, record.user_id]);

    await db
      .promise()
      .query(`UPDATE password_resets SET used_at = NOW() WHERE id = ?`, [record.id]);

    return res.json({
      success: true,
      message: "Password berhasil diperbarui. Silakan login dengan password baru.",
    });
  } catch (error) {
    console.error("Reset password error", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengubah password",
    });
  }
});

const respondWithSession = async (req, res) => {
  try {
    const userRecord = await fetchUserById(req.user.userId);

 if (!userRecord) {
      clearAuthCookie(res);
      return res.status(401).json({
        success: false,
        message: "Sesi tidak valid atau pengguna tidak ditemukan",
      });
    }

 return res.json({
      success: true,
      data: { user: buildUserResponse(userRecord) },
    });
  } catch (error) {
    console.error("Session lookup error", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil informasi sesi",
    });
  }
  };

router.get("/session", requireAuth, respondWithSession);
router.get("/check", requireAuth, respondWithSession);

router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  return res.json({ success: true, message: "Logout berhasil" });
=======
// Logout endpoint
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout successful"
  });
});

// Check auth status
router.get("/check", (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.json({
      success: false,
      message: "No token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      data: {
        user: decoded
      }
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Invalid token"
    });
  }
>>>>>>> perbaikan-website-fitalenta
});

export default router;