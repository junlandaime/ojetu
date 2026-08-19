import React, { useEffect, useState } from "react";

const REGISTRATION_TUTORIAL_SEEN_KEY =
    "fitalenta_registration_tutorial_seen";

const REGISTRATION_TUTORIAL_DISABLED_KEY =
    "fitalenta_registration_tutorial_disabled";

const tutorialSteps = [
    {
        number: "01",
        icon: "bi-briefcase",
        eyebrow: "LANGKAH PERTAMA",
        title: "Pilih Program",
        description:
            "Pilih program FITALENTA yang ingin Anda ikuti. Pastikan Anda telah membaca informasi program sebelum melanjutkan proses pendaftaran.",
        checklist: [
            "Periksa nama dan jenis program.",
            "Perhatikan lokasi dan durasi program.",
            "Pastikan program sesuai dengan kebutuhan Anda.",
        ],
    },
    {
        number: "02",
        icon: "bi-person",
        eyebrow: "DATA PESERTA",
        title: "Isi Data Pribadi",
        description:
            "Lengkapi informasi pribadi dan kontak Anda menggunakan data yang benar dan masih aktif.",
        checklist: [
            "Gunakan nama lengkap sesuai identitas.",
            "Masukkan alamat email yang aktif.",
            "Pastikan nomor WhatsApp dapat dihubungi.",
        ],
    },
    {
        number: "03",
        icon: "bi-geo-alt",
        eyebrow: "INFORMASI ALAMAT",
        title: "Lengkapi Alamat",
        description:
            "Isi informasi alamat sesuai tempat tinggal dan data yang diminta pada formulir registrasi.",
        checklist: [
            "Lengkapi seluruh bagian alamat.",
            "Pastikan kota dan provinsi sudah benar.",
            "Periksa kembali alamat sebelum melanjutkan.",
        ],
    },
    {
        number: "04",
        icon: "bi-file-earmark-arrow-up",
        eyebrow: "DOKUMEN PESERTA",
        title: "Unggah Dokumen",
        description:
            "Unggah dokumen persyaratan yang diminta oleh FITALENTA. Pastikan dokumen terlihat jelas dan menggunakan format yang diperbolehkan.",
        checklist: [
            "Gunakan dokumen yang masih berlaku.",
            "Pastikan file tidak buram atau terpotong.",
            "Periksa kembali file sebelum dikirim.",
        ],
    },
    {
        number: "05",
        icon: "bi-clipboard-check",
        eyebrow: "PEMERIKSAAN AKHIR",
        title: "Periksa Data",
        description:
            "Sebelum mengirim pendaftaran, periksa kembali seluruh informasi dan dokumen yang telah Anda masukkan.",
        checklist: [
            "Periksa kembali data pribadi.",
            "Pastikan pilihan program sudah benar.",
            "Pastikan seluruh dokumen telah terunggah.",
        ],
    },
    {
        number: "06",
        icon: "bi-check-circle",
        eyebrow: "LANGKAH TERAKHIR",
        title: "Kirim Pendaftaran",
        description:
            "Jika seluruh data sudah benar, kirim pendaftaran Anda. Setelah itu, data akan diproses sesuai tahapan registrasi FITALENTA.",
        checklist: [
            "Pastikan tidak ada data yang terlewat.",
            "Kirim pendaftaran hanya setelah data benar.",
            "Pantau informasi selanjutnya dari FITALENTA.",
        ],
    },
];

