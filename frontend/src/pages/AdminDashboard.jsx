<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import helpers from "../utils/helpers";
import { buildFileUrl } from "../utils/api";

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  // State baru untuk loading export
  const [exportLoading, setExportLoading] = useState(false);
  
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    program: "all",
    payment_status: "all",
    selection_status: "all",
    placement_status: "all",
    search: "",
  });
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    registration_status: "",
    notes: "",
  });
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    newRegistrations: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    paymentStats: {
      pending: 0,
      installment_1: 0,
      installment_2: 0,
      installment_3: 0,
      installment_4: 0,
      installment_5: 0,
      installment_6: 0,
      paid: 0,
      overdue: 0,
    },
    registrationStats: {
      menunggu: 0,
      lolos: 0,
      tidak_lolos: 0,
    },
    selectionStats: {
      menunggu: 0,
      lolos: 0,
      tidak_lolos: 0,
    },
    placementStats: {
      proses: 0,
      lolos: 0,
      ditempatkan: 0,
    },
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchPrograms();
    fetchStatistics();
    fetchRegistrations();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        fetchRegistrations();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key] !== "all" && filters[key] !== "") {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/api/registrations?${params}`);
      if (response.data.success) {
        setRegistrations(response.data.data);
        updateStatisticsFromRegistrations(response.data.data);
      } else {
        setError("Gagal mengambil data pendaftaran");
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setError(
        error.response?.data?.message || "Error loading registration data"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get("/api/programs");
      if (response.data.success) {
        setPrograms(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get("/api/admin/statistics");
      if (response.data.success) {
        setStats((prevStats) => ({
          ...prevStats,
          ...response.data.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      updateStatisticsFromRegistrations(registrations);
    }
  };

  const updateStatisticsFromRegistrations = (registrationsData) => {
    const totalRegistrations = registrationsData.length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newRegistrations = registrationsData.filter(
      (reg) => new Date(reg.registration_date) > oneWeekAgo
    ).length;

    const totalRevenue = registrationsData.reduce(
      (sum, reg) => sum + parseFloat(reg.amount_paid || 0),
      0
    );

    const paymentStats = {
      pending: 0,
      installment_1: 0,
      installment_2: 0,
      installment_3: 0,
      installment_4: 0,
      installment_5: 0,
      installment_6: 0,
      paid: 0,
      overdue: 0,
    };

    const registrationStats = {
      menunggu: 0,
      lolos: 0,
      tidak_lolos: 0,
    };

    const selectionStats = {
      menunggu: 0,
      lolos: 0,
      tidak_lolos: 0,
    };

    const placementStats = {
      proses: 0,
      lolos: 0,
      ditempatkan: 0,
    };

    registrationsData.forEach((reg) => {
      if (reg.payment_status && paymentStats.hasOwnProperty(reg.payment_status)) {
        paymentStats[reg.payment_status]++;
      } else if (!reg.payment_status) {
        paymentStats.pending++;
      }

      if (reg.registration_status && registrationStats.hasOwnProperty(reg.registration_status)) {
        registrationStats[reg.registration_status]++;
      }

      if (reg.selection_status && selectionStats.hasOwnProperty(reg.selection_status)) {
        selectionStats[reg.selection_status]++;
      }

      if (reg.placement_status && placementStats.hasOwnProperty(reg.placement_status)) {
        placementStats[reg.placement_status]++;
      }
    });

    const pendingVerifications =
      registrationStats.menunggu +
      selectionStats.menunggu +
      paymentStats.pending;

    setStats((prevStats) => ({
      ...prevStats,
      totalRegistrations,
      newRegistrations,
      totalRevenue,
      pendingVerifications,
      paymentStats,
      registrationStats,
      selectionStats,
      placementStats,
    }));
  };

  // --- FUNGSI EKSPOR BARU ---
  const handleExportExcel = async () => {
    try {
      setExportLoading(true);
      setError("");

      // Mengambil parameter filter saat ini agar hasil export sesuai filter
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== "all" && filters[key] !== "") {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(
        `/api/registrations/export/excel?${params}`,
        {
          responseType: "blob",
          timeout: 30000,
        }
      );

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `data-pendaftar-${new Date().toISOString().split("T")[0]}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      const errorMessage =
        error.response?.status === 404
          ? "Fitur export Excel belum tersedia di server"
          : "Gagal mengekspor ke Excel. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExportLoading(true);
      setError("");

      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== "all" && filters[key] !== "") {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(
        `/api/registrations/export/pdf?${params}`,
        {
          responseType: "blob",
          timeout: 30000,
        }
      );

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `data-pendaftar-${new Date().toISOString().split("T")[0]}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      const errorMessage =
        error.response?.status === 404
          ? "Fitur export PDF belum tersedia di server"
          : "Gagal mengekspor ke PDF. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setExportLoading(false);
    }
  };
  // --------------------------

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowDetailModal(true);
  };

  const handleUpdateRegistrationStatus = (registration) => {
    setSelectedRegistration(registration);
    setStatusForm({
      registration_status: registration.registration_status || "menunggu",
      notes: "",
    });
    setShowStatusModal(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRegistration) return;

    try {
      setLoading(true);
      const response = await axios.put(
        `/api/registrations/${selectedRegistration.id}/registration-status`,
        {
          status: statusForm.registration_status,
          notes: statusForm.notes,
          evaluated_by: user?.id,
        }
      );

      if (response.data.success) {
        alert("Status pendaftaran berhasil diperbarui");

        const updatedRegistration = response.data.data.updated_registration;

        setRegistrations((prev) =>
          prev.map((reg) =>
            reg.id === selectedRegistration.id
              ? { ...reg, registration_status: statusForm.registration_status }
              : reg
          )
        );

        setSelectedRegistration((prev) =>
          prev
            ? { ...prev, registration_status: statusForm.registration_status }
            : prev
        );

        fetchStatistics();

        setShowStatusModal(false);
        setStatusForm({ registration_status: "", notes: "" });
      } else {
        throw new Error("Gagal memperbarui status");
      }
    } catch (error) {
      console.error("Error updating registration status:", error);
      alert("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setShowStatusModal(false);
    setSelectedRegistration(null);
    setStatusForm({ registration_status: "", notes: "" });
  };

  const getInstallmentText = (paymentStatus, installmentPlan) => {
    if (paymentStatus === "paid") return "Lunas";
    if (paymentStatus === "pending") return "Belum Bayar";
    if (paymentStatus === "overdue") return "Jatuh Tempo";
    if (paymentStatus === "cancelled") return "Dibatalkan";

    const installmentNumber = paymentStatus.split("_")[1];

    if (installmentPlan === "4_installments") {
      return `Cicilan ${installmentNumber}/4`;
    } else if (installmentPlan === "3_installments") {
      return `Cicilan ${installmentNumber}/3`;
    } else if (installmentPlan === "6_installments") {
      return `Cicilan ${installmentNumber}/6`;
    } else {
      return `Cicilan ${installmentNumber}`;
    }
  };

  const getPaymentStatusBadge = (paymentStatus, installmentPlan) => {
    const statusText = getInstallmentText(paymentStatus, installmentPlan);

    let badgeClass = "bg-secondary";
    if (paymentStatus === "paid") badgeClass = "bg-success";
    else if (paymentStatus === "pending") badgeClass = "bg-warning text-dark";
    else if (paymentStatus === "overdue") badgeClass = "bg-danger";
    else if (paymentStatus?.startsWith("installment_")) badgeClass = "bg-info";
    else if (paymentStatus === "cancelled") badgeClass = "bg-secondary";

    return <span className={`badge ${badgeClass}`}>{statusText}</span>;
  };

  const getRegistrationStatusBadge = (status) => {
    const statusConfig = {
      menunggu: { class: "bg-warning text-dark", text: "Menunggu Interview" },
      lolos: { class: "bg-success", text: "Lolos Interview" },
      tidak_lolos: { class: "bg-danger", text: "Tidak Lolos Interview" },
    };
    const config = statusConfig[status] || {
      class: "bg-secondary",
      text: status || "Belum Ditentukan",
    };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getSelectionStatusBadge = (status) => {
    const statusConfig = {
      menunggu: { class: "bg-warning text-dark", text: "Menunggu" },
      lolos: { class: "bg-success", text: "Lolos" },
      tidak_lolos: { class: "bg-danger", text: "Tidak Lolos" },
    };
    const config = statusConfig[status] || {
      class: "bg-secondary",
      text: status || "Belum Ditentukan",
    };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getPlacementStatusBadge = (status) => {
    const statusConfig = {
      proses: { class: "bg-warning text-dark", text: "Proses" },
      lolos: { class: "bg-info", text: "Lolos" },
      ditempatkan: { class: "bg-success", text: "Ditempatkan" },
    };
    const config = statusConfig[status] || {
      class: "bg-secondary",
      text: status || "Belum Ditentukan",
    };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const renderCertificates = (registration) => {
    const certificates = [];

    if (registration.n4_certificate_path) {
      const fileName = registration.n4_certificate_path.split("/").pop();
      certificates.push(
        <div key="n4" className="mb-1">
          <a
            href={buildFileUrl(registration.n4_certificate_path)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none d-flex align-items-center"
          >
            <i className="bi bi-file-earmark-pdf text-danger me-1"></i>
            {fileName}
          </a>
        </div>
      );
    }

    if (registration.ssw_certificate_path) {
      const fileName = registration.ssw_certificate_path.split("/").pop();
      certificates.push(
        <div key="ssw" className="mb-1">
          <a
            href={buildFileUrl(registration.ssw_certificate_path)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none d-flex align-items-center"
          >
            <i className="bi bi-file-earmark-pdf text-danger me-1"></i>
            {fileName}
          </a>
        </div>
      );
    }

    if (certificates.length === 0) {
      return <span className="text-muted">-</span>;
    }

    return <div>{certificates}</div>;
  };

  const handleResetFilters = () => {
    setFilters({
      program: "all",
      payment_status: "all",
      selection_status: "all",
      placement_status: "all",
      search: "",
    });
  };

  const renderPersonalInfo = (registration) => {
    return (
      <div className="row">
        <div className="col-md-6">
          <h6 className="fw-bold text-primary mb-3">Informasi Pribadi</h6>
          <div className="mb-2">
            <strong>NIK:</strong> {registration.nik || <span className="text-muted">-</span>}
          </div>
          <div className="mb-2">
            <strong>Jenis Kelamin:</strong> {registration.gender === 'L' ? 'Laki-laki' : registration.gender === 'P' ? 'Perempuan' : <span className="text-muted">-</span>}
          </div>
          <div className="mb-2">
            <strong>Tempat Lahir:</strong> {registration.birth_place || <span className="text-muted">-</span>}
          </div>
          <div className="mb-2">
            <strong>Tanggal Lahir:</strong> {registration.birth_date ? helpers.formatDateForBirthDate(registration.birth_date) : <span className="text-muted">-</span>}
          </div>
          <div className="mb-2">
            <strong>Status Pernikahan:</strong> {registration.marital_status || <span className="text-muted">-</span>}
          </div>
        </div>

        <div className="col-md-6">
          <h6 className="fw-bold text-primary mb-3">Informasi Pendidikan</h6>
          <div className="mb-2">
            <strong>Pendidikan Terakhir:</strong> {registration.last_education || <span className="text-muted">-</span>}
          </div>
          <div className="mb-2">
            <strong>Jurusan:</strong> {registration.major || <span className="text-muted">-</span>}
          </div>
          <div className="mb-2">
            <strong>Institusi Pendidikan:</strong> {registration.education_institution || <span className="text-muted">-</span>}
          </div>
          <div className="mb-2">
            <strong>Aktivitas Saat Ini:</strong> {registration.current_activity || <span className="text-muted">-</span>}
          </div>
        </div>
      </div>
    );
  };

  const renderParentInfo = (registration) => {
    return (
      <div className="row mt-3">
        <div className="col-12">
          <h6 className="fw-bold text-primary mb-3">Informasi Orang Tua</h6>
          <div className="mb-2">
            <strong>Nomor Telepon Orang Tua:</strong> {registration.parent_phone || <span className="text-muted">-</span>}
          </div>
          <div className="mb-2">
            <strong>Hubungan dengan Orang Tua:</strong> {registration.parent_relationship || <span className="text-muted">-</span>}
          </div>
        </div>
      </div>
    );
  };

  const renderAddressInfo = (registration) => {
    return (
      <div className="row">
        <div className="col-md-6">
          <h6 className="fw-bold text-primary mb-3">Alamat KTP</h6>
          <div className="mb-2">
            <strong>Provinsi:</strong> {registration.ktp_province_name || <span className="text-muted">-</span>}
          </div>
          <div className="mb-2">
            <strong>Kota/Kabupaten:</strong> {registration.ktp_city_name || <span className="text-muted">-</span>}
          </div>
          <div className="mb-2">
            <strong>Alamat Lengkap:</strong> {registration.ktp_address || <span className="text-muted">-</span>}
          </div>
        </div>

        <div className="col-md-6">
          <h6 className="fw-bold text-primary mb-3">Alamat Domisili</h6>
          <div className="mb-2">
            <strong>Provinsi:</strong> {registration.domicile_province_name || <span className="text-muted">-</span>}
          </div>
          <div className="mb-2">
            <strong>Kota/Kabupaten:</strong> {registration.domicile_city_name || <span className="text-muted">-</span>}
          </div>
          <div className="mb-2">
            <strong>Alamat Lengkap:</strong> {registration.domicile_address || <span className="text-muted">-</span>}
          </div>
        </div>
      </div>
    );
  };

  if (loading && registrations.length === 0) {
    return (
      <div className="container-fluid px-2 px-md-3 mt-3 mt-md-4">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <div className="text-center">
          <p>Memuat dashboard admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-md-3 mt-3 mt-md-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Admin Dashboard</h2>
              <p className="text-muted mb-0">
                Kelola pendaftaran program dan peserta
              </p>
            </div>
            <div className="text-end">
              <p className="mb-0">
                Selamat datang, <strong>{user?.full_name || "Admin"}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-2 mb-3 mb-md-4">
        <div className="col-6 col-sm-3 col-md-3 mb-2">
          <div className="card bg-primary text-white h-100">
            <div className="card-body text-center p-2 p-md-3">
              <h6 className="card-title stats-label mb-1">Total Pendaftar</h6>
              <div className="fs-4 fw-bold">{stats.totalRegistrations}</div>
              <small>Semua Program</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-3 col-md-3 mb-2">
          <div className="card bg-primary text-white h-100">
            <div className="card-body text-center p-2 p-md-3">
              <h6 className="card-title stats-label mb-1">Pendaftar Baru</h6>
              <div className="fs-4 fw-bold">{stats.newRegistrations}</div>
              <small>7 Hari Terakhir</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-3 col-md-3 mb-2">
          <div className="card bg-primary text-white h-100">
            <div className="card-body text-center p-2 p-md-3">
              <h6 className="card-title stats-label mb-1">Total Pemasukan</h6>
              <div className="fs-4 fw-bold">
                {helpers.formatCurrency(stats.totalRevenue)}
              </div>
              <small>Dari {stats.paymentStats.paid} peserta lunas</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-3 col-md-3 mb-2">
          <div className="card bg-primary text-white h-100">
            <div className="card-body text-center p-2 p-md-3">
              <h6 className="card-title stats-label mb-1">
                Verifikasi Tertunda
              </h6>
              <div className="fs-4 fw-bold">{stats.pendingVerifications}</div>
              <small>Perlu tindakan</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Filter & Pencarian</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleResetFilters}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Reset Filter
          </button>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label">Program</label>
              <select
                className="form-select"
                value={filters.program}
                onChange={(e) => handleFilterChange("program", e.target.value)}
              >
                <option value="all">Semua Program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Pembayaran</label>
              <select
                className="form-select"
                value={filters.payment_status}
                onChange={(e) =>
                  handleFilterChange("payment_status", e.target.value)
                }
              >
                <option value="all">Semua Status</option>
                <option value="pending">Belum Bayar</option>
                <option value="installment_1">Cicilan 1</option>
                <option value="installment_2">Cicilan 2</option>
                <option value="installment_3">Cicilan 3</option>
                <option value="installment_4">Cicilan 4</option>
                <option value="installment_5">Cicilan 5</option>
                <option value="installment_6">Cicilan 6</option>
                <option value="paid">Lunas</option>
                <option value="overdue">Jatuh Tempo</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Seleksi</label>
              <select
                className="form-select"
                value={filters.selection_status}
                onChange={(e) =>
                  handleFilterChange("selection_status", e.target.value)
                }
              >
                <option value="all">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="lolos">Lolos</option>
                <option value="tidak_lolos">Tidak Lolos</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Penyaluran</label>
              <select
                className="form-select"
                value={filters.placement_status}
                onChange={(e) =>
                  handleFilterChange("placement_status", e.target.value)
                }
              >
                <option value="all">Semua Status</option>
                <option value="proses">Proses</option>
                <option value="lolos">Lolos</option>
                <option value="ditempatkan">Ditempatkan</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Pencarian</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari nama, email, atau kode pendaftaran..."
                  value={filters.search}
                  onChange={handleSearchChange}
                />
                {filters.search && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleFilterChange("search", "")}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- EXPORT BUTTONS SECTION START --- */}
      <div className="row mb-4">
          <div className="col">
              <div className="card shadow-sm border-0">
                  <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <div>
                              <h5 className="mb-1 text-primary">
                                  <i className="bi bi-download me-2"></i>
                                  Ekspor Data Pendaftar
                              </h5>
                              <p className="text-muted mb-0 small">
                                  Download data pendaftar dalam format Excel atau PDF sesuai filter di atas
                              </p>
                          </div>
                          <div className="d-flex gap-2">
                              <button
                                  className="btn btn-success text-white"
                                  onClick={handleExportExcel}
                                  disabled={exportLoading || registrations.length === 0}
                              >
                                  {exportLoading ? (
                                      <>
                                          <span className="spinner-border spinner-border-sm me-2"></span>
                                          Exporting...
                                      </>
                                  ) : (
                                      <>
                                          <i className="bi bi-file-earmark-excel me-2"></i>
                                          Excel
                                      </>
                                  )}
                              </button>
                              <button
                                  className="btn btn-danger text-white"
                                  onClick={handleExportPDF}
                                  disabled={exportLoading || registrations.length === 0}
                              >
                                  {exportLoading ? (
                                      <>
                                          <span className="spinner-border spinner-border-sm me-2"></span>
                                          Exporting...
                                      </>
                                  ) : (
                                      <>
                                          <i className="bi bi-file-earmark-pdf me-2"></i>
                                          PDF
                                      </>
                                  )}
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      {/* --- EXPORT BUTTONS SECTION END --- */}

      {/* Registrations Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Data Pendaftar ({registrations.length})
          </h5>
          <div>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={fetchRegistrations}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Memuat...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-warning d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <div>{error}</div>
            </div>
          )}

          {registrations.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted mb-3">
                <i className="bi bi-clipboard-x" style={{ fontSize: "3rem" }}></i>
              </div>
              <h5>Tidak ada data pendaftaran</h5>
              <p className="text-muted">
                {filters.program !== "all" ||
                  filters.payment_status !== "all" ||
                  filters.search !== ""
                  ? "Coba ubah filter atau kata kunci pencarian Anda"
                  : "Belum ada pendaftaran yang tercatat"}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead className="table-light align-middle">
                  <tr>
                    <th>#</th>
                    <th>Pendaftar</th>
                    <th>Program</th>
                    <th>Kode</th>
                    <th>Tanggal</th>
                    <th>Status Pendaftaran</th>
                    <th>Status Pembayaran</th>
                    <th>Status Seleksi</th>
                    <th>Status Penyaluran</th>
                    <th>Sertifikat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {registrations.map((registration, index) => (
                    <tr key={registration.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {registration.photo_path && (
                            <img
                              src={buildFileUrl(registration.photo_path)}
                              alt={registration.full_name}
                              className="me-2"
                              style={{ width: '50px', height: '75px', objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <strong>{registration.full_name}</strong>
                            <br />
                            <small className="text-muted">
                              {registration.email}
                            </small>
                            <br />
                            <small>{registration.phone}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{registration.program_name}</strong>
                        <br />
                        <small className="text-muted">
                          {helpers.formatCurrency(
                            registration.program_training_cost
                          )}
                        </small>
                      </td>
                      <td>
                        <code className="bg-light px-1 rounded">
                          {registration.registration_code}
                        </code>
                      </td>
                      <td>
                        {helpers.formatDate(registration.registration_date)}
                      </td>
                      <td>
                        {getRegistrationStatusBadge(
                          registration.registration_status
                        )}
                      </td>
                      <td>
                        {getPaymentStatusBadge(
                          registration.payment_status,
                          registration.program_installment_plan
                        )}
                        {registration.amount_paid > 0 && (
                          <div className="mt-1">
                            <small>
                              Dibayar: {helpers.formatCurrency(registration.amount_paid)}
                            </small>
                          </div>
                        )}
                      </td>
                      <td>
                        {getSelectionStatusBadge(registration.selection_status)}
                      </td>
                      <td>
                        {getPlacementStatusBadge(registration.placement_status)}
                        {registration.company_name && (
                          <div className="mt-1">
                            <small>{registration.company_name}</small>
                          </div>
                        )}
                      </td>
                      <td>{renderCertificates(registration)}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleViewDetails(registration)}
                            title="Lihat Detail"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() =>
                              handleUpdateRegistrationStatus(registration)
                            }
                            title="Update Status Pendaftaran"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal & Status Modal (Tetap Sama) */}
      {showDetailModal && selectedRegistration && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
             {/* Konten Modal Detail (Sama seperti sebelumnya) */}
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detail Lengkap Peserta</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {/* Tab Navigation */}
                <ul className="nav nav-tabs mb-4" id="detailTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="basic-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#basic"
                      type="button"
                      role="tab"
                      aria-controls="basic"
                      aria-selected="true"
                    >
                      Informasi Dasar
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="personal-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#personal"
                      type="button"
                      role="tab"
                      aria-controls="personal"
                      aria-selected="false"
                    >
                      Data Pribadi
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="address-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#address"
                      type="button"
                      role="tab"
                      aria-controls="address"
                      aria-selected="false"
                    >
                      Alamat
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="status-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#status"
                      type="button"
                      role="tab"
                      aria-controls="status"
                      aria-selected="false"
                    >
                      Status & Dokumen
                    </button>
                  </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content" id="detailTabsContent">
                  {/* Tab 1: Informasi Dasar */}
                  <div className="tab-pane fade show active" id="basic" role="tabpanel" aria-labelledby="basic-tab">
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="fw-bold text-primary mb-3">Informasi Kontak</h6>
                        <div className="mb-3">
                          <strong>Nama Lengkap:</strong> {selectedRegistration.full_name}
                        </div>
                        <div className="mb-3">
                          <strong>Email:</strong> {selectedRegistration.email}
                        </div>
                        <div className="mb-3">
                          <strong>Telepon:</strong> {selectedRegistration.phone || <span className="text-muted">-</span>}
                        </div>
                        <div className="mb-3">
                          <strong>Tanggal Pendaftaran:</strong> {helpers.formatDate(selectedRegistration.registration_date)}
                        </div>
                        <div className="mb-3">
                          <strong>Kode Pendaftaran:</strong> <code>{selectedRegistration.registration_code}</code>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="fw-bold text-primary mb-3">Informasi Program</h6>
                        <div className="mb-3">
                          <strong>Program:</strong> {selectedRegistration.program_name}
                        </div>
                        <div className="mb-3">
                          <strong>Biaya Pelatihan:</strong> {helpers.formatCurrency(selectedRegistration.program_training_cost)}
                        </div>
                        <div className="mb-3">
                          <strong>Biaya Keberangkatan:</strong> {helpers.formatCurrency(selectedRegistration.program_departure_cost)}
                        </div>
                        <div className="mb-3">
                          <strong>Durasi:</strong> {selectedRegistration.program_duration}
                        </div>
                        <div className="mb-3">
                          <strong>Lokasi:</strong> {selectedRegistration.program_location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tab 2: Data Pribadi */}
                  <div className="tab-pane fade" id="personal" role="tabpanel" aria-labelledby="personal-tab">
                    {renderPersonalInfo(selectedRegistration)}
                    {renderParentInfo(selectedRegistration)}
                  </div>

                  {/* Tab 3: Alamat */}
                  <div className="tab-pane fade" id="address" role="tabpanel" aria-labelledby="address-tab">
                    {renderAddressInfo(selectedRegistration)}
                  </div>

                  {/* Tab 4: Status & Dokumen */}
                  <div className="tab-pane fade" id="status" role="tabpanel" aria-labelledby="status-tab">
                    <div className="row mb-4">
                      <div className="col-md-3 text-center">
                        <h6>Pendaftaran (Interview)</h6>
                        {getRegistrationStatusBadge(selectedRegistration.registration_status)}
                      </div>
                      <div className="col-md-3 text-center">
                        <h6>Pembayaran</h6>
                        {getPaymentStatusBadge(selectedRegistration.payment_status, selectedRegistration.program_installment_plan)}
                        {selectedRegistration.amount_paid > 0 && (
                          <div className="mt-2">
                            <small className="text-muted">
                              Dibayar: {helpers.formatCurrency(selectedRegistration.amount_paid)}
                            </small>
                            {selectedRegistration.payment_date && (
                              <div>
                                <small className="text-muted">
                                  Tanggal: {helpers.formatDate(selectedRegistration.payment_date)}
                                </small>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="col-md-3 text-center">
                        <h6>Seleksi Diklat</h6>
                        {getSelectionStatusBadge(selectedRegistration.selection_status)}
                        {selectedRegistration.selection_notes && (
                          <div className="mt-2">
                            <small className="text-muted">
                              Catatan: {selectedRegistration.selection_notes}
                            </small>
                          </div>
                        )}
                      </div>
                      <div className="col-md-3 text-center">
                        <h6>Penyaluran Kerja</h6>
                        {getPlacementStatusBadge(selectedRegistration.placement_status)}
                        {selectedRegistration.company_name && (
                          <div className="mt-2">
                            <small className="text-muted">
                              Perusahaan: {selectedRegistration.company_name}
                            </small>
                          </div>
                        )}
                        {selectedRegistration.placement_notes && (
                          <div className="mt-1">
                            <small className="text-muted">
                              Catatan: {selectedRegistration.placement_notes}
                            </small>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dokumen */}
                    <div className="row">
                      <div className="col-12">
                        <h6 className="fw-bold text-primary mb-3">Dokumen & Sertifikat</h6>
                        <div className="row">
                          <div className="col-md-4">
                            <div className="card">
                              <div className="card-body text-center">
                                <i className="bi bi-person-badge fs-1 text-primary mb-2"></i>
                                <h6>Foto Profil</h6>
                                {selectedRegistration.photo_path ? (
                                  <a
                                    href={buildFileUrl(selectedRegistration.photo_path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-primary btn-sm mt-2"
                                  >
                                    Lihat Foto
                                  </a>
                                ) : (
                                  <span className="text-muted">Tidak tersedia</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="card">
                              <div className="card-body text-center">
                                <i className="bi bi-file-earmark-pdf fs-1 text-danger mb-2"></i>
                                <h6>Sertifikat N4</h6>
                                {selectedRegistration.n4_certificate_path ? (
                                  <a
                                    href={buildFileUrl(selectedRegistration.n4_certificate_path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-danger btn-sm mt-2"
                                  >
                                    Lihat Sertifikat
                                  </a>
                                ) : (
                                  <span className="text-muted">Tidak tersedia</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="card">
                              <div className="card-body text-center">
                                <i className="bi bi-file-earmark-pdf fs-1 text-danger mb-2"></i>
                                <h6>Sertifikat SSW</h6>
                                {selectedRegistration.ssw_certificate_path ? (
                                  <a
                                    href={buildFileUrl(selectedRegistration.ssw_certificate_path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-danger btn-sm mt-2"
                                  >
                                    Lihat Sertifikat
                                  </a>
                                ) : (
                                  <span className="text-muted">Tidak tersedia</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Tutup
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleUpdateRegistrationStatus(selectedRegistration)}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Update Status Pendaftaran (Tetap Sama) */}
      {showStatusModal && selectedRegistration && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseModal}
        >
           {/* Konten Modal Update Status */}
          <div
            className="modal-dialog modal-md modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Status Pendaftaran</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleStatusSubmit}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Mengupdate status untuk: <strong>{selectedRegistration.full_name}</strong>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Status Pendaftaran *</label>
                    <select
                      className="form-select"
                      value={statusForm.registration_status}
                      onChange={(e) =>
                        setStatusForm({
                          ...statusForm,
                          registration_status: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="menunggu">Menunggu Interview</option>
                      <option value="lolos">Lolos Interview</option>
                      <option value="tidak_lolos">Tidak Lolos Interview</option>
                    </select>
                    <div className="form-text">
                      Status ini menentukan hasil proses interview peserta
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Catatan (Opsional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={statusForm.notes}
                      onChange={(e) =>
                        setStatusForm({
                          ...statusForm,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Berikan catatan mengenai hasil interview..."
                    />
                    <div className="form-text">
                      Catatan akan tersimpan dalam history status
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                    disabled={loading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Status"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
=======
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import helpers from "../utils/helpers";

const AdminDashboard = () => {
    const { user } = useAuth();

    // =========================================================
    // STATE
    // =========================================================
    const [registrations, setRegistrations] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [detailTab, setDetailTab] = useState("basic");
    const [filters, setFilters] = useState({
        program: "all",
        payment_status: "all",
        selection_status: "all",
        placement_status: "all",
        search: "",
    });
    const [statusForm, setStatusForm] = useState({
        registration_status: "",
        notes: "",
    });
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        newRegistrations: 0,
        totalRevenue: 0,
        pendingVerifications: 0,
        paymentStats: {
            pending: 0,
            installment_1: 0,
            installment_2: 0,
            installment_3: 0,
            installment_4: 0,
            installment_5: 0,
            installment_6: 0,
            paid: 0,
            overdue: 0,
        },
        registrationStats: {
            menunggu: 0,
            lolos: 0,
            tidak_lolos: 0,
        },
        selectionStats: {
            menunggu: 0,
            lolos: 0,
            tidak_lolos: 0,
        },
        placementStats: {
            proses: 0,
            lolos: 0,
            ditempatkan: 0,
        },
    });

    // =========================================================
    // HELPERS
    // =========================================================
    const getInitials = (name = "") => {
        const parts = name.trim().split(/\s+/).filter(Boolean);

        if (!parts.length) return "P";

        return parts
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
    };

    const hasActiveFilters =
        filters.program !== "all" ||
        filters.payment_status !== "all" ||
        filters.selection_status !== "all" ||
        filters.placement_status !== "all" ||
        filters.search.trim() !== "";

    const updateStatisticsFromRegistrations = useCallback((registrationsData) => {
        const totalRegistrations = registrationsData.length;
        const oneWeekAgo = new Date();

        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const newRegistrations = registrationsData.filter(
            (registration) =>
                new Date(registration.registration_date) > oneWeekAgo
        ).length;

        const totalRevenue = registrationsData.reduce(
            (sum, registration) =>
                sum + parseFloat(registration.amount_paid || 0),
            0
        );

        const paymentStats = {
            pending: 0,
            installment_1: 0,
            installment_2: 0,
            installment_3: 0,
            installment_4: 0,
            installment_5: 0,
            installment_6: 0,
            paid: 0,
            overdue: 0,
        };

        const registrationStats = {
            menunggu: 0,
            lolos: 0,
            tidak_lolos: 0,
        };

        const selectionStats = {
            menunggu: 0,
            lolos: 0,
            tidak_lolos: 0,
        };

        const placementStats = {
            proses: 0,
            lolos: 0,
            ditempatkan: 0,
        };

        registrationsData.forEach((registration) => {
            if (
                registration.payment_status &&
                Object.prototype.hasOwnProperty.call(
                    paymentStats,
                    registration.payment_status
                )
            ) {
                paymentStats[registration.payment_status] += 1;
            } else if (!registration.payment_status) {
                paymentStats.pending += 1;
            }

            if (
                registration.registration_status &&
                Object.prototype.hasOwnProperty.call(
                    registrationStats,
                    registration.registration_status
                )
            ) {
                registrationStats[registration.registration_status] += 1;
            }

            if (
                registration.selection_status &&
                Object.prototype.hasOwnProperty.call(
                    selectionStats,
                    registration.selection_status
                )
            ) {
                selectionStats[registration.selection_status] += 1;
            }

            if (
                registration.placement_status &&
                Object.prototype.hasOwnProperty.call(
                    placementStats,
                    registration.placement_status
                )
            ) {
                placementStats[registration.placement_status] += 1;
            }
        });

        const pendingVerifications =
            registrationStats.menunggu +
            selectionStats.menunggu +
            paymentStats.pending;

        setStats((previousStats) => ({
            ...previousStats,
            totalRegistrations,
            newRegistrations,
            totalRevenue,
            pendingVerifications,
            paymentStats,
            registrationStats,
            selectionStats,
            placementStats,
        }));
    }, []);

    // =========================================================
    // FETCH REGISTRATIONS
    // =========================================================
    const fetchRegistrations = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== "all" && value !== "") {
                    params.append(key, value);
                }
            });

            const queryString = params.toString();
            const endpoint = queryString
                ? `/api/registrations?${queryString}`
                : "/api/registrations";

            const response = await axios.get(endpoint);

            if (response.data.success) {
                const registrationData = response.data.data || [];

                setRegistrations(registrationData);
                updateStatisticsFromRegistrations(registrationData);
            } else {
                setError("Gagal mengambil data pendaftaran.");
            }
        } catch (fetchError) {
            console.error("Error fetching registrations:", fetchError);

            setError(
                fetchError.response?.data?.message ||
                "Terjadi kesalahan saat memuat data pendaftaran."
            );
        } finally {
            setLoading(false);
        }
    }, [filters, updateStatisticsFromRegistrations]);

    // =========================================================
    // FETCH PROGRAMS
    // =========================================================
    const fetchPrograms = useCallback(async () => {
        try {
            const response = await axios.get("/api/programs");

            if (response.data.success) {
                setPrograms(response.data.data || []);
            }
        } catch (fetchError) {
            console.error("Error fetching programs:", fetchError);
        }
    }, []);

    // =========================================================
    // FETCH STATISTICS
    // =========================================================
    const fetchStatistics = useCallback(async () => {
        try {
            const response = await axios.get("/api/admin/statistics");

            if (response.data.success) {
                setStats((previousStats) => ({
                    ...previousStats,
                    ...response.data.data,
                }));
            }
        } catch (fetchError) {
            console.error("Error fetching statistics:", fetchError);
        }
    }, []);

    // =========================================================
    // INITIAL LOAD
    // =========================================================
    useEffect(() => {
        fetchPrograms();
        fetchStatistics();
    }, [fetchPrograms, fetchStatistics]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRegistrations();
        }, filters.search ? 450 : 0);

        return () => clearTimeout(timer);
    }, [filters, fetchRegistrations]);

    useEffect(() => {
        if (!feedback) return undefined;

        const timer = setTimeout(() => {
            setFeedback(null);
        }, 4500);

        return () => clearTimeout(timer);
    }, [feedback]);

    // =========================================================
    // FILTER HANDLERS
    // =========================================================
    const handleFilterChange = (key, value) => {
        setFilters((previousFilters) => ({
            ...previousFilters,
            [key]: value,
        }));
    };

    const handleSearchChange = (event) => {
        handleFilterChange("search", event.target.value);
    };

    const handleResetFilters = () => {
        setFilters({
            program: "all",
            payment_status: "all",
            selection_status: "all",
            placement_status: "all",
            search: "",
        });
    };

    // =========================================================
    // MODAL HANDLERS
    // =========================================================
    const handleViewDetails = (registration) => {
        setSelectedRegistration(registration);
        setDetailTab("basic");
        setShowDetailModal(true);
    };

    const handleUpdateRegistrationStatus = (registration) => {
        setSelectedRegistration(registration);
        setStatusForm({
            registration_status:
                registration.registration_status || "menunggu",
            notes: "",
        });
        setShowDetailModal(false);
        setShowStatusModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setShowStatusModal(false);
        setSelectedRegistration(null);
        setDetailTab("basic");
        setStatusForm({
            registration_status: "",
            notes: "",
        });
    };

    // =========================================================
    // UPDATE STATUS
    // =========================================================
    const handleStatusSubmit = async (event) => {
        event.preventDefault();

        if (!selectedRegistration) return;

        try {
            setLoading(true);

            const response = await axios.put(
                `/api/registrations/${selectedRegistration.id}/registration-status`,
                {
                    status: statusForm.registration_status,
                    notes: statusForm.notes,
                    evaluated_by: user?.id,
                }
            );

            if (!response.data.success) {
                throw new Error("Gagal memperbarui status pendaftaran.");
            }

            setRegistrations((previousRegistrations) =>
                previousRegistrations.map((registration) =>
                    registration.id === selectedRegistration.id
                        ? {
                            ...registration,
                            registration_status:
                            statusForm.registration_status,
                        }
                        : registration
                )
            );

            setFeedback({
                type: "success",
                message: "Status pendaftaran berhasil diperbarui.",
            });

            await fetchStatistics();

            setShowStatusModal(false);
            setSelectedRegistration(null);
            setStatusForm({
                registration_status: "",
                notes: "",
            });
        } catch (submitError) {
            console.error(
                "Error updating registration status:",
                submitError
            );

            setFeedback({
                type: "danger",
                message:
                    submitError.response?.data?.message ||
                    submitError.message ||
                    "Gagal memperbarui status.",
            });
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // STATUS HELPERS
    // =========================================================
    const StatusBadge = ({
                             tone = "neutral",
                             icon,
                             children,
                         }) => (
        <span className={`admin-status-badge ${tone}`}>
            {icon && (
                <i className={`bi ${icon}`}></i>
            )}
            <span>{children}</span>
        </span>
    );

    const getInstallmentText = (
        paymentStatus,
        installmentPlan
    ) => {
        if (
            !paymentStatus ||
            paymentStatus === "pending"
        ) {
            return "Belum Bayar";
        }

        if (paymentStatus === "paid") {
            return "Lunas";
        }

        if (paymentStatus === "overdue") {
            return "Jatuh Tempo";
        }

        if (paymentStatus === "cancelled") {
            return "Dibatalkan";
        }

        if (
            !paymentStatus.startsWith(
                "installment_"
            )
        ) {
            return paymentStatus;
        }

        const installmentNumber =
            paymentStatus.split("_")[1];

        if (
            installmentPlan ===
            "4_installments"
        ) {
            return `Cicilan ${installmentNumber}/4`;
        }

        if (
            installmentPlan ===
            "6_installments"
        ) {
            return `Cicilan ${installmentNumber}/6`;
        }

        return `Cicilan ${installmentNumber}`;
    };

    const getPaymentStatusBadge = (
        paymentStatus,
        installmentPlan
    ) => {
        const text = getInstallmentText(
            paymentStatus,
            installmentPlan
        );

        if (paymentStatus === "paid") {
            return (
                <StatusBadge
                    tone="success"
                    icon="bi-check-circle-fill"
                >
                    {text}
                </StatusBadge>
            );
        }

        if (paymentStatus === "overdue") {
            return (
                <StatusBadge
                    tone="danger"
                    icon="bi-exclamation-circle-fill"
                >
                    {text}
                </StatusBadge>
            );
        }

        if (
            paymentStatus?.startsWith(
                "installment_"
            )
        ) {
            return (
                <StatusBadge
                    tone="info"
                    icon="bi-credit-card"
                >
                    {text}
                </StatusBadge>
            );
        }

        if (paymentStatus === "cancelled") {
            return (
                <StatusBadge
                    tone="neutral"
                    icon="bi-x-circle"
                >
                    {text}
                </StatusBadge>
            );
        }

        return (
            <StatusBadge
                tone="warning"
                icon="bi-clock-fill"
            >
                {text}
            </StatusBadge>
        );
    };

    const getRegistrationStatusBadge = (status) => {
        if (status === "lolos") {
            return (
                <StatusBadge
                    tone="success"
                    icon="bi-check-circle-fill"
                >
                    Lolos Interview
                </StatusBadge>
            );
        }

        if (status === "tidak_lolos") {
            return (
                <StatusBadge
                    tone="danger"
                    icon="bi-x-circle-fill"
                >
                    Tidak Lolos
                </StatusBadge>
            );
        }

        return (
            <StatusBadge
                tone="warning"
                icon="bi-hourglass-split"
            >
                Menunggu Interview
            </StatusBadge>
        );
    };

    const getSelectionStatusBadge = (status) => {
        if (status === "lolos") {
            return (
                <StatusBadge
                    tone="success"
                    icon="bi-check-circle-fill"
                >
                    Lolos
                </StatusBadge>
            );
        }

        if (status === "tidak_lolos") {
            return (
                <StatusBadge
                    tone="danger"
                    icon="bi-x-circle-fill"
                >
                    Tidak Lolos
                </StatusBadge>
            );
        }

        return (
            <StatusBadge
                tone="warning"
                icon="bi-clock-fill"
            >
                Menunggu
            </StatusBadge>
        );
    };

    const getPlacementStatusBadge = (status) => {
        if (status === "ditempatkan") {
            return (
                <StatusBadge
                    tone="success"
                    icon="bi-building-check"
                >
                    Ditempatkan
                </StatusBadge>
            );
        }

        if (status === "lolos") {
            return (
                <StatusBadge
                    tone="info"
                    icon="bi-check-circle-fill"
                >
                    Lolos
                </StatusBadge>
            );
        }

        return (
            <StatusBadge
                tone="primary"
                icon="bi-arrow-repeat"
            >
                Proses
            </StatusBadge>
        );
    };

    // =========================================================
    // CERTIFICATES
    // =========================================================
    const renderCertificates = (registration) => {
        const documents = [];

        if (registration.n4_certificate_path) {
            documents.push({
                key: "n4",
                label: "N4",
                path: registration.n4_certificate_path,
            });
        }

        if (registration.ssw_certificate_path) {
            documents.push({
                key: "ssw",
                label: "SSW",
                path: registration.ssw_certificate_path,
            });
        }

        if (!documents.length) {
            return (
                <span className="admin-empty-value">
                    <i className="bi bi-dash"></i>
                </span>
            );
        }

        return (
            <div className="admin-document-list">
                {documents.map((document) => (
                    <a
                        key={document.key}
                        href={document.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-document-chip"
                        title={`Buka Sertifikat ${document.label}`}
                    >
                        <i className="bi bi-file-earmark-pdf"></i>
                        {document.label}
                    </a>
                ))}
            </div>
        );
    };

    // =========================================================
    // DETAIL HELPERS
    // =========================================================
    const DetailItem = ({
                            label,
                            value,
                            full = false,
                        }) => (
        <div
            className={`admin-detail-item ${
                full ? "full" : ""
            }`}
        >
            <span>{label}</span>
            <strong>{value || "-"}</strong>
        </div>
    );

    const renderPersonalInfo = (registration) => (
        <div className="admin-detail-section-grid">
            <div className="admin-detail-section-card">
                <div className="admin-detail-section-heading">
                    <div>
                        <i className="bi bi-person-vcard"></i>
                    </div>

                    <span>
                        <small>IDENTITAS</small>
                        <strong>
                            Informasi Pribadi
                        </strong>
                    </span>
                </div>

                <div className="admin-detail-data-grid">
                    <DetailItem
                        label="NIK"
                        value={registration.nik}
                    />

                    <DetailItem
                        label="Jenis Kelamin"
                        value={
                            registration.gender === "L"
                                ? "Laki-laki"
                                : registration.gender === "P"
                                    ? "Perempuan"
                                    : "-"
                        }
                    />

                    <DetailItem
                        label="Tempat Lahir"
                        value={
                            registration.birth_place
                        }
                    />

                    <DetailItem
                        label="Tanggal Lahir"
                        value={
                            registration.birth_date
                                ? helpers.formatDateForBirthDate(
                                    registration.birth_date
                                )
                                : "-"
                        }
                    />

                    <DetailItem
                        label="Status Pernikahan"
                        value={
                            registration.marital_status
                        }
                    />
                </div>
            </div>

            <div className="admin-detail-section-card">
                <div className="admin-detail-section-heading">
                    <div>
                        <i className="bi bi-mortarboard"></i>
                    </div>

                    <span>
                        <small>PENDIDIKAN</small>
                        <strong>
                            Latar Belakang Pendidikan
                        </strong>
                    </span>
                </div>

                <div className="admin-detail-data-grid">
                    <DetailItem
                        label="Pendidikan Terakhir"
                        value={
                            registration.last_education
                        }
                    />

                    <DetailItem
                        label="Jurusan"
                        value={registration.major}
                    />

                    <DetailItem
                        label="Institusi Pendidikan"
                        value={
                            registration.education_institution
                        }
                    />

                    <DetailItem
                        label="Aktivitas Saat Ini"
                        value={
                            registration.current_activity
                        }
                    />
                </div>
            </div>

            <div className="admin-detail-section-card full">
                <div className="admin-detail-section-heading">
                    <div>
                        <i className="bi bi-telephone"></i>
                    </div>

                    <span>
                        <small>KONTAK DARURAT</small>
                        <strong>
                            Orang Tua / Wali
                        </strong>
                    </span>
                </div>

                <div className="admin-detail-data-grid">
                    <DetailItem
                        label="Nomor Handphone"
                        value={
                            registration.parent_phone
                        }
                    />

                    <DetailItem
                        label="Hubungan"
                        value={
                            registration.parent_relationship
                        }
                    />
                </div>
            </div>
        </div>
    );

    const renderAddressInfo = (registration) => (
        <div className="admin-address-grid">
            <div className="admin-address-card">
                <div className="admin-address-card-header">
                    <div className="admin-address-icon">
                        <i className="bi bi-person-badge"></i>
                    </div>

                    <span>
                        <small>
                            ALAMAT IDENTITAS
                        </small>
                        <strong>
                            Alamat Sesuai KTP
                        </strong>
                    </span>
                </div>

                <div className="admin-address-location">
                    <i className="bi bi-geo-alt-fill"></i>

                    <span>
                        {registration.ktp_city_name ||
                            "-"}
                        ,{" "}
                        {registration.ktp_province_name ||
                            "-"}
                    </span>
                </div>

                <p>
                    {registration.ktp_address ||
                        "Alamat belum tersedia."}
                </p>
            </div>

            <div className="admin-address-card domicile">
                <div className="admin-address-card-header">
                    <div className="admin-address-icon">
                        <i className="bi bi-house-door"></i>
                    </div>

                    <span>
                        <small>
                            ALAMAT SAAT INI
                        </small>
                        <strong>
                            Alamat Domisili
                        </strong>
                    </span>
                </div>

                <div className="admin-address-location">
                    <i className="bi bi-geo-alt-fill"></i>

                    <span>
                        {registration.domicile_city_name ||
                            "-"}
                        ,{" "}
                        {registration.domicile_province_name ||
                            "-"}
                    </span>
                </div>

                <p>
                    {registration.domicile_address ||
                        "Alamat belum tersedia."}
                </p>
            </div>
        </div>
    );

    // =========================================================
    // LOADING
    // =========================================================
    if (
        loading &&
        registrations.length === 0
    ) {
        return (
            <div className="admin-dashboard-page">
                <div className="admin-dashboard-loading">
                    <div className="admin-dashboard-loading-icon">
                        <span className="spinner-border"></span>
                    </div>

                    <strong>
                        Menyiapkan dashboard
                    </strong>

                    <span>
                        Data pendaftaran sedang dimuat.
                    </span>
                </div>
            </div>
        );
    }

    // =========================================================
    // RENDER
    // =========================================================
    return (
        <div className="admin-dashboard-page">
            <div className="admin-dashboard-shell">
                {/* =========================================================
                    HEADER
                ========================================================= */}
                <section className="admin-dashboard-header">
                    <div className="admin-dashboard-heading">
                        <div className="admin-dashboard-eyebrow">
                            <i className="bi bi-grid-1x2-fill"></i>
                            ADMIN CONTROL CENTER
                        </div>

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Pantau pendaftaran,
                            pembayaran, seleksi, dan
                            perkembangan peserta
                            FITALENTA dalam satu halaman.
                        </p>
                    </div>

                    <div className="admin-welcome-card">
                        <div className="admin-welcome-avatar">
                            {getInitials(
                                user?.full_name ||
                                "Admin Fitalenta"
                            )}
                        </div>

                        <div>
                            <small>
                                SELAMAT DATANG
                            </small>

                            <strong>
                                {user?.full_name ||
                                    "Admin Fitalenta"}
                            </strong>

                            <span>
                                Administrator FITALENTA
                            </span>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    FEEDBACK
                ========================================================= */}
                {feedback && (
                    <div
                        className={`admin-feedback ${feedback.type}`}
                    >
                        <div className="admin-feedback-icon">
                            <i
                                className={`bi ${
                                    feedback.type ===
                                    "success"
                                        ? "bi-check-circle-fill"
                                        : "bi-exclamation-circle-fill"
                                }`}
                            ></i>
                        </div>

                        <div>
                            <strong>
                                {feedback.type ===
                                "success"
                                    ? "Perubahan berhasil"
                                    : "Terjadi masalah"}
                            </strong>

                            <span>
                                {feedback.message}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setFeedback(null)
                            }
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                )}

                {/* =========================================================
                    STATISTICS
                ========================================================= */}
                <section className="admin-stat-grid">
                    <div className="admin-stat-card primary">
                        <div className="admin-stat-card-top">
                            <div className="admin-stat-icon">
                                <i className="bi bi-people"></i>
                            </div>

                            <span className="admin-stat-chip">
                                Semua Program
                            </span>
                        </div>

                        <small>
                            TOTAL PENDAFTAR
                        </small>

                        <strong>
                            {stats.totalRegistrations}
                        </strong>

                        <p>
                            Jumlah peserta yang telah
                            melakukan pendaftaran.
                        </p>
                    </div>

                    <div className="admin-stat-card blue">
                        <div className="admin-stat-card-top">
                            <div className="admin-stat-icon">
                                <i className="bi bi-person-plus"></i>
                            </div>

                            <span className="admin-stat-chip">
                                7 Hari
                            </span>
                        </div>

                        <small>
                            PENDAFTAR BARU
                        </small>

                        <strong>
                            {stats.newRegistrations}
                        </strong>

                        <p>
                            Pendaftaran peserta dalam
                            tujuh hari terakhir.
                        </p>
                    </div>

                    <div className="admin-stat-card success">
                        <div className="admin-stat-card-top">
                            <div className="admin-stat-icon">
                                <i className="bi bi-wallet2"></i>
                            </div>

                            <span className="admin-stat-chip">
                                {
                                    stats.paymentStats
                                        .paid
                                }{" "}
                                Lunas
                            </span>
                        </div>

                        <small>
                            TOTAL PEMASUKAN
                        </small>

                        <strong>
                            {helpers.formatCurrency(
                                stats.totalRevenue
                            )}
                        </strong>

                        <p>
                            Total pembayaran yang telah
                            tercatat pada sistem.
                        </p>
                    </div>

                    <div className="admin-stat-card warning">
                        <div className="admin-stat-card-top">
                            <div className="admin-stat-icon">
                                <i className="bi bi-hourglass-split"></i>
                            </div>

                            <span className="admin-stat-chip">
                                Perlu Tindakan
                            </span>
                        </div>

                        <small>
                            VERIFIKASI TERTUNDA
                        </small>

                        <strong>
                            {
                                stats.pendingVerifications
                            }
                        </strong>

                        <p>
                            Proses yang masih
                            membutuhkan tindak lanjut
                            admin.
                        </p>
                    </div>
                </section>

                {/* =========================================================
                    FILTER
                ========================================================= */}
                <section className="admin-filter-card">
                    <div className="admin-card-heading">
                        <div className="admin-card-heading-left">
                            <div className="admin-card-heading-icon">
                                <i className="bi bi-funnel"></i>
                            </div>

                            <div>
                                <span>
                                    FILTER DATA
                                </span>

                                <h2>
                                    Filter & Pencarian
                                </h2>

                                <p>
                                    Temukan data peserta
                                    berdasarkan kriteria
                                    tertentu.
                                </p>
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                className="admin-reset-filter"
                                onClick={
                                    handleResetFilters
                                }
                            >
                                <i className="bi bi-arrow-counterclockwise"></i>
                                Reset Filter
                            </button>
                        )}
                    </div>

                    <div className="admin-filter-body">
                        <div className="admin-filter-field search">
                            <label>
                                Pencarian
                            </label>

                            <div className="admin-search-wrapper">
                                <i className="bi bi-search"></i>

                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={
                                        handleSearchChange
                                    }
                                    placeholder="Cari nama, email, telepon, atau kode pendaftaran..."
                                />

                                {filters.search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFilterChange(
                                                "search",
                                                ""
                                            )
                                        }
                                        title="Hapus pencarian"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="admin-filter-field">
                            <label>
                                Program
                            </label>

                            <select
                                value={
                                    filters.program
                                }
                                onChange={(event) =>
                                    handleFilterChange(
                                        "program",
                                        event.target
                                            .value
                                    )
                                }
                            >
                                <option value="all">
                                    Semua Program
                                </option>

                                {programs.map(
                                    (program) => (
                                        <option
                                            key={
                                                program.id
                                            }
                                            value={
                                                program.id
                                            }
                                        >
                                            {
                                                program.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="admin-filter-field">
                            <label>
                                Pembayaran
                            </label>

                            <select
                                value={
                                    filters.payment_status
                                }
                                onChange={(event) =>
                                    handleFilterChange(
                                        "payment_status",
                                        event.target
                                            .value
                                    )
                                }
                            >
                                <option value="all">
                                    Semua Status
                                </option>
                                <option value="pending">
                                    Belum Bayar
                                </option>
                                <option value="installment_1">
                                    Cicilan 1
                                </option>
                                <option value="installment_2">
                                    Cicilan 2
                                </option>
                                <option value="installment_3">
                                    Cicilan 3
                                </option>
                                <option value="installment_4">
                                    Cicilan 4
                                </option>
                                <option value="installment_5">
                                    Cicilan 5
                                </option>
                                <option value="installment_6">
                                    Cicilan 6
                                </option>
                                <option value="paid">
                                    Lunas
                                </option>
                                <option value="overdue">
                                    Jatuh Tempo
                                </option>
                            </select>
                        </div>

                        <div className="admin-filter-field">
                            <label>
                                Seleksi
                            </label>

                            <select
                                value={
                                    filters.selection_status
                                }
                                onChange={(event) =>
                                    handleFilterChange(
                                        "selection_status",
                                        event.target
                                            .value
                                    )
                                }
                            >
                                <option value="all">
                                    Semua Status
                                </option>
                                <option value="menunggu">
                                    Menunggu
                                </option>
                                <option value="lolos">
                                    Lolos
                                </option>
                                <option value="tidak_lolos">
                                    Tidak Lolos
                                </option>
                            </select>
                        </div>

                        <div className="admin-filter-field">
                            <label>
                                Penyaluran
                            </label>

                            <select
                                value={
                                    filters.placement_status
                                }
                                onChange={(event) =>
                                    handleFilterChange(
                                        "placement_status",
                                        event.target
                                            .value
                                    )
                                }
                            >
                                <option value="all">
                                    Semua Status
                                </option>
                                <option value="proses">
                                    Proses
                                </option>
                                <option value="lolos">
                                    Lolos
                                </option>
                                <option value="ditempatkan">
                                    Ditempatkan
                                </option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    REGISTRATION DATABASE
                ========================================================= */}
                <section className="admin-registration-card">
                    {/* ---------------------------------------------------------
                        DATABASE HEADER
                    --------------------------------------------------------- */}
                    <div className="admin-card-heading registration">
                        <div className="admin-card-heading-left">
                            <div className="admin-card-heading-icon">
                                <i className="bi bi-people"></i>
                            </div>

                            <div>
                                <span>
                                    DATABASE PESERTA
                                </span>

                                <h2>
                                    Data Pendaftar
                                </h2>

                                <p>
                                    Menampilkan{" "}
                                    {
                                        registrations.length
                                    }{" "}
                                    data berdasarkan filter
                                    saat ini.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="admin-refresh-button"
                            onClick={
                                fetchRegistrations
                            }
                            disabled={loading}
                        >
                            <i
                                className={`bi bi-arrow-clockwise ${
                                    loading
                                        ? "admin-spin"
                                        : ""
                                }`}
                            ></i>

                            {loading
                                ? "Memuat..."
                                : "Refresh"}
                        </button>
                    </div>

                    {/* ---------------------------------------------------------
                        ERROR MESSAGE
                    --------------------------------------------------------- */}
                    {error && (
                        <div className="admin-inline-error">
                            <div>
                                <i className="bi bi-exclamation-triangle-fill"></i>
                            </div>

                            <span>
                                <strong>
                                    Data belum dapat
                                    dimuat
                                </strong>

                                <small>
                                    {error}
                                </small>
                            </span>
                        </div>
                    )}

                    {/* ---------------------------------------------------------
                        EMPTY STATE
                    --------------------------------------------------------- */}
                    {registrations.length ===
                    0 ? (
                        <div className="admin-empty-state">
                            <div className="admin-empty-illustration">
                                <i className="bi bi-inbox"></i>
                            </div>

                            <span className="admin-empty-label">
                                DATA TIDAK DITEMUKAN
                            </span>

                            <h3>
                                {hasActiveFilters
                                    ? "Tidak ada peserta yang sesuai"
                                    : "Belum ada data pendaftaran"}
                            </h3>

                            <p>
                                {hasActiveFilters
                                    ? "Ubah filter atau kata kunci pencarian untuk melihat hasil lainnya."
                                    : "Data pendaftaran peserta akan tampil di area ini."}
                            </p>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={
                                        handleResetFilters
                                    }
                                >
                                    <i className="bi bi-arrow-counterclockwise"></i>
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* =========================================================
                                DESKTOP TABLE
                            ========================================================= */}
                            <div className="admin-table-wrapper d-none d-lg-block">
                                <table className="admin-registration-table">
                                    <thead>
                                    <tr>
                                        <th>
                                            Peserta
                                        </th>
                                        <th>
                                            Program
                                        </th>
                                        <th>
                                            Tanggal
                                            Daftar
                                        </th>
                                        <th>
                                            Pembayaran
                                        </th>
                                        <th>
                                            Perkembangan
                                            Peserta
                                        </th>
                                        <th>
                                            Dokumen
                                        </th>
                                        <th className="admin-action-column">
                                            Aksi
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {registrations.map(
                                        (
                                            registration
                                        ) => (
                                            <tr
                                                key={
                                                    registration.id
                                                }
                                            >
                                                {/* ---------------------------------------------------------
                                                        PARTICIPANT
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-participant-cell">
                                                        <div className="admin-participant-photo">
                                                            {registration.photo_path ? (
                                                                <img
                                                                    src={registration.photo_path}
                                                                    alt={
                                                                        registration.full_name
                                                                    }
                                                                />
                                                            ) : (
                                                                <span>
                                                                        {getInitials(
                                                                            registration.full_name
                                                                        )}
                                                                    </span>
                                                            )}
                                                        </div>

                                                        <div className="admin-participant-info">
                                                            <strong>
                                                                {
                                                                    registration.full_name
                                                                }
                                                            </strong>

                                                            <span>
                                                                    <i className="bi bi-envelope"></i>
                                                                {registration.email ||
                                                                    "-"}
                                                                </span>

                                                            <span>
                                                                    <i className="bi bi-telephone"></i>
                                                                {registration.phone ||
                                                                    "-"}
                                                                </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ---------------------------------------------------------
                                                        PROGRAM
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-program-table-cell">
                                                        <div className="admin-program-table-icon">
                                                            <i className="bi bi-briefcase"></i>
                                                        </div>

                                                        <div className="admin-program-cell">
                                                            <strong>
                                                                {registration.program_name ||
                                                                    "-"}
                                                            </strong>

                                                            <span>
                                                                    {helpers.formatCurrency(
                                                                        registration.program_training_cost
                                                                    )}
                                                                </span>

                                                            <code>
                                                                {
                                                                    registration.registration_code
                                                                }
                                                            </code>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ---------------------------------------------------------
                                                        REGISTRATION DATE
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-date-cell">
                                                        <div className="admin-date-icon">
                                                            <i className="bi bi-calendar3"></i>
                                                        </div>

                                                        <span>
                                                                <strong>
                                                                    {helpers.formatDate(
                                                                        registration.registration_date
                                                                    )}
                                                                </strong>

                                                                <small>
                                                                    Tanggal
                                                                    pendaftaran
                                                                </small>
                                                            </span>
                                                    </div>
                                                </td>

                                                {/* ---------------------------------------------------------
                                                        PAYMENT
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-payment-cell">
                                                        {getPaymentStatusBadge(
                                                            registration.payment_status,
                                                            registration.program_installment_plan
                                                        )}

                                                        {Number(
                                                                registration.amount_paid ||
                                                                0
                                                            ) >
                                                            0 && (
                                                                <div className="admin-payment-amount">
                                                                    <span>
                                                                        Terbayar
                                                                    </span>

                                                                    <strong>
                                                                        {helpers.formatCurrency(
                                                                            registration.amount_paid
                                                                        )}
                                                                    </strong>
                                                                </div>
                                                            )}
                                                    </div>
                                                </td>

                                                {/* ---------------------------------------------------------
                                                        PARTICIPANT PROGRESS
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-progress-list">
                                                        <div className="admin-progress-row">
                                                            <div className="admin-progress-label">
                                                                <i className="bi bi-person-check"></i>
                                                                <span>
                                                                        Interview
                                                                    </span>
                                                            </div>

                                                            {getRegistrationStatusBadge(
                                                                registration.registration_status
                                                            )}
                                                        </div>

                                                        <div className="admin-progress-row">
                                                            <div className="admin-progress-label">
                                                                <i className="bi bi-clipboard-check"></i>
                                                                <span>
                                                                        Seleksi
                                                                    </span>
                                                            </div>

                                                            {getSelectionStatusBadge(
                                                                registration.selection_status
                                                            )}
                                                        </div>

                                                        <div className="admin-progress-row">
                                                            <div className="admin-progress-label">
                                                                <i className="bi bi-building"></i>
                                                                <span>
                                                                        Penyaluran
                                                                    </span>
                                                            </div>

                                                            {getPlacementStatusBadge(
                                                                registration.placement_status
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ---------------------------------------------------------
                                                        DOCUMENTS
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-document-cell">
                                                        {renderCertificates(
                                                            registration
                                                        )}
                                                    </div>
                                                </td>

                                                {/* ---------------------------------------------------------
                                                        ACTIONS
                                                    --------------------------------------------------------- */}
                                                <td>
                                                    <div className="admin-action-buttons">
                                                        <button
                                                            type="button"
                                                            className="view"
                                                            onClick={() =>
                                                                handleViewDetails(
                                                                    registration
                                                                )
                                                            }
                                                            title="Lihat detail peserta"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="edit"
                                                            onClick={() =>
                                                                handleUpdateRegistrationStatus(
                                                                    registration
                                                                )
                                                            }
                                                            title="Update status interview"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* =========================================================
                                MOBILE REGISTRATION LIST
                            ========================================================= */}
                            <div className="admin-registration-mobile-list d-lg-none">
                                {registrations.map(
                                    (
                                        registration
                                    ) => (
                                        <article
                                            className="admin-registration-mobile-card"
                                            key={
                                                registration.id
                                            }
                                        >
                                            {/* ---------------------------------------------------------
                                                MOBILE HEADER
                                            --------------------------------------------------------- */}
                                            <div className="admin-mobile-registration-header">
                                                <div className="admin-participant-cell">
                                                    <div className="admin-participant-photo">
                                                        {registration.photo_path ? (
                                                            <img
                                                                src={registration.photo_path}
                                                                alt={
                                                                    registration.full_name
                                                                }
                                                            />
                                                        ) : (
                                                            <span>
                                                                {getInitials(
                                                                    registration.full_name
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="admin-participant-info">
                                                        <strong>
                                                            {
                                                                registration.full_name
                                                            }
                                                        </strong>

                                                        <span>
                                                            <i className="bi bi-envelope"></i>
                                                            {registration.email ||
                                                                "-"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {getRegistrationStatusBadge(
                                                    registration.registration_status
                                                )}
                                            </div>

                                            {/* ---------------------------------------------------------
                                                MOBILE PROGRAM
                                            --------------------------------------------------------- */}
                                            <div className="admin-mobile-program">
                                                <div className="admin-program-table-icon">
                                                    <i className="bi bi-briefcase"></i>
                                                </div>

                                                <div>
                                                    <span>
                                                        PROGRAM
                                                    </span>

                                                    <strong>
                                                        {registration.program_name ||
                                                            "-"}
                                                    </strong>

                                                    <small>
                                                        {
                                                            registration.registration_code
                                                        }
                                                    </small>
                                                </div>
                                            </div>

                                            {/* ---------------------------------------------------------
                                                MOBILE INFORMATION
                                            --------------------------------------------------------- */}
                                            <div className="admin-mobile-info-grid">
                                                <div>
                                                    <span>
                                                        Tanggal
                                                        Daftar
                                                    </span>

                                                    <strong>
                                                        {helpers.formatDate(
                                                            registration.registration_date
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        Biaya
                                                        Pelatihan
                                                    </span>

                                                    <strong>
                                                        {helpers.formatCurrency(
                                                            registration.program_training_cost
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        Telepon
                                                    </span>

                                                    <strong>
                                                        {registration.phone ||
                                                            "-"}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        Pembayaran
                                                    </span>

                                                    {getPaymentStatusBadge(
                                                        registration.payment_status,
                                                        registration.program_installment_plan
                                                    )}
                                                </div>
                                            </div>

                                            {/* ---------------------------------------------------------
                                                MOBILE PROGRESS
                                            --------------------------------------------------------- */}
                                            <div className="admin-mobile-progress">
                                                <div className="admin-mobile-section-title">
                                                    <i className="bi bi-diagram-3"></i>

                                                    <span>
                                                        Perkembangan
                                                        Peserta
                                                    </span>
                                                </div>

                                                <div className="admin-progress-list">
                                                    <div className="admin-progress-row">
                                                        <div className="admin-progress-label">
                                                            <i className="bi bi-person-check"></i>

                                                            <span>
                                                                Interview
                                                            </span>
                                                        </div>

                                                        {getRegistrationStatusBadge(
                                                            registration.registration_status
                                                        )}
                                                    </div>

                                                    <div className="admin-progress-row">
                                                        <div className="admin-progress-label">
                                                            <i className="bi bi-clipboard-check"></i>

                                                            <span>
                                                                Seleksi
                                                            </span>
                                                        </div>

                                                        {getSelectionStatusBadge(
                                                            registration.selection_status
                                                        )}
                                                    </div>

                                                    <div className="admin-progress-row">
                                                        <div className="admin-progress-label">
                                                            <i className="bi bi-building"></i>

                                                            <span>
                                                                Penyaluran
                                                            </span>
                                                        </div>

                                                        {getPlacementStatusBadge(
                                                            registration.placement_status
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ---------------------------------------------------------
                                                MOBILE DOCUMENTS
                                            --------------------------------------------------------- */}
                                            <div className="admin-mobile-document-row">
                                                <span>
                                                    <i className="bi bi-folder2-open"></i>
                                                    Dokumen
                                                </span>

                                                {renderCertificates(
                                                    registration
                                                )}
                                            </div>

                                            {/* ---------------------------------------------------------
                                                MOBILE ACTIONS
                                            --------------------------------------------------------- */}
                                            <div className="admin-mobile-action-row">
                                                <button
                                                    type="button"
                                                    className="admin-mobile-view-button"
                                                    onClick={() =>
                                                        handleViewDetails(
                                                            registration
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-eye"></i>
                                                    Lihat Detail
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-mobile-edit-button"
                                                    onClick={() =>
                                                        handleUpdateRegistrationStatus(
                                                            registration
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                    Update
                                                    Status
                                                </button>
                                            </div>
                                        </article>
                                    )
                                )}
                            </div>
                        </>
                    )}

                    {/* ---------------------------------------------------------
                        DATABASE FOOTER
                    --------------------------------------------------------- */}
                    <div className="admin-table-footer">
                        <div>
                            <i className="bi bi-database"></i>

                            <span>
                                {
                                    registrations.length
                                }{" "}
                                pendaftar ditampilkan
                            </span>
                        </div>

                        <small>
                            Data diperbarui berdasarkan
                            filter dan pencarian yang
                            aktif.
                        </small>
                    </div>
                </section>
            </div>

            {/* =========================================================
                DETAIL MODAL
            ========================================================= */}
            {showDetailModal &&
                selectedRegistration && (
                    <div
                        className="admin-modal-overlay"
                        onMouseDown={
                            handleCloseModal
                        }
                    >
                        <div
                            className="admin-modal-dialog large"
                            onMouseDown={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <div className="admin-modal-content">
                                {/* ---------------------------------------------------------
                                    DETAIL MODAL HEADER
                                --------------------------------------------------------- */}
                                <div className="admin-modal-header">
                                    <div className="admin-modal-heading">
                                        <div className="admin-modal-avatar">
                                            {selectedRegistration.photo_path ? (
                                                <img
                                                    src={selectedRegistration.photo_path}
                                                    alt={
                                                        selectedRegistration.full_name
                                                    }
                                                />
                                            ) : (
                                                getInitials(
                                                    selectedRegistration.full_name
                                                )
                                            )}
                                        </div>

                                        <div>
                                            <span>
                                                DETAIL
                                                PESERTA
                                            </span>

                                            <h2>
                                                {
                                                    selectedRegistration.full_name
                                                }
                                            </h2>

                                            <p>
                                                {
                                                    selectedRegistration.registration_code
                                                }{" "}
                                                ·{" "}
                                                {
                                                    selectedRegistration.program_name
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="admin-modal-close"
                                        onClick={
                                            handleCloseModal
                                        }
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>

                                {/* ---------------------------------------------------------
                                    DETAIL TABS
                                --------------------------------------------------------- */}
                                <div className="admin-detail-tabs">
                                    <button
                                        type="button"
                                        className={
                                            detailTab ===
                                            "basic"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setDetailTab(
                                                "basic"
                                            )
                                        }
                                    >
                                        <i className="bi bi-person"></i>
                                        Informasi Dasar
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            detailTab ===
                                            "personal"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setDetailTab(
                                                "personal"
                                            )
                                        }
                                    >
                                        <i className="bi bi-person-vcard"></i>
                                        Data Pribadi
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            detailTab ===
                                            "address"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setDetailTab(
                                                "address"
                                            )
                                        }
                                    >
                                        <i className="bi bi-geo-alt"></i>
                                        Alamat
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            detailTab ===
                                            "status"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setDetailTab(
                                                "status"
                                            )
                                        }
                                    >
                                        <i className="bi bi-clipboard-check"></i>
                                        Status & Dokumen
                                    </button>
                                </div>

                                {/* ---------------------------------------------------------
                                    DETAIL MODAL BODY
                                --------------------------------------------------------- */}
                                <div className="admin-modal-body">
                                    {detailTab ===
                                        "basic" && (
                                            <div className="admin-basic-detail-layout">
                                                <div className="admin-detail-section-card">
                                                    <div className="admin-detail-section-heading">
                                                        <div>
                                                            <i className="bi bi-person-lines-fill"></i>
                                                        </div>

                                                        <span>
                                                        <small>
                                                            KONTAK
                                                            PESERTA
                                                        </small>

                                                        <strong>
                                                            Informasi
                                                            Dasar
                                                        </strong>
                                                    </span>
                                                    </div>

                                                    <div className="admin-detail-data-grid">
                                                        <DetailItem
                                                            label="Nama Lengkap"
                                                            value={
                                                                selectedRegistration.full_name
                                                            }
                                                        />

                                                        <DetailItem
                                                            label="Email"
                                                            value={
                                                                selectedRegistration.email
                                                            }
                                                        />

                                                        <DetailItem
                                                            label="Nomor Handphone"
                                                            value={
                                                                selectedRegistration.phone
                                                            }
                                                        />

                                                        <DetailItem
                                                            label="Tanggal Pendaftaran"
                                                            value={helpers.formatDate(
                                                                selectedRegistration.registration_date
                                                            )}
                                                        />

                                                        <DetailItem
                                                            label="Kode Pendaftaran"
                                                            value={
                                                                selectedRegistration.registration_code
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="admin-detail-section-card">
                                                    <div className="admin-detail-section-heading">
                                                        <div>
                                                            <i className="bi bi-briefcase"></i>
                                                        </div>

                                                        <span>
                                                        <small>
                                                            PROGRAM
                                                            PILIHAN
                                                        </small>

                                                        <strong>
                                                            Informasi
                                                            Program
                                                        </strong>
                                                    </span>
                                                    </div>

                                                    <div className="admin-detail-data-grid">
                                                        <DetailItem
                                                            label="Program"
                                                            value={
                                                                selectedRegistration.program_name
                                                            }
                                                        />

                                                        <DetailItem
                                                            label="Biaya Pelatihan"
                                                            value={helpers.formatCurrency(
                                                                selectedRegistration.program_training_cost
                                                            )}
                                                        />

                                                        <DetailItem
                                                            label="Biaya Keberangkatan"
                                                            value={helpers.formatCurrency(
                                                                selectedRegistration.program_departure_cost
                                                            )}
                                                        />

                                                        <DetailItem
                                                            label="Durasi"
                                                            value={
                                                                selectedRegistration.program_duration
                                                            }
                                                        />

                                                        <DetailItem
                                                            label="Lokasi"
                                                            value={
                                                                selectedRegistration.program_location
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {detailTab ===
                                        "personal" &&
                                        renderPersonalInfo(
                                            selectedRegistration
                                        )}

                                    {detailTab ===
                                        "address" &&
                                        renderAddressInfo(
                                            selectedRegistration
                                        )}

                                    {detailTab ===
                                        "status" && (
                                            <>
                                                {/* ---------------------------------------------------------
                                                STATUS OVERVIEW
                                            --------------------------------------------------------- */}
                                                <div className="admin-status-overview-grid">
                                                    <div className="admin-status-overview-card">
                                                        <div>
                                                            <i className="bi bi-person-check"></i>
                                                        </div>

                                                        <span>
                                                        Interview
                                                    </span>

                                                        {getRegistrationStatusBadge(
                                                            selectedRegistration.registration_status
                                                        )}
                                                    </div>

                                                    <div className="admin-status-overview-card">
                                                        <div>
                                                            <i className="bi bi-credit-card"></i>
                                                        </div>

                                                        <span>
                                                        Pembayaran
                                                    </span>

                                                        {getPaymentStatusBadge(
                                                            selectedRegistration.payment_status,
                                                            selectedRegistration.program_installment_plan
                                                        )}

                                                        {Number(
                                                                selectedRegistration.amount_paid ||
                                                                0
                                                            ) >
                                                            0 && (
                                                                <small>
                                                                    {helpers.formatCurrency(
                                                                        selectedRegistration.amount_paid
                                                                    )}
                                                                </small>
                                                            )}
                                                    </div>

                                                    <div className="admin-status-overview-card">
                                                        <div>
                                                            <i className="bi bi-clipboard-check"></i>
                                                        </div>

                                                        <span>
                                                        Seleksi
                                                        Diklat
                                                    </span>

                                                        {getSelectionStatusBadge(
                                                            selectedRegistration.selection_status
                                                        )}
                                                    </div>

                                                    <div className="admin-status-overview-card">
                                                        <div>
                                                            <i className="bi bi-building"></i>
                                                        </div>

                                                        <span>
                                                        Penyaluran
                                                        Kerja
                                                    </span>

                                                        {getPlacementStatusBadge(
                                                            selectedRegistration.placement_status
                                                        )}

                                                        {selectedRegistration.company_name && (
                                                            <small>
                                                                {
                                                                    selectedRegistration.company_name
                                                                }
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* ---------------------------------------------------------
                                                DOCUMENT SECTION
                                            --------------------------------------------------------- */}
                                                <div className="admin-document-section">
                                                    <div className="admin-detail-section-heading">
                                                        <div>
                                                            <i className="bi bi-folder2-open"></i>
                                                        </div>

                                                        <span>
                                                        <small>
                                                            BERKAS
                                                            PESERTA
                                                        </small>

                                                        <strong>
                                                            Dokumen
                                                            &
                                                            Sertifikat
                                                        </strong>
                                                    </span>
                                                    </div>

                                                    <div className="admin-document-card-grid">
                                                        <div className="admin-document-card">
                                                            <div className="photo">
                                                                <i className="bi bi-person-badge"></i>
                                                            </div>

                                                            <span>
                                                            <small>
                                                                FOTO
                                                                PESERTA
                                                            </small>

                                                            <strong>
                                                                Foto
                                                                Profil
                                                            </strong>
                                                        </span>

                                                            {selectedRegistration.photo_path ? (
                                                                <a
                                                                    href={selectedRegistration.photo_path}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Lihat
                                                                    <i className="bi bi-arrow-up-right"></i>
                                                                </a>
                                                            ) : (
                                                                <small className="unavailable">
                                                                    Tidak
                                                                    tersedia
                                                                </small>
                                                            )}
                                                        </div>

                                                        <div className="admin-document-card">
                                                            <div className="pdf">
                                                                <i className="bi bi-file-earmark-pdf"></i>
                                                            </div>

                                                            <span>
                                                            <small>
                                                                DOKUMEN
                                                                BAHASA
                                                            </small>

                                                            <strong>
                                                                Sertifikat
                                                                N4
                                                            </strong>
                                                        </span>

                                                            {selectedRegistration.n4_certificate_path ? (
                                                                <a
                                                                    href={selectedRegistration.n4_certificate_path}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Lihat
                                                                    <i className="bi bi-arrow-up-right"></i>
                                                                </a>
                                                            ) : (
                                                                <small className="unavailable">
                                                                    Tidak
                                                                    tersedia
                                                                </small>
                                                            )}
                                                        </div>

                                                        <div className="admin-document-card">
                                                            <div className="pdf">
                                                                <i className="bi bi-file-earmark-pdf"></i>
                                                            </div>

                                                            <span>
                                                            <small>
                                                                DOKUMEN
                                                                KOMPETENSI
                                                            </small>

                                                            <strong>
                                                                Sertifikat
                                                                SSW
                                                            </strong>
                                                        </span>

                                                            {selectedRegistration.ssw_certificate_path ? (
                                                                <a
                                                                    href={selectedRegistration.ssw_certificate_path}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Lihat
                                                                    <i className="bi bi-arrow-up-right"></i>
                                                                </a>
                                                            ) : (
                                                                <small className="unavailable">
                                                                    Tidak
                                                                    tersedia
                                                                </small>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                </div>

                                {/* ---------------------------------------------------------
                                    DETAIL MODAL FOOTER
                                --------------------------------------------------------- */}
                                <div className="admin-modal-footer">
                                    <button
                                        type="button"
                                        className="admin-secondary-button"
                                        onClick={
                                            handleCloseModal
                                        }
                                    >
                                        Tutup
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-primary-button"
                                        onClick={() =>
                                            handleUpdateRegistrationStatus(
                                                selectedRegistration
                                            )
                                        }
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                        Update Status
                                        Interview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* =========================================================
                STATUS MODAL
            ========================================================= */}
            {showStatusModal &&
                selectedRegistration && (
                    <div
                        className="admin-modal-overlay"
                        onMouseDown={
                            handleCloseModal
                        }
                    >
                        <div
                            className="admin-modal-dialog"
                            onMouseDown={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <div className="admin-modal-content">
                                {/* ---------------------------------------------------------
                                    STATUS MODAL HEADER
                                --------------------------------------------------------- */}
                                <div className="admin-modal-header compact">
                                    <div className="admin-modal-heading">
                                        <div className="admin-modal-heading-icon">
                                            <i className="bi bi-person-check"></i>
                                        </div>

                                        <div>
                                            <span>
                                                INTERVIEW
                                                PESERTA
                                            </span>

                                            <h2>
                                                Update Status
                                                Pendaftaran
                                            </h2>

                                            <p>
                                                {
                                                    selectedRegistration.full_name
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="admin-modal-close"
                                        onClick={
                                            handleCloseModal
                                        }
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>

                                {/* ---------------------------------------------------------
                                    STATUS FORM
                                --------------------------------------------------------- */}
                                <form
                                    onSubmit={
                                        handleStatusSubmit
                                    }
                                >
                                    <div className="admin-modal-body">
                                        {/* ---------------------------------------------------------
                                            PARTICIPANT INFORMATION
                                        --------------------------------------------------------- */}
                                        <div className="admin-status-participant">
                                            <div className="admin-status-participant-avatar">
                                                {getInitials(
                                                    selectedRegistration.full_name
                                                )}
                                            </div>

                                            <div>
                                                <small>
                                                    PESERTA
                                                </small>

                                                <strong>
                                                    {
                                                        selectedRegistration.full_name
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        selectedRegistration.registration_code
                                                    }{" "}
                                                    ·{" "}
                                                    {
                                                        selectedRegistration.program_name
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        {/* ---------------------------------------------------------
                                            INTERVIEW STATUS
                                        --------------------------------------------------------- */}
                                        <div className="admin-modal-field">
                                            <label>
                                                Status
                                                Interview{" "}
                                                <span>
                                                    *
                                                </span>
                                            </label>

                                            <select
                                                value={
                                                    statusForm.registration_status
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setStatusForm(
                                                        (
                                                            previousForm
                                                        ) => ({
                                                            ...previousForm,
                                                            registration_status:
                                                            event
                                                                .target
                                                                .value,
                                                        })
                                                    )
                                                }
                                                required
                                            >
                                                <option value="menunggu">
                                                    Menunggu
                                                    Interview
                                                </option>

                                                <option value="lolos">
                                                    Lolos
                                                    Interview
                                                </option>

                                                <option value="tidak_lolos">
                                                    Tidak
                                                    Lolos
                                                    Interview
                                                </option>
                                            </select>

                                            <small>
                                                <i className="bi bi-info-circle"></i>
                                                Status ini
                                                menentukan
                                                hasil tahap
                                                interview
                                                peserta.
                                            </small>
                                        </div>

                                        {/* ---------------------------------------------------------
                                            INTERVIEW NOTES
                                        --------------------------------------------------------- */}
                                        <div className="admin-modal-field">
                                            <label>
                                                Catatan
                                                Interview
                                            </label>

                                            <textarea
                                                rows="4"
                                                value={
                                                    statusForm.notes
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setStatusForm(
                                                        (
                                                            previousForm
                                                        ) => ({
                                                            ...previousForm,
                                                            notes:
                                                            event
                                                                .target
                                                                .value,
                                                        })
                                                    )
                                                }
                                                placeholder="Tambahkan catatan mengenai hasil interview peserta..."
                                            />

                                            <small>
                                                <i className="bi bi-journal-text"></i>
                                                Catatan
                                                bersifat
                                                opsional dan
                                                akan
                                                tersimpan
                                                pada riwayat
                                                peserta.
                                            </small>
                                        </div>
                                    </div>

                                    {/* ---------------------------------------------------------
                                        STATUS MODAL FOOTER
                                    --------------------------------------------------------- */}
                                    <div className="admin-modal-footer">
                                        <button
                                            type="button"
                                            className="admin-secondary-button"
                                            onClick={
                                                handleCloseModal
                                            }
                                            disabled={
                                                loading
                                            }
                                        >
                                            Batal
                                        </button>

                                        <button
                                            type="submit"
                                            className="admin-primary-button"
                                            disabled={
                                                loading
                                            }
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-lg"></i>
                                                    Simpan
                                                    Status
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
>>>>>>> perbaikan-website-fitalenta
};

export default AdminDashboard;