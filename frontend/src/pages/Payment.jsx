import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

/* =========================================================
   PAYMENT UTILITIES
========================================================= */
const paymentUtils = {
    formatCurrency: (value) => {
        if (!value && value !== 0) return "Rp 0";
        const numValue = parseFloat(value);
        return isNaN(numValue)
            ? "Rp 0"
            : `Rp ${Math.round(numValue).toLocaleString("id-ID")}`;
    },
    parseFloatSafe: (value, defaultValue = 0) => {
        if (value === null || value === undefined || value === "") {
            return defaultValue;
        }
        const numValue = parseFloat(value);
        return isNaN(numValue) ? defaultValue : Math.round(numValue * 100) / 100;
    },
    calculateRemainingSafe: (total, paid) => {
        const totalCents = Math.round(parseFloat(total || 0) * 100);
        const paidCents = Math.round(parseFloat(paid || 0) * 100);
        return Math.max(0, (totalCents - paidCents) / 100);
    },

    /* =========================================================
       STATUS BADGE
    ========================================================= */
    getStatusBadge: (status) => {
        const statusConfig = {
            pending: { class: "bg-warning", text: "Menunggu Pembayaran" },
            installment_1: { class: "bg-primary", text: "Cicilan 1" },
            installment_2: { class: "bg-primary", text: "Cicilan 2" },
            installment_3: { class: "bg-primary", text: "Cicilan 3" },
            installment_4: { class: "bg-primary", text: "Cicilan 4" },
            installment_5: { class: "bg-primary", text: "Cicilan 5" },
            installment_6: { class: "bg-primary", text: "Cicilan 6" },
            paid: { class: "bg-success", text: "Lunas" },
            overdue: { class: "bg-danger", text: "Jatuh Tempo" },
            cancelled: { class: "bg-secondary", text: "Dibatalkan" },
        };
        const config = statusConfig[status] || {
            class: "bg-secondary",
            text: status || "-",
        };
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    },

    /* =========================================================
       STATUS TEXT
    ========================================================= */
    getStatusText: (status) => {
        const statusTexts = {
            pending: "Menunggu Pembayaran",
            installment_1: "Cicilan 1",
            installment_2: "Cicilan 2",
            installment_3: "Cicilan 3",
            installment_4: "Cicilan 4",
            installment_5: "Cicilan 5",
            installment_6: "Cicilan 6",
            paid: "Lunas",
            overdue: "Terlambat",
            cancelled: "Dibatalkan",
        };
        return statusTexts[status] || status || "-";
    },

    /* =========================================================
       INSTALLMENT PLAN TEXT
    ========================================================= */
    getInstallmentPlanText: (plan) => {
        const installmentPlans = {
            none: "Bayar Penuh",
            "3_installments": "3 Cicilan",
            "4_installments": "4 Cicilan",
            "5_installments": "5 Cicilan",
            "6_installments": "6 Cicilan",
        };
        if (installmentPlans[plan]) return installmentPlans[plan];
        const numericPlan = parseInt(String(plan || "").split("_")[0], 10);
        if ([3, 4, 5, 6].includes(numericPlan)) {
            return `${numericPlan} Cicilan`;
        }
        return "-";
    },

    /* =========================================================
       TOTAL INSTALLMENTS
    ========================================================= */
    getTotalInstallments: (payment) => {
        if (!payment) return 4;
        const plan = String(payment.program_installment_plan || "");
        if (!plan) return 4;
        if (plan === "none") return 1;
        const match = plan.match(/^([3-6])_installments$/);
        if (match) return Number(match[1]);
        const parsed = parseInt(plan.split("_")[0], 10);
        if ([3, 4, 5, 6].includes(parsed)) return parsed;
        return 4;
    },

    /* =========================================================
       CURRENT INSTALLMENT TEXT
    ========================================================= */
    getInstallmentText: (payment) => {
        if (!payment || !payment.status) return "Unknown";
        if (payment.status === "paid") return "Lunas";
        const totalInstallments = paymentUtils.getTotalInstallments(payment);
        if (payment.status === "pending") {
            return totalInstallments === 1
                ? "Pembayaran Penuh"
                : "Menunggu Pembayaran";
        }
        if (payment.status.startsWith("installment_")) {
            const installmentNum = payment.status.split("_")[1];
            return `Cicilan ${installmentNum}`;
        }
        return payment.status;
    },

    /* =========================================================
       CURRENT INSTALLMENT INFO
    ========================================================= */
    getCurrentInstallmentInfo: (payment) => {
        if (!payment) {
            return {
                number: 0,
                text: "Unknown",
                isPaid: false,
                totalInstallments: 4,
                isWaitingVerification: false,
            };
        }
        const totalInstallments = paymentUtils.getTotalInstallments(payment);
        const isWaitingVerification = paymentUtils.isWaitingVerification(payment);
        if (payment.status === "paid") {
            return {
                number: totalInstallments,
                text: "Lunas",
                isPaid: true,
                totalInstallments,
                isWaitingVerification: false,
            };
        }
        if (payment.status === "pending") {
            return {
                number: 1,
                text:
                    totalInstallments === 1
                        ? "Pembayaran Penuh"
                        : "Menunggu Cicilan 1",
                isPaid: false,
                totalInstallments,
                isWaitingVerification,
            };
        }
        if (payment.status.startsWith("installment_")) {
            const currentNum = parseInt(payment.status.split("_")[1], 10) || 1;
            const isPaid = paymentUtils.isInstallmentPaid(payment, currentNum);
            let text =
                totalInstallments === 1
                    ? "Pembayaran Penuh"
                    : `Cicilan ${currentNum}`;
            if (isWaitingVerification) {
                text += " (Menunggu Verifikasi)";
            } else if (isPaid) {
                text += " (Sudah Dibayar)";
            }
            return {
                number: currentNum,
                text,
                isPaid,
                totalInstallments,
                isWaitingVerification,
            };
        }
        return {
            number: 0,
            text: payment.status,
            isPaid: false,
            totalInstallments,
            isWaitingVerification,
        };
    },

    /* =========================================================
       NEXT INSTALLMENT INFO
    ========================================================= */
    getNextInstallmentInfo: (payment) => {
        if (!payment) {
            return {
                number: 0,
                text: "Unknown",
                exists: false,
                totalInstallments: 4,
            };
        }
        const currentInfo = paymentUtils.getCurrentInstallmentInfo(payment);
        const totalInstallments = currentInfo.totalInstallments;
        if (
            totalInstallments === 1 ||
            currentInfo.number >= totalInstallments ||
            payment.status === "paid"
        ) {
            return {
                number: null,
                text: "Lunas",
                exists: false,
                totalInstallments,
            };
        }
        const nextNumber = currentInfo.number + 1;
        return {
            number: nextNumber,
            text: `Cicilan ${nextNumber}`,
            exists: true,
            totalInstallments,
        };
    },

    /* =========================================================
       INSTALLMENT PAID
    ========================================================= */
    isInstallmentPaid: (payment, installmentNumber) => {
        if (!payment || !installmentNumber) return false;
        if (payment.status === "paid") return true;
        const totalInstallments = paymentUtils.getTotalInstallments(payment);
        const totalAmount = paymentUtils.parseFloatSafe(
            payment.program_training_cost
        );
        const paidAmount = paymentUtils.parseFloatSafe(payment.amount_paid);
        if (totalAmount > 0 && paidAmount >= totalAmount) return true;
        if (totalInstallments <= 0 || totalAmount <= 0) return false;
        const installmentAmount = totalAmount / totalInstallments;
        const expectedPaid = installmentAmount * installmentNumber;
        return paidAmount + 0.01 >= expectedPaid;
    },

    /* =========================================================
       CURRENT INSTALLMENT AMOUNT
    ========================================================= */
    getCurrentInstallmentAmount: (payment) => {
        if (!payment) return 0;
        const totalAmount = paymentUtils.parseFloatSafe(
            payment.program_training_cost
        );
        const totalInstallments = paymentUtils.getTotalInstallments(payment);
        const paidAmount = paymentUtils.parseFloatSafe(payment.amount_paid);
        if (totalInstallments === 1) {
            return Math.max(0, totalAmount - paidAmount);
        }
        if (!payment.due_date && payment.status !== "pending") {
            return 0;
        }
        if (payment.installment_amounts) {
            try {
                const installmentAmounts =
                    typeof payment.installment_amounts === "string"
                        ? JSON.parse(payment.installment_amounts)
                        : payment.installment_amounts;
                const currentInfo =
                    paymentUtils.getCurrentInstallmentInfo(payment);
                const currentInstallment = currentInfo.number;
                if (currentInstallment > 0) {
                    const installmentKey = `installment_${currentInstallment}`;
                    if (installmentAmounts[installmentKey]?.amount) {
                        return parseFloat(installmentAmounts[installmentKey].amount);
                    }
                }
                for (let i = 1; i <= totalInstallments; i++) {
                    const key = `installment_${i}`;
                    if (installmentAmounts[key]?.amount) {
                        return parseFloat(installmentAmounts[key].amount);
                    }
                }
            } catch (error) {
                console.error("❌ Error parsing installment_amounts:", error);
            }
        }
        return totalInstallments > 0
            ? Math.round(totalAmount / totalInstallments)
            : 0;
    },

    /* =========================================================
       OVERDUE
    ========================================================= */
    isOverdue: (payment) => {
        if (!payment?.due_date || payment.status === "paid") return false;
        try {
            const dueDate = new Date(payment.due_date);
            dueDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return dueDate < today;
        } catch (error) {
            console.error("Error checking overdue:", error);
            return false;
        }
    },

    /* =========================================================
       DUE SOON
    ========================================================= */
    isDueSoon: (payment) => {
        if (!payment?.due_date || payment.status === "paid") return false;
        try {
            const dueDate = new Date(payment.due_date);
            dueDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const threeDaysFromNow = new Date(today);
            threeDaysFromNow.setDate(today.getDate() + 3);
            return dueDate >= today && dueDate <= threeDaysFromNow;
        } catch (error) {
            console.error("Error checking due soon:", error);
            return false;
        }
    },

    /* =========================================================
       WAITING VERIFICATION
    ========================================================= */
    isWaitingVerification: (payment) => {
        if (!payment) return false;
        if (payment.status === "paid" || payment.status === "cancelled") {
            return false;
        }
        const hasProof = !!payment.proof_image;
        const notVerified = !payment.verified_by;
        return hasProof && notVerified;
    },

    /* =========================================================
       NEEDS UPLOAD
    ========================================================= */
    needsUpload: (payment) => {
        if (!payment) return false;
        const currentInfo = paymentUtils.getCurrentInstallmentInfo(payment);
        const hasDueDate = !!payment.due_date;
        const noProof = !payment.proof_image;
        const notVerified = !payment.verified_by;
        const notPaid =
            payment.status !== "paid" && payment.status !== "cancelled";
        const currentNotPaid = !currentInfo.isPaid;
        return (
            hasDueDate &&
            noProof &&
            notVerified &&
            notPaid &&
            currentNotPaid
        );
    },

    /* =========================================================
       ACTIVE INVOICE
    ========================================================= */
    hasActiveInvoice: (payment) => {
        if (!payment) return false;
        const hasDueDate = !!payment.due_date;
        const isNotPaid =
            payment.status !== "paid" && payment.status !== "cancelled";
        const hasRemaining =
            paymentUtils.parseFloatSafe(payment.amount_paid || 0) <
            paymentUtils.parseFloatSafe(payment.program_training_cost || 0);
        const notWaitingVerification =
            !paymentUtils.isWaitingVerification(payment);
        return (
            hasDueDate &&
            isNotPaid &&
            hasRemaining &&
            notWaitingVerification
        );
    },

    /* =========================================================
       WAITING FOR INVOICE
    ========================================================= */
    isWaitingForInvoice: (payment) => {
        if (!payment) return false;
        const hasRemaining =
            paymentUtils.parseFloatSafe(payment.amount_paid || 0) <
            paymentUtils.parseFloatSafe(payment.program_training_cost || 0);
        const currentInfo =
            paymentUtils.getCurrentInstallmentInfo(payment);
        const nextInfo =
            paymentUtils.getNextInstallmentInfo(payment);
        return (
            !payment.due_date &&
            hasRemaining &&
            payment.status !== "paid" &&
            payment.status !== "cancelled" &&
            currentInfo.isPaid &&
            nextInfo.exists &&
            !paymentUtils.isWaitingVerification(payment)
        );
    },

    /* =========================================================
       INSTALLMENT INFO
    ========================================================= */
    getInstallmentInfo: (payment) => {
        if (!payment) {
            return {
                currentInstallment: 0,
                totalInstallments: 4,
                totalAmount: 0,
                paidAmount: 0,
                remainingAmount: 0,
                progressPercentage: 0,
            };
        }
        const totalAmount = paymentUtils.parseFloatSafe(
            payment.program_training_cost || 0
        );
        const paidAmount = paymentUtils.parseFloatSafe(
            payment.amount_paid || 0
        );
        const remainingAmount = Math.max(0, totalAmount - paidAmount);
        const currentInfo =
            paymentUtils.getCurrentInstallmentInfo(payment);
        return {
            currentInstallment: currentInfo.number,
            totalInstallments: currentInfo.totalInstallments,
            totalAmount,
            paidAmount,
            remainingAmount,
            progressPercentage:
                totalAmount > 0
                    ? Math.min(100, (paidAmount / totalAmount) * 100)
                    : 0,
        };
    },

    /* =========================================================
       VALIDATE PAYMENT
    ========================================================= */
    validatePayment: (payment) => {
        if (!payment) {
            return {
                isValid: false,
                error: "Payment data is null",
            };
        }
        if (!payment.id) {
            return {
                isValid: false,
                error: "Payment ID is missing",
            };
        }
        if (!payment.invoice_number) {
            return {
                isValid: false,
                error: "Invoice number is missing",
            };
        }
        return {
            isValid: true,
            error: null,
        };
    },

    /* =========================================================
       IMAGE URL
    ========================================================= */
    getImageUrl: (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return `http://localhost:5000${path}`;
    },
};

