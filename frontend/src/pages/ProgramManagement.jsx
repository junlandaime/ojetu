import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

/* =========================================================
   PROGRAM ORDER
========================================================= */
const PROGRAM_ORDER = [
    "Program Reguler",
    "Program Asrama",
    "Program Hybrid",
    "Program Fast Track",
    "Program Beasiswa",
    "Program Gijinkoku",
    "Program Korea",
];

/* =========================================================
   INSTALLMENT OPTIONS
========================================================= */
const INSTALLMENT_OPTIONS = [
    {
        value: "none",
        label: "Tidak Ada / Bayar Penuh",
    },
    {
        value: "3_installments",
        label: "3 Cicilan",
    },
    {
        value: "4_installments",
        label: "4 Cicilan",
    },
    {
        value: "5_installments",
        label: "5 Cicilan",
    },
    {
        value: "6_installments",
        label: "6 Cicilan",
    },
];

/* =========================================================
   PROGRAM UTILITIES
========================================================= */
const normalizeProgramName = (value = "") => {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[-_\s]+/g, "");
};
const getProgramSortIndex = (program) => {
    const normalizedName = normalizeProgramName(
        typeof program === "string"
            ? program
            : program?.name ||
            program?.category_name ||
            ""
    );
    const aliases = {
        programregular: 0,
        programreguler: 0,
        regular: 0,
        reguler: 0,
        programasrama: 1,
        asrama: 1,
        programhybrid: 2,
        hybrid: 2,
        programfasttrack: 3,
        fasttrack: 3,
        programbeasiswa: 4,
        beasiswa: 4,
        programgijinkoku: 5,
        gijinkoku: 5,
        programkorea: 6,
        korea: 6,
    };
    return aliases[normalizedName] ?? 999;
};
const getCanonicalProgramName = (value = "") => {
    const index = getProgramSortIndex(value);
    if (index === 999) {
        return value;
    }
    return PROGRAM_ORDER[index];
};
const sortPrograms = (data = []) => {
    return [...data].sort((a, b) => {
        const first = getProgramSortIndex(a);
        const second = getProgramSortIndex(b);
        if (first !== second) {
            return first - second;
        }
        return String(a?.name || "").localeCompare(
            String(b?.name || ""),
            "id"
        );
    });
};
const sortCategories = (data = []) => {
    return [...data].sort((a, b) => {
        const first = getProgramSortIndex(a?.name);
        const second = getProgramSortIndex(b?.name);
        if (first !== second) {
            return first - second;
        }
        return String(a?.name || "").localeCompare(
            String(b?.name || ""),
            "id"
        );
    });
};
const isHybridProgram = (program) => {
    const values = [
        program?.name,
        program?.category_name,
    ];
    return values.some((value) =>
        normalizeProgramName(value).includes("hybrid")
    );
};
const getFixedSortOrder = (name) => {
    const index = getProgramSortIndex(name);
    return index === 999
        ? 999
        : index + 1;
};

/* =========================================================
   CURRENCY UTILITIES
========================================================= */
const normalizeCurrencyValue = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }
    if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            return "";
        }
        return String(Math.round(value));
    }
    const rawValue = String(value).trim();
    if (!rawValue) {
        return "";
    }
    if (/^-?\d+(\.\d+)?$/.test(rawValue)) {
        const numericValue = Number(rawValue);
        if (!Number.isFinite(numericValue)) {
            return "";
        }
        return String(Math.round(numericValue));
    }
    const digits = rawValue.replace(/[^\d]/g, "");
    return digits;
};
const formatCurrencyInput = (value) => {
    const numericString = normalizeCurrencyValue(value);
    if (!numericString) {
        return "";
    }
    const numericValue = Number(numericString);
    if (!Number.isFinite(numericValue)) {
        return "";
    }
    return Math.round(numericValue).toLocaleString("id-ID");
};
const currencyToNumber = (value) => {
    const numericString = normalizeCurrencyValue(value);
    if (!numericString) {
        return 0;
    }
    const numericValue = Number(numericString);
    return Number.isFinite(numericValue)
        ? numericValue
        : 0;
};

