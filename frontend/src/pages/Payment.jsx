<<<<<<< HEAD
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { buildFileUrl } from "../utils/api";

const normalizeAmountValue = (value) => {
  if (value === null || value === undefined) {
    return NaN;
  }

  if (typeof value === "number") {
    return Number.isNaN(value) ? NaN : value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return NaN;
    }

    const filtered = trimmed.replace(/[^0-9,.-]/g, "");

    if (!filtered) {
      return NaN;
    }

    const decimalMatch = filtered.match(/[.,](\d{1,2})$/);
    let integerPortion = filtered;
    let fractionValue = 0;

    if (decimalMatch && typeof decimalMatch.index === "number") {
      integerPortion = filtered.slice(0, decimalMatch.index);
      const fractionDigits = decimalMatch[1];
      const fractionNumber = parseInt(fractionDigits, 10);

      if (!Number.isNaN(fractionNumber)) {
        fractionValue = fractionNumber / Math.pow(10, fractionDigits.length);
      }
    }

    const integerDigits = integerPortion.replace(/[^0-9-]/g, "");

    if (!integerDigits || integerDigits === "-") {
      return NaN;
    }

    const integerValue = parseInt(integerDigits, 10);

    if (Number.isNaN(integerValue)) {
      return NaN;
    }

    if (fractionValue > 0) {
      return integerValue >= 0
        ? integerValue + fractionValue
        : integerValue - fractionValue;
    }

    return integerValue;
  }

  return NaN;
};

