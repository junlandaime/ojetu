import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const MAIN_SITE =
  "https://www.fitalenta.co.id";


const Login = () => {
  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const {
    login,
    isAuthenticated,
    isAdmin,
    loading: authLoading,
  } = useAuth();


  const navigate = useNavigate();


  /* =========================================================
     REDIRECT JIKA SUDAH LOGIN
  ========================================================= */

  useEffect(() => {
    if (
      !authLoading &&
      isAuthenticated
    ) {
      navigate(
        isAdmin
          ? "/admin"
          : "/dashboard",
        {
          replace: true,
        }
      );
    }
  }, [
    isAuthenticated,
    isAdmin,
    authLoading,
    navigate,
  ]);


  /* =========================================================
     INPUT
  ========================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;


    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );


    if (error) {
      setError("");
    }
  };


  /* =========================================================
     LOGIN
  ========================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");


    const email =
      formData.email.trim();


    if (
      !email ||
      !formData.password
    ) {
      setError(
        "Email dan password harus diisi."
      );

      return;
    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailPattern.test(
        email
      )
    ) {
      setError(
        "Format email tidak valid."
      );

      return;
    }


    setLoading(true);


    try {
      const normalizedEmail =
        email.toLowerCase();


      /*
        Coba sebagai peserta terlebih dahulu.
      */

      const participantResult =
        await login(
          normalizedEmail,
          formData.password,
          false
        );


      if (
        participantResult.success
      ) {
        return;
      }


      /*
        Jika bukan akun peserta,
        coba otomatis sebagai admin.
      */

      const adminResult =
        await login(
          normalizedEmail,
          formData.password,
          true
        );


      if (
        !adminResult.success
      ) {
        setError(
          adminResult.message ||
            participantResult.message ||
            "Login gagal. Silakan periksa kembali email dan password Anda."
        );
      }

    } catch (err) {
      console.error(
        "Login error:",
        err
      );


      setError(
        "Terjadi kendala saat login. Silakan coba kembali beberapa saat lagi."
      );

    } finally {
      setLoading(false);
    }
  };


  /* =========================================================
     AUTH LOADING
  ========================================================= */

  if (authLoading) {
    return (
      <>
        <main className="simple-login-page">

          <div className="simple-login-loading">

            <div
              className="spinner-border"
              role="status"
              aria-label="Memuat"
            />

            <strong>
              Memeriksa autentikasi...
            </strong>

          </div>

        </main>

        <LoginStyle />
      </>
    );
  }


  return (
    <>
      <main className="simple-login-page">

        <section className="simple-login-shell">

          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div className="simple-login-intro">

            <a
              href={MAIN_SITE}
              className="simple-login-back"
            >
              <i className="bi bi-arrow-left" />

              <span>
                Kembali ke FITALENTA
              </span>
            </a>


            <div className="simple-login-intro-content">

              <span className="simple-login-eyebrow">
                FITALENTA REGISTRATION
              </span>


              <h1>
                Selamat datang kembali
              </h1>


              <p>
                Masuk menggunakan akun peserta
                FITALENTA untuk melanjutkan proses
                pendaftaran program, seleksi,
                pembayaran, dan penyaluran.
              </p>


              <div className="simple-login-benefits">

                <div>
                  <span>
                    <i className="bi bi-check2" />
                  </span>

                  <p>
                    <strong>
                      Akses satu akun
                    </strong>

                    <small>
                      Gunakan satu akun untuk seluruh
                      proses pendaftaran FITALENTA.
                    </small>
                  </p>
                </div>


                <div>
                  <span>
                    <i className="bi bi-check2" />
                  </span>

                  <p>
                    <strong>
                      Pantau proses Anda
                    </strong>

                    <small>
                      Lihat status program, seleksi,
                      pembayaran, dan perkembangan
                      pendaftaran.
                    </small>
                  </p>
                </div>


                <div>
                  <span>
                    <i className="bi bi-check2" />
                  </span>

                  <p>
                    <strong>
                      Akses lebih aman
                    </strong>

                    <small>
                      Informasi akun digunakan untuk
                      mengakses layanan peserta
                      FITALENTA.
                    </small>
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div className="simple-login-form-side">

            <div className="simple-login-card">

              {/* ===============================================
                  HEADER
              ================================================ */}

              <header className="simple-login-card-header">

                <div className="simple-login-icon">
                  <i className="bi bi-person-lock" />
                </div>


                <div>

                  <span>
                    AKSES PESERTA
                  </span>

                  <h2>
                    Login
                  </h2>

                  <p>
                    Masukkan email dan password
                    akun FITALENTA Anda.
                  </p>

                </div>

              </header>


              {/* ===============================================
                  ERROR
              ================================================ */}

              {error && (
                <div
                  className="simple-login-error"
                  role="alert"
                >
                  <i className="bi bi-exclamation-circle" />

                  <span>
                    {error}
                  </span>
                </div>
              )}


              {/* ===============================================
                  FORM
              ================================================ */}

              <form
                onSubmit={
                  handleSubmit
                }
                className="simple-login-form"
                noValidate
              >

                {/* EMAIL */}

                <div className="simple-login-field">

                  <label htmlFor="email">
                    Email
                  </label>


                  <div className="simple-login-input">

                    <i className="bi bi-envelope" />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={
                        formData.email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="contoh@email.com"
                      autoComplete="email"
                      maxLength={150}
                      disabled={
                        loading
                      }
                      required
                    />

                  </div>

                </div>


                {/* PASSWORD */}

                <div className="simple-login-field">

                  <label htmlFor="password">
                    Password
                  </label>


                  <div className="simple-login-input simple-login-password">

                    <i className="bi bi-lock" />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={
                        formData.password
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      disabled={
                        loading
                      }
                      required
                    />


                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) =>
                            !prev
                        )
                      }
                      disabled={
                        loading
                      }
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      <i
                        className={
                          showPassword
                            ? "bi bi-eye-slash"
                            : "bi bi-eye"
                        }
                      />
                    </button>

                  </div>

                </div>


                {/* SUBMIT */}

                <button
                  type="submit"
                  className="simple-login-submit"
                  disabled={
                    loading
                  }
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      />

                      <span>
                        Memproses...
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        Masuk ke Akun
                      </span>

                      <i className="bi bi-arrow-right" />
                    </>
                  )}
                </button>

              </form>


              {/* ===============================================
                  REGISTER
              ================================================ */}

              <div className="simple-login-register">

                <span>
                  Belum punya akun?
                </span>

                <Link to="/register">
                  Registrasi di sini
                </Link>

              </div>


              {/* ===============================================
                  SECURITY
              ================================================ */}

              <div className="simple-login-security">

                <i className="bi bi-shield-check" />

                <span>
                  Informasi akun Anda digunakan
                  untuk mengakses layanan
                  FITALENTA.
                </span>

              </div>

            </div>

          </div>

        </section>

      </main>


      <LoginStyle />
    </>
  );
};


