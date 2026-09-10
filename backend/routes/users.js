import express from "express";
import db from "../config/database.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const [users] = await db
      .promise()
      .query(
        "SELECT id, email, full_name, phone, address, user_type FROM users WHERE id = ?",
        [userId]
      );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
