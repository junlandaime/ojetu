import express from "express";
import db from "../config/database.js";

const router = express.Router();

/* =========================================================
   GET PROGRAM CATEGORIES
========================================================= */
router.get("/", async (req, res) => {
    try {
        const [categories] =
            await db.promise().query(`
                SELECT *
                FROM program_categories
                WHERE name IN (
                               'Penyaluran',
                               'Pelatihan',
                               'Korea',
                               'AMTO'
                    )
                ORDER BY
                    CASE name
                        WHEN 'Penyaluran' THEN 1
                        WHEN 'Pelatihan' THEN 2
                        WHEN 'Korea' THEN 3
                        WHEN 'AMTO' THEN 4
                        ELSE 999
                        END,
                    name ASC
            `);

        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error(
            "Error fetching program categories:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Internal server error",
        });
    }
});

export default router;