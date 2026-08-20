<<<<<<< HEAD
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
   const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStory, setCurrentStory] = useState(0);
  const [successStories, setSuccessStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [storiesError, setStoriesError] = useState("");
  const hasFetched = useRef(false);

  
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchFeaturedPrograms();
    fetchSuccessStories();
  }, []);

  useEffect(() => {
    if (successStories.length > 1) {
      const interval = setInterval(() => {
        setCurrentStory((prev) => (prev + 1) % successStories.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [successStories.length]);

  useEffect(() => {
    if (successStories.length > 0) {
      setCurrentStory(0);
    }
  }, [successStories.length]);


  const fetchFeaturedPrograms = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await axios.get("/api/programs", {
        timeout: 10000,
      });
      if (response.data.success) {
        setFeaturedPrograms(response.data.data.slice(0, 3));
      } else {
        setError("Failed to load programs");
      }
    } catch (error) {
      console.error("Error fetching featured programs:", error);
      if (error.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
      } else if (error.response?.status === 429) {
        setError("Too many requests. Please wait a moment and refresh the page.");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to load programs. Please try again later.";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSuccessStories = async () => {
    try {
      setStoriesError("");
      setStoriesLoading(true);
      const response = await axios.get("/api/success-stories", { timeout: 8000 });
      if (response.data?.success) {
        setSuccessStories(response.data.data);
      } else {
        setStoriesError("Gagal memuat success story");
      }
    } catch (error) {
      console.error("Error fetching success stories:", error);
      const message =
        error.response?.data?.message ||
        "Gagal memuat success story. Silakan coba lagi nanti.";
      setStoriesError(message);
    } finally {
      setStoriesLoading(false);
    }
  };


  const handleWhatsAppClick = () => {
    const waNumber = "6281110119273";
    const waMessage = "Halo Fitalenta, saya tertarik dengan program magang. Mohon info pendaftaran dan langkah selanjutnya. Terima kasih!";

    const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(waMessage)}`;

    // console.log("WhatsApp URL:", waUrl);

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleRetry = () => {
    hasFetched.current = false;
    fetchFeaturedPrograms();
    fetchSuccessStories();
  };

  return (
    <div>
      {/* Hero Section - tetap sama */}
      <section
        className="hero-section position-relative d-flex align-items-center"
        style={{
          minHeight: "92vh",
          backgroundImage: "url('images/hero_home.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-label="Build your dream career hero"
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.59)" }}
          aria-hidden="true"
        ></div>

        <div className="container position-relative text-center text-light">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <h1
                className="fw-bold mb-3"
                style={{
                  fontSize: "clamp(1.6rem, 6vw, 3.4rem)",
                  lineHeight: 1.05,
                }}
              >
                Build your dream career and study With Us
              </h1>
              <p
                className="lead mb-4"
                style={{ fontSize: "clamp(1rem, 2.2vw, 1.25rem)" }}
              >
                Bergabung dengan program Work and Study Abroad kami - dapatkan pengalaman
                nyata, mentorship profesional, dan mulai perjalanan karir yang
                Anda impikan.
              </p>

              <div className="d-flex gap-3 flex-column flex-sm-row justify-content-center">
                <Link
                  to="/register"
                  className="btn btn-lg btn-primary px-4 fw-semibold"
                  role="button"
                  aria-label="Register Now"
                >
                  Register Now
                </Link>

                <Link
                  to="/programs"
                  className="btn btn-lg btn-outline-light px-4"
                  role="button"
                  aria-label="Explore Program"
                >
                  Explore Program
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-4">
        {error && (
          <div className="alert alert-warning alert-dismissible fade show">
            <strong>Perhatian:</strong> {error}
            <div className="mt-2">
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={handleRetry}
              >
                Coba Lagi
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setError("")}
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Memuat program...</p>
          </div>
        )}

        {/* About Us Section - tetap sama */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-uppercase">About Us</h2>
            </div>
            <p className="text-justify">
              FITALENTA adalah lembaga pelatihan dan penyaluran kerja yang
              berfokus pada persiapan serta pendampingan individu untuk
              berkarier di Jepang. Kami menyediakan program pelatihan yang
              komprehensif mencakup bahasa, budaya, serta pengembangan
              keterampilan, sehingga setiap peserta siap menghadapi tantangan
              dunia kerja internasional.
            </p>
            <p className="text-justify">
              Dengan komitmen tinggi terhadap kualitas pendidikan dan integritas
              profesional, FITALENTA tidak hanya menjembatani tenaga kerja
              dengan peluang, tetapi juga mendorong pertumbuhan pribadi serta
              pemahaman lintas budaya. Misi kami adalah menjadi penghubung
              antara Indonesia dan Jepang melalui tenaga kerja yang terampil,
              disiplin, dan bersemangat untuk meraih kesuksesan.
            </p>
          </div>
        </div>

        {/* Program Section */}
        <div className="row mt-5 mb-5">
          <div className="d-flex justify-content-center align-items-center mb-4">
            <h2 className="text-uppercase">Program</h2>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-md p-3">
              <img
                src="images/home_regular.jpg"
                alt="Program Regular"
                className="img-fluid"
              />
              <div className="card-body text-center">
                <h5 className="card-title">Program Regular</h5>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-md p-3">
              <img
                src="images/home_hybrid.jpg"
                alt="Program Hybrid"
                className="img-fluid"
              />
              <div className="card-body text-center">
                <h5 className="card-title">Program Hybrid</h5>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-md p-3">
              <img
                src="images/home_fast_track.jpg"
                alt="Program Fast Track"
                className="img-fluid"
              />
              <div className="card-body text-center">
                <h5 className="card-title">Program Fast Track</h5>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section - tetap sama */}
        <div className="row mt-5">
          <div className="d-flex justify-content-center align-items-center mb-4">
            <h2 className="text-uppercase">Why Choose Us</h2>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-md p-3">
              <div className="card-body text-center">
                <h5 className="card-title">Pelatihan Komprehensif</h5>
                <p className="card-text">
                  Program bahasa, budaya, dan keterampilan yang dirancang khusus
                  untuk bekerja di Jepang.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-md p-3">
              <div className="card-body text-center">
                <h5 className="card-title">Pendampingan Profesional</h5>
                <p className="card-text">
                  Mentor berpengalaman yang mendukung peserta di setiap tahap
                  proses.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-md p-3">
              <div className="card-body text-center">
                <h5 className="card-title">Jaringan Terpercaya</h5>
                <p className="card-text">
                  Kerja sama yang kuat dengan lembaga dan perusahaan di Jepang.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-md p-3">
              <div className="card-body text-center">
                <h5 className="card-title">Komitmen Pada Kesuksesan</h5>
                <p className="card-text">
                  Membekali peserta agar disiplin, terampil, dan percaya diri
                  dalam berkarier.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="row mt-5">
          <div className="col-12 col-lg-10 mx-auto">
            <div className="bg-primary text-white p-4 p-md-5 rounded text-center">
              <h3 className="mb-3 text-uppercase">Success Stories</h3>
              {storiesLoading ? (
                <p className="mb-0">Memuat cerita terbaik alumni kami…</p>
              ) : storiesError ? (
                <p className="text-warning mb-0">{storiesError}</p>
              ) : successStories.length === 0 ? (
                <p className="mb-0">Belum ada testimoni yang ditayangkan.</p>
              ) : (
                <>
                  <div className="position-relative overflow-hidden" style={{ minHeight: "200px" }}>
                    <div
                      className="d-flex transition-all"
                      style={{
                        transform: `translateX(-${currentStory * 100}%)`,
                        transition: "transform 0.5s ease-in-out",
                      }}
                    >
                      {successStories.map((story) => (
                        <div
                          key={story.id}
                          className="w-100 flex-shrink-0 px-2"
                          style={{ minWidth: "100%" }}
                        >
                          <p className="lead mb-4">{story.content}</p>
                          <div className="text-center text-white small">
                            <strong>{story.title || story.name}</strong>
                            {story.excerpt && (
                              <>
                                <br />
                                <span>{story.excerpt}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
                  <div className="d-flex justify-content-center gap-2 mt-3">
                    {successStories.map((story, index) => (
                      <button
                        key={story.id}
                        type="button"
                        className={`indicator-dot ${index === currentStory ? "active" : ""}`}
                        onClick={() => setCurrentStory(index)}
                        aria-label={`Lihat cerita ${story.title || story.name}`}
                      ></button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* **SECTION WHATSAPP YANG DIPERBAIKI ** */}
        <div className="row mt-5">
          <div className="col-12">
            <div
              className="p-4 p-md-5 rounded text-center"
              style={{ background: "#f8f9fa" }}
            >
              <h2 className="mb-3">Unlock Your Future Career Potential!</h2>
              <p className="mb-4">
                Siap memulai langkah pertama menuju karir impian Anda? Hubungi
                kami untuk informasi pendaftaran, jadwal, dan persyaratan.
              </p>

              {/* **TOMBOL WHATSAPP YANG DIPERBAIKI ** */}
              <button
                onClick={handleWhatsAppClick}
                className="btn btn-success btn-lg d-inline-flex align-items-center gap-2"
                aria-label="Chat via WhatsApp"
                style={{
                  backgroundColor: "#25D366",
                  borderColor: "#25D366",
                  fontSize: "1.1rem",
                  padding: "12px 24px"
                }}
              >
                <i className="bi bi-whatsapp fs-4" aria-hidden="true"></i>
                Chat via WhatsApp
              </button>

              {/* **INFO DEBUG (opsional, bisa dihapus di production) ** */}
              {/* <div className="mt-3 small text-muted">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    const waNumber = "6281110119273";
                    const waMessage = "Halo Fitalenta, saya tertarik dengan program magang. Mohon info pendaftaran dan langkah selanjutnya. Terima kasih!";
                    const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(waMessage)}`;
                    console.log("WhatsApp Debug URL:", waUrl);
                    alert(`URL WhatsApp: ${waUrl}\n\nNomor: ${waNumber}\nPesan: ${waMessage}`);
                  }}
                >
                  Debug WhatsApp
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
=======
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

/* =========================================================
   STATIC CONTENT
========================================================= */
const WHATSAPP_NUMBER = "6281110119273";
const WHATSAPP_MESSAGE =
    "Halo Fitalenta, saya tertarik dengan program FITALENTA. Mohon info pendaftaran dan langkah selanjutnya. Terima kasih!";
const SUCCESS_STORIES = [
    {
        id: 1,
        name: "Rendi Adistya Rosdiyana, S.Pd.",
        position: "Towakai Universal Medical Service",
        content:
            "Visa Tokutei Ginou cocok banget buat yang mau coba bidang baru. Visa mudah, peluang kerja banyak (minimal ijazah SMK/sederajat).",
    },
    {
        id: 2,
        name: "Taufan Himawan, S.IP., M.B.A.",
        position: "Trade Negotiator Specialist ASEAN – Japan",
        content:
            "Satu langkah dengan visa studi telah membuka jalan sukses berkarir di Jepang.",
    },
    {
        id: 3,
        name: "Laksamana Rayhan Utomo, B.E., M.Eng.",
        position: "Operations Manager at Hikari Asia Co., Ltd.",
        content:
            "Dari kampus ke karier internasional, Jepang adalah tempat membuktikan kemampuan terbaik.",
    },
    {
        id: 4,
        name: "Satria Rusdiputra, S.T., M.Eng.",
        position: "Research Engineer at Torishima Pump Manufacturing Co. Ltd.",
        content:
            "Kerja di Jepang sebagai Engineer, plus bisa explore Jepang bareng keluarga ke tempat-tempat seru.",
    },
];
const FALLBACK_PROGRAMS = [
    {
        id: "reguler",
        name: "Program Reguler",
        type: "Regular Program",
        description:
            "Skema terbaik untuk persiapan intensif dan komprehensif dengan pembelajaran terarah serta pendampingan peserta.",
        image: "/images/home_regular.jpg",
        icon: "bi-mortarboard",
    },
    {
        id: "asrama",
        name: "Program Asrama",
        type: "Residential Program",
        description:
            "Program pelatihan intensif berasrama dengan pembelajaran terstruktur, pendampingan penuh, serta persiapan bahasa dan budaya kerja.",
        image: "/images/home_asrama.jpg",
        icon: "bi-house-door",
    },
    {
        id: "hybrid",
        name: "Program Hybrid",
        type: "Flexible Learning",
        description:
            "Fleksibilitas pembelajaran virtual dan pemantapan luring dengan pendampingan terstruktur serta dukungan persiapan kerja.",
        image: "/images/home_hybrid.jpg",
        icon: "bi-laptop",
    },
    {
        id: "fast-track",
        name: "Program Fast Track",
        type: "Accelerated Program",
        description:
            "Jalur cepat untuk peserta yang sudah memiliki sertifikat Noryoku Shiken N4 dan Specified Skilled Worker.",
        image: "/images/home_fast_track.jpg",
        icon: "bi-lightning-charge",
    },
    {
        id: "beasiswa",
        name: "Program Beasiswa",
        type: "Scholarship Program",
        description:
            "Program dukungan pembiayaan bagi peserta yang memenuhi persyaratan untuk mengikuti pelatihan dan persiapan kerja.",
        image: "/images/home_beasiswa.jpg",
        icon: "bi-mortarboard-fill",
    },
    {
        id: "gijinkoku",
        name: "Program Gijinkoku",
        type: "Professional Career",
        description:
            "Program persiapan bahasa, kompetensi, dokumen, dan karier profesional untuk peluang kerja melalui jalur Gijinkoku.",
        image: "/images/home_gijinkoku.jpg",
        icon: "bi-briefcase",
    },
    {
        id: "korea",
        name: "Program Korea",
        type: "Korea Career Program",
        description:
            "Program persiapan bahasa, budaya kerja, dokumen, dan kompetensi untuk membuka peluang kerja di Korea Selatan.",
        image: "/images/home_korea.jpg",
        icon: "bi-globe-asia-australia",
    },
];
const WHY_CHOOSE_US = [
    {
        id: 1,
        icon: "bi-journal-check",
        title: "Pelatihan Komprehensif",
        description:
            "Program bahasa, budaya kerja, serta keterampilan yang dirancang untuk mempersiapkan peserta menghadapi dunia kerja internasional.",
    },
    {
        id: 2,
        icon: "bi-person-check",
        title: "Pendampingan Profesional",
        description:
            "Peserta didampingi mentor berpengalaman mulai dari tahap persiapan hingga proses pengembangan kompetensi.",
    },
    {
        id: 3,
        icon: "bi-diagram-3",
        title: "Jaringan Terpercaya",
        description:
            "Membangun koneksi dan kerja sama dengan lembaga serta mitra perusahaan yang mendukung peluang karier peserta.",
    },
    {
        id: 4,
        icon: "bi-trophy",
        title: "Komitmen Pada Kesuksesan",
        description:
            "Kami membangun disiplin, kompetensi, mental kerja, dan kepercayaan diri sebagai fondasi perjalanan karier peserta.",
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
    const value = normalizeProgramName(
        typeof program === "string"
            ? program
            : program?.name ||
            program?.program_name ||
            program?.title ||
            ""
    );
    const order = {
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
    return order[value] ?? 999;
};
const sortPrograms = (programs = []) => {
    return [...programs].sort((a, b) => {
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
const isHybridProgram = (program) => {
    return normalizeProgramName(
        program?.name ||
        program?.program_name ||
        ""
    ).includes("hybrid");
};
const getInstallmentLabel = (program) => {
    if (!program) return "-";
    const plan = program.installment_plan;
    if (!plan || plan === "none") {
        return "Bayar Penuh";
    }
    if (plan === "dp") {
        const amount = Number(program.down_payment || 0);
        return amount > 0
            ? `DP Rp ${Math.round(amount).toLocaleString("id-ID")}`
            : "DP / Uang Muka";
    }
    const match = String(plan).match(/^(\d+)_installments$/);
    if (match) {
        return `${match[1]} Cicilan`;
    }
    return "-";
};
const formatCurrency = (value) => {
    const numericValue = Number(value || 0);
    return `Rp ${Math.round(
        Number.isFinite(numericValue)
            ? numericValue
            : 0
    ).toLocaleString("id-ID")}`;
};

/* =========================================================
   COMPONENT
========================================================= */
const Home = () => {
    const [featuredPrograms, setFeaturedPrograms] = useState([]);
    const [loadingPrograms, setLoadingPrograms] = useState(true);
    const [programError, setProgramError] = useState("");
    const [currentStory, setCurrentStory] = useState(0);
    const [isStoryPaused, setIsStoryPaused] = useState(false);
    const hasFetched = useRef(false);

    /* =========================================================
       FETCH FEATURED PROGRAMS
    ========================================================= */
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchFeaturedPrograms();
    }, []);
    const fetchFeaturedPrograms = async () => {
        try {
            setLoadingPrograms(true);
            setProgramError("");
            const response = await axios.get("/api/programs", {
                timeout: 10000,
            });
            if (response.data?.success) {
                const data = Array.isArray(response.data.data)
                    ? response.data.data
                    : [];
                setFeaturedPrograms(sortPrograms(data));
            } else {
                setFeaturedPrograms([]);
                setProgramError(
                    "Program terbaru belum dapat dimuat"
                );
            }
        } catch (error) {
            console.error(
                "Error fetching featured programs:",
                error
            );
            setFeaturedPrograms([]);
            if (error.code === "ECONNABORTED") {
                setProgramError(
                    "Server membutuhkan waktu terlalu lama untuk merespons"
                );
            } else if (error.response?.status === 429) {
                setProgramError(
                    "Terlalu banyak permintaan. Silakan coba kembali beberapa saat lagi"
                );
            } else {
                setProgramError(
                    error.response?.data?.message ||
                    "Informasi program terbaru belum dapat dimuat"
                );
            }
        } finally {
            setLoadingPrograms(false);
        }
    };

    /* =========================================================
       SUCCESS STORY AUTOPLAY
    ========================================================= */
    useEffect(() => {
        if (
            SUCCESS_STORIES.length <= 1 ||
            isStoryPaused
        ) {
            return undefined;
        }
        const interval = window.setInterval(() => {
            setCurrentStory(
                (prev) =>
                    (prev + 1) %
                    SUCCESS_STORIES.length
            );
        }, 5000);
        return () =>
            window.clearInterval(interval);
    }, [isStoryPaused]);

    /* =========================================================
       PROGRAM DISPLAY
    ========================================================= */
    const displayPrograms = useMemo(() => {
        return FALLBACK_PROGRAMS.map(
            (fallback) => {
                const fallbackIndex =
                    getProgramSortIndex(fallback);
                const apiProgram =
                    featuredPrograms.find(
                        (program) =>
                            getProgramSortIndex(
                                program
                            ) ===
                            fallbackIndex
                    );
                if (!apiProgram) {
                    return {
                        ...fallback,
                        detailId: null,
                        duration: "",
                        training_cost: 0,
                        departure_cost: 0,
                        installment_plan: "none",
                        down_payment: 0,
                        job_matching_cost: 0,
                    };
                }
                return {
                    ...fallback,
                    ...apiProgram,
                    id:
                        apiProgram.id ||
                        fallback.id,
                    detailId:
                        apiProgram.id ||
                        null,
                    name:
                        apiProgram.name ||
                        apiProgram.program_name ||
                        apiProgram.title ||
                        fallback.name,
                    description:
                        apiProgram.description ||
                        apiProgram.program_description ||
                        fallback.description,
                    image:
                    fallback.image,
                    icon:
                    fallback.icon,
                    type:
                    fallback.type,
                };
            }
        );
    }, [featuredPrograms]);

    /* =========================================================
       WHATSAPP
    ========================================================= */
    const handleWhatsAppClick = () => {
        const waUrl =
            `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
                WHATSAPP_MESSAGE
            )}`;
        window.open(
            waUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    /* =========================================================
       RETRY PROGRAM
    ========================================================= */
    const handleRetryPrograms = () => {
        fetchFeaturedPrograms();
    };

    /* =========================================================
       SUCCESS STORY CONTROLS
    ========================================================= */
    const handlePreviousStory = () => {
        setCurrentStory(
            (prev) =>
                (prev -
                    1 +
                    SUCCESS_STORIES.length) %
                SUCCESS_STORIES.length
        );
    };
    const handleNextStory = () => {
        setCurrentStory(
            (prev) =>
                (prev + 1) %
                SUCCESS_STORIES.length
        );
    };

    /* =========================================================
       MAIN RENDER
    ========================================================= */
    return (
        <main className="home-page">
            {/* =====================================================
                HERO
            ====================================================== */}
            <section
                className="home-hero"
                aria-label="FITALENTA career program"
            >
                <div
                    className="home-hero-background"
                    aria-hidden="true"
                ></div>
                <div className="home-container home-hero-container">
                    <div className="home-hero-content">
                        <div className="home-hero-eyebrow">
                            <i
                                className="bi bi-stars"
                                aria-hidden="true"
                            ></i>
                            <span>
                                YOUR CAREER JOURNEY STARTS HERE
                            </span>
                        </div>
                        <h1>
                            Build your
                            <span> dream career</span>
                        </h1>
                        <p className="home-hero-description">
                            Persiapkan perjalanan karier Anda menuju
                            kesempatan internasional melalui pelatihan
                            terstruktur, pendampingan profesional, dan
                            pengembangan kompetensi bersama FITALENTA.
                        </p>
                        <div className="home-hero-actions">
                            <Link
                                to="/register"
                                className="home-primary-button"
                            >
                                <span>
                                    Mulai Sekarang
                                </span>
                                <i
                                    className="bi bi-arrow-right"
                                    aria-hidden="true"
                                ></i>
                            </Link>
                            <Link
                                to="/programs"
                                className="home-secondary-button"
                            >
                                <i
                                    className="bi bi-grid"
                                    aria-hidden="true"
                                ></i>
                                <span>
                                    Jelajahi Program
                                </span>
                            </Link>
                        </div>
                        <div className="home-hero-benefits">
                            <div>
                                <i
                                    className="bi bi-shield-check"
                                    aria-hidden="true"
                                ></i>
                                <span>
                                    Pendampingan terarah
                                </span>
                            </div>
                            <div>
                                <i
                                    className="bi bi-translate"
                                    aria-hidden="true"
                                ></i>
                                <span>
                                    Persiapan bahasa & budaya
                                </span>
                            </div>
                            <div>
                                <i
                                    className="bi bi-briefcase"
                                    aria-hidden="true"
                                ></i>
                                <span>
                                    Fokus kesiapan kerja
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        className="home-hero-card"
                        aria-label="FITALENTA program summary"
                    >
                        <div className="home-hero-card-top">
                            <span className="home-status-dot"></span>
                            <span>
                                FITALENTA CAREER PREPARATION
                            </span>
                        </div>
                        <div className="home-hero-card-icon">
                            <i
                                className="bi bi-rocket-takeoff"
                                aria-hidden="true"
                            ></i>
                        </div>
                        <span className="home-hero-card-eyebrow">
                            PREPARE • DEVELOP • GROW
                        </span>
                        <h2>
                            Persiapkan diri untuk kesempatan yang lebih besar
                        </h2>
                        <p>
                            Bangun kompetensi, kedisiplinan,
                            pemahaman budaya, dan kesiapan profesional
                            sebelum memasuki lingkungan kerja
                            internasional.
                        </p>
                        <div className="home-hero-card-list">
                            <div>
                                <i
                                    className="bi bi-check-circle-fill"
                                    aria-hidden="true"
                                ></i>
                                <span>
                                    Pembelajaran terstruktur
                                </span>
                            </div>
                            <div>
                                <i
                                    className="bi bi-check-circle-fill"
                                    aria-hidden="true"
                                ></i>
                                <span>
                                    Mentor dan pendamping profesional
                                </span>
                            </div>
                            <div>
                                <i
                                    className="bi bi-check-circle-fill"
                                    aria-hidden="true"
                                ></i>
                                <span>
                                    Persiapan menuju dunia kerja internasional
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                ABOUT
            ====================================================== */}
            <section className="home-about-section">
                <div className="home-container">
                    <div className="home-about-layout">
                        <div className="home-about-content">
                            <div className="home-section-eyebrow">
                                <i
                                    className="bi bi-building"
                                    aria-hidden="true"
                                ></i>
                                <span>
                                    ABOUT FITALENTA
                                </span>
                            </div>
                            <h2>
                                Mempersiapkan talenta untuk menghadapi dunia kerja global
                            </h2>
                            <p>
                                FITALENTA adalah lembaga pelatihan dan
                                penyaluran kerja yang berfokus pada
                                persiapan serta pendampingan individu
                                untuk mengembangkan karier internasional.
                            </p>
                            <p>
                                Program kami mencakup pembelajaran bahasa,
                                budaya, pengembangan keterampilan,
                                pembentukan disiplin, serta kesiapan
                                profesional sehingga peserta memiliki
                                fondasi yang lebih kuat untuk menghadapi
                                tantangan dunia kerja.
                            </p>
                            <Link
                                to="/contact"
                                className="home-text-link"
                            >
                                <span>
                                    Kenali FITALENTA lebih dekat
                                </span>
                                <i
                                    className="bi bi-arrow-right"
                                    aria-hidden="true"
                                ></i>
                            </Link>
                        </div>
                        <div className="home-about-panel">
                            <div className="home-about-panel-header">
                                <div className="home-about-panel-icon">
                                    <i
                                        className="bi bi-compass"
                                        aria-hidden="true"
                                    ></i>
                                </div>
                                <div>
                                    <span>
                                        OUR PURPOSE
                                    </span>
                                    <h3>
                                        Menghubungkan potensi dengan peluang
                                    </h3>
                                </div>
                            </div>
                            <div className="home-about-points">
                                <div className="home-about-point">
                                    <span>
                                        01
                                    </span>
                                    <div>
                                        <strong>
                                            Persiapan
                                        </strong>
                                        <p>
                                            Membentuk kemampuan dasar,
                                            bahasa, budaya, dan kesiapan
                                            mental peserta.
                                        </p>
                                    </div>
                                </div>
                                <div className="home-about-point">
                                    <span>
                                        02
                                    </span>
                                    <div>
                                        <strong>
                                            Pendampingan
                                        </strong>
                                        <p>
                                            Mendukung perkembangan peserta
                                            melalui proses sistematis dan
                                            profesional.
                                        </p>
                                    </div>
                                </div>
                                <div className="home-about-point">
                                    <span>
                                        03
                                    </span>
                                    <div>
                                        <strong>
                                            Peluang
                                        </strong>
                                        <p>
                                            Membantu peserta mempersiapkan
                                            langkah menuju kesempatan
                                            karier yang lebih luas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                PROGRAM
            ====================================================== */}
            <section className="home-program-section">
                <div className="home-container">
                    <div className="home-section-header">
                        <div className="home-section-header-content">
                            <div className="home-section-eyebrow">
                                <i
                                    className="bi bi-grid"
                                    aria-hidden="true"
                                ></i>
                                <span>
                                    OUR PROGRAMS
                                </span>
                            </div>
                            <h2>
                                Pilih jalur pembelajaran yang sesuai dengan kebutuhan Anda
                            </h2>
                            <p>
                                Tujuh program FITALENTA dirancang untuk
                                memberikan pengalaman belajar,
                                pendampingan, dan persiapan sesuai tahap
                                perjalanan peserta.
                            </p>
                        </div>
                        <Link
                            to="/programs"
                            className="home-section-action"
                        >
                            <span>
                                Lihat semua program
                            </span>
                            <i
                                className="bi bi-arrow-up-right"
                                aria-hidden="true"
                            ></i>
                        </Link>
                    </div>
                    {programError && (
                        <div className="home-program-notice">
                            <div className="home-program-notice-icon">
                                <i
                                    className="bi bi-info-circle"
                                    aria-hidden="true"
                                ></i>
                            </div>
                            <div className="home-program-notice-content">
                                <strong>
                                    Informasi program terbaru belum tersedia
                                </strong>
                                <span>
                                    Kami tetap menampilkan gambaran
                                    program FITALENTA yang dapat Anda
                                    jelajahi.
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={
                                    handleRetryPrograms
                                }
                            >
                                <i
                                    className="bi bi-arrow-clockwise"
                                    aria-hidden="true"
                                ></i>
                                Coba lagi
                            </button>
                        </div>
                    )}
                    <div className="home-program-grid">
                        {displayPrograms.map(
                            (
                                program,
                                index
                            ) => {
                                const hybrid =
                                    isHybridProgram(
                                        program
                                    );
                                const jobMatching =
                                    Number(
                                        program.job_matching_cost ||
                                        0
                                    );
                                return (
                                    <article
                                        className="home-program-card"
                                        key={
                                            program.id
                                        }
                                    >
                                        <div className="home-program-image">
                                            <img
                                                src={
                                                    program.image
                                                }
                                                alt={
                                                    program.name
                                                }
                                                loading={
                                                    index ===
                                                    0
                                                        ? "eager"
                                                        : "lazy"
                                                }
                                            />
                                            <div className="home-program-image-overlay"></div>
                                            <span className="home-program-number">
                                                {String(
                                                    index +
                                                    1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>
                                            <div className="home-program-type">
                                                <i
                                                    className={`bi ${program.icon}`}
                                                    aria-hidden="true"
                                                ></i>
                                                <span>
                                                    {
                                                        program.type
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="home-program-card-body">
                                            {loadingPrograms && (
                                                <div className="home-program-syncing">
                                                    <span className="home-program-syncing-dot"></span>
                                                    Memuat informasi terbaru
                                                </div>
                                            )}
                                            <h3>
                                                {
                                                    program.name
                                                }
                                            </h3>
                                            <p>
                                                {
                                                    program.description
                                                }
                                            </p>
                                            <div className="home-program-features">
                                                {program.duration && (
                                                    <div>
                                                        <i
                                                            className="bi bi-clock"
                                                            aria-hidden="true"
                                                        ></i>
                                                        <span>
                                                            Durasi{" "}
                                                            {
                                                                program.duration
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                                {Number(
                                                        program.training_cost ||
                                                        0
                                                    ) >
                                                    0 && (
                                                        <div>
                                                            <i
                                                                className="bi bi-wallet2"
                                                                aria-hidden="true"
                                                            ></i>
                                                            <span>
                                                            Pelatihan{" "}
                                                                {formatCurrency(
                                                                    program.training_cost
                                                                )}
                                                        </span>
                                                        </div>
                                                    )}
                                                {hybrid &&
                                                    jobMatching >
                                                    0 && (
                                                        <div>
                                                            <i
                                                                className="bi bi-person-workspace"
                                                                aria-hidden="true"
                                                            ></i>
                                                            <span>
                                                                Job Matching{" "}
                                                                {formatCurrency(
                                                                    jobMatching
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                <div>
                                                    <i
                                                        className="bi bi-arrow-repeat"
                                                        aria-hidden="true"
                                                    ></i>
                                                    <span>
                                                        {getInstallmentLabel(
                                                            program
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link
                                                to={
                                                    program.detailId
                                                        ? `/programs/${program.detailId}`
                                                        : "/programs"
                                                }
                                                className="home-program-link"
                                            >
                                                <span>
                                                    Pelajari program
                                                </span>
                                                <i
                                                    className="bi bi-arrow-right"
                                                    aria-hidden="true"
                                                ></i>
                                            </Link>
                                        </div>
                                    </article>
                                );
                            }
                        )}
                    </div>
                </div>
            </section>

            {/* =====================================================
                WHY CHOOSE US
            ====================================================== */}
            <section className="home-why-section">
                <div className="home-container">
                    <div className="home-section-heading-centered">
                        <div className="home-section-eyebrow">
                            <i
                                className="bi bi-patch-check"
                                aria-hidden="true"
                            ></i>
                            <span>
                                WHY CHOOSE US
                            </span>
                        </div>
                        <h2>
                            Lebih dari sekadar pelatihan
                        </h2>
                        <p>
                            Kami membangun proses persiapan yang membantu
                            peserta berkembang secara kompetensi, mental,
                            dan profesional.
                        </p>
                    </div>
                    <div className="home-why-grid">
                        {WHY_CHOOSE_US.map(
                            (
                                item,
                                index
                            ) => (
                                <article
                                    className="home-why-card"
                                    key={
                                        item.id
                                    }
                                >
                                    <div className="home-why-card-top">
                                        <div className="home-why-icon">
                                            <i
                                                className={`bi ${item.icon}`}
                                                aria-hidden="true"
                                            ></i>
                                        </div>
                                        <span>
                                            {String(
                                                index +
                                                1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>
                                    </div>
                                    <h3>
                                        {
                                            item.title
                                        }
                                    </h3>
                                    <p>
                                        {
                                            item.description
                                        }
                                    </p>
                                    <div className="home-why-line"></div>
                                </article>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* =====================================================
                SUCCESS STORIES
            ====================================================== */}
            <section className="home-story-section">
                <div className="home-container">
                    <div className="home-story-card">
                        <div
                            className="home-story-decoration home-story-decoration-one"
                            aria-hidden="true"
                        ></div>
                        <div
                            className="home-story-decoration home-story-decoration-two"
                            aria-hidden="true"
                        ></div>
                        <div className="home-story-header">
                            <div>
                                <div className="home-story-eyebrow">
                                    <i
                                        className="bi bi-chat-quote"
                                        aria-hidden="true"
                                    ></i>
                                    <span>
                                        SUCCESS STORIES
                                    </span>
                                </div>
                                <h2>
                                    Cerita dari perjalanan mereka
                                </h2>
                            </div>
                            <div className="home-story-controls">
                                <button
                                    type="button"
                                    onClick={
                                        handlePreviousStory
                                    }
                                    aria-label="Testimoni sebelumnya"
                                >
                                    <i
                                        className="bi bi-arrow-left"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                                <button
                                    type="button"
                                    onClick={
                                        handleNextStory
                                    }
                                    aria-label="Testimoni berikutnya"
                                >
                                    <i
                                        className="bi bi-arrow-right"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </div>
                        </div>
                        <div
                            className="home-story-slider"
                            onMouseEnter={() =>
                                setIsStoryPaused(
                                    true
                                )
                            }
                            onMouseLeave={() =>
                                setIsStoryPaused(
                                    false
                                )
                            }
                            onFocus={() =>
                                setIsStoryPaused(
                                    true
                                )
                            }
                            onBlur={() =>
                                setIsStoryPaused(
                                    false
                                )
                            }
                        >
                            <div
                                className="home-story-track"
                                style={{
                                    transform: `translate3d(-${currentStory * 100}%, 0, 0)`,
                                }}
                            >
                                {SUCCESS_STORIES.map(
                                    (
                                        story
                                    ) => (
                                        <article
                                            className="home-story-slide"
                                            key={
                                                story.id
                                            }
                                        >
                                            <div className="home-story-quote">
                                                <i
                                                    className="bi bi-quote"
                                                    aria-hidden="true"
                                                ></i>
                                            </div>
                                            <blockquote>
                                                {
                                                    story.content
                                                }
                                            </blockquote>
                                            <div className="home-story-person">
                                                <div className="home-story-avatar">
                                                    {story.name.charAt(
                                                        0
                                                    )}
                                                </div>
                                                <div>
                                                    <strong>
                                                        {
                                                            story.name
                                                        }
                                                    </strong>
                                                    <span>
                                                        {
                                                            story.position
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    )
                                )}
                            </div>
                        </div>
                        <div
                            className="home-story-pagination"
                            aria-label="Navigasi testimoni"
                        >
                            {SUCCESS_STORIES.map(
                                (
                                    story,
                                    index
                                ) => (
                                    <button
                                        key={
                                            story.id
                                        }
                                        type="button"
                                        className={
                                            currentStory ===
                                            index
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setCurrentStory(
                                                index
                                            )
                                        }
                                        aria-label={`Tampilkan testimoni ${index + 1}`}
                                        aria-current={
                                            currentStory ===
                                            index
                                                ? "true"
                                                : undefined
                                        }
                                    ></button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                CTA
            ====================================================== */}
            <section className="home-cta-section">
                <div className="home-container">
                    <div className="home-cta-card">
                        <div
                            className="home-cta-decoration home-cta-decoration-one"
                            aria-hidden="true"
                        ></div>
                        <div
                            className="home-cta-decoration home-cta-decoration-two"
                            aria-hidden="true"
                        ></div>
                        <div className="home-cta-content">
                            <div className="home-cta-icon">
                                <i
                                    className="bi bi-rocket-takeoff"
                                    aria-hidden="true"
                                ></i>
                            </div>
                            <div>
                                <span>
                                    READY TO START?
                                </span>
                                <h2>
                                    Unlock Your Future Career Potential.
                                </h2>
                                <p>
                                    Konsultasikan program, proses
                                    pendaftaran, jadwal, biaya, dan
                                    persyaratan bersama tim FITALENTA.
                                </p>
                            </div>
                        </div>
                        <div className="home-cta-actions">
                            <button
                                type="button"
                                className="home-whatsapp-button"
                                onClick={
                                    handleWhatsAppClick
                                }
                                aria-label="Hubungi FITALENTA melalui WhatsApp"
                            >
                                <i
                                    className="bi bi-whatsapp"
                                    aria-hidden="true"
                                ></i>
                                <span>
                                    <small>
                                        Konsultasi cepat
                                    </small>
                                    <strong>
                                        Chat via WhatsApp
                                    </strong>
                                </span>
                                <i
                                    className="bi bi-arrow-up-right"
                                    aria-hidden="true"
                                ></i>
                            </button>
                            <Link
                                to="/programs"
                                className="home-cta-program-link"
                            >
                                Lihat Program
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
>>>>>>> perbaikan-website-fitalenta
};

export default Home;