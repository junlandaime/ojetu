import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import helpers from "../utils/helpers";

/* =========================================================
   PROGRAM UTILITIES
========================================================= */
const normalizeProgramName = (value = "") => {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[-_\s]+/g, "");
};

const isHybridProgram = (program) => {
    const programFormat =
        normalizeProgramName(
            program?.program_format || ""
        );

    const programName =
        normalizeProgramName(
            program?.name || ""
        );

    return (
        programFormat === "hybrid" ||
        programName.includes("hybrid")
    );
};

const getInstallmentText = (program) => {
    if (!program) {
        return "-";
    }

    const plan =
        program.installment_plan;

    if (
        !plan ||
        plan === "none"
    ) {
        return "Bayar Penuh";
    }

    if (plan === "dp") {
        return "DP / Uang Muka";
    }

    const match =
        String(plan).match(
            /^(\d+)_installments$/
        );

    if (match) {
        return `${match[1]} Kali Cicilan`;
    }

    return "-";
};

const getDownPaymentText = (program) => {
    const downPayment =
        Number(
            program?.down_payment ||
            0
        );

    if (downPayment <= 0) {
        return "Tidak Ada";
    }

    return helpers.formatCurrency(
        downPayment
    );
};

const getTotalProgramCost = (program) => {
    if (!program) {
        return 0;
    }

    const training =
        Number(
            program.training_cost ||
            0
        );

    const departure =
        Number(
            program.departure_cost ||
            0
        );

    const jobMatching =
        isHybridProgram(program)
            ? Number(
                program.job_matching_cost ||
                0
            )
            : 0;

    return (
        training +
        departure +
        jobMatching
    );
};

