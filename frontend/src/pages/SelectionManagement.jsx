import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   SELECTION MANAGEMENT
========================================================= */

const SelectionManagement = () => {
    const [selections, setSelections] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        program: "all",
        status: "all",
        search: "",
    });
    const [selectedCandidate, setSelectedCandidate] =
        useState(null);
    const [showEvaluationModal, setShowEvaluationModal] =
        useState(false);
    const [showBulkModal, setShowBulkModal] =
        useState(false);
    const [stats, setStats] = useState(null);
    const [evaluationData, setEvaluationData] =
        useState({
            status: "menunggu",
            test_score: "",
            interview_score: "",
            final_score: "",
            notes: "",
        });
    const [bulkData, setBulkData] = useState({
        status: "lolos",
        notes: "",
    });
    const [selectedCandidates, setSelectedCandidates] =
        useState([]);
    const { user } = useAuth();

    /* =========================================================
       DATA FETCHING
    ========================================================= */

    const fetchSelections = async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            Object.keys(filters).forEach((key) => {
                if (
                    filters[key] !== "all" &&
                    filters[key] !== ""
                ) {
                    params.append(key, filters[key]);
                }
            });

            const response = await axios.get(
                `/api/selection?${params.toString()}`
            );

            if (response.data?.success) {
                setSelections(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );
            } else {
                setError(
                    "Gagal memuat data seleksi peserta."
                );
            }
        } catch (error) {
            console.error(
                "Error fetching selections:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Gagal memuat data seleksi."
            );
        } finally {
            setLoading(false);
        }
    };

    /* ---------------------------------------------------------
       FETCH PROGRAMS
    --------------------------------------------------------- */
    const fetchPrograms = async () => {
        try {
            const response = await axios.get(
                "/api/programs"
            );

            if (response.data?.success) {
                setPrograms(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );
            }
        } catch (error) {
            console.error(
                "Error fetching programs:",
                error
            );
        }
    };

    /* ---------------------------------------------------------
       FETCH STATISTICS
    --------------------------------------------------------- */
    const fetchStatistics = async () => {
        try {
            const response = await axios.get(
                "/api/selection/statistics"
            );

            if (response.data?.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error(
                "Error fetching selection statistics:",
                error
            );
        }
    };

    /* ---------------------------------------------------------
       INITIAL EFFECT
    --------------------------------------------------------- */
    useEffect(() => {
        fetchPrograms();
        fetchStatistics();
    }, []);

    /* ---------------------------------------------------------
       FILTER EFFECT
    --------------------------------------------------------- */
    useEffect(() => {
        fetchSelections();
    }, [filters.program, filters.status, filters.search]);

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
            program: "all",
            status: "all",
            search: "",
        });
    };

    const hasActiveFilters =
        filters.program !== "all" ||
        filters.status !== "all" ||
        filters.search !== "";

    /* =========================================================
       EVALUATION
    ========================================================= */

    const handleEvaluateCandidate = (candidate) => {
        setSelectedCandidate(candidate);

        setEvaluationData({
            status: candidate.status || "menunggu",
            test_score: candidate.test_score || "",
            interview_score:
                candidate.interview_score || "",
            final_score: candidate.final_score || "",
            notes: candidate.notes || "",
        });

        setShowEvaluationModal(true);
    };

    /* ---------------------------------------------------------
       SUBMIT EVALUATION
    --------------------------------------------------------- */
    const handleEvaluationSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCandidate) return;

        try {
            const data = {
                ...evaluationData,
                evaluated_by: user?.id,
            };

            const response = await axios.put(
                `/api/selection/${selectedCandidate.registration_id}`,
                data
            );

            if (response.data?.success) {
                alert(
                    "Evaluasi peserta berhasil disimpan."
                );

                setShowEvaluationModal(false);
                setSelectedCandidate(null);

                await Promise.all([
                    fetchSelections(),
                    fetchStatistics(),
                ]);
            }
        } catch (error) {
            console.error(
                "Error submitting evaluation:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Gagal menyimpan evaluasi."
            );
        }
    };

    /* =========================================================
       BULK UPDATE
    ========================================================= */

    const handleBulkUpdate = async (e) => {
        e.preventDefault();

        if (selectedCandidates.length === 0) {
            alert(
                "Pilih minimal satu peserta terlebih dahulu."
            );
            return;
        }

        try {
            const data = {
                registration_ids: selectedCandidates,
                ...bulkData,
                evaluated_by: user?.id,
            };

            const response = await axios.post(
                "/api/selection/bulk-update",
                data
            );

            if (response.data?.success) {
                alert(
                    response.data.message ||
                    "Status peserta berhasil diperbarui."
                );

                setShowBulkModal(false);
                setSelectedCandidates([]);

                await Promise.all([
                    fetchSelections(),
                    fetchStatistics(),
                ]);
            }
        } catch (error) {
            console.error(
                "Error in bulk update:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Gagal melakukan update massal."
            );
        }
    };

    /* ---------------------------------------------------------
       TOGGLE CANDIDATE
    --------------------------------------------------------- */
    const toggleCandidateSelection = (
        registrationId
    ) => {
        setSelectedCandidates((prev) =>
            prev.includes(registrationId)
                ? prev.filter(
                    (id) => id !== registrationId
                )
                : [...prev, registrationId]
        );
    };

    /* ---------------------------------------------------------
       SELECT ALL
    --------------------------------------------------------- */
    const selectAllCandidates = () => {
        if (
            selections.length > 0 &&
            selectedCandidates.length ===
            selections.length
        ) {
            setSelectedCandidates([]);
        } else {
            setSelectedCandidates(
                selections.map(
                    (selection) =>
                        selection.registration_id
                )
            );
        }
    };

    /* =========================================================
       UTILITIES
    ========================================================= */

    const getStatusBadge = (status) => {
        const statusConfig = {
            menunggu: {
                tone: "warning",
                icon: "bi-clock",
                text: "Menunggu",
            },
            lolos_tahap_1: {
                tone: "info",
                icon: "bi-1-circle",
                text: "Lolos Tahap 1",
            },
            lolos_tahap_2: {
                tone: "primary",
                icon: "bi-2-circle",
                text: "Lolos Tahap 2",
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
                ></i>
                {config.text}
            </span>
        );
    };

    /* ---------------------------------------------------------
       CALCULATE GRADE
    --------------------------------------------------------- */
    const calculateGrade = (score) => {
        if (
            score === null ||
            score === undefined ||
            score === ""
        ) {
            return "-";
        }

        const numericScore = Number(score);

        if (numericScore >= 85) return "A";
        if (numericScore >= 75) return "B";
        if (numericScore >= 65) return "C";
        if (numericScore >= 55) return "D";

        return "E";
    };

    /* =========================================================
       STATISTICS
    ========================================================= */

    const fallbackStats = useMemo(() => {
        return {
            total_candidates: selections.length,
            pending_selection: selections.filter(
                (item) => item.status === "menunggu"
            ).length,
            passed_stage_1: selections.filter(
                (item) =>
                    item.status === "lolos_tahap_1"
            ).length,
            passed_stage_2: selections.filter(
                (item) =>
                    item.status === "lolos_tahap_2"
            ).length,
            passed_final: selections.filter(
                (item) => item.status === "lolos"
            ).length,
            failed: selections.filter(
                (item) =>
                    item.status === "tidak_lolos"
            ).length,
        };
    }, [selections]);

    const statistics =
        stats?.statistics || fallbackStats;

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading && selections.length === 0) {
        return (
            <div className="selection-management-page">
                <div className="selection-loading-state">
                    <div className="selection-loading-icon">
                        <span className="spinner-border"></span>
                    </div>
                    <h4>Memuat data seleksi</h4>
                    <p>
                        Data kandidat sedang dipersiapkan.
                    </p>
                </div>
            </div>
        );
    }

    /* =========================================================
       MAIN RENDER
    ========================================================= */

    return (
        <div className="selection-management-page">
            {/* ---------------------------------------------------------
                PAGE HEADER
            --------------------------------------------------------- */}
            <div className="selection-page-header">
                <div>
                    <div className="selection-page-eyebrow">
                        <span>
                            <i className="bi bi-person-check"></i>
                        </span>
                        PROSES SELEKSI
                    </div>
                    <h1>Manajemen Seleksi</h1>
                    <p>
                        Kelola evaluasi, nilai, tahapan, dan
                        keputusan seleksi peserta FITALENTA.
                    </p>
                </div>

                <div className="selection-page-actions">
                    <button
                        type="button"
                        className="selection-secondary-button"
                        onClick={fetchSelections}
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                        Refresh
                    </button>

                    <button
                        type="button"
                        className="selection-primary-button"
                        onClick={() =>
                            setShowBulkModal(true)
                        }
                        disabled={
                            selectedCandidates.length ===
                            0
                        }
                    >
                        <i className="bi bi-ui-checks-grid"></i>
                        Update Bulk
                        {selectedCandidates.length > 0 && (
                            <span className="selection-button-count">
                                {
                                    selectedCandidates.length
                                }
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* =========================================================
                STATISTICS
            ========================================================= */}
            <div className="selection-selection-stats-grid">
                <div className="selection-mini-stat">
                    <span>Total Kandidat</span>
                    <strong>
                        {statistics.total_candidates || 0}
                    </strong>
                    <i className="bi bi-people"></i>
                </div>

                <div className="selection-mini-stat selection-mini-stat-warning">
                    <span>Menunggu</span>
                    <strong>
                        {statistics.pending_selection || 0}
                    </strong>
                    <i className="bi bi-hourglass-split"></i>
                </div>

                <div className="selection-mini-stat selection-mini-stat-info">
                    <span>Lolos Tahap 1</span>
                    <strong>
                        {statistics.passed_stage_1 || 0}
                    </strong>
                    <i className="bi bi-1-circle"></i>
                </div>

                <div className="selection-mini-stat selection-mini-stat-primary">
                    <span>Lolos Tahap 2</span>
                    <strong>
                        {statistics.passed_stage_2 || 0}
                    </strong>
                    <i className="bi bi-2-circle"></i>
                </div>

                <div className="selection-mini-stat selection-mini-stat-success">
                    <span>Lolos</span>
                    <strong>
                        {statistics.passed_final || 0}
                    </strong>
                    <i className="bi bi-check-circle"></i>
                </div>

                <div className="selection-mini-stat selection-mini-stat-danger">
                    <span>Tidak Lolos</span>
                    <strong>
                        {statistics.failed || 0}
                    </strong>
                    <i className="bi bi-x-circle"></i>
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
                            <span>FILTER KANDIDAT</span>
                            <h2>Filter & Pencarian</h2>
                            <p>
                                Temukan kandidat berdasarkan
                                program, status, nama, atau kode
                                pendaftaran.
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
                        <label>Program</label>
                        <select
                            value={filters.program}
                            onChange={(e) =>
                                handleFilterChange(
                                    "program",
                                    e.target.value
                                )
                            }
                        >
                            <option value="all">
                                Semua Program
                            </option>
                            {programs.map((program) => (
                                <option
                                    key={program.id}
                                    value={program.id}
                                >
                                    {program.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="selection-filter-field">
                        <label>Status Seleksi</label>
                        <select
                            value={filters.status}
                            onChange={(e) =>
                                handleFilterChange(
                                    "status",
                                    e.target.value
                                )
                            }
                        >
                            <option value="all">
                                Semua Status
                            </option>
                            <option value="menunggu">
                                Menunggu
                            </option>
                            <option value="lolos_tahap_1">
                                Lolos Tahap 1
                            </option>
                            <option value="lolos_tahap_2">
                                Lolos Tahap 2
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
                        <label>Pencarian</label>
                        <div className="selection-search-input">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                placeholder="Cari nama, email, atau kode..."
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
                SELECTION DATABASE
            ========================================================= */}
            <section className="selection-content-card selection-database-card">
                <div className="selection-card-heading">
                    <div className="selection-card-heading-main">
                        <div className="selection-section-icon">
                            <i className="bi bi-clipboard2-data"></i>
                        </div>
                        <div>
                            <span>DATABASE SELEKSI</span>
                            <h2>Data Seleksi</h2>
                            <p>
                                {selections.length} kandidat
                                ditampilkan.
                            </p>
                        </div>
                    </div>

                    {selectedCandidates.length > 0 && (
                        <div className="selection-selected-counter">
                            <i className="bi bi-check2-square"></i>
                            {selectedCandidates.length} dipilih
                        </div>
                    )}
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
                    </div>
                )}

                {selections.length === 0 ? (
                    <div className="selection-empty-state">
                        <div>
                            <i className="bi bi-clipboard2"></i>
                        </div>
                        <h3>
                            Tidak ada data seleksi
                        </h3>
                        <p>
                            Coba ubah filter atau kata kunci
                            pencarian.
                        </p>
                    </div>
                ) : (
                    <div className="selection-table-wrapper">
                        <table className="selection-table selection-evaluation-table">
                            <thead>
                            <tr>
                                <th className="selection-checkbox-column">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selections.length >
                                            0 &&
                                            selectedCandidates.length ===
                                            selections.length
                                        }
                                        onChange={
                                            selectAllCandidates
                                        }
                                    />
                                </th>
                                <th>Peserta</th>
                                <th>Program</th>
                                <th>Test</th>
                                <th>Interview</th>
                                <th>Final</th>
                                <th>Status</th>
                                <th>Evaluator</th>
                                <th>Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selections.map(
                                (selection) => (
                                    <tr
                                        key={
                                            selection.id
                                        }
                                    >
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedCandidates.includes(
                                                    selection.registration_id
                                                )}
                                                onChange={() =>
                                                    toggleCandidateSelection(
                                                        selection.registration_id
                                                    )
                                                }
                                            />
                                        </td>

                                        <td>
                                            <div className="selection-participant">
                                                <div className="selection-participant-avatar">
                                                    {selection.full_name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            .toUpperCase() ||
                                                        "P"}
                                                </div>
                                                <div>
                                                    <strong>
                                                        {
                                                            selection.full_name
                                                        }
                                                    </strong>
                                                    <span>
                                                            {
                                                                selection.email
                                                            }
                                                        </span>
                                                    <small>
                                                        {
                                                            selection.registration_code
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="selection-program-info">
                                                <strong>
                                                    {
                                                        selection.program_name
                                                    }
                                                </strong>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="selection-score">
                                                <strong>
                                                    {selection.test_score ||
                                                        "-"}
                                                </strong>
                                                <span>
                                                        {calculateGrade(
                                                            selection.test_score
                                                        )}
                                                    </span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="selection-score">
                                                <strong>
                                                    {selection.interview_score ||
                                                        "-"}
                                                </strong>
                                                <span>
                                                        {calculateGrade(
                                                            selection.interview_score
                                                        )}
                                                    </span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="selection-score selection-score-final">
                                                <strong>
                                                    {selection.final_score ||
                                                        "-"}
                                                </strong>
                                                <span>
                                                        {calculateGrade(
                                                            selection.final_score
                                                        )}
                                                    </span>
                                            </div>
                                        </td>

                                        <td>
                                            {getStatusBadge(
                                                selection.status
                                            )}
                                        </td>

                                        <td>
                                            {selection.evaluated_by_name ? (
                                                <div className="selection-evaluator">
                                                    <strong>
                                                        {
                                                            selection.evaluated_by_name
                                                        }
                                                    </strong>
                                                    <span>
                                                            {selection.evaluated_at
                                                                ? new Date(
                                                                    selection.evaluated_at
                                                                ).toLocaleDateString(
                                                                    "id-ID"
                                                                )
                                                                : "-"}
                                                        </span>
                                                </div>
                                            ) : (
                                                <span className="selection-empty-value">
                                                        Belum
                                                        dievaluasi
                                                    </span>
                                            )}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="selection-action-button"
                                                onClick={() =>
                                                    handleEvaluateCandidate(
                                                        selection
                                                    )
                                                }
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                                Evaluasi
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* =========================================================
                EVALUATION MODAL
            ========================================================= */}
            {showEvaluationModal &&
                selectedCandidate && (
                    <div
                        className="selection-modal-overlay"
                        onClick={() =>
                            setShowEvaluationModal(
                                false
                            )
                        }
                    >
                        <div
                            className="selection-modal-dialog"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >
                            <div className="selection-modal">
                                <div className="selection-modal-header">
                                    <div className="selection-modal-heading">
                                        <div className="selection-modal-icon">
                                            <i className="bi bi-clipboard2-check"></i>
                                        </div>
                                        <div>
                                            <span>
                                                EVALUASI
                                                KANDIDAT
                                            </span>
                                            <h3>
                                                Evaluasi
                                                Peserta
                                            </h3>
                                            <p>
                                                Masukkan nilai dan
                                                keputusan seleksi
                                                kandidat.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="selection-modal-close"
                                        onClick={() =>
                                            setShowEvaluationModal(
                                                false
                                            )
                                        }
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>

                                <form
                                    onSubmit={
                                        handleEvaluationSubmit
                                    }
                                >
                                    <div className="selection-modal-body">
                                        <div className="selection-modal-summary">
                                            <div className="selection-modal-summary-avatar">
                                                {selectedCandidate.full_name
                                                        ?.charAt(
                                                            0
                                                        )
                                                        .toUpperCase() ||
                                                    "P"}
                                            </div>
                                            <div>
                                                <span>
                                                    KANDIDAT
                                                </span>
                                                <strong>
                                                    {
                                                        selectedCandidate.full_name
                                                    }
                                                </strong>
                                                <small>
                                                    {
                                                        selectedCandidate.email
                                                    }{" "}
                                                    ·{" "}
                                                    {
                                                        selectedCandidate.program_name
                                                    }
                                                </small>
                                            </div>
                                        </div>

                                        <div className="selection-evaluation-score-grid">
                                            <div className="selection-form-field">
                                                <label>
                                                    Test Score
                                                    (0-100)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.1"
                                                    value={
                                                        evaluationData.test_score
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setEvaluationData(
                                                            (
                                                                prev
                                                            ) => ({
                                                                ...prev,
                                                                test_score:
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
                                                    Interview
                                                    Score
                                                    (0-100)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.1"
                                                    value={
                                                        evaluationData.interview_score
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setEvaluationData(
                                                            (
                                                                prev
                                                            ) => ({
                                                                ...prev,
                                                                interview_score:
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
                                                    Final Score
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.1"
                                                    value={
                                                        evaluationData.final_score
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setEvaluationData(
                                                            (
                                                                prev
                                                            ) => ({
                                                                ...prev,
                                                                final_score:
                                                                e
                                                                    .target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                    readOnly={
                                                        Boolean(
                                                            evaluationData.test_score
                                                        ) &&
                                                        Boolean(
                                                            evaluationData.interview_score
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="selection-form-section">
                                            <div className="selection-form-field">
                                                <label>
                                                    Status
                                                    Seleksi
                                                </label>
                                                <select
                                                    value={
                                                        evaluationData.status
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setEvaluationData(
                                                            (
                                                                prev
                                                            ) => ({
                                                                ...prev,
                                                                status:
                                                                e
                                                                    .target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                >
                                                    <option value="menunggu">
                                                        Menunggu
                                                    </option>
                                                    <option value="lolos_tahap_1">
                                                        Lolos Tahap
                                                        1
                                                    </option>
                                                    <option value="lolos_tahap_2">
                                                        Lolos Tahap
                                                        2
                                                    </option>
                                                    <option value="lolos">
                                                        Lolos
                                                    </option>
                                                    <option value="tidak_lolos">
                                                        Tidak Lolos
                                                    </option>
                                                </select>
                                            </div>

                                            <div className="selection-form-field">
                                                <label>
                                                    Catatan
                                                    Evaluasi
                                                </label>
                                                <textarea
                                                    rows="5"
                                                    value={
                                                        evaluationData.notes
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setEvaluationData(
                                                            (
                                                                prev
                                                            ) => ({
                                                                ...prev,
                                                                notes:
                                                                e
                                                                    .target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                    placeholder="Masukkan catatan evaluasi, feedback, atau alasan keputusan..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="selection-modal-footer">
                                        <button
                                            type="button"
                                            className="selection-secondary-button"
                                            onClick={() =>
                                                setShowEvaluationModal(
                                                    false
                                                )
                                            }
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="selection-primary-button"
                                        >
                                            <i className="bi bi-check2-circle"></i>
                                            Simpan Evaluasi
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            {/* =========================================================
                BULK MODAL
            ========================================================= */}
            {showBulkModal && (
                <div
                    className="selection-modal-overlay"
                    onClick={() =>
                        setShowBulkModal(false)
                    }
                >
                    <div
                        className="selection-modal-dialog selection-modal-dialog-small"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <div className="selection-modal">
                            <div className="selection-modal-header">
                                <div className="selection-modal-heading">
                                    <div className="selection-modal-icon">
                                        <i className="bi bi-ui-checks-grid"></i>
                                    </div>
                                    <div>
                                        <span>
                                            UPDATE MASSAL
                                        </span>
                                        <h3>
                                            Update Bulk
                                        </h3>
                                        <p>
                                            {
                                                selectedCandidates.length
                                            }{" "}
                                            peserta dipilih.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="selection-modal-close"
                                    onClick={() =>
                                        setShowBulkModal(
                                            false
                                        )
                                    }
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>

                            <form
                                onSubmit={
                                    handleBulkUpdate
                                }
                            >
                                <div className="selection-modal-body">
                                    <div className="selection-form-section">
                                        <div className="selection-form-field">
                                            <label>
                                                Status Seleksi
                                            </label>
                                            <select
                                                value={
                                                    bulkData.status
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setBulkData(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            status:
                                                            e
                                                                .target
                                                                .value,
                                                        })
                                                    )
                                                }
                                            >
                                                <option value="lolos_tahap_1">
                                                    Lolos Tahap
                                                    1
                                                </option>
                                                <option value="lolos_tahap_2">
                                                    Lolos Tahap
                                                    2
                                                </option>
                                                <option value="lolos">
                                                    Lolos
                                                </option>
                                                <option value="tidak_lolos">
                                                    Tidak Lolos
                                                </option>
                                            </select>
                                        </div>

                                        <div className="selection-form-field">
                                            <label>
                                                Catatan
                                            </label>
                                            <textarea
                                                rows="4"
                                                value={
                                                    bulkData.notes
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setBulkData(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            notes:
                                                            e
                                                                .target
                                                                .value,
                                                        })
                                                    )
                                                }
                                                placeholder="Catatan untuk seluruh peserta yang dipilih..."
                                            />
                                        </div>
                                    </div>

                                    <div className="selection-notice selection-notice-warning">
                                        <i className="bi bi-exclamation-triangle"></i>
                                        <div>
                                            <strong>
                                                Perhatian
                                            </strong>
                                            <span>
                                                Aksi ini akan
                                                mengubah status
                                                seleksi untuk{" "}
                                                {
                                                    selectedCandidates.length
                                                }{" "}
                                                peserta.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="selection-modal-footer">
                                    <button
                                        type="button"
                                        className="selection-secondary-button"
                                        onClick={() =>
                                            setShowBulkModal(
                                                false
                                            )
                                        }
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="selection-primary-button"
                                    >
                                        <i className="bi bi-check2-all"></i>
                                        Update Semua
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

export default SelectionManagement;