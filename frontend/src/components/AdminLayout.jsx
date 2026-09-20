import "../AdminFitalenta.css";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 992 : false
    );

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location.pathname]);

    const isActive = (menuItem) => {
        if (menuItem.exact) {
            return location.pathname === menuItem.path;
        }

        return (
            location.pathname === menuItem.path ||
            location.pathname.startsWith(`${menuItem.path}/`)
        );
    };

    const currentPage =
        ADMIN_MENU_ITEMS.find((item) => isActive(item)) ||
        ADMIN_MENU_ITEMS[0];

    const displayName =
        user?.full_name ||
        user?.email ||
        "Admin Fitalenta";

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

   const handleLogout = async () => {
    await logout();
    window.location.href = "https://www.fitalenta.co.id/";
};

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen((prev) => !prev);
    };

    const renderMenu = (mobile = false) => (
        <nav className="admin-sidebar-navigation">
            <div className="admin-sidebar-section-label">
                {!sidebarCollapsed || mobile ? "UTAMA" : ""}
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
                                <span className="admin-sidebar-menu-icon">
                                    <i
                                        className={`bi ${item.icon}`}
                                        aria-hidden="true"
                                    ></i>
                                </span>

                                {(!sidebarCollapsed || mobile) && (
                                    <span className="admin-sidebar-menu-content">
                                        <strong>{item.label}</strong>

                                        <small>
                                            {item.description}
                                        </small>
                                    </span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );

    const renderSidebarFooter = (mobile = false) => (
        <div className="admin-sidebar-footer">
            {(!sidebarCollapsed || mobile) && (
                <div className="admin-sidebar-user-summary">
                    <div className="admin-sidebar-user-avatar">
                        {initials}
                    </div>

                    <div className="admin-sidebar-user-copy">
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
                    sidebarCollapsed && !mobile
                        ? "Keluar Aplikasi"
                        : undefined
                }
            >
                <span className="admin-sidebar-logout-icon">
                    <i className="bi bi-box-arrow-right"></i>
                </span>

                {(!sidebarCollapsed || mobile) && (
                    <span className="admin-sidebar-footer-label">
                        Keluar Aplikasi
                    </span>
                )}
            </button>
        </div>
    );

    return (
        <div className="admin-layout">
            {!isMobile && (
                <aside
                    className={`admin-sidebar ${
                        sidebarCollapsed
                            ? "admin-sidebar-collapsed"
                            : ""
                    }`}
                >
                    <div className="admin-sidebar-header">
                        <Link
                            to="/admin"
                            className="admin-sidebar-brand"
                            title={
                                sidebarCollapsed
                                    ? "FITALENTA Admin Management"
                                    : undefined
                            }
                        >
                            <span className="admin-sidebar-brand-icon">
                                <span>F</span>
                            </span>

                            {!sidebarCollapsed && (
                                <span className="admin-sidebar-brand-copy">
                                    <strong>FITALENTA</strong>
                                    <small>ADMIN MANAGEMENT</small>
                                </span>
                            )}
                        </Link>

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

                    {renderMenu(false)}

                    {renderSidebarFooter(false)}
                </aside>
            )}

            {isMobile && mobileSidebarOpen && (
                <button
                    type="button"
                    className="admin-mobile-sidebar-overlay"
                    onClick={() =>
                        setMobileSidebarOpen(false)
                    }
                    aria-label="Tutup menu"
                ></button>
            )}

            {isMobile && (
                <aside
                    className={`admin-mobile-sidebar ${
                        mobileSidebarOpen ? "open" : ""
                    }`}
                >
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
                                <small>ADMIN MANAGEMENT</small>
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

                    {renderMenu(true)}

                    {renderSidebarFooter(true)}
                </aside>
            )}

            <div
                className={`admin-main ${
                    sidebarCollapsed
                        ? "admin-main-sidebar-collapsed"
                        : ""
                }`}
            >
                <header className="admin-topbar">
                    <div className="admin-topbar-inner">
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
                                <span className="admin-page-title-indicator"></span>

                                <div className="admin-page-title-copy">
                                    <strong>
                                        {currentPage.label}
                                    </strong>

                                    <span>
                                        FITALENTA Admin Management
                                    </span>
                                </div>
                            </div>
                        </div>

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
                                        <strong>
                                            {displayName}
                                        </strong>

                                        <small>
                                            Administrator
                                        </small>
                                    </span>

                                    <i className="bi bi-chevron-down admin-user-menu-chevron"></i>
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end admin-user-dropdown">
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

                                    <li>
                                        <button
                                            type="button"
                                            className="dropdown-item admin-user-dropdown-logout"
                                            onClick={handleLogout}
                                        >
                                            <i className="bi bi-box-arrow-right"></i>

                                            Keluar Aplikasi
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="admin-content-area">
                    <div className="admin-content-container">
                        {children}
                    </div>
                </main>

                <footer className="admin-footer">
                    <span>
                        © {new Date().getFullYear()}{" "}
                        <strong>FITALENTA</strong>. All rights reserved.
                    </span>

                    <span>
                        Admin Management Panel
                    </span>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;