/* =========================================================
   PROGRAM DETAIL
========================================================= */
const ProgramDetail = () => {
    const { id } = useParams();

    const [
        program,
        setProgram,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    /* =========================================================
       FETCH PROGRAM
    ========================================================= */
    useEffect(() => {
        fetchProgram();
    }, [id]);

    const fetchProgram = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await axios.get(
                    `/api/programs/${id}`
                );

            if (
                response.data?.success
            ) {
                setProgram(
                    response.data.data
                );
            } else {
                setProgram(null);

                setError(
                    "Program tidak ditemukan"
                );
            }
        } catch (error) {
            console.error(
                "Error fetching program:",
                error
            );

            setProgram(null);

            setError(
                error.response?.data
                    ?.message ||
                "Gagal memuat detail program"
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       FORMAT TEXT TO LIST
    ========================================================= */
    const formatTextToList = (
        text
    ) => {
        if (!text) {
            return [];
        }

        return String(text)
            .split("\n")
            .map((item) =>
                item
                    .trim()
                    .replace(
                        /^[-•]\s*/,
                        ""
                    )
            )
            .filter(
                (item) =>
                    item !== ""
            );
    };

    /* =========================================================
       PROGRAM IMAGE
    ========================================================= */
    const getProgramHeroImage = () => {
        const programCategory =
            normalizeProgramName(
                program?.category_name ||
                ""
            );

        const programFormat =
            normalizeProgramName(
                program?.program_format ||
                ""
            );

        const programName =
            normalizeProgramName(
                program?.name ||
                ""
            );

        /* =====================================================
           AMTO
        ====================================================== */
        if (
            programCategory.includes(
                "amto"
            )
        ) {
            return "/images/home_amto.jpg";
        }

        /* =====================================================
           KOREA
        ====================================================== */
        if (
            programCategory.includes(
                "korea"
            )
        ) {
            return "/images/home_korea.jpg";
        }

        /* =====================================================
           PELATIHAN / FORMAT
        ====================================================== */
        if (
            programFormat ===
            "asrama" ||
            programName.includes(
                "asrama"
            )
        ) {
            return "/images/home_asrama.jpg";
        }

        if (
            programFormat ===
            "hybrid" ||
            programName.includes(
                "hybrid"
            )
        ) {
            return "/images/home_hybrid.jpg";
        }

        if (
            programFormat ===
            "fasttrack" ||
            programName.includes(
                "fasttrack"
            )
        ) {
            return "/images/home_fast_track.jpg";
        }

        if (
            programFormat ===
            "beasiswa" ||
            programFormat ===
            "studi" ||
            programName.includes(
                "beasiswa"
            )
        ) {
            return "/images/home_beasiswa.jpg";
        }

        /* =====================================================
           PENYALURAN
        ====================================================== */
        if (
            programName.includes(
                "gijinkoku"
            )
        ) {
            return "/images/home_gijinkoku.jpg";
        }

        /* =====================================================
           REGULER / DEFAULT
        ====================================================== */
        if (
            programFormat ===
            "reguler" ||
            programFormat ===
            "regular" ||
            programName.includes(
                "reguler"
            ) ||
            programName.includes(
                "regular"
            )
        ) {
            return "/images/home_regular.jpg";
        }

        return "/images/home_regular.jpg";
    };

    /* =========================================================
       LOADING
    ========================================================= */
    if (loading) {
        return (
            <div className="container mt-5">
                <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-5">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <span className="text-muted">
                        Memuat informasi program...
                    </span>
                </div>
            </div>
        );
    }

    /* =========================================================
       ERROR
    ========================================================= */
    if (
        error ||
        !program
    ) {
        return (
            <div className="container mt-5">
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    <h5>
                        Program tidak dapat dimuat
                    </h5>

                    <p className="mb-0">
                        {error ||
                            "Program tidak ditemukan"}
                    </p>

                    <Link
                        to="/programs"
                        className="btn btn-outline-danger mt-3"
                    >
                        Kembali ke Daftar Program
                    </Link>
                </div>
            </div>
        );
    }

    /* =========================================================
       PROGRAM DATA
    ========================================================= */
    const timelineItems =
        formatTextToList(
            program.timeline_text
        );

    const trainingFeeItems =
        formatTextToList(
            program.training_fee_details
        );

    const departureFeeItems =
        formatTextToList(
            program.departure_fee_details
        );

    const requirementsItems =
        formatTextToList(
            program.requirements_text ||
            program.requirements
        );

    const hybrid =
        isHybridProgram(program);

    const jobMatchingCost =
        Number(
            program.job_matching_cost ||
            0
        );

    const downPayment =
        Number(
            program.down_payment ||
            0
        );

    const totalProgramCost =
        getTotalProgramCost(
            program
        );

    /* =========================================================
       MAIN RENDER
    ========================================================= */
    return (
        <>
            {/* =====================================================
                HERO
            ====================================================== */}
            <section
                className="hero-section position-relative d-flex align-items-center"
                style={{
                    minHeight: "60vh",
                    backgroundImage: `url("${getProgramHeroImage()}")`,
                    backgroundSize:
                        "cover",
                    backgroundPosition:
                        "center",
                    backgroundRepeat:
                        "no-repeat",
                }}
                aria-label={`Program ${program.name}`}
            >
                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(10, 29, 51, 0.86), rgba(23, 54, 93, 0.62))",
                    }}
                    aria-hidden="true"
                />

                <div className="container position-relative text-center text-light">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-9">
                            <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                                <span className="badge bg-light text-primary px-3 py-2">
                                    {program.category_name ||
                                        "PROGRAM FITALENTA"}
                                </span>

                                {program.program_format && (
                                    <span className="badge bg-primary border border-light px-3 py-2">
                                        {program.program_format}
                                    </span>
                                )}
                            </div>

                            <h1 className="fw-bold mb-3 display-4">
                                {
                                    program.name
                                }
                            </h1>

                            <p className="lead mb-4 fs-5">
                                {program.description ||
                                    "Program persiapan karier FITALENTA."}
                            </p>

                            <div className="d-flex gap-3 flex-column flex-sm-row justify-content-center">
                                <Link
                                    to="/register"
                                    className="btn btn-lg btn-light text-primary px-4 fw-semibold"
                                >
                                    Daftar Sekarang
                                </Link>

                                <Link
                                    to="/programs"
                                    className="btn btn-lg btn-outline-light px-4 fw-semibold"
                                >
                                    Lihat Program Lain
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                CONTENT
            ====================================================== */}
            <div className="container mt-5">

                {/* =====================================================
                    OVERVIEW PROGRAM
                ====================================================== */}
                <section className="mb-5">
                    <h2 className="text-center mb-4 text-uppercase fw-bold text-primary">
                        Overview Program
                    </h2>

                    <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm hover-shadow">
                                <div className="card-body text-center p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-calendar3 text-primary fs-1"></i>
                                    </div>

                                    <h5 className="card-title text-uppercase fw-bold">
                                        Jadwal
                                    </h5>

                                    <p className="card-text text-muted mb-0">
                                        {program.schedule ||
                                            "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm hover-shadow">
                                <div className="card-body text-center p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-clock text-primary fs-1"></i>
                                    </div>

                                    <h5 className="card-title text-uppercase fw-bold">
                                        Durasi
                                    </h5>

                                    <p className="card-text text-muted mb-0">
                                        {program.duration ||
                                            "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm hover-shadow">
                                <div className="card-body text-center p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-geo-alt text-primary fs-1"></i>
                                    </div>

                                    <h5 className="card-title text-uppercase fw-bold">
                                        Lokasi
                                    </h5>

                                    <p className="card-text text-muted mb-0">
                                        {program.location ||
                                            "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm hover-shadow">
                                <div className="card-body text-center p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-people text-primary fs-1"></i>
                                    </div>

                                    <h5 className="card-title text-uppercase fw-bold">
                                        Kuota
                                    </h5>

                                    <p className="card-text text-muted mb-0">
                                        {program.current_participants ||
                                            0}{" "}
                                        /{" "}
                                        {program.capacity ||
                                            0}{" "}
                                        Peserta
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    TIMELINE
                ====================================================== */}
                {timelineItems.length >
                    0 && (
                        <section className="mb-5">
                            <h2 className="text-center mb-4 text-uppercase fw-bold text-primary">
                                Timeline Program
                            </h2>

                            <div className="row g-4">
                                {timelineItems.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="col-md-6 col-lg-3"
                                        >
                                            <div className="card h-100 border-0 shadow-sm text-center hover-shadow">
                                                <div className="card-body p-4">
                                                    <div className="mb-3">
                                                        <div
                                                            className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold fs-4"
                                                            style={{
                                                                width:
                                                                    "60px",
                                                                height:
                                                                    "60px",
                                                            }}
                                                        >
                                                            {index +
                                                                1}
                                                        </div>
                                                    </div>

                                                    <p className="card-text text-muted mb-0">
                                                        {
                                                            item
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </section>
                    )}

                {/* =====================================================
                    BIAYA PROGRAM
                ====================================================== */}
                <section className="mb-5">
                    <h2 className="text-center mb-4 text-uppercase fw-bold text-primary">
                        Biaya & Detail Program
                    </h2>

                    <div className="row g-4">
                        <div
                            className={
                                hybrid
                                    ? "col-lg-4"
                                    : "col-lg-6"
                            }
                        >
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-header bg-primary text-white text-center py-3">
                                    <h5 className="card-title mb-0 text-uppercase fw-bold">
                                        Biaya Pelatihan
                                    </h5>

                                    <h4 className="mb-0 fw-bold mt-2">
                                        {helpers.formatCurrency(
                                            program.training_cost ||
                                            0
                                        )}
                                    </h4>
                                </div>

                                <div className="card-body">
                                    {trainingFeeItems.length >
                                    0 ? (
                                        <ul className="list-unstyled mb-0">
                                            {trainingFeeItems.map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <li
                                                        key={
                                                            index
                                                        }
                                                        className="mb-2 d-flex align-items-start"
                                                    >
                                                        <i className="bi bi-check-circle text-success me-2 mt-1"></i>

                                                        <span>
                                                            {
                                                                item
                                                            }
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="text-muted mb-0">
                                            Detail biaya pelatihan belum tersedia.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {hybrid && (
                            <div className="col-lg-4">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-header bg-primary text-white text-center py-3">
                                        <h5 className="card-title mb-0 text-uppercase fw-bold">
                                            Pendampingan Job Matching
                                        </h5>

                                        <h4 className="mb-0 fw-bold mt-2">
                                            {helpers.formatCurrency(
                                                jobMatchingCost
                                            )}
                                        </h4>
                                    </div>

                                    <div className="card-body">
                                        <ul className="list-unstyled mb-0">
                                            <li className="mb-2 d-flex align-items-start">
                                                <i className="bi bi-check-circle text-success me-2 mt-1"></i>

                                                <span>
                                                    Pendampingan pencocokan profil peserta dengan peluang kerja.
                                                </span>
                                            </li>

                                            <li className="mb-2 d-flex align-items-start">
                                                <i className="bi bi-check-circle text-success me-2 mt-1"></i>

                                                <span>
                                                    Pendampingan persiapan seleksi dan proses job matching.
                                                </span>
                                            </li>

                                            <li className="mb-0 d-flex align-items-start">
                                                <i className="bi bi-check-circle text-success me-2 mt-1"></i>

                                                <span>
                                                    Fasilitas khusus Program Hybrid.
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div
                            className={
                                hybrid
                                    ? "col-lg-4"
                                    : "col-lg-6"
                            }
                        >
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-header bg-primary text-white text-center py-3">
                                    <h5 className="card-title mb-0 text-uppercase fw-bold">
                                        Biaya Keberangkatan
                                    </h5>

                                    <h4 className="mb-0 fw-bold mt-2">
                                        {helpers.formatCurrency(
                                            program.departure_cost ||
                                            0
                                        )}
                                    </h4>
                                </div>

                                <div className="card-body">
                                    {departureFeeItems.length >
                                    0 ? (
                                        <ul className="list-unstyled mb-0">
                                            {departureFeeItems.map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <li
                                                        key={
                                                            index
                                                        }
                                                        className="mb-2 d-flex align-items-start"
                                                    >
                                                        <i className="bi bi-check-circle text-success me-2 mt-1"></i>

                                                        <span>
                                                            {
                                                                item
                                                            }
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="text-muted mb-0">
                                            Detail biaya keberangkatan belum tersedia.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    RINGKASAN BIAYA
                ====================================================== */}
                <section className="mb-5">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-light py-3">
                            <h5 className="card-title mb-0 text-uppercase fw-bold text-center text-primary">
                                Ringkasan Biaya & Pembayaran
                            </h5>
                        </div>

                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-md-6 col-lg-3">
                                    <div className="text-center">
                                        <i className="bi bi-wallet2 text-primary fs-2"></i>

                                        <h6 className="mt-2 mb-1">
                                            Biaya Pelatihan
                                        </h6>

                                        <strong>
                                            {helpers.formatCurrency(
                                                program.training_cost ||
                                                0
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                {hybrid && (
                                    <div className="col-md-6 col-lg-3">
                                        <div className="text-center">
                                            <i className="bi bi-person-workspace text-primary fs-2"></i>

                                            <h6 className="mt-2 mb-1">
                                                Job Matching
                                            </h6>

                                            <strong>
                                                {helpers.formatCurrency(
                                                    jobMatchingCost
                                                )}
                                            </strong>
                                        </div>
                                    </div>
                                )}

                                <div className="col-md-6 col-lg-3">
                                    <div className="text-center">
                                        <i className="bi bi-airplane text-primary fs-2"></i>

                                        <h6 className="mt-2 mb-1">
                                            Keberangkatan
                                        </h6>

                                        <strong>
                                            {helpers.formatCurrency(
                                                program.departure_cost ||
                                                0
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                <div className="col-md-6 col-lg-3">
                                    <div className="text-center">
                                        <i className="bi bi-calculator text-primary fs-2"></i>

                                        <h6 className="mt-2 mb-1">
                                            Total Estimasi
                                        </h6>

                                        <strong>
                                            {helpers.formatCurrency(
                                                totalProgramCost
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    PERSYARATAN
                ====================================================== */}
                {requirementsItems.length >
                    0 && (
                        <section className="mb-5">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-primary text-white text-center py-3">
                                    <h5 className="card-title mb-0 text-uppercase fw-bold">
                                        Persyaratan Peserta
                                    </h5>
                                </div>

                                <div className="card-body">
                                    <div className="row">
                                        {requirementsItems.map(
                                            (
                                                requirement,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="col-md-6 mb-3"
                                                >
                                                    <div className="d-flex align-items-start">
                                                        <i className="bi bi-check-circle text-success me-2 mt-1"></i>

                                                        <span>
                                                            {
                                                                requirement
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                {/* =====================================================
                    INFORMASI TAMBAHAN
                ====================================================== */}
                <section className="mb-5">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-primary text-white py-3">
                            <h5 className="card-title mb-0 text-uppercase fw-bold text-center">
                                Informasi Tambahan
                            </h5>
                        </div>

                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start gap-3">
                                        <div>
                                            <i className="bi bi-tags text-primary fs-3"></i>
                                        </div>

                                        <div>
                                            <h6>
                                                Kategori Program
                                            </h6>

                                            <p className="text-muted mb-0">
                                                {program.category_name ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="d-flex align-items-start gap-3">
                                        <div>
                                            <i className="bi bi-grid-3x3-gap text-primary fs-3"></i>
                                        </div>

                                        <div>
                                            <h6>
                                                Tipe / Format Program
                                            </h6>

                                            <p className="text-muted mb-0">
                                                {program.program_format ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="d-flex align-items-start gap-3">
                                        <div>
                                            <i className="bi bi-arrow-repeat text-primary fs-3"></i>
                                        </div>

                                        <div>
                                            <h6>
                                                Skema Pembayaran
                                            </h6>

                                            <p className="text-muted mb-0">
                                                {getInstallmentText(
                                                    program
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="d-flex align-items-start gap-3">
                                        <div>
                                            <i className="bi bi-cash-stack text-primary fs-3"></i>
                                        </div>

                                        <div>
                                            <h6>
                                                DP / Uang Muka
                                            </h6>

                                            <p className="text-muted mb-0">
                                                {getDownPaymentText(
                                                    program
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="d-flex align-items-start gap-3">
                                        <div>
                                            <i className="bi bi-bank text-primary fs-3"></i>
                                        </div>

                                        <div>
                                            <h6>
                                                Dana Talang Keberangkatan
                                            </h6>

                                            <p className="text-muted mb-0">
                                                {program.bridge_fund ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="d-flex align-items-start gap-3">
                                        <div>
                                            <i className="bi bi-people text-primary fs-3"></i>
                                        </div>

                                        <div>
                                            <h6>
                                                Kuota Program
                                            </h6>

                                            <p className="text-muted mb-0">
                                                {program.capacity ||
                                                    0}{" "}
                                                peserta
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {program.installment_plan ===
                                "dp" &&
                                downPayment >
                                0 && (
                                    <div className="alert alert-info mt-4 mb-0">
                                        <div className="d-flex align-items-start gap-2">
                                            <i className="bi bi-info-circle mt-1"></i>

                                            <div>
                                                <strong className="d-block">
                                                    Pembayaran DP
                                                </strong>

                                                <span>
                                                    Pembayaran awal program ini sebesar{" "}
                                                    <strong>
                                                        {helpers.formatCurrency(
                                                            downPayment
                                                        )}
                                                    </strong>
                                                    . Informasi pembayaran selanjutnya akan mengikuti ketentuan program.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {program.contact_info && (
                                <div className="mt-4 pt-4 border-top">
                                    <h6 className="d-flex align-items-center gap-2">
                                        <i className="bi bi-headset text-primary"></i>
                                        Kontak Informasi
                                    </h6>

                                    <div
                                        className="text-muted"
                                        style={{
                                            whiteSpace:
                                                "pre-line",
                                        }}
                                    >
                                        {
                                            program.contact_info
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    CTA
                ====================================================== */}
                <section className="mb-5">
                    <div className="card border-0 bg-primary text-white shadow-sm">
                        <div className="card-body text-center p-5">
                            <i className="bi bi-rocket-takeoff fs-1 mb-3 d-block"></i>

                            <h3 className="fw-bold">
                                Tertarik dengan{" "}
                                {program.name}?
                            </h3>

                            <p className="mb-4 opacity-75">
                                Lengkapi formulir pendaftaran dan mulai
                                proses seleksi bersama FITALENTA.
                            </p>

                            <Link
                                to="/register"
                                className="btn btn-light text-primary fw-semibold px-4 py-2"
                            >
                                Daftar Program
                                <i className="bi bi-arrow-right ms-2"></i>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ProgramDetail;