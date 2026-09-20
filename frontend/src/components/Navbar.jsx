import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const MAIN_SITE =
  "https://www.fitalenta.co.id";


const Navbar = () => {
  const {
    user,
    logout,
    isAuthenticated,
    isAdmin,
    loading,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [logoError, setLogoError] =
    useState(false);

  const [isScrolled, setIsScrolled] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);


  /* =========================================================
     PAGE TYPE
  ========================================================= */

  const isHome =
    location.pathname === "/";

  const isProgramsPage =
    location.pathname === "/programs";

  const isLoginPage =
    location.pathname === "/login";

  const isRegisterPage =
    location.pathname === "/register";


  /*
    Home dan Programs tidak memakai spacer
    karena navbar berada di atas hero.

    Halaman lain memakai spacer agar konten
    tidak tertutup navbar fixed.
  */

  const needsHeaderSpacer =
    !isHome &&
    !isProgramsPage;


  /* =========================================================
     SCROLL
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(
        window.scrollY > 40
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);


  /* =========================================================
     CLOSE MOBILE MENU
  ========================================================= */

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);


  /* =========================================================
     ACTIVE MENU
  ========================================================= */

  const isActive = useCallback(
    (path) => {
      if (path === "/") {
        return (
          location.pathname === "/"
        );
      }

      return location.pathname.startsWith(
        path
      );
    },
    [location.pathname]
  );


  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      navigate("/");
    }
  };


  const closeMenu = () => {
    setMenuOpen(false);
  };


  /* =========================================================
     LOGO ACTION
  ========================================================= */

  const handleLogoClick = (
    event
  ) => {
    if (
      isAuthenticated &&
      !isAdmin
    ) {
      event.preventDefault();

      closeMenu();

      navigate(
        "/dashboard"
      );

      return;
    }

    closeMenu();
  };


  /* =========================================================
     NAVBAR MODE
  ========================================================= */

  /*
    Home + Programs:
    posisi paling atas = transparan

    setelah scroll > 40px = navy

    menu mobile dibuka = navy
  */

  const useTransparentNavbar =
    (isHome || isProgramsPage) &&
    !isScrolled &&
    !menuOpen;


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        <header
          className="
            fitalenta-header
            fitalenta-header-solid
          "
        >
          <nav className="fitalenta-navbar">

            <div
              className="
                fitalenta-navbar-inner
                fitalenta-loading-inner
              "
            >
              <div className="fitalenta-loading">

                <div
                  className="
                    spinner-border
                    spinner-border-sm
                  "
                  role="status"
                  aria-hidden="true"
                />

                <span>
                  Loading...
                </span>

              </div>
            </div>

          </nav>
        </header>


        {needsHeaderSpacer && (
          <div
            className="fitalenta-header-spacer"
            aria-hidden="true"
          />
        )}


        <NavbarStyle />
      </>
    );
  }


  return (
    <>
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className={`fitalenta-header ${
          useTransparentNavbar
            ? "fitalenta-header-transparent"
            : "fitalenta-header-solid"
        } ${
          isProgramsPage
            ? "fitalenta-header-program"
            : ""
        } ${
          isLoginPage
            ? "fitalenta-header-login"
            : ""
        } ${
          isRegisterPage
            ? "fitalenta-header-register"
            : ""
        }`}
      >

        <nav className="fitalenta-navbar">

          <div className="fitalenta-navbar-inner">

            {/* ===============================================
                LOGO
            ================================================ */}

            <a
              href={`${MAIN_SITE}/`}
              className="fitalenta-brand"
              onClick={
                handleLogoClick
              }
              aria-label={
                isAuthenticated &&
                !isAdmin
                  ? "FITALENTA Dashboard"
                  : "FITALENTA Home"
              }
            >
              {!logoError ? (
                <img
                  src="/images/logo/logoputih.png"
                  alt="FITALENTA"
                  onError={() =>
                    setLogoError(true)
                  }
                />
              ) : (
                <span>
                  FITALENTA
                </span>
              )}
            </a>


            {/* ===============================================
                MOBILE MENU BUTTON
            ================================================ */}

            <button
              type="button"
              className={`fitalenta-menu-toggle ${
                menuOpen
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setMenuOpen(
                  (prev) => !prev
                )
              }
              aria-label="Buka menu"
              aria-expanded={
                menuOpen
              }
            >
              <span />
              <span />
              <span />
            </button>


            {/* ===============================================
                NAVBAR CONTENT
            ================================================ */}

            <div
              className={`fitalenta-navbar-content ${
                menuOpen
                  ? "show"
                  : ""
              }`}
            >

              {/* =============================================
                  BELUM LOGIN
              ============================================== */}

              {!isAuthenticated && (
                <>
                  <div className="fitalenta-nav-menu">

                    <a
                      href={`${MAIN_SITE}/`}
                      onClick={
                        closeMenu
                      }
                    >
                      Home
                    </a>

                    <a
                      href={`${MAIN_SITE}/events`}
                      onClick={
                        closeMenu
                      }
                    >
                      Event
                    </a>

                    <a
                      href={`${MAIN_SITE}/services`}
                      onClick={
                        closeMenu
                      }
                    >
                      Services
                    </a>

                    <Link
                      to="/programs"
                      onClick={
                        closeMenu
                      }
                      className={
                        isActive(
                          "/programs"
                        )
                          ? "active"
                          : ""
                      }
                    >
                      Program
                    </Link>

                    <a
                      href={`${MAIN_SITE}/articles`}
                      onClick={
                        closeMenu
                      }
                    >
                      Blog
                    </a>

                    <a
                      href={`${MAIN_SITE}/gallery`}
                      onClick={
                        closeMenu
                      }
                    >
                      Gallery
                    </a>

                    <a
                      href={`${MAIN_SITE}/about`}
                      onClick={
                        closeMenu
                      }
                    >
                      About
                    </a>

                    <a
                      href={`${MAIN_SITE}/contact`}
                      onClick={
                        closeMenu
                      }
                    >
                      Contact
                    </a>

                  </div>


                  <div className="fitalenta-auth-menu">

                    <Link
                      to="/login"
                      onClick={
                        closeMenu
                      }
                      className={`fitalenta-login-link ${
                        isActive(
                          "/login"
                        )
                          ? "active"
                          : ""
                      }`}
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={
                        closeMenu
                      }
                      className={`fitalenta-register-btn ${
                        isActive(
                          "/register"
                        )
                          ? "active"
                          : ""
                      }`}
                    >
                      Registrasi
                    </Link>

                  </div>
                </>
              )}


              {/* =============================================
                  PARTICIPANT
              ============================================== */}

              {isAuthenticated &&
                !isAdmin && (
                  <>
                    <div className="fitalenta-nav-menu">

                      <Link
                        to="/dashboard"
                        onClick={
                          closeMenu
                        }
                        className={
                          isActive(
                            "/dashboard"
                          )
                            ? "active"
                            : ""
                        }
                      >
                        Dashboard
                      </Link>

                      <Link
                        to="/programs"
                        onClick={
                          closeMenu
                        }
                        className={
                          isActive(
                            "/programs"
                          )
                            ? "active"
                            : ""
                        }
                      >
                        Program
                      </Link>

                      <Link
                        to="/registration"
                        onClick={
                          closeMenu
                        }
                        className={
                          isActive(
                            "/registration"
                          )
                            ? "active"
                            : ""
                        }
                      >
                        Pendaftaran
                      </Link>

                      <Link
                        to="/payment"
                        onClick={
                          closeMenu
                        }
                        className={
                          isActive(
                            "/payment"
                          )
                            ? "active"
                            : ""
                        }
                      >
                        Pembayaran
                      </Link>

                    </div>


                    <UserDropdown
                      user={user}
                      isAdmin={false}
                      handleLogout={
                        handleLogout
                      }
                      closeMenu={
                        closeMenu
                      }
                    />
                  </>
                )}


              {/* =============================================
                  ADMIN
              ============================================== */}

              {isAuthenticated &&
                isAdmin && (
                  <>
                    <div className="fitalenta-nav-menu">

                      <a
                        href={`${MAIN_SITE}/`}
                        onClick={
                          closeMenu
                        }
                      >
                        Home
                      </a>

                      <Link
                        to="/admin"
                        onClick={
                          closeMenu
                        }
                        className={
                          location.pathname ===
                          "/admin"
                            ? "active"
                            : ""
                        }
                      >
                        Dashboard
                      </Link>

                      <Link
                        to="/admin/payments"
                        onClick={
                          closeMenu
                        }
                        className={
                          isActive(
                            "/admin/payments"
                          )
                            ? "active"
                            : ""
                        }
                      >
                        Pembayaran
                      </Link>

                      <Link
                        to="/admin/selection"
                        onClick={
                          closeMenu
                        }
                        className={
                          isActive(
                            "/admin/selection"
                          )
                            ? "active"
                            : ""
                        }
                      >
                        Seleksi
                      </Link>

                      <Link
                        to="/admin/placement"
                        onClick={
                          closeMenu
                        }
                        className={
                          isActive(
                            "/admin/placement"
                          )
                            ? "active"
                            : ""
                        }
                      >
                        Penyaluran
                      </Link>

                      <Link
                        to="/admin/financial-reports"
                        onClick={
                          closeMenu
                        }
                        className={
                          isActive(
                            "/admin/financial-reports"
                          )
                            ? "active"
                            : ""
                        }
                      >
                        Laporan
                      </Link>

                    </div>


                    <UserDropdown
                      user={user}
                      isAdmin
                      handleLogout={
                        handleLogout
                      }
                      closeMenu={
                        closeMenu
                      }
                    />
                  </>
                )}

            </div>

          </div>

        </nav>
      </header>


      {/* =====================================================
          SPACER
      ====================================================== */}

      {needsHeaderSpacer && (
        <div
          className="fitalenta-header-spacer"
          aria-hidden="true"
        />
      )}


      <NavbarStyle />
    </>
  );
};


/* =========================================================
   USER DROPDOWN
========================================================= */

const UserDropdown = ({
  user,
  isAdmin,
  handleLogout,
  closeMenu,
}) => {
  return (
    <div className="dropdown fitalenta-user">

      <button
        className="
          fitalenta-user-btn
          dropdown-toggle
        "
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >

        <span className="fitalenta-avatar">
          <i className="bi bi-person-fill" />
        </span>

        <span className="fitalenta-user-name">
          {user?.full_name ||
            user?.email ||
            "User"}
        </span>

        {isAdmin && (
          <span className="fitalenta-admin-badge">
            Admin
          </span>
        )}

      </button>


      <ul
        className="
          dropdown-menu
          dropdown-menu-end
          shadow
          border-0
          mt-2
        "
      >
        <li>
          <button
            type="button"
            className="
              dropdown-item
              text-danger
              py-2
            "
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
          >
            <i className="bi bi-box-arrow-right me-2" />
            Logout
          </button>
        </li>
      </ul>

    </div>
  );
};


/* =========================================================
   STYLE
========================================================= */

const NavbarStyle = () => {
  return (
    <style>{`

      @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap');


      :root {
        --fitalenta-primary: #00294B;
        --fitalenta-secondary: #E8491D;
        --fitalenta-white: #ffffff;
      }


      /* =====================================
         HEADER
      ====================================== */

      .fitalenta-header {
        position: fixed !important;

        top: 0 !important;
        left: 0 !important;
        right: 0 !important;

        z-index: 1050;

        width: 100%;

        margin: 0 !important;
        padding: 0 !important;

        color: #ffffff;

        transition:
          background .25s ease,
          box-shadow .25s ease;
      }


      .fitalenta-header-solid {
        background:
          #00294B !important;

        box-shadow:
          0 6px 22px
          rgba(
            0,
            0,
            0,
            .10
          ) !important;
      }


      /*
        BENAR-BENAR TRANSPARAN
        saat Home / Programs
        masih berada di paling atas.
      */

      .fitalenta-header-transparent {
        background:
          transparent !important;

        background-color:
          transparent !important;

        background-image:
          none !important;

        box-shadow:
          none !important;

        backdrop-filter:
          none !important;

        -webkit-backdrop-filter:
          none !important;
      }


      /*
        Pastikan elemen di dalam navbar
        juga tidak punya background sendiri.
      */

      .fitalenta-header-transparent
      .fitalenta-navbar,

      .fitalenta-header-transparent
      .fitalenta-navbar-inner {
        background:
          transparent !important;

        background-color:
          transparent !important;

        background-image:
          none !important;
      }


      /* =====================================
         SPACER
      ====================================== */

      .fitalenta-header-spacer {
        width: 100%;

        height: 96px;

        display: block;

        flex-shrink: 0;

        pointer-events: none;
      }


      /* =====================================
         NAVBAR
      ====================================== */

      .fitalenta-navbar {
        width: 100%;

        margin: 0;

        padding: 0;

        background:
          transparent;

        font-family:
          "Figtree",
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }


      .fitalenta-navbar-inner {
        width:
          min(
            1180px,
            calc(
              100% - 40px
            )
          );

        min-height: 96px;

        margin:
          0 auto;

        padding:
          0;

        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          18px;

        position:
          relative;

        background:
          transparent;
      }


      /* =====================================
         LOGO
      ====================================== */

      .fitalenta-brand {
        position:
          relative;

        width:
          175px;

        height:
          64px;

        display:
          flex;

        align-items:
          center;

        flex-shrink:
          0;

        color:
          #ffffff;

        text-decoration:
          none;

        font-size:
          20px;

        font-weight:
          800;

        letter-spacing:
          .5px;

        overflow:
          visible;
      }


      .fitalenta-brand:hover {
        color:
          #ffffff;
      }


      .fitalenta-brand img {
        display:
          block;

        width:
          175px;

        height:
          64px;

        max-width:
          none;

        object-fit:
          contain;

        object-position:
          left center;

        transform:
          scale(1.75);

        transform-origin:
          left center;

        transition:
          transform
          .25s
          ease;
      }


      .fitalenta-brand:hover img {
        transform:
          scale(1.82);
      }


      /* =====================================
         NAV CONTENT
      ====================================== */

      .fitalenta-navbar-content {
        display:
          flex;

        flex:
          1;

        align-items:
          center;

        justify-content:
          flex-end;

        gap:
          14px;

        min-width:
          0;
      }


      .fitalenta-nav-menu,
      .fitalenta-auth-menu {
        display:
          flex;

        align-items:
          center;

        gap:
          2px;

        min-width:
          0;
      }


      /* =====================================
         NAV LINKS
      ====================================== */

      .fitalenta-nav-menu a,
      .fitalenta-login-link {
        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        min-height:
          42px;

        padding:
          0 11px;

        border-radius:
          9px;

        color:
          #ffffff;

        text-decoration:
          none;

        font-size:
          14px;

        font-weight:
          600;

        line-height:
          1;

        white-space:
          nowrap;

        transition:
          background
          .2s
          ease,
          color
          .2s
          ease;
      }


      .fitalenta-nav-menu a:hover,
      .fitalenta-nav-menu a.active,
      .fitalenta-login-link:hover,
      .fitalenta-login-link.active {
        background:
          rgba(
            255,
            255,
            255,
            .10
          );
      }


      .fitalenta-nav-menu a.active,
      .fitalenta-login-link.active {
        color:
          #E8491D;
      }


      /* =====================================
         AUTH
      ====================================== */

      .fitalenta-auth-menu {
        flex-shrink:
          0;

        gap:
          5px;
      }


      .fitalenta-register-btn {
        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        min-height:
          44px;

        padding:
          0 20px;

        margin-left:
          0;

        border-radius:
          9px;

        background:
          #ffffff;

        color:
          #00294B;

        text-decoration:
          none;

        font-size:
          14px;

        font-weight:
          700;

        box-shadow:
          0 6px 18px
          rgba(
            0,
            0,
            0,
            .10
          );

        transition:
          transform
          .2s
          ease,
          background
          .2s
          ease,
          color
          .2s
          ease;

        white-space:
          nowrap;
      }


      .fitalenta-register-btn:hover,
      .fitalenta-register-btn.active {
        background:
          #E8491D;

        color:
          #ffffff;

        transform:
          translateY(-1px);
      }


      /* =====================================
         USER
      ====================================== */

      .fitalenta-user {
        position:
          relative;

        flex-shrink:
          0;
      }


      .fitalenta-user-btn {
        min-height:
          44px;

        display:
          flex;

        align-items:
          center;

        gap:
          9px;

        padding:
          6px 12px 6px 7px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .15
          );

        border-radius:
          10px;

        background:
          rgba(
            255,
            255,
            255,
            .10
          );

        color:
          #ffffff;

        cursor:
          pointer;

        transition:
          all
          .25s
          ease;
      }


      .fitalenta-user-btn:hover {
        background:
          rgba(
            255,
            255,
            255,
            .18
          );
      }


      .fitalenta-avatar {
        width:
          32px;

        height:
          32px;

        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        border-radius:
          50%;

        background:
          #ffffff;

        color:
          #00294B;
      }


      .fitalenta-user-name {
        max-width:
          135px;

        overflow:
          hidden;

        white-space:
          nowrap;

        text-overflow:
          ellipsis;

        font-size:
          13px;

        font-weight:
          600;
      }


      .fitalenta-admin-badge {
        padding:
          3px 7px;

        border-radius:
          20px;

        background:
          #E8491D;

        color:
          #ffffff;

        font-size:
          10px;

        font-weight:
          700;
      }


      /* =====================================
         MOBILE BUTTON
      ====================================== */

      .fitalenta-menu-toggle {
        display:
          none;

        width:
          44px;

        height:
          44px;

        border:
          0;

        border-radius:
          10px;

        align-items:
          center;

        justify-content:
          center;

        flex-direction:
          column;

        gap:
          5px;

        background:
          rgba(
            255,
            255,
            255,
            .10
          );

        color:
          #ffffff;

        cursor:
          pointer;
      }


      .fitalenta-menu-toggle span {
        display:
          block;

        width:
          21px;

        height:
          2px;

        border-radius:
          2px;

        background:
          #ffffff;

        transition:
          all
          .25s
          ease;
      }


      .fitalenta-menu-toggle.active
      span:nth-child(1) {
        transform:
          translateY(7px)
          rotate(45deg);
      }


      .fitalenta-menu-toggle.active
      span:nth-child(2) {
        opacity:
          0;
      }


      .fitalenta-menu-toggle.active
      span:nth-child(3) {
        transform:
          translateY(-7px)
          rotate(-45deg);
      }


      /* =====================================
         LOADING
      ====================================== */

      .fitalenta-loading-inner {
        justify-content:
          center;
      }


      .fitalenta-loading {
        display:
          flex;

        align-items:
          center;

        gap:
          8px;

        color:
          #ffffff;
      }


      /* =====================================
         TABLET / MOBILE
      ====================================== */

      @media (
        max-width: 799px
      ) {

        .fitalenta-header-spacer {
          height:
            80px;
        }


        .fitalenta-navbar-inner {
          width:
            calc(
              100% - 28px
            );

          min-height:
            80px;
        }


        .fitalenta-brand {
          width:
            150px;

          height:
            58px;
        }


        .fitalenta-brand img {
          width:
            150px;

          height:
            58px;

          transform:
            scale(1.62);

          transform-origin:
            left center;
        }


        .fitalenta-brand:hover img {
          transform:
            scale(1.67);
        }


        .fitalenta-menu-toggle {
          display:
            flex;
        }


        .fitalenta-navbar-content {
          display:
            none;

          position:
            absolute;

          top:
            80px;

          left:
            -14px;

          width:
            calc(
              100% + 28px
            );

          padding:
            15px
            18px
            20px;

          flex-direction:
            column;

          align-items:
            stretch;

          gap:
            14px;

          background:
            rgba(
              0,
              41,
              75,
              .99
            );

          border-top:
            1px
            solid
            rgba(
              255,
              255,
              255,
              .10
            );

          box-shadow:
            0 16px 30px
            rgba(
              0,
              0,
              0,
              .18
            );

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);
        }


        .fitalenta-navbar-content.show {
          display:
            flex;
        }


        .fitalenta-nav-menu,
        .fitalenta-auth-menu {
          width:
            100%;

          display:
            flex;

          flex-direction:
            column;

          align-items:
            stretch;

          gap:
            4px;
        }


        .fitalenta-nav-menu a,
        .fitalenta-login-link {
          width:
            100%;

          justify-content:
            flex-start;

          min-height:
            auto;

          padding:
            13px 14px;
        }


        .fitalenta-register-btn {
          width:
            100%;

          margin:
            4px 0 0;
        }


        .fitalenta-user {
          width:
            100%;
        }


        .fitalenta-user-btn {
          width:
            100%;

          justify-content:
            flex-start;
        }
      }


      /* =====================================
         SMALL MOBILE
      ====================================== */

      @media (
        max-width: 480px
      ) {

        .fitalenta-header-spacer {
          height:
            76px;
        }


        .fitalenta-navbar-inner {
          width:
            calc(
              100% - 24px
            );

          min-height:
            76px;
        }


        .fitalenta-brand {
          width:
            138px;

          height:
            54px;
        }


        .fitalenta-brand img {
          width:
            138px;

          height:
            54px;

          transform:
            scale(1.55);

          transform-origin:
            left center;
        }


        .fitalenta-brand:hover img {
          transform:
            scale(1.60);
        }


        .fitalenta-navbar-content {
          top:
            76px;

          left:
            -12px;

          width:
            calc(
              100% + 24px
            );
        }
      }

    `}</style>
  );
};


export default Navbar;
