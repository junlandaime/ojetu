import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import PDFDocument from "pdfkit";
import db, {
  generateInvoiceNumber,
  generateReceiptNumber,
} from "../config/database.js";
import {
  sendEmail,
  createInvoiceEmailTemplate,
  createPaymentStatusEmailTemplate,
} from "../services/emailService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const ensureUploadsDir = () => {
  const dirs = [
    path.join(__dirname, "../uploads"),
    path.join(__dirname, "../uploads/payments"),
    // Tambahkan folder storage untuk menyimpan PDF statis
    path.join(__dirname, "../storage"),
    path.join(__dirname, "../storage/invoices"),
    path.join(__dirname, "../storage/receipts"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureUploadsDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDir();
    cb(null, path.join(__dirname, "../uploads/payments"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "payment-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar yang diizinkan!"), false);
    }
  },
});

const getTotalInstallments = (program) => {
  if (!program) return 4;

  const plan = program.program_installment_plan || program.installment_plan;

  if (!plan) return 4;

  if (plan === "none") return 1;
  if (plan === "4_installments") return 4;
  if (plan === "6_installments") return 6;

  const installments = parseInt(plan.split("_")[0]);
  return isNaN(installments) ? 4 : installments;
};

const validateStatusProgression = async (
  currentStatus,
  newStatus,
  currentInstallment,
  totalInstallments,
  paymentId,
  connection
) => {
  if (currentStatus === newStatus) {
    return { isValid: true };
  }

  if (currentStatus === "pending" && newStatus === "installment_1") {
    return { isValid: true, nextInstallment: 1 };
  }

  if (
    currentStatus.startsWith("installment_") &&
    newStatus.startsWith("installment_")
  ) {
    const currentNum = parseInt(currentStatus.split("_")[1]);
    const newNum = parseInt(newStatus.split("_")[1]);

    if (newNum !== currentNum + 1) {
      return {
        isValid: false,
        error: `Tidak bisa melompat cicilan. Dari ${currentStatus} harus ke installment_${currentNum + 1}`,
      };
    }

    const [previousPayments] = await connection.query(
      `SELECT * FROM payment_history 
       WHERE payment_id = ? 
       AND new_status = ? 
       AND amount_changed > 0`,
      [paymentId, currentStatus]
    );

    if (previousPayments.length === 0) {
      return {
        isValid: false,
        error: `Tidak bisa lanjut ke cicilan ${newNum}. Cicilan ${currentNum} belum dibayar.`,
      };
    }

    return { isValid: true, nextInstallment: newNum };
  }

  if (currentStatus.startsWith("installment_") && newStatus === "paid") {
    const currentNum = parseInt(currentStatus.split("_")[1]);

    if (currentNum !== totalInstallments) {
      return {
        isValid: false,
        error: `Belum bisa lunas. Masih ada ${totalInstallments - currentNum} cicilan lagi`,
      };
    }

    const lastInstallment = `installment_${currentNum}`;
    const [paidHistory] = await connection.query(
      `SELECT * FROM payment_history 
       WHERE payment_id = ? 
       AND new_status = ? 
       AND amount_changed > 0`,
      [paymentId, lastInstallment]
    );

    if (paidHistory.length === 0) {
      return {
        isValid: false,
        error: `Tidak bisa melunasi. Cicilan ${currentNum} belum dibayar.`,
      };
    }

    return { isValid: true, nextInstallment: 0 };
  }

  if (newStatus === "cancelled") {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `Transisi status tidak valid: dari ${currentStatus} ke ${newStatus}`,
  };
};

const getStatusText = (status) => {
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
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return "Rp 0";
  const numValue = parseFloat(value);
  return isNaN(numValue)
    ? "Rp 0"
    : `Rp ${Math.round(numValue).toLocaleString("id-ID")}`;
};

const sanitizeAmountValue = (value, defaultValue = null) => {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  if (typeof value === "number") {
    return Number.isNaN(value) ? defaultValue : value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return defaultValue;
    }

    const filtered = trimmed.replace(/[^0-9,.-]/g, "");

    if (!filtered) {
      return defaultValue;
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
      return defaultValue;
    }

    const integerValue = parseInt(integerDigits, 10);

    if (Number.isNaN(integerValue)) {
      return defaultValue;
    }

    if (fractionValue > 0) {
      return integerValue >= 0
        ? integerValue + fractionValue
        : integerValue - fractionValue;
    }

    return integerValue;
  }

  return defaultValue;
};

