import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import axios from "axios";

import helpers from "../utils/helpers";


/* =========================================================
   CATEGORY FILTERS
========================================================= */

const PROGRAM_FILTERS = [
  {
    key: "penyaluran",
    label: "Penyaluran",
  },
  {
    key: "pelatihan",
    label: "Pelatihan",
  },
  {
    key: "korea",
    label: "Korea",
  },
  {
    key: "amto",
    label: "AMTO",
  },
];


/* =========================================================
   HELPERS
========================================================= */

const normalizeProgramName = (
  value = ""
) => {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[-_\s]+/g, "");
};


const getProgramNameOrder = (
  program
) => {
  const name =
    normalizeProgramName(
      program?.name || ""
    );

  if (
    name.includes("reguler") ||
    name.includes("regular")
  ) {
    return 1;
  }

  if (
    name.includes("asrama")
  ) {
    return 2;
  }

  if (
    name.includes("hybrid")
  ) {
    return 3;
  }

  if (
    name.includes("fasttrack") ||
    name.includes("fast")
  ) {
    return 4;
  }

  if (
    name.includes("beasiswa")
  ) {
    return 5;
  }

  if (
    name.includes("gijinkoku")
  ) {
    return 6;
  }

  if (
    name.includes("jishusei") ||
    name.includes("magang")
  ) {
    return 7;
  }

  if (
    name.includes("ssw") ||
    name.includes("tokutei") ||
    name.includes("ginou")
  ) {
    return 8;
  }

  if (
    name.includes("amto")
  ) {
    return 9;
  }

  if (
    name.includes("hse")
  ) {
    return 10;
  }

  if (
    name.includes("korea")
  ) {
    return 11;
  }

  return 999;
};


const getProgramKey = (
  program
) => {
  const categoryName =
    normalizeProgramName(
      program?.category_name || ""
    );

  if (
    categoryName.includes(
      "penyaluran"
    )
  ) {
    return "penyaluran";
  }

  if (
    categoryName.includes(
      "pelatihan"
    )
  ) {
    return "pelatihan";
  }

  if (
    categoryName.includes(
      "korea"
    )
  ) {
    return "korea";
  }

  if (
    categoryName.includes(
      "amto"
    )
  ) {
    return "amto";
  }

  return "unknown";
};


const getProgramFormatKey = (
  program
) => {
  const format =
    normalizeProgramName(
      program?.program_format ||
        ""
    );

  const programName =
    normalizeProgramName(
      program?.name || ""
    );


  if (
    format === "reguler" ||
    format === "regular"
  ) {
    return "reguler";
  }


  if (
    format === "asrama"
  ) {
    return "asrama";
  }


  if (
    format === "hybrid"
  ) {
    return "hybrid";
  }


  if (
    format === "fasttrack"
  ) {
    return "fasttrack";
  }


  if (
    format === "beasiswa"
  ) {
    return "beasiswa";
  }


  if (
    format === "studi" ||
    format === "study"
  ) {
    return "studi";
  }


  if (
    format === "nonasrama"
  ) {
    return "nonasrama";
  }


  if (
    format === "teknis" ||
    format === "technical"
  ) {
    return "teknis";
  }


  if (
    programName.includes(
      "reguler"
    ) ||
    programName.includes(
      "regular"
    )
  ) {
    return "reguler";
  }


  if (
    programName.includes(
      "asrama"
    )
  ) {
    return "asrama";
  }


  if (
    programName.includes(
      "hybrid"
    )
  ) {
    return "hybrid";
  }


  if (
    programName.includes(
      "fasttrack"
    )
  ) {
    return "fasttrack";
  }


  if (
    programName.includes(
      "beasiswa"
    )
  ) {
    return "beasiswa";
  }


  return "unknown";
};


const sortPrograms = (
  data = []
) => {
  return [...data].sort(
    (a, b) => {
      const first =
        getProgramNameOrder(a);

      const second =
        getProgramNameOrder(b);


      if (
        first !== second
      ) {
        return (
          first - second
        );
      }


      const firstFormat =
        getProgramFormatKey(a);

      const secondFormat =
        getProgramFormatKey(b);


      if (
        firstFormat !==
        secondFormat
      ) {
        return firstFormat.localeCompare(
          secondFormat,
          "id"
        );
      }


      return String(
        a?.name || ""
      ).localeCompare(
        String(
          b?.name || ""
        ),
        "id"
      );
    }
  );
};


