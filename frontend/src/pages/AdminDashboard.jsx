import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import helpers from "../utils/helpers";

const AdminDashboard = () => {
    const { user } = useAuth();

    // =========================================================
    // STATE
    // =========================================================
    const [registrations, setRegistrations] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [detailTab, setDetailTab] = useState("basic");
    const [filters, setFilters] = useState({
        program: "all",
        payment_status: "all",
        selection_status: "all",
        placement_status: "all",
        search: "",
    });
    const [statusForm, setStatusForm] = useState({
        registration_status: "",
        notes: "",
    });
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        newRegistrations: 0,
        totalRevenue: 0,
        pendingVerifications: 0,
        paymentStats: {
            pending: 0,
            installment_1: 0,
            installment_2: 0,
            installment_3: 0,
            installment_4: 0,
            installment_5: 0,
            installment_6: 0,
            paid: 0,
            overdue: 0,
        },
        registrationStats: {
            menunggu: 0,
            lolos: 0,
            tidak_lolos: 0,
        },
        selectionStats: {
            menunggu: 0,
            lolos: 0,
            tidak_lolos: 0,
        },
        placementStats: {
            proses: 0,
            lolos: 0,
            ditempatkan: 0,
        },
    });

    // =========================================================
    // HELPERS
    // =========================================================
    const getInitials = (name = "") => {
        const parts = name.trim().split(/\s+/).filter(Boolean);

        if (!parts.length) return "P";

        return parts
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
    };

    const hasActiveFilters =
        filters.program !== "all" ||
        filters.payment_status !== "all" ||
        filters.selection_status !== "all" ||
        filters.placement_status !== "all" ||
        filters.search.trim() !== "";

    const updateStatisticsFromRegistrations = useCallback((registrationsData) => {
        const totalRegistrations = registrationsData.length;
        const oneWeekAgo = new Date();

        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const newRegistrations = registrationsData.filter(
            (registration) =>
                new Date(registration.registration_date) > oneWeekAgo
        ).length;

        const totalRevenue = registrationsData.reduce(
            (sum, registration) =>
                sum + parseFloat(registration.amount_paid || 0),
            0
        );

        const paymentStats = {
            pending: 0,
            installment_1: 0,
            installment_2: 0,
            installment_3: 0,
            installment_4: 0,
            installment_5: 0,
            installment_6: 0,
            paid: 0,
            overdue: 0,
        };

        const registrationStats = {
            menunggu: 0,
            lolos: 0,
            tidak_lolos: 0,
        };

        const selectionStats = {
            menunggu: 0,
            lolos: 0,
            tidak_lolos: 0,
        };

        const placementStats = {
            proses: 0,
            lolos: 0,
            ditempatkan: 0,
        };

        registrationsData.forEach((registration) => {
            if (
                registration.payment_status &&
                Object.prototype.hasOwnProperty.call(
                    paymentStats,
                    registration.payment_status
                )
            ) {
                paymentStats[registration.payment_status] += 1;
            } else if (!registration.payment_status) {
                paymentStats.pending += 1;
            }

            if (
                registration.registration_status &&
                Object.prototype.hasOwnProperty.call(
                    registrationStats,
                    registration.registration_status
                )
            ) {
                registrationStats[registration.registration_status] += 1;
            }

            if (
                registration.selection_status &&
                Object.prototype.hasOwnProperty.call(
                    selectionStats,
                    registration.selection_status
                )
            ) {
                selectionStats[registration.selection_status] += 1;
            }

            if (
                registration.placement_status &&
                Object.prototype.hasOwnProperty.call(
                    placementStats,
                    registration.placement_status
                )
            ) {
                placementStats[registration.placement_status] += 1;
            }
        });

        const pendingVerifications =
            registrationStats.menunggu +
            selectionStats.menunggu +
            paymentStats.pending;

        setStats((previousStats) => ({
            ...previousStats,
            totalRegistrations,
            newRegistrations,
            totalRevenue,
            pendingVerifications,
            paymentStats,
            registrationStats,
            selectionStats,
            placementStats,
        }));
    }, []);

    // =========================================================
    // FETCH REGISTRATIONS
    // =========================================================
    const fetchRegistrations = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== "all" && value !== "") {
                    params.append(key, value);
                }
            });

            const queryString = params.toString();
            const endpoint = queryString
                ? `/api/registrations?${queryString}`
                : "/api/registrations";

            const response = await axios.get(endpoint);

            if (response.data.success) {
                const registrationData = response.data.data || [];

                setRegistrations(registrationData);
                updateStatisticsFromRegistrations(registrationData);
            } else {
                setError("Gagal mengambil data pendaftaran.");
            }
        } catch (fetchError) {
            console.error("Error fetching registrations:", fetchError);

            setError(
                fetchError.response?.data?.message ||
                "Terjadi kesalahan saat memuat data pendaftaran."
            );
        } finally {
            setLoading(false);
        }
    }, [filters, updateStatisticsFromRegistrations]);

    // =========================================================
    // FETCH PROGRAMS
    // =========================================================
    const fetchPrograms = useCallback(async () => {
        try {
            const response = await axios.get("/api/programs");

            if (response.data.success) {
                setPrograms(response.data.data || []);
            }
        } catch (fetchError) {
            console.error("Error fetching programs:", fetchError);
        }
    }, []);

    // =========================================================
    // FETCH STATISTICS
    // =========================================================
    const fetchStatistics = useCallback(async () => {
        try {
            const response = await axios.get("/api/admin/statistics");

            if (response.data.success) {
                setStats((previousStats) => ({
                    ...previousStats,
                    ...response.data.data,
                }));
            }
        } catch (fetchError) {
            console.error("Error fetching statistics:", fetchError);
        }
    }, []);

    // =========================================================
    // INITIAL LOAD
    // =========================================================
    useEffect(() => {
        fetchPrograms();
        fetchStatistics();
    }, [fetchPrograms, fetchStatistics]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRegistrations();
        }, filters.search ? 450 : 0);

        return () => clearTimeout(timer);
    }, [filters, fetchRegistrations]);

    useEffect(() => {
        if (!feedback) return undefined;

        const timer = setTimeout(() => {
            setFeedback(null);
        }, 4500);

        return () => clearTimeout(timer);
    }, [feedback]);

    // =========================================================
    // FILTER HANDLERS
    // =========================================================
    const handleFilterChange = (key, value) => {
        setFilters((previousFilters) => ({
            ...previousFilters,
            [key]: value,
        }));
    };

    const handleSearchChange = (event) => {
        handleFilterChange("search", event.target.value);
    };

    const handleResetFilters = () => {
        setFilters({
            program: "all",
            payment_status: "all",
            selection_status: "all",
            placement_status: "all",
            search: "",
        });
    };

    // =========================================================
    // MODAL HANDLERS
    // =========================================================
    const handleViewDetails = (registration) => {
        setSelectedRegistration(registration);
        setDetailTab("basic");
        setShowDetailModal(true);
    };

    const handleUpdateRegistrationStatus = (registration) => {
        setSelectedRegistration(registration);
        setStatusForm({
            registration_status:
                registration.registration_status || "menunggu",
            notes: "",
        });
        setShowDetailModal(false);
        setShowStatusModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setShowStatusModal(false);
        setSelectedRegistration(null);
        setDetailTab("basic");
        setStatusForm({
            registration_status: "",
            notes: "",
        });
    };

    // =========================================================
    // UPDATE STATUS
    // =========================================================
    const handleStatusSubmit = async (event) => {
        event.preventDefault();

        if (!selectedRegistration) return;

        try {
            setLoading(true);

            const response = await axios.put(
                `/api/registrations/${selectedRegistration.id}/registration-status`,
                {
                    status: statusForm.registration_status,
                    notes: statusForm.notes,
                    evaluated_by: user?.id,
                }
            );

            if (!response.data.success) {
                throw new Error("Gagal memperbarui status pendaftaran.");
            }

            setRegistrations((previousRegistrations) =>
                previousRegistrations.map((registration) =>
                    registration.id === selectedRegistration.id
                        ? {
                            ...registration,
                            registration_status:
                            statusForm.registration_status,
                        }
                        : registration
                )
            );

            setFeedback({
                type: "success",
                message: "Status pendaftaran berhasil diperbarui.",
            });

            await fetchStatistics();

            setShowStatusModal(false);
            setSelectedRegistration(null);
            setStatusForm({
                registration_status: "",
                notes: "",
            });
        } catch (submitError) {
            console.error(
                "Error updating registration status:",
                submitError
            );

            setFeedback({
                type: "danger",
                message:
                    submitError.response?.data?.message ||
                    submitError.message ||
                    "Gagal memperbarui status.",
            });
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // STATUS HELPERS
    // =========================================================
    const StatusBadge = ({
                             tone = "neutral",
                             icon,
                             children,
                         }) => (
        <span className={`admin-status-badge ${tone}`}>
            {icon && (
                <i className={`bi ${icon}`}></i>
            )}
            <span>{children}</span>
        </span>
    );

    const getInstallmentText = (
        paymentStatus,
        installmentPlan
    ) => {
        if (
            !paymentStatus ||
            paymentStatus === "pending"
        ) {
            return "Belum Bayar";
        }

        if (paymentStatus === "paid") {
            return "Lunas";
        }

        if (paymentStatus === "overdue") {
            return "Jatuh Tempo";
        }

        if (paymentStatus === "cancelled") {
            return "Dibatalkan";
        }

        if (
            !paymentStatus.startsWith(
                "installment_"
            )
        ) {
            return paymentStatus;
        }

        const installmentNumber =
            paymentStatus.split("_")[1];

        if (
            installmentPlan ===
            "4_installments"
        ) {
            return `Cicilan ${installmentNumber}/4`;
        }

        if (
            installmentPlan ===
            "6_installments"
        ) {
            return `Cicilan ${installmentNumber}/6`;
        }

        return `Cicilan ${installmentNumber}`;
    };

    const getPaymentStatusBadge = (
        paymentStatus,
        installmentPlan
    ) => {
        const text = getInstallmentText(
            paymentStatus,
            installmentPlan
        );

        if (paymentStatus === "paid") {
            return (
                <StatusBadge
                    tone="success"
                    icon="bi-check-circle-fill"
                >
                    {text}
                </StatusBadge>
            );
        }

        if (paymentStatus === "overdue") {
            return (
                <StatusBadge
                    tone="danger"
                    icon="bi-exclamation-circle-fill"
                >
                    {text}
                </StatusBadge>
            );
        }

        if (
            paymentStatus?.startsWith(
                "installment_"
            )
        ) {
            return (
                <StatusBadge
                    tone="info"
                    icon="bi-credit-card"
                >
                    {text}
                </StatusBadge>
            );
        }

        if (paymentStatus === "cancelled") {
            return (
                <StatusBadge
                    tone="neutral"
                    icon="bi-x-circle"
                >
                    {text}
                </StatusBadge>
            );
        }

        return (
            <StatusBadge
                tone="warning"
                icon="bi-clock-fill"
            >
                {text}
            </StatusBadge>
        );
    };

    const getRegistrationStatusBadge = (status) => {
        if (status === "lolos") {
            return (
                <StatusBadge
                    tone="success"
                    icon="bi-check-circle-fill"
                >
                    Lolos Interview
                </StatusBadge>
            );
        }

        if (status === "tidak_lolos") {
            return (
                <StatusBadge
                    tone="danger"
                    icon="bi-x-circle-fill"
                >
                    Tidak Lolos
                </StatusBadge>
            );
        }

        return (
            <StatusBadge
                tone="warning"
                icon="bi-hourglass-split"
            >
                Menunggu Interview
            </StatusBadge>
        );
    };

    const getSelectionStatusBadge = (status) => {
        if (status === "lolos") {
            return (
                <StatusBadge
                    tone="success"
                    icon="bi-check-circle-fill"
                >
                    Lolos
                </StatusBadge>
            );
        }

        if (status === "tidak_lolos") {
            return (
                <StatusBadge
                    tone="danger"
                    icon="bi-x-circle-fill"
                >
                    Tidak Lolos
                </StatusBadge>
            );
        }

        return (
            <StatusBadge
                tone="warning"
                icon="bi-clock-fill"
            >
                Menunggu
            </StatusBadge>
        );
    };

    const getPlacementStatusBadge = (status) => {
        if (status === "ditempatkan") {
            return (
                <StatusBadge
                    tone="success"
                    icon="bi-building-check"
                >
                    Ditempatkan
                </StatusBadge>
            );
        }

        if (status === "lolos") {
            return (
                <StatusBadge
                    tone="info"
                    icon="bi-check-circle-fill"
                >
                    Lolos
                </StatusBadge>
            );
        }

        return (
            <StatusBadge
                tone="primary"
                icon="bi-arrow-repeat"
            >
                Proses
            </StatusBadge>
        );
    };

    // =========================================================
    // CERTIFICATES
    // =========================================================
    const renderCertificates = (registration) => {
        const documents = [];

        if (registration.n4_certificate_path) {
            documents.push({
                key: "n4",
                label: "N4",
                path: registration.n4_certificate_path,
            });
        }

        if (registration.ssw_certificate_path) {
            documents.push({
                key: "ssw",
                label: "SSW",
                path: registration.ssw_certificate_path,
            });
        }

        if (!documents.length) {
            return (
                <span className="admin-empty-value">
                    <i className="bi bi-dash"></i>
                </span>
            );
        }

        return (
            <div className="admin-document-list">
                {documents.map((document) => (
                    <a
                        key={document.key}
                        href={`http://localhost:5000${document.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-document-chip"
                        title={`Buka Sertifikat ${document.label}`}
                    >
                        <i className="bi bi-file-earmark-pdf"></i>
                        {document.label}
                    </a>
                ))}
            </div>
        );
    };

    // =========================================================
    // DETAIL HELPERS
    // =========================================================
    const DetailItem = ({
                            label,
                            value,
                            full = false,
                        }) => (
        <div
            className={`admin-detail-item ${
                full ? "full" : ""
            }`}
        >
            <span>{label}</span>
            <strong>{value || "-"}</strong>
        </div>
    );

    const renderPersonalInfo = (registration) => (
        <div className="admin-detail-section-grid">
            <div className="admin-detail-section-card">
                <div className="admin-detail-section-heading">
                    <div>
                        <i className="bi bi-person-vcard"></i>
                    </div>

                    <span>
                        <small>IDENTITAS</small>
                        <strong>
                            Informasi Pribadi
                        </strong>
                    </span>
                </div>

                <div className="admin-detail-data-grid">
                    <DetailItem
                        label="NIK"
                        value={registration.nik}
                    />

                    <DetailItem
                        label="Jenis Kelamin"
                        value={
                            registration.gender === "L"
                                ? "Laki-laki"
                                : registration.gender === "P"
                                    ? "Perempuan"
                                    : "-"
                        }
                    />

                    <DetailItem
                        label="Tempat Lahir"
                        value={
                            registration.birth_place
                        }
                    />

                    <DetailItem
                        label="Tanggal Lahir"
                        value={
                            registration.birth_date
                                ? helpers.formatDateForBirthDate(
                                    registration.birth_date
                                )
                                : "-"
                        }
                    />

                    <DetailItem
                        label="Status Pernikahan"
                        value={
                            registration.marital_status
                        }
                    />
                </div>
            </div>

            <div className="admin-detail-section-card">
                <div className="admin-detail-section-heading">
                    <div>
                        <i className="bi bi-mortarboard"></i>
                    </div>

                    <span>
                        <small>PENDIDIKAN</small>
                        <strong>
                            Latar Belakang Pendidikan
                        </strong>
                    </span>
                </div>

                <div className="admin-detail-data-grid">
                    <DetailItem
                        label="Pendidikan Terakhir"
                        value={
                            registration.last_education
                        }
                    />

                    <DetailItem
                        label="Jurusan"
                        value={registration.major}
                    />

                    <DetailItem
                        label="Institusi Pendidikan"
                        value={
                            registration.education_institution
                        }
                    />

                    <DetailItem
                        label="Aktivitas Saat Ini"
                        value={
                            registration.current_activity
                        }
                    />
                </div>
            </div>

            <div className="admin-detail-section-card full">
                <div className="admin-detail-section-heading">
                    <div>
                        <i className="bi bi-telephone"></i>
                    </div>

                    <span>
                        <small>KONTAK DARURAT</small>
                        <strong>
                            Orang Tua / Wali
                        </strong>
                    </span>
                </div>

                <div className="admin-detail-data-grid">
                    <DetailItem
                        label="Nomor Handphone"
                        value={
                            registration.parent_phone
                        }
                    />

                    <DetailItem
                        label="Hubungan"
                        value={
                            registration.parent_relationship
                        }
                    />
                </div>
            </div>
        </div>
    );

    const renderAddressInfo = (registration) => (
        <div className="admin-address-grid">
            <div className="admin-address-card">
                <div className="admin-address-card-header">
                    <div className="admin-address-icon">
                        <i className="bi bi-person-badge"></i>
                    </div>

                    <span>
                        <small>
                            ALAMAT IDENTITAS
                        </small>
                        <strong>
                            Alamat Sesuai KTP
                        </strong>
                    </span>
                </div>

                <div className="admin-address-location">
                    <i className="bi bi-geo-alt-fill"></i>

                    <span>
                        {registration.ktp_city_name ||
                            "-"}
                        ,{" "}
                        {registration.ktp_province_name ||
                            "-"}
                    </span>
                </div>

                <p>
                    {registration.ktp_address ||
                        "Alamat belum tersedia."}
                </p>
            </div>

            <div className="admin-address-card domicile">
                <div className="admin-address-card-header">
                    <div className="admin-address-icon">
                        <i className="bi bi-house-door"></i>
                    </div>

                    <span>
                        <small>
                            ALAMAT SAAT INI
                        </small>
                        <strong>
                            Alamat Domisili
                        </strong>
                    </span>
                </div>

                <div className="admin-address-location">
                    <i className="bi bi-geo-alt-fill"></i>

                    <span>
                        {registration.domicile_city_name ||
                            "-"}
                        ,{" "}
                        {registration.domicile_province_name ||
                            "-"}
                    </span>
                </div>

                <p>
                    {registration.domicile_address ||
                        "Alamat belum tersedia."}
                </p>
            </div>
        </div>
    );

    // =========================================================
    // LOADING
    // =========================================================
    if (
        loading &&
        registrations.length === 0
    ) {
        return (
            <div className="admin-dashboard-page">
                <div className="admin-dashboard-loading">
                    <div className="admin-dashboard-loading-icon">
                        <span className="spinner-border"></span>
                    </div>

                    <strong>
                        Menyiapkan dashboard
                    </strong>

                    <span>
                        Data pendaftaran sedang dimuat.
                    </span>
                </div>
            </div>
        );
    }

    // =========================================================
    // RENDER
    // =========================================================
    return (
        <div className="admin-dashboard-page">
            <div className="admin-dashboard-shell">
                {/* =========================================================
                    HEADER
                ========================================================= */}
                <section className="admin-dashboard-header">
                    <div className="admin-dashboard-heading">
                        <div className="admin-dashboard-eyebrow">
                            <i className="bi bi-grid-1x2-fill"></i>
                            ADMIN CONTROL CENTER
                        </div>

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Pantau pendaftaran,
                            pembayaran, seleksi, dan
                            perkembangan peserta
                            FITALENTA dalam satu halaman.
                        </p>
                    </div>

                    <div className="admin-welcome-card">
                        <div className="admin-welcome-avatar">
                            {getInitials(
                                user?.full_name ||
                                "Admin Fitalenta"
                            )}
                        </div>

                        <div>
                            <small>
                                SELAMAT DATANG
                            </small>

                            <strong>
                                {user?.full_name ||
                                    "Admin Fitalenta"}
                            </strong>

                            <span>
                                Administrator FITALENTA
                            </span>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    FEEDBACK
                ========================================================= */}
                {feedback && (
                    <div
                        className={`admin-feedback ${feedback.type}`}
                    >
                        <div className="admin-feedback-icon">
                            <i
                                className={`bi ${
                                    feedback.type ===
                                    "success"
                                        ? "bi-check-circle-fill"
                                        : "bi-exclamation-circle-fill"
                                }`}
                            ></i>
                        </div>

                        <div>
                            <strong>
                                {feedback.type ===
                                "success"
                                    ? "Perubahan berhasil"
                                    : "Terjadi masalah"}
                            </strong>

                            <span>
                                {feedback.message}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setFeedback(null)
                            }
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                )}

                {/* =========================================================
                    STATISTICS
                ========================================================= */}
                <section className="admin-stat-grid">
                    <div className="admin-stat-card primary">
                        <div className="admin-stat-card-top">
                            <div className="admin-stat-icon">
                                <i className="bi bi-people"></i>
                            </div>

                            <span className="admin-stat-chip">
                                Semua Program
                            </span>
                        </div>

                        <small>
                            TOTAL PENDAFTAR
                        </small>

                        <strong>
                            {stats.totalRegistrations}
                        </strong>

                        <p>
                            Jumlah peserta yang telah
                            melakukan pendaftaran.
                        </p>
                    </div>

                    <div className="admin-stat-card blue">
                        <div className="admin-stat-card-top">
                            <div className="admin-stat-icon">
                                <i className="bi bi-person-plus"></i>
                            </div>

                            <span className="admin-stat-chip">
                                7 Hari
                            </span>
                        </div>

                        <small>
                            PENDAFTAR BARU
                        </small>

                        <strong>
                            {stats.newRegistrations}
                        </strong>

                        <p>
                            Pendaftaran peserta dalam
                            tujuh hari terakhir.
                        </p>
                    </div>

                    <div className="admin-stat-card success">
                        <div className="admin-stat-card-top">
                            <div className="admin-stat-icon">
                                <i className="bi bi-wallet2"></i>
                            </div>

                            <span className="admin-stat-chip">
                                {
                                    stats.paymentStats
                                        .paid
                                }{" "}
                                Lunas
                            </span>
                        </div>

                        <small>
                            TOTAL PEMASUKAN
                        </small>

                        <strong>
                            {helpers.formatCurrency(
                                stats.totalRevenue
                            )}
                        </strong>

                        <p>
                            Total pembayaran yang telah
                            tercatat pada sistem.
                        </p>
                    </div>

                    <div className="admin-stat-card warning">
                        <div className="admin-stat-card-top">
                            <div className="admin-stat-icon">
                                <i className="bi bi-hourglass-split"></i>
                            </div>

                            <span className="admin-stat-chip">
                                Perlu Tindakan
                            </span>
                        </div>

                        <small>
                            VERIFIKASI TERTUNDA
                        </small>

                        <strong>
                            {
                                stats.pendingVerifications
                            }
                        </strong>

                        <p>
                            Proses yang masih
                            membutuhkan tindak lanjut
                            admin.
                        </p>
                    </div>
                </section>

                {/* =========================================================
                    FILTER
                ========================================================= */}
                <section className="admin-filter-card">
                    <div className="admin-card-heading">
                        <div className="admin-card-heading-left">
                            <div className="admin-card-heading-icon">
                                <i className="bi bi-funnel"></i>
                            </div>

                            <div>
                                <span>
                                    FILTER DATA
                                </span>

                                <h2>
                                    Filter & Pencarian
                                </h2>

                                <p>
                                    Temukan data peserta
                                    berdasarkan kriteria
                                    tertentu.
                                </p>
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                className="admin-reset-filter"
                                onClick={
                                    handleResetFilters
                                }
                            >
                                <i className="bi bi-arrow-counterclockwise"></i>
                                Reset Filter
                            </button>
                        )}
                    </div>

                    <div className="admin-filter-body">
                        <div className="admin-filter-field search">
                            <label>
                                Pencarian
                            </label>

                            <div className="admin-search-wrapper">
                                <i className="bi bi-search"></i>

                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={
                                        handleSearchChange
                                    }
                                    placeholder="Cari nama, email, telepon, atau kode pendaftaran..."
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
                                        title="Hapus pencarian"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="admin-filter-field">
                            <label>
                                Program
                            </label>

                            <select
                                value={
                                    filters.program
                                }
                                onChange={(event) =>
                                    handleFilterChange(
                                        "program",
                                        event.target
                                            .value
                                    )
                                }
                            >
                                <option value="all">
                                    Semua Program
                                </option>

                                {programs.map(
                                    (program) => (
                                        <option
                                            key={
                                                program.id
                                            }
                                            value={
                                                program.id
                                            }
                                        >
                                            {
                                                program.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="admin-filter-field">
                            <label>
                                Pembayaran
                            </label>

                            <select
                                value={
                                    filters.payment_status
                                }
                                onChange={(event) =>
                                    handleFilterChange(
                                        "payment_status",
                                        event.target
                                            .value
                                    )
                                }
                            >
                                <option value="all">
                                    Semua Status
                                </option>
                                <option value="pending">
                                    Belum Bayar
                                </option>
                                <option value="installment_1">
                                    Cicilan 1
                                </option>
                                <option value="installment_2">
                                    Cicilan 2
                                </option>
                                <option value="installment_3">
                                    Cicilan 3
                                </option>
                                <option value="installment_4">
                                    Cicilan 4
                                </option>
                                <option value="installment_5">
                                    Cicilan 5
                                </option>
                                <option value="installment_6">
                                    Cicilan 6
                                </option>
                                <option value="paid">
                                    Lunas
                                </option>
                                <option value="overdue">
                                    Jatuh Tempo
                                </option>
                            </select>
                        </div>

                        <div className="admin-filter-field">
                            <label>
                                Seleksi
                            </label>

                            <select
                                value={
                                    filters.selection_status
                                }
                                onChange={(event) =>
                                    handleFilterChange(
                                        "selection_status",
                                        event.target
                                            .value
                                    )
                                }
                            >
                                <option value="all">
                                    Semua Status
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

                        <div className="admin-filter-field">
                            <label>
                                Penyaluran
                            </label>

                            <select
                                value={
                                    filters.placement_status
                                }
                                onChange={(event) =>
                                    handleFilterChange(
                                        "placement_status",
                                        event.target
                                            .value
                                    )
                                }
                            >
                                <option value="all">
                                    Semua Status
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
                    </div>
                </section>

                {/* =========================================================
                    REGISTRATION DATABASE
                ========================================================= */}
                <section className="admin-registration-card">
                    {/* ---------------------------------------------------------
                        DATABASE HEADER
                    --------------------------------------------------------- */}
                    <div className="admin-card-heading registration">
                        <div className="admin-card-heading-left">
                            <div className="admin-card-heading-icon">
                                <i className="bi bi-people"></i>
                            </div>

                            <div>
                                <span>
                                    DATABASE PESERTA
                                </span>

                                <h2>
                                    Data Pendaftar
                                </h2>

                                <p>
                                    Menampilkan{" "}
                                    {
                                        registrations.length
                                    }{" "}
                                    data berdasarkan filter
                                    saat ini.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="admin-refresh-button"
                            onClick={
                                fetchRegistrations
                            }
                            disabled={loading}
                        >
                            <i
                                className={`bi bi-arrow-clockwise ${
                                    loading
                                        ? "admin-spin"
                                        : ""
                                }`}
                            ></i>

                            {loading
                                ? "Memuat..."
                                : "Refresh"}
                        </button>
                    </div>

                    {/* ---------------------------------------------------------
                        ERROR MESSAGE
                    --------------------------------------------------------- */}
                    {error && (
                        <div className="admin-inline-error">
                            <div>
                                <i className="bi bi-exclamation-triangle-fill"></i>
                            </div>

                            <span>
                                <strong>
                                    Data belum dapat
                                    dimuat
                                </strong>

                                <small>
                                    {error}
                                </small>
                            </span>
                        </div>
                    )}

                    {/* ---------------------------------------------------------
                        EMPTY STATE
                    --------------------------------------------------------- */}
                    {registrations.length ===
                    0 ? (
                        <div className="admin-empty-state">
                            <div className="admin-empty-illustration">
                                <i className="bi bi-inbox"></i>
                            </div>

                            <span className="admin-empty-label">
                                DATA TIDAK DITEMUKAN
                            </span>

                            <h3>
                                {hasActiveFilters
                                    ? "Tidak ada peserta yang sesuai"
                                    : "Belum ada data pendaftaran"}
                            </h3>

                            <p>
                                {hasActiveFilters
                                    ? "Ubah filter atau kata kunci pencarian untuk melihat hasil lainnya."
                                    : "Data pendaftaran peserta akan tampil di area ini."}
                            </p>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={
                                        handleResetFilters
                                    }
                                >
                                    <i className="bi bi-arrow-counterclockwise"></i>
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* =========================================================
                                DESKTOP TABLE
                            ========================================================= */}
                            <div className="admin-table-wrapper d-none d-lg-block">
                                <table className="admin-registration-table">
                                    <thead>
                                    <tr>
                                        <th>
                                            Peserta
                                        </th>
                                        <th>
                                            Program
                                        </th>
                                        <th>
                                            Tanggal
                                            Daftar
                                        </th>
                                        <th>
                                            Pembayaran
                                        </th>
                                        <th>
                                            Perkembangan
                                            Peserta
                                        </th>
                                        <th>
                                            Dokumen
                                        </th>
                                        <th className="admin-action-column">
                                            Aksi
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {registrations.map(
                                        (
                                            registration
                                        ) => (
                                            <tr
                                                key={
                                                    registration.id
                                                }
                                            >
                                                {/* ---------------------------------------------------------
                                                        PARTICIPANT
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-participant-cell">
                                                        <div className="admin-participant-photo">
                                                            {registration.photo_path ? (
                                                                <img
                                                                    src={`http://localhost:5000${registration.photo_path}`}
                                                                    alt={
                                                                        registration.full_name
                                                                    }
                                                                />
                                                            ) : (
                                                                <span>
                                                                        {getInitials(
                                                                            registration.full_name
                                                                        )}
                                                                    </span>
                                                            )}
                                                        </div>

                                                        <div className="admin-participant-info">
                                                            <strong>
                                                                {
                                                                    registration.full_name
                                                                }
                                                            </strong>

                                                            <span>
                                                                    <i className="bi bi-envelope"></i>
                                                                {registration.email ||
                                                                    "-"}
                                                                </span>

                                                            <span>
                                                                    <i className="bi bi-telephone"></i>
                                                                {registration.phone ||
                                                                    "-"}
                                                                </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ---------------------------------------------------------
                                                        PROGRAM
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-program-table-cell">
                                                        <div className="admin-program-table-icon">
                                                            <i className="bi bi-briefcase"></i>
                                                        </div>

                                                        <div className="admin-program-cell">
                                                            <strong>
                                                                {registration.program_name ||
                                                                    "-"}
                                                            </strong>

                                                            <span>
                                                                    {helpers.formatCurrency(
                                                                        registration.program_training_cost
                                                                    )}
                                                                </span>

                                                            <code>
                                                                {
                                                                    registration.registration_code
                                                                }
                                                            </code>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ---------------------------------------------------------
                                                        REGISTRATION DATE
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-date-cell">
                                                        <div className="admin-date-icon">
                                                            <i className="bi bi-calendar3"></i>
                                                        </div>

                                                        <span>
                                                                <strong>
                                                                    {helpers.formatDate(
                                                                        registration.registration_date
                                                                    )}
                                                                </strong>

                                                                <small>
                                                                    Tanggal
                                                                    pendaftaran
                                                                </small>
                                                            </span>
                                                    </div>
                                                </td>

                                                {/* ---------------------------------------------------------
                                                        PAYMENT
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-payment-cell">
                                                        {getPaymentStatusBadge(
                                                            registration.payment_status,
                                                            registration.program_installment_plan
                                                        )}

                                                        {Number(
                                                                registration.amount_paid ||
                                                                0
                                                            ) >
                                                            0 && (
                                                                <div className="admin-payment-amount">
                                                                    <span>
                                                                        Terbayar
                                                                    </span>

                                                                    <strong>
                                                                        {helpers.formatCurrency(
                                                                            registration.amount_paid
                                                                        )}
                                                                    </strong>
                                                                </div>
                                                            )}
                                                    </div>
                                                </td>

                                                {/* ---------------------------------------------------------
                                                        PARTICIPANT PROGRESS
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-progress-list">
                                                        <div className="admin-progress-row">
                                                            <div className="admin-progress-label">
                                                                <i className="bi bi-person-check"></i>
                                                                <span>
                                                                        Interview
                                                                    </span>
                                                            </div>

                                                            {getRegistrationStatusBadge(
                                                                registration.registration_status
                                                            )}
                                                        </div>

                                                        <div className="admin-progress-row">
                                                            <div className="admin-progress-label">
                                                                <i className="bi bi-clipboard-check"></i>
                                                                <span>
                                                                        Seleksi
                                                                    </span>
                                                            </div>

                                                            {getSelectionStatusBadge(
                                                                registration.selection_status
                                                            )}
                                                        </div>

                                                        <div className="admin-progress-row">
                                                            <div className="admin-progress-label">
                                                                <i className="bi bi-building"></i>
                                                                <span>
                                                                        Penyaluran
                                                                    </span>
                                                            </div>

                                                            {getPlacementStatusBadge(
                                                                registration.placement_status
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ---------------------------------------------------------
                                                        DOCUMENTS
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-document-cell">
                                                        {renderCertificates(
                                                            registration
                                                        )}
                                                    </div>
                                                </td>

                                                {/* ---------------------------------------------------------
                                                        ACTIONS
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-action-buttons">
                                                        <button
                                                            type="button"
                                                            className="view"
                                                            onClick={() =>
                                                                handleViewDetails(
                                                                    registration
                                                                )
                                                            }
                                                            title="Lihat detail peserta"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="edit"
                                                            onClick={() =>
                                                                handleUpdateRegistrationStatus(
                                                                    registration
                                                                )
                                                            }
                                                            title="Update status interview"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* =========================================================
                                MOBILE REGISTRATION LIST
                            ========================================================= */}
                            <div className="admin-registration-mobile-list d-lg-none">
                                {registrations.map(
                                    (
                                        registration
                                    ) => (
                                        <article
                                            className="admin-registration-mobile-card"
                                            key={
                                                registration.id
                                            }
                                        >
                                            {/* ---------------------------------------------------------
                                                MOBILE HEADER
                                            --------------------------------------------------------- */}
                                            <div className="admin-mobile-registration-header">
                                                <div className="admin-participant-cell">
                                                    <div className="admin-participant-photo">
                                                        {registration.photo_path ? (
                                                            <img
                                                                src={`http://localhost:5000${registration.photo_path}`}
                                                                alt={
                                                                    registration.full_name
                                                                }
                                                            />
                                                        ) : (
                                                            <span>
                                                                {getInitials(
                                                                    registration.full_name
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="admin-participant-info">
                                                        <strong>
                                                            {
                                                                registration.full_name
                                                            }
                                                        </strong>

                                                        <span>
                                                            <i className="bi bi-envelope"></i>
                                                            {registration.email ||
                                                                "-"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {getRegistrationStatusBadge(
                                                    registration.registration_status
                                                )}
                                            </div>

                                            {/* ---------------------------------------------------------
                                                MOBILE PROGRAM
                                            --------------------------------------------------------- */}
                                            <div className="admin-mobile-program">
                                                <div className="admin-program-table-icon">
                                                    <i className="bi bi-briefcase"></i>
                                                </div>

                                                <div>
                                                    <span>
                                                        PROGRAM
                                                    </span>

                                                    <strong>
                                                        {registration.program_name ||
                                                            "-"}
                                                    </strong>

                                                    <small>
                                                        {
                                                            registration.registration_code
                                                        }
                                                    </small>
                                                </div>
                                            </div>

                                            {/* ---------------------------------------------------------
                                                MOBILE INFORMATION
                                            --------------------------------------------------------- */}
                                            <div className="admin-mobile-info-grid">
                                                <div>
                                                    <span>
                                                        Tanggal
                                                        Daftar
                                                    </span>

                                                    <strong>
                                                        {helpers.formatDate(
                                                            registration.registration_date
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        Biaya
                                                        Pelatihan
                                                    </span>

                                                    <strong>
                                                        {helpers.formatCurrency(
                                                            registration.program_training_cost
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        Telepon
                                                    </span>

                                                    <strong>
                                                        {registration.phone ||
                                                            "-"}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        Pembayaran
                                                    </span>

                                                    {getPaymentStatusBadge(
                                                        registration.payment_status,
                                                        registration.program_installment_plan
                                                    )}
                                                </div>
                                            </div>

                                            {/* ---------------------------------------------------------
                                                MOBILE PROGRESS
                                            --------------------------------------------------------- */}
                                            <div className="admin-mobile-progress">
                                                <div className="admin-mobile-section-title">
                                                    <i className="bi bi-diagram-3"></i>

                                                    <span>
                                                        Perkembangan
                                                        Peserta
                                                    </span>
                                                </div>

                                                <div className="admin-progress-list">
                                                    <div className="admin-progress-row">
                                                        <div className="admin-progress-label">
                                                            <i className="bi bi-person-check"></i>

                                                            <span>
                                                                Interview
                                                            </span>
                                                        </div>

                                                        {getRegistrationStatusBadge(
                                                            registration.registration_status
                                                        )}
                                                    </div>

                                                    <div className="admin-progress-row">
                                                        <div className="admin-progress-label">
                                                            <i className="bi bi-clipboard-check"></i>

                                                            <span>
                                                                Seleksi
                                                            </span>
                                                        </div>

                                                        {getSelectionStatusBadge(
                                                            registration.selection_status
                                                        )}
                                                    </div>

                                                    <div className="admin-progress-row">
                                                        <div className="admin-progress-label">
                                                            <i className="bi bi-building"></i>

                                                            <span>
                                                                Penyaluran
                                                            </span>
                                                        </div>

                                                        {getPlacementStatusBadge(
                                                            registration.placement_status
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ---------------------------------------------------------
                                                MOBILE DOCUMENTS
                                            --------------------------------------------------------- */}
                                            <div className="admin-mobile-document-row">
                                                <span>
                                                    <i className="bi bi-folder2-open"></i>
                                                    Dokumen
                                                </span>

                                                {renderCertificates(
                                                    registration
                                                )}
                                            </div>

                                            {/* ---------------------------------------------------------
                                                MOBILE ACTIONS
                                            --------------------------------------------------------- */}
                                            <div className="admin-mobile-action-row">
                                                <button
                                                    type="button"
                                                    className="admin-mobile-view-button"
                                                    onClick={() =>
                                                        handleViewDetails(
                                                            registration
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-eye"></i>
                                                    Lihat Detail
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-mobile-edit-button"
                                                    onClick={() =>
                                                        handleUpdateRegistrationStatus(
                                                            registration
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                    Update
                                                    Status
                                                </button>
                                            </div>
                                        </article>
                                    )
                                )}
                            </div>
                        </>
                    )}

                    {/* ---------------------------------------------------------
                        DATABASE FOOTER
                    --------------------------------------------------------- */}
                    <div className="admin-table-footer">
                        <div>
                            <i className="bi bi-database"></i>

                            <span>
                                {
                                    registrations.length
                                }{" "}
                                pendaftar ditampilkan
                            </span>
                        </div>

                        <small>
                            Data diperbarui berdasarkan
                            filter dan pencarian yang
                            aktif.
                        </small>
                    </div>
                </section>
            </div>

            {/* =========================================================
                DETAIL MODAL
            ========================================================= */}
            {showDetailModal &&
                selectedRegistration && (
                    <div
                        className="admin-modal-overlay"
                        onMouseDown={
                            handleCloseModal
                        }
                    >
                        <div
                            className="admin-modal-dialog large"
                            onMouseDown={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <div className="admin-modal-content">
                                {/* ---------------------------------------------------------
                                    DETAIL MODAL HEADER
                                --------------------------------------------------------- */}
                                <div className="admin-modal-header">
                                    <div className="admin-modal-heading">
                                        <div className="admin-modal-avatar">
                                            {selectedRegistration.photo_path ? (
                                                <img
                                                    src={`http://localhost:5000${selectedRegistration.photo_path}`}
                                                    alt={
                                                        selectedRegistration.full_name
                                                    }
                                                />
                                            ) : (
                                                getInitials(
                                                    selectedRegistration.full_name
                                                )
                                            )}
                                        </div>

                                        <div>
                                            <span>
                                                DETAIL
                                                PESERTA
                                            </span>

                                            <h2>
                                                {
                                                    selectedRegistration.full_name
                                                }
                                            </h2>

                                            <p>
                                                {
                                                    selectedRegistration.registration_code
                                                }{" "}
                                                ·{" "}
                                                {
                                                    selectedRegistration.program_name
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="admin-modal-close"
                                        onClick={
                                            handleCloseModal
                                        }
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>

                                {/* ---------------------------------------------------------
                                    DETAIL TABS
                                --------------------------------------------------------- */}
                                <div className="admin-detail-tabs">
                                    <button
                                        type="button"
                                        className={
                                            detailTab ===
                                            "basic"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setDetailTab(
                                                "basic"
                                            )
                                        }
                                    >
                                        <i className="bi bi-person"></i>
                                        Informasi Dasar
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            detailTab ===
                                            "personal"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setDetailTab(
                                                "personal"
                                            )
                                        }
                                    >
                                        <i className="bi bi-person-vcard"></i>
                                        Data Pribadi
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            detailTab ===
                                            "address"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setDetailTab(
                                                "address"
                                            )
                                        }
                                    >
                                        <i className="bi bi-geo-alt"></i>
                                        Alamat
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            detailTab ===
                                            "status"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setDetailTab(
                                                "status"
                                            )
                                        }
                                    >
                                        <i className="bi bi-clipboard-check"></i>
                                        Status & Dokumen
                                    </button>
                                </div>

                                {/* ---------------------------------------------------------
                                    DETAIL MODAL BODY
                                --------------------------------------------------------- */}
                                <div className="admin-modal-body">
                                    {detailTab ===
                                        "basic" && (
                                            <div className="admin-basic-detail-layout">
                                                <div className="admin-detail-section-card">
                                                    <div className="admin-detail-section-heading">
                                                        <div>
                                                            <i className="bi bi-person-lines-fill"></i>
                                                        </div>

                                                        <span>
                                                        <small>
                                                            KONTAK
                                                            PESERTA
                                                        </small>

                                                        <strong>
                                                            Informasi
                                                            Dasar
                                                        </strong>
                                                    </span>
                                                    </div>

                                                    <div className="admin-detail-data-grid">
                                                        <DetailItem
                                                            label="Nama Lengkap"
                                                            value={
                                                                selectedRegistration.full_name
                                                            }
                                                        />

                                                        <DetailItem
                                                            label="Email"
                                                            value={
                                                                selectedRegistration.email
                                                            }
                                                        />

                                                        <DetailItem
                                                            label="Nomor Handphone"
                                                            value={
                                                                selectedRegistration.phone
                                                            }
                                                        />

                                                        <DetailItem
                                                            label="Tanggal Pendaftaran"
                                                            value={helpers.formatDate(
                                                                selectedRegistration.registration_date
                                                            )}
                                                        />

                                                        <DetailItem
                                                            label="Kode Pendaftaran"
                                                            value={
                                                                selectedRegistration.registration_code
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="admin-detail-section-card">
                                                    <div className="admin-detail-section-heading">
                                                        <div>
                                                            <i className="bi bi-briefcase"></i>
                                                        </div>

                                                        <span>
                                                        <small>
                                                            PROGRAM
                                                            PILIHAN
                                                        </small>

                                                        <strong>
                                                            Informasi
                                                            Program
                                                        </strong>
                                                    </span>
                                                    </div>

                                                    <div className="admin-detail-data-grid">
                                                        <DetailItem
                                                            label="Program"
                                                            value={
                                                                selectedRegistration.program_name
                                                            }
                                                        />

                                                        <DetailItem
                                                            label="Biaya Pelatihan"
                                                            value={helpers.formatCurrency(
                                                                selectedRegistration.program_training_cost
                                                            )}
                                                        />

                                                        <DetailItem
                                                            label="Biaya Keberangkatan"
                                                            value={helpers.formatCurrency(
                                                                selectedRegistration.program_departure_cost
                                                            )}
                                                        />

                                                        <DetailItem
                                                            label="Durasi"
                                                            value={
                                                                selectedRegistration.program_duration
                                                            }
                                                        />

                                                        <DetailItem
                                                            label="Lokasi"
                                                            value={
                                                                selectedRegistration.program_location
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {detailTab ===
                                        "personal" &&
                                        renderPersonalInfo(
                                            selectedRegistration
                                        )}

                                    {detailTab ===
                                        "address" &&
                                        renderAddressInfo(
                                            selectedRegistration
                                        )}

                                    {detailTab ===
                                        "status" && (
                                            <>
                                                {/* ---------------------------------------------------------
                                                STATUS OVERVIEW
                                            --------------------------------------------------------- */}
                                                <div className="admin-status-overview-grid">
                                                    <div className="admin-status-overview-card">
                                                        <div>
                                                            <i className="bi bi-person-check"></i>
                                                        </div>

                                                        <span>
                                                        Interview
                                                    </span>

                                                        {getRegistrationStatusBadge(
                                                            selectedRegistration.registration_status
                                                        )}
                                                    </div>

                                                    <div className="admin-status-overview-card">
                                                        <div>
                                                            <i className="bi bi-credit-card"></i>
                                                        </div>

                                                        <span>
                                                        Pembayaran
                                                    </span>

                                                        {getPaymentStatusBadge(
                                                            selectedRegistration.payment_status,
                                                            selectedRegistration.program_installment_plan
                                                        )}

                                                        {Number(
                                                                selectedRegistration.amount_paid ||
                                                                0
                                                            ) >
                                                            0 && (
                                                                <small>
                                                                    {helpers.formatCurrency(
                                                                        selectedRegistration.amount_paid
                                                                    )}
                                                                </small>
                                                            )}
                                                    </div>

                                                    <div className="admin-status-overview-card">
                                                        <div>
                                                            <i className="bi bi-clipboard-check"></i>
                                                        </div>

                                                        <span>
                                                        Seleksi
                                                        Diklat
                                                    </span>

                                                        {getSelectionStatusBadge(
                                                            selectedRegistration.selection_status
                                                        )}
                                                    </div>

                                                    <div className="admin-status-overview-card">
                                                        <div>
                                                            <i className="bi bi-building"></i>
                                                        </div>

                                                        <span>
                                                        Penyaluran
                                                        Kerja
                                                    </span>

                                                        {getPlacementStatusBadge(
                                                            selectedRegistration.placement_status
                                                        )}

                                                        {selectedRegistration.company_name && (
                                                            <small>
                                                                {
                                                                    selectedRegistration.company_name
                                                                }
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* ---------------------------------------------------------
                                                DOCUMENT SECTION
                                            --------------------------------------------------------- */}
                                                <div className="admin-document-section">
                                                    <div className="admin-detail-section-heading">
                                                        <div>
                                                            <i className="bi bi-folder2-open"></i>
                                                        </div>

                                                        <span>
                                                        <small>
                                                            BERKAS
                                                            PESERTA
                                                        </small>

                                                        <strong>
                                                            Dokumen
                                                            &
                                                            Sertifikat
                                                        </strong>
                                                    </span>
                                                    </div>

                                                    <div className="admin-document-card-grid">
                                                        <div className="admin-document-card">
                                                            <div className="photo">
                                                                <i className="bi bi-person-badge"></i>
                                                            </div>

                                                            <span>
                                                            <small>
                                                                FOTO
                                                                PESERTA
                                                            </small>

                                                            <strong>
                                                                Foto
                                                                Profil
                                                            </strong>
                                                        </span>

                                                            {selectedRegistration.photo_path ? (
                                                                <a
                                                                    href={`http://localhost:5000${selectedRegistration.photo_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Lihat
                                                                    <i className="bi bi-arrow-up-right"></i>
                                                                </a>
                                                            ) : (
                                                                <small className="unavailable">
                                                                    Tidak
                                                                    tersedia
                                                                </small>
                                                            )}
                                                        </div>

                                                        <div className="admin-document-card">
                                                            <div className="pdf">
                                                                <i className="bi bi-file-earmark-pdf"></i>
                                                            </div>

                                                            <span>
                                                            <small>
                                                                DOKUMEN
                                                                BAHASA
                                                            </small>

                                                            <strong>
                                                                Sertifikat
                                                                N4
                                                            </strong>
                                                        </span>

                                                            {selectedRegistration.n4_certificate_path ? (
                                                                <a
                                                                    href={`http://localhost:5000${selectedRegistration.n4_certificate_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Lihat
                                                                    <i className="bi bi-arrow-up-right"></i>
                                                                </a>
                                                            ) : (
                                                                <small className="unavailable">
                                                                    Tidak
                                                                    tersedia
                                                                </small>
                                                            )}
                                                        </div>

                                                        <div className="admin-document-card">
                                                            <div className="pdf">
                                                                <i className="bi bi-file-earmark-pdf"></i>
                                                            </div>

                                                            <span>
                                                            <small>
                                                                DOKUMEN
                                                                KOMPETENSI
                                                            </small>

                                                            <strong>
                                                                Sertifikat
                                                                SSW
                                                            </strong>
                                                        </span>

                                                            {selectedRegistration.ssw_certificate_path ? (
                                                                <a
                                                                    href={`http://localhost:5000${selectedRegistration.ssw_certificate_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Lihat
                                                                    <i className="bi bi-arrow-up-right"></i>
                                                                </a>
                                                            ) : (
                                                                <small className="unavailable">
                                                                    Tidak
                                                                    tersedia
                                                                </small>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                </div>

                                {/* ---------------------------------------------------------
                                    DETAIL MODAL FOOTER
                                --------------------------------------------------------- */}
                                <div className="admin-modal-footer">
                                    <button
                                        type="button"
                                        className="admin-secondary-button"
                                        onClick={
                                            handleCloseModal
                                        }
                                    >
                                        Tutup
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-primary-button"
                                        onClick={() =>
                                            handleUpdateRegistrationStatus(
                                                selectedRegistration
                                            )
                                        }
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                        Update Status
                                        Interview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* =========================================================
                STATUS MODAL
            ========================================================= */}
            {showStatusModal &&
                selectedRegistration && (
                    <div
                        className="admin-modal-overlay"
                        onMouseDown={
                            handleCloseModal
                        }
                    >
                        <div
                            className="admin-modal-dialog"
                            onMouseDown={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <div className="admin-modal-content">
                                {/* ---------------------------------------------------------
                                    STATUS MODAL HEADER
                                --------------------------------------------------------- */}
                                <div className="admin-modal-header compact">
                                    <div className="admin-modal-heading">
                                        <div className="admin-modal-heading-icon">
                                            <i className="bi bi-person-check"></i>
                                        </div>

                                        <div>
                                            <span>
                                                INTERVIEW
                                                PESERTA
                                            </span>

                                            <h2>
                                                Update Status
                                                Pendaftaran
                                            </h2>

                                            <p>
                                                {
                                                    selectedRegistration.full_name
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="admin-modal-close"
                                        onClick={
                                            handleCloseModal
                                        }
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>

                                {/* ---------------------------------------------------------
                                    STATUS FORM
                                --------------------------------------------------------- */}
                                <form
                                    onSubmit={
                                        handleStatusSubmit
                                    }
                                >
                                    <div className="admin-modal-body">
                                        {/* ---------------------------------------------------------
                                            PARTICIPANT INFORMATION
                                        --------------------------------------------------------- */}
                                        <div className="admin-status-participant">
                                            <div className="admin-status-participant-avatar">
                                                {getInitials(
                                                    selectedRegistration.full_name
                                                )}
                                            </div>

                                            <div>
                                                <small>
                                                    PESERTA
                                                </small>

                                                <strong>
                                                    {
                                                        selectedRegistration.full_name
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        selectedRegistration.registration_code
                                                    }{" "}
                                                    ·{" "}
                                                    {
                                                        selectedRegistration.program_name
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        {/* ---------------------------------------------------------
                                            INTERVIEW STATUS
                                        --------------------------------------------------------- */}
                                        <div className="admin-modal-field">
                                            <label>
                                                Status
                                                Interview{" "}
                                                <span>
                                                    *
                                                </span>
                                            </label>

                                            <select
                                                value={
                                                    statusForm.registration_status
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setStatusForm(
                                                        (
                                                            previousForm
                                                        ) => ({
                                                            ...previousForm,
                                                            registration_status:
                                                            event
                                                                .target
                                                                .value,
                                                        })
                                                    )
                                                }
                                                required
                                            >
                                                <option value="menunggu">
                                                    Menunggu
                                                    Interview
                                                </option>

                                                <option value="lolos">
                                                    Lolos
                                                    Interview
                                                </option>

                                                <option value="tidak_lolos">
                                                    Tidak
                                                    Lolos
                                                    Interview
                                                </option>
                                            </select>

                                            <small>
                                                <i className="bi bi-info-circle"></i>
                                                Status ini
                                                menentukan
                                                hasil tahap
                                                interview
                                                peserta.
                                            </small>
                                        </div>

                                        {/* ---------------------------------------------------------
                                            INTERVIEW NOTES
                                        --------------------------------------------------------- */}
                                        <div className="admin-modal-field">
                                            <label>
                                                Catatan
                                                Interview
                                            </label>

                                            <textarea
                                                rows="4"
                                                value={
                                                    statusForm.notes
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setStatusForm(
                                                        (
                                                            previousForm
                                                        ) => ({
                                                            ...previousForm,
                                                            notes:
                                                            event
                                                                .target
                                                                .value,
                                                        })
                                                    )
                                                }
                                                placeholder="Tambahkan catatan mengenai hasil interview peserta..."
                                            />

                                            <small>
                                                <i className="bi bi-journal-text"></i>
                                                Catatan
                                                bersifat
                                                opsional dan
                                                akan
                                                tersimpan
                                                pada riwayat
                                                peserta.
                                            </small>
                                        </div>
                                    </div>

                                    {/* ---------------------------------------------------------
                                        STATUS MODAL FOOTER
                                    --------------------------------------------------------- */}
                                    <div className="admin-modal-footer">
                                        <button
                                            type="button"
                                            className="admin-secondary-button"
                                            onClick={
                                                handleCloseModal
                                            }
                                            disabled={
                                                loading
                                            }
                                        >
                                            Batal
                                        </button>

                                        <button
                                            type="submit"
                                            className="admin-primary-button"
                                            disabled={
                                                loading
                                            }
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-lg"></i>
                                                    Simpan
                                                    Status
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

export default AdminDashboard;