/* =========================================================
   PAYMENT COMPONENT
========================================================= */
const Payment = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [message, setMessage] = useState({
        type: "",
        text: "",
    });
    const [paymentAlerts, setPaymentAlerts] = useState([]);

    /* =========================================================
       FORMAT DATE
    ========================================================= */
    const formatDate = useCallback((dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "-";
        }
    }, []);

    /* =========================================================
       PAYMENT PROGRESS
    ========================================================= */
    const safeCalculateProgress = useCallback((payment) => {
        if (!payment) return 0;
        const totalAmount =
            paymentUtils.parseFloatSafe(payment?.program_training_cost) || 0;
        const amountPaid =
            paymentUtils.parseFloatSafe(payment?.amount_paid) || 0;
        if (totalAmount <= 0) return 0;
        return Math.min(100, (amountPaid / totalAmount) * 100);
    }, []);

    /* =========================================================
       REMAINING PAYMENT
    ========================================================= */
    const safeCalculateRemaining = useCallback((payment) => {
        if (!payment) return 0;
        const totalAmount =
            paymentUtils.parseFloatSafe(payment?.program_training_cost) || 0;
        const amountPaid =
            paymentUtils.parseFloatSafe(payment?.amount_paid) || 0;
        return paymentUtils.calculateRemainingSafe(totalAmount, amountPaid);
    }, []);

    /* =========================================================
       DISPLAY AMOUNT
    ========================================================= */
    const getDisplayAmount = useCallback((payment) => {
        if (!payment) return 0;
        return paymentUtils.getCurrentInstallmentAmount(payment);
    }, []);

    /* =========================================================
       GENERATE PAYMENT ALERTS
    ========================================================= */
    const generatePaymentAlerts = useCallback(
        (paymentsData) => {
            if (!paymentsData || paymentsData.length === 0) return [];
            const alerts = [];
            paymentsData.forEach((payment) => {
                const validation = paymentUtils.validatePayment(payment);
                if (!validation.isValid) {
                    console.warn("Invalid payment data:", validation.error);
                    return;
                }
                const currentInfo =
                    paymentUtils.getCurrentInstallmentInfo(payment);
                const nextInfo =
                    paymentUtils.getNextInstallmentInfo(payment);
                const hasActiveInvoice =
                    paymentUtils.hasActiveInvoice(payment);
                const isWaitingForInvoice =
                    paymentUtils.isWaitingForInvoice(payment);
                const isWaitingVerification =
                    paymentUtils.isWaitingVerification(payment);
                const currentAmount = getDisplayAmount(payment);
                if (
                    hasActiveInvoice &&
                    paymentUtils.isOverdue(payment) &&
                    !isWaitingVerification
                ) {
                    alerts.push({
                        type: "danger",
                        title: "Pembayaran Terlambat!",
                        message: `Tagihan ${payment.invoice_number} (${currentInfo.text}) sudah melewati batas waktu. Segera lakukan pembayaran.`,
                        paymentId: payment.id,
                        invoiceNumber: payment.invoice_number,
                        dueDate: payment.due_date,
                        amount: currentAmount,
                        installmentText: currentInfo.text,
                        icon: "bi-exclamation-triangle",
                        action: "upload",
                    });
                } else if (
                    hasActiveInvoice &&
                    paymentUtils.isDueSoon(payment) &&
                    !isWaitingVerification
                ) {
                    alerts.push({
                        type: "warning",
                        title: "Akan Jatuh Tempo",
                        message: `Tagihan ${payment.invoice_number} (${currentInfo.text}) akan jatuh tempo pada ${formatDate(payment.due_date)}.`,
                        paymentId: payment.id,
                        invoiceNumber: payment.invoice_number,
                        dueDate: payment.due_date,
                        amount: currentAmount,
                        installmentText: currentInfo.text,
                        icon: "bi-clock",
                        action: "upload",
                    });
                }
                if (isWaitingVerification) {
                    alerts.push({
                        type: "secondary",
                        title: "Menunggu Verifikasi Admin",
                        message: `Bukti pembayaran untuk ${payment.invoice_number} (${currentInfo.text}) sedang diverifikasi. Biasanya membutuhkan 1-2 hari kerja.`,
                        paymentId: payment.id,
                        invoiceNumber: payment.invoice_number,
                        installmentText: currentInfo.text,
                        icon: "bi-hourglass-split",
                        action: "view_proof",
                    });
                } else if (
                    hasActiveInvoice &&
                    paymentUtils.needsUpload(payment)
                ) {
                    alerts.push({
                        type: "primary",
                        title: "Upload Bukti Pembayaran",
                        message: `Silakan upload bukti pembayaran untuk ${currentInfo.text} sebesar ${paymentUtils.formatCurrency(currentAmount)}.`,
                        paymentId: payment.id,
                        invoiceNumber: payment.invoice_number,
                        dueDate: payment.due_date,
                        amount: currentAmount,
                        installmentText: currentInfo.text,
                        action: "upload",
                        icon: "bi-upload",
                    });
                } else if (
                    isWaitingForInvoice &&
                    nextInfo.exists
                ) {
                    alerts.push({
                        type: "info",
                        title: "Menunggu Tagihan Berikutnya",
                        message: `Pembayaran ${currentInfo.text} sudah diverifikasi. Admin akan menerbitkan tagihan ${nextInfo.text} untuk program ${payment.program_name}.`,
                        paymentId: payment.id,
                        invoiceNumber: payment.invoice_number,
                        installmentText: nextInfo.text,
                        icon: "bi-clock-history",
                    });
                } else if (
                    !payment.due_date &&
                    payment.status === "pending" &&
                    !isWaitingVerification
                ) {
                    const totalInstallments =
                        paymentUtils.getTotalInstallments(payment);
                    alerts.push({
                        type: "info",
                        title:
                            totalInstallments === 1
                                ? "Menunggu Tagihan Pembayaran"
                                : "Menunggu Tagihan Pertama",
                        message:
                            totalInstallments === 1
                                ? `Admin akan menerbitkan tagihan pembayaran untuk program ${payment.program_name}. Silakan tunggu pemberitahuan selanjutnya.`
                                : `Admin akan menerbitkan tagihan cicilan pertama untuk program ${payment.program_name}. Silakan tunggu pemberitahuan selanjutnya.`,
                        paymentId: payment.id,
                        invoiceNumber: payment.invoice_number,
                        installmentText:
                            totalInstallments === 1
                                ? "Bayar Penuh"
                                : "Cicilan 1",
                        icon: "bi-info-circle",
                    });
                } else if (payment.status === "paid") {
                    alerts.push({
                        type: "success",
                        title: "Pembayaran Lunas",
                        message: `Selamat! Pembayaran untuk ${payment.program_name} sudah lunas.`,
                        paymentId: payment.id,
                        invoiceNumber: payment.invoice_number,
                        icon: "bi-check-circle",
                    });
                } else if (
                    hasActiveInvoice &&
                    !isWaitingVerification
                ) {
                    alerts.push({
                        type: "info",
                        title: "Tagihan Aktif",
                        message: `Tagihan ${currentInfo.text} sebesar ${paymentUtils.formatCurrency(currentAmount)}.`,
                        paymentId: payment.id,
                        invoiceNumber: payment.invoice_number,
                        dueDate: payment.due_date,
                        amount: currentAmount,
                        installmentText: currentInfo.text,
                        action: "upload",
                        icon: "bi-receipt",
                    });
                }
            });
            return alerts.sort((a, b) => {
                const priority = {
                    secondary: 0,
                    danger: 1,
                    warning: 2,
                    primary: 3,
                    info: 4,
                    success: 5,
                };
                return priority[a.type] - priority[b.type];
            });
        },
        [formatDate, getDisplayAmount]
    );

    /* =========================================================
       FETCH PAYMENTS
    ========================================================= */
    const fetchPayments = useCallback(async () => {
        if (!user?.id) {
            console.warn("User ID not available");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setMessage({
                type: "",
                text: "",
            });
            const response = await axios.get(
                `/api/payments/user/${user.id}`,
                {
                    timeout: 10000,
                }
            );
            if (response.data?.success) {
                const paymentsData =
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : [];
                setPayments(paymentsData);
                setPaymentAlerts(
                    generatePaymentAlerts(paymentsData)
                );
            } else {
                throw new Error(
                    response.data?.message ||
                    "Format response tidak valid"
                );
            }
        } catch (error) {
            console.error("❌ Error fetching payments:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Gagal memuat data pembayaran";
            setMessage({
                type: "error",
                text: errorMessage,
            });
            setPayments([]);
            setPaymentAlerts([]);
        } finally {
            setLoading(false);
        }
    }, [user, generatePaymentAlerts]);

    /* =========================================================
       INITIAL FETCH
    ========================================================= */
    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    /* =========================================================
       PREVIEW CLEANUP
    ========================================================= */
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    /* =========================================================
       FILE SELECT
    ========================================================= */
    const handleFileSelect = (event) => {
        const selectedFile =
            event.target.files[0];
        if (!selectedFile) return;
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
        ];
        if (!allowedTypes.includes(selectedFile.type)) {
            setMessage({
                type: "error",
                text: "Hanya file gambar (JPG, PNG, GIF) yang diizinkan",
            });
            event.target.value = "";
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            setMessage({
                type: "error",
                text: "Ukuran file maksimal 5MB",
            });
            event.target.value = "";
            return;
        }
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setFile(selectedFile);
        setMessage({
            type: "",
            text: "",
        });
        const url =
            URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
    };

    /* =========================================================
       CLOSE UPLOAD MODAL
    ========================================================= */
    const handleCloseUploadModal = () => {
        setShowUploadModal(false);
        setSelectedPayment(null);
        setFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setMessage({
            type: "",
            text: "",
        });
    };

    /* =========================================================
       UPLOAD PAYMENT PROOF
    ========================================================= */
    const handleUploadProof = async () => {
        if (!file || !selectedPayment) {
            setMessage({
                type: "error",
                text: "Pilih file bukti pembayaran terlebih dahulu",
            });
            return;
        }
        const validation =
            paymentUtils.validatePayment(
                selectedPayment
            );
        if (!validation.isValid) {
            setMessage({
                type: "error",
                text:
                    "Data pembayaran tidak valid: " +
                    validation.error,
            });
            return;
        }
        setUploading(true);
        setMessage({
            type: "",
            text: "",
        });
        try {
            const formData = new FormData();
            formData.append("proof_image", file);
            const response = await axios.post(
                `/api/payments/${selectedPayment.id}/upload-proof`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 30000,
                }
            );
            if (response.data?.success) {
                setMessage({
                    type: "success",
                    text: "✅ Bukti pembayaran berhasil diupload! Status sekarang: Menunggu Verifikasi Admin. Admin akan memverifikasi dalam 1-2 hari kerja.",
                });
                handleCloseUploadModal();
                setTimeout(() => {
                    fetchPayments();
                }, 2000);
            } else {
                throw new Error(
                    response.data?.message ||
                    "Upload gagal"
                );
            }
        } catch (error) {
            console.error(
                "❌ Error uploading proof:",
                error
            );
            setMessage({
                type: "error",
                text:
                    error.response?.data?.message ||
                    error.message ||
                    "Gagal upload bukti pembayaran",
            });
        } finally {
            setUploading(false);
        }
    };

    /* =========================================================
       PAYMENT ACTION PERMISSIONS
    ========================================================= */
    const canUploadProof = (payment) => {
        if (!payment) return false;
        return paymentUtils.needsUpload(payment);
    };
    const canDownloadReceipt = (payment) => {
        if (!payment) return false;
        return (
            payment.verified_by &&
            payment.status !== "pending" &&
            payment.status !== "cancelled"
        );
    };

    /* =========================================================
       DOWNLOAD RECEIPT
    ========================================================= */
    const downloadReceipt = async (payment) => {
        const validation =
            paymentUtils.validatePayment(payment);
        if (!validation.isValid) {
            setMessage({
                type: "error",
                text:
                    "Data pembayaran tidak valid: " +
                    validation.error,
            });
            return;
        }
        try {
            try {
                const response = await axios.get(
                    `/api/payments/${payment.id}/receipt`,
                    {
                        responseType: "blob",
                        timeout: 15000,
                    }
                );
                const url =
                    window.URL.createObjectURL(
                        new Blob([response.data])
                    );
                const link =
                    document.createElement("a");
                link.href = url;
                link.setAttribute(
                    "download",
                    `kwitansi-${
                        payment.receipt_number ||
                        payment.invoice_number
                    }.pdf`
                );
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                setMessage({
                    type: "success",
                    text: "Kwitansi PDF berhasil diunduh",
                });
                return;
            } catch (pdfError) {
                console.log(
                    "PDF receipt not available, generating HTML receipt...",
                    pdfError
                );
            }
            const receiptWindow =
                window.open("", "_blank");
            if (!receiptWindow) {
                setMessage({
                    type: "error",
                    text: "Popup diblokir. Izinkan popup untuk generate kwitansi.",
                });
                return;
            }
            const receiptDate =
                payment.payment_date
                    ? new Date(
                        payment.payment_date
                    ).toLocaleDateString("id-ID")
                    : new Date().toLocaleDateString(
                        "id-ID"
                    );
            const totalAmount =
                paymentUtils.parseFloatSafe(
                    payment.program_training_cost || 0
                );
            const amountPaid =
                paymentUtils.parseFloatSafe(
                    payment.amount_paid || 0
                );
            const remaining =
                paymentUtils.calculateRemainingSafe(
                    totalAmount,
                    amountPaid
                );
            const currentInstallmentAmount =
                getDisplayAmount(payment);
            const installmentText =
                paymentUtils.getInstallmentText(
                    payment
                );
            const installmentPlanText =
                paymentUtils.getInstallmentPlanText(
                    payment.program_installment_plan
                );
            receiptWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>KWITANSI - ${payment.receipt_number || payment.invoice_number}</title>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              position: relative;
            }
            .receipt-header {
              background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            .receipt-title {
              font-size: 2.5em;
              font-weight: 700;
              margin-bottom: 10px;
              letter-spacing: 2px;
              position: relative;
              z-index: 1;
            }
            .receipt-subtitle {
              font-size: 1.2em;
              font-weight: 300;
              opacity: 0.9;
              position: relative;
              z-index: 1;
            }
            .company-info {
              background: #f8f9fa;
              padding: 25px 30px;
              border-bottom: 1px solid #e9ecef;
              text-align: center;
            }
            .company-name {
              font-size: 1.4em;
              font-weight: 700;
              color: #2c3e50;
              margin-bottom: 5px;
            }
            .company-address {
              color: #6c757d;
              line-height: 1.5;
            }
            .receipt-content {
              padding: 40px 30px;
            }
            .receipt-info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
              background: #f8f9fa;
              padding: 25px;
              border-radius: 15px;
              border: 1px solid #e9ecef;
            }
            .info-item {
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
            .info-label {
              font-size: 0.85em;
              color: #6c757d;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-value {
              font-size: 1.1em;
              font-weight: 600;
              color: #2c3e50;
            }
            .installment-highlight {
              background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
              border: 2px solid #ffd43b;
              border-radius: 15px;
              padding: 25px;
              margin: 30px 0;
              text-align: center;
            }
            .installment-text {
              font-size: 1.1em;
              color: #856404;
              font-weight: 500;
              margin-bottom: 10px;
            }
            .installment-amount {
              font-size: 1.8em;
              font-weight: 700;
              color: #e67700;
            }
            .section {
              margin-bottom: 35px;
            }
            .section-title {
              font-size: 1.1em;
              font-weight: 600;
              color: #007bff;
              padding: 12px 20px;
              background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
              border-radius: 10px;
              margin-bottom: 20px;
              border-left: 4px solid #007bff;
            }
            .data-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .data-item {
              display: flex;
              flex-direction: column;
              gap: 5px;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 10px;
              border: 1px solid #e9ecef;
            }
            .progress-container {
              background: #f8f9fa;
              padding: 25px;
              border-radius: 15px;
              border: 1px solid #e9ecef;
            }
            .progress-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
              font-weight: 600;
              color: #2c3e50;
            }
            .progress-bar-container {
              height: 12px;
              background: #e9ecef;
              border-radius: 10px;
              overflow: hidden;
              margin: 15px 0;
            }
            .progress-bar {
              height: 100%;
              background: linear-gradient(90deg, #28a745, #20c997);
              border-radius: 10px;
            }
            .progress-text {
              text-align: center;
              font-weight: 600;
              color: #495057;
              font-size: 1.1em;
            }
            .payment-table {
              width: 100%;
              border-collapse: collapse;
              background: white;
              border-radius: 15px;
              overflow: hidden;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            }
            .payment-table th {
              background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
              color: white;
              padding: 18px 15px;
              text-align: left;
              font-weight: 600;
            }
            .payment-table td {
              padding: 18px 15px;
              border-bottom: 1px solid #e9ecef;
              font-weight: 500;
            }
            .payment-table .amount {
              text-align: right;
              font-weight: 600;
            }
            .payment-table .total-row {
              background: #f8f9fa;
              font-weight: 700;
              font-size: 1.1em;
            }
            .status-badge {
              display: inline-block;
              padding: 8px 20px;
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
              color: white;
              border-radius: 25px;
              font-weight: 600;
              font-size: 1.1em;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .signature-area {
              margin-top: 50px;
              text-align: right;
              padding: 30px;
              background: #f8f9fa;
              border-radius: 15px;
              border: 1px solid #e9ecef;
            }
            .signature-line {
              width: 300px;
              height: 1px;
              background: #6c757d;
              margin: 60px 0 10px auto;
            }
            .footer {
              background: #2c3e50;
              color: white;
              padding: 30px;
              text-align: center;
              margin-top: 40px;
            }
            .footer-text {
              font-size: 0.9em;
              opacity: 0.8;
              line-height: 1.6;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 8em;
              font-weight: 900;
              color: rgba(0, 123, 255, 0.03);
              pointer-events: none;
              z-index: 0;
              white-space: nowrap;
            }
            @media print {
              body {
                background: white !important;
                padding: 0 !important;
              }
              .receipt-container {
                box-shadow: none !important;
                margin: 0 !important;
                max-width: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="watermark">FITALENTA</div>
            <div class="receipt-header">
              <h1 class="receipt-title">KWITANSI RESMI</h1>
              <p class="receipt-subtitle">Program Magang Perusahaan</p>
            </div>
            <div class="company-info">
              <div class="company-name">FITALENTA</div>
              <div class="company-address">
                Jl. Ganesha No.15E, Lb. Siliwangi, Kec. Coblong Bandung 40132<br>
                Telp: (021) 123-4567 | Email: admin@fitalenta.com
              </div>
            </div>
            <div class="receipt-content">
              <div class="receipt-info-grid">
                <div class="info-item">
                  <span class="info-label">No. Kwitansi</span>
                  <span class="info-value">${payment.receipt_number || payment.invoice_number}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">No. Invoice</span>
                  <span class="info-value">${payment.invoice_number}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Tanggal Kwitansi</span>
                  <span class="info-value">${receiptDate}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Status Pembayaran</span>
                  <span class="info-value">${paymentUtils.getStatusText(payment.status)}</span>
                </div>
              </div>
              <div class="installment-highlight">
                <div class="installment-text">${installmentText}</div>
                <div class="installment-amount">${paymentUtils.formatCurrency(currentInstallmentAmount)}</div>
              </div>
              <div class="section">
                <div class="section-title">DATA PESERTA</div>
                <div class="data-grid">
                  <div class="data-item">
                    <span class="info-label">Nama Lengkap</span>
                    <span class="info-value">${user?.full_name || "N/A"}</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${user?.email || "N/A"}</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Nomor Telepon</span>
                    <span class="info-value">${user?.phone || "N/A"}</span>
                  </div>
                </div>
              </div>
              <div class="section">
                <div class="section-title">DETAIL PROGRAM</div>
                <div class="data-grid">
                  <div class="data-item">
                    <span class="info-label">Program Magang</span>
                    <span class="info-value">${payment.program_name || "N/A"}</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Durasi Program</span>
                    <span class="info-value">${payment.program_duration || "N/A"}</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Total Biaya Program</span>
                    <span class="info-value">${paymentUtils.formatCurrency(totalAmount)}</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Plan Cicilan</span>
                    <span class="info-value">${installmentPlanText}</span>
                  </div>
                </div>
              </div>
              <div class="section">
                <div class="section-title">PROGRESS PEMBAYARAN</div>
                <div class="progress-container">
                  <div class="progress-header">
                    <span>Progress Pembayaran</span>
                    <span>${safeCalculateProgress(payment).toFixed(1)}%</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${safeCalculateProgress(payment)}%"></div>
                  </div>
                  <div class="progress-text">
                    ${paymentUtils.formatCurrency(amountPaid)} / ${paymentUtils.formatCurrency(totalAmount)}
                  </div>
                </div>
              </div>
              <div class="section">
                <div class="section-title">RINCIAN PEMBAYARAN</div>
                <table class="payment-table">
                  <thead>
                    <tr>
                      <th>Keterangan</th>
                      <th style="text-align: right;">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Biaya Program ${payment.program_name || ""}</td>
                      <td class="amount">${paymentUtils.formatCurrency(totalAmount)}</td>
                    </tr>
                    <tr class="total-row">
                      <td>TOTAL TAGIHAN</td>
                      <td class="amount">${paymentUtils.formatCurrency(totalAmount)}</td>
                    </tr>
                    <tr class="total-row">
                      <td>SUDAH DIBAYAR</td>
                      <td class="amount">${paymentUtils.formatCurrency(amountPaid)}</td>
                    </tr>
                    ${
                remaining > 0
                    ? `
                    <tr class="total-row">
                      <td>SISA TAGIHAN</td>
                      <td class="amount">${paymentUtils.formatCurrency(remaining)}</td>
                    </tr>
                    `
                    : ""
            }
                  </tbody>
                </table>
              </div>
              <div style="text-align: center; margin: 40px 0;">
                <div class="status-badge">
                  ${payment.status === "paid" ? "LUNAS" : paymentUtils.getInstallmentText(payment).toUpperCase()}
                </div>
              </div>
              ${
                payment.status === "paid"
                    ? `
              <div class="section">
                <div class="section-title">KONFIRMASI PEMBAYARAN</div>
                <div class="data-grid">
                  <div class="data-item">
                    <span class="info-label">Status</span>
                    <span class="info-value" style="color: #28a745; font-weight: 700;">LUNAS</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Tanggal Pembayaran</span>
                    <span class="info-value">${receiptDate}</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Metode Pembayaran</span>
                    <span class="info-value">${payment.payment_method || "Transfer Bank"}</span>
                  </div>
                  ${
                        payment.bank_name
                            ? `
                  <div class="data-item">
                    <span class="info-label">Bank</span>
                    <span class="info-value">${payment.bank_name}</span>
                  </div>
                  `
                            : ""
                    }
                </div>
              </div>
              `
                    : ""
            }
              <div class="signature-area">
                <p>Bandung, ${receiptDate}</p>
                <div class="signature-line"></div>
                <p style="font-weight: 700; margin-top: 10px;">Admin FITALENTA</p>
              </div>
            </div>
            <div class="footer">
              <p class="footer-text">
                ** Kwitansi ini sah dan dapat digunakan sebagai bukti pembayaran yang valid **<br>
                Terima kasih telah mempercayai program magang kami<br>
                Generated on: ${new Date().toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </body>
        </html>
      `);
            receiptWindow.document.close();
            setTimeout(() => {
                receiptWindow.print();
            }, 1000);
        } catch (error) {
            console.error(
                "❌ Error generating receipt:",
                error
            );
            setMessage({
                type: "error",
                text:
                    "Gagal mengunduh kwitansi: " +
                    (error.message || "Unknown error"),
            });
        }
    };

    /* =========================================================
       MODAL ACTIONS
    ========================================================= */
    const handleShowDetail = (payment) => {
        const validation =
            paymentUtils.validatePayment(payment);
        if (!validation.isValid) {
            setMessage({
                type: "error",
                text:
                    "Data pembayaran tidak valid: " +
                    validation.error,
            });
            return;
        }
        setSelectedPayment(payment);
        setShowDetailModal(true);
    };
    const handleCloseDetail = () => {
        setShowDetailModal(false);
        setSelectedPayment(null);
    };
    const handleShowProof = (payment) => {
        setSelectedPayment(payment);
        setShowProofModal(true);
    };
    const handleCloseProofModal = () => {
        setShowProofModal(false);
        setSelectedPayment(null);
    };
    const handleAlertAction = (alert) => {
        const payment = payments.find(
            (item) => item.id === alert.paymentId
        );
        if (!payment) {
            setMessage({
                type: "error",
                text: "Data pembayaran tidak ditemukan",
            });
            return;
        }
        if (alert.action === "upload") {
            setSelectedPayment(payment);
            setShowUploadModal(true);
        } else if (
            alert.action === "view_proof" &&
            payment.proof_image
        ) {
            handleShowProof(payment);
        }
    };
    const dismissAlert = (index) => {
        setPaymentAlerts((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };
    const dismissAllAlerts = () => {
        setPaymentAlerts([]);
    };

    /* =========================================================
       LOADING STATE
    ========================================================= */
    if (loading) {
        return (
            <div className="payment-page">
                <div className="payment-shell">
                    <div className="payment-loading-state">
                        <div className="payment-loading-icon">
                            <div
                                className="spinner-border"
                                role="status"
                            >
                <span className="visually-hidden">
                  Loading...
                </span>
                            </div>
                        </div>
                        <strong>
                            Memuat data pembayaran
                        </strong>
                        <span>
              Mohon tunggu sebentar, kami sedang menyiapkan informasi pembayaran Anda.
            </span>
                    </div>
                </div>
            </div>
        );
    }

    /* =========================================================
       ALERT SUMMARY
    ========================================================= */
    const alertCounts = {
        danger: paymentAlerts.filter(
            (alert) => alert.type === "danger"
        ).length,
        warning: paymentAlerts.filter(
            (alert) => alert.type === "warning"
        ).length,
        primary: paymentAlerts.filter(
            (alert) => alert.type === "primary"
        ).length,
        secondary: paymentAlerts.filter(
            (alert) => alert.type === "secondary"
        ).length,
        info: paymentAlerts.filter(
            (alert) => alert.type === "info"
        ).length,
        success: paymentAlerts.filter(
            (alert) => alert.type === "success"
        ).length,
    };

    /* =========================================================
       PAYMENT TABLE ROW
    ========================================================= */
    const renderPaymentRow = (payment) => {
        const progress =
            safeCalculateProgress(payment);
        const isPaymentOverdue =
            paymentUtils.isOverdue(payment);
        const hasActiveInvoice =
            paymentUtils.hasActiveInvoice(payment);
        const isWaitingForInvoice =
            paymentUtils.isWaitingForInvoice(payment);
        const isWaitingVerification =
            paymentUtils.isWaitingVerification(payment);
        const currentAmount =
            getDisplayAmount(payment);
        const currentInfo =
            paymentUtils.getCurrentInstallmentInfo(
                payment
            );
        const nextInfo =
            paymentUtils.getNextInstallmentInfo(
                payment
            );
        return (
            <tr key={payment.id}>
                <td>
                    <div className="payment-invoice-cell">
                        <div className="payment-table-icon">
                            <i className="bi bi-receipt"></i>
                        </div>
                        <div>
                            <strong>
                                {payment.invoice_number}
                            </strong>
                            {payment.receipt_number && (
                                <small>
                                    Kwitansi:{" "}
                                    {payment.receipt_number}
                                </small>
                            )}
                            {isWaitingVerification && (
                                <div className="payment-inline-status warning">
                                    <i className="bi bi-hourglass-split"></i>
                                    <span>
                    Menunggu Verifikasi{" "}
                                        {currentInfo.text}
                  </span>
                                </div>
                            )}
                            {hasActiveInvoice &&
                                !isWaitingVerification && (
                                    <div className="payment-inline-status primary">
                                        <i className="bi bi-wallet2"></i>
                                        <span>
                      {currentAmount > 0
                          ? `Tagihan ${currentInfo.text}: ${paymentUtils.formatCurrency(currentAmount)}`
                          : `Tagihan ${currentInfo.text}`}
                    </span>
                                    </div>
                                )}
                            {isWaitingForInvoice &&
                                nextInfo.exists &&
                                !isWaitingVerification && (
                                    <div className="payment-inline-status primary">
                                        <i className="bi bi-clock-history"></i>
                                        <span>
                      Menunggu{" "}
                                            {nextInfo.text} dari Admin
                    </span>
                                    </div>
                                )}
                            {currentInfo.isPaid &&
                                nextInfo.exists &&
                                !hasActiveInvoice &&
                                !isWaitingVerification && (
                                    <div className="payment-inline-status success">
                                        <i className="bi bi-check-circle"></i>
                                        <span>
                      {currentInfo.text}
                    </span>
                                    </div>
                                )}
                        </div>
                    </div>
                </td>
                <td>
                    <div className="payment-program-cell">
                        <strong>
                            {payment.program_name}
                        </strong>
                        <span>
              {payment.program_duration || "-"}
            </span>
                        <small>
                            Total{" "}
                            {paymentUtils.formatCurrency(
                                payment.program_training_cost
                            )}
                        </small>
                        <small>
                            {paymentUtils.getInstallmentPlanText(
                                payment.program_installment_plan
                            )}
                        </small>
                    </div>
                </td>
                <td>
                    <div className="payment-progress-cell">
                        <div className="payment-progress-header">
                            <span>Progress</span>
                            <strong>
                                {progress.toFixed(0)}%
                            </strong>
                        </div>
                        <div className="payment-progress-track">
              <span
                  style={{
                      width: `${progress}%`,
                  }}
              ></span>
                        </div>
                        <div className="payment-progress-values">
                            <strong>
                                {paymentUtils.formatCurrency(
                                    payment.amount_paid || 0
                                )}
                            </strong>
                            <span>
                dari{" "}
                                {paymentUtils.formatCurrency(
                                    payment.program_training_cost ||
                                    0
                                )}
              </span>
                        </div>
                        {progress < 100 && (
                            <small>
                                Sisa{" "}
                                {paymentUtils.formatCurrency(
                                    safeCalculateRemaining(
                                        payment
                                    )
                                )}
                            </small>
                        )}
                    </div>
                </td>
                <td>
                    <div className="payment-status-cell">
                        {paymentUtils.getStatusBadge(
                            payment.status
                        )}
                        {isWaitingVerification && (
                            <div className="payment-status-description warning">
                                <i className="bi bi-hourglass-split"></i>
                                <span>
                  Menunggu verifikasi admin
                </span>
                            </div>
                        )}
                        {hasActiveInvoice &&
                            payment.due_date &&
                            !isWaitingVerification && (
                                <div
                                    className={`payment-status-description ${
                                        isPaymentOverdue
                                            ? "danger"
                                            : ""
                                    }`}
                                >
                                    <i className="bi bi-calendar-event"></i>
                                    <span>
                    {currentInfo.text}
                                        <br />
                    Jatuh tempo{" "}
                                        {formatDate(
                                            payment.due_date
                                        )}
                  </span>
                                </div>
                            )}
                        {isWaitingForInvoice &&
                            nextInfo.exists &&
                            !isWaitingVerification && (
                                <div className="payment-status-description">
                                    <i className="bi bi-clock-history"></i>
                                    <span>
                    Menunggu {nextInfo.text}
                  </span>
                                </div>
                            )}
                        {currentInfo.isPaid &&
                            nextInfo.exists &&
                            !hasActiveInvoice &&
                            !isWaitingVerification && (
                                <div className="payment-status-description success">
                                    <i className="bi bi-check-circle"></i>
                                    <span>
                    {currentInfo.text} sudah
                    dibayar
                  </span>
                                </div>
                            )}
                        {payment.status === "paid" && (
                            <div className="payment-status-description success">
                                <i className="bi bi-check-circle"></i>
                                <span>Pembayaran lunas</span>
                            </div>
                        )}
                    </div>
                </td>
                <td>
                    {payment.receipt_number ? (
                        <span className="payment-receipt-badge">
              <i className="bi bi-check-circle"></i>
                            {payment.receipt_number}
            </span>
                    ) : (
                        <span className="payment-receipt-empty">
              Belum tersedia
            </span>
                    )}
                </td>
                <td>
                    <div className="payment-action-group">
                        {canUploadProof(payment) && (
                            <button
                                type="button"
                                className="payment-action-btn"
                                onClick={() => {
                                    setSelectedPayment(payment);
                                    setShowUploadModal(true);
                                }}
                                title="Upload Bukti Bayar"
                            >
                                <i className="bi bi-upload"></i>
                            </button>
                        )}
                        {payment.proof_image && (
                            <button
                                type="button"
                                className="payment-action-btn"
                                onClick={() =>
                                    handleShowProof(payment)
                                }
                                title="Lihat Bukti Pembayaran"
                            >
                                <i className="bi bi-eye"></i>
                            </button>
                        )}
                        {canDownloadReceipt(payment) && (
                            <button
                                type="button"
                                className="payment-action-btn"
                                onClick={() =>
                                    downloadReceipt(payment)
                                }
                                title="Download Kwitansi"
                            >
                                <i className="bi bi-download"></i>
                            </button>
                        )}
                        <button
                            type="button"
                            className="payment-action-btn"
                            onClick={() =>
                                handleShowDetail(payment)
                            }
                            title="Lihat Detail Pembayaran"
                        >
                            <i className="bi bi-info-circle"></i>
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    /* =========================================================
       MAIN RENDER
    ========================================================= */
    return (
        <div className="payment-page">
            <div className="payment-shell">

                {/* =====================================================
            HEADER
        ====================================================== */}
                <header className="payment-header">
          <span className="payment-header-badge">
            <i className="bi bi-credit-card-2-front"></i>
            FITALENTA PAYMENT
          </span>
                    <div className="payment-header-content">
                        <div>
                            <h1>
                                Manajemen Pembayaran
                            </h1>
                            <p>
                                Kelola invoice, pembayaran cicilan, dan bukti pembayaran program magang Anda dalam satu tempat.
                            </p>
                        </div>
                    </div>
                    <div className="payment-header-benefits">
                        <div>
                            <i className="bi bi-shield-check"></i>
                            <span>
                Aman & Terverifikasi
              </span>
                        </div>
                        <div>
                            <i className="bi bi-receipt"></i>
                            <span>
                Invoice Terintegrasi
              </span>
                        </div>
                        <div>
                            <i className="bi bi-arrow-repeat"></i>
                            <span>
                Pembayaran Bertahap
              </span>
                        </div>
                    </div>
                </header>

                {/* =====================================================
            MESSAGE
        ====================================================== */}
                {message.text && (
                    <div
                        className={`payment-message ${
                            message.type === "error"
                                ? "danger"
                                : message.type ===
                                "success"
                                    ? "success"
                                    : "info"
                        }`}
                    >
                        <div className="payment-message-icon">
                            <i
                                className={`bi ${
                                    message.type === "error"
                                        ? "bi-exclamation-circle"
                                        : message.type ===
                                        "success"
                                            ? "bi-check-circle"
                                            : "bi-info-circle"
                                }`}
                            ></i>
                        </div>
                        <div className="payment-message-content">
                            <strong>
                                {message.type === "error"
                                    ? "Terjadi Kendala"
                                    : message.type ===
                                    "success"
                                        ? "Berhasil"
                                        : "Informasi"}
                            </strong>
                            <span>{message.text}</span>
                        </div>
                        <button
                            type="button"
                            className="payment-message-close"
                            onClick={() =>
                                setMessage({
                                    type: "",
                                    text: "",
                                })
                            }
                            aria-label="Tutup"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                )}

                {/* =====================================================
            NOTIFICATION SUMMARY
        ====================================================== */}
                {paymentAlerts.length > 0 && (
                    <section className="payment-summary-alert">
                        <div className="payment-summary-alert-icon">
                            <i className="bi bi-bell"></i>
                        </div>
                        <div className="payment-summary-alert-content">
                            <strong>
                                Anda memiliki{" "}
                                {paymentAlerts.length}{" "}
                                pemberitahuan pembayaran
                            </strong>
                            <span>
                Periksa informasi berikut agar proses pembayaran berjalan lancar.
              </span>
                            <div className="payment-summary-chips">
                                {alertCounts.danger > 0 && (
                                    <span className="danger">
                    <i className="bi bi-exclamation-triangle"></i>
                    Terlambat{" "}
                                        {alertCounts.danger}
                  </span>
                                )}
                                {alertCounts.warning >
                                    0 && (
                                        <span className="warning">
                    <i className="bi bi-clock"></i>
                    Jatuh Tempo{" "}
                                            {alertCounts.warning}
                  </span>
                                    )}
                                {alertCounts.primary >
                                    0 && (
                                        <span className="primary">
                    <i className="bi bi-upload"></i>
                    Perlu Upload{" "}
                                            {alertCounts.primary}
                  </span>
                                    )}
                                {alertCounts.secondary >
                                    0 && (
                                        <span className="secondary">
                    <i className="bi bi-hourglass-split"></i>
                    Verifikasi{" "}
                                            {alertCounts.secondary}
                  </span>
                                    )}
                                {alertCounts.info > 0 && (
                                    <span className="info">
                    <i className="bi bi-info-circle"></i>
                    Informasi{" "}
                                        {alertCounts.info}
                  </span>
                                )}
                                {alertCounts.success >
                                    0 && (
                                        <span className="success">
                    <i className="bi bi-check-circle"></i>
                    Lunas{" "}
                                            {alertCounts.success}
                  </span>
                                    )}
                            </div>
                        </div>
                    </section>
                )}

                {/* =====================================================
            PAYMENT NOTIFICATIONS
        ====================================================== */}
                {paymentAlerts.length > 0 && (
                    <section className="payment-alert-panel">
                        <div className="payment-section-header">
                            <div className="payment-section-heading">
                                <div className="payment-section-icon">
                                    <i className="bi bi-bell"></i>
                                </div>
                                <div>
                                    <h2>
                                        Pemberitahuan Pembayaran
                                    </h2>
                                    <p>
                                        Informasi yang membutuhkan perhatian Anda.
                                    </p>
                                </div>
                            </div>
                            <span className="payment-count-badge">
                {paymentAlerts.length}
              </span>
                        </div>
                        <div className="payment-alert-list">
                            {paymentAlerts.map(
                                (alert, index) => (
                                    <div
                                        key={`${alert.paymentId}-${index}`}
                                        className={`payment-alert-item ${alert.type}`}
                                    >
                                        <div className="payment-alert-item-icon">
                                            <i
                                                className={`bi ${alert.icon}`}
                                            ></i>
                                        </div>
                                        <div className="payment-alert-item-content">
                                            <strong>
                                                {alert.title}
                                            </strong>
                                            <p>{alert.message}</p>
                                            <div className="payment-alert-details">
                                                {alert.amount > 0 && (
                                                    <span>
                            <i className="bi bi-wallet2"></i>
                                                        {paymentUtils.formatCurrency(
                                                            alert.amount
                                                        )}
                          </span>
                                                )}
                                                {alert.dueDate && (
                                                    <span>
                            <i className="bi bi-calendar-event"></i>
                                                        {formatDate(
                                                            alert.dueDate
                                                        )}
                          </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="payment-alert-actions">
                                            {alert.action ===
                                                "upload" && (
                                                    <button
                                                        type="button"
                                                        className="payment-alert-action-btn"
                                                        onClick={() =>
                                                            handleAlertAction(
                                                                alert
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-upload"></i>
                                                        Upload
                                                    </button>
                                                )}
                                            {alert.action ===
                                                "view_proof" && (
                                                    <button
                                                        type="button"
                                                        className="payment-alert-action-btn"
                                                        onClick={() =>
                                                            handleAlertAction(
                                                                alert
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                        Lihat Bukti
                                                    </button>
                                                )}
                                            <button
                                                type="button"
                                                className="payment-alert-dismiss"
                                                onClick={() =>
                                                    dismissAlert(index)
                                                }
                                                aria-label="Sembunyikan pemberitahuan"
                                            >
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="payment-alert-footer">
              <span>
                <i className="bi bi-bell"></i>
                  {paymentAlerts.length}{" "}
                  pemberitahuan aktif
              </span>
                            <button
                                type="button"
                                onClick={dismissAllAlerts}
                            >
                                <i className="bi bi-eye-slash"></i>
                                Sembunyikan Semua
                            </button>
                        </div>
                    </section>
                )}

                {/* =====================================================
            PAYMENT PROCESS
        ====================================================== */}
                <section className="payment-process-card">
                    <div className="payment-section-header">
                        <div className="payment-section-heading">
                            <div className="payment-section-icon">
                                <i className="bi bi-diagram-3"></i>
                            </div>
                            <div>
                                <h2>Sistem Pembayaran</h2>
                                <p>
                                    Ketahui alur pembayaran program magang FITALENTA.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="payment-process-grid">
                        <div className="payment-process-step">
                            <div className="payment-process-number">
                                01
                            </div>
                            <div className="payment-process-icon">
                                <i className="bi bi-receipt"></i>
                            </div>
                            <strong>
                                Tagihan Diterbitkan
                            </strong>
                            <span>
                Admin menerbitkan tagihan pertama setelah Anda lolos interview.
              </span>
                        </div>
                        <div className="payment-process-arrow">
                            <i className="bi bi-arrow-right"></i>
                        </div>
                        <div className="payment-process-step">
                            <div className="payment-process-number">
                                02
                            </div>
                            <div className="payment-process-icon">
                                <i className="bi bi-wallet2"></i>
                            </div>
                            <strong>
                                Lakukan Pembayaran
                            </strong>
                            <span>
                Bayar sesuai nominal invoice yang telah diterbitkan.
              </span>
                        </div>
                        <div className="payment-process-arrow">
                            <i className="bi bi-arrow-right"></i>
                        </div>
                        <div className="payment-process-step">
                            <div className="payment-process-number">
                                03
                            </div>
                            <div className="payment-process-icon">
                                <i className="bi bi-cloud-arrow-up"></i>
                            </div>
                            <strong>Upload Bukti</strong>
                            <span>
                Unggah bukti pembayaran melalui halaman ini.
              </span>
                        </div>
                        <div className="payment-process-arrow">
                            <i className="bi bi-arrow-right"></i>
                        </div>
                        <div className="payment-process-step">
                            <div className="payment-process-number">
                                04
                            </div>
                            <div className="payment-process-icon">
                                <i className="bi bi-shield-check"></i>
                            </div>
                            <strong>
                                Verifikasi Admin
                            </strong>
                            <span>
                Admin memeriksa pembayaran dalam 1–2 hari kerja.
              </span>
                        </div>
                        <div className="payment-process-arrow">
                            <i className="bi bi-arrow-right"></i>
                        </div>
                        <div className="payment-process-step">
                            <div className="payment-process-number">
                                05
                            </div>
                            <div className="payment-process-icon">
                                <i className="bi bi-check2-circle"></i>
                            </div>
                            <strong>
                                Tagihan Berikutnya
                            </strong>
                            <span>
                Untuk pembayaran cicilan, proses berulang hingga seluruh pembayaran dinyatakan lunas.
              </span>
                        </div>
                    </div>
                    <div className="payment-process-note">
                        <div>
                            <i className="bi bi-info-circle"></i>
                        </div>
                        <p>
                            <strong>
                                Menunggu Tagihan Admin
                            </strong>
                            <span>
                Jika status pembayaran menunjukkan “Menunggu Tagihan Admin”, Anda tidak perlu melakukan tindakan. Tagihan selanjutnya akan diterbitkan oleh admin.
              </span>
                        </p>
                    </div>
                </section>

                {/* =====================================================
            INVOICE LIST
        ====================================================== */}
                <section className="payment-invoice-card">
                    <div className="payment-invoice-header">
                        <div className="payment-section-heading">
                            <div className="payment-section-icon">
                                <i className="bi bi-receipt-cutoff"></i>
                            </div>
                            <div>
                                <h2>
                                    Invoice Pembayaran
                                </h2>
                                <p>
                                    Lihat tagihan, progress, jatuh tempo, dan status pembayaran Anda.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="payment-refresh-btn"
                            onClick={fetchPayments}
                            disabled={loading}
                        >
                            <i
                                className={`bi bi-arrow-clockwise ${
                                    loading ? "spin" : ""
                                }`}
                            ></i>
                            <span>
                {loading
                    ? "Memuat..."
                    : "Refresh"}
              </span>
                        </button>
                    </div>
                    <div className="payment-invoice-body">
                        {payments.length === 0 ? (
                            <div className="payment-empty-state">
                                <div className="payment-empty-visual">
                                    <div className="payment-empty-icon">
                                        <i className="bi bi-receipt"></i>
                                    </div>
                                    <span className="payment-empty-decoration decoration-one"></span>
                                    <span className="payment-empty-decoration decoration-two"></span>
                                </div>
                                <span className="payment-empty-label">
                  BELUM ADA INVOICE
                </span>
                                <h3>
                                    Belum ada pembayaran
                                </h3>
                                <p>
                                    Setelah Anda mendaftar program dan dinyatakan lolos interview, invoice pembayaran akan muncul secara otomatis di halaman ini.
                                </p>
                                <div className="payment-empty-info">
                                    <i className="bi bi-info-circle"></i>
                                    <span>
                    Tidak ada tindakan yang perlu dilakukan saat ini.
                  </span>
                                </div>
                            </div>
                        ) : (
                            <div className="payment-table-wrapper">
                                <table className="payment-table">
                                    <thead>
                                    <tr>
                                        <th>Invoice</th>
                                        <th>
                                            Program & Biaya
                                        </th>
                                        <th>
                                            Progress Pembayaran
                                        </th>
                                        <th>
                                            Status & Jatuh Tempo
                                        </th>
                                        <th>Kwitansi</th>
                                        <th>Aksi</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {payments.map(
                                        renderPaymentRow
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>

                {/* =====================================================
            UPLOAD PROOF MODAL
        ====================================================== */}
                {showUploadModal &&
                    selectedPayment && (
                        <div className="payment-modal-overlay">
                            <div className="payment-modal-dialog">
                                <div className="payment-modal-content">
                                    <div className="payment-modal-header">
                                        <div className="payment-modal-title-wrap">
                                            <div className="payment-modal-title-icon">
                                                <i className="bi bi-cloud-arrow-up"></i>
                                            </div>
                                            <div>
                                                <h3>
                                                    Upload Bukti Pembayaran
                                                </h3>
                                                <p>
                                                    Unggah bukti transfer untuk diverifikasi oleh admin.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="payment-modal-close"
                                            onClick={
                                                handleCloseUploadModal
                                            }
                                            disabled={uploading}
                                            aria-label="Tutup"
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                    <div className="payment-modal-body">
                                        <div className="payment-modal-notice">
                                            <i className="bi bi-info-circle"></i>
                                            <span>
                        Setelah bukti diunggah, admin akan melakukan verifikasi dalam 1–2 hari kerja.
                      </span>
                                        </div>
                                        <div className="payment-modal-summary-grid">
                                            <div className="payment-modal-summary-card">
                                                <div className="payment-modal-summary-heading">
                                                    <i className="bi bi-receipt"></i>
                                                    <strong>
                                                        Informasi Pembayaran
                                                    </strong>
                                                </div>
                                                <dl>
                                                    <div>
                                                        <dt>Invoice</dt>
                                                        <dd>
                                                            {
                                                                selectedPayment.invoice_number
                                                            }
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>Program</dt>
                                                        <dd>
                                                            {
                                                                selectedPayment.program_name
                                                            }
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>
                                                            Rencana Pembayaran
                                                        </dt>
                                                        <dd>
                                                            {paymentUtils.getInstallmentPlanText(
                                                                selectedPayment.program_installment_plan
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>
                                                            Pembayaran Saat Ini
                                                        </dt>
                                                        <dd>
                                                            {paymentUtils.getInstallmentText(
                                                                selectedPayment
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div className="highlight">
                                                        <dt>
                                                            Jumlah Dibayar
                                                        </dt>
                                                        <dd>
                                                            {paymentUtils.formatCurrency(
                                                                getDisplayAmount(
                                                                    selectedPayment
                                                                )
                                                            )}
                                                        </dd>
                                                    </div>
                                                    {selectedPayment.due_date && (
                                                        <div>
                                                            <dt>
                                                                Jatuh Tempo
                                                            </dt>
                                                            <dd
                                                                className={
                                                                    paymentUtils.isOverdue(
                                                                        selectedPayment
                                                                    )
                                                                        ? "danger"
                                                                        : ""
                                                                }
                                                            >
                                                                {formatDate(
                                                                    selectedPayment.due_date
                                                                )}
                                                            </dd>
                                                        </div>
                                                    )}
                                                </dl>
                                            </div>
                                            <div className="payment-modal-summary-card">
                                                <div className="payment-modal-summary-heading">
                                                    <i className="bi bi-wallet2"></i>
                                                    <strong>
                                                        Detail Biaya
                                                    </strong>
                                                </div>
                                                <dl>
                                                    <div>
                                                        <dt>
                                                            Total Biaya
                                                        </dt>
                                                        <dd>
                                                            {paymentUtils.formatCurrency(
                                                                selectedPayment.program_training_cost ||
                                                                0
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>
                                                            Sudah Dibayar
                                                        </dt>
                                                        <dd>
                                                            {paymentUtils.formatCurrency(
                                                                selectedPayment.amount_paid ||
                                                                0
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div className="highlight">
                                                        <dt>
                                                            Sisa Tagihan
                                                        </dt>
                                                        <dd>
                                                            {paymentUtils.formatCurrency(
                                                                safeCalculateRemaining(
                                                                    selectedPayment
                                                                )
                                                            )}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>
                                        <div className="payment-upload-section">
                                            <label
                                                htmlFor="proofFile"
                                                className="payment-upload-label"
                                            >
                                                Bukti Pembayaran
                                                <span>*</span>
                                            </label>
                                            <label
                                                htmlFor="proofFile"
                                                className={`payment-upload-box ${
                                                    file
                                                        ? "has-file"
                                                        : ""
                                                }`}
                                            >
                                                <input
                                                    type="file"
                                                    id="proofFile"
                                                    accept="image/*"
                                                    onChange={
                                                        handleFileSelect
                                                    }
                                                    disabled={uploading}
                                                />
                                                <div className="payment-upload-icon">
                                                    <i
                                                        className={`bi ${
                                                            file
                                                                ? "bi-check-circle"
                                                                : "bi-cloud-arrow-up"
                                                        }`}
                                                    ></i>
                                                </div>
                                                <strong>
                                                    {file
                                                        ? file.name
                                                        : "Pilih bukti pembayaran"}
                                                </strong>
                                                <span>
                          Klik area ini untuk memilih file dari perangkat Anda
                        </span>
                                                <small>
                                                    JPG, PNG, GIF • Maksimal 5 MB
                                                </small>
                                            </label>
                                        </div>
                                        {previewUrl && (
                                            <div className="payment-proof-preview">
                                                <div className="payment-proof-preview-header">
                                                    <div>
                                                        <i className="bi bi-image"></i>
                                                        <strong>
                                                            Preview Bukti Pembayaran
                                                        </strong>
                                                    </div>
                                                    <span>
                            SIAP DIUPLOAD
                          </span>
                                                </div>
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview bukti pembayaran"
                                                    onError={(event) => {
                                                        console.error(
                                                            "Error loading preview image"
                                                        );
                                                        event.target.style.display =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {paymentUtils.isOverdue(
                                            selectedPayment
                                        ) && (
                                            <div className="payment-modal-warning">
                                                <i className="bi bi-exclamation-triangle"></i>
                                                <div>
                                                    <strong>
                                                        Pembayaran melewati batas waktu
                                                    </strong>
                                                    <span>
                            Segera selesaikan pembayaran agar proses program tidak terhambat.
                          </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="payment-modal-footer">
                                        <button
                                            type="button"
                                            className="payment-secondary-btn"
                                            onClick={
                                                handleCloseUploadModal
                                            }
                                            disabled={uploading}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            className="payment-primary-btn"
                                            onClick={
                                                handleUploadProof
                                            }
                                            disabled={
                                                !file || uploading
                                            }
                                        >
                                            {uploading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Mengupload...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-cloud-arrow-up"></i>
                                                    Upload Bukti
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {/* =====================================================
            PROOF MODAL
        ====================================================== */}
                {showProofModal &&
                    selectedPayment &&
                    selectedPayment.proof_image && (
                        <div className="payment-modal-overlay">
                            <div className="payment-modal-dialog">
                                <div className="payment-modal-content">
                                    <div className="payment-modal-header">
                                        <div className="payment-modal-title-wrap">
                                            <div className="payment-modal-title-icon">
                                                <i className="bi bi-image"></i>
                                            </div>
                                            <div>
                                                <h3>
                                                    Bukti Pembayaran
                                                </h3>
                                                <p>
                                                    {
                                                        selectedPayment.invoice_number
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="payment-modal-close"
                                            onClick={
                                                handleCloseProofModal
                                            }
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                    <div className="payment-modal-body">
                                        <div className="payment-proof-image-view">
                                            <img
                                                src={paymentUtils.getImageUrl(
                                                    selectedPayment.proof_image
                                                )}
                                                alt="Bukti Pembayaran"
                                                onError={(event) => {
                                                    console.error(
                                                        "Error loading proof image"
                                                    );
                                                    event.target.style.display =
                                                        "none";
                                                    setMessage({
                                                        type: "error",
                                                        text: "Gagal memuat gambar bukti pembayaran",
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="payment-proof-status">
                                            <div>
                                                <small>
                                                    Status Pembayaran
                                                </small>
                                                {paymentUtils.getStatusBadge(
                                                    selectedPayment.status
                                                )}
                                            </div>
                                            <div className="payment-proof-status-info">
                                                <i className="bi bi-clock-history"></i>
                                                <span>
                          Admin akan memverifikasi pembayaran ini dalam 1–2 hari kerja.
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="payment-modal-footer">
                                        <button
                                            type="button"
                                            className="payment-secondary-btn"
                                            onClick={
                                                handleCloseProofModal
                                            }
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {/* =====================================================
            DETAIL PAYMENT MODAL
        ====================================================== */}
                {showDetailModal &&
                    selectedPayment && (
                        <div className="payment-modal-overlay">
                            <div className="payment-modal-dialog payment-modal-large">
                                <div className="payment-modal-content">
                                    <div className="payment-modal-header">
                                        <div className="payment-modal-title-wrap">
                                            <div className="payment-modal-title-icon">
                                                <i className="bi bi-receipt"></i>
                                            </div>
                                            <div>
                                                <h3>
                                                    Detail Invoice
                                                </h3>
                                                <p>
                                                    {
                                                        selectedPayment.invoice_number
                                                    }{" "}
                                                    •{" "}
                                                    {paymentUtils.getInstallmentText(
                                                        selectedPayment
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="payment-modal-close"
                                            onClick={
                                                handleCloseDetail
                                            }
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                    <div className="payment-modal-body">
                                        <div className="payment-detail-grid">
                                            <section className="payment-detail-card">
                                                <div className="payment-detail-card-heading">
                                                    <i className="bi bi-receipt"></i>
                                                    <h4>
                                                        Informasi Invoice
                                                    </h4>
                                                </div>
                                                <dl>
                                                    <div>
                                                        <dt>
                                                            Nomor Invoice
                                                        </dt>
                                                        <dd>
                                                            {
                                                                selectedPayment.invoice_number
                                                            }
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>
                                                            Nomor Kwitansi
                                                        </dt>
                                                        <dd>
                                                            {selectedPayment.receipt_number ||
                                                                "-"}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>Program</dt>
                                                        <dd>
                                                            {
                                                                selectedPayment.program_name
                                                            }
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>Durasi</dt>
                                                        <dd>
                                                            {selectedPayment.program_duration ||
                                                                "-"}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>
                                                            Plan Cicilan
                                                        </dt>
                                                        <dd>
                                                            {paymentUtils.getInstallmentPlanText(
                                                                selectedPayment.program_installment_plan
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>
                                                            Pembayaran Saat Ini
                                                        </dt>
                                                        <dd>
                                                            {paymentUtils.getInstallmentText(
                                                                selectedPayment
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div className="highlight">
                                                        <dt>
                                                            Jumlah yang Harus Dibayar
                                                        </dt>
                                                        <dd>
                                                            {paymentUtils.formatCurrency(
                                                                getDisplayAmount(
                                                                    selectedPayment
                                                                )
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>
                                                            Jatuh Tempo
                                                        </dt>
                                                        <dd>
                                                            {selectedPayment.due_date
                                                                ? formatDate(
                                                                    selectedPayment.due_date
                                                                )
                                                                : "Menunggu tagihan admin"}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </section>
                                            <section className="payment-detail-card">
                                                <div className="payment-detail-card-heading">
                                                    <i className="bi bi-shield-check"></i>
                                                    <h4>
                                                        Status Pembayaran
                                                    </h4>
                                                </div>
                                                <dl>
                                                    <div>
                                                        <dt>Status</dt>
                                                        <dd>
                                                            {paymentUtils.getStatusBadge(
                                                                selectedPayment.status
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>
                                                            Tanggal Invoice
                                                        </dt>
                                                        <dd>
                                                            {formatDate(
                                                                selectedPayment.created_at
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>
                                                            Tanggal Bayar
                                                        </dt>
                                                        <dd>
                                                            {selectedPayment.payment_date
                                                                ? formatDate(
                                                                    selectedPayment.payment_date
                                                                )
                                                                : "-"}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>
                                                            Verifikasi
                                                        </dt>
                                                        <dd>
                                                            {selectedPayment.verified_by
                                                                ? "Terverifikasi Admin"
                                                                : "Belum diverifikasi"}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>
                                                            Bukti Pembayaran
                                                        </dt>
                                                        <dd>
                                                            {selectedPayment.proof_image
                                                                ? "Sudah diupload"
                                                                : "Belum diupload"}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </section>
                                        </div>
                                        <section className="payment-detail-progress-card">
                                            <div className="payment-detail-card-heading">
                                                <i className="bi bi-bar-chart"></i>
                                                <h4>
                                                    Progress Pembayaran
                                                </h4>
                                            </div>
                                            <div className="payment-detail-stat-grid">
                                                <div>
                                                    <div className="payment-detail-stat-icon">
                                                        <i className="bi bi-wallet2"></i>
                                                    </div>
                                                    <small>
                                                        Total Biaya Program
                                                    </small>
                                                    <strong>
                                                        {paymentUtils.formatCurrency(
                                                            selectedPayment.program_training_cost ||
                                                            0
                                                        )}
                                                    </strong>
                                                </div>
                                                <div>
                                                    <div className="payment-detail-stat-icon success">
                                                        <i className="bi bi-check-circle"></i>
                                                    </div>
                                                    <small>
                                                        Sudah Dibayar
                                                    </small>
                                                    <strong>
                                                        {paymentUtils.formatCurrency(
                                                            selectedPayment.amount_paid ||
                                                            0
                                                        )}
                                                    </strong>
                                                </div>
                                                <div>
                                                    <div className="payment-detail-stat-icon warning">
                                                        <i className="bi bi-hourglass-split"></i>
                                                    </div>
                                                    <small>
                                                        Sisa Tagihan
                                                    </small>
                                                    <strong>
                                                        {paymentUtils.formatCurrency(
                                                            safeCalculateRemaining(
                                                                selectedPayment
                                                            )
                                                        )}
                                                    </strong>
                                                </div>
                                            </div>
                                            <div className="payment-detail-progress">
                                                <div>
                          <span>
                            Progress keseluruhan
                          </span>
                                                    <strong>
                                                        {safeCalculateProgress(
                                                            selectedPayment
                                                        ).toFixed(0)}
                                                        %
                                                    </strong>
                                                </div>
                                                <div className="payment-progress-track">
                          <span
                              style={{
                                  width: `${safeCalculateProgress(
                                      selectedPayment
                                  )}%`,
                              }}
                          ></span>
                                                </div>
                                            </div>
                                        </section>
                                        {selectedPayment.payment_method && (
                                            <section className="payment-detail-card payment-detail-full">
                                                <div className="payment-detail-card-heading">
                                                    <i className="bi bi-credit-card"></i>
                                                    <h4>
                                                        Metode Pembayaran
                                                    </h4>
                                                </div>
                                                <dl>
                                                    <div>
                                                        <dt>Metode</dt>
                                                        <dd>
                                                            {
                                                                selectedPayment.payment_method
                                                            }
                                                        </dd>
                                                    </div>
                                                    {selectedPayment.bank_name && (
                                                        <div>
                                                            <dt>Bank</dt>
                                                            <dd>
                                                                {
                                                                    selectedPayment.bank_name
                                                                }
                                                            </dd>
                                                        </div>
                                                    )}
                                                    {selectedPayment.account_number && (
                                                        <div>
                                                            <dt>
                                                                Nomor Rekening
                                                            </dt>
                                                            <dd>
                                                                {
                                                                    selectedPayment.account_number
                                                                }
                                                            </dd>
                                                        </div>
                                                    )}
                                                </dl>
                                            </section>
                                        )}
                                        {selectedPayment.notes && (
                                            <section className="payment-detail-note">
                                                <i className="bi bi-chat-left-text"></i>
                                                <div>
                                                    <strong>
                                                        Catatan
                                                    </strong>
                                                    <p>
                                                        {
                                                            selectedPayment.notes
                                                        }
                                                    </p>
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                    <div className="payment-modal-footer">
                                        <button
                                            type="button"
                                            className="payment-secondary-btn"
                                            onClick={
                                                handleCloseDetail
                                            }
                                        >
                                            Tutup
                                        </button>
                                        {canDownloadReceipt(
                                            selectedPayment
                                        ) && (
                                            <button
                                                type="button"
                                                className="payment-secondary-outline-btn"
                                                onClick={() => {
                                                    downloadReceipt(
                                                        selectedPayment
                                                    );
                                                    handleCloseDetail();
                                                }}
                                            >
                                                <i className="bi bi-download"></i>
                                                Download Kwitansi
                                            </button>
                                        )}
                                        {canUploadProof(
                                            selectedPayment
                                        ) && (
                                            <button
                                                type="button"
                                                className="payment-primary-btn"
                                                onClick={() => {
                                                    const paymentToUpload =
                                                        selectedPayment;
                                                    setShowDetailModal(
                                                        false
                                                    );
                                                    setSelectedPayment(
                                                        paymentToUpload
                                                    );
                                                    setShowUploadModal(
                                                        true
                                                    );
                                                }}
                                            >
                                                <i className="bi bi-upload"></i>
                                                Upload Bukti Bayar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default Payment;