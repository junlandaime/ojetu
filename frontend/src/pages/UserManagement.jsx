import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

/* =========================================================
   USER MANAGEMENT
========================================================= */
const UserManagement = () => {
    /* ---------------------------------------------------------
       STATE DATA
    --------------------------------------------------------- */
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    /* ---------------------------------------------------------
       DEFAULT FORM DATA
    --------------------------------------------------------- */
    const defaultFormData = {
        full_name: "",
        email: "",
        phone: "",
        address: "",
        user_type: "participant",
        password: "",
    };
    const [formData, setFormData] = useState(defaultFormData);

    /* =========================================================
       FETCH DATA
    ========================================================= */

    /* ---------------------------------------------------------
       FETCH USERS
    --------------------------------------------------------- */
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.get("/api/admin/users");
            setUsers(
                Array.isArray(response.data?.data)
                    ? response.data.data
                    : []
            );
        } catch (error) {
            console.error("Error fetching users:", error);
            showError(
                error.response?.data?.message ||
                "Gagal memuat data user"
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       EFFECT
    ========================================================= */

    /* ---------------------------------------------------------
       INITIAL DATA
    --------------------------------------------------------- */
    useEffect(() => {
        fetchUsers();
    }, []);

    /* ---------------------------------------------------------
       AUTO HIDE NOTIFICATION
    --------------------------------------------------------- */
    useEffect(() => {
        if (!success && !error) {
            return undefined;
        }
        const timer = setTimeout(() => {
            setSuccess("");
            setError("");
        }, 5000);
        return () => clearTimeout(timer);
    }, [success, error]);

    /* ---------------------------------------------------------
       BODY SCROLL LOCK
    --------------------------------------------------------- */
    useEffect(() => {
        if (!showModal) {
            return undefined;
        }
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [showModal]);

    /* =========================================================
       NOTIFICATION
    ========================================================= */

    /* ---------------------------------------------------------
       SUCCESS MESSAGE
    --------------------------------------------------------- */
    const showSuccess = (message) => {
        setSuccess(message);
        setError("");
    };

    /* ---------------------------------------------------------
       ERROR MESSAGE
    --------------------------------------------------------- */
    const showError = (message) => {
        setError(message);
        setSuccess("");
    };

    /* =========================================================
       FORM CONTROL
    ========================================================= */

    /* ---------------------------------------------------------
       RESET FORM
    --------------------------------------------------------- */
    const resetForm = () => {
        setFormData({
            ...defaultFormData,
        });
        setEditingUser(null);
    };

    /* ---------------------------------------------------------
       OPEN ADD MODAL
    --------------------------------------------------------- */
    const handleAdd = () => {
        resetForm();
        setShowModal(true);
    };

    /* ---------------------------------------------------------
       OPEN EDIT MODAL
    --------------------------------------------------------- */
    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            full_name: user.full_name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            user_type: user.user_type || "participant",
            password: "",
        });
        setShowModal(true);
    };

    /* ---------------------------------------------------------
       CLOSE MODAL
    --------------------------------------------------------- */
    const closeModal = () => {
        if (saving) {
            return;
        }
        setShowModal(false);
        resetForm();
    };

    /* ---------------------------------------------------------
       HANDLE FORM CHANGE
    --------------------------------------------------------- */
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =========================================================
       USER ACTIONS
    ========================================================= */

    /* ---------------------------------------------------------
       SUBMIT USER
    --------------------------------------------------------- */
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            setError("");
            if (editingUser) {
                const submitData = {
                    ...formData,
                };
                if (!submitData.password) {
                    delete submitData.password;
                }
                await axios.put(
                    `/api/admin/users/${editingUser.id}`,
                    submitData
                );
                showSuccess("User berhasil diperbarui!");
            } else {
                if (!formData.password) {
                    showError(
                        "Password wajib diisi untuk user baru"
                    );
                    return;
                }
                await axios.post(
                    "/api/admin/users",
                    formData
                );
                showSuccess("User berhasil ditambahkan!");
            }
            setShowModal(false);
            resetForm();
            await fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            const message =
                error.response?.data?.message ||
                "Gagal menyimpan data user";
            showError(message);
        } finally {
            setSaving(false);
        }
    };

    /* ---------------------------------------------------------
       DELETE USER
    --------------------------------------------------------- */
    const handleDelete = async (userId) => {
        const userToDelete = users.find(
            (user) => user.id === userId
        );
        if (
            !window.confirm(
                `Apakah Anda yakin ingin menghapus user "${userToDelete?.full_name}"?\n\n` +
                "PERHATIAN: Semua data user termasuk:\n" +
                "• Data pendaftaran\n" +
                "• Data pembayaran\n" +
                "• File foto, dokumen, dan bukti pembayaran\n" +
                "• Jumlah peserta program akan disesuaikan\n" +
                "akan dihapus secara permanen!"
            )
        ) {
            return;
        }
        try {
            const response = await axios.delete(
                `/api/admin/users/${userId}`
            );
            showSuccess(
                response.data?.message ||
                "User berhasil dihapus"
            );
            await fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            const message =
                error.response?.data?.message ||
                "Gagal menghapus user";
            showError(message);
        }
    };

    /* ---------------------------------------------------------
       SYNC PARTICIPANTS
    --------------------------------------------------------- */
    const handleSyncParticipants = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                "/api/programs/sync-participants"
            );
            showSuccess(
                response.data?.message ||
                "Sinkronisasi user berhasil"
            );
        } catch (error) {
            console.error(
                "Error syncing participants:",
                error
            );
            const message =
                error.response?.data?.message ||
                "Gagal sinkronisasi participants";
            showError(message);
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       FORMAT UTILITIES
    ========================================================= */

    /* ---------------------------------------------------------
       USER INITIALS
    --------------------------------------------------------- */
    const getInitials = (name) => {
        if (!name) {
            return "U";
        }
        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((item) =>
                item.charAt(0).toUpperCase()
            )
            .join("");
    };

    /* ---------------------------------------------------------
       USER TYPE
    --------------------------------------------------------- */
    const getUserTypeBadge = (userType) => {
        if (userType === "admin") {
            return (
                <span className="user-type-badge user-type-admin">
                    <i className="bi bi-shield-check"></i>
                    Admin
                </span>
            );
        }
        return (
            <span className="user-type-badge user-type-participant">
                <i className="bi bi-person"></i>
                Peserta
            </span>
        );
    };

    /* ---------------------------------------------------------
       DATE
    --------------------------------------------------------- */
    const formatDate = (value) => {
        if (!value) {
            return "-";
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "-";
        }
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    /* ---------------------------------------------------------
       TIME
    --------------------------------------------------------- */
    const formatTime = (value) => {
        if (!value) {
            return "-";
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "-";
        }
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    /* =========================================================
       USER SUMMARY
    ========================================================= */

    /* ---------------------------------------------------------
       SUMMARY VALUES
    --------------------------------------------------------- */
    const userSummary = {
        total: users.length,
        participants: users.filter(
            (user) =>
                user.user_type === "participant"
        ).length,
        admins: users.filter(
            (user) =>
                user.user_type === "admin"
        ).length,
        withPhone: users.filter(
            (user) => Boolean(user.phone)
        ).length,
    };

    /* =========================================================
       INITIAL LOADING
    ========================================================= */
    if (loading && users.length === 0) {
        return (
            <div className="user-management-page">
                <div className="user-loading-state">
                    <div className="user-loading-icon">
                        <span
                            className="spinner-border"
                            role="status"
                        ></span>
                    </div>
                    <h4>Memuat data user</h4>
                    <p>
                        Informasi pengguna sedang
                        disiapkan.
                    </p>
                </div>
            </div>
        );
    }

    /* =========================================================
       USER MODAL
    ========================================================= */
    const userModal =
        showModal &&
        createPortal(
            <div
                className="user-modal-overlay"
                onMouseDown={(event) => {
                    if (
                        event.target ===
                        event.currentTarget
                    ) {
                        closeModal();
                    }
                }}
            >
                <div
                    className="user-modal-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="user-modal-title"
                >
                    <div className="user-modal-content">
                        {/* =========================================================
                            MODAL HEADER
                        ========================================================= */}
                        <div className="user-modal-header">
                            {/* ---------------------------------------------------------
                               MODAL TITLE
                            --------------------------------------------------------- */}
                            <div className="user-modal-heading">
                                <div className="user-modal-heading-icon">
                                    <i
                                        className={`bi ${
                                            editingUser
                                                ? "bi-pencil-square"
                                                : "bi-person-plus"
                                        }`}
                                    ></i>
                                </div>
                                <div>
                                    <span>
                                        {editingUser
                                            ? "PERBARUI USER"
                                            : "USER BARU"}
                                    </span>
                                    <h2 id="user-modal-title">
                                        {editingUser
                                            ? "Edit User"
                                            : "Tambah User"}
                                    </h2>
                                    <p>
                                        {editingUser
                                            ? "Perbarui informasi dan pengaturan akun pengguna yang dipilih."
                                            : "Lengkapi informasi akun untuk menambahkan pengguna baru ke sistem."}
                                    </p>
                                </div>
                            </div>

                            {/* ---------------------------------------------------------
                               MODAL CLOSE
                            --------------------------------------------------------- */}
                            <button
                                type="button"
                                className="user-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                                aria-label="Tutup modal"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {/* =========================================================
                            MODAL FORM
                        ========================================================= */}
                        <form
                            className="user-modal-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="user-modal-body">
                                {/* =========================================================
                                    ACCOUNT INFORMATION
                                ========================================================= */}
                                <section className="user-form-section">
                                    {/* ---------------------------------------------------------
                                       SECTION HEADING
                                    --------------------------------------------------------- */}
                                    <div className="user-form-section-heading">
                                        <div className="user-form-section-icon">
                                            <i className="bi bi-person-vcard"></i>
                                        </div>
                                        <div>
                                            <span>
                                                INFORMASI AKUN
                                            </span>
                                            <h3>
                                                Identitas User
                                            </h3>
                                            <p>
                                                Informasi dasar pengguna
                                                yang terdaftar pada sistem.
                                            </p>
                                        </div>
                                    </div>

                                    {/* ---------------------------------------------------------
                                       NAME & EMAIL
                                    --------------------------------------------------------- */}
                                    <div className="user-form-grid user-form-grid-two">
                                        <div className="user-form-field">
                                            <label htmlFor="full_name">
                                                Nama Lengkap
                                                <span> *</span>
                                            </label>
                                            <div className="user-input-with-icon">
                                                <i className="bi bi-person"></i>
                                                <input
                                                    type="text"
                                                    id="full_name"
                                                    name="full_name"
                                                    value={
                                                        formData.full_name
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="Masukkan nama lengkap"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="user-form-field">
                                            <label htmlFor="email">
                                                Email
                                                <span> *</span>
                                            </label>
                                            <div className="user-input-with-icon">
                                                <i className="bi bi-envelope"></i>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={
                                                        formData.email
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="contoh@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ---------------------------------------------------------
                                       PHONE & USER TYPE
                                    --------------------------------------------------------- */}
                                    <div className="user-form-grid user-form-grid-two">
                                        <div className="user-form-field">
                                            <label htmlFor="phone">
                                                Telepon
                                            </label>
                                            <div className="user-input-with-icon">
                                                <i className="bi bi-telephone"></i>
                                                <input
                                                    type="text"
                                                    id="phone"
                                                    name="phone"
                                                    value={
                                                        formData.phone
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="08xxxxxxxxxx"
                                                />
                                            </div>
                                        </div>
                                        <div className="user-form-field">
                                            <label htmlFor="user_type">
                                                Tipe User
                                                <span> *</span>
                                            </label>
                                            <div className="user-select-with-icon">
                                                <i className="bi bi-person-badge"></i>
                                                <select
                                                    id="user_type"
                                                    name="user_type"
                                                    value={
                                                        formData.user_type
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    required
                                                >
                                                    <option value="participant">
                                                        Peserta
                                                    </option>
                                                    <option value="admin">
                                                        Administrator
                                                    </option>
                                                </select>
                                            </div>
                                            <small>
                                                {formData.user_type ===
                                                "admin"
                                                    ? "Administrator memiliki akses penuh ke fitur admin."
                                                    : "Peserta dapat melakukan pendaftaran dan mengikuti program."}
                                            </small>
                                        </div>
                                    </div>

                                    {/* ---------------------------------------------------------
                                       ADDRESS
                                    --------------------------------------------------------- */}
                                    <div className="user-form-field">
                                        <label htmlFor="address">
                                            Alamat
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            rows="4"
                                            value={
                                                formData.address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Masukkan alamat lengkap pengguna..."
                                        ></textarea>
                                    </div>
                                </section>

                                {/* =========================================================
                                    SECURITY INFORMATION
                                ========================================================= */}
                                <section className="user-form-section">
                                    {/* ---------------------------------------------------------
                                       SECTION HEADING
                                    --------------------------------------------------------- */}
                                    <div className="user-form-section-heading">
                                        <div className="user-form-section-icon">
                                            <i className="bi bi-shield-lock"></i>
                                        </div>
                                        <div>
                                            <span>
                                                KEAMANAN AKUN
                                            </span>
                                            <h3>
                                                Password User
                                            </h3>
                                            <p>
                                                Atur password yang
                                                digunakan pengguna untuk
                                                mengakses sistem.
                                            </p>
                                        </div>
                                    </div>

                                    {/* ---------------------------------------------------------
                                       PASSWORD
                                    --------------------------------------------------------- */}
                                    <div className="user-form-field">
                                        <label htmlFor="password">
                                            {editingUser
                                                ? "Password Baru"
                                                : "Password"}
                                            {!editingUser && (
                                                <span> *</span>
                                            )}
                                        </label>
                                        <div className="user-input-with-icon">
                                            <i className="bi bi-key"></i>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={
                                                    formData.password
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required={
                                                    !editingUser
                                                }
                                                minLength={6}
                                                placeholder={
                                                    editingUser
                                                        ? "Kosongkan jika tidak ingin mengubah password"
                                                        : "Masukkan password minimal 6 karakter"
                                                }
                                            />
                                        </div>
                                        <small>
                                            {editingUser
                                                ? "Biarkan kosong apabila password lama tetap digunakan."
                                                : "Gunakan minimal 6 karakter untuk password user."}
                                        </small>
                                    </div>

                                    {/* ---------------------------------------------------------
                                       SECURITY NOTE
                                    --------------------------------------------------------- */}
                                    <div className="user-security-note">
                                        <div>
                                            <i className="bi bi-info-circle"></i>
                                        </div>
                                        <div>
                                            <strong>
                                                Keamanan akun
                                            </strong>
                                            <span>
                                                Pastikan email dan tipe user
                                                telah sesuai sebelum data
                                                disimpan.
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* =========================================================
                                MODAL FOOTER
                            ========================================================= */}
                            <div className="user-modal-footer">
                                {/* ---------------------------------------------------------
                                   CANCEL BUTTON
                                --------------------------------------------------------- */}
                                <button
                                    type="button"
                                    className="user-secondary-button"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Batal
                                </button>

                                {/* ---------------------------------------------------------
                                   SAVE BUTTON
                                --------------------------------------------------------- */}
                                <button
                                    type="submit"
                                    className="user-primary-button"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check2-circle"></i>
                                            {editingUser
                                                ? "Simpan Perubahan"
                                                : "Simpan User"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>,
            document.body
        );

    /* =========================================================
       MAIN RENDER
    ========================================================= */
    return (
        <div className="user-management-page">
            {/* =========================================================
                PAGE HEADER
            ========================================================= */}
            <header className="user-page-header">
                {/* ---------------------------------------------------------
                   PAGE HEADING
                --------------------------------------------------------- */}
                <div className="user-page-heading">
                    <div className="user-page-eyebrow">
                        <span>
                            <i className="bi bi-people"></i>
                        </span>
                        MANAJEMEN USER
                    </div>
                    <h1>Manajemen User</h1>
                    <p>
                        Kelola akun peserta dan administrator,
                        informasi kontak, serta hak akses pengguna
                        FITALENTA.
                    </p>
                </div>

                {/* ---------------------------------------------------------
                   PAGE ACTIONS
                --------------------------------------------------------- */}
                <div className="user-page-actions">
                    <button
                        type="button"
                        className="user-sync-button"
                        onClick={
                            handleSyncParticipants
                        }
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm"></span>
                                Sinkronisasi...
                            </>
                        ) : (
                            <>
                                <span className="user-sync-button-icon">
                                    <i className="bi bi-arrow-repeat"></i>
                                </span>
                                <span className="user-action-copy">
                                    <strong>
                                        Sinkron User
                                    </strong>
                                    <small>
                                        Perbarui jumlah peserta
                                    </small>
                                </span>
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        className="user-add-button"
                        onClick={handleAdd}
                    >
                        <span className="user-add-button-icon">
                            <i className="bi bi-plus-lg"></i>
                        </span>
                        <span className="user-action-copy">
                            <strong>
                                Tambah User
                            </strong>
                            <small>
                                Buat akun baru
                            </small>
                        </span>
                    </button>
                </div>
            </header>

            {/* =========================================================
                NOTIFICATION
            ========================================================= */}
            {(success || error) && (
                <div
                    className={`user-alert ${
                        error
                            ? "user-alert-error"
                            : "user-alert-success"
                    }`}
                >
                    {/* ---------------------------------------------------------
                       ALERT ICON
                    --------------------------------------------------------- */}
                    <div className="user-alert-icon">
                        <i
                            className={`bi ${
                                error
                                    ? "bi-exclamation-triangle"
                                    : "bi-check-circle"
                            }`}
                        ></i>
                    </div>

                    {/* ---------------------------------------------------------
                       ALERT CONTENT
                    --------------------------------------------------------- */}
                    <div className="user-alert-content">
                        <strong>
                            {error
                                ? "Terjadi kendala"
                                : "Berhasil"}
                        </strong>
                        <span>
                            {error || success}
                        </span>
                    </div>

                    {/* ---------------------------------------------------------
                       ALERT CLOSE
                    --------------------------------------------------------- */}
                    <button
                        type="button"
                        onClick={() => {
                            setError("");
                            setSuccess("");
                        }}
                        aria-label="Tutup pemberitahuan"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}

            {/* =========================================================
                SUMMARY
            ========================================================= */}
            <section className="user-summary-grid">
                {/* ---------------------------------------------------------
                   TOTAL USERS
                --------------------------------------------------------- */}
                <article className="user-summary-card">
                    <div className="user-summary-icon">
                        <i className="bi bi-people"></i>
                    </div>
                    <div>
                        <span>TOTAL USER</span>
                        <strong>
                            {userSummary.total}
                        </strong>
                        <small>
                            Seluruh akun terdaftar
                        </small>
                    </div>
                </article>

                {/* ---------------------------------------------------------
                   PARTICIPANTS
                --------------------------------------------------------- */}
                <article className="user-summary-card">
                    <div className="user-summary-icon user-summary-icon-participant">
                        <i className="bi bi-person"></i>
                    </div>
                    <div>
                        <span>PESERTA</span>
                        <strong>
                            {userSummary.participants}
                        </strong>
                        <small>
                            Akun peserta program
                        </small>
                    </div>
                </article>

                {/* ---------------------------------------------------------
                   ADMINISTRATORS
                --------------------------------------------------------- */}
                <article className="user-summary-card">
                    <div className="user-summary-icon user-summary-icon-admin">
                        <i className="bi bi-shield-check"></i>
                    </div>
                    <div>
                        <span>ADMINISTRATOR</span>
                        <strong>
                            {userSummary.admins}
                        </strong>
                        <small>
                            Pengelola sistem
                        </small>
                    </div>
                </article>

                {/* ---------------------------------------------------------
                   CONTACT COMPLETENESS
                --------------------------------------------------------- */}
                <article className="user-summary-card">
                    <div className="user-summary-icon user-summary-icon-contact">
                        <i className="bi bi-telephone"></i>
                    </div>
                    <div>
                        <span>KONTAK TERISI</span>
                        <strong>
                            {userSummary.withPhone}
                        </strong>
                        <small>
                            Memiliki nomor telepon
                        </small>
                    </div>
                </article>
            </section>

            {/* =========================================================
                USER DATABASE
            ========================================================= */}
            <section className="user-content-card">
                {/* ---------------------------------------------------------
                   DATABASE HEADER
                --------------------------------------------------------- */}
                <div className="user-card-heading">
                    <div className="user-card-heading-left">
                        <div className="user-section-icon">
                            <i className="bi bi-person-lines-fill"></i>
                        </div>
                        <div>
                            <span>
                                DATABASE USER
                            </span>
                            <h2>
                                Daftar User
                            </h2>
                            <p>
                                Menampilkan {users.length} akun
                                pengguna yang terdaftar pada
                                sistem.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="user-refresh-button"
                        onClick={fetchUsers}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm"></span>
                                Memuat
                            </>
                        ) : (
                            <>
                                <i className="bi bi-arrow-clockwise"></i>
                                Refresh
                            </>
                        )}
                    </button>
                </div>

                {/* ---------------------------------------------------------
                   EMPTY STATE
                --------------------------------------------------------- */}
                {users.length === 0 ? (
                    <div className="user-empty-state">
                        <div className="user-empty-icon">
                            <i className="bi bi-person-plus"></i>
                        </div>
                        <h4>
                            Belum ada user
                        </h4>
                        <p>
                            Tambahkan akun user pertama agar
                            pengguna dapat mengakses sistem.
                        </p>
                        <button
                            type="button"
                            className="user-primary-button"
                            onClick={handleAdd}
                        >
                            <i className="bi bi-plus-lg"></i>
                            Tambah User
                        </button>
                    </div>
                ) : (
                    <>
                        {/* =========================================================
                            DESKTOP TABLE
                        ========================================================= */}
                        <div className="user-table-wrapper d-none d-lg-block">
                            <table className="user-table">
                                <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Telepon</th>
                                    <th>Tipe User</th>
                                    <th>Tanggal Daftar</th>
                                    <th className="text-center">
                                        Aksi
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        {/* ---------------------------------------------------------
                                               USER INFORMATION
                                            --------------------------------------------------------- */}
                                        <td>
                                            <div className="user-table-profile">
                                                <div className="user-table-avatar">
                                                    {getInitials(
                                                        user.full_name
                                                    )}
                                                </div>
                                                <div>
                                                    <strong>
                                                        {user.full_name}
                                                    </strong>
                                                    <span>
                                                            {user.user_type ===
                                                            "admin"
                                                                ? "Administrator"
                                                                : "Peserta FITALENTA"}
                                                        </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* ---------------------------------------------------------
                                               EMAIL
                                            --------------------------------------------------------- */}
                                        <td>
                                            <div className="user-table-contact">
                                                <i className="bi bi-envelope"></i>
                                                <span>
                                                        {user.email}
                                                    </span>
                                            </div>
                                        </td>

                                        {/* ---------------------------------------------------------
                                               PHONE
                                            --------------------------------------------------------- */}
                                        <td>
                                            <div
                                                className={`user-table-contact ${
                                                    !user.phone
                                                        ? "is-empty"
                                                        : ""
                                                }`}
                                            >
                                                <i className="bi bi-telephone"></i>
                                                <span>
                                                        {user.phone ||
                                                            "Belum tersedia"}
                                                    </span>
                                            </div>
                                        </td>

                                        {/* ---------------------------------------------------------
                                               USER TYPE
                                            --------------------------------------------------------- */}
                                        <td>
                                            {getUserTypeBadge(
                                                user.user_type
                                            )}
                                        </td>

                                        {/* ---------------------------------------------------------
                                               REGISTERED DATE
                                            --------------------------------------------------------- */}
                                        <td>
                                            <div className="user-date-cell">
                                                <strong>
                                                    {formatDate(
                                                        user.created_at
                                                    )}
                                                </strong>
                                                <span>
                                                        {formatTime(
                                                            user.created_at
                                                        )}
                                                    </span>
                                            </div>
                                        </td>

                                        {/* ---------------------------------------------------------
                                               ACTIONS
                                            --------------------------------------------------------- */}
                                        <td>
                                            <div className="user-action-group">
                                                <button
                                                    type="button"
                                                    className="user-action-button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            user
                                                        )
                                                    }
                                                    title="Edit User"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="user-action-button user-action-delete"
                                                    onClick={() =>
                                                        handleDelete(
                                                            user.id
                                                        )
                                                    }
                                                    disabled={
                                                        user.user_type ===
                                                        "admin"
                                                    }
                                                    title={
                                                        user.user_type ===
                                                        "admin"
                                                            ? "Administrator tidak dapat dihapus"
                                                            : "Hapus User"
                                                    }
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* =========================================================
                            MOBILE USER LIST
                        ========================================================= */}
                        <div className="user-mobile-list d-lg-none">
                            {users.map((user) => (
                                <article
                                    className="user-mobile-card"
                                    key={user.id}
                                >
                                    {/* ---------------------------------------------------------
                                       MOBILE HEADER
                                    --------------------------------------------------------- */}
                                    <div className="user-mobile-header">
                                        <div className="user-mobile-profile">
                                            <div className="user-table-avatar">
                                                {getInitials(
                                                    user.full_name
                                                )}
                                            </div>
                                            <div>
                                                <strong>
                                                    {user.full_name}
                                                </strong>
                                                <span>
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                        {getUserTypeBadge(
                                            user.user_type
                                        )}
                                    </div>

                                    {/* ---------------------------------------------------------
                                       MOBILE INFORMATION
                                    --------------------------------------------------------- */}
                                    <div className="user-mobile-info-grid">
                                        <div>
                                            <span>
                                                Telepon
                                            </span>
                                            <strong>
                                                {user.phone ||
                                                    "-"}
                                            </strong>
                                        </div>
                                        <div>
                                            <span>
                                                Tanggal Daftar
                                            </span>
                                            <strong>
                                                {formatDate(
                                                    user.created_at
                                                )}
                                            </strong>
                                        </div>
                                        <div>
                                            <span>
                                                Jam Daftar
                                            </span>
                                            <strong>
                                                {formatTime(
                                                    user.created_at
                                                )}
                                            </strong>
                                        </div>
                                        <div>
                                            <span>
                                                Akses
                                            </span>
                                            <strong>
                                                {user.user_type ===
                                                "admin"
                                                    ? "Administrator"
                                                    : "Peserta"}
                                            </strong>
                                        </div>
                                    </div>

                                    {/* ---------------------------------------------------------
                                       MOBILE ACTIONS
                                    --------------------------------------------------------- */}
                                    <div className="user-mobile-actions">
                                        <button
                                            type="button"
                                            className="user-mobile-edit"
                                            onClick={() =>
                                                handleEdit(user)
                                            }
                                        >
                                            <i className="bi bi-pencil"></i>
                                            Edit User
                                        </button>
                                        <button
                                            type="button"
                                            className="user-mobile-delete"
                                            onClick={() =>
                                                handleDelete(
                                                    user.id
                                                )
                                            }
                                            disabled={
                                                user.user_type ===
                                                "admin"
                                            }
                                            aria-label="Hapus User"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* ---------------------------------------------------------
                           DATABASE FOOTER
                        --------------------------------------------------------- */}
                        <div className="user-table-footer">
                            <div>
                                <i className="bi bi-database"></i>
                                <span>
                                    {users.length} user
                                    ditampilkan
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {/* =========================================================
                TABLE LOADING OVERLAY
            ========================================================= */}
            {loading && users.length > 0 && (
                <div className="user-operation-loading">
                    <div>
                        <span className="spinner-border spinner-border-sm"></span>
                        <span>
                            Memperbarui data...
                        </span>
                    </div>
                </div>
            )}

            {userModal}
        </div>
    );
};

export default UserManagement;