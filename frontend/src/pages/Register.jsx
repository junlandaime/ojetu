import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MAIN_SITE = "https://www.fitalenta.co.id";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    isAuthenticated,
    isAdmin,
    loading: authLoading,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const passwordChecks = useMemo(
    () => ({
      length: formData.password.length >= 6,
      match:
        formData.confirmPassword.length > 0 &&
        formData.password === formData.confirmPassword,
    }),
    [formData.password, formData.confirmPassword]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handlePhoneChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "").slice(0, 15);

    setFormData((prev) => ({
      ...prev,
      phone: numericValue,
    }));

    if (error) setError("");
  };

  const validateForm = () => {
    const fullName = formData.full_name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (
      !fullName ||
      !email ||
      !phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return "Semua field wajib diisi.";
    }

    if (fullName.length < 3) {
      return "Nama pengguna minimal terdiri dari 3 karakter.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return "Format email tidak valid.";
    }

    if (phone.length < 10) {
      return "Nomor telepon minimal terdiri dari 10 digit.";
    }

    if (formData.password.length < 6) {
      return "Password harus minimal 6 karakter.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Password dan konfirmasi password tidak sama.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        address: "",
      };

      const result = await register(submitData);

      if (!result.success) {
        setError(
          result.message ||
            "Registrasi belum berhasil. Silakan periksa kembali data Anda."
        );
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(
        "Terjadi kendala saat membuat akun. Silakan coba kembali beberapa saat lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <main className="simple-register-page">
          <div className="simple-register-loading">
            <div className="spinner-border" role="status" aria-label="Memuat" />
            <strong>Memeriksa autentikasi...</strong>
          </div>
        </main>
        <RegisterStyle />
      </>
    );
  }

  return (
    <>
      <main className="simple-register-page">
        <section className="simple-register-shell">
          <div className="simple-register-intro">
            <a href={MAIN_SITE} className="simple-register-back">
              <i className="bi bi-arrow-left" />
              <span>Kembali ke FITALENTA</span>
            </a>

            <div className="simple-register-intro-content">
              <span className="simple-register-eyebrow">
                FITALENTA REGISTRATION
              </span>

              <h1>Buat akun peserta</h1>

              <p>
                Daftar dengan data dasar terlebih dahulu. Kelengkapan profil
                dapat Anda isi setelah berhasil masuk ke akun FITALENTA.
              </p>

              <div className="simple-register-benefits">
                <div>
                  <span>
                    <i className="bi bi-check2" />
                  </span>
                  <p>
                    <strong>Registrasi lebih cepat</strong>
                    <small>Hanya informasi dasar untuk membuat akun.</small>
                  </p>
                </div>

                <div>
                  <span>
                    <i className="bi bi-check2" />
                  </span>
                  <p>
                    <strong>Lengkapi setelah login</strong>
                    <small>
                      Alamat dan data pendaftaran diisi setelah akun aktif.
                    </small>
                  </p>
                </div>

                <div>
                  <span>
                    <i className="bi bi-check2" />
                  </span>
                  <p>
                    <strong>Pilih program FITALENTA</strong>
                    <small>
                      Gunakan akun untuk melanjutkan proses pendaftaran program.
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="simple-register-form-side">
            <div className="simple-register-card">
              <header className="simple-register-card-header">
                <div className="simple-register-icon">
                  <i className="bi bi-person-plus" />
                </div>

                <div>
                  <span>AKUN PESERTA BARU</span>
                  <h2>Registrasi</h2>
                  <p>Masukkan data berikut untuk membuat akun.</p>
                </div>
              </header>

              {error && (
                <div className="simple-register-error" role="alert">
                  <i className="bi bi-exclamation-circle" />
                  <span>{error}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="simple-register-form"
                noValidate
              >
                <div className="simple-register-field">
                  <label htmlFor="full_name">Nama Pengguna</label>

                  <div className="simple-register-input">
                    <i className="bi bi-person" />
                    <input
                      id="full_name"
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      autoComplete="name"
                      maxLength={100}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="simple-register-field">
                  <label htmlFor="email">Email</label>

                  <div className="simple-register-input">
                    <i className="bi bi-envelope" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contoh@email.com"
                      autoComplete="email"
                      maxLength={150}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="simple-register-field">
                  <label htmlFor="phone">Nomor Telepon</label>

                  <div className="simple-register-input">
                    <i className="bi bi-phone" />
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="08xxxxxxxxxx"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={15}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="simple-register-field">
                  <label htmlFor="password">Password</label>

                  <div className="simple-register-input simple-register-password">
                    <i className="bi bi-lock" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimal 6 karakter"
                      autoComplete="new-password"
                      minLength={6}
                      disabled={loading}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      <i
                        className={
                          showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                        }
                      />
                    </button>
                  </div>

                  {formData.password && (
                    <small
                      className={
                        passwordChecks.length
                          ? "simple-register-valid"
                          : "simple-register-hint"
                      }
                    >
                      <i
                        className={
                          passwordChecks.length
                            ? "bi bi-check-circle"
                            : "bi bi-info-circle"
                        }
                      />
                      Minimal 6 karakter
                    </small>
                  )}
                </div>

                <div className="simple-register-field">
                  <label htmlFor="confirmPassword">Konfirmasi Password</label>

                  <div className="simple-register-input simple-register-password">
                    <i className="bi bi-shield-lock" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Ulangi password"
                      autoComplete="new-password"
                      disabled={loading}
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      disabled={loading}
                      aria-label={
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
                      />
                    </button>
                  </div>

                  {formData.confirmPassword && (
                    <small
                      className={
                        passwordChecks.match
                          ? "simple-register-valid"
                          : "simple-register-invalid"
                      }
                    >
                      <i
                        className={
                          passwordChecks.match
                            ? "bi bi-check-circle"
                            : "bi bi-exclamation-circle"
                        }
                      />

                      {passwordChecks.match
                        ? "Password sudah sesuai"
                        : "Konfirmasi password belum sama"}
                    </small>
                  )}
                </div>

                <button
                  type="submit"
                  className="simple-register-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      />
                      <span>Membuat akun...</span>
                    </>
                  ) : (
                    <>
                      <span>Buat Akun</span>
                      <i className="bi bi-arrow-right" />
                    </>
                  )}
                </button>
              </form>

              <div className="simple-register-login">
                <span>Sudah punya akun?</span>
                <Link to="/login">Login di sini</Link>
              </div>

              <div className="simple-register-security">
                <i className="bi bi-shield-check" />
                <span>
                  Data Anda digunakan untuk layanan dan proses pendaftaran
                  FITALENTA.
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <RegisterStyle />
    </>
  );
};

const RegisterStyle = () => {
  return (
    <style>{`
      :root {
        --sr-navy: #00294b;
        --sr-navy-dark: #001f3a;
        --sr-blue: #17578a;
        --sr-orange: #e8491d;
        --sr-bg: #f5f7fa;
        --sr-text: #102a43;
        --sr-muted: #6d7f90;
        --sr-border: #dfe6ed;
        --sr-white: #ffffff;
      }

      .simple-register-page,
      .simple-register-page * {
        box-sizing: border-box;
      }

      .simple-register-page {
        width: 100%;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        background: var(--sr-bg);
        color: var(--sr-text);
        font-family: "Figtree", ui-sans-serif, system-ui, -apple-system,
          BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .simple-register-shell {
        width: 100%;
        min-height: calc(100vh - 96px);
        display: grid;
        grid-template-columns: minmax(360px, 0.9fr) minmax(520px, 1.1fr);
      }

      .simple-register-intro {
        position: relative;
        min-height: 100%;
        padding: 42px clamp(36px, 6vw, 86px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: #ffffff;
        background:
          radial-gradient(
            circle at 12% 88%,
            rgba(255, 255, 255, 0.08) 0,
            rgba(255, 255, 255, 0.08) 130px,
            transparent 131px
          ),
          radial-gradient(
            circle at 100% 0%,
            rgba(255, 255, 255, 0.06) 0,
            rgba(255, 255, 255, 0.06) 170px,
            transparent 171px
          ),
          linear-gradient(145deg, #00294b 0%, #063c67 58%, #0d527f 100%);
      }

      .simple-register-back {
        position: relative;
        z-index: 2;
        width: fit-content;
        display: inline-flex;
        align-items: center;
        gap: 9px;
        color: rgba(255, 255, 255, 0.84);
        text-decoration: none;
        font-size: 13px;
        font-weight: 700;
        transition: 0.2s ease;
      }

      .simple-register-back:hover {
        color: #ffffff;
        transform: translateX(-2px);
      }

      .simple-register-intro-content {
        position: relative;
        z-index: 2;
        width: min(520px, 100%);
        margin: auto 0;
        padding: 58px 0;
      }

      .simple-register-eyebrow {
        display: inline-block;
        margin-bottom: 15px;
        color: #ff8a67;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1.6px;
      }

      .simple-register-intro h1 {
        max-width: 480px;
        margin: 0;
        color: #ffffff;
        font-size: clamp(38px, 4.2vw, 58px);
        line-height: 1.08;
        font-weight: 800;
        letter-spacing: -1.2px;
      }

      .simple-register-intro-content > p {
        max-width: 500px;
        margin: 20px 0 0;
        color: rgba(255, 255, 255, 0.78);
        font-size: 15px;
        line-height: 1.75;
      }

      .simple-register-benefits {
        margin-top: 36px;
        display: grid;
        gap: 18px;
      }

      .simple-register-benefits > div {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .simple-register-benefits > div > span {
        width: 30px;
        height: 30px;
        flex: 0 0 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 1px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 9px;
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
        font-size: 14px;
      }

      .simple-register-benefits p {
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .simple-register-benefits strong {
        color: #ffffff;
        font-size: 13px;
        font-weight: 700;
      }

      .simple-register-benefits small {
        color: rgba(255, 255, 255, 0.66);
        font-size: 11px;
        line-height: 1.5;
      }

      .simple-register-form-side {
        min-width: 0;
        padding: 54px clamp(32px, 6vw, 86px);
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f7f9fb;
      }

      .simple-register-card {
        width: min(520px, 100%);
        padding: 34px;
        border: 1px solid var(--sr-border);
        border-radius: 20px;
        background: #ffffff;
        box-shadow: 0 20px 55px rgba(0, 41, 75, 0.08);
      }

      .simple-register-card-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 25px;
      }

      .simple-register-icon {
        width: 50px;
        height: 50px;
        flex: 0 0 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        background: #edf4fa;
        color: var(--sr-blue);
        font-size: 21px;
      }

      .simple-register-card-header > div:last-child {
        min-width: 0;
      }

      .simple-register-card-header span {
        display: block;
        margin-bottom: 3px;
        color: var(--sr-orange);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 1.1px;
      }

      .simple-register-card-header h2 {
        margin: 0;
        color: var(--sr-navy);
        font-size: 27px;
        line-height: 1.2;
        font-weight: 800;
      }

      .simple-register-card-header p {
        margin: 5px 0 0;
        color: var(--sr-muted);
        font-size: 11px;
        line-height: 1.5;
      }

      .simple-register-error {
        margin-bottom: 18px;
        padding: 12px 14px;
        display: flex;
        align-items: flex-start;
        gap: 9px;
        border: 1px solid #f1c5bd;
        border-radius: 10px;
        background: #fff4f2;
        color: #a73a29;
        font-size: 11px;
        line-height: 1.5;
      }

      .simple-register-form {
        display: grid;
        gap: 15px;
      }

      .simple-register-field label {
        display: block;
        margin-bottom: 7px;
        color: #2c4053;
        font-size: 11px;
        font-weight: 700;
      }

      .simple-register-input {
        position: relative;
      }

      .simple-register-input > i {
        position: absolute;
        top: 50%;
        left: 14px;
        transform: translateY(-50%);
        z-index: 2;
        color: #8b9baa;
        font-size: 14px;
        pointer-events: none;
      }

      .simple-register-input input {
        width: 100%;
        height: 48px;
        padding: 0 44px 0 42px;
        border: 1px solid #d8e0e7;
        border-radius: 10px;
        outline: none;
        background: #ffffff;
        color: var(--sr-text);
        font: inherit;
        font-size: 12px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .simple-register-input input::placeholder {
        color: #a0adb8;
      }

      .simple-register-input input:focus {
        border-color: #5a8db3;
        box-shadow: 0 0 0 3px rgba(23, 87, 138, 0.09);
      }

      .simple-register-password button {
        position: absolute;
        top: 50%;
        right: 7px;
        width: 34px;
        height: 34px;
        padding: 0;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: #8495a5;
        cursor: pointer;
      }

      .simple-register-field > small {
        margin-top: 6px;
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 9px;
        line-height: 1.4;
      }

      .simple-register-valid {
        color: #2f8a5d;
      }

      .simple-register-invalid {
        color: #c44835;
      }

      .simple-register-hint {
        color: #7d8d9b;
      }

      .simple-register-submit {
        width: 100%;
        height: 50px;
        margin-top: 4px;
        padding: 0 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border: 0;
        border-radius: 10px;
        background: var(--sr-orange);
        color: #ffffff;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 9px 20px rgba(232, 73, 29, 0.18);
        transition: 0.2s ease;
      }

      .simple-register-login {
        margin-top: 23px;
        padding-top: 19px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        border-top: 1px solid #e8edf2;
        color: var(--sr-muted);
        font-size: 11px;
      }

      .simple-register-login a {
        color: var(--sr-blue);
        text-decoration: none;
        font-weight: 800;
      }

      .simple-register-security {
        margin-top: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        color: #8795a1;
        font-size: 9px;
        text-align: center;
        line-height: 1.45;
      }

      .simple-register-loading {
        min-height: calc(100vh - 96px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        color: var(--sr-navy);
      }

      @media (max-width: 799px) {
        .simple-register-shell {
          min-height: calc(100vh - 80px);
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 700px) {
        .simple-register-intro {
          padding: 28px 20px;
        }

        .simple-register-intro-content {
          padding: 38px 0 20px;
        }

        .simple-register-benefits {
          grid-template-columns: 1fr;
        }

        .simple-register-form-side {
          padding: 30px 16px 48px;
        }

        .simple-register-card {
          padding: 25px 20px;
          border-radius: 16px;
        }
      }

      @media (max-width: 480px) {
        .simple-register-shell {
          min-height: calc(100vh - 76px);
        }
      }
    `}</style>
  );
};

export default Register;
