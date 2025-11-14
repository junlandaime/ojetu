import nodemailer from "nodemailer";

let cachedTransporter = null;

const resolveBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (["1", "true", "yes"].includes(value.toLowerCase())) return true;
    if (["0", "false", "no"].includes(value.toLowerCase())) return false;
  }
  return fallback;
};

const buildTransporter = async () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  if (!process.env.SMTP_HOST) {
    throw new Error(
      "SMTP_HOST is not configured. Please define SMTP_* environment variables before sending email."
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: resolveBoolean(process.env.SMTP_SECURE, false),
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    tls:
      resolveBoolean(process.env.SMTP_IGNORE_TLS, false)
        ? { rejectUnauthorized: false }
        : undefined,
  });

  await transporter.verify();
  cachedTransporter = transporter;
  return cachedTransporter;
};

export const sendEmail = async ({ to, subject, html, text, attachments }) => {
  const transporter = await buildTransporter();

  const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER;
  if (!fromAddress) {
    throw new Error(
      "MAIL_FROM or SMTP_USER must be configured to send transactional emails"
    );
  }

  return transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    html,
    text,
    attachments,
  });
};

export const createVerificationEmailTemplate = ({ fullName, verifyUrl }) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a;">
    <h2 style="color:#0f172a;">Halo ${fullName || "Peserta"},</h2>
    <p>Terima kasih telah mendaftar pada platform Pelatihan dan Penyaluran Tenaga Kerja Tokutei Genou.</p>
    <p>Untuk mengaktifkan akun Anda, silakan klik tombol berikut ini dalam 24 jam:</p>
    <p style="margin: 24px 0;">
      <a href="${verifyUrl}" style="background:#2563eb;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Verifikasi Akun</a>
    </p>
    <p>Jika tombol di atas tidak berfungsi, salin dan tempel tautan ini pada peramban Anda:</p>
    <p style="word-break: break-all; color: #1d4ed8;">${verifyUrl}</p>
    <p>Apabila Anda tidak merasa melakukan pendaftaran, abaikan email ini.</p>
    <p>Salam hangat,<br/>Tim Fitalenta</p>
  </div>
`;

export const createPasswordResetEmailTemplate = ({ fullName, resetUrl }) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a;">
    <h2 style="color:#0f172a;">Permintaan Reset Kata Sandi</h2>
    <p>Halo ${fullName || "Peserta"},</p>
    <p>Kami menerima permintaan untuk mereset kata sandi akun Anda. Klik tombol di bawah ini untuk melanjutkan. Tautan akan kedaluwarsa dalam 30 menit.</p>
    <p style="margin: 24px 0;">
      <a href="${resetUrl}" style="background:#2563eb;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Reset Kata Sandi</a>
    </p>
    <p>Jika Anda tidak merasa meminta reset, abaikan email ini. Akun Anda tetap aman.</p>
    <p>Terima kasih,<br/>Tim Fitalenta</p>
  </div>
`;

export const createInvoiceEmailTemplate = ({
  fullName,
  programName,
  invoiceNumber,
  amount,
  dueDate,
  paymentUrl,
}) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a;">
    <h2 style="color:#0f172a;">Tagihan Pembayaran Program ${programName}</h2>
    <p>Halo ${fullName || "Peserta"},</p>
    <p>Tagihan baru dengan nomor <strong>${invoiceNumber}</strong> telah diterbitkan.</p>
    <ul style="line-height: 1.6;">
      <li>Jumlah Tagihan: <strong>${amount}</strong></li>
      <li>Jatuh Tempo: <strong>${dueDate}</strong></li>
    </ul>
    <p>Silakan selesaikan pembayaran sebelum tanggal jatuh tempo. Unggah bukti pembayaran melalui dashboard peserta.</p>
    ${
      paymentUrl
        ? `<p style="margin: 24px 0;"><a href="${paymentUrl}" style="background:#16a34a;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Lihat Tagihan</a></p>`
        : ""
    }
    <p>Apabila Anda sudah membayar, abaikan email ini.</p>
    <p>Terima kasih,<br/>Tim Fitalenta</p>
  </div>
`;

export const createPaymentStatusEmailTemplate = ({
  fullName,
  programName,
  statusText,
  amount,
  invoiceNumber,
  notes,
  paymentUrl,
}) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a;">
    <h2 style="color:#0f172a;">Status Pembayaran Program ${programName}</h2>
    <p>Halo ${fullName || "Peserta"},</p>
    <p>Status pembayaran Anda saat ini: <strong>${statusText}</strong>.</p>
    <ul style="line-height: 1.6;">
      ${invoiceNumber ? `<li>Nomor Tagihan: <strong>${invoiceNumber}</strong></li>` : ""}
      ${amount ? `<li>Total Pembayaran Terverifikasi: <strong>${amount}</strong></li>` : ""}
    </ul>
    ${
      notes
        ? `<p style="background:#eff6ff;padding:12px;border-radius:8px;">Catatan dari admin:<br/>${notes}</p>`
        : ""
    }
    ${
      paymentUrl
        ? `<p style="margin: 24px 0;"><a href="${paymentUrl}" style="background:#2563eb;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Buka Dashboard Pembayaran</a></p>`
        : ""
    }
    <p>Silakan hubungi admin jika membutuhkan bantuan.</p>
    <p>Terima kasih,<br/>Tim Fitalenta</p>
  </div>
`;