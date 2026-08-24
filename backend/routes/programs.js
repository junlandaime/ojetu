import express from "express";
import { promisePool } from "../config/database.js";

const router = express.Router();

/* =========================================================
   CATEGORY ORDER
========================================================= */
const CATEGORY_ORDER = [
    "Penyaluran",
    "Pelatihan",
    "Korea",
    "AMTO",
];

/* =========================================================
   PROGRAM FORMAT OPTIONS
========================================================= */
const ALLOWED_PROGRAM_FORMATS = [
    "Reguler",
    "Asrama",
    "Hybrid",
    "Fast Track",
    "Beasiswa",
    "Studi",
    "Non-Asrama",
    "Teknis",
    "Executive Training",
];

/* =========================================================
   INSTALLMENT OPTIONS
========================================================= */
const ALLOWED_INSTALLMENT_PLANS = [
    "none",
    "dp",
    "3_installments",
    "4_installments",
    "5_installments",
    "6_installments",
];

/* =========================================================
   CATEGORY UTILITIES
========================================================= */
const normalizeProgramName = (value = "") => {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[-_\s]+/g, "");
};

const getCategorySortIndex = (value = "") => {
    const normalized =
        normalizeProgramName(value);

    const aliases = {
        penyaluran: 0,
        layananpenyaluran: 0,

        pelatihan: 1,
        layananpelatihan: 1,

        korea: 2,
        programkorea: 2,

        amto: 3,
        programamto: 3,
    };

    return aliases[normalized] ?? 999;
};

const getFixedSortOrder = (
    categoryName = ""
) => {
    const index =
        getCategorySortIndex(
            categoryName
        );

    return index === 999
        ? 999
        : index + 1;
};

const isAllowedCategory = (
    categoryName = ""
) => {
    return CATEGORY_ORDER.some(
        (item) =>
            normalizeProgramName(
                item
            ) ===
            normalizeProgramName(
                categoryName
            )
    );
};

/* =========================================================
   PROGRAM FORMAT UTILITIES
========================================================= */
const isAllowedProgramFormat = (
    value = ""
) => {
    return ALLOWED_PROGRAM_FORMATS.some(
        (item) =>
            normalizeProgramName(
                item
            ) ===
            normalizeProgramName(
                value
            )
    );
};

const getCanonicalProgramFormat = (
    value = ""
) => {
    const normalized =
        normalizeProgramName(
            value
        );

    const format =
        ALLOWED_PROGRAM_FORMATS.find(
            (item) =>
                normalizeProgramName(
                    item
                ) ===
                normalized
        );

    return format || "";
};

const isHybridProgram = ({
                             programFormat = "",
                             programName = "",
                         } = {}) => {
    const format =
        normalizeProgramName(
            programFormat
        );

    const name =
        normalizeProgramName(
            programName
        );

    return (
        format === "hybrid" ||
        name.includes("hybrid")
    );
};

/* =========================================================
   NUMBER UTILITIES
========================================================= */
const toNumber = (
    value,
    fallback = 0
) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    const numericValue =
        Number(value);

    return Number.isFinite(
        numericValue
    )
        ? numericValue
        : fallback;
};

const toInteger = (
    value,
    fallback = 0
) => {
    const numericValue =
        toNumber(
            value,
            fallback
        );

    return Math.max(
        0,
        Math.trunc(
            numericValue
        )
    );
};

/* =========================================================
   GET CATEGORY BY ID
========================================================= */
const getCategoryById = async (
    categoryId
) => {
    if (!categoryId) {
        return null;
    }

    const [categories] =
        await promisePool.query(
            `
                SELECT
                    id,
                    name
                FROM program_categories
                WHERE id = ?
                    LIMIT 1
            `,
            [categoryId]
        );

    return categories[0] || null;
};

/* =========================================================
   UPDATE CURRENT PARTICIPANTS
========================================================= */
const updateCurrentParticipants =
    async (
        programId = null
    ) => {
        try {
            if (programId) {
                const [result] =
                    await promisePool.query(
                        `
                            UPDATE programs
                            SET current_participants = (
                                SELECT COUNT(*)
                                FROM registrations
                                WHERE program_id = ?
                                  AND registration_status = 'lolos'
                            )
                            WHERE id = ?
                        `,
                        [
                            programId,
                            programId,
                        ]
                    );

                return result.affectedRows;
            }

            const [result] =
                await promisePool.query(`
                    UPDATE programs p
                    SET p.current_participants = (
                        SELECT COUNT(*)
                        FROM registrations r
                        WHERE r.program_id = p.id
                          AND r.registration_status = 'lolos'
                    )
                `);

            return result.affectedRows;
        } catch (error) {
            console.error(
                "Error updating current_participants:",
                error
            );

            throw error;
        }
    };

