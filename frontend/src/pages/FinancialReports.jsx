<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";

const FinancialReports = () => {
  const [summary, setSummary] = useState(null);
  const [detailedReports, setDetailedReports] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    program: "all",
    start_date: "",
    end_date: "",
    status: "all",
    search: "",
  });

  useEffect(() => {
    fetchFinancialData();
  }, [filters]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchFinancialSummary(),
        fetchDetailedReports(),
        fetchPrograms(),
      ]);
    } catch (error) {
      console.error("Error fetching financial data:", error);
      setError("Gagal memuat data keuangan");
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancialSummary = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== "all" && filters[key] !== "" && key !== "search") {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(
        `/api/reports/financial/summary?${params}`
      );
      if (response.data.success) {
        setSummary(response.data.data);
      } else {
        setError("Gagal memuat ringkasan keuangan");
      }
    } catch (error) {
      console.error("Error fetching financial summary:", error);
      throw error;
    }
  };

  const fetchDetailedReports = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== "all" && filters[key] !== "") {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(
        `/api/reports/financial/detailed?${params}`
      );
      if (response.data.success) {
        setDetailedReports(response.data.data);
      } else {
        setError("Gagal memuat detail transaksi");
      }
    } catch (error) {
      console.error("Error fetching detailed reports:", error);
      throw error;
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await axios.get("/api/programs");
      if (response.data.success) {
        setPrograms(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      throw error;
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      program: "all",
      start_date: "",
      end_date: "",
      status: "all",
      search: "",
    });
  };

  const handleExportExcel = async () => {
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
        `/api/reports/financial/export/excel?${params}`,
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
          `laporan-keuangan-${new Date().toISOString().split("T")[0]}.xlsx`
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
          ? "Fitur export Excel belum tersedia"
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
        `/api/reports/financial/export/pdf?${params}`,
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
          `laporan-keuangan-${new Date().toISOString().split("T")[0]}.pdf`
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
          ? "Fitur export PDF belum tersedia"
          : "Gagal mengekspor ke PDF. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setExportLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "Rp 0";
    const numValue = parseFloat(value);
    return isNaN(numValue) ? "Rp 0" : `Rp ${numValue.toLocaleString("id-ID")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID");
    } catch (error) {
      return "-";
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-warning text-dark", text: "Menunggu" },
      installment_1: { class: "bg-info", text: "Cicilan 1" },
      installment_2: { class: "bg-info", text: "Cicilan 2" },
      installment_3: { class: "bg-info", text: "Cicilan 3" },
      installment_4: { class: "bg-info", text: "Cicilan 4" },
      installment_5: { class: "bg-info", text: "Cicilan 5" },
      installment_6: { class: "bg-info", text: "Cicilan 6" },
      paid: { class: "bg-success", text: "Lunas" },
      overdue: { class: "bg-danger", text: "Jatuh Tempo" },
      cancelled: { class: "bg-secondary", text: "Dibatalkan" },
    };
    const config = statusConfig[status] || {
      class: "bg-secondary",
      text: status,
    };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      transfer: "Transfer Bank",
      cash: "Tunai",
      credit_card: "Kartu Kredit",
    };
    return methods[method] || method;
  };

  const getInstallmentText = (payment) => {
    if (payment.status === "paid") return "Lunas";
    if (payment.status === "pending") return "Menunggu Pembayaran";
    if (payment.status.startsWith("installment_")) {
      const installmentNum = payment.status.split("_")[1];
      const totalAmount = parseFloat(payment.amount) || 0;
      const paidAmount = parseFloat(payment.amount_paid) || 0;
      const progress =
        totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
      return `Cicilan ${installmentNum} (${progress}%)`;
    }
    return payment.status;
  };

  const calculateRemainingBalance = () => {
    if (!summary?.summary) return 0;
    const totalAmount = parseFloat(summary.summary.total_amount || 0);
    const totalPaid = parseFloat(summary.summary.total_amount_paid || 0);
    return totalAmount - totalPaid;
  };

  if (loading && !summary) {
    return (
      <div className="container mt-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="text-center">
            <div
              className="spinner-border text-primary mb-3"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Memuat laporan keuangan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col">
          <h2>Laporan Keuangan</h2>
          <p className="text-muted">
            Monitoring dan analisis data keuangan program magang
          </p>
        </div>
      </div>

      {/* Alert Message */}
      {error && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card bg-primary">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-white mb-1">
                      Total Pemasukan
                    </h6>
                    <h4 className="text-white mb-0">
                      {formatCurrency(summary.summary?.total_revenue)}
                    </h4>
                    <small className="text-white">
                      {summary.summary?.total_transactions} transaksi
                    </small>
                  </div>
                  <div className="text-white">
                    <i className="bi bi-cash-coin fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-primary">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-white mb-1">
                      Menunggu Verifikasi
                    </h6>
                    <h4 className="text-white mb-0">
                      {formatCurrency(summary.summary?.total_pending)}
                    </h4>
                    <small className="text-white">Belum dikonfirmasi</small>
                  </div>
                  <div className="text-white">
                    <i className="bi bi-clock fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-primary">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-white mb-1">
                      Estimasi Tunggakan
                    </h6>
                    <h4 className="text-white mb-0">
                      {formatCurrency(summary.summary?.total_outstanding)}
                    </h4>
                    <small className="text-white">
                      {formatCurrency(summary.summary?.total_overdue)} overdue
                    </small>
                  </div>
                  <div className="text-white">
                    <i className="bi bi-exclamation-triangle fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-primary">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-white mb-1">Sisa Tagihan</h6>
                    <h4 className="text-white mb-0">
                      {formatCurrency(calculateRemainingBalance())}
                    </h4>
                    <small className="text-white">Belum dibayar</small>
                  </div>
                  <div className="text-white">
                    <i className="bi bi-receipt fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            Filter & Pencarian
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
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
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
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
              <label className="form-label">Tanggal Mulai</label>
              <input
                type="date"
                className="form-control"
                value={filters.start_date}
                onChange={(e) =>
                  handleFilterChange("start_date", e.target.value)
                }
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Tanggal Akhir</label>
              <input
                type="date"
                className="form-control"
                value={filters.end_date}
                onChange={(e) => handleFilterChange("end_date", e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Pencarian</label>
              <input
                type="text"
                className="form-control"
                placeholder="Cari nama, email, atau invoice..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <div className="col-md-12">
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleResetFilters}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Reset Filter
                </button>
                <button
                  className="btn btn-primary"
                  onClick={fetchFinancialData}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Memuat...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-2"></i>
                      Terapkan Filter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="row mb-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">
                    <i className="bi bi-download me-2"></i>
                    Ekspor Laporan
                  </h5>
                  <p className="text-muted mb-0">
                    Download laporan dalam format Excel atau PDF
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn-success me-2"
                    onClick={handleExportExcel}
                    disabled={exportLoading || detailedReports.length === 0}
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
                    className="btn btn-danger"
                    onClick={handleExportPDF}
                    disabled={exportLoading || detailedReports.length === 0}
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

      {/* Detailed Report Table */}
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Detail Transaksi ({detailedReports.length})
              </h5>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={fetchFinancialData}
                  disabled={loading}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  {loading ? "Memuat..." : "Refresh"}
                </button>
              </div>
            </div>

            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">Memuat data transaksi...</p>
                </div>
              ) : detailedReports.length === 0 ? (
                <div className="text-center py-5">
                  <div className="text-muted mb-3">
                    <i className="bi bi-receipt fs-1"></i>
                  </div>
                  <h5>Tidak ada data transaksi</h5>
                  <p className="text-muted">
                    Coba ubah filter atau tanggal untuk melihat data
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-light align-middle">
                      <tr>
                        <th width="50">#</th>
                        <th width="150">Invoice</th>
                        <th>Nama Peserta</th>
                        <th width="120">Program</th>
                        <th width="120">Status</th>
                        <th width="150">Jenis Pembayaran</th>
                        <th width="120">Total Tagihan</th>
                        <th width="120">Sudah Dibayar</th>
                        <th width="100">Metode</th>
                        <th width="120">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="align-middle">
                      {detailedReports.map((report, index) => (
                        <tr key={report.id}>
                          <td className="text-muted">{index + 1}</td>
                          <td>
                            <div>
                              <strong className="text-primary">
                                {report.invoice_number}
                              </strong>
                              {report.receipt_number && (
                                <div>
                                  <small className="text-success">
                                    <i className="bi bi-receipt me-1"></i>
                                    {report.receipt_number}
                                  </small>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{report.full_name}</strong>
                              <div>
                                <small className="text-muted">
                                  <i className="bi bi-envelope me-1"></i>
                                  {report.email}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-primary text-white">
                              {report.program_name}
                            </span>
                          </td>
                          <td>{getStatusBadge(report.status)}</td>
                          <td>
                            <small>{getInstallmentText(report)}</small>
                          </td>
                          <td className="fw-bold text-end">
                            {formatCurrency(report.amount)}
                          </td>
                          <td
                            className={`text-end ${
                              parseFloat(report.amount_paid || 0) >=
                              parseFloat(report.amount || 0)
                                ? "text-success fw-bold"
                                : "text-warning"
                            }`}
                          >
                            {formatCurrency(report.amount_paid)}
                          </td>
                          <td>
                            {report.payment_method && (
                              <span className="badge bg-light text-dark">
                                {getPaymentMethodText(report.payment_method)}
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="small">
                              {formatDate(
                                report.payment_date || report.created_at
                              )}
                            </div>
                            {report.due_date && (
                              <div className="small text-muted">
                                Jatuh tempo: {formatDate(report.due_date)}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {summary && (
                      <tfoot className="table-light align-middle">
                        <tr>
                          <td colSpan="6" className="text-end fw-bold">
                            TOTAL:
                          </td>
                          <td className="fw-bold text-end">
                            {formatCurrency(summary.summary?.total_amount)}
                          </td>
                          <td className="fw-bold text-end">
                            {formatCurrency(summary.summary?.total_amount_paid)}
                          </td>
                          <td colSpan="2">
                            <small className="text-muted">
                              Sisa:{" "}
                              {formatCurrency(calculateRemainingBalance())}
                            </small>
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
=======
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

/* =========================================================
   FINANCIAL REPORTS
========================================================= */
const FinancialReports = () => {
    /* ---------------------------------------------------------
       STATE DATA
    --------------------------------------------------------- */
    const [summary, setSummary] = useState(null);
    const [detailedReports, setDetailedReports] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState("");
    const [error, setError] = useState("");

    /* ---------------------------------------------------------
       FILTER STATE
    --------------------------------------------------------- */
    const defaultFilters = {
        program: "all",
        start_date: "",
        end_date: "",
        status: "all",
        search: "",
    };

    const [filters, setFilters] = useState(defaultFilters);
    const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

    /* =========================================================
       FILTER UTILITIES
    ========================================================= */

    /* ---------------------------------------------------------
       BUILD QUERY PARAMETERS
    --------------------------------------------------------- */
    const buildParams = useCallback((sourceFilters, includeSearch = true) => {
        const params = new URLSearchParams();

        Object.keys(sourceFilters).forEach((key) => {
            if (!includeSearch && key === "search") {
                return;
            }

            if (
                sourceFilters[key] !== "all" &&
                sourceFilters[key] !== ""
            ) {
                params.append(key, sourceFilters[key]);
            }
        });

        return params;
    }, []);

    /* =========================================================
       FETCH DATA
    ========================================================= */

    /* ---------------------------------------------------------
       FETCH PROGRAMS
    --------------------------------------------------------- */
    const fetchPrograms = useCallback(async () => {
        try {
            const response = await axios.get("/api/programs", {
                timeout: 10000,
            });

            if (response.data?.success) {
                setPrograms(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );
            }
        } catch (error) {
            console.error("Error fetching programs:", error);
        }
    }, []);

    /* ---------------------------------------------------------
       FETCH FINANCIAL SUMMARY
    --------------------------------------------------------- */
    const fetchFinancialSummary = useCallback(
        async (activeFilters) => {
            const params = buildParams(activeFilters, false);

            const response = await axios.get(
                `/api/reports/financial/summary?${params.toString()}`,
                {
                    timeout: 15000,
                }
            );

            if (!response.data?.success) {
                throw new Error("Gagal memuat ringkasan keuangan");
            }

            setSummary(response.data.data);
        },
        [buildParams]
    );

    /* ---------------------------------------------------------
       FETCH DETAILED REPORTS
    --------------------------------------------------------- */
    const fetchDetailedReports = useCallback(
        async (activeFilters) => {
            const params = buildParams(activeFilters);

            const response = await axios.get(
                `/api/reports/financial/detailed?${params.toString()}`,
                {
                    timeout: 15000,
                }
            );

            if (!response.data?.success) {
                throw new Error("Gagal memuat detail transaksi");
            }

            setDetailedReports(
                Array.isArray(response.data.data)
                    ? response.data.data
                    : []
            );
        },
        [buildParams]
    );

    /* ---------------------------------------------------------
       FETCH ALL FINANCIAL DATA
    --------------------------------------------------------- */
    const fetchFinancialData = useCallback(
        async (activeFilters = appliedFilters) => {
            try {
                setLoading(true);
                setError("");

                await Promise.all([
                    fetchFinancialSummary(activeFilters),
                    fetchDetailedReports(activeFilters),
                ]);
            } catch (error) {
                console.error("Error fetching financial data:", error);

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Gagal memuat data keuangan"
                );
            } finally {
                setLoading(false);
            }
        },
        [
            appliedFilters,
            fetchFinancialSummary,
            fetchDetailedReports,
        ]
    );

    /* =========================================================
       EFFECT
    ========================================================= */

    /* ---------------------------------------------------------
       INITIAL PROGRAM DATA
    --------------------------------------------------------- */
    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    /* ---------------------------------------------------------
       LOAD REPORT WHEN APPLIED FILTER CHANGES
    --------------------------------------------------------- */
    useEffect(() => {
        fetchFinancialData(appliedFilters);
    }, [appliedFilters]);

    /* =========================================================
       FILTER ACTIONS
    ========================================================= */

    /* ---------------------------------------------------------
       CHANGE FILTER
    --------------------------------------------------------- */
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    /* ---------------------------------------------------------
       APPLY FILTER
    --------------------------------------------------------- */
    const handleApplyFilters = () => {
        if (
            filters.start_date &&
            filters.end_date &&
            new Date(filters.start_date) > new Date(filters.end_date)
        ) {
            setError(
                "Tanggal mulai tidak boleh lebih besar dari tanggal akhir."
            );
            return;
        }

        setError("");
        setAppliedFilters({ ...filters });
    };

    /* ---------------------------------------------------------
       RESET FILTER
    --------------------------------------------------------- */
    const handleResetFilters = () => {
        const resetValue = {
            program: "all",
            start_date: "",
            end_date: "",
            status: "all",
            search: "",
        };

        setFilters(resetValue);
        setAppliedFilters(resetValue);
        setError("");
    };

    /* ---------------------------------------------------------
       ACTIVE FILTER STATUS
    --------------------------------------------------------- */
    const hasActiveFilters =
        appliedFilters.program !== "all" ||
        appliedFilters.start_date !== "" ||
        appliedFilters.end_date !== "" ||
        appliedFilters.status !== "all" ||
        appliedFilters.search !== "";

    /* =========================================================
       EXPORT REPORT
    ========================================================= */

    /* ---------------------------------------------------------
       DOWNLOAD FILE
    --------------------------------------------------------- */
    const downloadFile = (blob, fileName) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", fileName);

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
    };

    /* ---------------------------------------------------------
       EXPORT EXCEL
    --------------------------------------------------------- */
    const handleExportExcel = async () => {
        try {
            setExportLoading("excel");
            setError("");

            const params = buildParams(appliedFilters);

            const response = await axios.get(
                `/api/reports/financial/export/excel?${params.toString()}`,
                {
                    responseType: "blob",
                    timeout: 30000,
                }
            );

            if (response.status === 200) {
                downloadFile(
                    new Blob([response.data]),
                    `laporan-keuangan-${
                        new Date().toISOString().split("T")[0]
                    }.xlsx`
                );
            }
        } catch (error) {
            console.error("Error exporting to Excel:", error);

            setError(
                error.response?.status === 404
                    ? "Fitur export Excel belum tersedia."
                    : "Gagal mengekspor laporan ke Excel. Silakan coba lagi."
            );
        } finally {
            setExportLoading("");
        }
    };

    /* ---------------------------------------------------------
       EXPORT PDF
    --------------------------------------------------------- */
    const handleExportPDF = async () => {
        try {
            setExportLoading("pdf");
            setError("");

            const params = buildParams(appliedFilters);

            const response = await axios.get(
                `/api/reports/financial/export/pdf?${params.toString()}`,
                {
                    responseType: "blob",
                    timeout: 30000,
                }
            );

            if (response.status === 200) {
                downloadFile(
                    new Blob([response.data]),
                    `laporan-keuangan-${
                        new Date().toISOString().split("T")[0]
                    }.pdf`
                );
            }
        } catch (error) {
            console.error("Error exporting to PDF:", error);

            setError(
                error.response?.status === 404
                    ? "Fitur export PDF belum tersedia."
                    : "Gagal mengekspor laporan ke PDF. Silakan coba lagi."
            );
        } finally {
            setExportLoading("");
        }
    };

    /* =========================================================
       FORMAT UTILITIES
    ========================================================= */

    /* ---------------------------------------------------------
       CURRENCY
    --------------------------------------------------------- */
    const formatCurrency = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "Rp 0";
        }

        const numericValue = parseFloat(value);

        if (Number.isNaN(numericValue)) {
            return "Rp 0";
        }

        return `Rp ${Math.round(numericValue).toLocaleString("id-ID")}`;
    };

    /* ---------------------------------------------------------
       DATE
    --------------------------------------------------------- */
    const formatDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        try {
            const date = new Date(dateString);

            if (Number.isNaN(date.getTime())) {
                return "-";
            }

            return date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch {
            return "-";
        }
    };

    /* ---------------------------------------------------------
       STATUS BADGE
    --------------------------------------------------------- */
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                tone: "warning",
                icon: "bi-clock-history",
                text: "Menunggu",
            },
            installment_1: {
                tone: "primary",
                icon: "bi-wallet2",
                text: "Cicilan 1",
            },
            installment_2: {
                tone: "primary",
                icon: "bi-wallet2",
                text: "Cicilan 2",
            },
            installment_3: {
                tone: "primary",
                icon: "bi-wallet2",
                text: "Cicilan 3",
            },
            installment_4: {
                tone: "primary",
                icon: "bi-wallet2",
                text: "Cicilan 4",
            },
            installment_5: {
                tone: "primary",
                icon: "bi-wallet2",
                text: "Cicilan 5",
            },
            installment_6: {
                tone: "primary",
                icon: "bi-wallet2",
                text: "Cicilan 6",
            },
            paid: {
                tone: "success",
                icon: "bi-check-circle",
                text: "Lunas",
            },
            overdue: {
                tone: "danger",
                icon: "bi-exclamation-circle",
                text: "Jatuh Tempo",
            },
            cancelled: {
                tone: "secondary",
                icon: "bi-x-circle",
                text: "Dibatalkan",
            },
        };

        const config = statusConfig[status] || {
            tone: "secondary",
            icon: "bi-dash-circle",
            text: status || "Tidak Diketahui",
        };

        return (
            <span
                className={`financial-status-badge financial-status-${config.tone}`}
            >
                <i className={`bi ${config.icon}`}></i>
                {config.text}
            </span>
        );
    };

    /* ---------------------------------------------------------
       PAYMENT METHOD
    --------------------------------------------------------- */
    const getPaymentMethodText = (method) => {
        const methods = {
            transfer: "Transfer Bank",
            cash: "Tunai",
            credit_card: "Kartu Kredit",
        };

        return methods[method] || method || "-";
    };

    /* ---------------------------------------------------------
       PAYMENT METHOD ICON
    --------------------------------------------------------- */
    const getPaymentMethodIcon = (method) => {
        const icons = {
            transfer: "bi-bank",
            cash: "bi-cash-stack",
            credit_card: "bi-credit-card",
        };

        return icons[method] || "bi-wallet2";
    };

    /* ---------------------------------------------------------
       INSTALLMENT TEXT
    --------------------------------------------------------- */
    const getInstallmentText = (payment) => {
        if (!payment?.status) {
            return "-";
        }

        if (payment.status === "paid") {
            return "Pembayaran Lunas";
        }

        if (payment.status === "pending") {
            return "Menunggu Pembayaran";
        }

        if (payment.status.startsWith("installment_")) {
            const installmentNum = payment.status.split("_")[1];
            const totalAmount = parseFloat(payment.amount) || 0;
            const paidAmount =
                parseFloat(payment.amount_paid) || 0;

            const progress =
                totalAmount > 0
                    ? Math.round(
                        (paidAmount / totalAmount) * 100
                    )
                    : 0;

            return `Cicilan ${installmentNum} · ${progress}% dibayar`;
        }

        return payment.status;
    };

    /* ---------------------------------------------------------
       REMAINING BALANCE
    --------------------------------------------------------- */
    const calculateRemainingBalance = () => {
        if (!summary?.summary) {
            return 0;
        }

        const totalAmount = parseFloat(
            summary.summary.total_amount || 0
        );

        const totalPaid = parseFloat(
            summary.summary.total_amount_paid || 0
        );

        return Math.max(0, totalAmount - totalPaid);
    };

    /* ---------------------------------------------------------
       PARTICIPANT INITIALS
    --------------------------------------------------------- */
    const getInitials = (name) => {
        if (!name) {
            return "P";
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

    /* =========================================================
       SUMMARY DATA
    ========================================================= */
    const summaryData = summary?.summary || {};

    /* =========================================================
       INITIAL LOADING
    ========================================================= */
    if (loading && !summary) {
        return (
            <div className="financial-reports-page">
                <div className="financial-loading-state">
                    <div className="financial-loading-icon">
                        <span
                            className="spinner-border"
                            role="status"
                        ></span>
                    </div>
                    <h4>Memuat laporan keuangan</h4>
                    <p>
                        Data transaksi dan ringkasan keuangan
                        sedang disiapkan.
                    </p>
                </div>
            </div>
        );
    }

    /* =========================================================
       MAIN RENDER
    ========================================================= */
    return (
        <div className="financial-reports-page">
            {/* ---------------------------------------------------------
                PAGE HEADER
            --------------------------------------------------------- */}
            <header className="financial-page-header">
                <div>
                    <div className="financial-page-eyebrow">
                        <span>
                            <i className="bi bi-graph-up-arrow"></i>
                        </span>
                        MANAJEMEN KEUANGAN
                    </div>
                    <h1>Laporan Keuangan</h1>
                    <p>
                        Monitoring, analisis, dan rekapitulasi
                        transaksi keuangan seluruh program
                        FITALENTA.
                    </p>
                </div>

                <div className="financial-header-status">
                    <span className="financial-header-status-icon">
                        <i className="bi bi-shield-check"></i>
                    </span>
                    <div>
                        <small>STATUS DATA</small>
                        <strong>
                            Data Keuangan Terintegrasi
                        </strong>
                    </div>
                </div>
            </header>

            {/* ---------------------------------------------------------
                ERROR MESSAGE
            --------------------------------------------------------- */}
            {error && (
                <div className="financial-alert">
                    <div className="financial-alert-icon">
                        <i className="bi bi-exclamation-triangle"></i>
                    </div>
                    <div>
                        <strong>Terjadi kendala</strong>
                        <span>{error}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label="Tutup pemberitahuan"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}

            {/* =========================================================
                SUMMARY
            ========================================================= */}
            <section className="financial-summary-grid">
                {/* ---------------------------------------------------------
                    TOTAL REVENUE
                --------------------------------------------------------- */}
                <article className="financial-summary-card financial-summary-revenue">
                    <div className="financial-summary-card-top">
                        <div className="financial-summary-icon">
                            <i className="bi bi-cash-stack"></i>
                        </div>
                        <span>PEMASUKAN</span>
                    </div>

                    <div className="financial-summary-content">
                        <small>Total Pemasukan</small>
                        <strong>
                            {formatCurrency(
                                summaryData.total_revenue
                            )}
                        </strong>
                        <p>
                            {summaryData.total_transactions ||
                                0}{" "}
                            transaksi tercatat
                        </p>
                    </div>

                    <div className="financial-summary-decoration"></div>
                </article>

                {/* ---------------------------------------------------------
                    PENDING
                --------------------------------------------------------- */}
                <article className="financial-summary-card financial-summary-pending">
                    <div className="financial-summary-card-top">
                        <div className="financial-summary-icon">
                            <i className="bi bi-hourglass-split"></i>
                        </div>
                        <span>PERLU TINDAKAN</span>
                    </div>

                    <div className="financial-summary-content">
                        <small>
                            Menunggu Verifikasi
                        </small>
                        <strong>
                            {formatCurrency(
                                summaryData.total_pending
                            )}
                        </strong>
                        <p>
                            Pembayaran yang belum dikonfirmasi
                        </p>
                    </div>

                    <div className="financial-summary-decoration"></div>
                </article>

                {/* ---------------------------------------------------------
                    OVERDUE
                --------------------------------------------------------- */}
                <article className="financial-summary-card financial-summary-overdue">
                    <div className="financial-summary-card-top">
                        <div className="financial-summary-icon">
                            <i className="bi bi-exclamation-triangle"></i>
                        </div>
                        <span>MONITORING</span>
                    </div>

                    <div className="financial-summary-content">
                        <small>
                            Estimasi Tunggakan
                        </small>
                        <strong>
                            {formatCurrency(
                                summaryData.total_outstanding
                            )}
                        </strong>
                        <p>
                            {formatCurrency(
                                summaryData.total_overdue
                            )}{" "}
                            telah jatuh tempo
                        </p>
                    </div>

                    <div className="financial-summary-decoration"></div>
                </article>

                {/* ---------------------------------------------------------
                    REMAINING
                --------------------------------------------------------- */}
                <article className="financial-summary-card financial-summary-remaining">
                    <div className="financial-summary-card-top">
                        <div className="financial-summary-icon">
                            <i className="bi bi-receipt-cutoff"></i>
                        </div>
                        <span>TAGIHAN</span>
                    </div>

                    <div className="financial-summary-content">
                        <small>Sisa Tagihan</small>
                        <strong>
                            {formatCurrency(
                                calculateRemainingBalance()
                            )}
                        </strong>
                        <p>
                            Total nominal yang belum
                            dibayarkan
                        </p>
                    </div>

                    <div className="financial-summary-decoration"></div>
                </article>
            </section>

            {/* =========================================================
                FILTER & SEARCH
            ========================================================= */}
            <section className="financial-content-card financial-filter-card">
                {/* ---------------------------------------------------------
                    FILTER HEADER
                --------------------------------------------------------- */}
                <div className="financial-card-heading">
                    <div className="financial-card-heading-left">
                        <div className="financial-section-icon">
                            <i className="bi bi-funnel"></i>
                        </div>

                        <div>
                            <span>FILTER DATA</span>
                            <h2>Filter & Pencarian</h2>
                            <p>
                                Sesuaikan laporan berdasarkan
                                program, status, periode, atau
                                peserta.
                            </p>
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <span className="financial-active-filter-badge">
                            <i className="bi bi-check2-circle"></i>
                            Filter Aktif
                        </span>
                    )}
                </div>

                {/* ---------------------------------------------------------
                    FILTER FIELDS
                --------------------------------------------------------- */}
                <div className="financial-filter-body">
                    <div className="financial-filter-grid">
                        <div className="financial-filter-field financial-filter-program">
                            <label>Program</label>
                            <select
                                value={filters.program}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "program",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    Semua Program
                                </option>

                                {programs.map((program) => (
                                    <option
                                        key={program.id}
                                        value={program.id}
                                    >
                                        {program.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="financial-filter-field">
                            <label>
                                Status Pembayaran
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "status",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    Semua Status
                                </option>
                                <option value="pending">
                                    Menunggu Pembayaran
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

                        <div className="financial-filter-field">
                            <label>Tanggal Mulai</label>
                            <input
                                type="date"
                                value={
                                    filters.start_date
                                }
                                onChange={(e) =>
                                    handleFilterChange(
                                        "start_date",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="financial-filter-field">
                            <label>Tanggal Akhir</label>
                            <input
                                type="date"
                                value={filters.end_date}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "end_date",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* ---------------------------------------------------------
                        SEARCH
                    --------------------------------------------------------- */}
                    <div className="financial-search-row">
                        <div className="financial-search-field">
                            <label>Pencarian</label>

                            <div className="financial-search-input">
                                <i className="bi bi-search"></i>

                                <input
                                    type="text"
                                    value={filters.search}
                                    placeholder="Cari nama peserta, email, atau nomor invoice..."
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "search",
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key ===
                                            "Enter"
                                        ) {
                                            handleApplyFilters();
                                        }
                                    }}
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
                                        aria-label="Hapus pencarian"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ---------------------------------------------------------
                        FILTER ACTIONS
                    --------------------------------------------------------- */}
                    <div className="financial-filter-actions">
                        <button
                            type="button"
                            className="financial-reset-button"
                            onClick={
                                handleResetFilters
                            }
                        >
                            <i className="bi bi-arrow-counterclockwise"></i>
                            Reset Filter
                        </button>

                        <button
                            type="button"
                            className="financial-primary-button"
                            onClick={
                                handleApplyFilters
                            }
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm"></span>
                                    Memuat...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-search"></i>
                                    Terapkan Filter
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* =========================================================
                EXPORT
            ========================================================= */}
            <section className="financial-export-card">
                {/* ---------------------------------------------------------
                    EXPORT INFORMATION
                --------------------------------------------------------- */}
                <div className="financial-export-info">
                    <div className="financial-export-icon">
                        <i className="bi bi-download"></i>
                    </div>

                    <div>
                        <span>UNDUH DOKUMEN</span>
                        <h3>Ekspor Laporan</h3>
                        <p>
                            Download laporan sesuai filter
                            aktif dalam format Excel atau PDF.
                        </p>
                    </div>
                </div>

                {/* ---------------------------------------------------------
                    EXPORT BUTTONS
                --------------------------------------------------------- */}
                <div className="financial-export-actions">
                    <button
                        type="button"
                        className="financial-export-button financial-export-excel"
                        onClick={
                            handleExportExcel
                        }
                        disabled={
                            Boolean(exportLoading) ||
                            detailedReports.length ===
                            0
                        }
                    >
                        {exportLoading ===
                        "excel" ? (
                            <>
                                <span className="spinner-border spinner-border-sm"></span>
                                Menyiapkan...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-file-earmark-excel"></i>
                                Excel
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        className="financial-export-button financial-export-pdf"
                        onClick={handleExportPDF}
                        disabled={
                            Boolean(exportLoading) ||
                            detailedReports.length ===
                            0
                        }
                    >
                        {exportLoading === "pdf" ? (
                            <>
                                <span className="spinner-border spinner-border-sm"></span>
                                Menyiapkan...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-file-earmark-pdf"></i>
                                PDF
                            </>
                        )}
                    </button>
                </div>
            </section>

            {/* =========================================================
                TRANSACTION DETAIL
            ========================================================= */}
            <section className="financial-content-card financial-transaction-card">
                {/* ---------------------------------------------------------
                    TRANSACTION HEADER
                --------------------------------------------------------- */}
                <div className="financial-card-heading financial-transaction-heading">
                    <div className="financial-card-heading-left">
                        <div className="financial-section-icon">
                            <i className="bi bi-receipt"></i>
                        </div>

                        <div>
                            <span>
                                DATABASE KEUANGAN
                            </span>
                            <h2>Detail Transaksi</h2>
                            <p>
                                Menampilkan{" "}
                                {detailedReports.length}{" "}
                                transaksi berdasarkan filter
                                yang diterapkan.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="financial-refresh-button"
                        onClick={() =>
                            fetchFinancialData(
                                appliedFilters
                            )
                        }
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
                    TRANSACTION CONTENT
                --------------------------------------------------------- */}
                {loading ? (
                    <div className="financial-table-loading">
                        <span className="spinner-border"></span>
                        <strong>
                            Memuat transaksi
                        </strong>
                        <p>Mohon tunggu sebentar.</p>
                    </div>
                ) : detailedReports.length ===
                0 ? (
                    <div className="financial-empty-state">
                        <div>
                            <i className="bi bi-receipt"></i>
                        </div>
                        <h4>
                            Tidak ada data transaksi
                        </h4>
                        <p>
                            Coba ubah filter atau periode
                            untuk menampilkan data transaksi
                            lainnya.
                        </p>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                className="financial-reset-button"
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
                        {/* ---------------------------------------------------------
                            REPORT SUMMARY
                        --------------------------------------------------------- */}
                        <div className="financial-report-summary">
                            <div className="financial-report-summary-heading">
                                <div className="financial-report-summary-icon">
                                    <i className="bi bi-bar-chart-line"></i>
                                </div>

                                <div>
                                    <span>
                                        RINGKASAN LAPORAN
                                    </span>
                                    <strong>
                                        {
                                            detailedReports.length
                                        }{" "}
                                        Transaksi
                                    </strong>
                                </div>
                            </div>

                            <div className="financial-report-summary-values">
                                <div className="financial-report-summary-item">
                                    <span>
                                        Total Tagihan
                                    </span>
                                    <strong>
                                        {formatCurrency(
                                            summaryData.total_amount
                                        )}
                                    </strong>
                                </div>

                                <div className="financial-report-summary-item financial-report-summary-paid">
                                    <span>
                                        Sudah Dibayar
                                    </span>
                                    <strong>
                                        {formatCurrency(
                                            summaryData.total_amount_paid
                                        )}
                                    </strong>
                                </div>

                                <div className="financial-report-summary-item financial-report-summary-remaining">
                                    <span>
                                        Sisa Tagihan
                                    </span>
                                    <strong>
                                        {formatCurrency(
                                            calculateRemainingBalance()
                                        )}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* ---------------------------------------------------------
                            TRANSACTION LIST
                        --------------------------------------------------------- */}
                        <div className="financial-transaction-list">
                            {detailedReports.map(
                                (report, index) => {
                                    const totalAmount =
                                        parseFloat(
                                            report.amount ||
                                            0
                                        );

                                    const paidAmount =
                                        parseFloat(
                                            report.amount_paid ||
                                            0
                                        );

                                    const remainingAmount =
                                        Math.max(
                                            0,
                                            totalAmount -
                                            paidAmount
                                        );

                                    const progress =
                                        totalAmount > 0
                                            ? Math.min(
                                                100,
                                                Math.round(
                                                    (paidAmount /
                                                        totalAmount) *
                                                    100
                                                )
                                            )
                                            : 0;

                                    return (
                                        <article
                                            className="financial-transaction-item"
                                            key={
                                                report.id
                                            }
                                        >
                                            {/* ---------------------------------------------------------
                                                TRANSACTION HEADER
                                            --------------------------------------------------------- */}
                                            <div className="financial-transaction-item-header">
                                                <div className="financial-transaction-number">
                                                    <span>
                                                        {index +
                                                            1}
                                                    </span>
                                                </div>

                                                <div className="financial-transaction-invoice">
                                                    <span>
                                                        INVOICE
                                                    </span>
                                                    <strong>
                                                        {
                                                            report.invoice_number
                                                        }
                                                    </strong>

                                                    {report.receipt_number && (
                                                        <small>
                                                            <i className="bi bi-check-circle"></i>
                                                            Kwitansi{" "}
                                                            {
                                                                report.receipt_number
                                                            }
                                                        </small>
                                                    )}
                                                </div>

                                                <div className="financial-transaction-header-meta">
                                                    {getStatusBadge(
                                                        report.status
                                                    )}

                                                    <div className="financial-transaction-date">
                                                        <span>
                                                            Tanggal
                                                            Transaksi
                                                        </span>
                                                        <strong>
                                                            {formatDate(
                                                                report.payment_date ||
                                                                report.created_at
                                                            )}
                                                        </strong>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ---------------------------------------------------------
                                                TRANSACTION BODY
                                            --------------------------------------------------------- */}
                                            <div className="financial-transaction-body">
                                                {/* ---------------------------------------------------------
                                                    PARTICIPANT INFORMATION
                                                --------------------------------------------------------- */}
                                                <div className="financial-transaction-participant-section">
                                                    <div className="financial-transaction-section-label">
                                                        <i className="bi bi-person"></i>
                                                        INFORMASI
                                                        PESERTA
                                                    </div>

                                                    <div className="financial-transaction-participant">
                                                        <div className="financial-transaction-avatar">
                                                            {getInitials(
                                                                report.full_name
                                                            )}
                                                        </div>

                                                        <div className="financial-transaction-participant-info">
                                                            <strong>
                                                                {
                                                                    report.full_name
                                                                }
                                                            </strong>
                                                            <span>
                                                                <i className="bi bi-envelope"></i>
                                                                {
                                                                    report.email
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="financial-transaction-detail-grid">
                                                        <div>
                                                            <span>
                                                                Program
                                                            </span>
                                                            <strong>
                                                                {
                                                                    report.program_name
                                                                }
                                                            </strong>
                                                        </div>

                                                        <div>
                                                            <span>
                                                                Jenis
                                                                Pembayaran
                                                            </span>
                                                            <strong>
                                                                {getInstallmentText(
                                                                    report
                                                                )}
                                                            </strong>
                                                        </div>

                                                        <div>
                                                            <span>
                                                                Metode
                                                                Pembayaran
                                                            </span>
                                                            <strong>
                                                                <i
                                                                    className={`bi ${getPaymentMethodIcon(
                                                                        report.payment_method
                                                                    )}`}
                                                                ></i>
                                                                {getPaymentMethodText(
                                                                    report.payment_method
                                                                )}
                                                            </strong>
                                                        </div>

                                                        <div>
                                                            <span>
                                                                Jatuh
                                                                Tempo
                                                            </span>
                                                            <strong>
                                                                {report.due_date
                                                                    ? formatDate(
                                                                        report.due_date
                                                                    )
                                                                    : "-"}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ---------------------------------------------------------
                                                    FINANCIAL INFORMATION
                                                --------------------------------------------------------- */}
                                                <div className="financial-transaction-payment-section">
                                                    <div className="financial-transaction-section-label">
                                                        <i className="bi bi-wallet2"></i>
                                                        RINGKASAN
                                                        PEMBAYARAN
                                                    </div>

                                                    <div className="financial-transaction-amount-grid">
                                                        <div className="financial-transaction-amount-card">
                                                            <span>
                                                                Total
                                                                Tagihan
                                                            </span>
                                                            <strong>
                                                                {formatCurrency(
                                                                    totalAmount
                                                                )}
                                                            </strong>
                                                            <small>
                                                                Nilai
                                                                keseluruhan
                                                                tagihan
                                                            </small>
                                                        </div>

                                                        <div className="financial-transaction-amount-card is-paid">
                                                            <span>
                                                                Sudah
                                                                Dibayar
                                                            </span>
                                                            <strong>
                                                                {formatCurrency(
                                                                    paidAmount
                                                                )}
                                                            </strong>
                                                            <small>
                                                                Pembayaran
                                                                diterima
                                                            </small>
                                                        </div>

                                                        <div className="financial-transaction-amount-card is-remaining">
                                                            <span>
                                                                Sisa
                                                                Tagihan
                                                            </span>
                                                            <strong>
                                                                {formatCurrency(
                                                                    remainingAmount
                                                                )}
                                                            </strong>
                                                            <small>
                                                                Belum
                                                                dibayarkan
                                                            </small>
                                                        </div>
                                                    </div>

                                                    {/* ---------------------------------------------------------
                                                        PAYMENT PROGRESS
                                                    --------------------------------------------------------- */}
                                                    <div className="financial-transaction-progress">
                                                        <div className="financial-transaction-progress-header">
                                                            <div>
                                                                <span>
                                                                    Progress
                                                                    Pembayaran
                                                                </span>
                                                                <strong>
                                                                    {
                                                                        progress
                                                                    }
                                                                    %
                                                                </strong>
                                                            </div>

                                                            <span>
                                                                {formatCurrency(
                                                                    paidAmount
                                                                )}{" "}
                                                                dari{" "}
                                                                {formatCurrency(
                                                                    totalAmount
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="financial-transaction-progress-track">
                                                            <div
                                                                className="financial-transaction-progress-bar"
                                                                style={{
                                                                    width: `${progress}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>

                        {/* ---------------------------------------------------------
                            REPORT FOOTER
                        --------------------------------------------------------- */}
                        <div className="financial-table-footer">
                            <div>
                                <i className="bi bi-database"></i>
                                <span>
                                    {
                                        detailedReports.length
                                    }{" "}
                                    transaksi ditampilkan
                                </span>
                            </div>

                            {hasActiveFilters && (
                                <span>
                                    <i className="bi bi-funnel"></i>
                                    Berdasarkan filter
                                    aktif
                                </span>
                            )}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

export default FinancialReports;
>>>>>>> perbaikan-website-fitalenta
