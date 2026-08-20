import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   ADMIN MENU CONFIGURATION
========================================================= */
const ADMIN_MENU_ITEMS = [
    {
        path: "/admin",
        icon: "bi-speedometer2",
        label: "Dashboard",
        description: "Ringkasan sistem",
        exact: true,
    },
    {
        path: "/admin/payments",
        icon: "bi-credit-card",
        label: "Manajemen Pembayaran",
        description: "Transaksi & invoice",
    },
    {
        path: "/admin/selection-and-placement",
        icon: "bi-clipboard-check",
        label: "Manajemen Seleksi & Penyaluran",
        description: "Seleksi dan penempatan",
    },
    {
        path: "/admin/financial-reports",
        icon: "bi-graph-up-arrow",
        label: "Laporan Keuangan",
        description: "Rekap & laporan",
    },
    {
        path: "/admin/programs",
        icon: "bi-journal-text",
        label: "Manajemen Program",
        description: "Program pelatihan",
    },
    {
        path: "/admin/users",
        icon: "bi-people",
        label: "Manajemen User",
        description: "Peserta & administrator",
    },
];

/* =========================================================
   ADMIN LAYOUT
========================================================= */
const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 992 : false
    );
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    /* ---------------------------------------------------------
       RESPONSIVE SIDEBAR
    --------------------------------------------------------- */
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 992;

            setIsMobile(mobile);

            if (!mobile) {
                setMobileSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    /* ---------------------------------------------------------
       CLOSE MOBILE SIDEBAR AFTER ROUTE CHANGE
    --------------------------------------------------------- */
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location.pathname]);

    /* ---------------------------------------------------------
       ACTIVE MENU
    --------------------------------------------------------- */
    const isActive = (menuItem) => {
        if (menuItem.exact) {
            return location.pathname === menuItem.path;
        }

        return (
            location.pathname === menuItem.path ||
            location.pathname.startsWith(`${menuItem.path}/`)
        );
    };

    /* ---------------------------------------------------------
       CURRENT PAGE INFORMATION
    --------------------------------------------------------- */
    const currentPage =
        ADMIN_MENU_ITEMS.find((item) => isActive(item)) ||
        ADMIN_MENU_ITEMS[0];

    /* ---------------------------------------------------------
       USER INFORMATION
    --------------------------------------------------------- */
    const displayName = user?.full_name || user?.email || "Admin Fitalenta";

    const getInitials = (name) => {
        if (!name) return "A";

        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
    };

    const initials = getInitials(displayName);

    /* ---------------------------------------------------------
       LOGOUT
    --------------------------------------------------------- */
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    /* ---------------------------------------------------------
       MOBILE SIDEBAR
    --------------------------------------------------------- */
    const toggleMobileSidebar = () => {
        setMobileSidebarOpen((prev) => !prev);
    };

    /* ---------------------------------------------------------
       SIDEBAR MENU
    --------------------------------------------------------- */
    const renderMenu = (mobile = false) => (
        <nav className="admin-sidebar-navigation">
            <div className="admin-sidebar-section-label">
                {!sidebarCollapsed || mobile ? "MENU UTAMA" : ""}
            </div>

            <ul className="admin-sidebar-menu">
                {ADMIN_MENU_ITEMS.map((item) => {
                    const active = isActive(item);

                    return (
                        <li
                            key={item.path}
                            className="admin-sidebar-menu-item"
                        >
                            <Link
                                to={item.path}
                                className={`admin-sidebar-menu-link ${
                                    active ? "active" : ""
                                }`}
                                title={
                                    sidebarCollapsed && !mobile
                                        ? item.label
                                        : undefined
                                }
                                onClick={() => {
                                    if (mobile) {
                                        setMobileSidebarOpen(false);
                                    }
                                }}
                            >
                                {/* --- Menu Icon --- */}
                                <span className="admin-sidebar-menu-icon">
                                    <i
                                        className={`bi ${item.icon}`}
                                        aria-hidden="true"
                                    ></i>
                                </span>

                                {/* --- Menu Text --- */}
                                {(!sidebarCollapsed || mobile) && (
                                    <span className="admin-sidebar-menu-content">
                                        <strong>{item.label}</strong>
                                        <small>{item.description}</small>
                                    </span>
                                )}

                                {/* --- Active Indicator --- */}
                                {active && (
                                    <span className="admin-sidebar-active-indicator"></span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );

    return (
        <div className="admin-layout">
            {/* =========================================================
                DESKTOP SIDEBAR
            ========================================================= */}
            {!isMobile && (
                <aside
                    className={`admin-sidebar ${
                        sidebarCollapsed
                            ? "admin-sidebar-collapsed"
                            : ""
                    }`}
                >
                    {/* ---------------------------------------------------------
                        SIDEBAR BRAND
                    --------------------------------------------------------- */}
                    <div className="admin-sidebar-header">
                        <Link
                            to="/admin"
                            className="admin-sidebar-brand"
                            title={
                                sidebarCollapsed
                                    ? "FITALENTA Admin Panel"
                                    : undefined
                            }
                        >
                            <span className="admin-sidebar-brand-icon">
                                <span>F</span>
                            </span>

                            {!sidebarCollapsed && (
                                <span className="admin-sidebar-brand-copy">
                                    <strong>FITALENTA</strong>
                                    <small>Admin Panel</small>
                                </span>
                            )}
                        </Link>

                        {/* ---------------------------------------------------------
                            COLLAPSE BUTTON
                        --------------------------------------------------------- */}
                        <button
                            type="button"
                            className="admin-sidebar-collapse-button"
                            onClick={() =>
                                setSidebarCollapsed((prev) => !prev)
                            }
                            aria-label={
                                sidebarCollapsed
                                    ? "Perbesar sidebar"
                                    : "Perkecil sidebar"
                            }
                            title={
                                sidebarCollapsed
                                    ? "Perbesar sidebar"
                                    : "Perkecil sidebar"
                            }
                        >
                            <i
                                className={`bi ${
                                    sidebarCollapsed
                                        ? "bi-chevron-right"
                                        : "bi-chevron-left"
                                }`}
                            ></i>
                        </button>
                    </div>

                    {/* ---------------------------------------------------------
                        SIDEBAR MENU
                    --------------------------------------------------------- */}
                    {renderMenu(false)}

                    {/* ---------------------------------------------------------
                        SIDEBAR FOOTER
                    --------------------------------------------------------- */}
                    <div className="admin-sidebar-footer">
                        {!sidebarCollapsed && (
                            <div className="admin-sidebar-user-summary">
                                <div className="admin-sidebar-user-avatar">
                                    {initials}
                                </div>

                                <div>
                                    <strong>{displayName}</strong>
                                    <span>Administrator</span>
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            className="admin-sidebar-logout"
                            onClick={handleLogout}
                            title={
                                sidebarCollapsed
                                    ? "Logout"
                                    : undefined
                            }
                        >
                            <span className="admin-sidebar-logout-icon">
                                <i className="bi bi-box-arrow-right"></i>
                            </span>

                            {!sidebarCollapsed && (
                                <span className="admin-sidebar-footer-label">
                                    Logout
                                </span>
                            )}
                        </button>
                    </div>
                </aside>
            )}

            {/* =========================================================
                MOBILE SIDEBAR OVERLAY
            ========================================================= */}
            {isMobile && mobileSidebarOpen && (
                <button
                    type="button"
                    className="admin-mobile-sidebar-overlay"
                    onClick={() => setMobileSidebarOpen(false)}
                    aria-label="Tutup menu"
                ></button>
            )}

            {/* =========================================================
                MOBILE SIDEBAR
            ========================================================= */}
            {isMobile && (
                <aside
                    className={`admin-mobile-sidebar ${
                        mobileSidebarOpen ? "open" : ""
                    }`}
                >
                    {/* ---------------------------------------------------------
                        MOBILE SIDEBAR HEADER
                    --------------------------------------------------------- */}
                    <div className="admin-sidebar-header">
                        <Link
                            to="/admin"
                            className="admin-sidebar-brand"
                            onClick={() =>
                                setMobileSidebarOpen(false)
                            }
                        >
                            <span className="admin-sidebar-brand-icon">
                                <span>F</span>
                            </span>

                            <span className="admin-sidebar-brand-copy">
                                <strong>FITALENTA</strong>
                                <small>Admin Panel</small>
                            </span>
                        </Link>

                        <button
                            type="button"
                            className="admin-sidebar-mobile-close"
                            onClick={() =>
                                setMobileSidebarOpen(false)
                            }
                            aria-label="Tutup menu"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    {/* ---------------------------------------------------------
                        MOBILE SIDEBAR MENU
                    --------------------------------------------------------- */}
                    {renderMenu(true)}

                    {/* ---------------------------------------------------------
                        MOBILE SIDEBAR FOOTER
                    --------------------------------------------------------- */}
                    <div className="admin-sidebar-footer">
                        <div className="admin-sidebar-user-summary">
                            <div className="admin-sidebar-user-avatar">
                                {initials}
                            </div>

                            <div>
                                <strong>{displayName}</strong>
                                <span>Administrator</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="admin-sidebar-logout"
                            onClick={handleLogout}
                        >
                            <span className="admin-sidebar-logout-icon">
                                <i className="bi bi-box-arrow-right"></i>
                            </span>

                            <span className="admin-sidebar-footer-label">
                                Logout
                            </span>
                        </button>
                    </div>
                </aside>
            )}

            {/* =========================================================
                MAIN AREA
            ========================================================= */}
            <div className="admin-main">
                {/* =========================================================
                    ADMIN TOPBAR
                ========================================================= */}
                <header className="admin-topbar">
                    <div className="admin-topbar-inner">
                        {/* ---------------------------------------------------------
                            LEFT TOPBAR
                        --------------------------------------------------------- */}
                        <div className="admin-topbar-left">
                            {isMobile && (
                                <button
                                    type="button"
                                    className="admin-mobile-menu-button"
                                    onClick={toggleMobileSidebar}
                                    aria-label="Buka menu"
                                >
                                    <i className="bi bi-list"></i>
                                </button>
                            )}

                            <div className="admin-page-context">
                                <span className="admin-page-context-icon">
                                    <i
                                        className={`bi ${currentPage.icon}`}
                                    ></i>
                                </span>

                                <div>
                                    <span>ADMIN PANEL</span>
                                    <strong>{currentPage.label}</strong>
                                </div>
                            </div>
                        </div>

                        {/* ---------------------------------------------------------
                            RIGHT TOPBAR
                        --------------------------------------------------------- */}
                        <div className="admin-topbar-right">
                            <div className="dropdown">
                                <button
                                    type="button"
                                    className="admin-user-menu"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <span className="admin-topbar-avatar">
                                        {initials}
                                    </span>

                                    <span className="admin-topbar-user-info">
                                        <small>Administrator</small>
                                        <strong>{displayName}</strong>
                                    </span>

                                    <i className="bi bi-chevron-down admin-user-menu-chevron"></i>
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end admin-user-dropdown">
                                    {/* --- Dropdown User Information --- */}
                                    <li>
                                        <div className="admin-user-dropdown-header">
                                            <div className="admin-user-dropdown-avatar">
                                                {initials}
                                            </div>

                                            <div>
                                                <strong>
                                                    {displayName}
                                                </strong>
                                                <span>
                                                    {user?.email ||
                                                        "Administrator FITALENTA"}
                                                </span>
                                            </div>
                                        </div>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>

                                    {/* --- Dropdown Logout --- */}
                                    <li>
                                        <button
                                            type="button"
                                            className="dropdown-item admin-user-dropdown-logout"
                                            onClick={handleLogout}
                                        >
                                            <i className="bi bi-box-arrow-right"></i>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>

                {/* =========================================================
                    PAGE CONTENT
                ========================================================= */}
                <main className="admin-content-area">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;