/* =========================================================
   GET PROGRAMS
========================================================= */
router.get(
    "/",
    async (req, res) => {
        try {
            const [programs] =
                await promisePool.query(`
                    SELECT
                        p.*,
                        pc.name AS category_name
                    FROM programs p
                             LEFT JOIN program_categories pc
                                       ON p.category_id = pc.id
                    WHERE p.status = 'active'
                    ORDER BY
                        CASE pc.name
                            WHEN 'Penyaluran' THEN 1
                            WHEN 'Pelatihan' THEN 2
                            WHEN 'Korea' THEN 3
                            WHEN 'AMTO' THEN 4
                            ELSE 999
                            END ASC,
                        CASE
                            WHEN p.sort_order IS NULL
                                OR p.sort_order = 0
                                THEN 999
                            ELSE p.sort_order
                            END ASC,
                        p.name ASC,
                        p.id ASC
                `);

            res.json({
                success: true,
                data: programs,
            });
        } catch (error) {
            console.error(
                "❌ Error fetching programs:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Internal server error: " +
                    error.message,
                error:
                    process.env.NODE_ENV ===
                    "development"
                        ? error.stack
                        : undefined,
            });
        }
    }
);

/* =========================================================
   SYNC PARTICIPANTS
========================================================= */
router.post(
    "/sync-participants",
    async (req, res) => {
        try {
            const updatedCount =
                await updateCurrentParticipants();

            res.json({
                success: true,
                message:
                    `Berhasil menyinkronkan participant count untuk ${updatedCount} program`,
            });
        } catch (error) {
            console.error(
                "Error syncing participants:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Gagal menyinkronkan data participants",
            });
        }
    }
);

/* =========================================================
   GET PROGRAM DETAIL
========================================================= */
router.get(
    "/:id",
    async (req, res) => {
        try {
            const programId =
                req.params.id;

            const [programs] =
                await promisePool.query(
                    `
                        SELECT
                            p.*,
                            pc.name AS category_name
                        FROM programs p
                                 LEFT JOIN program_categories pc
                                           ON p.category_id = pc.id
                        WHERE p.id = ?
                    `,
                    [programId]
                );

            if (
                programs.length === 0
            ) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Program not found",
                    });
            }

            const program =
                programs[0];

            const [relatedPrograms] =
                await promisePool.query(
                    `
                        SELECT
                            p.id,
                            p.category_id,
                            p.name,
                            p.program_format,
                            p.description,
                            p.duration,
                            p.training_cost,
                            p.departure_cost,
                            p.installment_plan,
                            p.down_payment,
                            p.job_matching_cost,
                            p.sort_order,
                            pc.name AS category_name
                        FROM programs p
                                 LEFT JOIN program_categories pc
                                           ON p.category_id = pc.id
                        WHERE p.category_id = ?
                          AND p.id != ?
                    AND p.status = 'active'
                        ORDER BY
                            CASE
                            WHEN p.sort_order IS NULL
                            OR p.sort_order = 0
                            THEN 999
                            ELSE p.sort_order
                        END ASC,
                        p.name ASC,
                        p.id ASC
                    LIMIT 3
                    `,
                    [
                        program.category_id,
                        programId,
                    ]
                );

            res.json({
                success: true,
                data: {
                    ...program,
                    relatedPrograms,
                },
            });
        } catch (error) {
            console.error(
                "❌ Error fetching program:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Internal server error: " +
                    error.message,
            });
        }
    }
);