/* =========================================================
   STYLE
========================================================= */

const LoginStyle = () => {
  return (
    <style>{`

      :root {
        --sl-navy: #00294b;
        --sl-navy-dark: #001f3a;
        --sl-blue: #17578a;
        --sl-orange: #e8491d;
        --sl-bg: #f5f7fa;
        --sl-text: #102a43;
        --sl-muted: #6d7f90;
        --sl-border: #dfe6ed;
        --sl-white: #ffffff;
      }


      .simple-login-page,
      .simple-login-page * {
        box-sizing:
          border-box;
      }


      .simple-login-page {
        width:
          100%;

        min-height:
          100vh;

        margin:
          0;

        padding:
          0;

        background:
          var(
            --sl-bg
          );

        color:
          var(
            --sl-text
          );

        font-family:
          "Figtree",
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }


      /* =====================================
         SHELL
      ====================================== */

      .simple-login-shell {
        width:
          100%;

        min-height:
          calc(
            100vh - 96px
          );

        display:
          grid;

        grid-template-columns:
          minmax(
            360px,
            .9fr
          )
          minmax(
            520px,
            1.1fr
          );
      }


      /* =====================================
         LEFT SIDE
      ====================================== */

      .simple-login-intro {
        position:
          relative;

        min-height:
          100%;

        padding:
          42px
          clamp(
            36px,
            6vw,
            86px
          );

        display:
          flex;

        flex-direction:
          column;

        overflow:
          hidden;

        color:
          #ffffff;

        background:
          radial-gradient(
            circle at 12% 88%,
            rgba(
              255,
              255,
              255,
              .08
            ) 0,
            rgba(
              255,
              255,
              255,
              .08
            ) 130px,
            transparent 131px
          ),
          radial-gradient(
            circle at 100% 0%,
            rgba(
              255,
              255,
              255,
              .06
            ) 0,
            rgba(
              255,
              255,
              255,
              .06
            ) 170px,
            transparent 171px
          ),
          linear-gradient(
            145deg,
            #00294b 0%,
            #063c67 58%,
            #0d527f 100%
          );
      }


      .simple-login-back {
        position:
          relative;

        z-index:
          2;

        width:
          fit-content;

        display:
          inline-flex;

        align-items:
          center;

        gap:
          9px;

        color:
          rgba(
            255,
            255,
            255,
            .84
          );

        text-decoration:
          none;

        font-size:
          13px;

        font-weight:
          700;

        transition:
          .2s ease;
      }


      .simple-login-back:hover {
        color:
          #ffffff;

        transform:
          translateX(
            -2px
          );
      }


      .simple-login-intro-content {
        position:
          relative;

        z-index:
          2;

        width:
          min(
            520px,
            100%
          );

        margin:
          auto 0;

        padding:
          58px
          0;
      }


      .simple-login-eyebrow {
        display:
          inline-block;

        margin-bottom:
          15px;

        color:
          #ff8a67;

        font-size:
          11px;

        font-weight:
          800;

        letter-spacing:
          1.6px;
      }


      .simple-login-intro h1 {
        max-width:
          480px;

        margin:
          0;

        color:
          #ffffff;

        font-size:
          clamp(
            38px,
            4.2vw,
            58px
          );

        line-height:
          1.08;

        font-weight:
          800;

        letter-spacing:
          -1.2px;
      }


      .simple-login-intro-content > p {
        max-width:
          500px;

        margin:
          20px 0 0;

        color:
          rgba(
            255,
            255,
            255,
            .78
          );

        font-size:
          15px;

        line-height:
          1.75;
      }


      /* =====================================
         BENEFITS
      ====================================== */

      .simple-login-benefits {
        margin-top:
          36px;

        display:
          grid;

        gap:
          18px;
      }


      .simple-login-benefits > div {
        display:
          flex;

        align-items:
          flex-start;

        gap:
          12px;
      }


      .simple-login-benefits
      > div
      > span {
        width:
          30px;

        height:
          30px;

        flex:
          0 0 30px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        margin-top:
          1px;

        border:
          1px
          solid
          rgba(
            255,
            255,
            255,
            .15
          );

        border-radius:
          9px;

        background:
          rgba(
            255,
            255,
            255,
            .08
          );

        color:
          #ffffff;

        font-size:
          14px;
      }


      .simple-login-benefits p {
        margin:
          0;

        display:
          flex;

        flex-direction:
          column;

        gap:
          3px;
      }


      .simple-login-benefits strong {
        color:
          #ffffff;

        font-size:
          13px;

        font-weight:
          700;
      }


      .simple-login-benefits small {
        color:
          rgba(
            255,
            255,
            255,
            .66
          );

        font-size:
          11px;

        line-height:
          1.5;
      }


      /* =====================================
         RIGHT SIDE
      ====================================== */

      .simple-login-form-side {
        min-width:
          0;

        padding:
          54px
          clamp(
            32px,
            6vw,
            86px
          );

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        background:
          #f7f9fb;
      }


      /* =====================================
         CARD
      ====================================== */

      .simple-login-card {
        width:
          min(
            520px,
            100%
          );

        padding:
          34px;

        border:
          1px
          solid
          var(
            --sl-border
          );

        border-radius:
          20px;

        background:
          #ffffff;

        box-shadow:
          0
          20px
          55px
          rgba(
            0,
            41,
            75,
            .08
          );
      }


      .simple-login-card-header {
        display:
          flex;

        align-items:
          center;

        gap:
          15px;

        margin-bottom:
          25px;
      }


      .simple-login-icon {
        width:
          50px;

        height:
          50px;

        flex:
          0 0 50px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        border-radius:
          14px;

        background:
          #edf4fa;

        color:
          var(
            --sl-blue
          );

        font-size:
          21px;
      }


      .simple-login-card-header
      > div:last-child {
        min-width:
          0;
      }


      .simple-login-card-header span {
        display:
          block;

        margin-bottom:
          3px;

        color:
          var(
            --sl-orange
          );

        font-size:
          9px;

        font-weight:
          800;

        letter-spacing:
          1.1px;
      }


      .simple-login-card-header h2 {
        margin:
          0;

        color:
          var(
            --sl-navy
          );

        font-size:
          27px;

        line-height:
          1.2;

        font-weight:
          800;
      }


      .simple-login-card-header p {
        margin:
          5px 0 0;

        color:
          var(
            --sl-muted
          );

        font-size:
          11px;

        line-height:
          1.5;
      }


      /* =====================================
         ERROR
      ====================================== */

      .simple-login-error {
        margin-bottom:
          18px;

        padding:
          12px
          14px;

        display:
          flex;

        align-items:
          flex-start;

        gap:
          9px;

        border:
          1px
          solid
          #f1c5bd;

        border-radius:
          10px;

        background:
          #fff4f2;

        color:
          #a73a29;

        font-size:
          11px;

        line-height:
          1.5;
      }


      /* =====================================
         FORM
      ====================================== */

      .simple-login-form {
        display:
          grid;

        gap:
          18px;
      }


      .simple-login-field label {
        display:
          block;

        margin-bottom:
          7px;

        color:
          #2c4053;

        font-size:
          11px;

        font-weight:
          700;
      }


      .simple-login-input {
        position:
          relative;
      }


      .simple-login-input > i {
        position:
          absolute;

        top:
          50%;

        left:
          14px;

        transform:
          translateY(
            -50%
          );

        z-index:
          2;

        color:
          #8b9baa;

        font-size:
          14px;

        pointer-events:
          none;
      }


      .simple-login-input input {
        width:
          100%;

        height:
          48px;

        padding:
          0 44px 0 42px;

        border:
          1px
          solid
          #d8e0e7;

        border-radius:
          10px;

        outline:
          none;

        background:
          #ffffff;

        color:
          var(
            --sl-text
          );

        font:
          inherit;

        font-size:
          12px;

        transition:
          border-color
          .2s ease,
          box-shadow
          .2s ease;
      }


      .simple-login-input
      input::placeholder {
        color:
          #a0adb8;
      }


      .simple-login-input
      input:focus {
        border-color:
          #5a8db3;

        box-shadow:
          0 0 0 3px
          rgba(
            23,
            87,
            138,
            .09
          );
      }


      /* =====================================
         PASSWORD
      ====================================== */

      .simple-login-password button {
        position:
          absolute;

        top:
          50%;

        right:
          7px;

        width:
          34px;

        height:
          34px;

        padding:
          0;

        transform:
          translateY(
            -50%
          );

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        border:
          0;

        border-radius:
          8px;

        background:
          transparent;

        color:
          #8495a5;

        cursor:
          pointer;
      }


      /* =====================================
         SUBMIT
      ====================================== */

      .simple-login-submit {
        width:
          100%;

        height:
          50px;

        margin-top:
          4px;

        padding:
          0 17px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        gap:
          10px;

        border:
          0;

        border-radius:
          10px;

        background:
          var(
            --sl-orange
          );

        color:
          #ffffff;

        font-size:
          12px;

        font-weight:
          800;

        cursor:
          pointer;

        box-shadow:
          0 9px
          20px
          rgba(
            232,
            73,
            29,
            .18
          );

        transition:
          .2s ease;
      }


      .simple-login-submit:hover:not(:disabled) {
        background:
          #d94218;

        transform:
          translateY(
            -1px
          );
      }


      .simple-login-submit:disabled {
        opacity:
          .72;

        cursor:
          not-allowed;
      }


      /* =====================================
         REGISTER LINK
      ====================================== */

      .simple-login-register {
        margin-top:
          23px;

        padding-top:
          19px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        gap:
          5px;

        border-top:
          1px
          solid
          #e8edf2;

        color:
          var(
            --sl-muted
          );

        font-size:
          11px;
      }


      .simple-login-register a {
        color:
          var(
            --sl-blue
          );

        text-decoration:
          none;

        font-weight:
          800;
      }


      /* =====================================
         SECURITY
      ====================================== */

      .simple-login-security {
        margin-top:
          18px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        gap:
          7px;

        color:
          #8795a1;

        font-size:
          9px;

        text-align:
          center;

        line-height:
          1.45;
      }


      /* =====================================
         LOADING
      ====================================== */

      .simple-login-loading {
        min-height:
          calc(
            100vh - 96px
          );

        display:
          flex;

        flex-direction:
          column;

        align-items:
          center;

        justify-content:
          center;

        gap:
          12px;

        color:
          var(
            --sl-navy
          );
      }


      /* =====================================
         RESPONSIVE
      ====================================== */

      @media (
        max-width: 799px
      ) {

        .simple-login-shell {
          min-height:
            calc(
              100vh - 80px
            );

          grid-template-columns:
            1fr;
        }

      }


      @media (
        max-width: 700px
      ) {

        .simple-login-intro {
          padding:
            28px
            20px;
        }


        .simple-login-intro-content {
          padding:
            38px
            0
            20px;
        }


        .simple-login-form-side {
          padding:
            30px
            16px
            48px;
        }


        .simple-login-card {
          padding:
            25px
            20px;

          border-radius:
            16px;
        }

      }


      @media (
        max-width: 480px
      ) {

        .simple-login-shell {
          min-height:
            calc(
              100vh - 76px
            );
        }

      }

    `}</style>
  );
};


export default Login;
