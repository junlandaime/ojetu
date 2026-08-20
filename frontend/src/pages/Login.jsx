import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        isAdmin: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
        }
    }, [isAuthenticated, isAdmin, authLoading, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const email = formData.email.trim();

        if (!email || !formData.password) {
            setError("Email dan password harus diisi.");
            return;
        }

        setLoading(true);

        try {
            const result = await login(email, formData.password, formData.isAdmin);

            if (!result.success) {
                setError(result.message || "Login gagal. Silakan periksa kembali data Anda.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Terjadi kendala saat login. Silakan coba kembali.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdminChange = (e) => {
        const checked = e.target.checked;

        setFormData((prev) => ({
            ...prev,
            isAdmin: checked,
            email: "",
            password: "",
        }));

        setError("");
        setShowPassword(false);
    };

    if (authLoading) {
        return (
            <main className="login-page">
                <div className="login-loading">
                    <div className="login-loading-card">
                        <div className="login-loading-icon">
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
        <main className="login-page">
            <div className="login-decoration login-decoration-left" />
            <div className="login-decoration login-decoration-right" />

            <div className="login-shell">
                {/* HERO */}
                <section className="login-hero">
                    <div className="login-hero-eyebrow">
                        <i className="bi bi-stars" aria-hidden="true" />
                        <span>PORTAL PESERTA FITALENTA</span>
                    </div>

                    <h1>Selamat Datang Kembali</h1>

                    <p className="login-hero-description">
                        Masuk ke akun FITALENTA untuk melanjutkan proses pendaftaran,
                        memilih program, dan memantau perjalanan Anda
                    </p>

                    <div className="login-hero-benefits">
                        <div className="login-benefit-item">
                            <span className="login-benefit-icon">
                                <i className="bi bi-shield-check" aria-hidden="true" />
                            </span>
                            <span>Akses aman</span>
                        </div>

                        <div className="login-benefit-item">
                            <span className="login-benefit-icon">
                                <i className="bi bi-person-check" aria-hidden="true" />
                            </span>
                            <span>Akun peserta</span>
                        </div>

                        <div className="login-benefit-item">
                            <span className="login-benefit-icon">
                                <i className="bi bi-clipboard2-check" aria-hidden="true" />
                            </span>
                            <span>Pantau program</span>
                        </div>
                    </div>
                </section>

                {/* LOGIN CARD */}
                <section className="login-card">
                    <header className="login-card-header">
                        <div className="login-card-header-icon">
                            <i
                                className={
                                    formData.isAdmin
                                        ? "bi bi-shield-lock"
                                        : "bi bi-person-lock"
                                }
                                aria-hidden="true"
                            />
                        </div>

                        <div className="login-card-header-content">
                            <span className="login-card-eyebrow">
                                {formData.isAdmin
                                    ? "AKSES ADMINISTRATOR"
                                    : "AKSES PESERTA"}
                            </span>

                            <h2>
                                {formData.isAdmin
                                    ? "Login Administrator"
                                    : "Login Peserta"}
                            </h2>

                            <p>
                                {formData.isAdmin
                                    ? "Masuk menggunakan akun administrator FITALENTA"
                                    : "Masukkan email dan password yang telah Anda daftarkan"}
                            </p>
                        </div>
                    </header>

                    <div className="login-card-body">
                        {error && (
                            <div className="login-error" role="alert">
                                <div className="login-error-icon">
                                    <i
                                        className="bi bi-exclamation-triangle"
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="login-error-content">
                                    <strong>Login belum berhasil</strong>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            {/* EMAIL */}
                            <div className="login-field">
                                <label htmlFor="email" className="login-label">
                                    Email Address
                                    <span>*</span>
                                </label>

                                <div className="login-input-wrapper">
                                    <span className="login-input-icon">
                                        <i className="bi bi-envelope" aria-hidden="true" />
                                    </span>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder={
                                            formData.isAdmin
                                                ? "admin@fitalenta.co.id"
                                                : "nama@email.com"
                                        }
                                        autoComplete="email"
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                <div className="login-field-help">
                                    <i className="bi bi-info-circle" aria-hidden="true" />
                                    <span>
                                        {formData.isAdmin
                                            ? "Gunakan email administrator yang telah terdaftar"
                                            : "Gunakan email yang terdaftar pada akun FITALENTA Anda"}
                                    </span>
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="login-field">
                                <label htmlFor="password" className="login-label">
                                    Password
                                    <span>*</span>
                                </label>

                                <div className="login-input-wrapper">
                                    <span className="login-input-icon">
                                        <i className="bi bi-lock" aria-hidden="true" />
                                    </span>

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Masukkan password Anda"
                                        autoComplete="current-password"
                                        disabled={loading}
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="login-password-toggle"
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
                            </div>

                            {/* ADMIN TOGGLE */}
                            <label
                                className={`login-admin-option ${
                                    formData.isAdmin ? "active" : ""
                                }`}
                                htmlFor="isAdmin"
                            >
                                <input
                                    id="isAdmin"
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={formData.isAdmin}
                                    onChange={handleAdminChange}
                                    disabled={loading}
                                />

                                <span className="login-admin-checkbox">
                                    {formData.isAdmin && (
                                        <i className="bi bi-check-lg" aria-hidden="true" />
                                    )}
                                </span>

                                <span className="login-admin-icon">
                                    <i className="bi bi-shield-lock" aria-hidden="true" />
                                </span>

                                <span className="login-admin-content">
                                    <strong>Login sebagai Administrator</strong>
                                    <small>
                                        Aktifkan hanya jika Anda memiliki akses administrasi
                                        FITALENTA
                                    </small>
                                </span>
                            </label>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                className="login-submit-btn"
                                disabled={loading}
                            >
                                <span className="login-submit-main">
                                    {loading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                aria-hidden="true"
                                            />
                                            <span>Memproses...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
                                            <span>Masuk ke Akun</span>
                                        </>
                                    )}
                                </span>
                                {!loading && (
                                    <i className="bi bi-arrow-right" aria-hidden="true" />
                                )}
                            </button>
                        </form>

                        {isLocalhost && (
                            <div className="demo-credentials">
                                <div className="demo-header">
                                    <i className="bi bi-info-circle" aria-hidden="true" />
                                    <strong>
                                        Demo Credentials (Localhost Only)
                                    </strong>
                                </div>
                                <p>
                                    Akun berikut hanya tersedia untuk pengujian lokal.
                                    Tidak ditampilkan pada versi production
                                </p>
                                <div className="demo-list">
                                    <div className="demo-item">
                                        <strong>Admin</strong>
                                        <span>
                                            admin@gmail.com / admin
                                        </span>
                                    </div>
                                    <div className="demo-item">
                                        <strong>User 1</strong>
                                        <span>
                                            user1@gmail.com / user123
                                        </span>
                                    </div>

                                    <div className="demo-item">
                                        <strong>User 2</strong>
                                        <span>
                                            user2@gmail.com / user321
                                        </span>
                                    </div>

                                    <div className="demo-item">
                                        <strong>Participant</strong>
                                        <span>
                                            user3@gmail.com / 123456
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* REGISTER */}
                        {!formData.isAdmin ? (
                            <div className="login-register-section">
                                <div className="login-divider">
                                    <span>Belum punya akun?</span>
                                </div>

                                <p>
                                    Belum memiliki akun FITALENTA?
                                    <Link to="/register">
                                        Daftar Sekarang
                                        <i className="bi bi-arrow-right" aria-hidden="true" />
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            <div className="login-register-section">
                                <div className="login-divider">
                                    <span>Akses peserta</span>
                                </div>

                                <p>
                                    Bukan administrator?
                                    <button
                                        type="button"
                                        className="login-participant-link"
                                        onClick={() => {
                                            setFormData({
                                                email: "",
                                                password: "",
                                                isAdmin: false,
                                            });
                                            setError("");
                                            setShowPassword(false);
                                        }}
                                    >
                                        Login sebagai Peserta
                                        <i className="bi bi-arrow-right" aria-hidden="true" />
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* SECURITY */}
                    <footer className="login-card-footer">
                        <i className="bi bi-shield-check" aria-hidden="true" />
                        <span>
                            Informasi akun Anda digunakan hanya untuk mengakses layanan
                            FITALENTA
                        </span>
                    </footer>
                </section>

                {/* HELP */}
                <Link to="/contact" className="login-help-card">
          <span className="login-help-icon">
            <i className="bi bi-question-circle" aria-hidden="true" />
          </span>

                    <span className="login-help-content">
            <small>Mengalami kendala saat masuk?</small>
            <strong>Hubungi tim FITALENTA untuk mendapatkan bantuan=</strong>
          </span>

                    <span className="login-help-arrow">
                        <i className="bi bi-arrow-right" aria-hidden="true" />
                    </span>
                </Link>
            </div>
        </main>
    );
};

export default Login;