/* =========================================================
   UPDATE PROGRAM
========================================================= */
router.put(
    "/:id",
    async (req, res) => {
        try {
            const programId =
                req.params.id;

            const [
                existingPrograms,
            ] =
                await promisePool.query(
                    `
                        SELECT *
                        FROM programs
                        WHERE id = ?
                    `,
                    [programId]
                );

            if (
                existingPrograms.length ===
                0
            ) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Program tidak ditemukan.",
                    });
            }

            const existingProgram =
                existingPrograms[0];

            const {
                category_id,
                program_format,
                name,
                description,
                requirements,
                schedule,
                duration,
                capacity,
                contact_info,
                status,
                training_cost,
                departure_cost,
                installment_plan,
                down_payment,
                job_matching_cost,
                location,
                bridge_fund,
                timeline_text,
                training_fee_details,
                departure_fee_details,
                requirements_text,
            } = req.body;

            /* =====================================================
               PROGRAM NAME
            ===================================================== */
            const finalName =
                String(
                    name ??
                    existingProgram.name ??
                    ""
                ).trim();

            if (!finalName) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Nama program wajib diisi.",
                    });
            }

            /* =====================================================
               CATEGORY
            ===================================================== */
            const finalCategoryId =
                category_id ??
                existingProgram.category_id;

            const category =
                await getCategoryById(
                    finalCategoryId
                );

            if (!category) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Kategori program tidak ditemukan.",
                    });
            }

            if (
                !isAllowedCategory(
                    category.name
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Kategori program tidak valid. Gunakan Penyaluran, Pelatihan, Korea, atau AMTO.",
                    });
            }

            /* =====================================================
               PROGRAM FORMAT
            ===================================================== */
            const requestedFormat =
                String(
                    program_format ??
                    existingProgram.program_format ??
                    ""
                ).trim();

            if (!requestedFormat) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Tipe / format program wajib diisi.",
                    });
            }

            if (
                !isAllowedProgramFormat(
                    requestedFormat
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Tipe / format program tidak valid.",
                    });
            }

            const finalProgramFormat =
                getCanonicalProgramFormat(
                    requestedFormat
                );

            /* =====================================================
               BASIC DATA
            ===================================================== */
            const finalDescription =
                description ??
                existingProgram.description;

            const finalRequirements =
                requirements ??
                existingProgram.requirements;

            const finalSchedule =
                schedule ??
                existingProgram.schedule;

            const finalDuration =
                duration ??
                existingProgram.duration;

            const finalCapacity =
                toInteger(
                    capacity,
                    existingProgram.capacity ||
                    0
                );

            const finalContactInfo =
                contact_info ??
                existingProgram.contact_info;

            const finalStatus =
                status ||
                existingProgram.status ||
                "active";

            const finalLocation =
                location ??
                existingProgram.location;

            const finalBridgeFund =
                bridge_fund ??
                existingProgram.bridge_fund;

            const finalTimelineText =
                timeline_text ??
                existingProgram.timeline_text;

            const finalTrainingFeeDetails =
                training_fee_details ??
                existingProgram.training_fee_details;

            const finalDepartureFeeDetails =
                departure_fee_details ??
                existingProgram.departure_fee_details;

            const finalRequirementsText =
                requirements_text ??
                existingProgram.requirements_text;

            /* =====================================================
               FINANCIAL DATA
            ===================================================== */
            const finalTrainingCost =
                toNumber(
                    training_cost,
                    existingProgram.training_cost ||
                    0
                );

            const finalDepartureCost =
                toNumber(
                    departure_cost,
                    existingProgram.departure_cost ||
                    0
                );

            const finalInstallmentPlan =
                installment_plan ||
                existingProgram.installment_plan ||
                "none";

            const finalDownPayment =
                toNumber(
                    down_payment,
                    existingProgram.down_payment ||
                    0
                );

            const hybrid =
                isHybridProgram({
                    programFormat:
                    finalProgramFormat,
                    programName:
                    finalName,
                });

            const finalJobMatchingCost =
                hybrid
                    ? toNumber(
                        job_matching_cost,
                        existingProgram.job_matching_cost ||
                        0
                    )
                    : 0;

            /* =====================================================
               SORT ORDER
            ===================================================== */
            const finalSortOrder =
                getFixedSortOrder(
                    category.name
                );

            /* =====================================================
               VALIDATION
            ===================================================== */
            if (
                finalCapacity <
                Number(
                    existingProgram.current_participants ||
                    0
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            `Kapasitas tidak bisa dikurangi menjadi ${finalCapacity} karena sudah ada ${existingProgram.current_participants} peserta yang terdaftar`,
                    });
            }

            if (
                finalTrainingCost < 0 ||
                finalDepartureCost < 0 ||
                finalDownPayment < 0 ||
                finalJobMatchingCost < 0
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Nominal biaya tidak boleh bernilai negatif.",
                    });
            }

            if (
                !ALLOWED_INSTALLMENT_PLANS.includes(
                    finalInstallmentPlan
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Skema cicilan tidak valid.",
                    });
            }

            const totalProgramCost =
                finalTrainingCost +
                finalDepartureCost +
                finalJobMatchingCost;

            if (
                finalDownPayment >
                totalProgramCost &&
                finalDownPayment > 0
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Nominal DP tidak boleh melebihi total biaya program.",
                    });
            }

            /* =====================================================
               UPDATE DATABASE
            ===================================================== */
            await promisePool.query(
                `
                    UPDATE programs
                    SET
                        category_id = ?,
                        program_format = ?,
                        name = ?,
                        description = ?,
                        requirements = ?,
                        schedule = ?,
                        duration = ?,
                        capacity = ?,
                        contact_info = ?,
                        status = ?,
                        training_cost = ?,
                        departure_cost = ?,
                        installment_plan = ?,
                        down_payment = ?,
                        job_matching_cost = ?,
                        location = ?,
                        bridge_fund = ?,
                        timeline_text = ?,
                        training_fee_details = ?,
                        departure_fee_details = ?,
                        requirements_text = ?,
                        sort_order = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `,
                [
                    finalCategoryId,
                    finalProgramFormat,
                    finalName,
                    finalDescription,
                    finalRequirements,
                    finalSchedule,
                    finalDuration,
                    finalCapacity,
                    finalContactInfo,
                    finalStatus,
                    finalTrainingCost,
                    finalDepartureCost,
                    finalInstallmentPlan,
                    finalDownPayment,
                    finalJobMatchingCost,
                    finalLocation,
                    finalBridgeFund,
                    finalTimelineText,
                    finalTrainingFeeDetails,
                    finalDepartureFeeDetails,
                    finalRequirementsText,
                    finalSortOrder,
                    programId,
                ]
            );

            const [updatedPrograms] =
                await promisePool.query(
                    `
                        SELECT
                            p.*,
                            pc.name AS category_name
                        FROM programs p
                                 LEFT JOIN program_categories pc
                                           ON p.category_id = pc.id
                        WHERE p.id = ?
                    `,
                    [programId]
                );

            res.json({
                success: true,
                message:
                    "Program berhasil diperbarui.",
                data:
                    updatedPrograms[0] ||
                    null,
            });
        } catch (error) {
            console.error(
                "Error updating program:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Internal server error: " +
                    error.message,
            });
        }
    }
);