const getProgramDisplayName = (
  program
) => {
  return (
    program?.name ||
    "-"
  );
};


const getCategoryDisplayName = (
  program
) => {
  return (
    program?.category_name ||
    "Program"
  );
};


const getProgramFormatDisplayName =
  (program) => {
    return (
      program?.program_format ||
      "-"
    );
  };


const isHybridProgram = (
  program
) => {
  const programFormat =
    normalizeProgramName(
      program?.program_format ||
        ""
    );

  const programName =
    normalizeProgramName(
      program?.name || ""
    );


  return (
    programFormat === "hybrid" ||
    programName.includes(
      "hybrid"
    )
  );
};


const getInstallmentText = (
  program
) => {
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


  if (
    plan === "dp"
  ) {
    const downPayment =
      Number(
        program.down_payment ||
          0
      );


    if (
      downPayment > 0
    ) {
      return `DP ${helpers.formatCurrency(
        downPayment
      )}`;
    }


    return "DP / Uang Muka";
  }


  const installmentMatch =
    String(
      plan
    ).match(
      /^(\d+)_installments$/
    );


  if (
    installmentMatch
  ) {
    return `${installmentMatch[1]} Cicilan`;
  }


  return "-";
};


const getQuotaPercentage = (
  program
) => {
  const capacity =
    Number(
      program?.capacity
    ) || 0;

  const participants =
    Number(
      program?.current_participants
    ) || 0;


  if (
    capacity <= 0
  ) {
    return 0;
  }


  return Math.min(
    100,
    Math.max(
      0,
      (
        participants /
        capacity
      ) * 100
    )
  );
};


/* =========================================================
   PROGRAMS PAGE
========================================================= */

