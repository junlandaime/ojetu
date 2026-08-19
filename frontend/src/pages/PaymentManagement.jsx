import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   PAYMENT UTILITIES
========================================================= */
const paymentUtils = {
    getStatusBadge: (status) => {
        const statusConfig = {
            pending: {
                tone: "warning",
                icon: "bi-clock-history",
                text: "Menunggu Pembayaran",
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
            text: status || "Belum Ditentukan",
        };
        return (
            <span
                className={`payment-status-badge payment-status-${config.tone}`}
            >
                <i
                    className={`bi ${config.icon}`}
                    aria-hidden="true"
                ></i>
                {config.text}
            </span>
        );
    },
    getPaymentMethodText: (method) => {
        const methods = {
            transfer: "Transfer Bank",
            cash: "Tunai",
            credit_card: "Kartu Kredit",
        };
        return methods[method] || method || "-";
    },
    getPaymentMethodIcon: (method) => {
        const icons = {
            transfer: "bi-bank",
            cash: "bi-cash-stack",
            credit_card: "bi-credit-card",
        };
        return icons[method] || "bi-wallet2";
    },
    getInstallmentPlanText: (plan) => {
        if (!plan || plan === "none") {
            return "Bayar Penuh";
        }
        const count = parseInt(
            String(plan).split("_")[0],
            10
        );
        if ([3, 4, 5, 6].includes(count)) {
            return `${count}x cicilan`;
        }
        return String(plan);
    },
    formatCurrency: (
        value,
        defaultValue = "0"
    ) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return defaultValue;
        }
        const numValue =
            typeof value === "number"
                ? value
                : parseFloat(value);
        if (Number.isNaN(numValue)) {
            return defaultValue;
        }
        return Math.round(
            numValue
        ).toLocaleString("id-ID");
    },
    parseFloatSafe: (
        value,
        defaultValue = 0
    ) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return defaultValue;
        }
        const numValue = parseFloat(value);
        if (Number.isNaN(numValue)) {
            return defaultValue;
        }
        return Math.round(
            numValue * 100
        ) / 100;
    },
    formatDate: (value) => {
        if (!value) {
            return "-";
        }
        const date = new Date(value);
        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }
        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    },
    getInstallmentText: (payment) => {
        if (!payment?.status) {
            return "Belum Ditentukan";
        }
        if (
            payment.status === "paid"
        ) {
            return "Lunas";
        }
        if (
            payment.status === "pending"
        ) {
            return "Menunggu Pembayaran";
        }
        if (
            payment.status.startsWith(
                "installment_"
            )
        ) {
            const installmentNum =
                payment.status.split("_")[1];
            return `Cicilan ${installmentNum}`;
        }
        return payment.status;
    },
    getTotalInstallments: (payment) => {
        if (
            !payment?.program_installment_plan
        ) {
            return 1;
        }
        const plan = String(
            payment.program_installment_plan
        );
        if (plan === "none") {
            return 1;
        }
        const count = parseInt(
            plan.split("_")[0],
            10
        );
        if ([3, 4, 5, 6].includes(count)) {
            return count;
        }
        return 1;
    },
    calculateNextInstallment: (payment) => {
        if (!payment) {
            return {
                number: null,
                amount: 0,
                error: "Data tidak lengkap",
            };
        }
        try {
            const totalAmount =
                paymentUtils.parseFloatSafe(
                    payment.program_training_cost
                );
            const paidAmount =
                paymentUtils.parseFloatSafe(
                    payment.amount_paid || 0
                );
            if (
                paidAmount >= totalAmount
            ) {
                return {
                    number: null,
                    amount: 0,
                    message:
                        "Pembayaran sudah lunas",
                };
            }
            let nextInstallmentNumber = 1;
            let currentInstallment = 0;
            if (
                payment.status === "pending"
            ) {
                currentInstallment = 0;
                nextInstallmentNumber = 1;
            } else if (
                payment.status?.startsWith(
                    "installment_"
                )
            ) {
                currentInstallment =
                    parseInt(
                        payment.status.split(
                            "_"
                        )[1],
                        10
                    ) || 0;
                nextInstallmentNumber =
                    currentInstallment + 1;
            }
            const installmentCount =
                paymentUtils.getTotalInstallments(
                    payment
                );
            if (
                nextInstallmentNumber >
                installmentCount
            ) {
                return {
                    number: null,
                    amount: 0,
                    message: `Maksimal ${installmentCount} cicilan sudah tercapai`,
                };
            }
            const remainingAmount =
                Math.max(
                    0,
                    totalAmount - paidAmount
                );
            const remainingInstallments =
                installmentCount -
                currentInstallment;
            const suggestedAmount =
                remainingInstallments > 0
                    ? Math.round(
                    remainingAmount /
                    remainingInstallments /
                    1000
                ) * 1000
                    : 0;
            return {
                number:
                nextInstallmentNumber,
                amount:
                suggestedAmount,
                totalInstallments:
                installmentCount,
                remainingAmount,
                currentInstallment,
                message:
                    "Admin dapat menentukan nominal tagihan",
            };
        } catch (error) {
            console.error(
                "Error calculating installment:",
                error
            );
            return {
                number: null,
                amount: 0,
                error: error.message,
            };
        }
    },
    canIssueInvoice: (payment) => {
        try {
            if (!payment?.status) {
                return false;
            }
            if (
                !payment.status.startsWith(
                    "installment_"
                )
            ) {
                return false;
            }
            const currentInstallment =
                parseInt(
                    payment.status.split(
                        "_"
                    )[1],
                    10
                ) || 0;
            const totalInstallments =
                paymentUtils.getTotalInstallments(
                    payment
                );
            return (
                currentInstallment <
                totalInstallments
            );
        } catch (error) {
            console.error(
                "Error in canIssueInvoice:",
                error
            );
            return false;
        }
    },
    canIssueManualInvoice: (payment) => {
        try {
            if (!payment?.status) {
                return false;
            }
            if (
                payment.status === "paid" ||
                payment.status === "cancelled"
            ) {
                return false;
            }
            const nextInstallment =
                paymentUtils.calculateNextInstallment(
                    payment
                );
            return (
                nextInstallment.number !== null
            );
        } catch (error) {
            console.error(
                "Error in canIssueManualInvoice:",
                error
            );
            return false;
        }
    },
    getPaymentProgress: (payment) => {
        if (!payment) {
            return {
                percentage: 0,
                paid: 0,
                total: 0,
                remaining: 0,
            };
        }
        const total =
            paymentUtils.parseFloatSafe(
                payment.program_training_cost
            );
        const paid =
            paymentUtils.parseFloatSafe(
                payment.amount_paid || 0
            );
        const remaining =
            Math.max(
                0,
                total - paid
            );
        const percentage =
            total > 0
                ? (paid / total) * 100
                : 0;
        return {
            percentage: Math.min(
                100,
                Math.max(
                    0,
                    Math.round(
                        percentage
                    )
                )
            ),
            paid,
            total,
            remaining,
        };
    },
    shouldShowVerifyButton: (
        payment
    ) => {
        if (!payment) {
            return false;
        }
        return (
            (
                payment.status ===
                "pending" ||
                payment.status?.startsWith(
                    "installment_"
                )
            ) &&
            Boolean(
                payment.proof_image
            )
        );
    },
    validatePayment: (payment) => {
        if (!payment) {
            return {
                isValid: false,
                error:
                    "Data pembayaran tidak ada",
            };
        }
        if (
            !payment.id ||
            payment.id <= 0
        ) {
            return {
                isValid: false,
                error:
                    "ID pembayaran tidak valid",
            };
        }
        if (
            payment.program_training_cost ===
            null ||
            payment.program_training_cost ===
            undefined
        ) {
            return {
                isValid: false,
                error:
                    "Data program tidak lengkap",
            };
        }
        return {
            isValid: true,
            error: null,
        };
    },
    getImageUrl: (path) => {
        if (!path) {
            return null;
        }
        if (
            path.startsWith("http")
        ) {
            return path;
        }
        return `http://localhost:5000${path}`;
    },
    getInitials: (name) => {
        if (!name) {
            return "P";
        }
        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) =>
                part
                    .charAt(0)
                    .toUpperCase()
            )
            .join("");
    },
};