/* =========================================================
   CREATE PROGRAM
========================================================= */
router.post(
    "/",
    async (req, res) => {
        try {
            const {
                category_id,
                program_format,
                name,
                description,
                requirements,
                schedule,
                duration,
                capacity,
                contact_info,
                status,
                location,
                training_cost,
                departure_cost,
                installment_plan,
                down_payment,
                job_matching_cost,
                bridge_fund,
                timeline_text,
                training_fee_details,
                departure_fee_details,
                requirements_text,
            } = req.body;

            /* =====================================================
               REQUIRED DATA
            ===================================================== */
            const finalName =
                String(
                    name || ""
                ).trim();

            if (
                !category_id ||
                !finalName
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Nama program dan kategori wajib diisi.",
                    });
            }

            /* =====================================================
               CATEGORY
            ===================================================== */
            const category =
                await getCategoryById(
                    category_id
                );

            if (!category) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Kategori program tidak ditemukan.",
                    });
            }

            if (
                !isAllowedCategory(
                    category.name
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Kategori program tidak valid. Gunakan Penyaluran, Pelatihan, Korea, atau AMTO.",
                    });
            }

            /* =====================================================
               PROGRAM FORMAT
            ===================================================== */
            const requestedFormat =
                String(
                    program_format ||
                    ""
                ).trim();

            if (!requestedFormat) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Tipe / format program wajib diisi.",
                    });
            }

            if (
                !isAllowedProgramFormat(
                    requestedFormat
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Tipe / format program tidak valid.",
                    });
            }

            const finalProgramFormat =
                getCanonicalProgramFormat(
                    requestedFormat
                );

            /* =====================================================
               FINANCIAL DATA
            ===================================================== */
            const finalTrainingCost =
                toNumber(
                    training_cost,
                    0
                );

            const finalDepartureCost =
                toNumber(
                    departure_cost,
                    0
                );

            const finalDownPayment =
                toNumber(
                    down_payment,
                    0
                );

            const hybrid =
                isHybridProgram({
                    programFormat:
                    finalProgramFormat,
                    programName:
                    finalName,
                });

            const finalJobMatchingCost =
                hybrid
                    ? toNumber(
                        job_matching_cost,
                        0
                    )
                    : 0;

            const finalCapacity =
                toInteger(
                    capacity,
                    0
                );

            const finalInstallmentPlan =
                installment_plan ||
                "none";

            const finalSortOrder =
                getFixedSortOrder(
                    category.name
                );

            /* =====================================================
               VALIDATION
            ===================================================== */
            if (
                finalTrainingCost < 0 ||
                finalDepartureCost < 0 ||
                finalDownPayment < 0 ||
                finalJobMatchingCost < 0
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Nominal biaya tidak boleh bernilai negatif.",
                    });
            }

            if (
                !ALLOWED_INSTALLMENT_PLANS.includes(
                    finalInstallmentPlan
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Skema cicilan tidak valid.",
                    });
            }

            const totalProgramCost =
                finalTrainingCost +
                finalDepartureCost +
                finalJobMatchingCost;

            if (
                finalDownPayment >
                totalProgramCost &&
                finalDownPayment > 0
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Nominal DP tidak boleh melebihi total biaya program.",
                    });
            }

            /* =====================================================
               INSERT PROGRAM
            ===================================================== */
            const [result] =
                await promisePool.query(
                    `
                        INSERT INTO programs (
                            category_id,
                            program_format,
                            name,
                            description,
                            requirements,
                            schedule,
                            duration,
                            capacity,
                            contact_info,
                            status,
                            location,
                            training_cost,
                            departure_cost,
                            installment_plan,
                            down_payment,
                            job_matching_cost,
                            bridge_fund,
                            timeline_text,
                            training_fee_details,
                            departure_fee_details,
                            requirements_text,
                            sort_order,
                            current_participants
                        )
                        VALUES (
                                   ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                                   ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0
                               )
                    `,
                    [
                        category_id,
                        finalProgramFormat,
                        finalName,
                        description || "",
                        requirements || "",
                        schedule || "",
                        duration || "",
                        finalCapacity,
                        contact_info || "",
                        status || "active",
                        location || "",
                        finalTrainingCost,
                        finalDepartureCost,
                        finalInstallmentPlan,
                        finalDownPayment,
                        finalJobMatchingCost,
                        bridge_fund || "",
                        timeline_text || "",
                        training_fee_details ||
                        "",
                        departure_fee_details ||
                        "",
                        requirements_text ||
                        "",
                        finalSortOrder,
                    ]
                );

            const [createdPrograms] =
                await promisePool.query(
                    `
                        SELECT
                            p.*,
                            pc.name AS category_name
                        FROM programs p
                                 LEFT JOIN program_categories pc
                                           ON p.category_id = pc.id
                        WHERE p.id = ?
                    `,
                    [
                        result.insertId,
                    ]
                );

            res.status(201).json({
                success: true,
                message:
                    "Program berhasil ditambahkan.",
                data:
                    createdPrograms[0] ||
                    {
                        id:
                        result.insertId,
                    },
            });
        } catch (error) {
            console.error(
                "Error creating program:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Internal server error: " +
                    error.message,
            });
        }
    }
);

/* =========================================================
   DELETE PROGRAM
========================================================= */
router.delete(
    "/:id",
    async (req, res) => {
        try {
            const programId =
                req.params.id;

            const [programs] =
                await promisePool.query(
                    `
                        SELECT
                            id,
                            name,
                            current_participants
                        FROM programs
                        WHERE id = ?
                    `,
                    [programId]
                );

            if (
                programs.length === 0
            ) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Program tidak ditemukan.",
                    });
            }

            const program =
                programs[0];

            if (
                Number(
                    program.current_participants ||
                    0
                ) > 0
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            `Tidak dapat menghapus program karena masih ada ${program.current_participants} peserta yang terdaftar`,
                    });
            }

            await promisePool.query(
                `
                    DELETE FROM programs
                    WHERE id = ?
                `,
                [programId]
            );

            res.json({
                success: true,
                message:
                    "Program berhasil dihapus.",
            });
        } catch (error) {
            console.error(
                "Error deleting program:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Internal server error: " +
                    error.message,
            });
        }
    }
);

export default router;