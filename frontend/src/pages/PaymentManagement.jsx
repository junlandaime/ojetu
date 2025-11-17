import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { buildFileUrl } from "../utils/api";

const INSTALLMENT_WEIGHT_MAP = {
  4: [5, 5, 3, 3],
};

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

  getPaymentMethodText: (method) => {
    const methods = {
      transfer: "Transfer Bank",
      cash: "Tunai",
      credit_card: "Kartu Kredit",
    };
    return methods[method] || method;
  },

  formatCurrency: (value, defaultValue = "0") => {
    const normalized = normalizeAmountValue(value);
    if (Number.isNaN(normalized)) {
      return defaultValue;
    }
    return Math.round(normalized).toLocaleString("id-ID");
  },

  parseFloatSafe: (value, defaultValue = 0) => {
    const normalized = normalizeAmountValue(value);
    if (Number.isNaN(normalized)) {
      return defaultValue;
    }
    return Math.round(normalized * 100) / 100;
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

  // parseInstallmentAmounts: (payment) => {
  //   if (!payment || !payment.installment_amounts) return {};

  //   const bufferToString = (bufferLike) => {
  //     const hasArrayBuffer = typeof ArrayBuffer !== "undefined";
  //     try {
  //       if (!bufferLike) return null;

  //       if (
  //         typeof window !== "undefined" &&
  //         window.TextDecoder &&
  //         hasArrayBuffer &&
  //         (bufferLike instanceof ArrayBuffer || ArrayBuffer.isView(bufferLike))
  //       ) {
  //         const decoder = new window.TextDecoder();
  //         const view =
  //           bufferLike instanceof ArrayBuffer
  //             ? new Uint8Array(bufferLike)
  //             : new Uint8Array(bufferLike.buffer);
  //         return decoder.decode(view);
  //       }

  //       if (
  //         hasArrayBuffer &&
  //         (bufferLike instanceof ArrayBuffer || ArrayBuffer.isView(bufferLike))
  //       ) {
  //         const view =
  //           bufferLike instanceof ArrayBuffer
  //             ? new Uint8Array(bufferLike)
  //             : new Uint8Array(bufferLike.buffer);
  //         let result = "";
  //         view.forEach((byte) => {
  //           result += String.fromCharCode(byte);
  //         });
  //         return result;
  //       }

  //       if (
  //         typeof bufferLike === "object" &&
  //         bufferLike !== null &&
  //         bufferLike.type === "Buffer" &&
  //         Array.isArray(bufferLike.data)
  //       ) {
  //         let result = "";
  //         bufferLike.data.forEach((byte) => {
  //           result += String.fromCharCode(byte);
  //         });
  //         return result;
  //       }
  //     } catch (error) {
  //       console.error("❌ Failed to decode buffer-like installment data", error);
  //     }

  //     return null;
  //   };

  //   const parseJsonString = (value) => {
  //     if (!value || typeof value !== "string") {
  //       return {};
  //     }

  //     const trimmed = value.trim();
  //     if (!trimmed) {
  //       return {};
  //     }

  //     try {
  //       let parsed = JSON.parse(trimmed);
  //       if (typeof parsed === "string") {
  //         parsed = JSON.parse(parsed);
  //       }

  //       if (
  //         parsed &&
  //         typeof parsed === "object" &&
  //         !Array.isArray(parsed) &&
  //         Object.keys(parsed).length > 0
  //       ) {
  //         return parsed;
  //       }
  //     } catch (error) {
  //       console.error("❌ Error parsing installment_amounts string:", error);
  //     }

  //     return {};
  //   };

  //   try {
  //     const rawValue = payment.installment_amounts;

  //     if (
  //       typeof rawValue === "object" &&
  //       rawValue !== null &&
  //       !Array.isArray(rawValue)
  //     ) {
  //       const keys = Object.keys(rawValue);
  //       if (keys.some((key) => key.startsWith("installment_"))) {
  //         return rawValue;
  //       }

  //       if (rawValue.type === "Buffer" && Array.isArray(rawValue.data)) {
  //         const decoded = bufferToString(rawValue);
  //         return decoded ? parseJsonString(decoded) : {};
  //       }

  //       const serialized = JSON.stringify(rawValue);
  //       return serialized ? parseJsonString(serialized) : {};
  //     }

  //     if (
  //       typeof rawValue === "string" &&
  //       rawValue.trim().startsWith("{")
  //     ) {
  //       return parseJsonString(rawValue);
  //     }

  //     if (
  //       typeof ArrayBuffer !== "undefined" &&
  //       (rawValue instanceof ArrayBuffer || ArrayBuffer.isView(rawValue))
  //     ) {
  //       const decoded = bufferToString(rawValue);
  //       return decoded ? parseJsonString(decoded) : {};
  //     }

  //     return {};
  //   } catch (error) {
  //     console.error("❌ Error parsing installment_amounts:", error);
  //     return {};
  //   }
  // },

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

  getDefaultInstallmentAmounts: (payment) => {
    const totalAmount = paymentUtils.parseFloatSafe(
      payment?.program_training_cost || payment?.amount || 0
    );
    const totalInstallments = paymentUtils.getTotalInstallments(payment);

    if (!totalInstallments || totalInstallments <= 0) {
      return [];
    }

    const weights = INSTALLMENT_WEIGHT_MAP[totalInstallments];

    if (!weights || weights.length !== totalInstallments) {
      const evenShare = totalAmount / totalInstallments;
      return Array.from({ length: totalInstallments }, () => evenShare);
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0) || 1;
    let remaining = totalAmount;

    return weights.map((weight, index) => {
      if (index === totalInstallments - 1) {
        const amount = Math.max(0, Math.round(remaining));
        remaining -= amount;
        return amount;
      }

      const amount = Math.round((weight / totalWeight) * totalAmount);
      remaining -= amount;
      return amount;
    });
  },

  getDefaultInstallmentAmount: (payment, installmentNumber) => {
    if (!installmentNumber || installmentNumber < 1) return 0;
    const amounts = paymentUtils.getDefaultInstallmentAmounts(payment);
    return amounts[installmentNumber - 1] || 0;
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
    const paidAmountValue = paymentUtils.parseFloatSafe(entry.paid_amount);
    const defaultAmount = paymentUtils.getDefaultInstallmentAmount(
      payment,
      installmentNumber
    );
    const amount =
      configuredAmount > 0
        ? configuredAmount
        : paidAmountValue > 0
        ? paidAmountValue
        : defaultAmount;

    const currentInstallment = paymentUtils.getCurrentInstallmentNumber(payment);
    const proofImage = entry.proof_image || null;
    const proofUploadedAt = entry.proof_uploaded_at || null;
    const proofVerifiedAt = entry.proof_verified_at || null;
    const receiptNumber =
      entry.receipt_number ||
      payment.receipt_number ||
      payment.invoice_number ||
      null;
    const receiptAvailable = Boolean(
      receiptNumber || entry.proof_verified_at || entry.paid_at
    );
    const invoiceNumber = entry.invoice_number || payment.invoice_number || null;
    const invoiceIssuedAt =
      entry.invoice_issued_at || payment.invoice_issued_at || null;
    const invoiceAvailable = Boolean(
      invoiceNumber ||
      invoiceIssuedAt ||
      configuredAmount > 0 ||
      paidAmountValue > 0
    );

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
      paidAmount: paidAmountValue,
      paidAt: entry.paid_at || null,
      invoiceIssuedAt,
      invoiceNumber,
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

    return paymentUtils.getInstallmentText({ status }) || status;
    },

  getCurrentInstallmentInfo: (payment) => {
    if (!payment)
      return {
        number: 0,
        text: "Unknown",
        isPaid: false,
        totalInstallments: 4,
        isWaitingVerification: false,
      };

    const totalInstallments = paymentUtils.getTotalInstallments(payment);
    const context = paymentUtils.getCurrentInstallmentContext(payment);
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
        text: "Menunggu Cicilan 1",
        isPaid: false,
        totalInstallments,
        isWaitingVerification,
      };
    }

    if (payment.status.startsWith("installment_")) {
      const currentNum = paymentUtils.getCurrentInstallmentNumber(payment) || 1;
      const isPaid = context
        ? context.status === "paid" || context.receiptAvailable
        : false;

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

  getTotalInstallments: (payment) => {
    if (!payment || !payment.program_installment_plan) return 4;
    const plan = payment.program_installment_plan;
    if (plan === "none") return 1;
    if (plan === "4_installments") return 4;
    if (plan === "6_installments") return 6;
    return parseInt(plan.split("_")[0]) || 4;
  },

  calculateNextInstallment: (payment) => {
    if (!payment) {
      return { number: null, amount: 0, error: "Data tidak lengkap" };
    }

    try {
      const totalAmount = paymentUtils.parseFloatSafe(
        payment.program_training_cost
      );
      const paidAmount = paymentUtils.parseFloatSafe(payment.amount_paid || 0);

      if (paidAmount >= totalAmount) {
        return { number: null, amount: 0, message: "Pembayaran sudah lunas" };
      }

      let nextInstallmentNumber = 1;
      let currentInstallment = 0;

      if (payment.status === "pending") {
        currentInstallment = 0;
        nextInstallmentNumber = 1;
      } else if (payment.status.startsWith("installment_")) {
        currentInstallment = parseInt(payment.status.split("_")[1]);
        nextInstallmentNumber = currentInstallment + 1;
      }

      const installmentCount = paymentUtils.getTotalInstallments(payment);
      const plannedAmounts = paymentUtils.getDefaultInstallmentAmounts(payment);

      if (nextInstallmentNumber > installmentCount) {
        return {
          number: null,
          amount: 0,
          message: `Maksimal ${installmentCount} cicilan sudah tercapai`,
        };
      }

      const remainingAmount = totalAmount - paidAmount;
      const remainingInstallments = installmentCount - currentInstallment;
      const plannedAmount = plannedAmounts[nextInstallmentNumber - 1];
      const suggestedAmount =
        plannedAmount && plannedAmount > 0
          ? plannedAmount
          : remainingInstallments > 0
          ? Math.round(remainingAmount / remainingInstallments / 1000) * 1000
          : 0;

      return {
        number: nextInstallmentNumber,
        amount: suggestedAmount,
        totalInstallments: installmentCount,
        remainingAmount: remainingAmount,
        currentInstallment: currentInstallment,
        message: "Admin dapat menentukan nominal tagihan",
      };
    } catch (error) {
      console.error("❌ Error calculating installment:", error);
      return { number: null, amount: 0, error: error.message };
    }
  },

  canIssueInvoice: (payment) => {
    try {
      if (!payment) return false;

      if (!payment.status.startsWith("installment_")) return false;

      const currentInstallment = parseInt(payment.status.split("_")[1]);
      const totalInstallments = paymentUtils.getTotalInstallments(payment);

      if (currentInstallment >= totalInstallments) return false;

      return true;
    } catch (error) {
      console.error("❌ Error in canIssueInvoice:", error);
      return false;
    }
  },

  canIssueManualInvoice: (payment) => {
    try {
      if (payment.status === "paid" || payment.status === "cancelled") {
        return false;
      }

      const nextInstallment = paymentUtils.calculateNextInstallment(payment);
      return nextInstallment.number !== null;
    } catch (error) {
      console.error("❌ Error in canIssueManualInvoice:", error);
      return false;
    }
  },

  getPaymentProgress: (payment) => {
    if (!payment) {
      return { percentage: 0, paid: 0, total: 0, remaining: 0 };
    }

    const total = paymentUtils.parseFloatSafe(payment.program_training_cost);
    const paid = paymentUtils.parseFloatSafe(payment.amount_paid || 0);
    const remaining = Math.max(0, total - paid);
    const percentage = total > 0 ? (paid / total) * 100 : 0;

    return {
      percentage: Math.min(100, Math.round(percentage)),
      paid,
      total,
      remaining,
    };
  },

  shouldShowVerifyButton: (payment) => {
    if (!payment) return false;
    const context = paymentUtils.getCurrentInstallmentContext(payment);
    if (payment.status === "paid" || payment.status === "cancelled") {
      return false;
    }
    if (!context || !context.proofImage) {
      return false;
    }

    const alreadyVerified = Boolean(
      context.proofVerifiedAt || context.receiptNumber
    );

    return !alreadyVerified;
  },

  validatePayment: (payment) => {
    if (!payment) return { isValid: false, error: "Data pembayaran tidak ada" };
    if (!payment.id || payment.id <= 0)
      return { isValid: false, error: "ID pembayaran tidak valid" };
    if (!payment.program_training_cost)
      return { isValid: false, error: "Data program tidak lengkap" };
    return { isValid: true, error: null };
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

  getImageUrl: (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return buildFileUrl(path);
  },
};

const MODAL_TYPES = {
  NONE: null,
  DETAIL: "detail",
  MANUAL: "manual",
  VERIFICATION: "verification",
  INVOICE: "invoice",
  MANUAL_INVOICE: "manual_invoice",
  PREVIEW: "preview",
};

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    program: "all",
    search: "",
  });

  const [activeModal, setActiveModal] = useState(MODAL_TYPES.NONE);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const installmentRows = useMemo(
    () =>
      selectedPayment
        ? paymentUtils.getInstallmentProgressRows(selectedPayment)
        : [],
    [selectedPayment]
  );

  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    registration_id: "",
    amount: "",
    amount_paid: "",
    payment_method: "transfer",
    bank_name: "",
    account_number: "",
    status: "pending",
    payment_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [manualInvoiceForm, setManualInvoiceForm] = useState({
    installment_number: 1,
    amount: "",
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "",
  });

  const [proofFile, setProofFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [verificationForm, setVerificationForm] = useState({
    status: "paid",
    rejection_reason: "",
    amount_paid: 0,
  });

  const [invoiceForm, setInvoiceForm] = useState({
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    amount: 0,
    installment_number: 1,
    notes: "",
  });

  const { user } = useAuth();
  const abortControllerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== "all" && filters[key] !== "") {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/api/payments?${params}`, {
        signal: abortControllerRef.current.signal,
        timeout: 10000,
      });

      if (response.data?.success) {
        const paymentsData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setPayments(paymentsData);
      } else {
        throw new Error("Format respons tidak valid");
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error("❌ Error fetching payments:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error loading payment data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.program, filters.search]);

  const fetchPrograms = useCallback(async () => {
    try {
      const response = await axios.get("/api/programs", { timeout: 10000 });
      if (response.data?.success) {
        setPrograms(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      }
    } catch (error) {
      console.error("❌ Error fetching programs:", error);
    }
  }, []);

  const fetchRegistrations = useCallback(async () => {
    try {
      const response = await axios.get("/api/registrations", {
        timeout: 10000,
      });
      if (response.data?.success) {
        const registrationsData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setRegistrations(registrationsData);
      }
    } catch (error) {
      console.error("❌ Error fetching registrations:", error);
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await axios.get("/api/payments/statistics", {
        timeout: 10000,
      });
      if (response.data?.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("❌ Error fetching payment statistics:", error);
    }
  }, []);

  const resetModals = useCallback(() => {
    setActiveModal(MODAL_TYPES.NONE);
    setSelectedPayment(null);
    setPreviewImage(null);
    setProofFile(null);
    setVerificationForm({
      status: "paid",
      rejection_reason: "",
      amount_paid: 0,
    });
    setManualInvoiceForm({
      installment_number: 1,
      amount: "",
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      notes: "",
    });
  }, []);

  const handleViewDetails = async (payment) => {
    const validation = paymentUtils.validatePayment(payment);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/payments/${payment.id}`, {
        timeout: 10000,
      });
      if (response.data?.success) {
        setSelectedPayment(response.data.data);
        setActiveModal(MODAL_TYPES.DETAIL);
      }
    } catch (error) {
      console.error("❌ Error fetching payment details:", error);
      alert("Error loading payment details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenManualPayment = () => {
    setActiveModal(MODAL_TYPES.MANUAL);
  };

  const downloadInstallmentDocument = useCallback(
    async (payment, type, installment = null) => {
      if (!payment || !payment.id) {
        alert("Data pembayaran tidak valid.");
        return;
      }

      const params = new URLSearchParams();
      const hasInstallment =
        installment !== undefined &&
        installment !== null &&
        installment !== "";

      if (hasInstallment) {
        params.append("installment", installment);
        params.append("status", `installment_${installment}`);
      }

      const endpoint = type === "invoice" ? "invoice" : "receipt";
      const buildUrl = (queryString) =>
        `/api/payments/${payment.id}/${endpoint}${
          queryString ? `?${queryString}` : ""
        }`;
      const url = buildUrl(params.toString());

       const downloadFromResponse = (response) => {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"] || "application/pdf",
        });
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const suffix = hasInstallment ? `-cicilan-${installment}` : "";
        const documentPrefix = type === "invoice" ? "invoice" : "kwitansi";
        const baseNumber =
          type === "invoice"
            ? payment.invoice_number || payment.registration_code || documentPrefix
            : payment.receipt_number ||
              payment.invoice_number ||
              payment.registration_code ||
              documentPrefix;

        link.href = blobUrl;
        link.setAttribute(
          "download",
          `${documentPrefix}-${baseNumber}${suffix}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
        };

      try {
        const response = await axios.get(url, {
          responseType: "blob",
          timeout: 15000,
        });

        downloadFromResponse(response);
      } catch (error) {
        const statusCode = error.response?.status;
        const shouldFallbackToBaseInvoice =
          type === "invoice" && hasInstallment && [400, 404].includes(statusCode);

        if (shouldFallbackToBaseInvoice) {
          try {
            const fallbackParams = new URLSearchParams();
            fallbackParams.append("status", `installment_${installment}`);

            const fallbackResponse = await axios.get(
              buildUrl(fallbackParams.toString()),
              {
                responseType: "blob",
                timeout: 15000,
              }
            );

            downloadFromResponse(fallbackResponse);
            return;
          } catch (fallbackError) {
            console.error("❌ Invoice fallback failed:", fallbackError);
          }
        }


        console.error("❌ Error downloading document:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          `Gagal mengunduh ${type === "invoice" ? "invoice" : "kwitansi"}`;
        alert(errorMessage);
      }
    },
    []
  );

  const handlePreviewProof = (payment) => {
    if (payment.proof_image) {
      setPreviewImage(paymentUtils.getImageUrl(payment.proof_image));
      setActiveModal(MODAL_TYPES.PREVIEW);
    } else {
      alert("Tidak ada bukti pembayaran untuk ditampilkan.");
    }
  };

  const handleOpenVerification = async (payment) => {
    const validation = paymentUtils.validatePayment(payment);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/payments/${payment.id}`, {
        timeout: 10000,
      });

      if (response.data?.success) {
        const latestPayment = response.data.data;
        setSelectedPayment(latestPayment);

        const totalAmount = paymentUtils.parseFloatSafe(
          latestPayment.program_training_cost
        );
        const paidAmount = paymentUtils.parseFloatSafe(
          latestPayment.amount_paid || 0
        );

        let nextStatus = latestPayment.status;
        let suggestedAmount = 0;

         const currentContext = paymentUtils.getCurrentInstallmentContext(
          latestPayment
        );

        if (latestPayment.status === "pending") {
          nextStatus = "installment_1";
          }

        if (currentContext && currentContext.amount) {
          suggestedAmount = paymentUtils.parseFloatSafe(currentContext.amount);
        } else {
          suggestedAmount =
            totalAmount / paymentUtils.getTotalInstallments(latestPayment); 
        }

        setVerificationForm({
          status: nextStatus,
          rejection_reason: "",
          amount_paid: suggestedAmount,
        });

        setActiveModal(MODAL_TYPES.VERIFICATION);
      }
    } catch (error) {
      console.error("❌ Error preparing verification:", error);
      alert("Error mempersiapkan verifikasi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenManualInvoice = (payment) => {
    const validation = paymentUtils.validatePayment(payment);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    if (!paymentUtils.canIssueManualInvoice(payment)) {
      alert("Tidak dapat membuat tagihan manual untuk pembayaran ini.");
      return;
    }

    const nextInstallment = paymentUtils.calculateNextInstallment(payment);
    const totalAmount = paymentUtils.parseFloatSafe(
      payment.program_training_cost
    );
    const paidAmount = paymentUtils.parseFloatSafe(payment.amount_paid);
    const remainingAmount = totalAmount - paidAmount;

    const installmentCount = paymentUtils.getTotalInstallments(payment);
    const remainingInstallments = installmentCount - (nextInstallment.number - 1);
    const suggestedAmount =
      remainingInstallments > 0
        ? Math.round(remainingAmount / remainingInstallments / 1000) * 1000
        : 0;

    setManualInvoiceForm({
      installment_number: nextInstallment.number,
      amount: suggestedAmount,
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      notes: `Tagihan cicilan ${nextInstallment.number} untuk program ${payment.program_name}`,
    });

    setSelectedPayment(payment);
    setActiveModal(MODAL_TYPES.MANUAL_INVOICE);
  };

  const handleOpenInvoice = (payment) => {
    const validation = paymentUtils.validatePayment(payment);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    if (!paymentUtils.canIssueInvoice(payment)) {
      alert("Tidak dapat menerbitkan tagihan untuk pembayaran ini.");
      return;
    }

    const nextInstallment = paymentUtils.calculateNextInstallment(payment);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    setInvoiceForm({
      due_date: dueDate.toISOString().split("T")[0],
      amount: nextInstallment.amount || 0,
      installment_number: nextInstallment.number || 1,
      notes: `Tagihan cicilan ${nextInstallment.number || 1} untuk program ${payment.program_name
        }`,
    });

    setSelectedPayment(payment);
    setActiveModal(MODAL_TYPES.INVOICE);
  };

  const handleManualPaymentSubmit = async (e) => {
    e.preventDefault();

    if (!formData.registration_id) {
      alert("Pilih pendaftaran terlebih dahulu");
      return;
    }

    const registrationId = parseInt(formData.registration_id);
    const selectedRegistration = registrations.find(
      (reg) => reg.id === registrationId
    );

    if (!selectedRegistration) {
      alert("Data pendaftaran tidak valid.");
      return;
    }

    try {
      setUploadLoading(true);

      const payload = {
        registration_id: registrationId,
        amount_paid: paymentUtils.parseFloatSafe(formData.amount_paid),
        payment_method: formData.payment_method,
        bank_name: formData.bank_name,
        account_number: formData.account_number,
        status: formData.status,
        payment_date: formData.payment_date,
        notes: formData.notes,
        verified_by: user?.id,
      };

      // console.log("Sending manual payment:", payload);

      const response = await axios.post("/api/payments/manual", payload, {
        timeout: 15000,
      });

      if (response.data?.success) {
        let paymentId = response.data.data.payment_id;

        if (proofFile && paymentId) {
          try {
            await handleFileUpload(paymentId, proofFile);
            // console.log("Proof image uploaded");
          } catch (uploadError) {
            console.warn("Bukti pembayaran gagal diupload:", uploadError.message);
          }
        }

        alert("Pembayaran manual berhasil diproses!");

        resetModals();
        setFormData({
          registration_id: "",
          amount: "",
          amount_paid: "",
          payment_method: "transfer",
          bank_name: "",
          account_number: "",
          status: "pending",
          payment_date: new Date().toISOString().split("T")[0],
          notes: "",
        });

        await Promise.all([fetchPayments(), fetchStatistics()]);
      }
    } catch (error) {
      console.error("❌ Error processing manual payment:", error);
      const errorMessage = error.response?.data?.message || error.message;
      alert("❌ Error processing payment: " + errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleManualInvoiceSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPayment?.id) {
      alert("Data pembayaran tidak valid");
      return;
    }

    const nextInstallment = paymentUtils.calculateNextInstallment(selectedPayment);

    if (manualInvoiceForm.installment_number !== nextInstallment.number) {
      alert(
        `Tidak dapat membuat invoice untuk cicilan ${manualInvoiceForm.installment_number}. Cicilan berikutnya yang diharapkan: ${nextInstallment.number}`
      );
      return;
    }

    if (!manualInvoiceForm.amount || manualInvoiceForm.amount <= 0) {
      alert("Jumlah tagihan harus lebih dari 0");
      return;
    }

    if (!manualInvoiceForm.due_date) {
      alert("Tanggal jatuh tempo harus diisi");
      return;
    }

    try {
      const payload = {
        installment_number: manualInvoiceForm.installment_number,
        amount: paymentUtils.parseFloatSafe(manualInvoiceForm.amount),
        due_date: manualInvoiceForm.due_date,
        notes: manualInvoiceForm.notes,
        verified_by: user?.id,
      };

      const response = await axios.post(
        `/api/payments/${selectedPayment.id}/create-invoice`,
        payload,
        { timeout: 15000 }
      );

      if (response.data?.success) {
        alert(`✅ Tagihan cicilan ${manualInvoiceForm.installment_number} berhasil dibuat`);
        resetModals();
        await Promise.all([fetchPayments(), fetchStatistics()]);
      }
    } catch (error) {
      console.error("❌ Error creating manual invoice:", error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Error creating manual invoice: ${errorMessage}`);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPayment?.id) {
      alert("Data pembayaran tidak valid");
      return;
    }

    const paymentAmount = paymentUtils.parseFloatSafe(
      verificationForm.amount_paid
    );
    if (paymentAmount <= 0 && verificationForm.status !== "cancelled") {
      alert("Jumlah pembayaran harus lebih dari 0");
      return;
    }

    try {
      const payload = {
        status: verificationForm.status,
        amount_paid: paymentAmount,
        notes: verificationForm.rejection_reason || `Verifikasi pembayaran - Status: ${verificationForm.status}`,
        verified_by: user?.id,
      };

      const response = await axios.put(
        `/api/payments/${selectedPayment.id}/status`,
        payload,
        { timeout: 15000 }
      );

      if (response.data?.success) {
        let successMessage = "";
        if (verificationForm.status === "cancelled") {
          successMessage = "Pembayaran berhasil ditolak";
        } else if (response.data.data.status === "paid") {
          successMessage = "Pembayaran telah lunas! 🎉";
        } else {
          const statusText = paymentUtils.getInstallmentText({
            status: response.data.data.status,
          });
          successMessage = `Verifikasi berhasil! Status: ${statusText}`;
        }

        alert(successMessage);
        resetModals();
        await Promise.all([fetchPayments(), fetchStatistics()]);
      }
    } catch (error) {
      console.error("❌ Error verifying payment:", error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Error verifying payment: ${errorMessage}`);
    }
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPayment?.id) {
      alert("Data pembayaran tidak valid");
      return;
    }

    if (!invoiceForm.due_date) {
      alert("Harap tentukan tanggal jatuh tempo");
      return;
    }

    try {
      const payload = {
        due_date: invoiceForm.due_date,
        notes: invoiceForm.notes,
        verified_by: user?.id,
      };

      const response = await axios.put(
        `/api/payments/${selectedPayment.id}/due-date`,
        payload,
        { timeout: 15000 }
      );

      if (response.data?.success) {
        alert("Tagihan berhasil diterbitkan");
        resetModals();
        await Promise.all([fetchPayments(), fetchStatistics()]);
      }
    } catch (error) {
      console.error("❌ Error updating invoice:", error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Error updating invoice: ${errorMessage}`);
    }
  };

  const handleFileUpload = async (paymentId, file) => {
    if (!file) return null;

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append("proof_image", file);

      const response = await axios.post(
        `/api/payments/${paymentId}/upload-proof`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      if (response.data?.success) {
        return response.data.data.proof_image;
      } else {
        throw new Error("Upload bukti pembayaran gagal");
      }
    } catch (error) {
      console.error("❌ Error uploading proof:", error);
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Gagal mengupload bukti pembayaran: ${errorMessage}`);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 5MB.");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diizinkan.");
      e.target.value = "";
      return;
    }

    setProofFile(file);
  };

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleSearchChange = useCallback(
    (value) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        handleFilterChange("search", value);
      }, 500);
    },
    [handleFilterChange]
  );

  useEffect(() => {
    fetchPrograms();
    fetchRegistrations();
    fetchStatistics();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchPrograms, fetchRegistrations, fetchStatistics]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(
      () => {
        fetchPayments();
      },
      filters.search ? 500 : 0
    );

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchPayments, filters.search]);

  const renderModal = () => {
    switch (activeModal) {
      case MODAL_TYPES.DETAIL:
        return renderDetailModal();
      case MODAL_TYPES.MANUAL:
        return renderManualPaymentModal();
      case MODAL_TYPES.VERIFICATION:
        return renderVerificationModal();
      case MODAL_TYPES.INVOICE:
        return renderInvoiceModal();
      case MODAL_TYPES.MANUAL_INVOICE:
        return renderManualInvoiceModal();
      case MODAL_TYPES.PREVIEW:
        return renderPreviewModal();
      default:
        return null;
    }
  };

  const renderDetailModal = () => (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={resetModals}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detail Invoice</h5>
            <button
              type="button"
              className="btn-close"
              onClick={resetModals}
            ></button>
          </div>
          <div className="modal-body">
            {selectedPayment && (
              <>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6>Informasi Peserta</h6>
                    <p><strong>Nama:</strong> {selectedPayment.full_name}</p>
                    <p><strong>Email:</strong> {selectedPayment.email}</p>
                    <p><strong>Program:</strong> {selectedPayment.program_name}</p>
                    <p><strong>Kode Pendaftaran:</strong> {selectedPayment.registration_code}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Informasi Pembayaran</h6>
                    <p><strong>Invoice:</strong> {selectedPayment.invoice_number}</p>
                    <p><strong>Total Biaya:</strong> Rp {paymentUtils.formatCurrency(selectedPayment.program_training_cost)}</p>
                    <p><strong>Dibayar:</strong> Rp {paymentUtils.formatCurrency(selectedPayment.amount_paid)}</p>
                    <p><strong>Sisa:</strong> Rp {paymentUtils.formatCurrency(paymentUtils.parseFloatSafe(selectedPayment.program_training_cost) - paymentUtils.parseFloatSafe(selectedPayment.amount_paid))}</p>
                    <p><strong>Status:</strong> {paymentUtils.getStatusBadge(selectedPayment.status)}</p>
                    {selectedPayment.due_date && (
                      <p><strong>Jatuh Tempo:</strong> {new Date(selectedPayment.due_date).toLocaleDateString("id-ID")}</p>
                    )}
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-12">
                    <h6>Progress Pembayaran</h6>
                    <div className="progress" style={{ height: "25px" }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: `${paymentUtils.getPaymentProgress(selectedPayment).percentage}%`,
                        }}
                      >
                        {paymentUtils.getPaymentProgress(selectedPayment).percentage}%
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <small>Rp 0</small>
                      <small>Rp {paymentUtils.formatCurrency(selectedPayment.program_training_cost)}</small>
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header bg-primary text-white">
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
                                      Terbit: {new Date(row.invoiceIssuedAt).toLocaleDateString("id-ID")}
                                    </div>
                                  )}
                                </td>
                                <td>
                                   {row.amount > 0 &&
                                    `Rp ${paymentUtils.formatCurrency(row.amount)}`}
                                  {row.paidAt && (
                                    <div className="text-muted small">
                                      Dibayar: {new Date(row.paidAt).toLocaleDateString("id-ID")}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  {row.dueDate
                                    ? new Date(row.dueDate).toLocaleDateString("id-ID")
                                    : "-"}
                                </td>
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
                                      disabled={!row.invoiceAvailable}
                                      onClick={() =>
                                       downloadInstallmentDocument(
                                          selectedPayment,
                                          "invoice",
                                          row.installment
                                        )
                                      }
                                      title={`Unduh invoice cicilan ${row.installment}`}
                                    >
                                      <i className="bi bi-file-earmark-arrow-down"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary"
                                      disabled={!row.receiptAvailable}
                                      onClick={() =>
                                       downloadInstallmentDocument(
                                          selectedPayment,
                                          "receipt",
                                          row.installment
                                        )
                                      }
                                      title={`Unduh kwitansi cicilan ${row.installment}`}
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

                {selectedPayment.proof_image && (
                  <div className="row mb-4">
                    <div className="col-12">
                      <h6>Bukti Pembayaran</h6>
                      <div className="text-center">
                        <img
                          src={paymentUtils.getImageUrl(selectedPayment.proof_image)}
                          alt="Bukti Pembayaran"
                          className="img-fluid rounded border"
                          style={{ maxHeight: "300px", cursor: "pointer" }}
                          onClick={() => handlePreviewProof(selectedPayment)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPayment.history && selectedPayment.history.length > 0 && (
                  <div className="mt-4">
                    <h6>Riwayat Pembayaran</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Tanggal</th>
                            <th>Status Lama</th>
                            <th>Status Baru</th>
                            <th>Jumlah Dibayar</th>
                            <th>Total Dibayar</th>
                            <th>Diubah Oleh</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPayment.history.map((history) => (
                            <tr key={history.id}>
                              <td>{new Date(history.changed_at).toLocaleDateString("id-ID")}</td>
                              <td>{paymentUtils.getStatusBadge(history.old_status)}</td>
                              <td>{paymentUtils.getStatusBadge(history.new_status)}</td>
                              <td>{history.amount_paid_change > 0 && `Rp ${paymentUtils.formatCurrency(history.amount_paid_change)}`}</td>
                              <td>Rp {paymentUtils.formatCurrency(history.new_amount_paid)}</td>
                              <td>{history.changed_by_name || "System"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={resetModals}>Tutup</button>
            {selectedPayment?.receipt_number && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() =>
                  downloadInstallmentDocument(selectedPayment, "receipt")
                }
              >
                <i className="bi bi-download me-1"></i>Download Kwitansi
             </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderManualPaymentModal = () => (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={resetModals}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Tambah Pembayaran Manual</h5>
            <button
              type="button"
              className="btn-close"
              onClick={resetModals}
            ></button>
          </div>
          <form onSubmit={handleManualPaymentSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Pilih Pendaftaran *</label>
                  <select
                    className="form-select"
                    value={formData.registration_id}
                    onChange={(e) => {
                      const registrationId = e.target.value;
                      const selectedReg = registrations.find(
                        (reg) => reg.id === parseInt(registrationId)
                      );
                      const existingPayment = payments.find(
                        (p) => p.registration_id === parseInt(registrationId)
                      );

                      setFormData({
                        ...formData,
                        registration_id: registrationId,
                        amount: selectedReg
                          ? selectedReg.program_training_cost
                          : "",
                      });

                      if (existingPayment) {
                        const progress = paymentUtils.getPaymentProgress(existingPayment);
                        alert(
                          `Informasi Pembayaran:\n\nTotal Biaya: Rp ${paymentUtils.formatCurrency(
                            existingPayment.program_training_cost
                          )}\nSudah Dibayar: Rp ${paymentUtils.formatCurrency(
                            existingPayment.amount_paid
                          )}\nSisa: Rp ${paymentUtils.formatCurrency(
                            progress.remaining
                          )}\nStatus: ${existingPayment.status}`
                        );
                      }
                    }}
                    required
                  >
                    <option value="">Pilih Pendaftaran</option>
                    {registrations.length === 0 ? (
                      <option value="" disabled>
                        Tidak ada data pendaftar
                      </option>
                    ) : (
                      registrations.map((reg) => {
                        const existingPayment = payments.find(
                          (p) => p.registration_id === reg.id
                        );
                        return (
                          <option key={reg.id} value={reg.id}>
                            {reg.registration_code} - {reg.full_name} (
                            {reg.program_name})
                            {existingPayment && ` - ${existingPayment.status}`}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Jumlah Pembayaran *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.amount_paid}
                    onChange={(e) =>
                      setFormData({ ...formData, amount_paid: e.target.value })
                    }
                    min="1"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Bukti Pembayaran (Opsional)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="form-text">
                    Upload bukti transfer atau slip pembayaran (maks. 5MB,
                    format: JPG, PNG, JPEG)
                  </div>
                  {proofFile && (
                    <div className="mt-2">
                      <small className="text-success">
                        <i className="bi bi-check-circle me-1"></i>File
                        terpilih: {proofFile.name}
                      </small>
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Status Setelah Pembayaran *
                  </label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="installment_1">Cicilan 1</option>
                    <option value="installment_2">Cicilan 2</option>
                    <option value="installment_3">Cicilan 3</option>
                    <option value="installment_4">Cicilan 4</option>
                    <option value="installment_5">Cicilan 5</option>
                    <option value="installment_6">Cicilan 6</option>
                    <option value="paid">Lunas</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Metode Pembayaran</label>
                  <select
                    className="form-select"
                    value={formData.payment_method}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_method: e.target.value,
                      })
                    }
                  >
                    <option value="transfer">Transfer Bank</option>
                    <option value="cash">Tunai</option>
                    <option value="credit_card">Kartu Kredit</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Tanggal Pembayaran</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.payment_date}
                    onChange={(e) =>
                      setFormData({ ...formData, payment_date: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Nama Bank</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.bank_name}
                    onChange={(e) =>
                      setFormData({ ...formData, bank_name: e.target.value })
                    }
                    placeholder="BCA, BNI, Mandiri, dll"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Nomor Rekening</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.account_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        account_number: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Catatan</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Catatan tambahan untuk pembayaran ini..."
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetModals}
                disabled={uploadLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-warning"
                disabled={uploadLoading}
              >
                {uploadLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Memproses Manual Payment...
                  </>
                ) : (
                  <>
                    <i className="bi bi-gear-fill me-2"></i>Proses Manual
                    Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderVerificationModal = () => (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={resetModals}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-check-circle me-2"></i>
              Verifikasi Pembayaran
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={resetModals}
            ></button>
          </div>
          <form onSubmit={handleVerificationSubmit}>
            <div className="modal-body">
              {selectedPayment && (
                <>
                  <div className="alert alert-info">
                    <h6><i className="bi bi-info-circle me-2"></i>Informasi Verifikasi</h6>
                    <p className="mb-0">
                      Verifikasi pembayaran untuk <strong>{selectedPayment.full_name}</strong> - {selectedPayment.program_name}
                    </p>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">Tindakan Verifikasi *</label>
                      <select
                        className="form-select"
                        value={verificationForm.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          setVerificationForm({
                            ...verificationForm,
                            status: newStatus,
                          });
                        }}
                        required
                      >
                        {/* Opsi berdasarkan status saat ini */}
                        {selectedPayment.status === "pending" && (
                          <>
                            <option value="installment_1">Verifikasi Cicilan 1</option>
                            <option value="paid">Lunas (Bayar Penuh)</option>
                          </>
                        )}

                        {selectedPayment.status.startsWith("installment_") && (
                          <>
                            <option value={selectedPayment.status}>
                              Verifikasi {paymentUtils.getInstallmentText(selectedPayment)}
                            </option>
                            <option value="paid">Lunas</option>
                          </>
                        )}

                        <option value="cancelled">Tolak Pembayaran</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Jumlah yang Dibayar (Rp) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={verificationForm.amount_paid}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setVerificationForm({
                            ...verificationForm,
                            amount_paid: value,
                          });
                        }}
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {verificationForm.status === "cancelled" && (
                    <div className="row mt-3">
                      <div className="col-12">
                        <label className="form-label">Alasan Penolakan *</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={verificationForm.rejection_reason}
                          onChange={(e) =>
                            setVerificationForm({
                              ...verificationForm,
                              rejection_reason: e.target.value,
                            })
                          }
                          placeholder="Berikan alasan jelas mengapa pembayaran ditolak..."
                          required
                        />
                      </div>
                    </div>
                  )}

                  {selectedPayment.proof_image && (
                    <div className="row mt-3">
                      <div className="col-12">
                        <label className="form-label">Bukti Pembayaran</label>
                        <div className="text-center">
                          <img
                            src={paymentUtils.getImageUrl(selectedPayment.proof_image)}
                            alt="Bukti Pembayaran"
                            className="img-fluid rounded border"
                            style={{ maxHeight: "200px", cursor: "pointer" }}
                            onClick={() => handlePreviewProof(selectedPayment)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={resetModals}>Batalkan</button>
              {verificationForm.status === "cancelled" ? (
                <button type="submit" className="btn btn-danger">
                  <i className="bi bi-x-circle me-2"></i>Tolak Pembayaran
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check-circle me-2"></i>Verifikasi Pembayaran
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderManualInvoiceModal = () => (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={resetModals}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Buat Tagihan Manual</h5>
            <button
              type="button"
              className="btn-close"
              onClick={resetModals}
            ></button>
          </div>
          <form onSubmit={handleManualInvoiceSubmit}>
            <div className="modal-body">
              {selectedPayment && (
                <>
                  <div className="alert alert-info">
                    <h6><i className="bi bi-info-circle me-2"></i>Informasi Cicilan</h6>
                    <p className="mb-1"><strong>Status Saat Ini:</strong> {paymentUtils.getInstallmentText(selectedPayment)}</p>
                    <p className="mb-0"><strong>Cicilan Berikutnya:</strong> {paymentUtils.calculateNextInstallment(selectedPayment).number}</p>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Cicilan Ke *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={manualInvoiceForm.installment_number}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          setManualInvoiceForm({
                            ...manualInvoiceForm,
                            installment_number: value,
                          });
                        }}
                        min="1"
                        required
                      />
                      <div className="form-text">
                        Total cicilan: {selectedPayment.program_installment_plan || "4 cicilan"} |
                        Cicilan berikutnya: {paymentUtils.calculateNextInstallment(selectedPayment).number}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Jumlah Tagihan (Rp) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={manualInvoiceForm.amount}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setManualInvoiceForm({
                            ...manualInvoiceForm,
                            amount: value,
                          });
                        }}
                        min="1"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Tanggal Jatuh Tempo *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={manualInvoiceForm.due_date}
                        onChange={(e) => {
                          setManualInvoiceForm({
                            ...manualInvoiceForm,
                            due_date: e.target.value,
                          });
                        }}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Catatan</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={manualInvoiceForm.notes}
                        onChange={(e) =>
                          setManualInvoiceForm({
                            ...manualInvoiceForm,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Berikan instruksi atau informasi untuk peserta..."
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={resetModals}>Batal</button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-receipt me-2"></i>Buat Tagihan Manual
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderPreviewModal = () => (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={resetModals}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Pratinjau Bukti Pembayaran</h5>
            <button
              type="button"
              className="btn-close"
              onClick={resetModals}
            ></button>
          </div>
          <div className="modal-body text-center">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Pratinjau Bukti Pembayaran"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "80vh" }}
              />
            ) : (
              <div className="alert alert-warning mb-0" role="alert">
                Bukti pembayaran tidak tersedia.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );


  const renderInvoiceModal = () => (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={resetModals}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Terbitkan Tagihan Cicilan</h5>
            <button type="button" className="btn-close" onClick={resetModals}></button>
          </div>
          <form onSubmit={handleInvoiceSubmit}>
            <div className="modal-body">
              {selectedPayment && (
                <>
                  <div className="alert alert-info">
                    <h6><i className="bi bi-info-circle me-2"></i>Kontrol Penerbitan Tagihan</h6>
                    <p className="mb-0">
                      Admin menentukan kapan tagihan cicilan berikutnya diterbitkan.
                    </p>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Tanggal Jatuh Tempo *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={invoiceForm.due_date}
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          if (selectedDate < today) {
                            alert("Due date harus di masa depan");
                            return;
                          }
                          setInvoiceForm({
                            ...invoiceForm,
                            due_date: e.target.value,
                          });
                        }}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Catatan untuk Peserta</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={invoiceForm.notes}
                        onChange={(e) =>
                          setInvoiceForm({
                            ...invoiceForm,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Berikan instruksi atau informasi penting untuk peserta..."
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={resetModals}>Batal</button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-receipt me-2"></i>Terbitkan Tagihan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const calculateRealStats = useCallback(() => {
    if (!payments.length) return null;

    const totalRevenue = payments
      .filter((p) => p.status === "paid" || p.status.includes("installment"))
      .reduce((sum, p) => sum + paymentUtils.parseFloatSafe(p.amount_paid), 0);

    const pendingVerification = payments.filter(
      (p) => p.status === "pending"
    ).length;
    const totalTransactions = payments.length;

    return {
      totalRevenue,
      pendingVerification,
      totalTransactions,
    };
  }, [payments]);

  const realStats = calculateRealStats();

  if (loading && payments.length === 0) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Memuat data pembayaran...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Manajemen Pembayaran</h2>
              <p className="text-muted mb-0">Kelola dan verifikasi pembayaran peserta</p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenManualPayment}>
              <i className="bi bi-plus-circle me-2"></i>Tambah Pembayaran Manual
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {realStats && (
        <div className="row mb-4 justify-content-center">
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body text-center p-3">
                <h4 className="card-title stats-label mb-1">Total Pemasukan</h4>
                <div className="fs-4 fw-bold">Rp {paymentUtils.formatCurrency(realStats.totalRevenue)}</div>
                <small>Dari pembayaran lunas & cicilan</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body text-center p-3">
                <h4 className="card-title stats-label mb-1">Menunggu Verifikasi</h4>
                <div className="fs-4 fw-bold">{realStats.pendingVerification} Transaksi</div>
                <small>Perlu tindakan admin</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body text-center p-3">
                <h4 className="card-title stats-label mb-1">Total Transaksi</h4>
                <div className="fs-4 fw-bold">{realStats.totalTransactions} Transaksi</div>
                <small>Semua status pembayaran</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Filter & Pencarian</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Status Pembayaran</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu Pembayaran</option>
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
            <div className="col-md-4">
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
            <div className="col-md-4">
              <label className="form-label">Pencarian</label>
              <input
                type="text"
                className="form-control"
                placeholder="Cari nama peserta, invoice..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Daftar Invoice ({payments.length})</h5>
          <div>
            <button className="btn btn-sm btn-outline-primary" onClick={fetchPayments} disabled={loading}>
              <i className="bi bi-arrow-clockwise me-1"></i>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </div>
          )}

          {payments.length === 0 ? (
            <div className="text-center py-5">
              <div className="display-1 text-muted mb-3"><i className="bi bi-credit-card"></i></div>
              <h5>Tidak ada data pembayaran</h5>
              <p className="text-muted">
                {loading ? "Memuat data..." : "Coba ubah filter atau kata kunci pencarian"}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light align-middle">
                  <tr>
                    <th>Invoice</th>
                    <th>Peserta</th>
                    <th>Program & Biaya</th>
                    <th>Progress Pembayaran</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th>Metode</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {payments.map((payment) => {
                    const progress = paymentUtils.getPaymentProgress(payment);
                    const nextInstallment = paymentUtils.calculateNextInstallment(payment);

                    return (
                      <tr key={payment.id}>
                        <td>
                          <div>
                            <strong className="d-block">{payment.invoice_number}</strong>
                            {payment.receipt_number && (
                              <small className="text-muted">Kwitansi: {payment.receipt_number}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <strong className="d-block">{payment.full_name}</strong>
                          <small className="text-muted d-block">{payment.email}</small>
                          <small className="text-muted">Kode: {payment.registration_code}</small>
                        </td>
                        <td>
                          <div className="fw-bold">{payment.program_name}</div>
                          <div className="small text-muted">{payment.program_duration}</div>
                          <div className="small">
                            <strong>Total: Rp {paymentUtils.formatCurrency(payment.program_training_cost)}</strong>
                          </div>
                          <div className="small text-muted">Plan: {payment.program_installment_plan || "4 cicilan"}</div>
                          {nextInstallment.number && (
                            <div className="small text-primary">
                              <strong>Cicilan {nextInstallment.number}: Admin Tentukan Nominal</strong>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="progress" style={{ height: "20px" }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: `${progress.percentage}%` }}
                            >
                              {progress.percentage}%
                            </div>
                          </div>
                          <div className="small text-center mt-1">
                            Rp {paymentUtils.formatCurrency(progress.paid)} / Rp {paymentUtils.formatCurrency(progress.total)}
                          </div>
                          {progress.remaining > 0 && (
                            <div className="small text-muted text-center">
                              Sisa: Rp {paymentUtils.formatCurrency(progress.remaining)}
                            </div>
                          )}
                        </td>
                        <td>{paymentUtils.getStatusBadge(payment.status)}</td>
                        <td>
                          <div className="small">
                            {new Date(payment.created_at).toLocaleDateString("id-ID")}
                          </div>
                          {payment.due_date && (
                            <div className={`small ${new Date(payment.due_date) < new Date() ? "text-danger fw-bold" : "text-muted"}`}>
                              Jatuh tempo: {new Date(payment.due_date).toLocaleDateString("id-ID")}
                            </div>
                          )}
                        </td>
                        <td>
                          {payment.payment_method && (
                            <span className="badge bg-light text-dark">
                              {paymentUtils.getPaymentMethodText(payment.payment_method)}
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleViewDetails(payment)}
                              title="Lihat Detail"
                              disabled={loading}
                            >
                              <i className="bi bi-eye"></i>
                            </button>

                            {paymentUtils.shouldShowVerifyButton(payment) && (
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleOpenVerification(payment)}
                                title="Verifikasi Pembayaran"
                              >
                                <i className="bi bi-check-lg"></i>
                              </button>
                            )}

                            {paymentUtils.canIssueManualInvoice(payment) && (
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleOpenManualInvoice(payment)}
                                title="Buat Tagihan Manual"
                              >
                                <i className="bi bi-file-earmark-plus"></i>
                              </button>
                            )}

                            {paymentUtils.canIssueInvoice(payment) && (
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleOpenInvoice(payment)}
                                title="Terbitkan Tagihan Otomatis"
                              >
                                <i className="bi bi-receipt"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Render Modal */}
      {renderModal()}
    </div>
  );
};

export default PaymentManagement;