const paymentUtils = {
  formatCurrency: (value) => {
    const numericValue = normalizeAmountValue(value);
    const safeValue = Number.isNaN(numericValue) ? 0 : numericValue;
    return `Rp ${Math.round(safeValue).toLocaleString("id-ID")}`;
  },

  numberToWords: (value) => {
    const units = [
      "",
      "Satu",
      "Dua",
      "Tiga",
      "Empat",
      "Lima",
      "Enam",
      "Tujuh",
      "Delapan",
      "Sembilan",
      "Sepuluh",
      "Sebelas",
    ];

    const convert = (number) => {
      const n = Math.floor(number);
      if (n === 0) return "";
      if (n < 12) return units[n];
      if (n < 20) return `${convert(n - 10)} Belas`;
      if (n < 100) {
        const tens = Math.floor(n / 10);
        const remainder = n % 10;
        return `${convert(tens)} Puluh ${convert(remainder)}`;
      }
      if (n < 200) return `Seratus ${convert(n - 100)}`;
      if (n < 1000) {
        const hundreds = Math.floor(n / 100);
        const remainder = n % 100;
        return `${convert(hundreds)} Ratus ${convert(remainder)}`;
      }
      if (n < 2000) return `Seribu ${convert(n - 1000)}`;
      if (n < 1000000) {
        const thousands = Math.floor(n / 1000);
        const remainder = n % 1000;
        return `${convert(thousands)} Ribu ${convert(remainder)}`;
      }
      if (n < 1000000000) {
        const millions = Math.floor(n / 1000000);
        const remainder = n % 1000000;
        return `${convert(millions)} Juta ${convert(remainder)}`;
      }
      if (n < 1000000000000) {
        const billions = Math.floor(n / 1000000000);
        const remainder = n % 1000000000;
        return `${convert(billions)} Miliar ${convert(remainder)}`;
      }
      if (n < 1000000000000000) {
        const trillions = Math.floor(n / 1000000000000);
        const remainder = n % 1000000000000;
        return `${convert(trillions)} Triliun ${convert(remainder)}`;
      }
      return "";
    };

    const numericValue = Math.abs(Math.round(parseFloat(value) || 0));
    if (numericValue === 0) {
      return "Nol Rupiah";
    }

    const words = convert(numericValue).replace(/\s+/g, " ").trim();
    return `${words} Rupiah`;
  },

  parseFloatSafe: (value, defaultValue = 0) => {
    const normalized = normalizeAmountValue(value);
    return Number.isNaN(normalized)
      ? defaultValue
      : Math.round(normalized * 100) / 100;
  },

  calculateRemainingSafe: (total, paid) => {
    const totalValue = paymentUtils.parseFloatSafe(total, 0);
    const paidValue = paymentUtils.parseFloatSafe(paid, 0);
    const totalCents = Math.round(totalValue * 100);
    const paidCents = Math.round(paidValue * 100);
    return Math.max(0, (totalCents - paidCents) / 100);
  },

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
      text: status,
    };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  },

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
    return statusTexts[status] || status;
  },

  getTotalInstallments: (payment) => {
    if (!payment || !payment.program_installment_plan) return 4;

    const plan = payment.program_installment_plan;
    if (plan === "none") return 1;
    if (plan === "3_installments") return 3;
    if (plan === "4_installments") return 4;
    if (plan === "6_installments") return 6;

    return parseInt(plan.split("_")[0]) || 4;
  },

  getInstallmentText: (payment) => {
    if (!payment || !payment.status) return "Unknown";

    if (payment.status === "paid") return "Lunas";
    if (payment.status === "pending") return "Menunggu Pembayaran";

    if (payment.status.startsWith("installment_")) {
      const installmentNum = payment.status.split("_")[1];
      return `Cicilan ${installmentNum}`;
    }

    return payment.status;
  },

   parseInstallmentAmounts: (payment) => {
    if (!payment || !payment.installment_amounts) return {};

    try {
      return typeof payment.installment_amounts === "string"
        ? JSON.parse(payment.installment_amounts)
        : payment.installment_amounts || {};
    } catch (error) {
      console.error("❌ Error parsing installment_amounts:", error);
      return {};
    }
  },


  getInstallmentContext: (payment, installmentNumber) => {
    if (!payment || !installmentNumber) {
      return {
        amount: 0,
        label: `Cicilan ${installmentNumber}`,
        status: "pending",
        dueDate: null,
        proofImage: null,
        proofUploadedAt: null,
        proofVerifiedAt: null,
        receiptNumber: null,
        invoiceAvailable: false,
        receiptAvailable: false,
        paidAmount: 0,
        paidAt: null,
        invoiceIssuedAt: null,
        entry: {},
      };
    }

    const totalAmount = paymentUtils.parseFloatSafe(
      payment.program_training_cost || payment.amount || 0
    );
    const totalInstallments = paymentUtils.getTotalInstallments(payment);
    const installmentData = paymentUtils.parseInstallmentAmounts(payment);
    const key = `installment_${installmentNumber}`;
    const entry = installmentData[key] || {};

    const configuredAmount = paymentUtils.parseFloatSafe(entry.amount);
    const defaultAmount =
      totalInstallments > 0 ? totalAmount / totalInstallments : totalAmount;
    const amount = configuredAmount > 0 ? configuredAmount : defaultAmount; 

    const currentInstallment = paymentUtils.getCurrentInstallmentNumber(payment);
    const proofImage = entry.proof_image || null;
    const proofUploadedAt = entry.proof_uploaded_at || null;
    const proofVerifiedAt = entry.proof_verified_at || null;
    const receiptNumber = entry.receipt_number || null;
    const receiptAvailable = Boolean(receiptNumber);
    const invoiceAvailable = Boolean(entry.amount);

    let status = entry.status || null;

    if (!status) {
      if (receiptAvailable || paymentUtils.parseFloatSafe(entry.paid_amount) > 0) {
        status = "paid";
      } else if (
        currentInstallment &&
        installmentNumber < currentInstallment
      ) {
        status = "paid";
      } else if (
        currentInstallment &&
        installmentNumber === currentInstallment
      ) {
        if (proofImage && !proofVerifiedAt && !receiptAvailable) {
          status = "waiting_verification";
        } else if (invoiceAvailable || payment.due_date) {
          status = "active";
        } else {
          status = "pending";
        }
      } else {
        status = "upcoming";
      }
    }

    const dueDate =
      entry.due_date ||
      (currentInstallment && installmentNumber === currentInstallment
        ? payment.due_date || null
        : null);

    return {
      amount,
      label: `Cicilan ${installmentNumber}`,
      status,
      dueDate,
      proofImage,
      proofUploadedAt,
      proofVerifiedAt,
      receiptNumber,
      receiptAvailable,
      invoiceAvailable,
      paidAmount: paymentUtils.parseFloatSafe(entry.paid_amount),
      paidAt: entry.paid_at || null,
      invoiceIssuedAt: entry.invoice_issued_at || null,
      entry,
    };
  },

  getInstallmentProgressRows: (payment) => {
    if (!payment) return [];

    const totalInstallments = paymentUtils.getTotalInstallments(payment);
    const rows = [];
    const installmentData = paymentUtils.parseInstallmentAmounts(payment);
    const currentInfo = paymentUtils.getCurrentInstallmentInfo(payment);
    const waitingVerification = paymentUtils.isWaitingVerification(payment);

    for (let i = 1; i <= totalInstallments; i++) {
      const context = paymentUtils.getInstallmentContext(payment, i);
      const entry = installmentData[`installment_${i}`] || {};

      let statusLabel = "Belum Diterbitkan";
      let statusVariant = "secondary";

      if (context.status === "paid" || context.receiptAvailable) {
        statusLabel = "Sudah Dibayar";
        statusVariant = "success";
      } else if (
        context.status === "waiting_verification" ||
        (waitingVerification && i === currentInfo.number)
      ) {
        statusLabel = "Menunggu Verifikasi";
        statusVariant = "warning";
      } else if (
        context.status === "active" ||
        (paymentUtils.hasActiveInvoice(payment) && i === currentInfo.number)
      ) {
        statusLabel = "Tagihan Aktif";
        statusVariant = "primary";
      } else if (
        entry.amount ||
        context.invoiceAvailable ||
        (payment.due_date && i === currentInfo.number)
      ) {
        statusLabel = "Tagihan Diterbitkan";
        statusVariant = "info";
      } else if (context.status === "upcoming") {
        statusLabel = "Menunggu Dijadwalkan";
        statusVariant = "secondary";
      }

      rows.push({
        installment: i,
        amount: context.amount,
        dueDate: context.dueDate,
        statusLabel,
        statusVariant,
        invoiceAvailable: context.invoiceAvailable,
        receiptAvailable: context.receiptAvailable,
        receiptNumber: context.receiptNumber,
        proofImage: context.proofImage,
        notes: entry.notes || null,
        paidAt: context.paidAt,
        invoiceIssuedAt: context.invoiceIssuedAt,
      });
    }

    return rows;
  },

  getInstallmentStatusDisplay: (status) => {
    if (!status) return "Belum Ditetapkan";

    const mapping = {
      paid: "Sudah Dibayar",
      waiting_verification: "Menunggu Verifikasi",
      active: "Tagihan Aktif",
      upcoming: "Menunggu Dijadwalkan",
      pending: "Menunggu Pembayaran",
    };

    if (mapping[status]) {
      return mapping[status];
    }

    if (status.startsWith("installment_")) {
      return `Cicilan ${status.split("_")[1]}`;
    }

    return paymentUtils.getStatusText(status) || status;
  },

  getCurrentInstallmentNumber: (payment) => {
    if (!payment) return null;

    if (
      typeof payment.status === "string" &&
      payment.status.startsWith("installment_")
    ) {
      const parsed = parseInt(payment.status.split("_")[1], 10);
      if (!isNaN(parsed)) return parsed;
    }

    if (payment.current_installment_number) {
      const parsed = parseInt(payment.current_installment_number, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }

    if (payment.status === "pending") {
      return 1;
    }

    if (payment.status === "paid") {
      return paymentUtils.getTotalInstallments(payment);
    }

    return 1;
  },

  getCurrentInstallmentContext: (payment) => {
    const currentNumber = paymentUtils.getCurrentInstallmentNumber(payment);
    if (!currentNumber) return null;
    return paymentUtils.getInstallmentContext(payment, currentNumber);
  },

  getCurrentInstallmentInfo: (payment) => {
    if (!payment) return { number: 0, text: "Unknown", isPaid: false, totalInstallments: 4, isWaitingVerification: false };

    const totalInstallments = paymentUtils.getTotalInstallments(payment);
    const context = paymentUtils.getCurrentInstallmentContext(payment);
    const isWaitingVerification = paymentUtils.isWaitingVerification(payment);

    if (payment.status === "paid") {
      return {
        number: totalInstallments,
        text: "Lunas",
        isPaid: true,
        totalInstallments,
        isWaitingVerification: false
      };
    }

    if (payment.status === "pending") {
      return {
        number: 1,
        text: "Menunggu Cicilan 1",
        isPaid: false,
        totalInstallments,
        isWaitingVerification
      };
    }

    if (payment.status.startsWith("installment_")) {
      const currentNum = paymentUtils.getCurrentInstallmentNumber(payment) || 1;
      const isPaid = context ? context.status === "paid" || context.receiptAvailable : paymentUtils.isInstallmentPaid(payment, currentNum);

      let text = `Cicilan ${currentNum}`;
      if (isWaitingVerification) {
        text += " (Menunggu Verifikasi)";
      } else if (isPaid) {
        text += " (Sudah Dibayar)";
      }

      return {
        number: currentNum,
        text: text,
        isPaid,
        totalInstallments,
        isWaitingVerification
      };
    }

    return {
      number: 0,
      text: payment.status,
      isPaid: false,
      totalInstallments,
      isWaitingVerification
    };
  },

  getNextInstallmentInfo: (payment) => {
    if (!payment) return { number: 0, text: "Unknown", exists: false, totalInstallments: 4 };

    const currentInfo = paymentUtils.getCurrentInstallmentInfo(payment);
    const totalInstallments = currentInfo.totalInstallments;

    if (currentInfo.number >= totalInstallments || payment.status === "paid") {
      return { number: null, text: "Lunas", exists: false, totalInstallments };
    }

    const nextNumber = currentInfo.number + 1;

    return {
      number: nextNumber,
      text: `Cicilan ${nextNumber}`,
      exists: true,
      totalInstallments
    };
  },

  isInstallmentPaid: (payment, installmentNumber) => {
    if (!payment || !installmentNumber) return false;

    if (payment.status === 'paid') return true;

    const installmentData = paymentUtils.parseInstallmentAmounts(payment);
    const entry = installmentData[`installment_${installmentNumber}`];
    if (entry) {
      if (entry.status === "paid") return true;
      if (paymentUtils.parseFloatSafe(entry.paid_amount) > 0) return true;
    }

    const totalInstallments = paymentUtils.getTotalInstallments(payment);
    const totalAmount = paymentUtils.parseFloatSafe(payment.program_training_cost);
    const paidAmount = paymentUtils.parseFloatSafe(payment.amount_paid);

    if (paidAmount >= totalAmount) return true;

    const installmentAmount = totalAmount / totalInstallments;
    const expectedPaid = installmentAmount * installmentNumber;

    return paidAmount >= expectedPaid;
  },

  getCurrentInstallmentAmount: (payment) => {
    if (!payment) return 0;

    const context = paymentUtils.getCurrentInstallmentContext(payment);
    if (context && context.amount) {
      return paymentUtils.parseFloatSafe(context.amount);
    }

    const totalAmount = paymentUtils.parseFloatSafe(payment.program_training_cost);
    const totalInstallments = paymentUtils.getTotalInstallments(payment);
    return totalInstallments > 0 ? Math.round(totalAmount / totalInstallments) : 0;
  },

  isOverdue: (payment) => {
   if (!payment || payment.status === "paid") return false;
    const context = paymentUtils.getCurrentInstallmentContext(payment);
    const dueDateRaw = context?.dueDate || payment?.due_date;
    if (!dueDateRaw) return false;
    if (context && (context.status === "paid" || context.receiptAvailable)) {
      return false;
    }
    if (paymentUtils.isWaitingVerification(payment)) {
      return false;
    }

    try {
      const dueDate = new Date(dueDateRaw);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate < today;
    } catch (error) {
      console.error("Error checking overdue:", error);
      return false;
    }
  },

  isDueSoon: (payment) => {
   if (!payment || payment.status === "paid") return false;
    const context = paymentUtils.getCurrentInstallmentContext(payment);
    const dueDateRaw = context?.dueDate || payment?.due_date;
    if (!dueDateRaw) return false;
    if (context && (context.status === "paid" || context.receiptAvailable)) {
      return false;
    }
    if (paymentUtils.isWaitingVerification(payment)) {
      return false;
    }

    try {
     const dueDate = new Date(dueDateRaw);
      const today = new Date();
      const threeDaysFromNow = new Date(today);
      threeDaysFromNow.setDate(today.getDate() + 3);

      return dueDate >= today && dueDate <= threeDaysFromNow;
    } catch (error) {
      console.error("Error checking due soon:", error);
      return false;
    }
  },

  isWaitingVerification: (payment) => {
    if (!payment) return false;

    if (payment.status === "paid" || payment.status === "cancelled") {
      return false;
    }

    const context = paymentUtils.getCurrentInstallmentContext(payment);
    if (!context) return false;

    if (context.status === "waiting_verification") {
      return true;
    }

    const hasProof = Boolean(context.proofImage);
    const proofVerified = Boolean(
      context.proofVerifiedAt || context.receiptNumber
    );

    return hasProof && !proofVerified;
  },

  needsUpload: (payment) => {
    if (!payment) return false;

    const context = paymentUtils.getCurrentInstallmentContext(payment);
    if (!context) return false;

    const notPaid = payment.status !== "paid" && payment.status !== "cancelled";
    if (!notPaid) return false;

    const hasInvoice = Boolean(context.invoiceAvailable || context.dueDate);
    if (!hasInvoice) return false;

    if (context.status === "paid" || context.receiptAvailable) {
      return false;
    }

    if (paymentUtils.isWaitingVerification(payment)) {
      return false;
    }

    return !context.proofImage;
  },

  hasActiveInvoice: (payment) => {
    if (!payment) return false;

    const context = paymentUtils.getCurrentInstallmentContext(payment);
    if (!context) return false;

    const isNotPaid = payment.status !== "paid" && payment.status !== "cancelled";
   if (!isNotPaid) return false;

    const hasRemaining =
      paymentUtils.parseFloatSafe(payment.amount_paid || 0) <
      paymentUtils.parseFloatSafe(payment.program_training_cost || 0);

    if (!hasRemaining) return false;

    if (paymentUtils.isWaitingVerification(payment)) {
      return false;
    }

    if (context.status === "paid" || context.receiptAvailable) {
      return false;
    }

    return Boolean(context.dueDate) || Boolean(context.invoiceAvailable);
  },

  isWaitingForInvoice: (payment) => {
    if (!payment) return false;

    const context = paymentUtils.getCurrentInstallmentContext(payment);
    const hasRemaining =
      paymentUtils.parseFloatSafe(payment.amount_paid || 0) <
      paymentUtils.parseFloatSafe(payment.program_training_cost || 0);

    const currentInfo = paymentUtils.getCurrentInstallmentInfo(payment);
    const nextInfo = paymentUtils.getNextInstallmentInfo(payment);

    return (
      (!context || (!context.invoiceAvailable && !context.dueDate)) &&
      hasRemaining &&
      payment.status !== "paid" &&
      payment.status !== "cancelled" &&
      currentInfo.isPaid &&
      nextInfo.exists &&
      !paymentUtils.isWaitingVerification(payment)
    );
  },

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
    const paidAmount = paymentUtils.parseFloatSafe(payment.amount_paid || 0);
    const remainingAmount = totalAmount - paidAmount;

    const currentInfo = paymentUtils.getCurrentInstallmentInfo(payment);

    return {
      currentInstallment: currentInfo.number,
      totalInstallments: currentInfo.totalInstallments,
      totalAmount,
      paidAmount,
      remainingAmount,
      progressPercentage:
        totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0,
    };
  },

  validatePayment: (payment) => {
    if (!payment) return { isValid: false, error: "Payment data is null" };
    if (!payment.id) return { isValid: false, error: "Payment ID is missing" };
    if (!payment.invoice_number)
      return { isValid: false, error: "Invoice number is missing" };

    return { isValid: true, error: null };
  },

  getImageUrl: (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return buildFileUrl(path);
  },
};

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
  const [message, setMessage] = useState({ type: "", text: "" });
  const [paymentAlerts, setPaymentAlerts] = useState([]);