const RegistrationTutorial = ({ formTargetId = "registration-form" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        const hasSeenTutorial =
            localStorage.getItem(REGISTRATION_TUTORIAL_SEEN_KEY) === "true";

        const tutorialDisabled =
            localStorage.getItem(REGISTRATION_TUTORIAL_DISABLED_KEY) === "true";

        if (!hasSeenTutorial && !tutorialDisabled) {
            const timer = window.setTimeout(() => {
                setCurrentStep(0);
                setIsOpen(true);

                localStorage.setItem(
                    REGISTRATION_TUTORIAL_SEEN_KEY,
                    "true"
                );
            }, 700);

            return () => window.clearTimeout(timer);
        }

        return undefined;
    }, []);

    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = "";
            return undefined;
        }

        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, dontShowAgain]);

    const persistPreference = () => {
        if (dontShowAgain) {
            localStorage.setItem(
                REGISTRATION_TUTORIAL_DISABLED_KEY,
                "true"
            );
        }
    };

    const openTutorial = () => {
        setCurrentStep(0);
        setDontShowAgain(false);
        setIsOpen(true);
    };

    const handleClose = () => {
        persistPreference();
        setIsOpen(false);
    };

    const handleNext = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep((previousStep) => previousStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((previousStep) => previousStep - 1);
        }
    };

    const handleStartRegistration = () => {
        persistPreference();
        setIsOpen(false);

        window.setTimeout(() => {
            const registrationForm =
                document.getElementById(formTargetId);

            if (registrationForm) {
                registrationForm.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 250);
    };

    const currentTutorial = tutorialSteps[currentStep];

    const progressPercentage =
        ((currentStep + 1) / tutorialSteps.length) * 100;

    return (
        <>
            {/* =========================================================
                TUTORIAL BANNER
            ========================================================= */}
            <section className="registration-tutorial-banner">
                <div className="registration-tutorial-banner-icon">
                    <i className="bi bi-lightbulb"></i>
                </div>

                <div className="registration-tutorial-banner-content">
                    <span>BARU PERTAMA KALI MENDAFTAR?</span>

                    <strong>
                        Kami sudah menyiapkan panduan registrasi untuk Anda.
                    </strong>

                    <p>
                        Pelajari proses pendaftaran FITALENTA dalam beberapa
                        langkah sederhana sebelum mulai mengisi formulir
                    </p>
                </div>

                <button
                    type="button"
                    className="registration-tutorial-banner-button"
                    onClick={openTutorial}
                >
                    <span>Lihat Panduan</span>
                    <i className="bi bi-arrow-right"></i>
                </button>
            </section>

            {/* =========================================================
                FLOATING HELP
            ========================================================= */}
            <button
                type="button"
                className="registration-tutorial-floating-button"
                onClick={openTutorial}
                aria-label="Buka panduan registrasi"
                title="Panduan Registrasi"
            >
                <i className="bi bi-question-lg"></i>
            </button>

            {/* =========================================================
                TUTORIAL MODAL
            ========================================================= */}
            {isOpen && (
                <div className="registration-tutorial-overlay">
                    <div
                        className="registration-tutorial-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Panduan Registrasi FITALENTA"
                    >
                        <div className="registration-tutorial-modal">
                            {/* Header */}
                            <div className="registration-tutorial-header">
                                <div className="registration-tutorial-heading">
                                    <div className="registration-tutorial-heading-icon">
                                        <i className="bi bi-compass"></i>
                                    </div>

                                    <div>
                                        <span>PANDUAN REGISTRASI</span>

                                        <h2>
                                            Cara Mendaftar di FITALENTA
                                        </h2>

                                        <p>
                                            Ikuti panduan singkat berikut sebelum
                                            memulai proses pendaftaran.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="registration-tutorial-close"
                                    onClick={handleClose}
                                    aria-label="Tutup tutorial"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>

                            {/* Progress */}
                            <div className="registration-tutorial-progress-area">
                                <div className="registration-tutorial-step-list">
                                    {tutorialSteps.map((step, index) => {
                                        const isActive =
                                            index === currentStep;

                                        const isCompleted =
                                            index < currentStep;

                                        return (
                                            <button
                                                type="button"
                                                key={step.number}
                                                className={`registration-tutorial-step ${
                                                    isActive ? "active" : ""
                                                } ${
                                                    isCompleted
                                                        ? "completed"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setCurrentStep(index)
                                                }
                                                aria-label={`Langkah ${
                                                    index + 1
                                                }: ${step.title}`}
                                            >
                                                <span>
                                                    {isCompleted ? (
                                                        <i className="bi bi-check-lg"></i>
                                                    ) : (
                                                        index + 1
                                                    )}
                                                </span>

                                                <small>
                                                    {step.title}
                                                </small>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="registration-tutorial-progress-track">
                                    <div
                                        className="registration-tutorial-progress-bar"
                                        style={{
                                            width: `${progressPercentage}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="registration-tutorial-body">
                                <div className="registration-tutorial-visual">
                                    <div className="registration-tutorial-visual-decoration decoration-one"></div>
                                    <div className="registration-tutorial-visual-decoration decoration-two"></div>

                                    <div className="registration-tutorial-main-icon">
                                        <i
                                            className={`bi ${currentTutorial.icon}`}
                                        ></i>
                                    </div>

                                    <span>
                                        LANGKAH {currentTutorial.number}
                                    </span>

                                    <strong>
                                        {currentTutorial.title}
                                    </strong>
                                </div>

                                <div className="registration-tutorial-information">
                                    <span className="registration-tutorial-eyebrow">
                                        {currentTutorial.eyebrow}
                                    </span>

                                    <h3>
                                        {currentTutorial.title}
                                    </h3>

                                    <p>
                                        {currentTutorial.description}
                                    </p>

                                    <div className="registration-tutorial-checklist">
                                        {currentTutorial.checklist.map(
                                            (item) => (
                                                <div key={item}>
                                                    <span>
                                                        <i className="bi bi-check-lg"></i>
                                                    </span>

                                                    <p>{item}</p>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {currentStep ===
                                        tutorialSteps.length - 1 && (
                                            <div className="registration-tutorial-ready">
                                                <div>
                                                    <i className="bi bi-stars"></i>
                                                </div>

                                                <span>
                                                <strong>
                                                    Anda siap melakukan
                                                    registrasi.
                                                </strong>

                                                <small>
                                                    Silakan lanjutkan ke
                                                    formulir dan lengkapi
                                                    seluruh data yang
                                                    diperlukan.
                                                </small>
                                            </span>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="registration-tutorial-footer">
                                <label className="registration-tutorial-preference">
                                    <input
                                        type="checkbox"
                                        checked={dontShowAgain}
                                        onChange={(event) =>
                                            setDontShowAgain(
                                                event.target.checked
                                            )
                                        }
                                    />

                                    <span>
                                        Jangan tampilkan panduan ini
                                        secara otomatis lagi
                                    </span>
                                </label>

                                <div className="registration-tutorial-actions">
                                    {currentStep > 0 && (
                                        <button
                                            type="button"
                                            className="registration-tutorial-secondary-button"
                                            onClick={handlePrevious}
                                        >
                                            <i className="bi bi-arrow-left"></i>
                                            Sebelumnya
                                        </button>
                                    )}

                                    {currentStep === 0 && (
                                        <button
                                            type="button"
                                            className="registration-tutorial-secondary-button"
                                            onClick={handleClose}
                                        >
                                            Lewati
                                        </button>
                                    )}

                                    {currentStep <
                                    tutorialSteps.length - 1 ? (
                                        <button
                                            type="button"
                                            className="registration-tutorial-primary-button"
                                            onClick={handleNext}
                                        >
                                            Berikutnya
                                            <i className="bi bi-arrow-right"></i>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="registration-tutorial-primary-button"
                                            onClick={handleStartRegistration}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                            Mulai Registrasi
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegistrationTutorial;