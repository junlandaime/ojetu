<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useEffect, useMemo, useState } from "react";
>>>>>>> perbaikan-website-fitalenta
import { Link } from "react-router-dom";
import axios from "axios";
import helpers from "../utils/helpers";

<<<<<<< HEAD
const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get("/api/programs");
      if (response.data.success) {
        setPrograms(response.data.data);
      } else {
        setError("Failed to fetch programs");
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      setError("Error loading programs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(programs.map((p) => p.category_name))];
  const filteredPrograms =
    selectedCategory === "all"
      ? programs
      : programs.filter((p) => p.category_name === selectedCategory);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <div className="text-center mt-3">
          <p>Loading programs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h5>Error Loading Programs</h5>
          <p className="mb-0">{error}</p>
          <button
            className="btn btn-sm btn-outline-danger mt-2"
            onClick={fetchPrograms}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Work and Study Abroad</h2>
              <p className="text-muted">
                Pilih program yang sesuai dengan minat dan kemampuan Anda
              </p>
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-4">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${
                    selectedCategory === "all"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setSelectedCategory("all")}
                >
                  Semua Program
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`btn ${
                      selectedCategory === category
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Programs Grid */}
          <div className="row">
            {filteredPrograms.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  <h5>Tidak ada program yang tersedia</h5>
                  <p className="mb-0">
                    Silakan coba kategori lain atau hubungi administrator.
                  </p>
                </div>
              </div>
            ) : (
              filteredPrograms.map((program) => (
                <div key={program.id} className="col-lg-6 col-xl-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header bg-transparent">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-1">{program.name}</h5>
                        <span className="badge bg-primary">
                          {" "}
                          {program.category_name}{" "}
                        </span>
                      </div>
                    </div>

                    <div className="card-body">
                      <p className="card-text text-muted">
                        {program.description}
                      </p>

                      <div className="program-details">
                        <div className="mb-2">
                          <strong>Jadwal:</strong>
                          <p className="mb-1 small">{program.schedule}</p>
                        </div>

                        <div className="mb-2">
                          <strong>Durasi:</strong>
                          <p className="mb-1 small">{program.duration}</p>
                        </div>

                        <div className="mb-2">
                          <strong>Lokasi:</strong>
                          <p className="mb-1 small">{program.location}</p>
                        </div>

                        {/* FORMAT: Biaya Pelatihan */}
                        <div className="mb-2">
                          <strong>Biaya Pelatihan:</strong>
                          <h6 className="mb-1">
                            {helpers.formatCurrency(program.training_cost)}
                          </h6>
                        </div>

                        {/* FORMAT: Biaya Keberangkatan */}
                        <div className="mb-2">
                          <strong>Biaya Keberangkatan:</strong>
                          <h6 className="mb-1">
                            {helpers.formatCurrency(program.departure_cost)}
                          </h6>
                        </div>

                        <div className="mb-2">
                          <strong>Kuota Tersedia:</strong>
                          <p className="mb-1">
                            <span className="badge bg-primary">
                              {program.current_participants || 0} /{" "}
                              {program.capacity} peserta
                            </span>
                          </p>
                        </div>

                        {program.requirements && (
                          <div className="mb-3">
                            <strong>Persyaratan:</strong>
                            <div className="small text-muted mt-1">
                              {program.requirements
                                .split("\n")
                                .map((req, index) => (
                                  <div key={index}> {req}</div>
                                ))}
                            </div>
                          </div>
                        )}

                        {program.contact_info && (
                          <div className="mb-3">
                            <strong>Kontak:</strong>
                            <p className="small text-muted mb-1">
                              {program.contact_info}
                            </p>
                          </div>
                        )}

                        <div className="mb-2">
                          <strong>Dana Talang:</strong>
                          <p className="mb-1 small text-primary">
                            {program.bridge_fund}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer bg-transparent">
                      <div className="d-grid gap-2">
                        <Link
                          to={`/program/${program.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Lihat Detail
                        </Link>
                        <Link to="/register" className="btn btn-primary">
                          Daftar Program Ini
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Programs;
=======
/* =========================================================
   PROGRAM ORDER
========================================================= */
const PROGRAM_FILTERS = [
    {
        key: "reguler",
        label: "Reguler",
        fullName: "Program Reguler",
        order: 1,
    },
    {
        key: "asrama",
        label: "Asrama",
        fullName: "Program Asrama",
        order: 2,
    },
    {
        key: "hybrid",
        label: "Hybrid",
        fullName: "Program Hybrid",
        order: 3,
    },
    {
        key: "fasttrack",
        label: "Fast Track",
        fullName: "Program Fast Track",
        order: 4,
    },
    {
        key: "beasiswa",
        label: "Beasiswa",
        fullName: "Program Beasiswa",
        order: 5,
    },
    {
        key: "gijinkoku",
        label: "Gijinkoku",
        fullName: "Program Gijinkoku",
        order: 6,
    },
    {
        key: "korea",
        label: "Korea",
        fullName: "Program Korea",
        order: 7,
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
const getProgramKey = (program) => {
    const values = [
        program?.name,
        program?.category_name,
    ].map((value) =>
        normalizeProgramName(value)
    );
    if (
        values.some(
            (value) =>
                value.includes("reguler") ||
                value.includes("regular")
        )
    ) {
        return "reguler";
    }
    if (
        values.some((value) =>
            value.includes("asrama")
        )
    ) {
        return "asrama";
    }
    if (
        values.some((value) =>
            value.includes("hybrid")
        )
    ) {
        return "hybrid";
    }
    if (
        values.some((value) =>
            value.includes("fasttrack")
        )
    ) {
        return "fasttrack";
    }
    if (
        values.some((value) =>
            value.includes("beasiswa")
        )
    ) {
        return "beasiswa";
    }
    if (
        values.some((value) =>
            value.includes("gijinkoku")
        )
    ) {
        return "gijinkoku";
    }
    if (
        values.some((value) =>
            value.includes("korea")
        )
    ) {
        return "korea";
    }
    return "unknown";
};
const getProgramConfig = (program) => {
    const key = getProgramKey(program);
    return PROGRAM_FILTERS.find(
        (item) => item.key === key
    );
};
const getProgramOrder = (program) => {
    const databaseOrder = Number(
        program?.sort_order
    );
    if (
        Number.isFinite(databaseOrder) &&
        databaseOrder >= 1 &&
        databaseOrder <= 7
    ) {
        return databaseOrder;
    }
    const config =
        getProgramConfig(program);
    return config?.order || 999;
};
const sortPrograms = (data = []) => {
    return [...data].sort((a, b) => {
        const first =
            getProgramOrder(a);
        const second =
            getProgramOrder(b);
        if (first !== second) {
            return first - second;
        }
        return String(
            a?.name || ""
        ).localeCompare(
            String(b?.name || ""),
            "id"
        );
    });
};
const getProgramDisplayName = (program) => {
    const config =
        getProgramConfig(program);
    return (
        config?.fullName ||
        program?.name ||
        "-"
    );
};
const getCategoryDisplayName = (program) => {
    const config =
        getProgramConfig(program);
    return (
        config?.label ||
        program?.category_name ||
        "-"
    );
};
const isHybridProgram = (program) => {
    return (
        getProgramKey(program) ===
        "hybrid"
    );
};
const getInstallmentText = (program) => {
    if (!program) {
        return "-";
    }
    const plan =
        program.installment_plan;
    if (!plan || plan === "none") {
        return "Bayar Penuh";
    }
    if (plan === "dp") {
        const downPayment = Number(
            program.down_payment || 0
        );
        if (downPayment > 0) {
            return `DP ${helpers.formatCurrency(
                downPayment
            )}`;
        }
        return "DP / Uang Muka";
    }
    const installmentMatch =
        String(plan).match(
            /^(\d+)_installments$/
        );
    if (installmentMatch) {
        return `${installmentMatch[1]} Cicilan`;
    }
    return "-";
};
const getQuotaPercentage = (program) => {
    const capacity =
        Number(program?.capacity) || 0;
    const participants =
        Number(
            program?.current_participants
        ) || 0;
    if (capacity <= 0) {
        return 0;
    }
    return Math.min(
        100,
        Math.max(
            0,
            (participants /
                capacity) *
            100
        )
    );
};

/* =========================================================
   PROGRAMS
========================================================= */
const Programs = () => {
    const [programs, setPrograms] =
        useState([]);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] =
        useState("");
    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState("all");

    /* =========================================================
       INITIAL DATA
    ========================================================= */
    useEffect(() => {
        fetchPrograms();
    }, []);

    /* =========================================================
       FETCH PROGRAMS
    ========================================================= */
    const fetchPrograms = async () => {
        try {
            setLoading(true);
            setError("");
            const response =
                await axios.get(
                    "/api/programs"
                );
            if (
                response.data?.success
            ) {
                const data =
                    Array.isArray(
                        response.data.data
                    )
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
                "Gagal memuat program. Silakan coba kembali."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       ORDERED PROGRAMS
    ========================================================= */
    const orderedPrograms =
        useMemo(() => {
            return sortPrograms(
                programs
            );
        }, [programs]);

    /* =========================================================
       AVAILABLE FILTERS
    ========================================================= */
    const availableFilters =
        useMemo(() => {
            return PROGRAM_FILTERS.filter(
                (filter) =>
                    orderedPrograms.some(
                        (program) =>
                            getProgramKey(
                                program
                            ) ===
                            filter.key
                    )
            );
        }, [orderedPrograms]);

    /* =========================================================
       FILTERED PROGRAMS
    ========================================================= */
    const filteredPrograms =
        useMemo(() => {
            if (
                selectedCategory ===
                "all"
            ) {
                return orderedPrograms;
            }
            return orderedPrograms.filter(
                (program) =>
                    getProgramKey(
                        program
                    ) ===
                    selectedCategory
            );
        }, [
            orderedPrograms,
            selectedCategory,
        ]);

    /* =========================================================
       LOADING
    ========================================================= */
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary mb-3"></div>
                <h5>
                    Memuat program...
                </h5>
            </div>
        );
    }

    /* =========================================================
       ERROR
    ========================================================= */
    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center">
                    <h4>
                        Gagal Memuat Program
                    </h4>
                    <p>
                        {error}
                    </p>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={
                            fetchPrograms
                        }
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    /* =========================================================
       MAIN RENDER
    ========================================================= */
    return (
        <div className="programs-page">
            <div className="container py-5">

                {/* =========================================================
                    PAGE HEADER
                ========================================================= */}
                <div className="text-center mb-5">
                    <h1 className="fw-bold">
                        Program FITALENTA Tersedia
                    </h1>
                    <p className="text-muted">
                        Pilih program yang sesuai dengan minat dan kemampuan Anda
                    </p>
                </div>

                {/* =========================================================
                    FILTER
                ========================================================= */}
                {availableFilters.length >
                    0 && (
                        <div className="mb-4">
                            <div
                                className="btn-group"
                                role="group"
                            >
                                <button
                                    type="button"
                                    className={`btn ${
                                        selectedCategory ===
                                        "all"
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                    }`}
                                    onClick={() =>
                                        setSelectedCategory(
                                            "all"
                                        )
                                    }
                                >
                                    Semua Program
                                </button>
                                {availableFilters.map(
                                    (
                                        category
                                    ) => (
                                        <button
                                            key={
                                                category.key
                                            }
                                            type="button"
                                            className={`btn ${
                                                selectedCategory ===
                                                category.key
                                                    ? "btn-primary"
                                                    : "btn-outline-primary"
                                            }`}
                                            onClick={() =>
                                                setSelectedCategory(
                                                    category.key
                                                )
                                            }
                                        >
                                            {
                                                category.label
                                            }
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                {/* =========================================================
                    PROGRAM LIST
                ========================================================= */}
                <div className="row">
                    {filteredPrograms.length ===
                    0 ? (
                        <div className="col-12">
                            <div className="alert alert-info text-center">
                                <h5>
                                    Tidak ada program yang tersedia
                                </h5>
                                <p className="mb-0">
                                    Silakan coba kategori lain atau hubungi administrator.
                                </p>
                            </div>
                        </div>
                    ) : (
                        filteredPrograms.map(
                            (
                                program
                            ) => {
                                const hybrid =
                                    isHybridProgram(
                                        program
                                    );
                                const jobMatchingCost =
                                    Number(
                                        program.job_matching_cost ||
                                        0
                                    );
                                const quotaPercentage =
                                    getQuotaPercentage(
                                        program
                                    );
                                return (
                                    <div
                                        key={
                                            program.id
                                        }
                                        className="col-xl-4 col-lg-4 col-md-6 mb-4 d-flex"
                                    >
                                        <div className="program-card w-100">

                                            {/* =========================================================
                                                CARD HEADER
                                            ========================================================= */}
                                            <div className="program-header">
                                                <span className="program-badge">
                                                    {getCategoryDisplayName(
                                                        program
                                                    )}
                                                </span>
                                                <h5 className="program-title">
                                                    {getProgramDisplayName(
                                                        program
                                                    )}
                                                </h5>
                                            </div>

                                            {/* =========================================================
                                                CARD BODY
                                            ========================================================= */}
                                            <div className="card-body">
                                                <p className="program-description">
                                                    {program.description ||
                                                        "Informasi program belum tersedia."}
                                                </p>
                                                <div className="program-info-grid">
                                                    <div className="info-item">
                                                        <h6>
                                                            <i className="bi bi-calendar-event me-2"></i>
                                                            Jadwal
                                                        </h6>
                                                        <p>
                                                            {program.schedule ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                    <div className="info-item">
                                                        <h6>
                                                            <i className="bi bi-clock-history me-2"></i>
                                                            Durasi
                                                        </h6>
                                                        <p>
                                                            {program.duration ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                    <div className="info-item">
                                                        <h6>
                                                            <i className="bi bi-geo-alt-fill me-2"></i>
                                                            Lokasi
                                                        </h6>
                                                        <p>
                                                            {program.location ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* =========================================================
                                                    COST
                                                ========================================================= */}
                                                <div className="program-price-wrapper">
                                                    <div className="program-price-box">
                                                        <small>
                                                            <i className="bi bi-mortarboard-fill me-1"></i>
                                                            Biaya Pelatihan
                                                        </small>
                                                        <h6>
                                                            {helpers.formatCurrency(
                                                                program.training_cost ||
                                                                0
                                                            )}
                                                        </h6>
                                                    </div>
                                                    <div className="program-price-box">
                                                        <small>
                                                            <i className="bi bi-airplane-fill me-1"></i>
                                                            Biaya Keberangkatan
                                                        </small>
                                                        <h6>
                                                            {helpers.formatCurrency(
                                                                program.departure_cost ||
                                                                0
                                                            )}
                                                        </h6>
                                                    </div>
                                                </div>

                                                {/* =========================================================
                                                    HYBRID JOB MATCHING
                                                ========================================================= */}
                                                {hybrid &&
                                                    jobMatchingCost >
                                                    0 && (
                                                        <div className="program-price-wrapper mt-2">
                                                            <div className="program-price-box w-100">
                                                                <small>
                                                                    <i className="bi bi-person-workspace me-1"></i>
                                                                    Pendampingan Job Matching
                                                                </small>
                                                                <h6>
                                                                    {helpers.formatCurrency(
                                                                        jobMatchingCost
                                                                    )}
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    )}

                                                {/* =========================================================
                                                    PAYMENT PLAN
                                                ========================================================= */}
                                                <div className="info-item mt-3">
                                                    <h6>
                                                        <i className="bi bi-wallet2 me-2"></i>
                                                        Skema Pembayaran
                                                    </h6>
                                                    <p>
                                                        {getInstallmentText(
                                                            program
                                                        )}
                                                    </p>
                                                </div>

                                                {/* =========================================================
                                                    QUOTA
                                                ========================================================= */}
                                                <div className="quota-box">
                                                    <div className="d-flex justify-content-between">
                                                        <span>
                                                            <i className="bi bi-people-fill me-2"></i>
                                                            Kuota
                                                        </span>
                                                        <span>
                                                            {program.current_participants ||
                                                                0}
                                                            /
                                                            {program.capacity ||
                                                                0}
                                                        </span>
                                                    </div>
                                                    <div className="progress mt-2">
                                                        <div
                                                            className="progress-bar"
                                                            style={{
                                                                width: `${quotaPercentage}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* =========================================================
                                                CARD FOOTER
                                            ========================================================= */}
                                            <div className="card-footer bg-white border-0">
                                                <Link
                                                    to={`/program/${program.id}`}
                                                    className="btn btn-outline-primary w-100 mb-2"
                                                >
                                                    <i className="bi bi-eye-fill me-2"></i>
                                                    Detail Program
                                                </Link>
                                                <Link
                                                    to="/register"
                                                    className="btn btn-primary w-100"
                                                >
                                                    <i className="bi bi-pencil-square me-2"></i>
                                                    Daftar Sekarang
                                                </Link>
                                                <div className="program-footer-text">
                                                    Program resmi persiapan kerja ke luar negeri
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Programs;
>>>>>>> perbaikan-website-fitalenta
