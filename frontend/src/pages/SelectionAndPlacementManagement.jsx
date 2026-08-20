import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   SELECTION & PLACEMENT MANAGEMENT
========================================================= */

const SelectionAndPlacementManagement = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        selection_status: "all",
        placement_status: "all",
        search: "",
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [formData, setFormData] = useState({
        selection_status: "",
        selection_notes: "",
        placement_status: "",
        company_name: "",
        placement_date: "",
        placement_notes: "",
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    /* ---------------------------------------------------------
       FETCH REGISTRATIONS
    --------------------------------------------------------- */
    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            setError("");
            const params = new URLSearchParams();

            if (filters.selection_status !== "all") {
                params.append(
                    "selection_status",
                    filters.selection_status
                );
            }

            if (filters.placement_status !== "all") {
                params.append(
                    "placement_status",
                    filters.placement_status
                );
            }

            if (filters.search) {
                params.append("search", filters.search);
            }

            const response = await axios.get(
                `/api/registrations?${params.toString()}`
            );

            if (response.data?.success) {
                setRegistrations(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );
            } else {
                setError("Gagal memuat data registrasi");
            }
        } catch (error) {
            console.error(
                "Error fetching registrations:",
                error
            );
            setError(
                error.response?.data?.message ||
                "Gagal memuat data peserta"
            );
        } finally {
            setLoading(false);
        }
    };

    /* ---------------------------------------------------------
       EFFECT
    --------------------------------------------------------- */
    useEffect(() => {
        fetchRegistrations();
    }, [
        filters.selection_status,
        filters.placement_status,
        filters.search,
    ]);

    /* =========================================================
       FILTER
    ========================================================= */

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    /* ---------------------------------------------------------
       RESET FILTER
    --------------------------------------------------------- */
    const handleResetFilters = () => {
        setFilters({
            selection_status: "all",
            placement_status: "all",
            search: "",
        });
    };

    const hasActiveFilters =
        filters.selection_status !== "all" ||
        filters.placement_status !== "all" ||
        filters.search !== "";

    /* =========================================================
       EDIT MODAL
    ========================================================= */

    const handleEdit = (registration) => {
        setSelectedRegistration(registration);
        setFormData({
            selection_status:
                registration.selection_status || "menunggu",
            selection_notes:
                registration.selection_notes || "",
            placement_status:
                registration.placement_status || "proses",
            company_name:
                registration.company_name || "",
            placement_date:
                registration.placement_date
                    ? new Date(
                        registration.placement_date
                    )
                        .toISOString()
                        .split("T")[0]
                    : "",
            placement_notes:
                registration.placement_notes || "",
        });
        setShowEditModal(true);
    };

    /* ---------------------------------------------------------
       CLOSE MODAL
    --------------------------------------------------------- */
    const handleCloseModal = () => {
        if (saving) return;

        setShowEditModal(false);
        setSelectedRegistration(null);
        setFormData({
            selection_status: "",
            selection_notes: "",
            placement_status: "",
            company_name: "",
            placement_date: "",
            placement_notes: "",
        });
    };

    /* ---------------------------------------------------------
       SUBMIT UPDATE
    --------------------------------------------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedRegistration) return;

        setSaving(true);

        try {
            if (
                formData.selection_status &&
                formData.selection_status !==
                selectedRegistration.selection_status
            ) {
                await axios.put(
                    `/api/selection/${selectedRegistration.id}`,
                    {
                        status: formData.selection_status,
                        notes: formData.selection_notes,
                        evaluated_by: user?.id,
                    }
                );
            }

            if (
                formData.placement_status &&
                formData.placement_status !==
                selectedRegistration.placement_status
            ) {
                await axios.put(
                    `/api/placement/${selectedRegistration.id}`,
                    {
                        status: formData.placement_status,
                        company_name: formData.company_name,
                        placement_date:
                            formData.placement_date || null,
                        notes: formData.placement_notes,
                    }
                );
            }

            setMessage({
                type: "success",
                text: "Status seleksi dan penyaluran berhasil diperbarui.",
            });

            setShowEditModal(false);
            setSelectedRegistration(null);

            await fetchRegistrations();
        } catch (error) {
            console.error(
                "Error updating status:",
                error
            );

            setMessage({
                type: "error",
                text:
                    "Gagal memperbarui status: " +
                    (error.response?.data?.message ||
                        error.message),
            });
        } finally {
            setSaving(false);
        }
    };

    /* =========================================================
       STATUS UTILITIES
    ========================================================= */

    const getSelectionStatusBadge = (status) => {
        const statusConfig = {
            menunggu: {
                tone: "warning",
                icon: "bi-clock",
                text: "Menunggu",
            },
            lolos: {
                tone: "success",
                icon: "bi-check-circle",
                text: "Lolos",
            },
            tidak_lolos: {
                tone: "danger",
                icon: "bi-x-circle",
                text: "Tidak Lolos",
            },
        };

        const config = statusConfig[status] || {
            tone: "neutral",
            icon: "bi-dash-circle",
            text: status || "Belum Ditentukan",
        };

        return (
            <span
                className={`selection-status-badge selection-status-${config.tone}`}
            >
                <i
                    className={`bi ${config.icon}`}
                    aria-hidden="true"
                ></i>
                {config.text}
            </span>
        );
    };

    /* ---------------------------------------------------------
       PLACEMENT BADGE
    --------------------------------------------------------- */
    const getPlacementStatusBadge = (status) => {
        const statusConfig = {
            proses: {
                tone: "info",
                icon: "bi-arrow-repeat",
                text: "Proses",
            },
            lolos: {
                tone: "success",
                icon: "bi-check-circle",
                text: "Lolos",
            },
            ditempatkan: {
                tone: "primary",
                icon: "bi-building-check",
                text: "Ditempatkan",
            },
        };

        const config = statusConfig[status] || {
            tone: "neutral",
            icon: "bi-dash-circle",
            text: status || "Belum Ditentukan",
        };

        return (
            <span
                className={`selection-status-badge selection-status-${config.tone}`}
            >
                <i
                    className={`bi ${config.icon}`}
                    aria-hidden="true"
                ></i>
                {config.text}
            </span>
        );
    };

    /* ---------------------------------------------------------
       FORMAT DATE
    --------------------------------------------------------- */
    const formatDate = (dateString) => {
        if (!dateString) return "-";

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    /* =========================================================
       STATISTICS
    ========================================================= */

    const statistics = useMemo(() => {
        const total = registrations.length;

        const waitingSelection = registrations.filter(
            (item) =>
                !item.selection_status ||
                item.selection_status === "menunggu"
        ).length;

        const passedSelection = registrations.filter(
            (item) =>
                item.selection_status === "lolos"
        ).length;

        const placed = registrations.filter(
            (item) =>
                item.placement_status === "ditempatkan"
        ).length;

        return {
            total,
            waitingSelection,
            passedSelection,
            placed,
        };
    }, [registrations]);

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading && registrations.length === 0) {
        return (
            <div className="selection-placement-page">
                <div className="selection-loading-state">
                    <div className="selection-loading-icon">
                        <span
                            className="spinner-border"
                            role="status"
                        ></span>
                    </div>
                    <h4>Memuat data peserta</h4>
                    <p>
                        Data seleksi dan penyaluran sedang
                        dipersiapkan.
                    </p>
                </div>
            </div>
        );
    }

    /* =========================================================
       MAIN RENDER
    ========================================================= */

    return (
        <div className="selection-placement-page">
            {/* ---------------------------------------------------------
                PAGE HEADER
            --------------------------------------------------------- */}
            <div className="selection-page-header">
                <div>
                    <div className="selection-page-eyebrow">
                        <span>
                            <i className="bi bi-clipboard-check"></i>
                        </span>
                        MANAJEMEN PESERTA
                    </div>
                    <h1>Manajemen Seleksi & Penyaluran</h1>
                    <p>
                        Kelola proses seleksi, kelulusan,
                        penempatan, dan status penyaluran peserta.
                    </p>
                </div>

                <button
                    type="button"
                    className="selection-header-action"
                    onClick={fetchRegistrations}
                    disabled={loading}
                >
                    <i
                        className={`bi ${
                            loading
                                ? "bi-arrow-repeat"
                                : "bi-arrow-clockwise"
                        }`}
                    ></i>
                    <span>
                        <strong>Refresh Data</strong>
                        <small>Perbarui daftar peserta</small>
                    </span>
                </button>
            </div>

            {/* ---------------------------------------------------------
                MESSAGE
            --------------------------------------------------------- */}
            {message.text && (
                <div
                    className={`selection-message selection-message-${message.type}`}
                >
                    <i
                        className={`bi ${
                            message.type === "error"
                                ? "bi-exclamation-circle"
                                : "bi-check-circle"
                        }`}
                    ></i>
                    <div>
                        <strong>
                            {message.type === "error"
                                ? "Terjadi Kesalahan"
                                : "Berhasil"}
                        </strong>
                        <span>{message.text}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            setMessage({
                                type: "",
                                text: "",
                            })
                        }
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}

            {/* =========================================================
                STATISTICS
            ========================================================= */}
            <div className="selection-stats-grid">
                <div className="selection-stat-card">
                    <div className="selection-stat-icon selection-stat-icon-primary">
                        <i className="bi bi-people"></i>
                    </div>
                    <div>
                        <span>Total Peserta</span>
                        <strong>{statistics.total}</strong>
                        <small>
                            Peserta pada data aktif
                        </small>
                    </div>
                </div>

                <div className="selection-stat-card">
                    <div className="selection-stat-icon selection-stat-icon-warning">
                        <i className="bi bi-hourglass-split"></i>
                    </div>
                    <div>
                        <span>Menunggu Seleksi</span>
                        <strong>
                            {statistics.waitingSelection}
                        </strong>
                        <small>
                            Belum memperoleh keputusan
                        </small>
                    </div>
                </div>

                <div className="selection-stat-card">
                    <div className="selection-stat-icon selection-stat-icon-success">
                        <i className="bi bi-patch-check"></i>
                    </div>
                    <div>
                        <span>Lolos Seleksi</span>
                        <strong>
                            {statistics.passedSelection}
                        </strong>
                        <small>
                            Peserta dinyatakan lolos
                        </small>
                    </div>
                </div>

                <div className="selection-stat-card">
                    <div className="selection-stat-icon selection-stat-icon-info">
                        <i className="bi bi-building-check"></i>
                    </div>
                    <div>
                        <span>Sudah Ditempatkan</span>
                        <strong>{statistics.placed}</strong>
                        <small>
                            Peserta telah ditempatkan
                        </small>
                    </div>
                </div>
            </div>

            {/* =========================================================
                FILTER
            ========================================================= */}
            <section className="selection-content-card selection-filter-card">
                <div className="selection-card-heading">
                    <div className="selection-card-heading-main">
                        <div className="selection-section-icon">
                            <i className="bi bi-funnel"></i>
                        </div>
                        <div>
                            <span>FILTER DATA</span>
                            <h2>Filter & Pencarian</h2>
                            <p>
                                Temukan peserta berdasarkan status
                                seleksi, penyaluran, atau nama.
                            </p>
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="selection-reset-button"
                            onClick={handleResetFilters}
                        >
                            <i className="bi bi-arrow-counterclockwise"></i>
                            Reset Filter
                        </button>
                    )}
                </div>

                <div className="selection-filter-body">
                    <div className="selection-filter-field">
                        <label>Status Seleksi Diklat</label>
                        <select
                            value={
                                filters.selection_status
                            }
                            onChange={(e) =>
                                handleFilterChange(
                                    "selection_status",
                                    e.target.value
                                )
                            }
                        >
                            <option value="all">
                                Semua Status Seleksi
                            </option>
                            <option value="menunggu">
                                Menunggu
                            </option>
                            <option value="lolos">
                                Lolos
                            </option>
                            <option value="tidak_lolos">
                                Tidak Lolos
                            </option>
                        </select>
                    </div>

                    <div className="selection-filter-field">
                        <label>Status Penyaluran</label>
                        <select
                            value={
                                filters.placement_status
                            }
                            onChange={(e) =>
                                handleFilterChange(
                                    "placement_status",
                                    e.target.value
                                )
                            }
                        >
                            <option value="all">
                                Semua Status Penyaluran
                            </option>
                            <option value="proses">
                                Proses
                            </option>
                            <option value="lolos">
                                Lolos
                            </option>
                            <option value="ditempatkan">
                                Ditempatkan
                            </option>
                        </select>
                    </div>

                    <div className="selection-filter-field selection-search-field">
                        <label>Pencarian</label>
                        <div className="selection-search-input">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                placeholder="Cari nama peserta..."
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "search",
                                        e.target.value
                                    )
                                }
                            />
                            {filters.search && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleFilterChange(
                                            "search",
                                            ""
                                        )
                                    }
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                PARTICIPANT DATABASE
            ========================================================= */}
            <section className="selection-content-card selection-database-card">
                <div className="selection-card-heading">
                    <div className="selection-card-heading-main">
                        <div className="selection-section-icon">
                            <i className="bi bi-person-lines-fill"></i>
                        </div>
                        <div>
                            <span>DATABASE PESERTA</span>
                            <h2>Daftar Peserta</h2>
                            <p>
                                Menampilkan{" "}
                                {registrations.length} peserta
                                berdasarkan filter aktif.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="selection-refresh-button"
                        onClick={fetchRegistrations}
                        disabled={loading}
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="selection-error-box">
                        <i className="bi bi-exclamation-triangle"></i>
                        <div>
                            <strong>
                                Gagal memuat data
                            </strong>
                            <span>{error}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setError("")}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                )}

                {registrations.length === 0 ? (
                    <div className="selection-empty-state">
                        <div>
                            <i className="bi bi-people"></i>
                        </div>
                        <h3>Tidak ada data peserta</h3>
                        <p>
                            {hasActiveFilters
                                ? "Tidak ada peserta yang sesuai dengan filter yang digunakan."
                                : "Belum ada peserta yang terdaftar."}
                        </p>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                className="selection-secondary-button"
                                onClick={handleResetFilters}
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* ---------------------------------------------------------
                            DESKTOP TABLE
                        --------------------------------------------------------- */}
                        <div className="selection-table-wrapper">
                            <table className="selection-table">
                                <thead>
                                <tr>
                                    <th>Peserta</th>
                                    <th>Program</th>
                                    <th>
                                        Seleksi Diklat
                                    </th>
                                    <th>
                                        Penyaluran Kerja
                                    </th>
                                    <th>Perusahaan</th>
                                    <th>
                                        Penempatan
                                    </th>
                                    <th>Aksi</th>
                                </tr>
                                </thead>
                                <tbody>
                                {registrations.map(
                                    (registration) => (
                                        <tr
                                            key={
                                                registration.id
                                            }
                                        >
                                            <td>
                                                <div className="selection-participant">
                                                    <div className="selection-participant-avatar">
                                                        {registration.full_name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                .toUpperCase() ||
                                                            "P"}
                                                    </div>
                                                    <div>
                                                        <strong>
                                                            {
                                                                registration.full_name
                                                            }
                                                        </strong>
                                                        <span>
                                                                {
                                                                    registration.email
                                                                }
                                                            </span>
                                                        <small>
                                                            {
                                                                registration.registration_code
                                                            }
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="selection-program-info">
                                                    <strong>
                                                        {
                                                            registration.program_name
                                                        }
                                                    </strong>
                                                    <span>
                                                            <i className="bi bi-clock"></i>
                                                        {registration.program_duration ||
                                                            "-"}
                                                        </span>
                                                </div>
                                            </td>
                                            <td>
                                                {getSelectionStatusBadge(
                                                    registration.selection_status
                                                )}
                                                {registration.selection_notes && (
                                                    <small className="selection-table-note">
                                                        {
                                                            registration.selection_notes
                                                        }
                                                    </small>
                                                )}
                                            </td>
                                            <td>
                                                {getPlacementStatusBadge(
                                                    registration.placement_status
                                                )}
                                                {registration.placement_notes && (
                                                    <small className="selection-table-note">
                                                        {
                                                            registration.placement_notes
                                                        }
                                                    </small>
                                                )}
                                            </td>
                                            <td>
                                                {registration.company_name ? (
                                                    <div className="selection-company">
                                                        <i className="bi bi-building"></i>
                                                        <strong>
                                                            {
                                                                registration.company_name
                                                            }
                                                        </strong>
                                                    </div>
                                                ) : (
                                                    <span className="selection-empty-value">
                                                            Belum
                                                            ditentukan
                                                        </span>
                                                )}
                                            </td>
                                            <td>
                                                {registration.placement_date ? (
                                                    <div className="selection-date">
                                                        <i className="bi bi-calendar3"></i>
                                                        <span>
                                                                {formatDate(
                                                                    registration.placement_date
                                                                )}
                                                            </span>
                                                    </div>
                                                ) : (
                                                    <span className="selection-empty-value">
                                                            -
                                                        </span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="selection-action-button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            registration
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                    <span>
                                                            Kelola
                                                        </span>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                                </tbody>
                            </table>
                        </div>

                        <div className="selection-table-footer">
                            <div>
                                <i className="bi bi-database"></i>
                                {registrations.length} peserta
                                ditampilkan
                            </div>
                            {hasActiveFilters && (
                                <span>
                                    Berdasarkan filter aktif
                                </span>
                            )}
                        </div>
                    </>
                )}
            </section>

            {/* =========================================================
                EDIT MODAL
            ========================================================= */}
            {showEditModal &&
                selectedRegistration && (
                    <div
                        className="selection-modal-overlay"
                        onClick={handleCloseModal}
                    >
                        <div
                            className="selection-modal-dialog"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >
                            <div className="selection-modal">
                                {/* ---------------------------------------------------------
                                    MODAL HEADER
                                --------------------------------------------------------- */}
                                <div className="selection-modal-header">
                                    <div className="selection-modal-heading">
                                        <div className="selection-modal-icon">
                                            <i className="bi bi-person-gear"></i>
                                        </div>
                                        <div>
                                            <span>
                                                KELOLA PESERTA
                                            </span>
                                            <h3>
                                                Update Status
                                                Peserta
                                            </h3>
                                            <p>
                                                Perbarui status
                                                seleksi dan
                                                penyaluran peserta.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="selection-modal-close"
                                        onClick={
                                            handleCloseModal
                                        }
                                        disabled={saving}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>

                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                >
                                    <div className="selection-modal-body">
                                        {/* ---------------------------------------------------------
                                            PARTICIPANT SUMMARY
                                        --------------------------------------------------------- */}
                                        <div className="selection-modal-summary">
                                            <div className="selection-modal-summary-avatar">
                                                {selectedRegistration.full_name
                                                        ?.charAt(
                                                            0
                                                        )
                                                        .toUpperCase() ||
                                                    "P"}
                                            </div>
                                            <div>
                                                <span>
                                                    PESERTA
                                                </span>
                                                <strong>
                                                    {
                                                        selectedRegistration.full_name
                                                    }
                                                </strong>
                                                <small>
                                                    {
                                                        selectedRegistration.registration_code
                                                    }{" "}
                                                    ·{" "}
                                                    {
                                                        selectedRegistration.program_name
                                                    }
                                                </small>
                                            </div>
                                        </div>

                                        {/* ---------------------------------------------------------
                                            STATUS CURRENT
                                        --------------------------------------------------------- */}
                                        <div className="selection-current-status-grid">
                                            <div>
                                                <span>
                                                    STATUS
                                                    SELEKSI SAAT
                                                    INI
                                                </span>
                                                {getSelectionStatusBadge(
                                                    selectedRegistration.selection_status
                                                )}
                                            </div>
                                            <div>
                                                <span>
                                                    STATUS
                                                    PENYALURAN
                                                    SAAT INI
                                                </span>
                                                {getPlacementStatusBadge(
                                                    selectedRegistration.placement_status
                                                )}
                                            </div>
                                        </div>

                                        {/* ---------------------------------------------------------
                                            FORM GRID
                                        --------------------------------------------------------- */}
                                        <div className="selection-modal-form-grid">
                                            <section className="selection-form-section">
                                                <div className="selection-form-section-heading">
                                                    <div>
                                                        <i className="bi bi-clipboard-check"></i>
                                                    </div>
                                                    <span>
                                                        <small>
                                                            SELEKSI
                                                            DIKLAT
                                                        </small>
                                                        <strong>
                                                            Status
                                                            Seleksi
                                                        </strong>
                                                    </span>
                                                </div>

                                                <div className="selection-form-field">
                                                    <label>
                                                        Status
                                                        Seleksi *
                                                    </label>
                                                    <select
                                                        value={
                                                            formData.selection_status
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setFormData(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    selection_status:
                                                                    e
                                                                        .target
                                                                        .value,
                                                                })
                                                            )
                                                        }
                                                        required
                                                    >
                                                        <option value="menunggu">
                                                            Menunggu
                                                        </option>
                                                        <option value="lolos">
                                                            Lolos
                                                        </option>
                                                        <option value="tidak_lolos">
                                                            Tidak
                                                            Lolos
                                                        </option>
                                                    </select>
                                                </div>

                                                <div className="selection-form-field">
                                                    <label>
                                                        Catatan
                                                        Seleksi
                                                    </label>
                                                    <textarea
                                                        rows="5"
                                                        value={
                                                            formData.selection_notes
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setFormData(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    selection_notes:
                                                                    e
                                                                        .target
                                                                        .value,
                                                                })
                                                            )
                                                        }
                                                        placeholder="Tambahkan catatan seleksi..."
                                                    />
                                                </div>
                                            </section>

                                            <section className="selection-form-section">
                                                <div className="selection-form-section-heading">
                                                    <div>
                                                        <i className="bi bi-building"></i>
                                                    </div>
                                                    <span>
                                                        <small>
                                                            PENYALURAN
                                                            KERJA
                                                        </small>
                                                        <strong>
                                                            Informasi
                                                            Penempatan
                                                        </strong>
                                                    </span>
                                                </div>

                                                <div className="selection-form-field">
                                                    <label>
                                                        Status
                                                        Penyaluran
                                                        *
                                                    </label>
                                                    <select
                                                        value={
                                                            formData.placement_status
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setFormData(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    placement_status:
                                                                    e
                                                                        .target
                                                                        .value,
                                                                })
                                                            )
                                                        }
                                                        required
                                                    >
                                                        <option value="proses">
                                                            Proses
                                                        </option>
                                                        <option value="lolos">
                                                            Lolos
                                                        </option>
                                                        <option value="ditempatkan">
                                                            Ditempatkan
                                                        </option>
                                                    </select>
                                                </div>

                                                <div className="selection-form-field">
                                                    <label>
                                                        Nama
                                                        Perusahaan /
                                                        Instansi
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            formData.company_name
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setFormData(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    company_name:
                                                                    e
                                                                        .target
                                                                        .value,
                                                                })
                                                            )
                                                        }
                                                        placeholder="Masukkan nama perusahaan..."
                                                    />
                                                </div>

                                                <div className="selection-form-field">
                                                    <label>
                                                        Tanggal
                                                        Penempatan
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={
                                                            formData.placement_date
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setFormData(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    placement_date:
                                                                    e
                                                                        .target
                                                                        .value,
                                                                })
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="selection-form-field">
                                                    <label>
                                                        Catatan
                                                        Penyaluran
                                                    </label>
                                                    <textarea
                                                        rows="4"
                                                        value={
                                                            formData.placement_notes
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setFormData(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    placement_notes:
                                                                    e
                                                                        .target
                                                                        .value,
                                                                })
                                                            )
                                                        }
                                                        placeholder="Tambahkan catatan penyaluran..."
                                                    />
                                                </div>
                                            </section>
                                        </div>

                                        {/* ---------------------------------------------------------
                                            CONDITIONAL NOTICE
                                        --------------------------------------------------------- */}
                                        {formData.placement_status ===
                                            "ditempatkan" && (
                                                <div className="selection-notice selection-notice-info">
                                                    <i className="bi bi-info-circle"></i>
                                                    <div>
                                                        <strong>
                                                            Status
                                                            Ditempatkan
                                                        </strong>
                                                        <span>
                                                        Pastikan
                                                        nama
                                                        perusahaan
                                                        dan tanggal
                                                        penempatan
                                                        telah diisi.
                                                    </span>
                                                    </div>
                                                </div>
                                            )}

                                        {formData.selection_status ===
                                            "tidak_lolos" && (
                                                <div className="selection-notice selection-notice-warning">
                                                    <i className="bi bi-exclamation-triangle"></i>
                                                    <div>
                                                        <strong>
                                                            Status Tidak
                                                            Lolos
                                                        </strong>
                                                        <span>
                                                        Disarankan
                                                        memberikan
                                                        catatan
                                                        alasan
                                                        ketidaklolosan.
                                                    </span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>

                                    {/* ---------------------------------------------------------
                                        MODAL FOOTER
                                    --------------------------------------------------------- */}
                                    <div className="selection-modal-footer">
                                        <button
                                            type="button"
                                            className="selection-secondary-button"
                                            onClick={
                                                handleCloseModal
                                            }
                                            disabled={saving}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="selection-primary-button"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check2-circle"></i>
                                                    Simpan
                                                    Perubahan
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default SelectionAndPlacementManagement;