const formatLongDate = (value) => {
  if (!value) {
    return new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  try {
    return new Date(value).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date", error);
    return new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

const formatTime = (value) => {
  if (!value) {
    return new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  try {
    return new Date(value).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting time", error);
    return new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

const numberToBahasa = (value) => {
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
};

const findLogoPath = () => {
  const candidates = [
    path.join(__dirname, "../../frontend/public/images/logo/fitalenta_2024.png"),
    path.join(__dirname, "../../frontend/public/logo.png"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
};

const parseInstallmentAmounts = (payment) => {
  if (!payment || !payment.installment_amounts) {
    return {};
  }

  try {
    return typeof payment.installment_amounts === "string"
      ? JSON.parse(payment.installment_amounts)
      : payment.installment_amounts || {};
  } catch (error) {
    console.error("Error parsing installment_amounts:", error);
   return {};
  }
};

const parseInstallmentAmount = (payment, installmentNumber) => {
  if (!payment || !installmentNumber) {
    return 0;
  }

  const installmentData = parseInstallmentAmounts(payment);
  const key = `installment_${installmentNumber}`;
  const amountValue = installmentData?.[key]?.amount;
  const sanitizedAmount = sanitizeAmountValue(amountValue, 0);

  return sanitizedAmount ?? 0;
};

const ensureInstallmentEntry = (installmentAmounts, installmentNumber) => {
  if (!installmentNumber) return installmentAmounts;

  const key = `installment_${installmentNumber}`;
  const cloned = { ...(installmentAmounts || {}) };

  if (!cloned[key]) {
    cloned[key] = {};
  }

  return cloned;
};

const getLastPaymentChange = async (payment, statusFilter = null) => {
  if (!payment || !payment.id) {
    return 0;
  }

  const params = [payment.id];
  let statusClause = "";

  if (statusFilter) {
    statusClause = " AND new_status = ?";
    params.push(statusFilter);
  }

  const [history] = await db
    .promise()
    .query(
      `SELECT amount_changed
       FROM payment_history
       WHERE payment_id = ?${statusClause}
         AND amount_changed IS NOT NULL
       ORDER BY changed_at DESC
       LIMIT 1`,
      params
    );

  if (history.length > 0) {
    const amount = parseFloat(history[0].amount_changed);
    if (!isNaN(amount) && amount > 0) {
      return amount;
    }
  }

  return 0;
};

const resolveCurrentPaymentContext = async (
  payment,
  totalAmount,
  options = {}
) => {
  const rawStatus = payment?.status || "";
  let targetStatus = options.status || rawStatus;
  const totalInstallments = getTotalInstallments(payment);
  let amountValue = parseFloat(payment?.amount_paid || 0) || 0;
  let installmentNumber = options.installmentNumber || null;

  if (!targetStatus && installmentNumber) {
    targetStatus = `installment_${installmentNumber}`;
  }

  if (!targetStatus) {
    targetStatus = rawStatus;
  }

   if (!installmentNumber && targetStatus?.startsWith("installment_")) {
    const parsedInstallment = parseInt(targetStatus.split("_")[1]);
    if (!isNaN(parsedInstallment)) {
      installmentNumber = parsedInstallment;
    }
  }

  let label = getStatusText(targetStatus || rawStatus);
  const installmentData = parseInstallmentAmounts(payment);
  let installmentEntry = installmentNumber
    ? installmentData[`installment_${installmentNumber}`] || {}
    : null;

  if (installmentNumber) {
    label = `Cicilan Ke-${installmentNumber}`;

    const configuredAmount = parseInstallmentAmount(payment, installmentNumber);
    if (configuredAmount > 0) {
      amountValue = configuredAmount;
    } else {
      const historicalAmount = await getLastPaymentChange(
        payment,
        `installment_${installmentNumber}`
      );
      if (historicalAmount > 0) {
        amountValue = historicalAmount;
      } else {
        amountValue =
          totalInstallments > 0 ? totalAmount / totalInstallments : totalAmount;
      }
    }
   } else if (targetStatus === "paid") {
    const historicalAmount = await getLastPaymentChange(payment, "paid");
    if (historicalAmount > 0) {
      amountValue = historicalAmount;
    } else if (totalAmount > 0) {
      amountValue = totalAmount;
    }
    label = "Pelunasan";
 } else if (targetStatus) {
    const historicalAmount = await getLastPaymentChange(payment, targetStatus);
    if (historicalAmount > 0) {
      amountValue = historicalAmount;
    } else if (!amountValue || amountValue <= 0) {
      if (payment?.amount && parseFloat(payment.amount) > 0) {
        amountValue = parseFloat(payment.amount);
      } else if (totalInstallments > 0) {
      amountValue = totalAmount / totalInstallments;
      } else {
        amountValue = totalAmount;
      }
    }
  }

const dueDate = installmentEntry?.due_date || payment?.due_date || null;
  const receiptNumber =
    installmentEntry?.receipt_number || payment?.receipt_number || null;

  return {
    amountValue,
    label,
    installmentNumber,
    totalInstallments,
     status: targetStatus,
    dueDate,
    receiptNumber,
    installmentEntry: installmentEntry || null,
  };
};

// ==========================================
// [START] PDF GENERATOR & SNAPSHOT ENGINE
// ==========================================

const getAssetPath = (type) => {
  // Helper mencari path gambar
  const logoPath = findLogoPath(); // Menggunakan fungsi findLogoPath yg sudah ada di file Anda
  if (type === 'logo') return logoPath;
  // Sesuaikan path signature ini dengan struktur folder Anda jika perlu
  if (type === 'signature') return path.join(__dirname, '../../frontend/public/signature.jpg');
  return null;
};

// 1. LAYOUT INVOICE (Diekstrak dari kode lama Anda)
const drawInvoiceLayout = (doc, payment, context) => {
    const { amountValue, installmentEntry, dueDate, label } = context;
    // Gunakan tanggal issued dari history jika ada, atau hari ini
    const invoiceDate = installmentEntry?.invoice_issued_at || installmentEntry?.created_at || new Date(); 
    const formattedInvoiceDate = formatLongDate(invoiceDate);
    const invoiceAmount = amountValue || 0;
    
    // Setup Fonts
    const fontRegular = "Helvetica";
    const fontBold = "Helvetica-Bold";
    const fontItalic = "Helvetica-Oblique";
    const black = "#000000";

    // --- HEADER ---
    const logoPath = getAssetPath('logo');
    if (logoPath) doc.image(logoPath, 50, 40, { width: 150 });

    const headerTextX = 220;
    doc.font(fontBold).fontSize(11).fillColor(black).text("PT FAST Indo Talenta", headerTextX, 45);
    doc.font(fontRegular).fontSize(9)
       .text("Gedung Science and Techno Park ITB", headerTextX)
       .text("Jl. Ganesa No.15E, Lb. Siliwangi, Kec. Coblong Bandung 40132")
       .text("Telp: +62 81110119273")
       .text("fitalenta.co.id");

    doc.y = 130; 

    // --- INFO SURAT ---
    doc.font(fontRegular).fontSize(11).text(`Bandung, ${formattedInvoiceDate}`, 50, doc.y);
    doc.moveDown(0.5);
    doc.text(`No: ${payment.invoice_number}`);
    doc.moveDown(1);

    // --- PENERIMA ---
    doc.text("Kepada Yth.");
    doc.font(fontBold).text(payment.full_name || "-");
    doc.moveDown(1.5);

    // --- PERIHAL ---
    doc.font(fontBold)
       .text("Perihal: ", { continued: true, underline: false })
       .text(`Invoice ${label} ${payment.program_name}`, { underline: true });
    doc.moveDown(1.5);

    // --- BODY ---
    doc.font(fontItalic).text("Assalamu’alaikum Warahmatullahi Wabarakatuh.");
    doc.moveDown(1);

    doc.font(fontRegular)
       .text("Salam hormat,", { lineGap: 5 })
       .text(
         `Terimakasih atas kepercayaan yang diberikan kepada PT FAST Indo Talenta untuk ikut serta dalam pengiriman tenaga kerja melalui ${payment.program_name}. Bersama ini kami sampaikan tagihan biaya ${payment.program_name} melalui skema cicilan.`,
         { align: "justify", lineGap: 3, indent: 30 }
       );

    // --- TABEL RINCIAN ---
    const boxX = 50;
    const boxWidth = doc.page.width - 100;
    const col1X = boxX + 10;
    const col2X = col1X + 150;
    const col3X = col2X + 15;
    const col3Width = boxWidth - 175;
    
    const boxStartY = doc.y + 15; 
    let currentY = boxStartY + 15;

    const drawRow = (l, v) => {
        const startRowY = currentY;
        doc.font(fontBold).text(l, col1X, startRowY);
        doc.font(fontRegular).text(":", col2X, startRowY);
        doc.text(v, col3X, startRowY, { width: col3Width, align: 'left' });
        const h = Math.max(doc.heightOfString(v, { width: col3Width }), 15);
        currentY = startRowY + h + 8;
    };

    drawRow("Nama Program", payment.program_name || "-");
    drawRow("Tagihan", formatCurrency(invoiceAmount));
    drawRow("Rincian Tagihan", `${label} Biaya Program`);
    drawRow("Rekening Tujuan", "PT FAST Indo Talenta\nNomor Rekening BCA 2828339333");
    
    const dDate = dueDate ? formatLongDate(dueDate) : "-";
    drawRow("Catatan", `Batas akhir pembayaran s.d ${dDate}, pukul 23.59`);

    const boxEndY = currentY + 7;
    doc.rect(boxX, boxStartY, boxWidth, boxEndY - boxStartY).stroke(black);
    doc.y = boxEndY + 15;

    // --- DISCLAIMER & FOOTER ---
    doc.font(fontRegular).text("        Sesuai dengan ketentuan yang berlaku, ", 50, doc.y , { continued: true, align: 'justify' });
    doc.font(fontBold).text("seluruh pembayaran yang telah dibayarkan tidak dapat dikembalikan dengan alasan apa pun", 50, doc.y , { continued: true });
    doc.font(fontRegular).text(". Harap dapat melakukan pengecekan kembali atas rincian invoice yang Anda terima. Demikian invoice yang kami berikan, atas perhatian Anda kami ucapkan terimakasih.", 50, doc.y);
    doc.moveDown(1);

    doc.font(fontItalic).text("Wassalamu’alaikum Warahmatullahi Wabarakatuh.", 50, doc.y);
    doc.moveDown(2);

    if (doc.y > doc.page.height - 150) doc.addPage();

    doc.font(fontRegular).text("Hormat Kami,", 50, doc.y);
    const sigY = doc.y + 10;
    const sigPath = getAssetPath('signature');
    if (sigPath && fs.existsSync(sigPath)) doc.image(sigPath, 50, sigY, { height: 60 });
    
    doc.y = sigY + 70; 
    doc.font(fontBold).text("Ii Ratna Yanti Kosasih, S.Si., M.Sc.", 50, doc.y, { underline: true });
    doc.font(fontRegular).text("General Manager");

    const footerY = doc.page.height - 50;
    doc.fontSize(8).font(fontItalic).text("Fathanah | Amanah | Shiddiq | Tabligh", 50, footerY, { align: "right", width: doc.page.width - 100 });
};

// 2. LAYOUT RECEIPT / KWITANSI (Diekstrak dari kode lama Anda)
const drawReceiptLayout = (doc, payment, context) => {
    const { amountValue, receiptNumber, installmentEntry, label } = context;
    const amountInWords = numberToBahasa(amountValue);
    // Gunakan tanggal bayar dari history jika ada
    const receiptDate = formatLongDate(installmentEntry?.paid_at || installmentEntry?.verified_at || new Date());

    const startX = 60;
    const pageWidth = doc.page.width; 
    const rightMarginX = pageWidth - 60;
    const contentWidth = rightMarginX - startX;
    const headerY = 50;

    // Header
    doc.font("Times-Bold").fontSize(42).fillColor("#000000").text("KWITANSI", startX, headerY);
    doc.font("Helvetica").fontSize(12).text(`No: ${receiptNumber}`, startX, headerY + 45);
    
    const logoPath = getAssetPath('logo');
    if (logoPath) doc.image(logoPath, pageWidth - 280, 25, { width: 220 });

    doc.moveTo(startX, headerY + 70).lineTo(rightMarginX, headerY + 70).lineWidth(2).stroke();

    // Body
    const contentY = headerY + 100;
    const colonX = startX + 180; 
    const valueX = startX + 200;
    const rowGap = 35; 

    const drawRow = (l, v, y, italic = false) => {
      doc.font("Helvetica").fontSize(14).fillColor("#000000").text(l, startX, y);
      doc.text(":", colonX, y);
      doc.font(italic ? "Helvetica-Oblique" : "Helvetica-Bold")
         .fontSize(14).text(v, valueX, y, { width: contentWidth - 220, align: "left" });
    };

    drawRow("Telah diterima dari", payment.full_name || "-", contentY);
    
    const amountHeight = doc.heightOfString(amountInWords + " Rupiah", { width: contentWidth - 220 });
    drawRow("Uang sejumlah", amountInWords + " Rupiah", contentY + rowGap, true);

    let currentY = contentY + rowGap + (amountHeight > 25 ? amountHeight : 25) + 15;
    drawRow("Untuk", `${label} - ${payment.program_name || "-"}`, currentY);

    // Separator
    currentY += 60;
    doc.moveTo(startX, currentY).lineTo(rightMarginX, currentY).lineWidth(1).dash(5, { space: 5 }).stroke();
    doc.undash(); 

    // Footer
    const footerY = currentY + 40;
    doc.font("Helvetica").fontSize(12)
       .text("Rekening BCA Cab. Maranatha Bandung", startX, footerY)
       .text("2828339333 a.n PT FAST Indo Talenta", startX, footerY + 20);

    const boxTop = footerY + 60;
    const boxWidth = 250;
    doc.lineWidth(2).rect(startX, boxTop, boxWidth, 60).stroke();
    doc.font("Helvetica-Bold").fontSize(22)
       .text(formatCurrency(amountValue), startX, boxTop + 20, { width: boxWidth, align: "center" });

    // TTD
    const signAreaWidth = 250;
    const signStartX = rightMarginX - signAreaWidth;
    doc.font("Helvetica").fontSize(12).text(`Bandung, ${receiptDate}`, signStartX, footerY, { width: signAreaWidth, align: "center" });

    const sigPath = getAssetPath('signature');
    if (sigPath && fs.existsSync(sigPath)) doc.image(sigPath, pageWidth - 270, footerY + 30, { width: 150 }); // Adjust position as needed

    const nameY = footerY + 120;
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#000000")
       .text("Ii Ratna Yanti Kosasih", signStartX, nameY, { width: signAreaWidth, align: "center", underline: true });
    doc.font("Helvetica").fontSize(11).text("General Manager", signStartX, nameY + 20, { width: signAreaWidth, align: "center" });

    doc.font("Times-Roman").fontSize(10).fillColor("#666666")
       .text("FATHANAH | AMANAH | SHIDDIQ | TABLIGH", 0, doc.page.height - 40, { align: "center" });
};

// 3. GENERATOR UTAMA (SNAPSHOT LOGIC)
const generateAndSaveDocument = async (type, paymentData, context) => {
    // Nama file unik berdasarkan installment number
    const filename = `${type}-${paymentData.id}-${context.installmentNumber || 'full'}.pdf`;
    const filePath = path.join(__dirname, `../storage/${type}s`, filename);

    // Pastikan folder ada
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // JIKA FILE SUDAH ADA, KEMBALIKAN PATH-NYA (FREEZE DATA)
    if (fs.existsSync(filePath)) {
        return filePath;
    }

    return new Promise((resolve, reject) => {
        const pdfOptions = type === 'receipt' ? { size: "A4", layout: "landscape", margin: 50 } : { size: "A4", margin: 50 };
        const doc = new PDFDocument(pdfOptions);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        if (type === 'invoice') drawInvoiceLayout(doc, paymentData, context);
        else if (type === 'receipt') drawReceiptLayout(doc, paymentData, context);

        doc.end();

        stream.on("finish", () => resolve(filePath));
        stream.on("error", (err) => reject(err));
    });
};
// ==========================================
// [END] PDF GENERATOR
// ==========================================

router.get("/", async (req, res) => {
  try {
    const { status, program, search, start_date, end_date } = req.query;

    let query = `
      SELECT 
        py.*,
        r.registration_code,
        r.id as registration_id,
        u.full_name,
        u.email,
        u.phone,
        p.name as program_name,
        p.training_cost as program_training_cost,
        p.departure_cost as program_departure_cost,
        p.duration as program_duration,
        p.installment_plan as program_installment_plan
      FROM payments py
      LEFT JOIN registrations r ON py.registration_id = r.id
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN programs p ON r.program_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== "all") {
      query += " AND py.status = ?";
      params.push(status);
    }

    if (program && program !== "all") {
      query += " AND p.id = ?";
      params.push(program);
    }

    if (search) {
      query +=
        " AND (u.full_name LIKE ? OR u.email LIKE ? OR py.invoice_number LIKE ? OR r.registration_code LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (start_date) {
      query += " AND DATE(py.created_at) >= ?";
      params.push(start_date);
    }

    if (end_date) {
      query += " AND DATE(py.created_at) <= ?";
      params.push(end_date);
    }

    query += " ORDER BY py.created_at DESC";

    const [payments] = await db.promise().query(query, params);

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/statistics", async (req, res) => {
  try {
    const [stats] = await db.promise().query(`
      SELECT 
        COUNT(*) as total_payments,
        COALESCE(SUM(amount_paid), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending_payments,
        COALESCE(SUM(CASE WHEN status LIKE 'installment_%' THEN 1 ELSE 0 END), 0) as installment_payments,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END), 0) as paid_payments,
        COALESCE(SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END), 0) as overdue_payments
      FROM payments
      WHERE status != 'cancelled'
    `);

    const [recentPayments] = await db.promise().query(`
      SELECT 
        py.*,
        u.full_name,
        p.name as program_name
      FROM payments py
      LEFT JOIN registrations r ON py.registration_id = r.id
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN programs p ON r.program_id = p.id
      WHERE py.status != 'cancelled'
      ORDER BY py.created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        statistics: stats[0],
        recentPayments,
      },
    });
  } catch (error) {
    console.error("Error fetching payment statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const [payments] = await db.promise().query(
      `
      SELECT 
        py.*,
        r.registration_code,
        p.name as program_name,
        p.training_cost as program_training_cost,
        p.departure_cost as program_departure_cost,
        p.duration as program_duration,
        p.installment_plan as program_installment_plan
      FROM payments py
      LEFT JOIN registrations r ON py.registration_id = r.id
      LEFT JOIN programs p ON r.program_id = p.id
      WHERE r.user_id = ? AND py.status != 'cancelled'
      ORDER BY py.created_at DESC
    `,
      [req.params.userId]
    );

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post(
  "/:id/upload-proof",
  upload.single("proof_image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Tidak ada file yang diupload",
        });
      }

      const proofImage = `/uploads/payments/${req.file.filename}`;
      const [payments] = await db
        .promise()
        .query(
          `SELECT py.*, p.installment_plan as program_installment_plan
           FROM payments py
           LEFT JOIN registrations r ON py.registration_id = r.id
           LEFT JOIN programs p ON r.program_id = p.id
           WHERE py.id = ?`,
          [req.params.id]
        );

      if (payments.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      const payment = payments[0];
      let installmentNumber = null;

      if (payment.status && payment.status.startsWith("installment_")) {
        installmentNumber = parseInt(payment.status.split("_")[1]);
      } else if (payment.current_installment_number) {
        installmentNumber = payment.current_installment_number;
      } else if (payment.status === "pending") {
        installmentNumber = 1;
      }

      if (!installmentNumber || isNaN(installmentNumber)) {
        installmentNumber = 1;
      }

      const existingInstallments = parseInstallmentAmounts(payment);
      const updatedInstallments = ensureInstallmentEntry(
        existingInstallments,
        installmentNumber
      );

      const key = `installment_${installmentNumber}`;
      updatedInstallments[key] = {
        ...updatedInstallments[key],
        proof_image: proofImage,
        proof_uploaded_at: new Date().toISOString(),
        status: "waiting_verification",
      };

      await db
        .promise()
       .query(
          `UPDATE payments
           SET proof_image = ?,
               verified_by = NULL,
               verified_at = NULL,
               installment_amounts = ?,
               updated_at = NOW()
           WHERE id = ?`,
          [proofImage, JSON.stringify(updatedInstallments), req.params.id]
        );

      res.json({
        success: true,
        message:
          "Bukti pembayaran berhasil diupload dan menunggu verifikasi admin",
        data: {
          proof_image: proofImage,
           installment_number: installmentNumber,
        },
      });
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);



router.post("/:id/create-invoice", async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    const { installment_number, amount, due_date, notes, verified_by } =
      req.body;
    const issuerId = verified_by || req.user?.userId || null;
    const sanitizedAmount = sanitizeAmountValue(amount, null);
    const paymentId = req.params.id;

    const [payments] = await connection.query(
      `SELECT py.*, p.training_cost as program_training_cost, p.installment_plan as program_installment_plan,
              p.name AS program_name, r.registration_code, r.id AS registration_id,
              u.email AS participant_email, u.full_name AS participant_name
       FROM payments py
       LEFT JOIN registrations r ON py.registration_id = r.id
       LEFT JOIN programs p ON r.program_id = p.id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE py.id = ?`,
      [paymentId]
    );

    if (payments.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const currentPayment = payments[0];
    const totalInstallments = getTotalInstallments(currentPayment);

    let expectedInstallment = 1;
    if (currentPayment.status === "pending") {
      expectedInstallment = 1;
    } else if (currentPayment.status.startsWith("installment_")) {
      const currentNum = parseInt(currentPayment.status.split("_")[1]);
      expectedInstallment = currentNum + 1;
    }

    if (installment_number !== expectedInstallment) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Tidak dapat membuat invoice untuk cicilan ${installment_number}. Cicilan berikutnya yang diharapkan: ${expectedInstallment}.`,
      });
    }

    if (installment_number > totalInstallments) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Tidak dapat membuat cicilan ${installment_number}. Program ini maksimal ${totalInstallments} cicilan.`,
      });
    }

    if (installment_number > 1) {
      const previousStatus = `installment_${installment_number - 1}`;
      const [paidHistory] = await connection.query(
        `SELECT * FROM payment_history 
         WHERE payment_id = ? 
         AND new_status = ? 
         AND amount_changed > 0`,
        [paymentId, previousStatus]
      );

      if (paidHistory.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Tidak dapat membuat invoice cicilan ${installment_number}. Cicilan ${installment_number - 1} belum dibayar.`,
        });
      }
    }

    if (!sanitizedAmount || sanitizedAmount <= 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Amount harus lebih dari 0",
      });
    }

    if (!due_date) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Due date harus diisi",
      });
    }

    const dueDate = new Date(due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Due date harus di masa depan",
      });
    }

    let installmentAmounts = {};
    try {
      installmentAmounts = currentPayment.installment_amounts
        ? JSON.parse(currentPayment.installment_amounts)
        : {};
    } catch (e) {
      installmentAmounts = {};
    }

    const installmentKey = `installment_${installment_number}`;
    const existingEntry = installmentAmounts[installmentKey] || {};
    const nowIso = new Date().toISOString();

    installmentAmounts[installmentKey] = {
      ...existingEntry,
      amount: sanitizedAmount,
      due_date: due_date,
      created_at: existingEntry.created_at || nowIso,
      updated_at: nowIso,
      created_by: existingEntry.created_by || issuerId,
      notes: notes,
      status: "invoiced",
      invoice_number: currentPayment.invoice_number,
      invoice_issued_at: nowIso,
    };

    const newStatus = `installment_${installment_number}`;

    await connection.query(
      `UPDATE payments 
       SET status = ?,
           due_date = ?,
           next_due_date = ?,
           current_installment_number = ?,
           installment_amounts = ?,
           is_manual_invoice = TRUE,
           notes = CONCAT(COALESCE(notes, ''), ?),
           updated_at = NOW()
       WHERE id = ?`,
      [
        newStatus,
        due_date,
        due_date,
        installment_number,
        JSON.stringify(installmentAmounts),
         ` | Manual Invoice: Cicilan ${installment_number} - Amount: Rp ${sanitizedAmount} - Due: ${due_date}`,
        paymentId,
      ]
    );

    await connection.query(
      `INSERT INTO payment_history 
       (payment_id, old_status, new_status, notes, changed_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        paymentId,
        currentPayment.status,
        newStatus,
        `Manual invoice created: Cicilan ${installment_number} - Amount: Rp ${sanitizedAmount} - Due: ${due_date} - ${notes || ""
        }`,
       issuerId,
      ]
    );

    await connection.commit();

    // [SNAPSHOT INVOICE TRIGGER]
    try {
        const pdfData = { ...currentPayment, full_name: currentPayment.participant_name, program_name: currentPayment.program_name };
        const context = {
            installmentNumber: installment_number,
            amountValue: sanitizedAmount,
            dueDate: due_date,
            label: `Cicilan Ke-${installment_number}`,
            installmentEntry: { invoice_issued_at: new Date() } // Tanggal beku saat ini
        };
        // Simpan file sekarang juga
        await generateAndSaveDocument('invoice', pdfData, context);
        console.log(`Snapshot Invoice ${installment_number} tersimpan.`);
    } catch (e) { console.error("Gagal snapshot invoice", e); }
    // ----------------------------------

    let emailSent = false;
    if (currentPayment.participant_email) {
      try {
        const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
        const paymentUrl = `${appUrl}/dashboard/payments/${currentPayment.registration_id || ""}`;
        await sendEmail({
          to: currentPayment.participant_email,
          subject: `Tagihan Cicilan ${installment_number} Program ${currentPayment.program_name}`,
          html: createInvoiceEmailTemplate({
            fullName: currentPayment.participant_name,
            programName: currentPayment.program_name || "Program Fitalenta",
            invoiceNumber: currentPayment.invoice_number || paymentId,
            amount: formatCurrency(sanitizedAmount),
            dueDate: new Date(due_date).toLocaleDateString("id-ID"),
            paymentUrl,
          }),
        });
        emailSent = true;
      } catch (emailError) {
        console.error("Failed to send invoice email", emailError);
      }
    }


    res.json({
      success: true,
      message: `Tagihan cicilan ${installment_number} berhasil dibuat`,
      data: {
        status: newStatus,
        installment_number: installment_number,
        amount: amount,
        due_date: due_date,
        current_installment_number: installment_number,
      },
      meta: { emailSent },
    });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error creating manual invoice:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  } finally {
    connection.release();
  }
});

router.put("/:id/status", async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    const {
      status,
      amount_paid,
      notes,
      verified_by,
      is_manual = false,
      payment_method,
      bank_name,
      account_number,
      payment_date,
    } = req.body;
    const paymentId = req.params.id;

    const noteValue =
      typeof notes === "string" && notes.trim().length > 0 ? notes.trim() : null;


    const [currentPayments] = await connection.query(
      `SELECT py.*, p.training_cost as program_training_cost, p.installment_plan as program_installment_plan,
              p.name AS program_name, r.registration_code, r.id AS registration_id,
              u.email AS participant_email, u.full_name AS participant_name
       FROM payments py
       LEFT JOIN registrations r ON py.registration_id = r.id
       LEFT JOIN programs p ON r.program_id = p.id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE py.id = ?`,
      [paymentId]
    );

    if (currentPayments.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const currentPayment = currentPayments[0];
    const totalInstallments = getTotalInstallments(currentPayment);
    const totalAmount = sanitizeAmountValue(
      currentPayment.program_training_cost,
      0
    );
    const currentAmountPaid = sanitizeAmountValue(
      currentPayment.amount_paid || 0,
      0
    );
    const newPaymentAmount = sanitizeAmountValue(amount_paid || 0, 0);
    const newTotalPaid = currentAmountPaid + newPaymentAmount;

    const validation = await validateStatusProgression(
      currentPayment.status,
      status,
      currentPayment.current_installment_number,
      totalInstallments,
      paymentId,
      connection
    );

    if (!validation.isValid) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: validation.error,
        details: {
          currentStatus: currentPayment.status,
          requestedStatus: status,
          currentAmountPaid,
          newPaymentAmount,
          totalAmount,
        },
      });
    }

    if (newTotalPaid > totalAmount) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Jumlah pembayaran melebihi total tagihan. Total: ${totalAmount}, Sudah dibayar: ${currentAmountPaid}, Maksimal: ${totalAmount - currentAmountPaid
          }`,
      });
    }

    let finalStatus = status;
    let receipt_number = currentPayment.receipt_number;
    let due_date = currentPayment.due_date;
    let current_installment_number = currentPayment.current_installment_number;

    if (finalStatus === "pending") {
      current_installment_number = 0;
    } else if (finalStatus.startsWith("installment_")) {
      current_installment_number = parseInt(finalStatus.split("_")[1]);
    } else if (finalStatus === "paid") {
      current_installment_number = 0;
    }

    if (newTotalPaid >= totalAmount && finalStatus !== "cancelled") {
      finalStatus = "paid";
      current_installment_number = 0;

      if (!receipt_number) {
        receipt_number = await generateReceiptNumber();
      }
    }

    if (
      !receipt_number &&
      finalStatus !== "pending" &&
      finalStatus !== "cancelled" &&
      newPaymentAmount > 0
    ) {
      receipt_number = await generateReceiptNumber();
    }

    const reviewerId = verified_by || req.user?.userId || currentPayment.verified_by || null;

    let updateQuery = `UPDATE payments
       SET status = ?, amount_paid = ?, receipt_number = ?, notes = COALESCE(?, notes),
           verified_by = ?, verified_at = CASE WHEN ? IS NOT NULL THEN NOW() ELSE verified_at END,
           due_date = ?, current_installment_number = ?`;

    let updateParams = [
      finalStatus,
      newTotalPaid,
      receipt_number,
      noteValue,
      reviewerId,
      reviewerId,
      due_date,
      current_installment_number,
    ];

let updatedInstallmentsJson = null;

    if (receipt_number && newPaymentAmount > 0) {
      const existingInstallments = parseInstallmentAmounts(currentPayment);
      let effectiveInstallmentNumber = null;

      if (finalStatus && finalStatus.startsWith("installment_")) {
        effectiveInstallmentNumber = parseInt(finalStatus.split("_")[1]);
      } else if (finalStatus === "paid") {
        if (currentPayment.status?.startsWith("installment_")) {
          effectiveInstallmentNumber = parseInt(
            currentPayment.status.split("_")[1]
          );
        }

        if (!effectiveInstallmentNumber || isNaN(effectiveInstallmentNumber)) {
          effectiveInstallmentNumber =
            currentPayment.current_installment_number || totalInstallments;
        }
      }

      if (effectiveInstallmentNumber && !isNaN(effectiveInstallmentNumber)) {
        const updatedInstallments = ensureInstallmentEntry(
          existingInstallments,
          effectiveInstallmentNumber
        );

        const key = `installment_${effectiveInstallmentNumber}`;
        const nowIso = new Date().toISOString();
        const entry = updatedInstallments[key] || {};

        const existingAmount = sanitizeAmountValue(entry.amount, null);

        updatedInstallments[key] = {
          ...entry,
          amount:
            existingAmount !== null ? existingAmount : newPaymentAmount,
          paid_amount: newPaymentAmount,
          paid_at: nowIso,
          receipt_number: receipt_number,
          receipt_generated_at: nowIso,
          verified_by: reviewerId,
          verified_at: nowIso,
          status: "paid",
        };

        if (!updatedInstallments[key].due_date && due_date) {
          updatedInstallments[key].due_date = due_date;
        }

        if (updatedInstallments[key].proof_image) {
          updatedInstallments[key].proof_verified_at = nowIso;
        }

        updatedInstallmentsJson = JSON.stringify(updatedInstallments);
      }
    }

    if (is_manual) {
      updateQuery += `, payment_method = ?, bank_name = ?, account_number = ?, payment_date = ?`;
      updateParams.push(
        payment_method || "transfer",
        bank_name,
        account_number,
        payment_date || new Date()
      );
    }

    if (updatedInstallmentsJson) {
      updateQuery += `, installment_amounts = ?`;
      updateParams.push(updatedInstallmentsJson);
    }

    updateQuery += ` WHERE id = ?`;
    updateParams.push(paymentId);

    await connection.query(updateQuery, updateParams);

    const historyNotes =
      noteValue ||
      (is_manual
        ? `Manual payment: Rp ${newPaymentAmount} - Status: ${finalStatus}`
        : `Status berubah dari ${currentPayment.status} ke ${finalStatus} - Pembayaran: Rp ${newPaymentAmount}`);

    await connection.query(
      `INSERT INTO payment_history 
       (payment_id, old_status, new_status, old_amount_paid, new_amount_paid, amount_changed, notes, changed_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        paymentId,
        currentPayment.status,
        finalStatus,
        currentAmountPaid,
        newTotalPaid,
        newPaymentAmount,
        historyNotes,
        reviewerId,
      ]
    );

    await connection.commit();

    // [SNAPSHOT RECEIPT TRIGGER]
    if (newPaymentAmount > 0 && receipt_number) {
        try {
            // Logika penentuan cicilan ke berapa yg baru dibayar
            let targetInstallment = current_installment_number;
            if ((finalStatus === 'paid' || finalStatus === 'paid_off') && !targetInstallment) {
                 if (currentPayment.status.startsWith('installment_')) {
                     targetInstallment = parseInt(currentPayment.status.split('_')[1]);
                 } else {
                     targetInstallment = totalInstallments;
                 }
            }
            if(!targetInstallment) targetInstallment = 1;

            const context = {
                installmentNumber: targetInstallment,
                amountValue: newPaymentAmount,
                receiptNumber: receipt_number,
                label: finalStatus === 'paid' ? 'Pelunasan' : `Cicilan Ke-${targetInstallment}`,
                installmentEntry: { paid_at: new Date() } // Tanggal beku saat ini
            };
            
            // Simpan file sekarang juga
            await generateAndSaveDocument('receipt', { ...currentPayment, id: paymentId }, context);
             console.log(`Snapshot Receipt ${targetInstallment} tersimpan.`);
        } catch (e) { console.error("Gagal snapshot kwitansi", e); }
    }
    // -----------------------------------

    let emailSent = false;
    const notifiableStatuses = [
      "installment_1",
      "installment_2",
      "installment_3",
      "installment_4",
      "installment_5",
      "installment_6",
      "paid",
    ];

    if (
      currentPayment.participant_email &&
      (notifiableStatuses.includes(finalStatus) || finalStatus === "pending")
    ) {
      try {
        const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
        const paymentUrl = `${appUrl}/dashboard/payments/${currentPayment.registration_id || ""}`;
        await sendEmail({
          to: currentPayment.participant_email,
          subject: `Status Pembayaran Program ${currentPayment.program_name}`,
          html: createPaymentStatusEmailTemplate({
            fullName: currentPayment.participant_name,
            programName: currentPayment.program_name || "Program Fitalenta",
            statusText: getStatusText(finalStatus),
            amount: formatCurrency(newTotalPaid),
            invoiceNumber: currentPayment.invoice_number || paymentId,
            notes: noteValue || "",
            paymentUrl,
          }),
        });
        emailSent = true;
      } catch (emailError) {
        console.error("Failed to send payment status email", emailError);
      }
    }


    res.json({
      success: true,
      message:
        "Status pembayaran berhasil diperbarui" +
        (is_manual ? " (Manual Payment)" : ""),
      data: {
        receipt_number,
        amount_paid: newTotalPaid,
        status: finalStatus,
        due_date: due_date,
        current_installment_number: current_installment_number,
        is_manual: is_manual,
        verified_by: reviewerId,
      },
      meta: { emailSent },
    });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error updating payment status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  } finally {
    connection.release();
  }
});

