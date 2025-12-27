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
        <img src="logo-fitalenta.png" alt="Logo Fitalenta" />
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
          <td class="value">${metadata.programName}</td>
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
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            *, *::before, *::after { box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: #f1f5ff; margin: 0; padding: 40px; color: #1f2937; }
            .document { max-width: 820px; margin: auto; background: #ffffff; border-radius: 20px; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.14); padding: 48px; position: relative; overflow: hidden; }
            .accent-bar { height: 6px; background: linear-gradient(90deg, #0b4a99, #1b75bc); margin: -48px -48px 32px; border-radius: 0 0 18px 18px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; }
            .brand { font-size: 34px; font-weight: 700; color: #0b4a99; letter-spacing: 0.12em; text-transform: uppercase; }
            .tagline { margin-top: 6px; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #94a3b8; }
            .company-info { text-align: right; font-size: 12px; line-height: 1.6; color: #64748b; }
            .meta { margin-top: 24px; display: flex; justify-content: space-between; color: #1f2937; }
            .recipient { margin-top: 32px; line-height: 1.8; font-size: 14px; }
            .recipient strong { font-size: 16px; color: #0b4a99; }
            .subject { margin-top: 28px; font-size: 15px; font-weight: 600; color: #0b4a99; text-transform: uppercase; letter-spacing: 0.12em; }
            .paragraph { margin-top: 18px; line-height: 1.8; font-size: 14px; color: #1f2937; }
            .detail-box { margin-top: 28px; border: 1px solid #dbe4ff; border-radius: 16px; padding: 24px; background: #f8fbff; font-size: 14px; }
            .detail-row { display: grid; grid-template-columns: 180px 1fr; gap: 12px; padding: 10px 0; border-bottom: 1px dashed #dbe4ff; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { font-weight: 600; color: #0f172a; text-transform: uppercase; font-size: 12px; letter-spacing: 0.08em; }
            .detail-value { color: #1f2937; }
            .amount-box { margin-top: 28px; background: linear-gradient(135deg, #0b4a99, #1b75bc); color: #ffffff; border-radius: 18px; padding: 32px; text-align: center; box-shadow: 0 22px 50px rgba(16, 76, 129, 0.3); }
            .amount-box .label { text-transform: uppercase; letter-spacing: 0.28em; font-size: 12px; opacity: 0.75; }
            .amount-box .value { margin-top: 12px; font-size: 34px; font-weight: 700; }
            .amount-box .words { margin-top: 10px; font-size: 14px; opacity: 0.85; }
            .closing { margin-top: 28px; line-height: 1.8; font-size: 14px; }
            .signature { margin-top: 48px; text-align: right; font-size: 14px; color: #0f172a; }
            .signature .line { width: 240px; height: 1px; background: #cbd5f5; margin: 60px 0 12px auto; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; line-height: 1.6; letter-spacing: 0.12em; }
            @media print {
              body { background: #ffffff !important; padding: 0 !important; }
              .document { box-shadow: none !important; margin: 0 !important; }
            }
          </style>
        </head>
        <body>
          <div class="document">
            <div class="accent-bar"></div>
            <div class="header">
              <div>
                <div class="brand">FITALENTA</div>
                <div class="tagline">Empowering People</div>
              </div>
              <div class="company-info">
                Jl. Ganesa No.15E, Lb. Siliwangi, Kec. Coblong Bandung 40132<br />
                Telp: (021) 123-4567<br />
                Email: admin@fitalenta.com
              </div>
            </div>
<div class="meta">
              <div>Bandung, ${invoiceDate}</div>
              <div><strong>No: ${metadata.invoiceNumber}</strong></div>
            </div>
            <div class="recipient">
              <p>Kepada Yth,</p>
              <p><strong>${metadata.participantName}</strong></p>
              <p>${metadata.participantAddress}</p>
              <p>di Tempat</p>
            </div>
            <div class="subject">Perihal: Invoice ${metadata.paymentLabel} Pelatihan dan Karantina Kerja Tokutei Ginou</div>
            <div class="paragraph">
              Assalamu'alaikum warahmatullahi wabarakatuh,<br /><br />
              Terima kasih atas kepercayaan Anda kepada PT FAST Indo Talenta. Bersama surat ini kami sampaikan tagihan ${metadata.paymentLabel.toLowerCase()} untuk Program ${metadata.programName}. Adapun rincian tagihan adalah sebagai berikut:
            </div>
            <div class="detail-box">
              <div class="detail-row"><span class="detail-label">Program</span><span class="detail-value">${metadata.programName}</span></div>
              <div class="detail-row"><span class="detail-label">Nomor Invoice</span><span class="detail-value">${metadata.invoiceNumber}</span></div>
              <div class="detail-row"><span class="detail-label">Jenis Pembayaran</span><span class="detail-value">${metadata.paymentLabel}</span></div>
              <div class="detail-row"><span class="detail-label">Jumlah Tagihan</span><span class="detail-value">${formatted.invoiceAmount}</span></div>
              <div class="detail-row"><span class="detail-label">Terbilang</span><span class="detail-value">${formatted.amountWords}</span></div>
              <div class="detail-row"><span class="detail-label">Jatuh Tempo</span><span class="detail-value">${escapeHtml(dueDisplay)}</span></div>
              <div class="detail-row"><span class="detail-label">Rekening Pembayaran</span><span class="detail-value">BCA Cab. Maranatha Bandung<br />No. Rekening: 2828339333 a.n PT FAST Indo Talenta</span></div>
              <div class="detail-row"><span class="detail-label">Catatan</span><span class="detail-value">${metadata.notes}</span></div>
            </div>
            <div class="amount-box">
              <div class="label">Jumlah Tagihan</div>
              <div class="value">${formatted.invoiceAmount}</div>
              <div class="words">${formatted.amountWords}</div>
            </div>
            <div class="closing">
              Mohon melakukan pembayaran sesuai informasi di atas. Setelah pembayaran dilakukan, unggah bukti pembayaran untuk proses verifikasi.<br /><br />
              Total biaya program: ${formatted.totalAmount}. Sudah dibayar: ${formatted.amountPaid}. Sisa kewajiban: ${formatted.remaining}.<br /><br />
              Demikian invoice ini kami sampaikan. Atas perhatian dan kerja sama Anda kami ucapkan terima kasih.
            </div>
            <div class="signature">
              <p>Bandung, ${invoiceDate}</p>
              <div class="line"></div>
              <p><strong>Il Ratna Yanti Kosasih, S.Si., M.Sc.</strong></p>
              <p>General Manager</p>
            </div>
            <div class="footer">FITALENTA | AMANAH | SHIDDIQ | TABLIGH</div>
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


            {/* Download Receipt Button */}
            {canDownloadReceipt(payment) && (
              <button
                className="btn btn-outline-primary"
                onClick={() => downloadReceipt(payment)}
                title="Download Kwitansi"
              >
                <i className="bi bi-download"></i>
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
                                  Rp {paymentUtils.formatCurrency(row.amount)}
                                  {row.paidAt && (
                                    <div className="text-muted small">
                                      Dibayar: {formatDate(row.paidAt)}
                                    </div>
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
                {canDownloadReceipt(selectedPayment) && (
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
                )}
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
};

export default Payment;