import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { register, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
        }
    }, [isAuthenticated, isAdmin, authLoading, navigate]);

    const passwordChecks = useMemo(
        () => ({
            length: formData.password.length >= 6,
            letter: /[A-Za-z]/.test(formData.password),
            number: /\d/.test(formData.password),
            match:
                formData.confirmPassword.length > 0 &&
                formData.password === formData.confirmPassword,
        }),
        [formData.password, formData.confirmPassword]
    );

    const passwordStrength = useMemo(() => {
        if (!formData.password) {
            return {
                label: "Belum diisi",
                level: 0,
                className: "",
            };
        }

        let score = 0;

        if (formData.password.length >= 6) score += 1;
        if (formData.password.length >= 8) score += 1;
        if (/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password)) {
            score += 1;
        }
        if (/\d/.test(formData.password)) score += 1;
        if (/[^A-Za-z0-9]/.test(formData.password)) score += 1;

        if (score <= 1) {
            return {
                label: "Lemah",
                level: 1,
                className: "weak",
            };
        }

        if (score <= 3) {
            return {
                label: "Cukup",
                level: 2,
                className: "medium",
            };
        }

        return {
            label: "Kuat",
            level: 3,
            className: "strong",
        };
    }, [formData.password]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const handlePhoneChange = (e) => {
        const numericValue = e.target.value.replace(/\D/g, "").slice(0, 15);

        setFormData((prev) => ({
            ...prev,
            phone: numericValue,
        }));

        if (error) {
            setError("");
        }
    };

    const validateForm = () => {
        const fullName = formData.full_name.trim();
        const email = formData.email.trim();

        if (!fullName || !email || !formData.password || !formData.confirmPassword) {
            return "Semua field yang bertanda * harus diisi.";
        }

        if (fullName.length < 3) {
            return "Nama lengkap minimal terdiri dari 3 karakter.";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return "Format email tidak valid.";
        }

        if (formData.password.length < 6) {
            return "Password harus minimal 6 karakter.";
        }

        if (formData.password !== formData.confirmPassword) {
            return "Password dan konfirmasi password tidak sama.";
        }

        if (formData.phone && formData.phone.length < 10) {
            return "Nomor telepon minimal terdiri dari 10 digit.";
        }

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
            return;
        }

        setLoading(true);

        try {
            const submitData = {
                full_name: formData.full_name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                phone: formData.phone.trim(),
                address: formData.address.trim(),
            };

            const result = await register(submitData);

            if (!result.success) {
                setError(
                    result.message ||
                    "Registrasi belum berhasil. Silakan periksa kembali data Anda."
                );

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
        } catch (err) {
            console.error("Register error:", err);

            setError(
                "Terjadi kendala saat membuat akun. Silakan coba kembali beberapa saat lagi."
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <main className="register-page">
                <div className="register-loading">
                    <div className="register-loading-card">
                        <div className="register-loading-icon">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <strong>Memeriksa autentikasi</strong>
                        <span>Mohon tunggu beberapa saat...</span>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="register-page">
            <div className="register-decoration register-decoration-left" />
            <div className="register-decoration register-decoration-right" />

            <div className="register-shell">
                {/* HERO */}
                <section className="register-hero">
                    <div className="register-hero-eyebrow">
                        <i className="bi bi-stars" aria-hidden="true" />
                        <span>PORTAL PESERTA FITALENTA</span>
                    </div>

                    <h1>Mulai Perjalanan Anda Bersama FITALENTA</h1>

                    <p className="register-hero-description">
                        Buat akun peserta untuk mendaftar program, melengkapi data diri,
                        mengunggah dokumen, dan memantau proses pendaftaran Anda
                    </p>

                    <div className="register-hero-benefits">
                        <div className="register-benefit-item">
                            <span className="register-benefit-icon">
                                <i className="bi bi-lightning-charge" aria-hidden="true" />
                            </span>

                            <span>Pendaftaran cepat</span>
                        </div>

                        <div className="register-benefit-item">
                            <span className="register-benefit-icon">
                                <i className="bi bi-shield-check" aria-hidden="true" />
                            </span>

                            <span>Data terlindungi</span>
                        </div>

                        <div className="register-benefit-item">
                            <span className="register-benefit-icon">
                                <i className="bi bi-briefcase" aria-hidden="true" />
                            </span>

                            <span>Siap memilih program</span>
                        </div>
                    </div>
                </section>

                {/* REGISTER CARD */}
                <section className="register-card">
                    <header className="register-card-header">
                        <div className="register-card-header-icon">
                            <i className="bi bi-person-plus" aria-hidden="true" />
                        </div>

                        <div className="register-card-header-content">
                            <span className="register-card-eyebrow">AKUN PESERTA BARU</span>

                            <h2>Registrasi Akun Peserta</h2>

                            <p>
                                Lengkapi informasi berikut untuk membuat akun FITALENTA Anda
                            </p>
                        </div>
                    </header>

                    <div className="register-card-body">
                        {error && (
                            <div className="register-error" role="alert">
                                <div className="register-error-icon">
                                    <i
                                        className="bi bi-exclamation-triangle"
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="register-error-content">
                                    <strong>Registrasi belum berhasil</strong>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            {/* ACCOUNT INFORMATION */}
                            <div className="register-form-section">
                                <div className="register-section-heading">
                                    <div className="register-section-icon">
                                        <i className="bi bi-person-vcard" aria-hidden="true" />
                                    </div>

                                    <div className="register-section-content">
                                        <strong>Informasi Akun</strong>
                                        <span>
                                            Gunakan identitas dan email aktif yang dapat Anda akses.
                                        </span>
                                    </div>

                                    <span className="register-required-badge">Wajib</span>
                                </div>

                                <div className="register-form-grid">
                                    {/* FULL NAME */}
                                    <div className="register-field">
                                        <label htmlFor="full_name" className="register-label">
                                            Nama Lengkap
                                            <span>*</span>
                                        </label>

                                        <div className="register-input-wrapper">
                                            <span className="register-input-icon">
                                                <i className="bi bi-person" aria-hidden="true" />
                                            </span>

                                            <input
                                                id="full_name"
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleChange}
                                                placeholder="Masukkan nama lengkap"
                                                autoComplete="name"
                                                disabled={loading}
                                                maxLength={100}
                                                required
                                            />
                                        </div>

                                        <div className="register-field-help">
                                            <i className="bi bi-info-circle" aria-hidden="true" />
                                            <span>
                                                Gunakan nama lengkap sesuai identitas resmi Anda.
                                            </span>
                                        </div>
                                    </div>

                                    {/* EMAIL */}
                                    <div className="register-field">
                                        <label htmlFor="email" className="register-label">
                                            Email Address
                                            <span>*</span>
                                        </label>

                                        <div className="register-input-wrapper">
                                            <span className="register-input-icon">
                                                <i className="bi bi-envelope" aria-hidden="true" />
                                            </span>

                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="contoh@email.com"
                                                autoComplete="email"
                                                disabled={loading}
                                                maxLength={150}
                                                required
                                            />
                                        </div>

                                        <div className="register-field-help">
                                            <i className="bi bi-info-circle" aria-hidden="true" />
                                            <span>
                                                Email ini akan digunakan untuk login ke FITALENTA.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECURITY */}
                            <div className="register-form-section">
                                <div className="register-section-heading">
                                    <div className="register-section-icon">
                                        <i className="bi bi-shield-lock" aria-hidden="true" />
                                    </div>

                                    <div className="register-section-content">
                                        <strong>Keamanan Akun</strong>
                                        <span>
                                            Buat password yang mudah Anda ingat tetapi sulit ditebak
                                        </span>
                                    </div>

                                    <span className="register-required-badge">Wajib</span>
                                </div>

                                <div className="register-form-grid">
                                    {/* PASSWORD */}
                                    <div className="register-field">
                                        <label htmlFor="password" className="register-label">
                                            Password
                                            <span>*</span>
                                        </label>

                                        <div className="register-input-wrapper">
                                            <span className="register-input-icon">
                                                <i className="bi bi-lock" aria-hidden="true" />
                                            </span>

                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Minimal 6 karakter"
                                                autoComplete="new-password"
                                                disabled={loading}
                                                minLength={6}
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="register-password-toggle"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                disabled={loading}
                                                aria-label={
                                                    showPassword
                                                        ? "Sembunyikan password"
                                                        : "Tampilkan password"
                                                }
                                                title={
                                                    showPassword
                                                        ? "Sembunyikan password"
                                                        : "Tampilkan password"
                                                }
                                            >
                                                <i
                                                    className={
                                                        showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                                                    }
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>

                                        <div className="register-password-strength">
                                            <div className="register-password-strength-header">
                                                <span>Kekuatan password</span>

                                                <strong className={passwordStrength.className}>
                                                    {passwordStrength.label}
                                                </strong>
                                            </div>

                                            <div className="register-password-strength-bars">
                                                {[1, 2, 3].map((level) => (
                                                    <span
                                                        key={level}
                                                        className={
                                                            passwordStrength.level >= level
                                                                ? passwordStrength.className
                                                                : ""
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* CONFIRM PASSWORD */}
                                    <div className="register-field">
                                        <label
                                            htmlFor="confirmPassword"
                                            className="register-label"
                                        >
                                            Konfirmasi Password
                                            <span>*</span>
                                        </label>

                                        <div className="register-input-wrapper">
                                            <span className="register-input-icon">
                                                <i className="bi bi-lock-fill" aria-hidden="true" />
                                            </span>

                                            <input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Ulangi password Anda"
                                                autoComplete="new-password"
                                                disabled={loading}
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="register-password-toggle"
                                                onClick={() =>
                                                    setShowConfirmPassword((prev) => !prev)
                                                }
                                                disabled={loading}
                                                aria-label={
                                                    showConfirmPassword
                                                        ? "Sembunyikan konfirmasi password"
                                                        : "Tampilkan konfirmasi password"
                                                }
                                                title={
                                                    showConfirmPassword
                                                        ? "Sembunyikan konfirmasi password"
                                                        : "Tampilkan konfirmasi password"
                                                }
                                            >
                                                <i
                                                    className={
                                                        showConfirmPassword
                                                            ? "bi bi-eye-slash"
                                                            : "bi bi-eye"
                                                    }
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>

                                        {formData.confirmPassword && (
                                            <div
                                                className={`register-password-match ${
                                                    passwordChecks.match ? "matched" : "unmatched"
                                                }`}
                                            >
                                                <i
                                                    className={
                                                        passwordChecks.match
                                                            ? "bi bi-check-circle"
                                                            : "bi bi-exclamation-circle"
                                                    }
                                                    aria-hidden="true"
                                                />

                                                <span>
                                                    {passwordChecks.match
                                                        ? "Password sudah sesuai."
                                                        : "Konfirmasi password belum sama."}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="register-password-requirements">
                                    <div
                                        className={
                                            passwordChecks.length ? "completed" : ""
                                        }
                                    >
                                        <i
                                            className={
                                                passwordChecks.length
                                                    ? "bi bi-check-circle-fill"
                                                    : "bi bi-circle"
                                            }
                                            aria-hidden="true"
                                        />
                                        <span>Minimal 6 karakter</span>
                                    </div>

                                    <div
                                        className={
                                            passwordChecks.letter ? "completed" : ""
                                        }
                                    >
                                        <i
                                            className={
                                                passwordChecks.letter
                                                    ? "bi bi-check-circle-fill"
                                                    : "bi bi-circle"
                                            }
                                            aria-hidden="true"
                                        />
                                        <span>Memiliki huruf</span>
                                    </div>

                                    <div
                                        className={
                                            passwordChecks.number ? "completed" : ""
                                        }
                                    >
                                        <i
                                            className={
                                                passwordChecks.number
                                                    ? "bi bi-check-circle-fill"
                                                    : "bi bi-circle"
                                            }
                                            aria-hidden="true"
                                        />
                                        <span>Memiliki angka</span>
                                    </div>

                                    <div
                                        className={
                                            passwordChecks.match ? "completed" : ""
                                        }
                                    >
                                        <i
                                            className={
                                                passwordChecks.match
                                                    ? "bi bi-check-circle-fill"
                                                    : "bi bi-circle"
                                            }
                                            aria-hidden="true"
                                        />
                                        <span>Konfirmasi sesuai</span>
                                    </div>
                                </div>
                            </div>

                            {/* ADDITIONAL INFORMATION */}
                            <div className="register-form-section">
                                <div className="register-section-heading">
                                    <div className="register-section-icon">
                                        <i className="bi bi-card-text" aria-hidden="true" />
                                    </div>

                                    <div className="register-section-content">
                                        <strong>Informasi Tambahan</strong>
                                        <span>
                                            Informasi ini membantu melengkapi profil dasar akun Anda
                                        </span>
                                    </div>

                                    <span className="register-optional-badge">Opsional</span>
                                </div>

                                <div className="register-form-grid">
                                    {/* PHONE */}
                                    <div className="register-field">
                                        <label htmlFor="phone" className="register-label">
                                            Nomor Telepon
                                        </label>

                                        <div className="register-input-wrapper">
                                            <span className="register-input-icon">
                                                <i className="bi bi-phone" aria-hidden="true" />
                                            </span>

                                            <input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                placeholder="08xxxxxxxxxx"
                                                autoComplete="tel"
                                                inputMode="numeric"
                                                disabled={loading}
                                                maxLength={15}
                                            />
                                        </div>

                                        <div className="register-field-help">
                                            <i className="bi bi-info-circle" aria-hidden="true" />
                                            <span>
                                                Masukkan nomor aktif yang dapat dihubungi
                                            </span>
                                        </div>
                                    </div>

                                    {/* ADDRESS */}
                                    <div className="register-field">
                                        <label htmlFor="address" className="register-label">
                                            Alamat
                                        </label>

                                        <div className="register-textarea-wrapper">
                                            <span className="register-textarea-icon">
                                                <i className="bi bi-geo-alt" aria-hidden="true" />
                                            </span>

                                            <textarea
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="Masukkan alamat tempat tinggal"
                                                autoComplete="street-address"
                                                disabled={loading}
                                                rows={4}
                                                maxLength={500}
                                            />
                                        </div>

                                        <div className="register-field-counter">
                                            {formData.address.length}/500 karakter
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* INFORMATION */}
                            <div className="register-information">
                                <div className="register-information-icon">
                                    <i className="bi bi-info-circle" aria-hidden="true" />
                                </div>

                                <div className="register-information-content">
                                    <strong>Sebelum membuat akun</strong>

                                    <div className="register-information-grid">
                                        <div>
                                            <i className="bi bi-check2" aria-hidden="true" />
                                            <span>Pastikan email yang digunakan aktif dan valid</span>
                                        </div>

                                        <div>
                                            <i className="bi bi-check2" aria-hidden="true" />
                                            <span>
                                                Gunakan data pribadi yang sesuai dengan identitas Anda
                                            </span>
                                        </div>

                                        <div>
                                            <i className="bi bi-check2" aria-hidden="true" />
                                            <span>
                                                Setelah registrasi, Anda dapat melanjutkan pendaftaran
                                                program
                                            </span>
                                        </div>

                                        <div>
                                            <i className="bi bi-check2" aria-hidden="true" />
                                            <span>
                                                Simpan informasi login Anda dan jangan berikan password
                                                kepada orang lain
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                className="register-submit-btn"
                                disabled={loading}
                            >
                                <span className="register-submit-main">
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" aria-hidden="true"
                                            />
                                            <span>Mendaftarkan Akun...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-person-plus" aria-hidden="true" />
                                            <span>Buat Akun Peserta</span>
                                        </>
                                    )}
                                </span>

                                {!loading && (
                                    <i className="bi bi-arrow-right" aria-hidden="true" />
                                )}
                            </button>

                            {/* LOGIN */}
                            <div className="register-login-section">
                                <div className="register-divider">
                                    <span>Sudah punya akun?</span>
                                </div>

                                <p>
                                    Sudah terdaftar sebagai peserta FITALENTA?
                                    <Link to="/login">
                                        Login Sekarang
                                        <i className="bi bi-arrow-right" aria-hidden="true" />
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* SECURITY FOOTER */}
                    <footer className="register-card-footer">
                        <i className="bi bi-shield-check" aria-hidden="true" />
                        <span>
                            Data Anda digunakan untuk proses registrasi dan layanan FITALENTA
                        </span>
                    </footer>
                </section>

                {/* HELP */}
                <Link to="/contact" className="register-help-card">
                    <span className="register-help-icon">
                        <i className="bi bi-question-circle" aria-hidden="true" />
                    </span>

                    <span className="register-help-content">
                        <small>Mengalami kendala saat membuat akun?</small>
                        <strong>Hubungi tim FITALENTA untuk mendapatkan bantuan</strong>
                    </span>

                    <span className="register-help-arrow">
                        <i className="bi bi-arrow-right" aria-hidden="true" />
                    </span>
                </Link>
            </div>
        </main>
    );
};

export default Register;