/* =========================================================
   MODAL TYPES
========================================================= */
const MODAL_TYPES = {
    NONE: null,
    DETAIL: "detail",
    MANUAL: "manual",
    VERIFICATION: "verification",
    INVOICE: "invoice",
    MANUAL_INVOICE: "manual_invoice",
    PREVIEW: "preview",
};

/* =========================================================
   PAYMENT MANAGEMENT
========================================================= */
const PaymentManagement = () => {
    const [payments, setPayments] =
        useState([]);
    const [programs, setPrograms] =
        useState([]);
    const [
        registrations,
        setRegistrations,
    ] = useState([]);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] =
        useState("");
    const [stats, setStats] =
        useState(null);
    const [filters, setFilters] =
        useState({
            status: "all",
            program: "all",
            search: "",
        });
    const [
        searchInput,
        setSearchInput,
    ] = useState("");
    const [
        activeModal,
        setActiveModal,
    ] = useState(
        MODAL_TYPES.NONE
    );
    const [
        selectedPayment,
        setSelectedPayment,
    ] = useState(null);
    const [
        previewImage,
        setPreviewImage,
    ] = useState(null);
    const [formData, setFormData] =
        useState({
            registration_id: "",
            amount: "",
            amount_paid: "",
            payment_method: "transfer",
            bank_name: "",
            account_number: "",
            status: "pending",
            payment_date: new Date()
                .toISOString()
                .split("T")[0],
            notes: "",
        });
    const [
        manualInvoiceForm,
        setManualInvoiceForm,
    ] = useState({
        installment_number: 1,
        amount: "",
        due_date: new Date(
            Date.now() +
            30 *
            24 *
            60 *
            60 *
            1000
        )
            .toISOString()
            .split("T")[0],
        notes: "",
    });
    const [
        proofFile,
        setProofFile,
    ] = useState(null);
    const [
        uploadLoading,
        setUploadLoading,
    ] = useState(false);
    const [
        verificationForm,
        setVerificationForm,
    ] = useState({
        status: "paid",
        rejection_reason: "",
        amount_paid: 0,
    });
    const [
        invoiceForm,
        setInvoiceForm,
    ] = useState({
        due_date: new Date(
            Date.now() +
            30 *
            24 *
            60 *
            60 *
            1000
        )
            .toISOString()
            .split("T")[0],
        amount: 0,
        installment_number: 1,
        notes: "",
    });
    const { user } = useAuth();
    const abortControllerRef =
        useRef(null);
    const searchTimeoutRef =
        useRef(null);

    /* =========================================================
       FETCH PAYMENTS
    ========================================================= */
    const fetchPayments =
        useCallback(async () => {
            try {
                setLoading(true);
                setError("");
                if (
                    abortControllerRef.current
                ) {
                    abortControllerRef.current.abort();
                }
                abortControllerRef.current =
                    new AbortController();
                const params =
                    new URLSearchParams();
                Object.keys(
                    filters
                ).forEach((key) => {
                    if (
                        filters[key] !==
                        "all" &&
                        filters[key] !== ""
                    ) {
                        params.append(
                            key,
                            filters[key]
                        );
                    }
                });
                const response =
                    await axios.get(
                        `/api/payments?${params.toString()}`,
                        {
                            signal:
                            abortControllerRef
                                .current
                                .signal,
                            timeout: 10000,
                        }
                    );
                if (
                    response.data?.success
                ) {
                    setPayments(
                        Array.isArray(
                            response.data.data
                        )
                            ? response.data
                                .data
                            : []
                    );
                } else {
                    throw new Error(
                        "Format respons tidak valid"
                    );
                }
            } catch (error) {
                if (
                    axios.isCancel(
                        error
                    ) ||
                    error?.code ===
                    "ERR_CANCELED"
                ) {
                    return;
                }
                console.error(
                    "Error fetching payments:",
                    error
                );
                setError(
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Gagal memuat data pembayaran"
                );
            } finally {
                setLoading(false);
            }
        }, [
            filters.status,
            filters.program,
            filters.search,
        ]);

    /* =========================================================
       FETCH PROGRAMS
    ========================================================= */
    const fetchPrograms =
        useCallback(async () => {
            try {
                const response =
                    await axios.get(
                        "/api/programs",
                        {
                            timeout: 10000,
                        }
                    );
                if (
                    response.data?.success
                ) {
                    setPrograms(
                        Array.isArray(
                            response.data.data
                        )
                            ? response.data
                                .data
                            : []
                    );
                }
            } catch (error) {
                console.error(
                    "Error fetching programs:",
                    error
                );
            }
        }, []);

    /* =========================================================
       FETCH REGISTRATIONS
    ========================================================= */
    const fetchRegistrations =
        useCallback(async () => {
            try {
                const response =
                    await axios.get(
                        "/api/registrations",
                        {
                            timeout: 10000,
                        }
                    );
                if (
                    response.data?.success
                ) {
                    setRegistrations(
                        Array.isArray(
                            response.data.data
                        )
                            ? response.data
                                .data
                            : []
                    );
                }
            } catch (error) {
                console.error(
                    "Error fetching registrations:",
                    error
                );
            }
        }, []);

    /* =========================================================
       FETCH STATISTICS
    ========================================================= */
    const fetchStatistics =
        useCallback(async () => {
            try {
                const response =
                    await axios.get(
                        "/api/payments/statistics",
                        {
                            timeout: 10000,
                        }
                    );
                if (
                    response.data?.success
                ) {
                    setStats(
                        response.data.data
                    );
                }
            } catch (error) {
                console.error(
                    "Error fetching payment statistics:",
                    error
                );
            }
        }, []);

    /* =========================================================
       RESET MODALS
    ========================================================= */
    const resetModals =
        useCallback(() => {
            setActiveModal(
                MODAL_TYPES.NONE
            );
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
                due_date: new Date(
                    Date.now() +
                    30 *
                    24 *
                    60 *
                    60 *
                    1000
                )
                    .toISOString()
                    .split("T")[0],
                notes: "",
            });
        }, []);

    /* =========================================================
       VIEW DETAILS
    ========================================================= */
    const handleViewDetails =
        async (payment) => {
            const validation =
                paymentUtils.validatePayment(
                    payment
                );
            if (!validation.isValid) {
                alert(
                    validation.error
                );
                return;
            }
            try {
                setLoading(true);
                const response =
                    await axios.get(
                        `/api/payments/${payment.id}`,
                        {
                            timeout: 10000,
                        }
                    );
                if (
                    response.data?.success
                ) {
                    setSelectedPayment(
                        response.data.data
                    );
                    setActiveModal(
                        MODAL_TYPES.DETAIL
                    );
                }
            } catch (error) {
                console.error(
                    "Error fetching payment details:",
                    error
                );
                alert(
                    "Error loading payment details: " +
                    (
                        error.response?.data
                            ?.message ||
                        error.message
                    )
                );
            } finally {
                setLoading(false);
            }
        };

    /* =========================================================
       OPEN MANUAL PAYMENT
    ========================================================= */
    const handleOpenManualPayment =
        () => {
            setActiveModal(
                MODAL_TYPES.MANUAL
            );
        };

    /* =========================================================
       PREVIEW PROOF
    ========================================================= */
    const handlePreviewProof = (
        payment
    ) => {
        if (
            !payment?.proof_image
        ) {
            alert(
                "Tidak ada bukti pembayaran untuk ditampilkan."
            );
            return;
        }
        setPreviewImage(
            paymentUtils.getImageUrl(
                payment.proof_image
            )
        );
        setActiveModal(
            MODAL_TYPES.PREVIEW
        );
    };

    /* =========================================================
       OPEN VERIFICATION
    ========================================================= */
    const handleOpenVerification =
        async (payment) => {
            const validation =
                paymentUtils.validatePayment(
                    payment
                );
            if (!validation.isValid) {
                alert(
                    validation.error
                );
                return;
            }
            try {
                setLoading(true);
                const response =
                    await axios.get(
                        `/api/payments/${payment.id}`,
                        {
                            timeout: 10000,
                        }
                    );
                if (
                    response.data?.success
                ) {
                    const latestPayment =
                        response.data.data;
                    setSelectedPayment(
                        latestPayment
                    );
                    const totalAmount =
                        paymentUtils.parseFloatSafe(
                            latestPayment.program_training_cost
                        );
                    const installmentCount =
                        paymentUtils.getTotalInstallments(
                            latestPayment
                        );
                    const suggestedAmount =
                        installmentCount > 0
                            ? Math.round(
                                totalAmount /
                                installmentCount
                            )
                            : totalAmount;
                    let nextStatus =
                        latestPayment.status;
                    if (
                        latestPayment.status ===
                        "pending"
                    ) {
                        nextStatus =
                            installmentCount === 1
                                ? "paid"
                                : "installment_1";
                    }
                    setVerificationForm({
                        status:
                        nextStatus,
                        rejection_reason:
                            "",
                        amount_paid:
                        suggestedAmount,
                    });
                    setActiveModal(
                        MODAL_TYPES.VERIFICATION
                    );
                }
            } catch (error) {
                console.error(
                    "Error preparing verification:",
                    error
                );
                alert(
                    "Error mempersiapkan verifikasi: " +
                    (
                        error.response?.data
                            ?.message ||
                        error.message
                    )
                );
            } finally {
                setLoading(false);
            }
        };

    /* =========================================================
       OPEN MANUAL INVOICE
    ========================================================= */
    const handleOpenManualInvoice = (
        payment
    ) => {
        const validation =
            paymentUtils.validatePayment(
                payment
            );
        if (!validation.isValid) {
            alert(
                validation.error
            );
            return;
        }
        if (
            !paymentUtils.canIssueManualInvoice(
                payment
            )
        ) {
            alert(
                "Tidak dapat membuat tagihan manual untuk pembayaran ini."
            );
            return;
        }
        const nextInstallment =
            paymentUtils.calculateNextInstallment(
                payment
            );
        setManualInvoiceForm({
            installment_number:
                nextInstallment.number ||
                1,
            amount:
                nextInstallment.amount ||
                "",
            due_date: new Date(
                Date.now() +
                30 *
                24 *
                60 *
                60 *
                1000
            )
                .toISOString()
                .split("T")[0],
            notes: `Tagihan cicilan ${
                nextInstallment.number ||
                1
            } untuk program ${
                payment.program_name
            }`,
        });
        setSelectedPayment(
            payment
        );
        setActiveModal(
            MODAL_TYPES.MANUAL_INVOICE
        );
    };

    /* =========================================================
       OPEN INVOICE
    ========================================================= */
    const handleOpenInvoice = (
        payment
    ) => {
        const validation =
            paymentUtils.validatePayment(
                payment
            );
        if (!validation.isValid) {
            alert(
                validation.error
            );
            return;
        }
        if (
            !paymentUtils.canIssueInvoice(
                payment
            )
        ) {
            alert(
                "Tidak dapat menerbitkan tagihan untuk pembayaran ini."
            );
            return;
        }
        const nextInstallment =
            paymentUtils.calculateNextInstallment(
                payment
            );
        const dueDate =
            new Date();
        dueDate.setDate(
            dueDate.getDate() + 30
        );
        setInvoiceForm({
            due_date:
                dueDate
                    .toISOString()
                    .split("T")[0],
            amount:
                nextInstallment.amount ||
                0,
            installment_number:
                nextInstallment.number ||
                1,
            notes: `Tagihan cicilan ${
                nextInstallment.number ||
                1
            } untuk program ${
                payment.program_name
            }`,
        });
        setSelectedPayment(
            payment
        );
        setActiveModal(
            MODAL_TYPES.INVOICE
        );
    };

    /* =========================================================
       FILE UPLOAD
    ========================================================= */
    const handleFileUpload =
        async (
            paymentId,
            file
        ) => {
            if (!file) {
                return null;
            }
            try {
                setUploadLoading(
                    true
                );
                const uploadData =
                    new FormData();
                uploadData.append(
                    "proof_image",
                    file
                );
                const response =
                    await axios.post(
                        `/api/payments/${paymentId}/upload-proof`,
                        uploadData,
                        {
                            headers: {
                                "Content-Type":
                                    "multipart/form-data",
                            },
                            timeout:
                                30000,
                        }
                    );
                if (
                    response.data?.success
                ) {
                    return response.data
                        .data.proof_image;
                }
                throw new Error(
                    "Upload bukti pembayaran gagal"
                );
            } finally {
                setUploadLoading(
                    false
                );
            }
        };
    const handleFileChange = (
        event
    ) => {
        const file =
            event.target.files?.[0];
        if (!file) {
            return;
        }
        if (
            file.size >
            5 * 1024 * 1024
        ) {
            alert(
                "Ukuran file terlalu besar. Maksimal 5MB."
            );
            event.target.value =
                "";
            return;
        }
        if (
            !file.type.startsWith(
                "image/"
            )
        ) {
            alert(
                "Hanya file gambar yang diizinkan."
            );
            event.target.value =
                "";
            return;
        }
        setProofFile(file);
    };

    /* =========================================================
       MANUAL PAYMENT SUBMIT
    ========================================================= */
    const handleManualPaymentSubmit =
        async (event) => {
            event.preventDefault();
            if (
                !formData.registration_id
            ) {
                alert(
                    "Pilih pendaftaran terlebih dahulu"
                );
                return;
            }
            try {
                setUploadLoading(
                    true
                );
                const payload = {
                    registration_id:
                        parseInt(
                            formData.registration_id,
                            10
                        ),
                    amount_paid:
                        paymentUtils.parseFloatSafe(
                            formData.amount_paid
                        ),
                    payment_method:
                    formData.payment_method,
                    bank_name:
                    formData.bank_name,
                    account_number:
                    formData.account_number,
                    status:
                    formData.status,
                    payment_date:
                    formData.payment_date,
                    notes:
                    formData.notes,
                    verified_by:
                    user?.id,
                };
                const response =
                    await axios.post(
                        "/api/payments/manual",
                        payload,
                        {
                            timeout:
                                15000,
                        }
                    );
                if (
                    response.data?.success
                ) {
                    const paymentId =
                        response.data.data
                            ?.payment_id;
                    if (
                        proofFile &&
                        paymentId
                    ) {
                        await handleFileUpload(
                            paymentId,
                            proofFile
                        );
                    }
                    alert(
                        "Pembayaran manual berhasil diproses!"
                    );
                    resetModals();
                    setFormData({
                        registration_id:
                            "",
                        amount: "",
                        amount_paid: "",
                        payment_method:
                            "transfer",
                        bank_name: "",
                        account_number:
                            "",
                        status:
                            "pending",
                        payment_date:
                            new Date()
                                .toISOString()
                                .split(
                                    "T"
                                )[0],
                        notes: "",
                    });
                    await Promise.all([
                        fetchPayments(),
                        fetchStatistics(),
                    ]);
                }
            } catch (error) {
                console.error(
                    "Error processing manual payment:",
                    error
                );
                alert(
                    "Error processing payment: " +
                    (
                        error.response?.data
                            ?.message ||
                        error.message
                    )
                );
            } finally {
                setUploadLoading(
                    false
                );
            }
        };

    /* =========================================================
       MANUAL INVOICE SUBMIT
    ========================================================= */
    const handleManualInvoiceSubmit =
        async (event) => {
            event.preventDefault();
            if (
                !selectedPayment?.id
            ) {
                alert(
                    "Data pembayaran tidak valid"
                );
                return;
            }
            const nextInstallment =
                paymentUtils.calculateNextInstallment(
                    selectedPayment
                );
            if (
                Number(
                    manualInvoiceForm.installment_number
                ) !==
                Number(
                    nextInstallment.number
                )
            ) {
                alert(
                    `Cicilan berikutnya yang diharapkan adalah cicilan ke-${nextInstallment.number}.`
                );
                return;
            }
            if (
                Number(
                    manualInvoiceForm.amount
                ) <= 0
            ) {
                alert(
                    "Jumlah tagihan harus lebih dari 0"
                );
                return;
            }
            try {
                const response =
                    await axios.post(
                        `/api/payments/${selectedPayment.id}/create-invoice`,
                        {
                            installment_number:
                                Number(
                                    manualInvoiceForm.installment_number
                                ),
                            amount:
                                paymentUtils.parseFloatSafe(
                                    manualInvoiceForm.amount
                                ),
                            due_date:
                            manualInvoiceForm.due_date,
                            notes:
                            manualInvoiceForm.notes,
                            verified_by:
                            user?.id,
                        },
                        {
                            timeout:
                                15000,
                        }
                    );
                if (
                    response.data?.success
                ) {
                    alert(
                        "Tagihan berhasil dibuat."
                    );
                    resetModals();
                    await Promise.all([
                        fetchPayments(),
                        fetchStatistics(),
                    ]);
                }
            } catch (error) {
                alert(
                    error.response?.data
                        ?.message ||
                    error.message
                );
            }
        };

    /* =========================================================
       VERIFICATION SUBMIT
    ========================================================= */
    const handleVerificationSubmit =
        async (event) => {
            event.preventDefault();
            if (
                !selectedPayment?.id
            ) {
                return;
            }
            const amount =
                paymentUtils.parseFloatSafe(
                    verificationForm.amount_paid
                );
            if (
                verificationForm.status !==
                "cancelled" &&
                amount <= 0
            ) {
                alert(
                    "Jumlah pembayaran harus lebih dari 0"
                );
                return;
            }
            try {
                const response =
                    await axios.put(
                        `/api/payments/${selectedPayment.id}/status`,
                        {
                            status:
                            verificationForm.status,
                            amount_paid:
                            amount,
                            notes:
                                verificationForm.rejection_reason ||
                                `Verifikasi pembayaran - ${verificationForm.status}`,
                            verified_by:
                            user?.id,
                        },
                        {
                            timeout:
                                15000,
                        }
                    );
                if (
                    response.data?.success
                ) {
                    alert(
                        "Verifikasi pembayaran berhasil."
                    );
                    resetModals();
                    await Promise.all([
                        fetchPayments(),
                        fetchStatistics(),
                    ]);
                }
            } catch (error) {
                alert(
                    error.response?.data
                        ?.message ||
                    error.message
                );
            }
        };

    /* =========================================================
       INVOICE SUBMIT
    ========================================================= */
    const handleInvoiceSubmit =
        async (event) => {
            event.preventDefault();
            if (
                !selectedPayment?.id
            ) {
                return;
            }
            try {
                const response =
                    await axios.put(
                        `/api/payments/${selectedPayment.id}/due-date`,
                        {
                            due_date:
                            invoiceForm.due_date,
                            notes:
                            invoiceForm.notes,
                            verified_by:
                            user?.id,
                        },
                        {
                            timeout:
                                15000,
                        }
                    );
                if (
                    response.data?.success
                ) {
                    alert(
                        "Tagihan berhasil diterbitkan."
                    );
                    resetModals();
                    await Promise.all([
                        fetchPayments(),
                        fetchStatistics(),
                    ]);
                }
            } catch (error) {
                alert(
                    error.response?.data
                        ?.message ||
                    error.message
                );
            }
        };

    /* =========================================================
       FILTER
    ========================================================= */
    const handleFilterChange =
        useCallback(
            (key, value) => {
                setFilters(
                    (prev) => ({
                        ...prev,
                        [key]: value,
                    })
                );
            },
            []
        );
    const handleSearchChange =
        useCallback(
            (value) => {
                setSearchInput(value);
                if (
                    searchTimeoutRef.current
                ) {
                    clearTimeout(
                        searchTimeoutRef.current
                    );
                }
                searchTimeoutRef.current =
                    setTimeout(() => {
                        handleFilterChange(
                            "search",
                            value.trim()
                        );
                    }, 500);
            },
            [
                handleFilterChange,
            ]
        );
    const handleResetFilters =
        () => {
            setSearchInput("");
            setFilters({
                status: "all",
                program: "all",
                search: "",
            });
        };
    const hasActiveFilters =
        filters.status !== "all" ||
        filters.program !== "all" ||
        filters.search !== "";

    /* =========================================================
       EFFECTS
    ========================================================= */
    useEffect(() => {
        fetchPrograms();
        fetchRegistrations();
        fetchStatistics();
        return () => {
            if (
                abortControllerRef.current
            ) {
                abortControllerRef.current.abort();
            }
            if (
                searchTimeoutRef.current
            ) {
                clearTimeout(
                    searchTimeoutRef.current
                );
            }
        };
    }, [
        fetchPrograms,
        fetchRegistrations,
        fetchStatistics,
    ]);
    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    /* =========================================================
       STATISTICS
    ========================================================= */
    const realStats = {
        totalRevenue:
            payments.reduce(
                (
                    total,
                    payment
                ) =>
                    total +
                    paymentUtils.parseFloatSafe(
                        payment.amount_paid
                    ),
                0
            ),
        pendingVerification:
        payments.filter(
            (payment) =>
                payment.status ===
                "pending"
        ).length,
        totalTransactions:
        payments.length,
    };
    const summaryStats = {
        totalRevenue:
            stats?.totalRevenue ??
            stats?.total_revenue ??
            realStats.totalRevenue,
        pendingVerification:
            stats?.pendingVerification ??
            stats?.pending_verification ??
            realStats.pendingVerification,
        totalTransactions:
            stats?.totalTransactions ??
            stats?.total_transactions ??
            realStats.totalTransactions,
    };

    /* =========================================================
       PAYMENT ACTIONS
    ========================================================= */
    const renderPaymentActions = (
        payment,
        showLabels = false
    ) => (
        <div
            className={`payment-action-group ${
                showLabels
                    ? "payment-action-group-mobile"
                    : ""
            }`}
        >
            <button
                type="button"
                className="payment-action-btn"
                onClick={() =>
                    handleViewDetails(
                        payment
                    )
                }
                title="Lihat detail"
            >
                <i className="bi bi-eye"></i>
                {showLabels && (
                    <span>Detail</span>
                )}
            </button>
            {paymentUtils.shouldShowVerifyButton(
                payment
            ) && (
                <button
                    type="button"
                    className="payment-action-btn payment-action-success"
                    onClick={() =>
                        handleOpenVerification(
                            payment
                        )
                    }
                    title="Verifikasi pembayaran"
                >
                    <i className="bi bi-check2-circle"></i>
                    {showLabels && (
                        <span>
                            Verifikasi
                        </span>
                    )}
                </button>
            )}
            {paymentUtils.canIssueManualInvoice(
                payment
            ) && (
                <button
                    type="button"
                    className="payment-action-btn"
                    onClick={() =>
                        handleOpenManualInvoice(
                            payment
                        )
                    }
                    title="Buat tagihan"
                >
                    <i className="bi bi-file-earmark-plus"></i>
                    {showLabels && (
                        <span>
                            Buat Tagihan
                        </span>
                    )}
                </button>
            )}
            {paymentUtils.canIssueInvoice(
                payment
            ) && (
                <button
                    type="button"
                    className="payment-action-btn"
                    onClick={() =>
                        handleOpenInvoice(
                            payment
                        )
                    }
                    title="Terbitkan tagihan"
                >
                    <i className="bi bi-receipt"></i>
                    {showLabels && (
                        <span>
                            Terbitkan
                        </span>
                    )}
                </button>
            )}
        </div>
    );

    /* =========================================================
       DETAIL MODAL
    ========================================================= */
    const renderDetailModal = () => {
        if (!selectedPayment) {
            return null;
        }
        const progress =
            paymentUtils.getPaymentProgress(
                selectedPayment
            );
        return (
            <div
                className="payment-modal-overlay"
                onClick={resetModals}
            >
                <div
                    className="payment-modal-dialog payment-modal-large"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >
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
                                        ·{" "}
                                        {
                                            selectedPayment.full_name
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="payment-modal-close"
                                onClick={resetModals}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="payment-modal-body">
                            <div className="payment-detail-grid">
                                <div className="payment-detail-card">
                                    <div className="payment-detail-card-heading">
                                        <i className="bi bi-person"></i>
                                        <h4>
                                            Peserta
                                        </h4>
                                    </div>
                                    <dl>
                                        <div>
                                            <dt>
                                                Nama
                                            </dt>
                                            <dd>
                                                {
                                                    selectedPayment.full_name
                                                }
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>
                                                Email
                                            </dt>
                                            <dd>
                                                {
                                                    selectedPayment.email
                                                }
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>
                                                Program
                                            </dt>
                                            <dd>
                                                {
                                                    selectedPayment.program_name
                                                }
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>
                                                Pendaftaran
                                            </dt>
                                            <dd>
                                                {
                                                    selectedPayment.registration_code
                                                }
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="payment-detail-card">
                                    <div className="payment-detail-card-heading">
                                        <i className="bi bi-wallet2"></i>
                                        <h4>
                                            Pembayaran
                                        </h4>
                                    </div>
                                    <dl>
                                        <div>
                                            <dt>
                                                Skema
                                            </dt>
                                            <dd>
                                                {paymentUtils.getInstallmentPlanText(
                                                    selectedPayment.program_installment_plan
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>
                                                Total
                                            </dt>
                                            <dd>
                                                Rp{" "}
                                                {paymentUtils.formatCurrency(
                                                    progress.total
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>
                                                Dibayar
                                            </dt>
                                            <dd>
                                                Rp{" "}
                                                {paymentUtils.formatCurrency(
                                                    progress.paid
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>
                                                Sisa
                                            </dt>
                                            <dd>
                                                Rp{" "}
                                                {paymentUtils.formatCurrency(
                                                    progress.remaining
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            <div className="payment-detail-progress-card">
                                <div className="payment-progress-header">
                                    <span>
                                        Progress
                                    </span>
                                    <strong>
                                        {
                                            progress.percentage
                                        }
                                        %
                                    </strong>
                                </div>
                                <div className="payment-progress-track">
                                    <span
                                        style={{
                                            width: `${progress.percentage}%`,
                                        }}
                                    ></span>
                                </div>
                            </div>
                            {selectedPayment.proof_image && (
                                <div className="payment-proof-preview">
                                    <div className="payment-proof-preview-header">
                                        <div>
                                            <i className="bi bi-image"></i>
                                            <strong>
                                                Bukti Pembayaran
                                            </strong>
                                        </div>
                                    </div>
                                    <img
                                        src={paymentUtils.getImageUrl(
                                            selectedPayment.proof_image
                                        )}
                                        alt="Bukti Pembayaran"
                                        onClick={() =>
                                            handlePreviewProof(
                                                selectedPayment
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </div>
                        <div className="payment-modal-footer">
                            <button
                                type="button"
                                className="payment-secondary-btn"
                                onClick={resetModals}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /* =========================================================
       MANUAL PAYMENT MODAL
    ========================================================= */
    const renderManualPaymentModal =
        () => (
            <div
                className="payment-modal-overlay"
                onClick={resetModals}
            >
                <div
                    className="payment-modal-dialog"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >
                    <div className="payment-modal-content">
                        <div className="payment-modal-header">
                            <div className="payment-modal-title-wrap">
                                <div className="payment-modal-title-icon">
                                    <i className="bi bi-plus-circle"></i>
                                </div>
                                <div>
                                    <h3>
                                        Tambah Pembayaran Manual
                                    </h3>
                                    <p>
                                        Catat transaksi pembayaran peserta.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="payment-modal-close"
                                onClick={resetModals}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <form
                            onSubmit={
                                handleManualPaymentSubmit
                            }
                        >
                            <div className="payment-modal-body">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Peserta
                                    </label>
                                    <select
                                        className="form-select"
                                        value={
                                            formData.registration_id
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setFormData(
                                                (
                                                    prev
                                                ) => ({
                                                    ...prev,
                                                    registration_id:
                                                    event
                                                        .target
                                                        .value,
                                                })
                                            )
                                        }
                                        required
                                    >
                                        <option value="">
                                            Pilih peserta
                                        </option>
                                        {registrations.map(
                                            (
                                                registration
                                            ) => (
                                                <option
                                                    key={
                                                        registration.id
                                                    }
                                                    value={
                                                        registration.id
                                                    }
                                                >
                                                    {
                                                        registration.registration_code
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        registration.full_name
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        registration.program_name
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Jumlah Pembayaran
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="1"
                                            value={
                                                formData.amount_paid
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setFormData(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        amount_paid:
                                                        event
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Status
                                        </label>
                                        <select
                                            className="form-select"
                                            value={
                                                formData.status
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setFormData(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        status:
                                                        event
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        >
                                            <option value="pending">
                                                Pending
                                            </option>
                                            {[1, 2, 3, 4, 5, 6].map(
                                                (
                                                    number
                                                ) => (
                                                    <option
                                                        key={
                                                            number
                                                        }
                                                        value={`installment_${number}`}
                                                    >
                                                        Cicilan{" "}
                                                        {
                                                            number
                                                        }
                                                    </option>
                                                )
                                            )}
                                            <option value="paid">
                                                Lunas
                                            </option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Metode
                                        </label>
                                        <select
                                            className="form-select"
                                            value={
                                                formData.payment_method
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setFormData(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        payment_method:
                                                        event
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        >
                                            <option value="transfer">
                                                Transfer Bank
                                            </option>
                                            <option value="cash">
                                                Tunai
                                            </option>
                                            <option value="credit_card">
                                                Kartu Kredit
                                            </option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={
                                                formData.payment_date
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setFormData(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        payment_date:
                                                        event
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Bank
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                formData.bank_name
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setFormData(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        bank_name:
                                                        event
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Nomor Rekening
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                formData.account_number
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setFormData(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        account_number:
                                                        event
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="payment-upload-box">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={
                                                    handleFileChange
                                                }
                                            />
                                            <div className="payment-upload-icon">
                                                <i className="bi bi-cloud-arrow-up"></i>
                                            </div>
                                            <strong>
                                                {proofFile
                                                    ? proofFile.name
                                                    : "Upload Bukti Pembayaran"}
                                            </strong>
                                            <span>
                                                JPG atau PNG, maksimal 5 MB
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Catatan
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={
                                                formData.notes
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setFormData(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        notes:
                                                        event
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="payment-modal-footer">
                                <button
                                    type="button"
                                    className="payment-secondary-btn"
                                    onClick={resetModals}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="payment-primary-btn"
                                    disabled={
                                        uploadLoading
                                    }
                                >
                                    {uploadLoading
                                        ? "Memproses..."
                                        : "Simpan Pembayaran"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );

    /* =========================================================
       VERIFICATION MODAL
    ========================================================= */
    const renderVerificationModal =
        () => (
            <div
                className="payment-modal-overlay"
                onClick={resetModals}
            >
                <div
                    className="payment-modal-dialog"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >
                    <div className="payment-modal-content">
                        <div className="payment-modal-header">
                            <div className="payment-modal-title-wrap">
                                <div className="payment-modal-title-icon">
                                    <i className="bi bi-check2-circle"></i>
                                </div>
                                <div>
                                    <h3>
                                        Verifikasi Pembayaran
                                    </h3>
                                    <p>
                                        Periksa pembayaran sebelum memperbarui status.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="payment-modal-close"
                                onClick={resetModals}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <form
                            onSubmit={
                                handleVerificationSubmit
                            }
                        >
                            <div className="payment-modal-body">
                                {selectedPayment && (
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                Status
                                            </label>
                                            <select
                                                className="form-select"
                                                value={
                                                    verificationForm.status
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setVerificationForm(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            status:
                                                            event
                                                                .target
                                                                .value,
                                                        })
                                                    )
                                                }
                                            >
                                                {selectedPayment.status ===
                                                    "pending" &&
                                                    paymentUtils.getTotalInstallments(
                                                        selectedPayment
                                                    ) >
                                                    1 && (
                                                        <option value="installment_1">
                                                            Verifikasi Cicilan 1
                                                        </option>
                                                    )}
                                                <option value="paid">
                                                    Lunas
                                                </option>
                                                <option value="cancelled">
                                                    Tolak Pembayaran
                                                </option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                Jumlah Dibayar
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={
                                                    verificationForm.amount_paid
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setVerificationForm(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            amount_paid:
                                                            event
                                                                .target
                                                                .value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>
                                        {verificationForm.status ===
                                            "cancelled" && (
                                                <div className="col-12">
                                                    <label className="form-label">
                                                        Alasan Penolakan
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        value={
                                                            verificationForm.rejection_reason
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setVerificationForm(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    rejection_reason:
                                                                    event
                                                                        .target
                                                                        .value,
                                                                })
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                    </div>
                                )}
                            </div>
                            <div className="payment-modal-footer">
                                <button
                                    type="button"
                                    className="payment-secondary-btn"
                                    onClick={resetModals}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="payment-primary-btn"
                                >
                                    Verifikasi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );

    /* =========================================================
       MANUAL INVOICE MODAL
    ========================================================= */
    const renderManualInvoiceModal =
        () => (
            <div
                className="payment-modal-overlay"
                onClick={resetModals}
            >
                <div
                    className="payment-modal-dialog"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >
                    <div className="payment-modal-content">
                        <div className="payment-modal-header">
                            <div className="payment-modal-title-wrap">
                                <div className="payment-modal-title-icon">
                                    <i className="bi bi-file-earmark-plus"></i>
                                </div>
                                <div>
                                    <h3>
                                        Buat Tagihan Manual
                                    </h3>
                                    <p>
                                        Tentukan nominal cicilan berikutnya.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="payment-modal-close"
                                onClick={resetModals}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <form
                            onSubmit={
                                handleManualInvoiceSubmit
                            }
                        >
                            <div className="payment-modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Cicilan Ke
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={
                                                manualInvoiceForm.installment_number
                                            }
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Nominal
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={
                                                manualInvoiceForm.amount
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setManualInvoiceForm(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        amount:
                                                        event
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Jatuh Tempo
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={
                                                manualInvoiceForm.due_date
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setManualInvoiceForm(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        due_date:
                                                        event
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Catatan
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={
                                                manualInvoiceForm.notes
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setManualInvoiceForm(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        notes:
                                                        event
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="payment-modal-footer">
                                <button
                                    type="button"
                                    className="payment-secondary-btn"
                                    onClick={resetModals}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="payment-primary-btn"
                                >
                                    Buat Tagihan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );

    /* =========================================================
       INVOICE MODAL
    ========================================================= */
    const renderInvoiceModal =
        () => (
            <div
                className="payment-modal-overlay"
                onClick={resetModals}
            >
                <div
                    className="payment-modal-dialog"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >
                    <div className="payment-modal-content">
                        <div className="payment-modal-header">
                            <div className="payment-modal-title-wrap">
                                <div className="payment-modal-title-icon">
                                    <i className="bi bi-receipt"></i>
                                </div>
                                <div>
                                    <h3>
                                        Terbitkan Tagihan
                                    </h3>
                                    <p>
                                        Tentukan tanggal jatuh tempo pembayaran.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="payment-modal-close"
                                onClick={resetModals}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <form
                            onSubmit={
                                handleInvoiceSubmit
                            }
                        >
                            <div className="payment-modal-body">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Jatuh Tempo
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={
                                            invoiceForm.due_date
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setInvoiceForm(
                                                (
                                                    prev
                                                ) => ({
                                                    ...prev,
                                                    due_date:
                                                    event
                                                        .target
                                                        .value,
                                                })
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="form-label">
                                        Catatan
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={
                                            invoiceForm.notes
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setInvoiceForm(
                                                (
                                                    prev
                                                ) => ({
                                                    ...prev,
                                                    notes:
                                                    event
                                                        .target
                                                        .value,
                                                })
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="payment-modal-footer">
                                <button
                                    type="button"
                                    className="payment-secondary-btn"
                                    onClick={resetModals}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="payment-primary-btn"
                                >
                                    Terbitkan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );

    /* =========================================================
       PREVIEW MODAL
    ========================================================= */
    const renderPreviewModal =
        () => (
            <div
                className="payment-modal-overlay"
                onClick={resetModals}
            >
                <div
                    className="payment-modal-dialog payment-modal-large"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >
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
                                </div>
                            </div>
                            <button
                                type="button"
                                className="payment-modal-close"
                                onClick={resetModals}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="payment-modal-body">
                            <div className="payment-proof-image-view">
                                {previewImage && (
                                    <img
                                        src={
                                            previewImage
                                        }
                                        alt="Bukti Pembayaran"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    /* =========================================================
       RENDER MODAL
    ========================================================= */
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

    /* =========================================================
       LOADING
    ========================================================= */
    if (
        loading &&
        payments.length === 0
    ) {
        return (
            <div className="payment-page payment-management-page">
                <div className="payment-shell">
                    <div className="payment-loading-state">
                        <div className="payment-loading-icon">
                            <span
                                className="spinner-border"
                                role="status"
                            ></span>
                        </div>
                        <strong>
                            Memuat data pembayaran
                        </strong>
                        <span>
                            Mohon tunggu, data transaksi sedang disiapkan.
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    /* =========================================================
       MAIN RENDER
    ========================================================= */
    return (
        <div className="payment-page payment-management-page">
            <div className="payment-shell">
                {/* =========================================================
                   PAGE HEADER
                ========================================================= */}
                <div className="payment-page-header">
                    <div className="payment-page-title">
                        <div className="payment-page-eyebrow">
                            <span className="payment-eyebrow-icon">
                                <i className="bi bi-wallet2"></i>
                            </span>
                            MANAJEMEN KEUANGAN
                        </div>
                        <h1>
                            Manajemen Pembayaran
                        </h1>
                        <p>
                            Kelola pembayaran, verifikasi transaksi, dan pantau progress pelunasan peserta.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="payment-add-button"
                        onClick={
                            handleOpenManualPayment
                        }
                    >
                        <span className="payment-add-button-icon">
                            <i className="bi bi-plus-lg"></i>
                        </span>
                        <span className="payment-add-button-text">
                            <strong>
                                Tambah Pembayaran
                            </strong>
                            <small>
                                Input transaksi manual
                            </small>
                        </span>
                    </button>
                </div>

                {/* =========================================================
                   STATISTICS
                ========================================================= */}
                <div className="payment-stats-grid">
                    <div className="payment-stat-card payment-stat-revenue">
                        <div className="payment-stat-top">
                            <div className="payment-stat-icon">
                                <i className="bi bi-graph-up-arrow"></i>
                            </div>
                            <span className="payment-stat-tag">
                                Pemasukan
                            </span>
                        </div>
                        <div className="payment-stat-content">
                            <span className="payment-stat-label">
                                Total Pemasukan
                            </span>
                            <strong className="payment-stat-value">
                                Rp{" "}
                                {paymentUtils.formatCurrency(
                                    summaryStats.totalRevenue
                                )}
                            </strong>
                            <p>
                                Total pembayaran yang telah tercatat dalam sistem.
                            </p>
                        </div>
                        <div className="payment-stat-decoration"></div>
                    </div>
                    <div className="payment-stat-card payment-stat-pending">
                        <div className="payment-stat-top">
                            <div className="payment-stat-icon">
                                <i className="bi bi-hourglass-split"></i>
                            </div>
                            <span className="payment-stat-tag">
                                Perlu Tindakan
                            </span>
                        </div>
                        <div className="payment-stat-content">
                            <span className="payment-stat-label">
                                Menunggu Verifikasi
                            </span>
                            <strong className="payment-stat-value">
                                {
                                    summaryStats.pendingVerification
                                }{" "}
                                <small>
                                    Transaksi
                                </small>
                            </strong>
                            <p>
                                Pembayaran yang masih membutuhkan tindakan admin.
                            </p>
                        </div>
                        <div className="payment-stat-decoration"></div>
                    </div>
                    <div className="payment-stat-card payment-stat-transactions">
                        <div className="payment-stat-top">
                            <div className="payment-stat-icon">
                                <i className="bi bi-receipt-cutoff"></i>
                            </div>
                            <span className="payment-stat-tag">
                                Database
                            </span>
                        </div>
                        <div className="payment-stat-content">
                            <span className="payment-stat-label">
                                Total Transaksi
                            </span>
                            <strong className="payment-stat-value">
                                {
                                    summaryStats.totalTransactions
                                }{" "}
                                <small>
                                    Transaksi
                                </small>
                            </strong>
                            <p>
                                Seluruh transaksi pembayaran peserta.
                            </p>
                        </div>
                        <div className="payment-stat-decoration"></div>
                    </div>
                </div>

                {/* =========================================================
                   FILTER
                ========================================================= */}
                <section className="payment-content-card payment-filter-card">
                    <div className="payment-card-heading">
                        <div className="payment-card-heading-left">
                            <div className="payment-section-icon">
                                <i className="bi bi-funnel"></i>
                            </div>
                            <div>
                                <span>
                                    FILTER DATA
                                </span>
                                <h3>
                                    Filter & Pencarian
                                </h3>
                                <p>
                                    Temukan transaksi berdasarkan peserta, status, atau program.
                                </p>
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                className="payment-reset-filter"
                                onClick={
                                    handleResetFilters
                                }
                            >
                                <i className="bi bi-arrow-counterclockwise"></i>
                                Reset Filter
                            </button>
                        )}
                    </div>
                    <div className="payment-filter-body">
                        <div className="payment-filter-grid">
                            <div className="payment-filter-field payment-filter-search-field">
                                <label htmlFor="payment-search">
                                    Pencarian
                                </label>
                                <div className="payment-search-input">
                                    <i className="bi bi-search payment-search-icon"></i>
                                    <input
                                        id="payment-search"
                                        type="text"
                                        value={
                                            searchInput
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleSearchChange(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Cari peserta, email, kode pendaftaran, atau invoice..."
                                    />
                                    {searchInput && (
                                        <button
                                            type="button"
                                            className="payment-search-clear"
                                            onClick={() => {
                                                setSearchInput(
                                                    ""
                                                );
                                                handleFilterChange(
                                                    "search",
                                                    ""
                                                );
                                            }}
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="payment-filter-field">
                                <label>
                                    Status Pembayaran
                                </label>
                                <select
                                    className="form-select"
                                    value={
                                        filters.status
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        handleFilterChange(
                                            "status",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                >
                                    <option value="all">
                                        Semua Status
                                    </option>
                                    <option value="pending">
                                        Menunggu Pembayaran
                                    </option>
                                    {[1, 2, 3, 4, 5, 6].map(
                                        (
                                            number
                                        ) => (
                                            <option
                                                key={
                                                    number
                                                }
                                                value={`installment_${number}`}
                                            >
                                                Cicilan{" "}
                                                {
                                                    number
                                                }
                                            </option>
                                        )
                                    )}
                                    <option value="paid">
                                        Lunas
                                    </option>
                                    <option value="overdue">
                                        Jatuh Tempo
                                    </option>
                                </select>
                            </div>
                            <div className="payment-filter-field">
                                <label>
                                    Program
                                </label>
                                <select
                                    className="form-select"
                                    value={
                                        filters.program
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        handleFilterChange(
                                            "program",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                >
                                    <option value="all">
                                        Semua Program
                                    </option>
                                    {programs.map(
                                        (
                                            program
                                        ) => (
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
                        </div>
                    </div>
                </section>

                {/* =========================================================
                   DATABASE INVOICE
                ========================================================= */}
                <section className="payment-content-card payment-invoice-card">
                    <div className="payment-card-heading payment-invoice-heading">
                        <div className="payment-card-heading-left">
                            <div className="payment-section-icon">
                                <i className="bi bi-receipt"></i>
                            </div>
                            <div>
                                <span>
                                    DATABASE TRANSAKSI
                                </span>
                                <h3>
                                    Daftar Invoice
                                </h3>
                                <p>
                                    Menampilkan{" "}
                                    {
                                        payments.length
                                    }{" "}
                                    transaksi berdasarkan filter aktif.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="payment-refresh-btn"
                            onClick={() =>
                                Promise.all([
                                    fetchPayments(),
                                    fetchStatistics(),
                                ])
                            }
                            disabled={
                                loading
                            }
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                            Refresh
                        </button>
                    </div>
                    {error && (
                        <div className="payment-message danger">
                            <div className="payment-message-icon">
                                <i className="bi bi-exclamation-triangle"></i>
                            </div>
                            <div className="payment-message-content">
                                <strong>
                                    Data pembayaran gagal dimuat
                                </strong>
                                <span>
                                    {
                                        error
                                    }
                                </span>
                            </div>
                        </div>
                    )}
                    {payments.length ===
                    0 ? (
                        <div className="payment-empty-state">
                            <div className="payment-empty-icon">
                                <i className="bi bi-receipt"></i>
                            </div>
                            <h3>
                                Tidak ada data pembayaran
                            </h3>
                            <p>
                                Belum ada transaksi yang sesuai dengan filter.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="payment-table-wrapper d-none d-lg-block">
                                <table className="payment-table payment-invoice-table">
                                    <thead>
                                    <tr>
                                        <th>
                                            Invoice
                                        </th>
                                        <th>
                                            Peserta
                                        </th>
                                        <th>
                                            Program
                                        </th>
                                        <th>
                                            Progress
                                        </th>
                                        <th>
                                            Status
                                        </th>
                                        <th>
                                            Tanggal
                                        </th>
                                        <th>
                                            Metode
                                        </th>
                                        <th>
                                            Aksi
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {payments.map(
                                        (
                                            payment
                                        ) => {
                                            const progress =
                                                paymentUtils.getPaymentProgress(
                                                    payment
                                                );
                                            const nextInstallment =
                                                paymentUtils.calculateNextInstallment(
                                                    payment
                                                );
                                            return (
                                                <tr
                                                    key={
                                                        payment.id
                                                    }
                                                >
                                                    <td>
                                                        <div className="payment-invoice-cell">
                                                            <div className="payment-table-icon">
                                                                <i className="bi bi-receipt"></i>
                                                            </div>
                                                            <div>
                                                                <strong>
                                                                    {
                                                                        payment.invoice_number
                                                                    }
                                                                </strong>
                                                                {payment.receipt_number && (
                                                                    <small>
                                                                        Kwitansi{" "}
                                                                        {
                                                                            payment.receipt_number
                                                                        }
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="payment-invoice-cell">
                                                            <div className="payment-table-icon">
                                                                {paymentUtils.getInitials(
                                                                    payment.full_name
                                                                )}
                                                            </div>
                                                            <div>
                                                                <strong>
                                                                    {
                                                                        payment.full_name
                                                                    }
                                                                </strong>
                                                                <small>
                                                                    {
                                                                        payment.email
                                                                    }
                                                                </small>
                                                                <small>
                                                                    {
                                                                        payment.registration_code
                                                                    }
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="payment-program-cell">
                                                            <strong>
                                                                {
                                                                    payment.program_name
                                                                }
                                                            </strong>
                                                            <span>
                                                                {payment.program_duration ||
                                                                    "-"}
                                                            </span>
                                                            <small>
                                                                {paymentUtils.getInstallmentPlanText(
                                                                    payment.program_installment_plan
                                                                )}
                                                            </small>
                                                            <small>
                                                                Rp{" "}
                                                                {paymentUtils.formatCurrency(
                                                                    payment.program_training_cost
                                                                )}
                                                            </small>
                                                            {nextInstallment.number && (
                                                                <small>
                                                                    Cicilan berikutnya: Ke-
                                                                    {
                                                                        nextInstallment.number
                                                                    }
                                                                </small>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="payment-progress-cell">
                                                            <div className="payment-progress-header">
                                                                <span>
                                                                    {
                                                                        progress.percentage
                                                                    }
                                                                    %
                                                                </span>
                                                                <strong>
                                                                    Rp{" "}
                                                                    {paymentUtils.formatCurrency(
                                                                        progress.paid
                                                                    )}
                                                                </strong>
                                                            </div>
                                                            <div className="payment-progress-track">
                                                                <span
                                                                    style={{
                                                                        width: `${progress.percentage}%`,
                                                                    }}
                                                                ></span>
                                                            </div>
                                                            <div className="payment-progress-values">
                                                                Sisa Rp{" "}
                                                                {paymentUtils.formatCurrency(
                                                                    progress.remaining
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="payment-status-cell">
                                                            {paymentUtils.getStatusBadge(
                                                                payment.status
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <strong>
                                                            {paymentUtils.formatDate(
                                                                payment.created_at
                                                            )}
                                                        </strong>
                                                        {payment.due_date && (
                                                            <small>
                                                                Jatuh tempo{" "}
                                                                {paymentUtils.formatDate(
                                                                    payment.due_date
                                                                )}
                                                            </small>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span>
                                                            <i
                                                                className={`bi ${paymentUtils.getPaymentMethodIcon(
                                                                    payment.payment_method
                                                                )}`}
                                                            ></i>{" "}
                                                            {paymentUtils.getPaymentMethodText(
                                                                payment.payment_method
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {renderPaymentActions(
                                                            payment
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="payment-mobile-list d-lg-none">
                                {payments.map(
                                    (
                                        payment
                                    ) => {
                                        const progress =
                                            paymentUtils.getPaymentProgress(
                                                payment
                                            );
                                        return (
                                            <article
                                                className="payment-mobile-card"
                                                key={
                                                    payment.id
                                                }
                                            >
                                                <div className="payment-mobile-card-header">
                                                    <strong>
                                                        {
                                                            payment.invoice_number
                                                        }
                                                    </strong>
                                                    {paymentUtils.getStatusBadge(
                                                        payment.status
                                                    )}
                                                </div>
                                                <div className="payment-mobile-participant">
                                                    <strong>
                                                        {
                                                            payment.full_name
                                                        }
                                                    </strong>
                                                    <span>
                                                        {
                                                            payment.email
                                                        }
                                                    </span>
                                                </div>
                                                <div className="payment-mobile-info-grid">
                                                    <div>
                                                        <span>
                                                            Program
                                                        </span>
                                                        <strong>
                                                            {
                                                                payment.program_name
                                                            }
                                                        </strong>
                                                    </div>
                                                    <div>
                                                        <span>
                                                            Skema
                                                        </span>
                                                        <strong>
                                                            {paymentUtils.getInstallmentPlanText(
                                                                payment.program_installment_plan
                                                            )}
                                                        </strong>
                                                    </div>
                                                    <div>
                                                        <span>
                                                            Total
                                                        </span>
                                                        <strong>
                                                            Rp{" "}
                                                            {paymentUtils.formatCurrency(
                                                                payment.program_training_cost
                                                            )}
                                                        </strong>
                                                    </div>
                                                    <div>
                                                        <span>
                                                            Tanggal
                                                        </span>
                                                        <strong>
                                                            {paymentUtils.formatDate(
                                                                payment.created_at
                                                            )}
                                                        </strong>
                                                    </div>
                                                </div>
                                                <div className="payment-mobile-progress">
                                                    <div className="payment-progress-header">
                                                        <span>
                                                            Progress
                                                        </span>
                                                        <strong>
                                                            {
                                                                progress.percentage
                                                            }
                                                            %
                                                        </strong>
                                                    </div>
                                                    <div className="payment-progress-track">
                                                        <span
                                                            style={{
                                                                width: `${progress.percentage}%`,
                                                            }}
                                                        ></span>
                                                    </div>
                                                    <small>
                                                        Sisa Rp{" "}
                                                        {paymentUtils.formatCurrency(
                                                            progress.remaining
                                                        )}
                                                    </small>
                                                </div>
                                                {renderPaymentActions(
                                                    payment,
                                                    true
                                                )}
                                            </article>
                                        );
                                    }
                                )}
                            </div>
                            <div className="payment-table-footer">
                                <div>
                                    <i className="bi bi-database"></i>{" "}
                                    {
                                        payments.length
                                    }{" "}
                                    transaksi ditampilkan
                                </div>
                            </div>
                        </>
                    )}
                </section>

                {/* =========================================================
                   ACTIVE MODAL
                ========================================================= */}
                {renderModal()}
            </div>
        </div>
    );
};

export default PaymentManagement;