router.post("/manual", async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    const {
      registration_id,
      amount_paid = 0,
      payment_method = "transfer",
      bank_name,
      account_number,
      payment_date,
      due_date,
      notes,
      verified_by,
      status = "pending",
      is_manual = true,
    } = req.body;

    if (!registration_id) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Registration ID is required",
      });
    }

    const [registrations] = await connection.query(
      `
      SELECT r.*, p.training_cost, p.installment_plan 
      FROM registrations r
      LEFT JOIN programs p ON r.program_id = p.id
      WHERE r.id = ?
      `,
      [registration_id]
    );

    if (registrations.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    const registration = registrations[0];
    const totalAmount = parseFloat(registration.training_cost);
    const paymentAmount = parseFloat(amount_paid);

    if (paymentAmount <= 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Amount paid must be greater than 0",
      });
    }

    const [existingPayments] = await connection.query(
      "SELECT * FROM payments WHERE registration_id = ? AND status != 'cancelled'",
      [registration_id]
    );

    if (existingPayments.length > 0) {
      const existingPayment = existingPayments[0];
      const currentAmountPaid = parseFloat(existingPayment.amount_paid || 0);
      const newTotalPaid = currentAmountPaid + paymentAmount;

      if (newTotalPaid > totalAmount) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Jumlah pembayaran melebihi total tagihan. Total: ${totalAmount}, Sudah dibayar: ${currentAmountPaid}, Maksimal: ${totalAmount - currentAmountPaid
            }`,
        });
      }

      let newStatus = status;
      if (newTotalPaid >= totalAmount) {
        newStatus = "paid";
      } else if (status === "pending" && currentAmountPaid === 0) {
        newStatus = "installment_1";
      }

      const [result] = await connection.query(
        `UPDATE payments 
         SET amount_paid = ?, status = ?, receipt_number = COALESCE(receipt_number, ?), 
             payment_method = ?, bank_name = ?, account_number = ?,
             payment_date = ?, due_date = ?, notes = COALESCE(?, notes),
             verified_by = ?, verified_at = NOW(), amount = ?
         WHERE id = ?`,
        [
          newTotalPaid,
          newStatus,
          newStatus === "paid" ? await generateReceiptNumber() : null,
          payment_method,
          bank_name,
          account_number,
          payment_date,
          due_date,
          notes,
          verified_by,
          totalAmount,
          existingPayment.id,
        ]
      );

      await connection.query(
        `INSERT INTO payment_history 
         (payment_id, old_status, new_status, old_amount_paid, new_amount_paid, amount_changed, notes, changed_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          existingPayment.id,
          existingPayment.status,
          newStatus,
          currentAmountPaid,
          newTotalPaid,
          paymentAmount,
          notes || `Manual payment added`,
          verified_by,
        ]
      );

      await connection.commit();

      res.json({
        success: true,
        message:
          "Pembayaran manual berhasil ditambahkan ke invoice yang sudah ada",
        data: {
          payment_id: existingPayment.id,
          invoice_number: existingPayment.invoice_number,
          receipt_number: existingPayment.receipt_number,
          status: newStatus,
          amount_paid: newTotalPaid,
        },
      });
    } else {
      const invoice_number = await generateInvoiceNumber();

      let paymentStatus = status;
      if (paymentAmount >= totalAmount) {
        paymentStatus = "paid";
      } else if (paymentAmount > 0) {
        paymentStatus = "installment_1";
      }

      let receipt_number = null;
      if (paymentStatus === "paid") {
        receipt_number = await generateReceiptNumber();
      }

      const [result] = await connection.query(
        `INSERT INTO payments 
         (registration_id, invoice_number, amount, amount_paid, payment_method, bank_name, account_number, 
          status, payment_date, due_date, receipt_number, notes, verified_by, verified_at, current_installment_number) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          registration_id,
          invoice_number,
          totalAmount,
          paymentAmount,
          payment_method,
          bank_name,
          account_number,
          paymentStatus,
          payment_date,
          due_date,
          receipt_number,
          notes,
          verified_by,
          paymentAmount > 0 ? new Date() : null,
          paymentStatus === "installment_1" ? 1 : 0,
        ]
      );

      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Invoice pembayaran berhasil dibuat",
        data: {
          payment_id: result.insertId,
          invoice_number,
          receipt_number,
          status: paymentStatus,
          amount_paid: paymentAmount,
        },
      });
    }
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error creating manual payment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  } finally {
    connection.release();
  }
});

// GET /api/payments/:id/download/:type/:installment
router.get("/:id/download/:type/:installment", async (req, res) => {
  const { id, type, installment } = req.params; // type: 'invoice' | 'receipt'
  
  try {
    // 1. Ambil data payment dasar
    const [payments] = await db.promise().query(
      `SELECT py.*, u.full_name, p.name as program_name, p.training_cost
       FROM payments py
       LEFT JOIN registrations r ON py.registration_id = r.id
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN programs p ON r.program_id = p.id
       WHERE py.id = ?`, 
      [id]
    );

    if (payments.length === 0) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }
    const payment = payments[0];
    const installmentNumber = parseInt(installment);

    // 2. Re-construct Context untuk file yang diminta
    // Kita memaksa parameter berdasarkan URL, bukan status database saat ini
    const installmentData = parseInstallmentAmounts(payment);
    const specificData = installmentData[`installment_${installmentNumber}`] || {};
    
    // Fallback amount: Coba ambil dari JSON, jika tidak ada, ambil dari history, atau hitung rata-rata
    let amountValue = sanitizeAmountValue(specificData.amount, 0);
    if(amountValue === 0) {
        amountValue = await getLastPaymentChange(payment, `installment_${installmentNumber}`);
    }

    const context = {
      installmentNumber: installmentNumber,
      amountValue: amountValue > 0 ? amountValue : (payment.training_cost / getTotalInstallments(payment)),
      dueDate: specificData.due_date || payment.due_date,
      receiptNumber: specificData.receipt_number || payment.receipt_number,
      label: `Cicilan Ke-${installmentNumber}`
    };

    // 3. Panggil Generator (Get or Create)
    const filePath = await generateAndSaveDocument(type, payment, context);

    // 4. Download
    res.download(filePath, path.basename(filePath));

  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).send("Terjadi kesalahan saat mengunduh file.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [payments] = await db.promise().query(
      `
      SELECT 
        py.*,
        r.registration_code,
        u.full_name,
        u.email,
        u.phone,
        u.address,
        p.name as program_name,
        p.training_cost as program_training_cost,
        p.departure_cost as program_departure_cost,
        p.duration as program_duration,
        p.installment_plan as program_installment_plan,
        verifier.full_name as verified_by_name
      FROM payments py
      LEFT JOIN registrations r ON py.registration_id = r.id
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN programs p ON r.program_id = p.id
      LEFT JOIN users verifier ON py.verified_by = verifier.id
      WHERE py.id = ?
    `,
      [req.params.id]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const [history] = await db.promise().query(
      `
      SELECT 
        ph.*, 
        u.full_name as changed_by_name,
        CASE 
          WHEN ph.old_amount_paid IS NOT NULL AND ph.new_amount_paid IS NOT NULL 
          THEN ph.new_amount_paid - ph.old_amount_paid 
          ELSE NULL 
        END as amount_paid_change
      FROM payment_history ph
      LEFT JOIN users u ON ph.changed_by = u.id
      WHERE ph.payment_id = ?
      ORDER BY ph.changed_at ASC
    `,
      [req.params.id]
    );

    const payment = payments[0];

    const totalInstallments = getTotalInstallments(payment);

    if (
      parseFloat(payment.amount) !== parseFloat(payment.program_training_cost)
    ) {
      await db
        .promise()
        .query("UPDATE payments SET amount = ? WHERE id = ?", [
          payment.program_training_cost,
          payment.id,
        ]);
      payment.amount = payment.program_training_cost;
    }

    res.json({
      success: true,
      data: {
        ...payment,
        history,
        total_installments: totalInstallments,
        remaining_installments:
          totalInstallments - (payment.current_installment_number || 0),
      },
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/:id/invoice", async (req, res) => {
  try {
    // 1. Ambil Data Payment (Sama seperti sebelumnya)
    const [payments] = await db.promise().query(
      `SELECT py.*, r.registration_code, u.full_name, u.email, u.phone, u.address, 
              p.name as program_name, p.training_cost as program_training_cost, 
              p.installment_plan as program_installment_plan
       FROM payments py
       LEFT JOIN registrations r ON py.registration_id = r.id
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN programs p ON r.program_id = p.id
       WHERE py.id = ?`,
      [req.params.id]
    );

    if (payments.length === 0) return res.status(404).send("Payment not found");
    const payment = payments[0];

    // 2. Tentukan Konteks (Cicilan ke berapa?)
    // Logic ini tetap diperlukan untuk menangani query params ?installment=2
    const { installment } = req.query;
    let targetInstallment = installment ? parseInt(installment) : payment.current_installment_number;
    
    // Fallback jika tidak ada query param, ambil logic default
    if (!targetInstallment) targetInstallment = 1;

    // Siapkan Context untuk Snapshot Engine
    // (Anda mungkin perlu menyesuaikan logic resolveCurrentPaymentContext agar sesuai kebutuhan)
    const context = {
        installmentNumber: targetInstallment,
        // Jika perlu passing due date spesifik atau amount spesifik, lakukan di sini
        label: `Cicilan Ke-${targetInstallment}`
    };

    // 3. PANGGIL FUNGSI SNAPSHOT (Inti Perubahan)
    // Fungsi ini akan cek: File ada? Kirim path-nya. Belum ada? Buat, simpan, lalu kirim path-nya.
    const filePath = await generateAndSaveDocument('invoice', payment, context);

    // 4. Kirim File ke User
    res.download(filePath, `Invoice-${payment.invoice_number}-Cicilan-${targetInstallment}.pdf`);

  } catch (error) {
    console.error("Error serving invoice:", error);
    res.status(500).send("Gagal mengambil invoice.");
  }
});

router.get("/:id/receipt", async (req, res) => {
  try {
    // 1. Ambil Data Payment dari Database
    const [payments] = await db.promise().query(
      `SELECT py.*, r.registration_code, u.full_name, u.email, u.phone, u.address, 
              p.name as program_name, p.training_cost as program_training_cost, 
              p.installment_plan as program_installment_plan
       FROM payments py
       LEFT JOIN registrations r ON py.registration_id = r.id
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN programs p ON r.program_id = p.id
       WHERE py.id = ?`,
      [req.params.id]
    );

    if (payments.length === 0) {
      return res.status(404).send("Data pembayaran tidak ditemukan.");
    }

    const payment = payments[0];
    const { installment } = req.query;

    // 2. Tentukan Cicilan Mana yang Diminta (Installment Context)
    // Logika ini penting agar snapshot tahu kwitansi mana yang harus diambil/dibuat
    let targetInstallment = null;

    if (installment) {
      // Jika user spesifik minta ?installment=1
      targetInstallment = parseInt(installment);
    } else {
      // Jika tidak ada request spesifik, coba tebak dari status terakhir
      if (payment.status.startsWith("installment_")) {
        targetInstallment = parseInt(payment.status.split("_")[1]);
      } else if (payment.status === "paid" || payment.status === "lunas") {
        // Jika lunas, biasanya user ingin kwitansi terakhir atau pelunasan
        // Kita bisa default ke installment terakhir yang tercatat, atau 0 (pelunasan)
        targetInstallment = payment.current_installment_number || 1; 
      } else {
        targetInstallment = 1; // Default fallback
      }
    }

    // 3. Validasi Ketersediaan Kwitansi
    // Kwitansi seharusnya tidak boleh dicetak jika belum ada nomor kwitansinya (belum bayar)
    if (!payment.receipt_number) {
        return res.status(400).send("Kwitansi belum tersedia (Belum ada pembayaran terverifikasi).");
    }

    // 4. Siapkan Context untuk Snapshot Engine
    // Engine akan menggunakan data ini untuk mengisi variabel dalam PDF jika file belum ada
    const context = {
        installmentNumber: targetInstallment,
        receiptNumber: payment.receipt_number, // Menggunakan nomor kwitansi master (atau logic khusus jika ada per termin)
        label: (payment.status === 'paid' && !installment) ? "Pelunasan" : `Cicilan Ke-${targetInstallment}`,
        // Kita tidak perlu pass 'amount' disini jika generateAndSaveDocument
        // sudah pintar mengambil data dari JSON installment_amounts. 
        // Namun jika perlu memaksa, bisa tambahkan: amountValue: ...
    };

    // 5. EKSEKUSI SNAPSHOT (Inti Perubahan)
    // Fungsi ini akan cek: Apakah file di storage/receipts/.. sudah ada?
    // JIKA ADA: Return path file tersebut.
    // JIKA TIDAK: Generate PDF baru, simpan ke storage, lalu return path-nya.
    const filePath = await generateAndSaveDocument('receipt', payment, context);

    // 6. Download File ke Browser User
    const filename = `Kwitansi-${payment.receipt_number}-Cicilan-${targetInstallment}.pdf`;
    
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error("Error sending receipt file:", err);
            if (!res.headersSent) {
                res.status(500).send("Gagal mengunduh file kwitansi.");
            }
        }
    });

  } catch (error) {
    console.error("Error serving receipt:", error);
    res.status(500).send("Terjadi kesalahan saat memproses kwitansi.");
  }
});

router.get("/registrations/active", async (req, res) => {
  try {
    const [registrations] = await db.promise().query(`
      SELECT 
        r.*,
        u.full_name,
        u.email,
        p.name as program_name,
        p.training_cost,
        p.installment_plan,
        COALESCE(py.amount_paid, 0) as amount_paid,
        py.status as payment_status,
        py.invoice_number
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN programs p ON r.program_id = p.id
      LEFT JOIN payments py ON r.id = py.registration_id AND py.status != 'cancelled'
      WHERE r.id NOT IN (
        SELECT registration_id 
        FROM payments 
        WHERE status = 'cancelled'
      )
      ORDER BY r.registration_date DESC
    `);

    res.json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error("Error fetching active registrations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;