const [detailLoading, setDetailLoading] = useState(false);
  const installmentRows = useMemo(
    () =>
      selectedPayment
        ? paymentUtils.getInstallmentProgressRows(selectedPayment)
        : [],
    [selectedPayment]
  );

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

  const safeCalculateProgress = useCallback((payment) => {
    if (!payment) return 0;

    const totalAmount =
      paymentUtils.parseFloatSafe(payment?.program_training_cost) || 0;
    const amountPaid = paymentUtils.parseFloatSafe(payment?.amount_paid) || 0;
    if (totalAmount <= 0) return 0;
    return Math.min(100, (amountPaid / totalAmount) * 100);
  }, []);

  const safeCalculateRemaining = useCallback((payment) => {
    if (!payment) return 0;

    const totalAmount =
      paymentUtils.parseFloatSafe(payment?.program_training_cost) || 0;
    const amountPaid = paymentUtils.parseFloatSafe(payment?.amount_paid) || 0;
    return paymentUtils.calculateRemainingSafe(totalAmount, amountPaid);
  }, []);

  const getDisplayAmount = useCallback((payment) => {
    if (!payment) return 0;
    return paymentUtils.getCurrentInstallmentAmount(payment);
  }, []);

  const generatePaymentAlerts = useCallback(
    (payments) => {
      if (!payments || payments.length === 0) return [];

      const alerts = [];

      payments.forEach((payment) => {
        const validation = paymentUtils.validatePayment(payment);
        if (!validation.isValid) {
          console.warn("Invalid payment data:", validation.error);
          return;
        }

        const currentInfo = paymentUtils.getCurrentInstallmentInfo(payment);
        const nextInfo = paymentUtils.getNextInstallmentInfo(payment);
        const hasActiveInvoice = paymentUtils.hasActiveInvoice(payment);
        const isWaitingForInvoice = paymentUtils.isWaitingForInvoice(payment);
        const isWaitingVerification = paymentUtils.isWaitingVerification(payment);
        const currentAmount = getDisplayAmount(payment);

        // console.log("Payment Alert Analysis:", {
        //   invoice: payment.invoice_number,
        //   status: payment.status,
        //   currentInstallment: currentInfo.number,
        //   isCurrentPaid: currentInfo.isPaid,
        //   isWaitingVerification: isWaitingVerification,
        //   hasActiveInvoice,
        //   isWaitingForInvoice,
        //   hasProof: !!payment.proof_image,
        //   verified: !!payment.verified_by,
        //   dueDate: payment.due_date
        // });

        if (hasActiveInvoice && paymentUtils.isOverdue(payment) && !isWaitingVerification) {
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
        }

        else if (hasActiveInvoice && paymentUtils.isDueSoon(payment) && !isWaitingVerification) {
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
        }

        else if (hasActiveInvoice && paymentUtils.needsUpload(payment) && !isWaitingVerification) {
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
        }

        else if (isWaitingForInvoice && nextInfo.exists) {
          alerts.push({
            type: "info",
            title: "Menunggu Tagihan Berikutnya",
            message: `Pembayaran ${currentInfo.text} sudah diverifikasi. Admin akan menerbitkan tagihan ${nextInfo.text} untuk program ${payment.program_name}.`,
            paymentId: payment.id,
            invoiceNumber: payment.invoice_number,
            installmentText: nextInfo.text,
            icon: "bi-clock-history",
          });
        }

        else if (!payment.due_date && payment.status === "pending" && !isWaitingVerification) {
          alerts.push({
            type: "info",
            title: "Menunggu Tagihan Pertama",
            message: `Admin akan menerbitkan tagihan cicilan pertama untuk program ${payment.program_name}. Silakan tunggu pemberitahuan selanjutnya.`,
            paymentId: payment.id,
            invoiceNumber: payment.invoice_number,
            installmentText: "Cicilan 1",
            icon: "bi-info-circle",
          });
        }

        else if (payment.status === "paid") {
          alerts.push({
            type: "success",
            title: "Pembayaran Lunas",
            message: `Selamat! Pembayaran untuk ${payment.program_name} sudah lunas.`,
            paymentId: payment.id,
            invoiceNumber: payment.invoice_number,
            icon: "bi-check-circle",
          });
        }

        else if (hasActiveInvoice && !isWaitingVerification) {
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

  const fetchPayments = useCallback(async () => {
    if (!user?.id) {
      console.warn("User ID not available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const response = await axios.get(`/api/payments/user/${user.id}`, {
        timeout: 10000,
      });

      if (response.data?.success) {
        const paymentsData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setPayments(paymentsData);

        const alerts = generatePaymentAlerts(paymentsData);
        setPaymentAlerts(alerts);

        // console.log("Payments loaded:", paymentsData.length);
        // console.log("Alerts generated:", alerts.length);
      } else {
        throw new Error(
          response.data?.message || "Format response tidak valid"
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

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage({
        type: "error",
        text: "Hanya file gambar (JPG, PNG, GIF) yang diizinkan",
      });
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Ukuran file maksimal 5MB",
      });
      e.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(selectedFile);
    setMessage({ type: "", text: "" });

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleUploadProof = async () => {
    if (!file || !selectedPayment) {
      setMessage({
        type: "error",
        text: "Pilih file bukti pembayaran terlebih dahulu",
      });
      return;
    }

    const validation = paymentUtils.validatePayment(selectedPayment);
    if (!validation.isValid) {
      setMessage({
        type: "error",
        text: "Data pembayaran tidak valid: " + validation.error,
      });
      return;
    }

    setUploading(true);
    setMessage({ type: "", text: "" });

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
        throw new Error(response.data?.message || "Upload gagal");
      }
    } catch (error) {
      console.error("❌ Error uploading proof:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal upload bukti pembayaran";

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setUploading(false);
    }
  };

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

  const canDownloadInvoice = (payment) => {
    if (!payment) return false;
    return Boolean(payment.invoice_number);
  };

   const downloadReceipt = async (payment, options = {}) => {
    const validation = paymentUtils.validatePayment(payment);
    if (!validation.isValid) {
      setMessage({
        type: "error",
        text: "Data pembayaran tidak valid: " + validation.error,
      });
      return;
    }

    const { installment } = options || {};

    const totalAmount = paymentUtils.parseFloatSafe(
      payment.program_training_cost || payment.amount || 0
    );
    const amountPaid = paymentUtils.parseFloatSafe(payment.amount_paid || 0);
    const remaining = paymentUtils.calculateRemainingSafe(totalAmount, amountPaid);

    let context = null;
    if (installment) {
      context = paymentUtils.getInstallmentContext(payment, installment);
      if (!context || (!context.receiptAvailable && context.amount <= 0)) {
        setMessage({
          type: "error",
          text: `Data kwitansi untuk cicilan ${installment} belum tersedia.`,
        });
        return;
      }
    }

    const highlightAmountValue = context?.amount && context.amount > 0
      ? context.amount
      : (() => {
          const currentInstallmentAmount = getDisplayAmount(payment);
          let fallbackAmount =
            currentInstallmentAmount && currentInstallmentAmount > 0
              ? currentInstallmentAmount
              : paymentUtils.parseFloatSafe(
                  payment.amount_paid || payment.amount || totalAmount
                );
          if (!fallbackAmount || fallbackAmount <= 0) {
            fallbackAmount = totalAmount;
          }
          return fallbackAmount;
        })();

    const amountInWords = paymentUtils.numberToWords(highlightAmountValue);
    const receiptDateObj = context?.paidAt
      ? new Date(context.paidAt)
      : payment.payment_date
      ? new Date(payment.payment_date)
      : new Date();
    const receiptDate = receiptDateObj.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
     const progress =
      totalAmount > 0 ? Math.min(100, (amountPaid / totalAmount) * 100) : 0;
    const statusText = context
      ? paymentUtils.getInstallmentStatusDisplay(context.status)
      : paymentUtils.getStatusText(payment.status);
    const paymentLabel = context?.label || paymentUtils.getInstallmentText(payment);
    const generatedAt = new Date().toLocaleString("id-ID");

    const escapeHtml = (value) =>
      (value ?? "-")
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

        const receiptNumberValue =
      context?.receiptNumber || payment.receipt_number || payment.invoice_number || "-";

    const metadata = {
      receiptNumber: escapeHtml(receiptNumberValue),
      invoiceNumber: escapeHtml(payment.invoice_number || "-"),
      statusText: escapeHtml(statusText),
      paymentLabel: escapeHtml(paymentLabel),
      participantName: escapeHtml(payment.full_name || user?.full_name || "-"),
      participantEmail: escapeHtml(payment.email || user?.email || "-"),
      participantPhone: escapeHtml(payment.phone || user?.phone || "-"),
      participantAddress: escapeHtml(payment.address || "-"),
      programName: escapeHtml(payment.program_name || "-"),
       notes: context?.entry?.notes
        ? escapeHtml(context.entry.notes)
        : payment.notes
        ? escapeHtml(payment.notes)
        : "",
    };

    const totals = {
      total: paymentUtils.formatCurrency(totalAmount),
      paid: paymentUtils.formatCurrency(amountPaid),
      remaining: paymentUtils.formatCurrency(remaining),
      highlight: paymentUtils.formatCurrency(highlightAmountValue),
      progress: progress.toFixed(1),
      amountWords: escapeHtml(amountInWords),
    };

    const params = new URLSearchParams();
    if (installment) {
      params.append("installment", installment);
    }
    const queryString = params.toString();

    try {
      try {
        const response = await axios.get(
          `/api/payments/${payment.id}/receipt${queryString ? `?${queryString}` : ""}`,
          {
            responseType: "blob",
            timeout: 15000,
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        const suffix = installment ? `-cicilan-${installment}` : "";
        link.href = url;
        link.setAttribute(
          "download",
           `kwitansi-${receiptNumberValue}${suffix}.pdf`
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
        console.log("PDF receipt not available, generating HTML receipt...", pdfError);
      }

      const receiptWindow = window.open("", "_blank");
      if (!receiptWindow) {
        setMessage({
          type: "error",
          text: "Popup diblokir. Izinkan popup untuk generate kwitansi.",
        });
        return;
      }

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>KWITANSI - ${metadata.receiptNumber}</title>
  <meta charset="UTF-8" />
  <style>
    /* Reset & Base Style */
    *, *::before, *::after { box-sizing: border-box; }
    
    body {
      margin: 0;
      padding: 40px;
      background: #eee;
      font-family: Arial, Helvetica, sans-serif; /* Font utama Sans-Serif */
      display: flex;
      justify-content: center;
    }

    /* Container utama (Kertas Putih) */
    .receipt-box {
      width: 210mm; /* Lebar A4 */
      background: #fff;
      border: 2px solid #000; /* Border luar hitam tipis seperti gambar */
      padding: 30px 40px;
      position: relative;
      color: #000;
    }

    /* --- HEADER --- */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end; /* Align bottom supaya logo sejajar teks bawah */
      padding-bottom: 15px;
      border-bottom: 2px solid #000; /* Garis hitam tebal di bawah header */
      margin-bottom: 25px;
    }

    .header-left h1 {
      font-family: 'Times New Roman', Times, serif; /* Font Serif untuk Judul */
      font-size: 42px;
      font-weight: 900;
      margin: 0;
      letter-spacing: 1px;
      line-height: 1;
      text-transform: uppercase;
    }

    .header-left .ref-number {
      font-family: Arial, sans-serif;
      font-size: 14px;
      margin-top: 5px;
      font-weight: normal;
    }

    .header-right img {
      height: 50px; /* Sesuaikan tinggi logo */
      object-fit: contain;
    }

    /* --- CONTENT BODY --- */
    .content {
      margin-bottom: 30px;
      padding-left: 10px;
    }

    /* Menggunakan tabel agar titik dua lurus rapi */
    .info-table {
      width: 100%;
      border-collapse: collapse;
    }

    .info-table td {
      padding: 8px 0;
      vertical-align: top;
      font-size: 16px;
      color: #000;
    }

    .info-table .label {
      width: 180px; /* Lebar kolom label */
      font-weight: normal;
    }

    .info-table .colon {
      width: 20px;
      text-align: center;
    }

    .info-table .value {
      font-weight: bold; /* Isian dibuat tebal */
    }

    /* --- SEPARATOR --- */
    .dashed-line {
      border: 0;
      border-top: 1px dashed #000; /* Garis putus-putus */
      margin: 20px 0 30px 0;
    }

    /* --- FOOTER --- */
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    /* Footer Kiri (Bank & Nominal) */
    .footer-left {
      flex: 1;
    }

    .bank-info {
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 20px;
    }

    .amount-box {
      border: 3px solid #000; /* Kotak tebal */
      padding: 15px 30px;
      display: inline-block;
      font-size: 24px;
      font-weight: 800;
      min-width: 250px;
      text-align: center;
      background: #fff; /* Pastikan background putih */
    }

    /* Footer Kanan (Tanda Tangan) */
    .footer-right {
      text-align: center;
      width: 300px; /* Area tanda tangan */
      position: relative;
    }

    .date-text {
      font-size: 14px;
      margin-bottom: 10px;
      text-align: left; /* Tanggal rata kiri sesuai area tanda tangan */
      padding-left: 20px;
    }

    .signature-area {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 5px;
    }

    .signature-img {
      max-height: 90px;
      max-width: 200px;
      /* Sedikit rotasi atau geser jika perlu, tapi default lurus */
    }

    .signer-name {
      font-weight: bold;
      text-decoration: underline; /* Garis bawah nama */
      font-size: 14px;
      margin: 0;
    }

    .signer-title {
      font-size: 14px;
      margin-top: 5px;
      font-weight: normal;
    }

    /* Print settings */
    @media print {
      body { padding: 0; background: #fff; }
      .receipt-box { border: 2px solid #000; margin: 0; width: 100%; box-shadow: none; }
    }
  </style>
</head>
<body>

  <div class="receipt-box">
    
    <div class="header">
      <div class="header-left">
        <h1>KWITANSI</h1>
        <div class="ref-number">No: ${metadata.receiptNumber}</div>
      </div>
      <div class="header-right">
        <img src="https://registrasi.fitalenta.co.id/images/logo/fitalenta_2024.png" style="height: 90px;" alt="Logo Fitalenta" />
      </div>
    </div>

    <div class="content">
      <table class="info-table">
        <tr>
          <td class="label">Telah diterima dari</td>
          <td class="colon">:</td>
          <td class="value">${metadata.participantName}</td>
        </tr>
        <tr>
          <td class="label">Uang sejumlah</td>
          <td class="colon">:</td>
          <td class="value" style="font-style: italic;">${totals.amountWords}</td>
        </tr>
        <tr>
          <td class="label">Untuk</td>
          <td class="colon">:</td>
          <td class="value">${metadata.paymentLabel} - ${metadata.programName}</td>
        </tr>
      </table>
    </div>

    <div class="dashed-line"></div>

    <div class="footer">
      
      <div class="footer-left">
        <div class="bank-info">
          Rekening BCA Cab. Maranatha Bandung<br>
          2828339333 a.n PT FAST Indo Talenta
        </div>
        
        <div class="amount-box">
          ${totals.highlight}
        </div>
      </div>

      <div class="footer-right">
        <div class="date-text">Bandung, ${receiptDate}</div>
        
        <div class="signature-area">
          <img src="signature.jpg" alt="Signature" class="signature-img" />
        </div>
        
        <p class="signer-name">Ii Ratna Yanti Kosasih</p>
        <p class="signer-title">General Manager</p>
      </div>

    </div>

  </div>

</body>
</html>
`;
      receiptWindow.document.write(htmlContent);
      receiptWindow.document.close();

        setMessage({
        type: "success",
        text: "Kwitansi HTML berhasil dibuka di tab baru. Silakan simpan atau cetak.",
      });
    } catch (error) {
      console.error("❌ Error generating receipt:", error);
      setMessage({
        type: "error",
        text: "Gagal mengunduh kwitansi: " + (error.message || "Unknown error"),
      });
    }
  };           

  const downloadInvoice = async (payment, options = {}) => {
    const validation = paymentUtils.validatePayment(payment);
    if (!validation.isValid) {
      setMessage({
        type: "error",
        text: "Data pembayaran tidak valid: " + validation.error,
      });
      return;
    }

              if (!payment.invoice_number) {
      setMessage({
        type: "error",
        text: "Invoice belum tersedia untuk pembayaran ini.",
      });
      return;
    }

    const { installment } = options || {};

              const totalAmount = paymentUtils.parseFloatSafe(
      payment.program_training_cost || payment.amount || 0
    );
    const amountPaid = paymentUtils.parseFloatSafe(payment.amount_paid || 0);
    const remaining = paymentUtils.calculateRemainingSafe(totalAmount, amountPaid);

             let context = null;
    if (installment) {
      context = paymentUtils.getInstallmentContext(payment, installment);
      if (!context || (!context.invoiceAvailable && context.amount <= 0)) {
        setMessage({
          type: "error",
          text: `Invoice untuk cicilan ${installment} belum tersedia.`,
        });
        return;
      }
    }

    const currentInstallmentAmount = getDisplayAmount(payment);
    let invoiceAmountValue = context?.amount && context.amount > 0
      ? context.amount
      : currentInstallmentAmount && currentInstallmentAmount > 0
        ? currentInstallmentAmount
        : paymentUtils.parseFloatSafe(payment.amount || remaining || totalAmount);

    if (!invoiceAmountValue || invoiceAmountValue <= 0) {
      invoiceAmountValue = remaining > 0 ? remaining : totalAmount;
    }

    const amountInWords = paymentUtils.numberToWords(invoiceAmountValue);
    const invoiceDateObj = context?.invoiceIssuedAt
      ? new Date(context.invoiceIssuedAt)
      : payment.updated_at
      ? new Date(payment.updated_at)
      : payment.created_at
      ? new Date(payment.created_at)
      : new Date();
    const invoiceDate = invoiceDateObj.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const dueDateObj = context?.dueDate
      ? new Date(context.dueDate)
      : payment.due_date
      ? new Date(payment.due_date)
      : null;
    const dueDate = dueDateObj
      ? dueDateObj.toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "-";
    const dueTime = dueDateObj
      ? dueDateObj.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
    const dueDisplay = dueDateObj
      ? `${dueDate}${dueTime ? `, pukul ${dueTime} WIB` : ""}`
      : "-";

    const escapeHtml = (value) =>
      (value ?? "-")
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const metadata = {
      invoiceNumber: escapeHtml(payment.invoice_number || "-"),
      participantName: escapeHtml(payment.full_name || user?.full_name || "-"),
      participantAddress: escapeHtml(payment.address || "-"),
      programName: escapeHtml(payment.program_name || "-"),
       paymentLabel: escapeHtml(
        context?.label || paymentUtils.getInstallmentText(payment)
      ),
      notes:
       context?.entry?.notes
          ? escapeHtml(context.entry.notes)
          : payment.notes
          ? escapeHtml(payment.notes)
          : "Mohon menyelesaikan pembayaran sebelum jatuh tempo dan unggah bukti pembayaran melalui dashboard peserta.",
    };

    const formatted = {
      invoiceAmount: paymentUtils.formatCurrency(invoiceAmountValue),
      totalAmount: paymentUtils.formatCurrency(totalAmount),
      amountPaid: paymentUtils.formatCurrency(amountPaid),
      remaining: paymentUtils.formatCurrency(remaining),
      amountWords: escapeHtml(amountInWords),
    };

    try {
      const params = new URLSearchParams();
      if (installment) {
        params.append("installment", installment);
      }
      const queryString = params.toString();

      try {
        const response = await axios.get(
          `/api/payments/${payment.id}/invoice${queryString ? `?${queryString}` : ""}`,
          {
            responseType: "blob",
            timeout: 15000,
          }
        );

              const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        const suffix = installment ? `-cicilan-${installment}` : "";
        link.setAttribute(
          "download",
          `invoice-${payment.invoice_number}${suffix}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setMessage({
          type: "success",
          text: "Invoice PDF berhasil diunduh",
        });
        return;
      } catch (pdfError) {
        console.log("PDF invoice not available, generating HTML invoice...", pdfError);
      }

      const invoiceWindow = window.open("", "_blank");
      if (!invoiceWindow) {
        setMessage({
          type: "error",
          text: "Popup diblokir. Izinkan popup untuk generate invoice.",
        });
        return;
      }

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>INVOICE - ${metadata.invoiceNumber}</title>
  <meta charset="UTF-8" />
  <style>
    /* Reset & Base Styles */
    *, *::before, *::after { box-sizing: border-box; }
    body { 
      font-family: Arial, Helvetica, sans-serif; 
      font-size: 14px; /* Ukuran standar surat */
      line-height: 1.4; 
      color: #000; 
      background: #fff; 
      margin: 0; 
      padding: 0; 
    }

    /* Page Container (A4 Simulation) */
    .document { 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 40px 50px; 
      background: #ffffff; 
      position: relative;
    }

    /* HEADER */
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
    }
    
    .logo-section {
      width: 40%;
    }
    /* Ganti src ini dengan URL logo Fitalenta Anda */
    .logo-img {
      max-width: 200px; 
      height: auto;
      display: block;
    }

    .company-address {
      width: 55%;
      font-size: 10px; /* Font alamat kecil seperti di gambar */
      text-align: left;
      color: #333;
      line-height: 1.4;
    }
    .company-name-bold {
      font-weight: bold;
      font-size: 11px;
    }

    /* CONTENT BODY */
    .date-section { margin-bottom: 20px; }
    .ref-number { margin-bottom: 20px; }
    
    .recipient-section { margin-bottom: 20px; }
    .recipient-name { font-weight: bold; }
    
    .subject-line { 
      font-weight: bold; 
      text-decoration: underline;
      margin-bottom: 25px;
    }

    .greeting { 
      font-style: italic; 
      margin-bottom: 15px; 
    }
    
    .opening-text {
      text-align: justify;
      margin-bottom: 15px;
    }

    /* THE INVOICE BOX (KOTAK TAGIHAN) */
    .invoice-box {
      border: 2px solid #000; /* Border hitam tebal */
      padding: 15px;
      margin: 10px 0 25px 0;
      font-size: 14px;
    }

    .row {
      display: flex;
      margin-bottom: 8px;
      align-items: flex-start;
    }
    .row:last-child { margin-bottom: 0; }

    .col-label {
      width: 160px;
      font-weight: bold;
      flex-shrink: 0;
    }
    .col-separator {
      width: 15px;
      text-align: center;
      flex-shrink: 0;
    }
    .col-value {
      flex-grow: 1;
    }

    /* DISCLAIMER TEXT */
    .disclaimer {
      text-align: justify;
      margin-bottom: 15px;
      font-size: 14px;
    }

    .closing-greeting {
      font-style: italic;
      margin-top: 20px;
      margin-bottom: 30px;
    }

    /* SIGNATURE SECTION */
    .signature-section {
      margin-top: 30px;
    }
    
    .signature-box {
      width: 250px; /* Batasi lebar area tanda tangan */
    }

    /* Ganti src dengan gambar tanda tangan + stempel transparan */
    .sig-img {
      height: 80px; 
      margin: 5px 0;
      display: block;
    }

    .signer-name {
      font-weight: bold;
      text-decoration: underline;
    }

    /* FOOTER (Bottom Right) */
    .footer-text {
      margin-top: 60px;
      text-align: right;
      font-size: 10px;
      color: #000;
    }

    /* Print Optimization */
    @media print {
      body { padding: 0; }
      .document { width: 100%; max-width: none; padding: 20px; }
    }
  </style>
</head>
<body>

  <div class="document">
    
    <div class="header-container">
      <div class="logo-section">
        <img src="https://registrasi.fitalenta.co.id/images/logo/fitalenta_2024.png" alt="Fitalenta" class="logo-img">
      </div>
      <div class="company-address">
        <div class="company-name-bold">PT FAST Indo Talenta</div>
        Gedung Science and Techno Park ITB<br>
        Jl. Ganesa No. 15F, Lb. Siliwangi, Kec. Coblong, Kota Bandung, 40132<br>
        +62 81110119273<br>
        fitalenta.co.id
      </div>
    </div>

    <div class="date-section">
      Bandung, ${invoiceDate}
    </div>

    <div class="ref-number">
      No: ${metadata.invoiceNumber}
    </div>

    <div class="recipient-section">
      Kepada Yth.<br>
      <span class="recipient-name">${metadata.participantName}</span><br>
      Di tempat
    </div>

    <div class="subject-line">
      Perihal: Invoice ${metadata.paymentLabel} ${metadata.programName}
    </div>

    <div class="greeting">
      Assalamu’alaikum Warahmatullahi Wabarakatuh.
    </div>

    <div class="opening-text">
      Salam hormat,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Terimakasih atas kepercayaan yang diberikan kepada PT FAST Indo Talenta untuk ikut serta dalam pengiriman tenaga kerja melalui Program ${metadata.programName}. Bersama ini kami sampaikan tagihan biaya ${metadata.programName} melalui skema cicilan.
    </div>

    <div class="invoice-box">
      <div class="row">
        <div class="col-label">Nama Program</div>
        <div class="col-separator">:</div>
        <div class="col-value">${metadata.programName}</div>
      </div>
      
      <div class="row">
        <div class="col-label">Tagihan</div>
        <div class="col-separator">:</div>
        <div class="col-value">${formatted.invoiceAmount}</div>
      </div>

      <div class="row">
        <div class="col-label">Rincian Tagihan</div>
        <div class="col-separator">:</div>
        <div class="col-value">${metadata.paymentLabel} & Biaya Program</div>
      </div>

      <div class="row">
        <div class="col-label">Rekening Tujuan</div>
        <div class="col-separator">:</div>
        <div class="col-value">
          PT FAST Indo Talenta<br>
          Nomor Rekening BCA 2828339333
        </div>
      </div>

      <div class="row">
        <div class="col-label">Catatan</div>
        <div class="col-separator">:</div>
        <div class="col-value">Batas akhir pembayaran s.d ${escapeHtml(dueDisplay)}</div>
      </div>
    </div>

    <div class="disclaimer">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sesuai dengan ketentuan yang berlaku, <strong>seluruh pembayaran yang telah dibayarkan tidak dapat dikembalikan dengan alasan apa pun</strong>. Harap dapat melakukan pengecekan kembali atas rincian invoice yang Anda terima. Demikian invoice yang kami berikan, atas perhatian Anda kami ucapkan terimakasih.
    </div>

    <div class="closing-greeting">
      Wassalamu’alaikum Warahmatullahi Wabarakatuh.
    </div>

    <div class="signature-section">
      <div class="signature-box">
        Hormat Kami,<br>
        
        <img src="signature.jpg" alt="Tanda Tangan" style="height: 60px; margin: 10px 0; opacity: 0.5;">
        
        <div class="signer-name">Ii Ratna Yanti Kosasih</div>
        General Manager
      </div>
    </div>

    <div class="footer-text">
      Fathanah | Amanah | Shiddiq | Tabligh
    </div>

  </div>
</body>
</html>
`;

      invoiceWindow.document.write(htmlContent);
      invoiceWindow.document.close();

       setMessage({
        type: "success",
        text: "Invoice HTML berhasil dibuka di tab baru. Silakan simpan atau cetak.",
      });
    } catch (error) {
      console.error("❌ Error generating invoice:", error);
      setMessage({
        type: "error",
        text: "Gagal mengunduh invoice: " + (error.message || "Unknown error"),
      });
    }
  };

   const handleShowDetail = async (payment) => {
    const validation = paymentUtils.validatePayment(payment);
    if (!validation.isValid) {
      setMessage({
        type: "error",
        text: "Data pembayaran tidak valid: " + validation.error,
      });
      return;
    }

    if (detailLoading) return;

    try {
      setDetailLoading(true);
      const response = await axios.get(`/api/payments/${payment.id}`, {
        timeout: 15000,
      });

      if (response.data?.success) {
        setSelectedPayment(response.data.data);
        setShowDetailModal(true);
      } else {
        throw new Error(response.data?.message || "Gagal memuat detail pembayaran");
      }
    } catch (error) {
      console.error("❌ Error fetching payment detail:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Gagal memuat detail pembayaran";
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedPayment(null);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setSelectedPayment(null);
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setMessage({ type: "", text: "" });
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
    const payment = payments.find((p) => p.id === alert.paymentId);
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
    } else if (alert.action === "view_proof" && payment.proof_image) {
      handleShowProof(payment);
    }
  };

  const dismissAlert = (index) => {
    setPaymentAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  const dismissAllAlerts = () => {
    setPaymentAlerts([]);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="text-center">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Memuat data pembayaran...</p>
          </div>
        </div>
      </div>
    );
  }

  const alertCounts = {
    danger: paymentAlerts.filter((alert) => alert.type === "danger").length,
    warning: paymentAlerts.filter((alert) => alert.type === "warning").length,
    primary: paymentAlerts.filter((alert) => alert.type === "primary").length,
    secondary: paymentAlerts.filter((alert) => alert.type === "secondary")
      .length,
    info: paymentAlerts.filter((alert) => alert.type === "info").length,
    success: paymentAlerts.filter((alert) => alert.type === "success").length,
  };

  const renderPaymentRow = (payment) => {
    const progress = safeCalculateProgress(payment);
    const isPaymentOverdue = paymentUtils.isOverdue(payment);
    const hasActiveInvoice = paymentUtils.hasActiveInvoice(payment);
    const isWaitingForInvoice = paymentUtils.isWaitingForInvoice(payment);
    const isWaitingVerification = paymentUtils.isWaitingVerification(payment);
    const currentAmount = getDisplayAmount(payment);

    const currentInfo = paymentUtils.getCurrentInstallmentInfo(payment);
    const nextInfo = paymentUtils.getNextInstallmentInfo(payment);

    return (
      <tr key={payment.id}>
        <td>
          <div>
            <strong className="d-block">
              {payment.invoice_number}
            </strong>
            {payment.receipt_number && (
              <small className="text-success">
                Kwitansi: {payment.receipt_number}
              </small>
            )}

            {isWaitingVerification && (
              <div className="small text-warning mt-1">
                <i className="bi bi-hourglass-split me-1"></i>
                <strong>Menunggu Verifikasi {currentInfo.text}</strong>
              </div>
            )}

            {/* Informasi cicilan aktif */}
            {hasActiveInvoice && !isWaitingVerification && (
              <div className="small text-primary mt-1">
                <strong>
                  {currentAmount > 0
                    ? `Tagihan ${currentInfo.text}: ${paymentUtils.formatCurrency(currentAmount)}`
                    : `Tagihan ${currentInfo.text}`}
                </strong>
              </div>
            )}

            {/* Informasi: Menunggu Tagihan */}
            {isWaitingForInvoice && nextInfo.exists && !isWaitingVerification && (
              <div className="small text-primary mt-1">
                <i className="bi bi-clock me-1"></i>
                <strong>Menunggu {nextInfo.text} dari Admin</strong>
              </div>
            )}

            {/* Informasi: Cicilan sudah dibayar, menunggu berikutnya */}
            {currentInfo.isPaid && nextInfo.exists && !hasActiveInvoice && !isWaitingVerification && (
              <div className="small text-success mt-1">
                <i className="bi bi-check-circle me-1"></i>
                <strong>{currentInfo.text}</strong>
              </div>
            )}
          </div>
        </td>
        <td>
          <div className="fw-bold">
            {payment.program_name}
          </div>
          <div className="small text-muted">
            {payment.program_duration}
          </div>
          <div className="small">
            <strong>
              Total:{" "}
              {paymentUtils.formatCurrency(
                payment.program_training_cost
              )}
            </strong>
          </div>
          <div className="small text-muted">
            Plan:{" "}
            {payment.program_installment_plan ||
              "4 cicilan"}
          </div>
        </td>
        <td>
          <div
            className="progress"
            style={{ height: "20px" }}
          >
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${progress}%` }}
            >
              {progress.toFixed(0)}%
            </div>
          </div>
          <div className="small text-center mt-1">
            {paymentUtils.formatCurrency(
              payment.amount_paid || 0
            )}{" "}
            /{" "}
            {paymentUtils.formatCurrency(
              payment.program_training_cost || 0
            )}
          </div>
          {progress < 100 && (
            <div className="small text-muted text-center">
              Sisa:{" "}
              {paymentUtils.formatCurrency(
                safeCalculateRemaining(payment)
              )}
            </div>
          )}
        </td>
        <td>
          <div>
            {paymentUtils.getStatusBadge(payment.status)}

            {/* Status Menunggu Verifikasi */}
            {isWaitingVerification && (
              <div className="small text-warning mt-1">
                <i className="bi bi-hourglass-split me-1"></i>
                Menunggu Verifikasi Admin
              </div>
            )}

            {/* Informasi cicilan */}
            {hasActiveInvoice && payment.due_date && !isWaitingVerification && (
              <div
                className={`small mt-1 ${isPaymentOverdue
                  ? "text-danger fw-bold"
                  : "text-muted"
                  }`}
              >
                <i className="bi bi-calendar-event me-1"></i>
                {currentInfo.text} - Jatuh tempo:{" "}
                {formatDate(payment.due_date)}
                {isPaymentOverdue && (
                  <span className="badge bg-danger ms-1">
                    Terlambat
                  </span>
                )}
              </div>
            )}

            {/* Informasi: Menunggu Tagihan */}
            {isWaitingForInvoice && nextInfo.exists && !isWaitingVerification && (
              <div className="small text-primary mt-1">
                <i className="bi bi-clock me-1"></i>
                Menunggu {nextInfo.text}
              </div>
            )}

            {/* Informasi: Cicilan sudah dibayar, menunggu berikutnya */}
            {currentInfo.isPaid && nextInfo.exists && !hasActiveInvoice && !isWaitingVerification && (
              <div className="small text-success mt-1">
                <i className="bi bi-check-circle me-1"></i>
                {currentInfo.text} sudah dibayar, menunggu {nextInfo.text}
              </div>
            )}

            {/* Informasi: Sudah Lunas */}
            {payment.status === "paid" && (
              <div className="small text-success mt-1">
                <i className="bi bi-check-circle me-1"></i>
                Pembayaran lunas
              </div>
            )}
          </div>
        </td>

        <td>
          {payment.receipt_number ? (
            <span className="badge bg-success">
              {payment.receipt_number}
            </span>
          ) : (
            <span className="badge bg-secondary">-</span>
          )}
        </td>
        <td>
          <div className="btn-group btn-group-sm">
            {/* Upload button hanya jika ada tagihan aktif dan perlu upload */}
            {canUploadProof(payment) && (
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  setSelectedPayment(payment);
                  setShowUploadModal(true);
                }}
                title="Upload Bukti Bayar"
              >
                <i className="bi bi-upload"></i>
              </button>
            )}

            {/* View Proof Button jika sudah upload */}
            {payment.proof_image && (
              <button
                className="btn btn-outline-primary"
                onClick={() => handleShowProof(payment)}
                title="Lihat Bukti Pembayaran"
              >
                <i className="bi bi-eye"></i>
              </button>
            )}

            {canDownloadInvoice(payment) && (
              <button
                className="btn btn-outline-primary"
                onClick={() => downloadInvoice(payment)}
                title="Download Invoice"
              >
                <i className="bi bi-file-earmark-arrow-down"></i>
              </button>
            )}


      

            {/* View Details Button */}
            <button
              className="btn btn-outline-primary"
              onClick={() => handleShowDetail(payment)}
              title="Lihat Detail Pembayaran"
            >
              <i className="bi bi-info-circle"></i>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h2>Manajemen Pembayaran</h2>
          <p className="text-muted">Kelola pembayaran program magang Anda</p>

          {/* Quick Status Summary */}
          {paymentAlerts.length > 0 && (
            <div className="alert alert-warning mb-0 mt-2">
              <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>
                  <strong>
                    Perhatian: Anda memiliki {paymentAlerts.length}{" "}
                    pemberitahuan
                  </strong>
                  <div className="mt-1">
                    {alertCounts.danger > 0 && (
                      <span className="badge bg-danger me-2">
                        <i className="bi bi-flag-fill me-1"></i>
                        Terlambat: {alertCounts.danger}
                      </span>
                    )}
                    {alertCounts.warning > 0 && (
                      <span className="badge bg-warning text-dark me-2">
                        <i className="bi bi-clock me-1"></i>
                        Akan Jatuh Tempo: {alertCounts.warning}
                      </span>
                    )}
                    {alertCounts.primary > 0 && (
                      <span className="badge bg-primary me-2">
                        <i className="bi bi-upload me-1"></i>
                        Perlu Upload: {alertCounts.primary}
                      </span>
                    )}
                    {alertCounts.secondary > 0 && (
                      <span className="badge bg-secondary me-2">
                        <i className="bi bi-hourglass-split me-1"></i>
                        Menunggu Verifikasi: {alertCounts.secondary}
                      </span>
                    )}
                    {alertCounts.info > 0 && (
                      <span className="badge bg-info me-2">
                        <i className="bi bi-info-circle me-1"></i>
                        Informasi: {alertCounts.info}
                      </span>
                    )}
                    {alertCounts.success > 0 && (
                      <span className="badge bg-success me-2">
                        <i className="bi bi-check-circle me-1"></i>
                        Lunas: {alertCounts.success}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert Message */}
      {message.text && (
        <div
          className={`alert alert-${message.type === "error"
            ? "danger"
            : message.type === "success"
              ? "success"
              : "info"
            } alert-dismissible fade show`}
          role="alert"
        >
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage({ type: "", text: "" })}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Payment Alerts Section */}
      {paymentAlerts.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  <i className="bi bi-bell-fill me-2"></i>
                  Pemberitahuan Pembayaran
                </h6>
                <span className="badge bg-light text-primary">
                  {paymentAlerts.length}
                </span>
              </div>
              <div className="card-body p-0">
                {paymentAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`alert alert-${alert.type} alert-dismissible fade show m-3 mb-2`}
                    role="alert"
                  >
                    <div className="d-flex align-items-start">
                      <i className={`bi ${alert.icon} me-3 mt-1 fs-5`}></i>
                      <div className="flex-grow-1">
                        <h6 className="alert-heading mb-1">{alert.title}</h6>
                        <p className="mb-1">{alert.message}</p>
                        {alert.amount > 0 && (
                          <p className="mb-1">
                            <strong>
                              Jumlah:{" "}
                              {paymentUtils.formatCurrency(alert.amount)}
                            </strong>
                          </p>
                        )}
                        {alert.dueDate && (
                          <small className="text-muted">
                            <i className="bi bi-calendar-event me-1"></i>
                            Jatuh tempo: {formatDate(alert.dueDate)}
                          </small>
                        )}
                      </div>
                      <div className="ms-3 d-flex flex-column gap-1">
                        {alert.action === "upload" && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleAlertAction(alert)}
                          >
                            <i className="bi bi-upload me-1"></i>
                            Upload
                          </button>
                        )}
                        {alert.action === "view_proof" && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleAlertAction(alert)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Lihat Bukti
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => dismissAlert(index)}
                          aria-label="Close"
                        ></button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Quick Actions */}
                <div className="p-3 bg-light border-top">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {paymentAlerts.length} pemberitahuan aktif
                    </small>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={dismissAllAlerts}
                    >
                      <i className="bi bi-eye-slash me-1"></i>
                      Sembunyikan Semua
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Information Card */}
      <div className="alert alert-info mb-4">
        <h6>
          <i className="bi bi-info-circle me-2"></i>Informasi Sistem Pembayaran
        </h6>
        <ol className="mb-2">
          <li>Admin menerbitkan tagihan cicilan 1 setelah Anda dinyatakan lolos interview</li>
          <li>Anda melakukan pembayaran dan upload bukti</li>
          <li>Admin memverifikasi pembayaran (1-2 hari kerja)</li>
          <li>Setelah verifikasi, admin akan menerbitkan tagihan cicilan berikutnya</li>
          <li>Proses berulang hingga pembayaran lunas</li>
        </ol>
        <p className="mb-0">
          <strong>Note:</strong> Jika status "Menunggu Tagihan Admin", silakan tunggu admin menerbitkan tagihan berikutnya.
        </p>
      </div>

      {/* Payments List */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Invoice Pembayaran</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={fetchPayments}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
            <div className="card-body">
              {payments.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-muted mb-3">
                    <i className="bi bi-receipt display-4"></i>
                  </div>
                  <h5>Belum ada pembayaran</h5>
                  <p className="text-muted">
                    Setelah mendaftar program dan lolos interview, invoice
                    pembayaran akan muncul di sini.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover text-center">
                    <thead className="table-light align-middle">
                      <tr>
                        <th>Invoice</th>
                        <th>Program & Biaya</th>
                        <th>Progress Pembayaran</th>
                        <th>Status & Jatuh Tempo</th>
                        <th>Kwitansi</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="align-middle">
                      {payments.map(renderPaymentRow)}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Proof Modal */}
      {showUploadModal && selectedPayment && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-upload me-2"></i>
                  Upload Bukti Pembayaran
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseUploadModal}
                  disabled={uploading}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Setelah upload, admin akan memverifikasi pembayaran Anda.
                  Status akan diperbarui dalam 1-2 hari kerja.
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6>Informasi Pembayaran</h6>
                    <p>
                      <strong>Invoice:</strong> {selectedPayment.invoice_number}
                    </p>
                    <p>
                      <strong>Program:</strong> {selectedPayment.program_name}
                    </p>
                    <p>
                      <strong>Cicilan:</strong>{" "}
                      {paymentUtils.getInstallmentText(selectedPayment)}
                    </p>
                    <p>
                      <strong>Jumlah yang Harus Dibayar:</strong>{" "}
                      <span className="fw-bold text-primary">
                        {paymentUtils.formatCurrency(
                          getDisplayAmount(selectedPayment)
                        )}
                      </span>
                    </p>
                    {selectedPayment.due_date && (
                      <p
                        className={
                          paymentUtils.isOverdue(selectedPayment)
                            ? "text-danger fw-bold"
                            : ""
                        }
                      >
                        <strong>Jatuh Tempo:</strong>{" "}
                        {formatDate(selectedPayment.due_date)}
                        {paymentUtils.isOverdue(selectedPayment) && (
                          <span className="badge bg-danger ms-2">
                            TERLAMBAT
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6>Detail Biaya</h6>
                    <p>
                      <strong>Total Biaya:</strong>{" "}
                      {paymentUtils.formatCurrency(
                        selectedPayment.program_training_cost || 0
                      )}
                    </p>
                    <p>
                      <strong>Sudah Dibayar:</strong>{" "}
                      {paymentUtils.formatCurrency(
                        selectedPayment.amount_paid || 0
                      )}
                    </p>
                    <p>
                      <strong>Sisa Tagihan:</strong>{" "}
                      {paymentUtils.formatCurrency(
                        safeCalculateRemaining(selectedPayment)
                      )}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="proofFile" className="form-label">
                    Pilih File Bukti Pembayaran *
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="proofFile"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                  <div className="form-text">
                    Format: JPG, PNG, GIF (Maksimal 5MB)
                  </div>
                </div>

                {previewUrl && (
                  <div className="mb-3">
                    <h6>Preview:</h6>
                    <img
                      src={previewUrl}
                      alt="Preview bukti pembayaran"
                      className="img-fluid rounded border"
                      style={{ maxHeight: "300px" }}
                      onError={(e) => {
                        console.error("Error loading preview image");
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {file && (
                  <div className="alert alert-primary">
                    <strong>File terpilih:</strong> {file.name}
                    <br />
                    <small>
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </small>
                  </div>
                )}

                {paymentUtils.isOverdue(selectedPayment) && (
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Pembayaran ini sudah melewati batas waktu. Segera lakukan
                    pembayaran untuk menghindari konsekuensi.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseUploadModal}
                  disabled={uploading}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUploadProof}
                  disabled={!file || uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-upload me-2"></i>Upload Bukti
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Proof Modal */}
      {showProofModal && selectedPayment && selectedPayment.proof_image && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-eye me-2"></i>
                  Bukti Pembayaran - {selectedPayment.invoice_number}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseProofModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={paymentUtils.getImageUrl(selectedPayment.proof_image)}
                  alt="Bukti Pembayaran"
                  className="img-fluid rounded border"
                  style={{ maxHeight: "70vh" }}
                  onError={(e) => {
                    console.error("Error loading proof image");
                    e.target.style.display = "none";
                    setMessage({
                      type: "error",
                      text: "Gagal memuat gambar bukti pembayaran",
                    });
                  }}
                />
                <div className="mt-3">
                  <p>
                    <strong>Status:</strong> {paymentUtils.getStatusBadge(selectedPayment.status)}
                  </p>
                  <p className="text-muted">
                    Admin akan memverifikasi pembayaran ini dalam 1-2 hari kerja.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseProofModal}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Payment Modal */}
      {showDetailModal && selectedPayment && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-receipt me-2"></i>Detail Invoice -{" "}
                  {paymentUtils.getInstallmentText(selectedPayment)}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDetail}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card mb-3">
                      <div className="card-header bg-primary text-white">
                        <h6 className="mb-0">Informasi Invoice</h6>
                      </div>
                      <div className="card-body">
                        <table className="table table-sm table-borderless">
                          <tbody>
                            <tr>
                              <td>
                                <strong>Nomor Invoice:</strong>
                              </td>
                              <td>{selectedPayment.invoice_number}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Nomor Kwitansi:</strong>
                              </td>
                              <td>
                                {selectedPayment.receipt_number ? (
                                  <span className="badge bg-success">
                                    {selectedPayment.receipt_number}
                                  </span>
                                ) : (
                                  <span className="badge bg-secondary">-</span>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Program:</strong>
                              </td>
                              <td>{selectedPayment.program_name}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Durasi:</strong>
                              </td>
                              <td>{selectedPayment.program_duration}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Plan Cicilan:</strong>
                              </td>
                              <td>
                                {selectedPayment.program_installment_plan ||
                                  "4 cicilan"}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Cicilan Saat Ini:</strong>
                              </td>
                              <td>
                                <strong>
                                  {paymentUtils.getInstallmentText(
                                    selectedPayment
                                  )}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Jumlah yang Harus Dibayar:</strong>
                              </td>
                              <td>
                                <strong>
                                  {paymentUtils.formatCurrency(
                                    getDisplayAmount(selectedPayment)
                                  )}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Jatuh Tempo:</strong>
                              </td>
                              <td>
                                {selectedPayment.due_date ? (
                                  <span
                                    className={
                                      paymentUtils.isOverdue(selectedPayment)
                                        ? "text-danger fw-bold"
                                        : ""
                                    }
                                  >
                                    {formatDate(selectedPayment.due_date)}
                                    {paymentUtils.isOverdue(
                                      selectedPayment
                                    ) && (
                                        <span className="badge bg-danger ms-2">
                                          TERLAMBAT
                                        </span>
                                      )}
                                  </span>
                                ) : (
                                  <span className="text-info">
                                    <i className="bi bi-clock me-1"></i>
                                    Menunggu tagihan dari admin
                                  </span>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card mb-3">
                      <div className="card-header bg-primary text-white">
                        <h6 className="mb-0">Status Pembayaran</h6>
                      </div>
                      <div className="card-body">
                        <table className="table table-sm table-borderless">
                          <tbody>
                            <tr>
                              <td>
                                <strong>Status:</strong>
                              </td>
                              <td>
                                {paymentUtils.getStatusBadge(
                                  selectedPayment.status
                                )}
                                {paymentUtils.isWaitingVerification(selectedPayment) && (
                                  <div className="small text-warning mt-1">
                                    <i className="bi bi-hourglass-split me-1"></i>
                                    Menunggu Verifikasi Admin
                                  </div>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Tanggal Invoice:</strong>
                              </td>
                              <td>{formatDate(selectedPayment.created_at)}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Tanggal Bayar:</strong>
                              </td>
                              <td>
                                {selectedPayment.payment_date
                                  ? formatDate(selectedPayment.payment_date)
                                  : "-"}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Terverifikasi Oleh:</strong>
                              </td>
                              <td>
                                {selectedPayment.verified_by
                                  ? "Admin"
                                  : "Belum diverifikasi"}
                              </td>
                            </tr>
                            {selectedPayment.proof_image && (
                              <tr>
                                <td>
                                  <strong>Bukti Pembayaran:</strong>
                                </td>
                                <td>
                                  <span className="badge bg-success me-2">
                                    Sudah diupload
                                  </span>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header bg-primary text-white">
                    <h6 className="mb-0">Progress Pembayaran</h6>
                  </div>
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-md-4">
                        <div className="border rounded p-3">
                          <h5 className="text-primary">
                            {paymentUtils.formatCurrency(
                              selectedPayment.program_training_cost || 0
                            )}
                          </h5>
                          <small className="text-muted">
                            Total Biaya Program
                          </small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="border rounded p-3">
                          <h5 className="text-success">
                            {paymentUtils.formatCurrency(
                              selectedPayment.amount_paid || 0
                            )}
                          </h5>
                          <small className="text-muted">Sudah Dibayar</small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="border rounded p-3">
                          <h5 className="text-warning">
                            {paymentUtils.formatCurrency(
                              safeCalculateRemaining(selectedPayment)
                            )}
                          </h5>
                          <small className="text-muted">Sisa Tagihan</small>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="progress" style={{ height: "25px" }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{
                            width: `${safeCalculateProgress(selectedPayment)}%`,
                          }}
                        >
                          {safeCalculateProgress(selectedPayment).toFixed(0)}%
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mt-1">
                        <small>0%</small>
                        <small>100%</small>
                      </div>
                    </div>
                  </div>
                </div>

<div className="card mb-3">
                  <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Progress Cicilan</h6>
                  </div>
                  <div className="card-body">
                    {installmentRows.length === 0 ? (
                      <p className="text-muted mb-0">Belum ada data cicilan.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-sm align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Cicilan</th>
                              <th>Nominal</th>
                              <th>Jatuh Tempo</th>
                              <th>Status</th>
                              <th className="text-center">Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {installmentRows.map((row) => (
                              <tr key={row.installment}>
                                <td>
                                  <strong>Cicilan {row.installment}</strong>
                                  {row.invoiceIssuedAt && (
                                    <div className="text-muted small">
                                      Terbit: {formatDate(row.invoiceIssuedAt)}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  {row.invoiceAvailable || row.receiptAvailable || row.paidAt ? (
                                    <>
                                      {paymentUtils.formatCurrency(row.amount)}
                                      {row.paidAt && (
                                        <div className="text-muted small">
                                          Dibayar: {formatDate(row.paidAt)}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-muted fst-italic">Belum diterbitkan</span>
                                  )}
                                </td>

                                <td>{row.dueDate ? formatDate(row.dueDate) : "-"}</td>
                                <td>
                                  <span className={`badge bg-${row.statusVariant}`}>
                                    {row.statusLabel}
                                  </span>
                                  {row.receiptNumber && (
                                    <div className="text-muted small mt-1">
                                      Kwitansi: {row.receiptNumber}
                                    </div>
                                  )}
                                </td>
                                <td className="text-center">
                                  <div className="btn-group btn-group-sm">
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary"
                                      disabled={!row.invoiceAvailable || detailLoading}
                                      onClick={() =>
                                        downloadInvoice(selectedPayment, {
                                          installment: row.installment,
                                        })
                                      }
                                      title={`Download invoice cicilan ${row.installment}`}
                                    >
                                      <i className="bi bi-file-earmark-arrow-down"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary"
                                      disabled={!row.receiptAvailable || detailLoading}
                                      onClick={() =>
                                        downloadReceipt(selectedPayment, {
                                          installment: row.installment,
                                        })
                                      }
                                      title={`Download kwitansi cicilan ${row.installment}`}
                                    >
                                      <i className="bi bi-download"></i>
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

                {selectedPayment.payment_method && (
                  <div className="card mb-3">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0">Metode Pembayaran</h6>
                    </div>
                    <div className="card-body">
                      <table className="table table-sm table-borderless">
                        <tbody>
                          <tr>
                            <td width="30%">
                              <strong>Metode:</strong>
                            </td>
                            <td>{selectedPayment.payment_method}</td>
                          </tr>
                          {selectedPayment.bank_name && (
                            <tr>
                              <td>
                                <strong>Bank:</strong>
                              </td>
                              <td>{selectedPayment.bank_name}</td>
                            </tr>
                          )}
                          {selectedPayment.account_number && (
                            <tr>
                              <td>
                                <strong>No. Rekening:</strong>
                              </td>
                              <td>{selectedPayment.account_number}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedPayment.notes && (
                  <div className="card">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0">Catatan</h6>
                    </div>
                    <div className="card-body">
                      <p className="mb-0">{selectedPayment.notes}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseDetail}
                >
                  Tutup
                </button>
                {/* {canDownloadReceipt(selectedPayment) && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      downloadReceipt(selectedPayment);
                      handleCloseDetail();
                    }}
                  >
                    <i className="bi bi-download me-2"></i>Download Kwitansi
                  </button>
                )} */}
                {canUploadProof(selectedPayment) && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      handleCloseDetail();
                      setSelectedPayment(selectedPayment);
                      setShowUploadModal(true);
                    }}
                  >
                    <i className="bi bi-upload me-2"></i>Upload Bukti Bayar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
=======
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
        return path.startsWith("/") ? path : `/${path}`;
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
>>>>>>> perbaikan-website-fitalenta
};

export default Payment;