const Programs = () => {
  const [
    programs,
    setPrograms,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("all");


  useEffect(() => {
    fetchPrograms();
  }, []);


  const fetchPrograms =
    async () => {
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
            sortPrograms(
              data
            )
          );
        } else {
          setPrograms([]);

          setError(
            "Gagal memuat data program."
          );
        }

      } catch (err) {
        console.error(
          "Error fetching programs:",
          err
        );


        setPrograms([]);


        setError(
          err.response?.data?.message ||
            "Gagal memuat program. Silakan coba kembali."
        );

      } finally {
        setLoading(false);
      }
    };


  const orderedPrograms =
    useMemo(
      () => {
        return sortPrograms(
          programs
        );
      },
      [programs]
    );


  const availableFilters =
    useMemo(
      () => {
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
      },
      [orderedPrograms]
    );


  const filteredPrograms =
    useMemo(
      () => {
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
      },
      [
        orderedPrograms,
        selectedCategory,
      ]
    );


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        <main className="programs-page">

          <section className="program-page-hero">

            <div className="program-hero-content">

              <h1>
                Program FITALENTA
              </h1>

              <p>
                Temukan program
                pengembangan kompetensi
                dan persiapan karier
                yang sesuai dengan tujuan
                Anda.
              </p>

            </div>

          </section>


          <div className="program-loading">

            <div
              className="spinner-border"
              role="status"
            />

            <strong>
              Memuat program...
            </strong>

            <span>
              Mohon tunggu beberapa saat.
            </span>

          </div>

        </main>


        <ProgramsStyle />
      </>
    );
  }


  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <>
        <main className="programs-page">

          <section className="program-page-hero">

            <div className="program-hero-content">

              <h1>
                Program FITALENTA
              </h1>

              <p>
                Temukan program
                pengembangan kompetensi
                dan persiapan karier
                yang sesuai dengan tujuan
                Anda.
              </p>

            </div>

          </section>


          <div className="program-breadcrumb">

            <div className="program-container">

              <a href="https://www.fitalenta.co.id/">
                Home
              </a>

              <span>
                /
              </span>

              <strong>
                Program
              </strong>

            </div>

          </div>


          <div className="program-error-wrapper">

            <div className="program-error-card">

              <div className="program-error-icon">
                <i className="bi bi-exclamation-triangle" />
              </div>

              <h3>
                Gagal Memuat Program
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={
                  fetchPrograms
                }
              >
                <i className="bi bi-arrow-clockwise" />

                Coba Lagi
              </button>

            </div>

          </div>

        </main>


        <ProgramsStyle />
      </>
    );
  }


  return (
    <>
      <main className="programs-page">

        {/* =========================================
            HERO
        ========================================== */}

        <section className="program-page-hero">

          <div className="program-hero-decoration program-decoration-left" />

          <div className="program-hero-decoration program-decoration-right" />


          <div className="program-hero-content">

            <h1>
              Program FITALENTA
            </h1>

            <p>
              Persiapkan kompetensi,
              karier, dan peluang kerja
              Anda melalui program
              FITALENTA.
            </p>

          </div>

        </section>


        {/* =========================================
            BREADCRUMB
        ========================================== */}

        <div className="program-breadcrumb">

          <div className="program-container">

            <a href="https://www.fitalenta.co.id/">
              Home
            </a>

            <span>
              /
            </span>

            <strong>
              Program
            </strong>

          </div>

        </div>


        {/* =========================================
            CONTENT
        ========================================== */}

        <section className="program-main-section">

          <div className="program-container">

            {/* =====================================
                FILTER
            ====================================== */}

            {availableFilters.length >
              0 && (
              <div className="program-filter-wrapper">

                <button
                  type="button"
                  className={
                    selectedCategory ===
                    "all"
                      ? "program-filter active"
                      : "program-filter"
                  }
                  onClick={() =>
                    setSelectedCategory(
                      "all"
                    )
                  }
                >
                  Semua Program
                </button>


                {availableFilters.map(
                  (category) => (
                    <button
                      key={
                        category.key
                      }
                      type="button"
                      className={
                        selectedCategory ===
                        category.key
                          ? "program-filter active"
                          : "program-filter"
                      }
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
            )}


            {/* =====================================
                PROGRAM GRID
            ====================================== */}

            {filteredPrograms.length ===
            0 ? (

              <div className="program-empty">

                <div className="program-empty-icon">
                  <i className="bi bi-folder2-open" />
                </div>

                <h3>
                  Tidak ada program
                </h3>

                <p>
                  Silakan pilih kategori
                  lain atau hubungi tim
                  FITALENTA.
                </p>

              </div>

            ) : (

              <div className="program-grid">

                {filteredPrograms.map(
                  (program) => {
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
                      <article
                        key={
                          program.id
                        }
                        className="program-card"
                      >

                        {/* CARD TOP */}

                        <div className="program-card-top">

                          <div className="program-card-category">
                            {getCategoryDisplayName(
                              program
                            )}
                          </div>


                          <h3>
                            {getProgramDisplayName(
                              program
                            )}
                          </h3>


                          {program.program_format && (
                            <div className="program-card-format">

                              <span>
                                Format Program
                              </span>

                              <strong>
                                {getProgramFormatDisplayName(
                                  program
                                )}
                              </strong>

                            </div>
                          )}

                        </div>


                        {/* CARD BODY */}

                        <div className="program-card-body">

                          <p className="program-description">
                            {program.description ||
                              "Informasi program belum tersedia."}
                          </p>


                          <div className="program-info">

                            <ProgramInfo
                              icon="bi-calendar3"
                              label="Jadwal"
                              value={
                                program.schedule ||
                                "-"
                              }
                            />


                            <ProgramInfo
                              icon="bi-clock"
                              label="Durasi"
                              value={
                                program.duration ||
                                "-"
                              }
                            />


                            <ProgramInfo
                              icon="bi-geo-alt"
                              label="Lokasi"
                              value={
                                program.location ||
                                "-"
                              }
                            />

                          </div>


                          {/* PRICE */}

                          <div className="program-cost-section">

                            <div className="program-cost-title">

                              <i className="bi bi-wallet2" />

                              Informasi Biaya

                            </div>


                            <div className="program-cost-grid">

                              <div>

                                <span>
                                  Biaya Pelatihan
                                </span>

                                <strong>
                                  {helpers.formatCurrency(
                                    program.training_cost ||
                                      0
                                  )}
                                </strong>

                              </div>


                              <div>

                                <span>
                                  Biaya Keberangkatan
                                </span>

                                <strong>
                                  {helpers.formatCurrency(
                                    program.departure_cost ||
                                      0
                                  )}
                                </strong>

                              </div>

                            </div>


                            {hybrid &&
                              jobMatchingCost >
                                0 && (
                                <div className="program-job-matching">

                                  <span>
                                    Pendampingan Job
                                    Matching
                                  </span>

                                  <strong>
                                    {helpers.formatCurrency(
                                      jobMatchingCost
                                    )}
                                  </strong>

                                </div>
                              )}

                          </div>


                          {/* PAYMENT */}

                          <div className="program-payment-row">

                            <div>

                              <span>
                                Skema Pembayaran
                              </span>

                              <strong>
                                {getInstallmentText(
                                  program
                                )}
                              </strong>

                            </div>


                            <i className="bi bi-credit-card" />

                          </div>


                          {/* QUOTA */}

                          <div className="program-quota">

                            <div className="program-quota-head">

                              <span>
                                <i className="bi bi-people" />
                                Kuota
                              </span>


                              <strong>
                                {program.current_participants ||
                                  0}
                                {" / "}
                                {program.capacity ||
                                  0}
                              </strong>

                            </div>


                            <div className="program-progress">

                              <div
                                style={{
                                  width:
                                    `${quotaPercentage}%`,
                                }}
                              />

                            </div>

                          </div>

                        </div>


                        {/* CARD FOOTER */}

                        <div className="program-card-footer">

                          <Link
                            to={`/program/${program.id}`}
                            className="program-detail-btn"
                          >
                            Detail Program

                            <i className="bi bi-arrow-right" />
                          </Link>


                          <Link
                            to="/register"
                            className="program-register-btn"
                          >
                            Daftar Sekarang
                          </Link>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </section>

      </main>


      <ProgramsStyle />
    </>
  );
};


/* =========================================================
   INFO ITEM
========================================================= */

const ProgramInfo = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="program-info-item">

      <span className="program-info-icon">
        <i className={`bi ${icon}`} />
      </span>


      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
};


/* =========================================================
   STYLE
========================================================= */

const ProgramsStyle = () => {
  return (
    <style>{`

      :root {
        --program-navy: #00294b;
        --program-navy-dark: #001f3a;
        --program-blue: #17578a;
        --program-orange: #e8491d;
        --program-bg: #f6f8fb;
        --program-text: #102a43;
        --program-muted: #66788a;
        --program-border: #e3e8ef;
        --program-white: #ffffff;
      }


      /*
        PENTING:
        halaman program dinaikkan ke belakang
        navbar fixed.

        Karena navbar transparan,
        hero benar-benar terlihat di belakangnya.
      */

      .programs-page {
        width:
          100%;

        margin-top:
          -96px;

        padding-top:
          0;

        background:
          var(
            --program-bg
          );
      }


      .program-container {
        width:
          min(
            1180px,
            calc(
              100% - 40px
            )
          );

        margin:
          0 auto;
      }


      /* =====================================
         HERO
      ====================================== */

      .program-page-hero {
        position:
          relative;

        min-height:
          456px;

        padding-top:
          96px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        text-align:
          center;

        overflow:
          hidden;

        background:
          linear-gradient(
            120deg,
            #06365e 0%,
            #0b4876 52%,
            #1c6497 100%
          );

        color:
          #ffffff;
      }


      .program-hero-content {
        position:
          relative;

        z-index:
          2;

        max-width:
          850px;

        margin:
          0 auto;

        padding:
          70px 24px;
      }


      .program-page-hero h1 {
        margin:
          0;

        font-size:
          clamp(
            42px,
            6vw,
            64px
          );

        line-height:
          1.1;

        font-weight:
          800;

        color:
          #ffffff !important;
      }


      .program-page-hero p {
        max-width:
          760px;

        margin:
          22px
          auto
          0;

        font-size:
          20px;

        line-height:
          1.6;

        color:
          rgba(
            255,
            255,
            255,
            .90
          );
      }


      .program-hero-decoration {
        position:
          absolute;

        border-radius:
          50%;

        border:
          1px
          solid
          rgba(
            255,
            255,
            255,
            .05
          );

        background:
          rgba(
            255,
            255,
            255,
            .04
          );
      }


      .program-decoration-left {
        width:
          320px;

        height:
          320px;

        left:
          -160px;

        bottom:
          -140px;
      }


      .program-decoration-right {
        width:
          330px;

        height:
          330px;

        right:
          -120px;

        top:
          -120px;
      }


      /* =====================================
         BREADCRUMB
      ====================================== */

      .program-breadcrumb {
        display:
          flex;

        align-items:
          center;

        min-height:
          54px;

        background:
          #ffffff;

        border-bottom:
          1px
          solid
          #edf0f5;
      }


      .program-breadcrumb
      .program-container {
        display:
          flex;

        align-items:
          center;

        gap:
          12px;

        font-size:
          14px;
      }


      .program-breadcrumb a {
        color:
          var(
            --program-navy
          );

        font-weight:
          600;

        text-decoration:
          none;
      }


      .program-breadcrumb span {
        color:
          #bcc4cf;
      }


      .program-breadcrumb strong {
        color:
          var(
            --program-muted
          );

        font-weight:
          500;
      }


      /* =====================================
         MAIN SECTION
      ====================================== */

      .program-main-section {
        padding:
          42px
          0
          90px;
      }


      /* =====================================
         FILTER
      ====================================== */

      .program-filter-wrapper {
        display:
          flex;

        justify-content:
          center;

        flex-wrap:
          wrap;

        gap:
          10px;

        margin-bottom:
          40px;
      }


      .program-filter {
        min-height:
          43px;

        padding:
          9px
          20px;

        border:
          1px
          solid
          #d5dce5;

        border-radius:
          999px;

        background:
          #ffffff;

        color:
          var(
            --program-navy
          );

        font-size:
          14px;

        font-weight:
          700;

        cursor:
          pointer;

        transition:
          all
          .25s
          ease;
      }


      .program-filter:hover {
        border-color:
          var(
            --program-orange
          );

        color:
          var(
            --program-orange
          );
      }


      .program-filter.active {
        border-color:
          var(
            --program-orange
          );

        background:
          var(
            --program-orange
          );

        color:
          #ffffff;

        box-shadow:
          0
          7px
          20px
          rgba(
            232,
            73,
            29,
            .18
          );
      }


      /* =====================================
         GRID
      ====================================== */

      .program-grid {
        display:
          grid;

        grid-template-columns:
          repeat(
            3,
            minmax(
              0,
              1fr
            )
          );

        gap:
          26px;

        align-items:
          stretch;
      }


      /* =====================================
         CARD
      ====================================== */

      .program-card {
        display:
          flex;

        flex-direction:
          column;

        min-width:
          0;

        overflow:
          hidden;

        border:
          1px
          solid
          var(
            --program-border
          );

        border-radius:
          20px;

        background:
          #ffffff;

        box-shadow:
          0
          12px
          35px
          rgba(
            0,
            41,
            75,
            .06
          );

        transition:
          transform
          .28s
          ease,
          box-shadow
          .28s
          ease;
      }


      .program-card:hover {
        transform:
          translateY(
            -6px
          );

        box-shadow:
          0
          24px
          48px
          rgba(
            0,
            41,
            75,
            .13
          );
      }


      /* =====================================
         CARD TOP
      ====================================== */

      .program-card-top {
        position:
          relative;

        min-height:
          160px;

        padding:
          28px
          26px;

        overflow:
          hidden;

        background:
          linear-gradient(
            135deg,
            #07365d,
            #185c8f
          );

        color:
          #ffffff;
      }


      .program-card-top::after {
        content:
          "";

        position:
          absolute;

        width:
          150px;

        height:
          150px;

        right:
          -45px;

        top:
          -65px;

        border-radius:
          50%;

        background:
          rgba(
            255,
            255,
            255,
            .07
          );
      }


      .program-card-category {
        position:
          relative;

        z-index:
          2;

        display:
          inline-flex;

        padding:
          7px
          15px;

        border-radius:
          999px;

        background:
          rgba(
            255,
            255,
            255,
            .95
          );

        color:
          var(
            --program-navy
          );

        font-size:
          12px;

        font-weight:
          800;
      }


      .program-card-top h3 {
        position:
          relative;

        z-index:
          2;

        margin:
          18px
          0
          0;

        font-size:
          23px;

        line-height:
          1.25;

        font-weight:
          800;
      }


      .program-card-format {
        position:
          relative;

        z-index:
          2;

        display:
          flex;

        align-items:
          center;

        gap:
          6px;

        margin-top:
          12px;

        color:
          rgba(
            255,
            255,
            255,
            .75
          );

        font-size:
          12px;
      }


      .program-card-format strong {
        color:
          #ffffff;
      }


      /* =====================================
         BODY
      ====================================== */

      .program-card-body {
        display:
          flex;

        flex-direction:
          column;

        flex:
          1;

        padding:
          26px;
      }


      .program-description {
        min-height:
          92px;

        margin:
          0
          0
          24px;

        color:
          #536779;

        font-size:
          14px;

        line-height:
          1.7;
      }


      /* =====================================
         INFO
      ====================================== */

      .program-info {
        display:
          grid;

        gap:
          14px;

        padding-bottom:
          22px;

        border-bottom:
          1px
          solid
          #edf0f4;
      }


      .program-info-item {
        display:
          flex;

        gap:
          12px;

        align-items:
          flex-start;
      }


      .program-info-icon {
        width:
          36px;

        height:
          36px;

        flex:
          0 0 36px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        border-radius:
          10px;

        background:
          #eef5fb;

        color:
          var(
            --program-blue
          );
      }


      .program-info-item div {
        display:
          flex;

        flex-direction:
          column;

        gap:
          2px;
      }


      .program-info-item span {
        color:
          #8593a1;

        font-size:
          11px;
      }


      .program-info-item strong {
        color:
          var(
            --program-text
          );

        font-size:
          13px;

        font-weight:
          700;
      }


      /* =====================================
         COST
      ====================================== */

      .program-cost-section {
        margin-top:
          22px;
      }


      .program-cost-title {
        display:
          flex;

        align-items:
          center;

        gap:
          8px;

        margin-bottom:
          13px;

        color:
          var(
            --program-navy
          );

        font-size:
          13px;

        font-weight:
          800;
      }


      .program-cost-title i {
        color:
          var(
            --program-orange
          );
      }


      .program-cost-grid {
        display:
          grid;

        grid-template-columns:
          repeat(
            2,
            1fr
          );

        gap:
          10px;
      }


      .program-cost-grid > div,
      .program-job-matching {
        padding:
          13px;

        border:
          1px
          solid
          #edf0f4;

        border-radius:
          12px;

        background:
          #fafbfd;
      }


      .program-cost-grid span,
      .program-job-matching span {
        display:
          block;

        margin-bottom:
          5px;

        color:
          #8693a0;

        font-size:
          10px;
      }


      .program-cost-grid strong,
      .program-job-matching strong {
        color:
          var(
            --program-navy
          );

        font-size:
          13px;
      }


      .program-job-matching {
        margin-top:
          10px;
      }


      /* =====================================
         PAYMENT
      ====================================== */

      .program-payment-row {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        margin-top:
          18px;

        padding:
          14px
          15px;

        border-radius:
          13px;

        background:
          #f5f8fb;
      }


      .program-payment-row > div {
        display:
          flex;

        flex-direction:
          column;

        gap:
          2px;
      }


      .program-payment-row span {
        color:
          #8593a0;

        font-size:
          10px;
      }


      .program-payment-row strong {
        color:
          var(
            --program-navy
          );

        font-size:
          13px;
      }


      .program-payment-row > i {
        color:
          var(
            --program-blue
          );

        font-size:
          19px;
      }


      /* =====================================
         QUOTA
      ====================================== */

      .program-quota {
        margin-top:
          18px;
      }


      .program-quota-head {
        display:
          flex;

        justify-content:
          space-between;

        align-items:
          center;

        color:
          var(
            --program-text
          );

        font-size:
          12px;
      }


      .program-quota-head span {
        display:
          flex;

        align-items:
          center;

        gap:
          7px;

        color:
          #66798b;
      }


      .program-progress {
        width:
          100%;

        height:
          7px;

        margin-top:
          9px;

        overflow:
          hidden;

        border-radius:
          999px;

        background:
          #e8edf3;
      }


      .program-progress > div {
        height:
          100%;

        border-radius:
          inherit;

        background:
          linear-gradient(
            90deg,
            #17578a,
            #e8491d
          );

        transition:
          width
          .3s
          ease;
      }


      /* =====================================
         FOOTER
      ====================================== */

      .program-card-footer {
        display:
          grid;

        grid-template-columns:
          1fr
          1fr;

        gap:
          10px;

        padding:
          0
          26px
          26px;
      }


      .program-card-footer a {
        min-height:
          44px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        gap:
          8px;

        border-radius:
          10px;

        font-size:
          13px;

        font-weight:
          800;

        text-decoration:
          none;

        transition:
          all
          .25s
          ease;
      }


      .program-detail-btn {
        border:
          1px
          solid
          var(
            --program-navy
          );

        color:
          var(
            --program-navy
          );

        background:
          #ffffff;
      }


      .program-detail-btn:hover {
        color:
          #ffffff;

        background:
          var(
            --program-navy
          );
      }


      .program-register-btn {
        border:
          1px
          solid
          var(
            --program-orange
          );

        color:
          #ffffff;

        background:
          var(
            --program-orange
          );
      }


      .program-register-btn:hover {
        color:
          #ffffff;

        background:
          #d43f18;

        border-color:
          #d43f18;
      }


      /* =====================================
         EMPTY / ERROR / LOADING
      ====================================== */

      .program-empty,
      .program-error-card,
      .program-loading {
        max-width:
          650px;

        margin:
          70px
          auto;

        padding:
          45px
          30px;

        border:
          1px
          solid
          var(
            --program-border
          );

        border-radius:
          20px;

        background:
          #ffffff;

        text-align:
          center;
      }


      .program-empty-icon,
      .program-error-icon {
        width:
          62px;

        height:
          62px;

        margin:
          0
          auto
          18px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        border-radius:
          16px;

        background:
          #f0f5fa;

        color:
          var(
            --program-navy
          );

        font-size:
          25px;
      }


      .program-empty h3,
      .program-error-card h3 {
        color:
          var(
            --program-navy
          );

        font-weight:
          800;
      }


      .program-empty p,
      .program-error-card p,
      .program-loading span {
        color:
          var(
            --program-muted
          );
      }


      .program-error-card button {
        display:
          inline-flex;

        align-items:
          center;

        gap:
          8px;

        margin-top:
          10px;

        padding:
          11px
          22px;

        border:
          0;

        border-radius:
          9px;

        background:
          var(
            --program-navy
          );

        color:
          #ffffff;

        font-weight:
          700;
      }


      .program-loading {
        display:
          flex;

        flex-direction:
          column;

        align-items:
          center;

        gap:
          10px;

        color:
          var(
            --program-navy
          );
      }


      /* =====================================
         RESPONSIVE
      ====================================== */

      @media (
        max-width: 1050px
      ) {

        .program-grid {
          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );
        }

      }


      @media (
        max-width: 799px
      ) {

        .programs-page {
          margin-top:
            -80px;
        }


        .program-page-hero {
          padding-top:
            80px;

          min-height:
            380px;
        }

      }


      @media (
        max-width: 767px
      ) {

        .program-hero-content {
          padding:
            55px
            20px;
        }


        .program-page-hero p {
          font-size:
            16px;
        }


        .program-main-section {
          padding:
            34px
            0
            70px;
        }


        .program-grid {
          grid-template-columns:
            1fr;
        }


        .program-description {
          min-height:
            auto;
        }

      }


      @media (
        max-width: 520px
      ) {

        .program-container {
          width:
            min(
              calc(
                100% - 28px
              ),
              1180px
            );
        }


        .program-card-footer {
          grid-template-columns:
            1fr;
        }


        .program-cost-grid {
          grid-template-columns:
            1fr;
        }


        .program-filter-wrapper {
          justify-content:
            flex-start;
        }


        .program-filter {
          flex:
            0
            0
            auto;
        }

      }


      @media (
        max-width: 480px
      ) {

        .programs-page {
          margin-top:
            -76px;
        }


        .program-page-hero {
          padding-top:
            76px;

          min-height:
            376px;
        }

      }

    `}</style>
  );
};


export default Programs;