/* =========================================================
   PROGRAM MANAGEMENT
========================================================= */
const ProgramManagement = () => {
    const [programs, setPrograms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    /* =========================================================
       DEFAULT FORM DATA
    ========================================================= */
    const defaultFormData = {
        category_id: "",
        name: "",
        description: "",
        requirements: "",
        schedule: "",
        duration: "",
        capacity: "",
        contact_info: "",
        status: "active",
        location: "Bandung, Indonesia & Jepang",
        training_cost: "",
        departure_cost: "",
        installment_plan: "none",
        down_payment: "",
        job_matching_cost: "",
        bridge_fund: "Tersedia",
        timeline_text: "",
        training_fee_details: "",
        departure_fee_details: "",
        requirements_text: "",
        sort_order: 999,
    };
    const [formData, setFormData] = useState(defaultFormData);

    /* =========================================================
       ORDERED DATA
    ========================================================= */
    const orderedPrograms = useMemo(
        () => sortPrograms(programs),
        [programs]
    );
    const orderedCategories = useMemo(
        () => sortCategories(categories),
        [categories]
    );

    /* =========================================================
       SELECTED CATEGORY
    ========================================================= */
    const selectedCategory = useMemo(() => {
        return categories.find(
            (category) =>
                String(category.id) ===
                String(formData.category_id)
        );
    }, [
        categories,
        formData.category_id,
    ]);
    const isHybridForm = isHybridProgram({
        name: formData.name,
        category_name: selectedCategory?.name,
    });

    /* =========================================================
       FETCH PROGRAMS
    ========================================================= */
    const fetchPrograms = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.get(
                "/api/programs",
                {
                    timeout: 10000,
                }
            );
            if (response.data?.success) {
                const data = Array.isArray(response.data.data)
                    ? response.data.data
                    : [];
                setPrograms(
                    sortPrograms(data)
                );
            } else {
                setPrograms([]);
                setError(
                    "Gagal memuat data program."
                );
            }
        } catch (error) {
            console.error(
                "Error fetching programs:",
                error
            );
            setPrograms([]);
            setError(
                error.response?.data?.message ||
                error.message ||
                "Gagal memuat data program."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       FETCH CATEGORIES
    ========================================================= */
    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                "/api/program-categories",
                {
                    timeout: 10000,
                }
            );
            if (response.data?.success) {
                const data = Array.isArray(response.data.data)
                    ? response.data.data
                    : [];
                setCategories(
                    sortCategories(data)
                );
            }
        } catch (error) {
            console.error(
                "Error fetching categories:",
                error
            );
        }
    };

    /* =========================================================
       INITIAL DATA
    ========================================================= */
    useEffect(() => {
        fetchPrograms();
        fetchCategories();
    }, []);

    /* =========================================================
       FIND CATEGORY
    ========================================================= */
    const findCategoryByProgramName = (programName) => {
        const programIndex =
            getProgramSortIndex(programName);
        if (programIndex === 999) {
            return null;
        }
        return (
            categories.find(
                (category) =>
                    getProgramSortIndex(
                        category.name
                    ) === programIndex
            ) || null
        );
    };

    /* =========================================================
       OPEN MODAL
    ========================================================= */
    const handleShowModal = (program = null) => {
        setMessage({
            type: "",
            text: "",
        });
        if (program) {
            setEditingProgram(program);
            setFormData({
                category_id:
                    program.category_id ?? "",
                name:
                    getCanonicalProgramName(
                        program.name || ""
                    ),
                description:
                    program.description || "",
                requirements:
                    program.requirements || "",
                schedule:
                    program.schedule || "",
                duration:
                    program.duration || "",
                capacity:
                    program.capacity ?? "",
                contact_info:
                    program.contact_info || "",
                status:
                    program.status || "active",
                location:
                    program.location ||
                    "Bandung, Indonesia & Jepang",
                training_cost:
                    normalizeCurrencyValue(
                        program.training_cost
                    ),
                departure_cost:
                    normalizeCurrencyValue(
                        program.departure_cost
                    ),
                installment_plan:
                    program.installment_plan ||
                    "none",
                down_payment:
                    normalizeCurrencyValue(
                        program.down_payment
                    ),
                job_matching_cost:
                    normalizeCurrencyValue(
                        program.job_matching_cost
                    ),
                bridge_fund:
                    program.bridge_fund ||
                    "Tersedia",
                timeline_text:
                    program.timeline_text || "",
                training_fee_details:
                    program.training_fee_details || "",
                departure_fee_details:
                    program.departure_fee_details || "",
                requirements_text:
                    program.requirements_text || "",
                sort_order:
                    getFixedSortOrder(
                        program.name
                    ),
            });
        } else {
            setEditingProgram(null);
            setFormData({
                ...defaultFormData,
            });
        }
        setShowModal(true);
    };

    /* =========================================================
       CLOSE MODAL
    ========================================================= */
    const handleCloseModal = () => {
        if (saving) {
            return;
        }
        setShowModal(false);
        setEditingProgram(null);
        setFormData({
            ...defaultFormData,
        });
    };

    /* =========================================================
       MODAL BODY SCROLL
    ========================================================= */
    useEffect(() => {
        if (!showModal) {
            return undefined;
        }
        const previousOverflow =
            document.body.style.overflow;
        const previousPaddingRight =
            document.body.style.paddingRight;
        const scrollbarWidth =
            window.innerWidth -
            document.documentElement.clientWidth;
        document.body.style.overflow =
            "hidden";
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight =
                `${scrollbarWidth}px`;
        }
        return () => {
            document.body.style.overflow =
                previousOverflow;
            document.body.style.paddingRight =
                previousPaddingRight;
        };
    }, [showModal]);

    /* =========================================================
       MODAL ESCAPE KEY
    ========================================================= */
    useEffect(() => {
        if (!showModal) {
            return undefined;
        }
        const handleEscape = (event) => {
            if (
                event.key === "Escape" &&
                !saving
            ) {
                handleCloseModal();
            }
        };
        window.addEventListener(
            "keydown",
            handleEscape
        );
        return () => {
            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [
        showModal,
        saving,
    ]);

    /* =========================================================
       HANDLE FIELD CHANGE
    ========================================================= */
    const handleChange = (event) => {
        const { name, value } =
            event.target;
        setFormData((prev) => {
            const updated = {
                ...prev,
                [name]: value,
            };
            if (name === "name") {
                updated.name =
                    getCanonicalProgramName(
                        value
                    );
                updated.sort_order =
                    getFixedSortOrder(value);
                const matchingCategory =
                    findCategoryByProgramName(
                        value
                    );
                if (matchingCategory) {
                    updated.category_id =
                        matchingCategory.id;
                }
                if (
                    !normalizeProgramName(
                        value
                    ).includes("hybrid")
                ) {
                    updated.job_matching_cost =
                        "";
                }
            }
            return updated;
        });
    };

    /* =========================================================
       HANDLE CURRENCY CHANGE
    ========================================================= */
    const handleCurrencyChange = (
        fieldName,
        value
    ) => {
        const digits =
            String(value).replace(
                /[^\d]/g,
                ""
            );
        setFormData((prev) => ({
            ...prev,
            [fieldName]: digits,
        }));
    };

    /* =========================================================
       SUBMIT PROGRAM
    ========================================================= */
    const handleSubmit = async (event) => {
        event.preventDefault();
        const currentCategory =
            categories.find(
                (category) =>
                    String(category.id) ===
                    String(
                        formData.category_id
                    )
            );
        const hybrid =
            isHybridProgram({
                name: formData.name,
                category_name:
                currentCategory?.name,
            });
        const trainingCost =
            currencyToNumber(
                formData.training_cost
            );
        const departureCost =
            currencyToNumber(
                formData.departure_cost
            );
        const downPayment =
            currencyToNumber(
                formData.down_payment
            );
        const jobMatchingCost =
            hybrid
                ? currencyToNumber(
                    formData.job_matching_cost
                )
                : 0;
        if (trainingCost < 0) {
            setMessage({
                type: "error",
                text:
                    "Biaya pelatihan tidak boleh kurang dari Rp 0.",
            });
            return;
        }
        if (departureCost < 0) {
            setMessage({
                type: "error",
                text:
                    "Biaya keberangkatan tidak boleh kurang dari Rp 0.",
            });
            return;
        }
        if (downPayment < 0) {
            setMessage({
                type: "error",
                text:
                    "Nominal DP tidak boleh kurang dari Rp 0.",
            });
            return;
        }
        if (jobMatchingCost < 0) {
            setMessage({
                type: "error",
                text:
                    "Biaya Job Matching tidak boleh kurang dari Rp 0.",
            });
            return;
        }
        if (
            downPayment >
            trainingCost +
            departureCost +
            jobMatchingCost &&
            downPayment > 0
        ) {
            setMessage({
                type: "error",
                text:
                    "Nominal DP tidak boleh melebihi total biaya program.",
            });
            return;
        }
        const payload = {
            ...formData,
            name:
                getCanonicalProgramName(
                    formData.name
                ),
            training_cost:
            trainingCost,
            departure_cost:
            departureCost,
            down_payment:
            downPayment,
            job_matching_cost:
            jobMatchingCost,
            capacity:
                Number(
                    formData.capacity ||
                    0
                ),
            sort_order:
                getFixedSortOrder(
                    formData.name
                ),
        };
        try {
            setSaving(true);
            setError("");
            let response;
            if (editingProgram) {
                response =
                    await axios.put(
                        `/api/programs/${editingProgram.id}`,
                        payload,
                        {
                            timeout:
                                15000,
                        }
                    );
            } else {
                response =
                    await axios.post(
                        "/api/programs",
                        payload,
                        {
                            timeout:
                                15000,
                        }
                    );
            }
            if (
                response.data?.success ===
                false
            ) {
                throw new Error(
                    response.data?.message ||
                    "Program gagal disimpan."
                );
            }
            setShowModal(false);
            setEditingProgram(null);
            setFormData({
                ...defaultFormData,
            });
            await fetchPrograms();
            setMessage({
                type: "success",
                text: editingProgram
                    ? "Program berhasil diperbarui."
                    : "Program berhasil ditambahkan.",
            });
        } catch (error) {
            console.error(
                "Error saving program:",
                error
            );
            setMessage({
                type: "error",
                text:
                    "Gagal menyimpan program: " +
                    (error.response?.data?.message ||
                        error.message),
            });
        } finally {
            setSaving(false);
        }
    };

    /* =========================================================
       DELETE PROGRAM
    ========================================================= */
    const handleDelete = async (programId) => {
        const confirmed =
            window.confirm(
                "Apakah Anda yakin ingin menghapus program ini?"
            );
        if (!confirmed) {
            return;
        }
        try {
            await axios.delete(
                `/api/programs/${programId}`,
                {
                    timeout: 15000,
                }
            );
            setMessage({
                type: "success",
                text:
                    "Program berhasil dihapus.",
            });
            await fetchPrograms();
        } catch (error) {
            console.error(
                "Error deleting program:",
                error
            );
            setMessage({
                type: "error",
                text:
                    "Gagal menghapus program: " +
                    (error.response?.data?.message ||
                        error.message),
            });
        }
    };

    /* =========================================================
       CURRENCY DISPLAY
    ========================================================= */
    const formatCurrency = (value) => {
        const numericValue =
            Number(value || 0);
        if (
            !Number.isFinite(
                numericValue
            )
        ) {
            return "Rp 0";
        }
        return `Rp ${Math.round(
            numericValue
        ).toLocaleString("id-ID")}`;
    };

    /* =========================================================
       STATUS BADGE
    ========================================================= */
    const getStatusBadge = (status) => {
        const statusConfig = {
            active: {
                tone: "success",
                icon:
                    "bi-check-circle",
                text: "Aktif",
            },
            inactive: {
                tone:
                    "secondary",
                icon:
                    "bi-pause-circle",
                text:
                    "Tidak Aktif",
            },
            full: {
                tone: "warning",
                icon:
                    "bi-people",
                text: "Penuh",
            },
        };
        const config =
            statusConfig[status] || {
                tone:
                    "secondary",
                icon:
                    "bi-circle",
                text:
                    status || "-",
            };
        return (
            <span
                className={`program-status-badge program-status-${config.tone}`}
            >
                <i
                    className={`bi ${config.icon}`}
                    aria-hidden="true"
                ></i>
                {config.text}
            </span>
        );
    };

    /* =========================================================
       INSTALLMENT TEXT
    ========================================================= */
    const getInstallmentText = (value) => {
        const option =
            INSTALLMENT_OPTIONS.find(
                (item) =>
                    item.value === value
            );
        if (!option) {
            return "-";
        }
        return value === "none"
            ? "Bayar Penuh"
            : option.label;
    };

    /* =========================================================
       CAPACITY
    ========================================================= */
    const getCapacityData = (program) => {
        const capacity =
            Number(program.capacity) ||
            0;
        const participants =
            Number(
                program.current_participants
            ) || 0;
        const percentage =
            capacity > 0
                ? Math.min(
                    100,
                    Math.round(
                        (participants /
                            capacity) *
                        100
                    )
                )
                : 0;
        return {
            capacity,
            participants,
            percentage,
        };
    };

    /* =========================================================
       CATEGORY ICON
    ========================================================= */
    const getCategoryIcon = (categoryName) => {
        const category =
            normalizeProgramName(
                categoryName || ""
            );
        if (
            category.includes(
                "asrama"
            )
        ) {
            return "bi-building";
        }
        if (
            category.includes(
                "hybrid"
            )
        ) {
            return "bi-laptop";
        }
        if (
            category.includes(
                "fasttrack"
            )
        ) {
            return "bi-lightning-charge";
        }
        if (
            category.includes(
                "beasiswa"
            )
        ) {
            return "bi-mortarboard";
        }
        if (
            category.includes(
                "gijinkoku"
            )
        ) {
            return "bi-briefcase";
        }
        if (
            category.includes(
                "korea"
            )
        ) {
            return "bi-globe-asia-australia";
        }
        if (
            category.includes(
                "reguler"
            ) ||
            category.includes(
                "regular"
            )
        ) {
            return "bi-journal-check";
        }
        return "bi-journal-bookmark";
    };

    /* =========================================================
       SUMMARY
    ========================================================= */
    const programSummary = {
        total:
        orderedPrograms.length,
        active:
        orderedPrograms.filter(
            (program) =>
                program.status ===
                "active"
        ).length,
        full:
        orderedPrograms.filter(
            (program) =>
                program.status ===
                "full"
        ).length,
        totalCapacity:
            orderedPrograms.reduce(
                (
                    total,
                    program
                ) =>
                    total +
                    (Number(
                        program.capacity
                    ) || 0),
                0
            ),
    };

    /* =========================================================
       INITIAL LOADING
    ========================================================= */
    if (
        loading &&
        orderedPrograms.length ===
        0
    ) {
        return (
            <div className="program-management-page">
                <div className="program-loading-state">
                    <div className="program-loading-icon">
                        <span
                            className="spinner-border"
                            role="status"
                        ></span>
                    </div>
                    <h4>
                        Memuat data program
                    </h4>
                    <p>
                        Informasi program sedang disiapkan.
                    </p>
                </div>
            </div>
        );
    }

    /* =========================================================
       MAIN RENDER
    ========================================================= */
    return (
        <div className="program-management-page">
            <header className="program-page-header">
                <div className="program-page-heading">
                    <div className="program-page-eyebrow">
                        <span>
                            <i className="bi bi-journal-text"></i>
                        </span>
                        MANAJEMEN PROGRAM
                    </div>
                    <h1>
                        Manajemen Program
                    </h1>
                    <p>
                        Kelola program pelatihan, kuota, biaya, jadwal, pembayaran, dan informasi pendukung program FITALENTA.
                    </p>
                </div>
                <button
                    type="button"
                    className="program-add-button"
                    onClick={() =>
                        handleShowModal()
                    }
                >
                    <span className="program-add-button-icon">
                        <i className="bi bi-plus-lg"></i>
                    </span>
                    <span className="program-add-button-copy">
                        <strong>
                            Tambah Program
                        </strong>
                        <small>
                            Buat program baru
                        </small>
                    </span>
                </button>
            </header>

            {/* =========================================================
                MESSAGE
            ========================================================= */}
            {message.text && (
                <div
                    className={`program-alert ${
                        message.type ===
                        "error"
                            ? "program-alert-error"
                            : "program-alert-success"
                    }`}
                >
                    <div className="program-alert-icon">
                        <i
                            className={`bi ${
                                message.type ===
                                "error"
                                    ? "bi-exclamation-triangle"
                                    : "bi-check-circle"
                            }`}
                        ></i>
                    </div>
                    <div className="program-alert-content">
                        <strong>
                            {message.type ===
                            "error"
                                ? "Terjadi kendala"
                                : "Berhasil"}
                        </strong>
                        <span>
                            {message.text}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            setMessage({
                                type: "",
                                text: "",
                            })
                        }
                        aria-label="Tutup pemberitahuan"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}

            {/* =========================================================
                SUMMARY
            ========================================================= */}
            <section className="program-summary-grid">
                <article className="program-summary-card">
                    <div className="program-summary-icon">
                        <i className="bi bi-grid"></i>
                    </div>
                    <div>
                        <span>
                            TOTAL PROGRAM
                        </span>
                        <strong>
                            {programSummary.total}
                        </strong>
                        <small>
                            Program tersedia
                        </small>
                    </div>
                </article>
                <article className="program-summary-card">
                    <div className="program-summary-icon program-summary-icon-success">
                        <i className="bi bi-check2-circle"></i>
                    </div>
                    <div>
                        <span>
                            PROGRAM AKTIF
                        </span>
                        <strong>
                            {programSummary.active}
                        </strong>
                        <small>
                            Sedang ditawarkan
                        </small>
                    </div>
                </article>
                <article className="program-summary-card">
                    <div className="program-summary-icon program-summary-icon-warning">
                        <i className="bi bi-people"></i>
                    </div>
                    <div>
                        <span>
                            PROGRAM PENUH
                        </span>
                        <strong>
                            {programSummary.full}
                        </strong>
                        <small>
                            Kuota terpenuhi
                        </small>
                    </div>
                </article>
                <article className="program-summary-card">
                    <div className="program-summary-icon program-summary-icon-info">
                        <i className="bi bi-person-plus"></i>
                    </div>
                    <div>
                        <span>
                            TOTAL KUOTA
                        </span>
                        <strong>
                            {programSummary.totalCapacity}
                        </strong>
                        <small>
                            Kapasitas peserta
                        </small>
                    </div>
                </article>
            </section>

            {/* =========================================================
                PROGRAM DATABASE
            ========================================================= */}
            <section className="program-content-card">
                <div className="program-card-heading">
                    <div className="program-card-heading-left">
                        <div className="program-section-icon">
                            <i className="bi bi-journal-richtext"></i>
                        </div>
                        <div>
                            <span>
                                DATABASE PROGRAM
                            </span>
                            <h2>
                                Daftar Program
                            </h2>
                            <p>
                                Menampilkan{" "}
                                {orderedPrograms.length}{" "}
                                program sesuai urutan resmi FITALENTA.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="program-refresh-button"
                        onClick={
                            fetchPrograms
                        }
                        disabled={
                            loading
                        }
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm"></span>
                                Memuat
                            </>
                        ) : (
                            <>
                                <i className="bi bi-arrow-clockwise"></i>
                                Refresh
                            </>
                        )}
                    </button>
                </div>
                {error && (
                    <div className="program-error-message">
                        <div>
                            <i className="bi bi-exclamation-triangle"></i>
                        </div>
                        <span>
                            {error}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            aria-label="Tutup error"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                )}
                {orderedPrograms.length ===
                0 ? (
                    <div className="program-empty-state">
                        <div className="program-empty-icon">
                            <i className="bi bi-journal-plus"></i>
                        </div>
                        <h4>
                            Belum ada program
                        </h4>
                        <p>
                            Mulai dengan membuat program pertama untuk ditampilkan kepada peserta.
                        </p>
                        <button
                            type="button"
                            className="program-primary-button"
                            onClick={() =>
                                handleShowModal()
                            }
                        >
                            <i className="bi bi-plus-lg"></i>
                            Tambah Program
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="program-table-wrapper d-none d-lg-block">
                            <table className="program-table">
                                <thead>
                                <tr>
                                    <th>
                                        Program
                                    </th>
                                    <th>
                                        Kategori
                                    </th>
                                    <th>
                                        Durasi
                                    </th>
                                    <th>
                                        Kuota
                                    </th>
                                    <th>
                                        Biaya
                                    </th>
                                    <th>
                                        Status
                                    </th>
                                    <th className="text-center">
                                        Aksi
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {orderedPrograms.map(
                                    (
                                        program,
                                        programIndex
                                    ) => {
                                        const capacityData =
                                            getCapacityData(
                                                program
                                            );
                                        const hybrid =
                                            isHybridProgram(
                                                program
                                            );
                                        return (
                                            <tr
                                                key={
                                                    program.id
                                                }
                                            >
                                                <td>
                                                    <div className="program-table-program">
                                                        <div className="program-table-program-icon">
                                                            <i
                                                                className={`bi ${getCategoryIcon(
                                                                    program.category_name ||
                                                                    program.name
                                                                )}`}
                                                            ></i>
                                                        </div>
                                                        <div>
                                                            <small>
                                                                PROGRAM{" "}
                                                                {String(
                                                                    programIndex +
                                                                    1
                                                                ).padStart(
                                                                    2,
                                                                    "0"
                                                                )}
                                                            </small>
                                                            <strong>
                                                                {getCanonicalProgramName(
                                                                    program.name
                                                                )}
                                                            </strong>
                                                            <p>
                                                                {program.description ||
                                                                    "Tidak ada deskripsi program."}
                                                            </p>
                                                            {program.location && (
                                                                <span>
                                                                        <i className="bi bi-geo-alt"></i>
                                                                    {program.location}
                                                                    </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                        <span className="program-category-badge">
                                                            {program.category_name ||
                                                                "-"}
                                                        </span>
                                                </td>
                                                <td>
                                                    <div className="program-duration">
                                                        <i className="bi bi-clock"></i>
                                                        <span>
                                                                {program.duration ||
                                                                    "-"}
                                                            </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="program-capacity">
                                                        <div className="program-capacity-header">
                                                            <strong>
                                                                {capacityData.participants}{" "}
                                                                /{" "}
                                                                {capacityData.capacity}
                                                            </strong>
                                                            <span>
                                                                    {capacityData.percentage}%
                                                                </span>
                                                        </div>
                                                        <div className="program-capacity-track">
                                                            <div
                                                                className="program-capacity-bar"
                                                                style={{
                                                                    width: `${capacityData.percentage}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="program-cost">
                                                        <strong>
                                                            {formatCurrency(
                                                                program.training_cost
                                                            )}
                                                        </strong>
                                                        {hybrid &&
                                                            Number(
                                                                program.job_matching_cost ||
                                                                0
                                                            ) >
                                                            0 && (
                                                                <span>
                                                                        Job Matching:{" "}
                                                                    {formatCurrency(
                                                                        program.job_matching_cost
                                                                    )}
                                                                    </span>
                                                            )}
                                                        {Number(
                                                                program.down_payment ||
                                                                0
                                                            ) >
                                                            0 && (
                                                                <span>
                                                                    DP:{" "}
                                                                    {formatCurrency(
                                                                        program.down_payment
                                                                    )}
                                                                </span>
                                                            )}
                                                        <span>
                                                                {getInstallmentText(
                                                                    program.installment_plan
                                                                )}
                                                            </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {getStatusBadge(
                                                        program.status
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="program-action-group">
                                                        <button
                                                            type="button"
                                                            className="program-action-button"
                                                            onClick={() =>
                                                                handleShowModal(
                                                                    program
                                                                )
                                                            }
                                                            title="Edit Program"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="program-action-button program-action-delete"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    program.id
                                                                )
                                                            }
                                                            title="Hapus Program"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className="program-mobile-list d-lg-none">
                            {orderedPrograms.map(
                                (
                                    program,
                                    programIndex
                                ) => {
                                    const capacityData =
                                        getCapacityData(
                                            program
                                        );
                                    const hybrid =
                                        isHybridProgram(
                                            program
                                        );
                                    return (
                                        <article
                                            className="program-mobile-card"
                                            key={
                                                program.id
                                            }
                                        >
                                            <div className="program-mobile-card-header">
                                                <div className="program-mobile-program-heading">
                                                    <div className="program-table-program-icon">
                                                        <i
                                                            className={`bi ${getCategoryIcon(
                                                                program.category_name ||
                                                                program.name
                                                            )}`}
                                                        ></i>
                                                    </div>
                                                    <div>
                                                        <span>
                                                            PROGRAM{" "}
                                                            {String(
                                                                programIndex +
                                                                1
                                                            ).padStart(
                                                                2,
                                                                "0"
                                                            )}{" "}
                                                            •{" "}
                                                            {program.category_name ||
                                                                "-"}
                                                        </span>
                                                        <strong>
                                                            {getCanonicalProgramName(
                                                                program.name
                                                            )}
                                                        </strong>
                                                    </div>
                                                </div>
                                                {getStatusBadge(
                                                    program.status
                                                )}
                                            </div>
                                            <p className="program-mobile-description">
                                                {program.description ||
                                                    "Tidak ada deskripsi program."}
                                            </p>
                                            <div className="program-mobile-info-grid">
                                                <div>
                                                    <span>
                                                        Durasi
                                                    </span>
                                                    <strong>
                                                        {program.duration ||
                                                            "-"}
                                                    </strong>
                                                </div>
                                                <div>
                                                    <span>
                                                        Biaya Pelatihan
                                                    </span>
                                                    <strong>
                                                        {formatCurrency(
                                                            program.training_cost
                                                        )}
                                                    </strong>
                                                </div>
                                                {hybrid && (
                                                    <div>
                                                        <span>
                                                            Job Matching
                                                        </span>
                                                        <strong>
                                                            {formatCurrency(
                                                                program.job_matching_cost
                                                            )}
                                                        </strong>
                                                    </div>
                                                )}
                                                <div>
                                                    <span>
                                                        DP / Uang Muka
                                                    </span>
                                                    <strong>
                                                        {Number(
                                                            program.down_payment ||
                                                            0
                                                        ) >
                                                        0
                                                            ? formatCurrency(
                                                                program.down_payment
                                                            )
                                                            : "Tidak Ada"}
                                                    </strong>
                                                </div>
                                                <div>
                                                    <span>
                                                        Skema Pembayaran
                                                    </span>
                                                    <strong>
                                                        {getInstallmentText(
                                                            program.installment_plan
                                                        )}
                                                    </strong>
                                                </div>
                                                <div>
                                                    <span>
                                                        Lokasi
                                                    </span>
                                                    <strong>
                                                        {program.location ||
                                                            "-"}
                                                    </strong>
                                                </div>
                                            </div>
                                            <div className="program-mobile-capacity">
                                                <div>
                                                    <span>
                                                        Kuota
                                                    </span>
                                                    <strong>
                                                        {capacityData.participants}{" "}
                                                        /{" "}
                                                        {capacityData.capacity}{" "}
                                                        peserta
                                                    </strong>
                                                </div>
                                                <span>
                                                    {capacityData.percentage}%
                                                </span>
                                                <div className="program-capacity-track">
                                                    <div
                                                        className="program-capacity-bar"
                                                        style={{
                                                            width: `${capacityData.percentage}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="program-mobile-actions">
                                                <button
                                                    type="button"
                                                    className="program-mobile-edit"
                                                    onClick={() =>
                                                        handleShowModal(
                                                            program
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                    Edit Program
                                                </button>
                                                <button
                                                    type="button"
                                                    className="program-mobile-delete"
                                                    onClick={() =>
                                                        handleDelete(
                                                            program.id
                                                        )
                                                    }
                                                    aria-label="Hapus Program"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>
                        <div className="program-table-footer">
                            <div>
                                <i className="bi bi-database"></i>
                                <span>
                                    {orderedPrograms.length}{" "}
                                    program ditampilkan
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {/* =========================================================
                PROGRAM MODAL
            ========================================================= */}
            {showModal &&
                createPortal(
                    <div
                        className="program-modal-overlay"
                        onMouseDown={(event) => {
                            if (
                                event.target ===
                                event.currentTarget &&
                                !saving
                            ) {
                                handleCloseModal();
                            }
                        }}
                    >
                        <div
                            className="program-modal-dialog"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="program-modal-title"
                            onMouseDown={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <div className="program-modal-content">
                                <div className="program-modal-header">
                                    <div className="program-modal-heading">
                                        <div className="program-modal-heading-icon">
                                            <i
                                                className={`bi ${
                                                    editingProgram
                                                        ? "bi-pencil-square"
                                                        : "bi-journal-plus"
                                                }`}
                                            ></i>
                                        </div>
                                        <div>
                                            <span>
                                                {editingProgram
                                                    ? "PERBARUI PROGRAM"
                                                    : "PROGRAM BARU"}
                                            </span>
                                            <h2 id="program-modal-title">
                                                {editingProgram
                                                    ? "Edit Program"
                                                    : "Tambah Program"}
                                            </h2>
                                            <p>
                                                {editingProgram
                                                    ? "Perbarui informasi dan pengaturan program yang dipilih."
                                                    : "Lengkapi informasi program sebelum dipublikasikan kepada peserta."}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="program-modal-close"
                                        onClick={
                                            handleCloseModal
                                        }
                                        disabled={
                                            saving
                                        }
                                        aria-label="Tutup modal"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>

                                {/* =========================================================
                                    FORM
                                ========================================================= */}
                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                    className="program-modal-form"
                                >
                                    <div className="program-modal-body">
                                        <section className="program-form-section">
                                            <div className="program-form-section-heading">
                                                <div className="program-form-section-icon">
                                                    <i className="bi bi-info-circle"></i>
                                                </div>
                                                <div>
                                                    <span>
                                                        INFORMASI DASAR
                                                    </span>
                                                    <h3>
                                                        Identitas Program
                                                    </h3>
                                                    <p>
                                                        Gunakan nama program sesuai urutan resmi FITALENTA.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="program-form-grid program-form-grid-two">
                                                <div className="program-form-field">
                                                    <label>
                                                        Nama Program{" "}
                                                        <span>
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        name="name"
                                                        value={
                                                            formData.name
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            Pilih program
                                                        </option>
                                                        {PROGRAM_ORDER.map(
                                                            (
                                                                programName
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        programName
                                                                    }
                                                                    value={
                                                                        programName
                                                                    }
                                                                >
                                                                    {programName}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="program-form-field">
                                                    <label>
                                                        Kategori{" "}
                                                        <span>
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        name="category_id"
                                                        value={
                                                            formData.category_id
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            Pilih kategori
                                                        </option>
                                                        {orderedCategories.map(
                                                            (
                                                                category
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    value={
                                                                        category.id
                                                                    }
                                                                >
                                                                    {category.name}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="program-form-field">
                                                <label>
                                                    Deskripsi Program
                                                </label>
                                                <textarea
                                                    rows="4"
                                                    name="description"
                                                    value={
                                                        formData.description
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="Jelaskan tujuan, konsep, serta manfaat utama program..."
                                                />
                                            </div>
                                            <div className="program-form-field">
                                                <label>
                                                    Persyaratan Umum
                                                </label>
                                                <textarea
                                                    rows="4"
                                                    name="requirements"
                                                    value={
                                                        formData.requirements
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder={
                                                        "Pisahkan persyaratan dengan baris baru.\nContoh:\nMinimal lulusan SMK/sederajat\nSehat jasmani dan rohani\nKomitmen mengikuti program"
                                                    }
                                                />
                                                <small>
                                                    Digunakan sebagai persyaratan umum program.
                                                </small>
                                            </div>
                                        </section>

                                        {/* =========================================================
                                            OPERATIONAL
                                        ========================================================= */}
                                        <section className="program-form-section">
                                            <div className="program-form-section-heading">
                                                <div className="program-form-section-icon">
                                                    <i className="bi bi-calendar-week"></i>
                                                </div>
                                                <div>
                                                    <span>
                                                        OPERASIONAL PROGRAM
                                                    </span>
                                                    <h3>
                                                        Pelaksanaan Program
                                                    </h3>
                                                    <p>
                                                        Atur jadwal, durasi, lokasi, kuota dan status program.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="program-form-grid program-form-grid-two">
                                                <div className="program-form-field">
                                                    <label>
                                                        Jadwal
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="schedule"
                                                        value={
                                                            formData.schedule
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Contoh: Senin-Jumat (Full Day)"
                                                    />
                                                </div>
                                                <div className="program-form-field">
                                                    <label>
                                                        Durasi
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="duration"
                                                        value={
                                                            formData.duration
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Contoh: 6 bulan"
                                                    />
                                                </div>
                                            </div>
                                            <div className="program-form-grid program-form-grid-two">
                                                <div className="program-form-field">
                                                    <label>
                                                        Kuota Peserta
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        name="capacity"
                                                        value={
                                                            formData.capacity
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Contoh: 20"
                                                    />
                                                </div>
                                                <div className="program-form-field">
                                                    <label>
                                                        Status
                                                    </label>
                                                    <select
                                                        name="status"
                                                        value={
                                                            formData.status
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    >
                                                        <option value="active">
                                                            Aktif
                                                        </option>
                                                        <option value="inactive">
                                                            Tidak Aktif
                                                        </option>
                                                        <option value="full">
                                                            Penuh
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="program-form-grid program-form-grid-two">
                                                <div className="program-form-field">
                                                    <label>
                                                        Lokasi
                                                    </label>
                                                    <div className="program-input-with-icon">
                                                        <i className="bi bi-geo-alt"></i>
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            value={
                                                                formData.location
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            placeholder="Lokasi pelaksanaan program"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="program-form-field">
                                                    <label>
                                                        Rencana Cicilan
                                                    </label>
                                                    <select
                                                        name="installment_plan"
                                                        value={
                                                            formData.installment_plan
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    >
                                                        {INSTALLMENT_OPTIONS.map(
                                                            (
                                                                option
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    {option.label}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    <small>
                                                        Cicilan dan DP diatur secara terpisah.
                                                    </small>
                                                </div>
                                            </div>
                                        </section>

                                        {/* =========================================================
                                            FINANCIAL INFORMATION
                                        ========================================================= */}
                                        <section className="program-form-section">
                                            <div className="program-form-section-heading">
                                                <div className="program-form-section-icon">
                                                    <i className="bi bi-wallet2"></i>
                                                </div>
                                                <div>
                                                    <span>
                                                        INFORMASI BIAYA
                                                    </span>
                                                    <h3>
                                                        Biaya & Pendanaan
                                                    </h3>
                                                    <p>
                                                        Atur biaya pelatihan, biaya keberangkatan, DP, dan fasilitas pendanaan.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="program-form-grid program-form-grid-two">
                                                <div className="program-form-field">
                                                    <label>
                                                        Biaya Pelatihan
                                                    </label>
                                                    <div className="program-currency-input">
                                                        <span>
                                                            Rp
                                                        </span>
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            value={formatCurrencyInput(
                                                                formData.training_cost
                                                            )}
                                                            onChange={(event) =>
                                                                handleCurrencyChange(
                                                                    "training_cost",
                                                                    event.target.value
                                                                )
                                                            }
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <small>
                                                        Contoh: 7.150.000
                                                    </small>
                                                </div>
                                                <div className="program-form-field">
                                                    <label>
                                                        Biaya Keberangkatan
                                                    </label>
                                                    <div className="program-currency-input">
                                                        <span>
                                                            Rp
                                                        </span>
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            value={formatCurrencyInput(
                                                                formData.departure_cost
                                                            )}
                                                            onChange={(event) =>
                                                                handleCurrencyChange(
                                                                    "departure_cost",
                                                                    event.target.value
                                                                )
                                                            }
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <small>
                                                        Contoh: 30.000.000
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="program-form-field">
                                                <label>
                                                    DP / Uang Muka
                                                </label>
                                                <div className="program-currency-input">
                                                    <span>
                                                        Rp
                                                    </span>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={formatCurrencyInput(
                                                            formData.down_payment
                                                        )}
                                                        onChange={(event) =>
                                                            handleCurrencyChange(
                                                                "down_payment",
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <small>
                                                    Opsional. Isi nominal DP sesuai kebijakan program. DP dapat digunakan bersamaan dengan skema cicilan. Kosongkan jika tidak menggunakan DP.
                                                </small>
                                            </div>
                                            {isHybridForm && (
                                                <div className="program-form-field">
                                                    <label>
                                                        Biaya Pendampingan Job Matching
                                                    </label>
                                                    <div className="program-currency-input">
                                                        <span>
                                                            Rp
                                                        </span>
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            value={formatCurrencyInput(
                                                                formData.job_matching_cost
                                                            )}
                                                            onChange={(event) =>
                                                                handleCurrencyChange(
                                                                    "job_matching_cost",
                                                                    event.target.value
                                                                )
                                                            }
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <small>
                                                        Biaya pendampingan Job Matching hanya tersedia untuk Program Hybrid.
                                                    </small>
                                                </div>
                                            )}
                                            <div className="program-form-field">
                                                <label>
                                                    Dana Talang
                                                </label>
                                                <input
                                                    type="text"
                                                    name="bridge_fund"
                                                    value={
                                                        formData.bridge_fund
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="Informasi fasilitas dana talang"
                                                />
                                            </div>
                                            <div className="program-form-field">
                                                <label>
                                                    Info Kontak
                                                </label>
                                                <textarea
                                                    rows="3"
                                                    name="contact_info"
                                                    value={
                                                        formData.contact_info
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder={
                                                        "Email: ...\nTelp: ...\nAlamat: ..."
                                                    }
                                                />
                                                <small>
                                                    Kontak yang dapat dihubungi peserta untuk informasi lebih lanjut.
                                                </small>
                                            </div>
                                        </section>

                                        {/* =========================================================
                                            PROGRAM DETAILS
                                        ========================================================= */}
                                        <section className="program-form-section">
                                            <div className="program-form-section-heading">
                                                <div className="program-form-section-icon">
                                                    <i className="bi bi-list-check"></i>
                                                </div>
                                                <div>
                                                    <span>
                                                        INFORMASI DETAIL
                                                    </span>
                                                    <h3>
                                                        Rincian Program
                                                    </h3>
                                                    <p>
                                                        Informasi tambahan yang digunakan pada detail program.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="program-form-field">
                                                <label>
                                                    Timeline Program
                                                </label>
                                                <textarea
                                                    rows="5"
                                                    name="timeline_text"
                                                    value={
                                                        formData.timeline_text
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder={
                                                        "Pisahkan setiap fase dengan baris baru.\nContoh:\nBulan 1: Pelatihan Dasar\nBulan 2: Pelatihan Lanjutan\nBulan 3: Persiapan Keberangkatan"
                                                    }
                                                />
                                                <small>
                                                    Pisahkan setiap fase program menggunakan baris baru.
                                                </small>
                                            </div>
                                            <div className="program-form-grid program-form-grid-two program-form-grid-top">
                                                <div className="program-form-field">
                                                    <label>
                                                        Detail Biaya Pelatihan
                                                    </label>
                                                    <textarea
                                                        rows="6"
                                                        name="training_fee_details"
                                                        value={
                                                            formData.training_fee_details
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder={
                                                            isHybridForm
                                                                ? "Contoh:\nBiaya administrasi\nModul pembelajaran\nPelatihan bahasa\nPendampingan program"
                                                                : "Contoh:\nBiaya administrasi\nModul pembelajaran\nSeragam\nAsrama"
                                                        }
                                                    />
                                                    <small>
                                                        Rincian item yang termasuk biaya pelatihan.
                                                    </small>
                                                </div>
                                                <div className="program-form-field">
                                                    <label>
                                                        Detail Biaya Keberangkatan
                                                    </label>
                                                    <textarea
                                                        rows="6"
                                                        name="departure_fee_details"
                                                        value={
                                                            formData.departure_fee_details
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder={
                                                            "Pisahkan setiap item dengan baris baru.\nContoh:\nTiket pesawat\nVisa & dokumen\nAsuransi\nBiaya penempatan"
                                                        }
                                                    />
                                                    <small>
                                                        Rincian item yang termasuk biaya keberangkatan.
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="program-form-field">
                                                <label>
                                                    Daftar Persyaratan Peserta
                                                </label>
                                                <textarea
                                                    rows="5"
                                                    name="requirements_text"
                                                    value={
                                                        formData.requirements_text
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder={
                                                        "Pisahkan setiap persyaratan dengan baris baru.\nContoh:\nUsia minimal 18 tahun\nPendidikan minimal SMA\nSehat jasmani dan rohani"
                                                    }
                                                />
                                                <small>
                                                    Digunakan pada tampilan detail persyaratan peserta.
                                                </small>
                                            </div>
                                        </section>
                                    </div>

                                    {/* =========================================================
                                        MODAL FOOTER
                                    ========================================================= */}
                                    <div className="program-modal-footer">
                                        <button
                                            type="button"
                                            className="program-secondary-button"
                                            onClick={
                                                handleCloseModal
                                            }
                                            disabled={
                                                saving
                                            }
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="program-primary-button"
                                            disabled={
                                                saving
                                            }
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check2-circle"></i>
                                                    {editingProgram
                                                        ? "Simpan Perubahan"
                                                        : "Simpan Program"}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default ProgramManagement;