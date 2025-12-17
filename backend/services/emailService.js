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

const getEnvValue = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
  }
  return undefined;
};

const resolvePort = () => {
  const rawPort = process.env.SMTP_PORT;
  if (rawPort !== undefined) {
    const parsed = Number(rawPort);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return undefined;
};

const resolveSecureOption = (port) => {
  if (process.env.SMTP_SECURE !== undefined) {
    return resolveBoolean(process.env.SMTP_SECURE, false);
  }

  const encryption = process.env.SMTP_ENCRYPTION;
  if (typeof encryption === "string") {
    const normalized = encryption.trim().toLowerCase();
    if (normalized === "ssl") {
      return true;
    }
    if (normalized === "tls") {
      // STARTTLS connections should not use the `secure` flag
      return false;
    }
  }

  if (port === 465) {
    // Implicit TLS (SMTPS) uses port 465 and requires secure=true
    return true;
  }

  return false;
};

const resolveRequireTls = () => {
  const encryption = process.env.SMTP_ENCRYPTION;
  if (typeof encryption === "string") {
    return encryption.trim().toLowerCase() === "tls";
  }
  return undefined;
};

const shouldAllowInvalidCertificates = () => {
  if (process.env.SMTP_IGNORE_TLS !== undefined) {
    return resolveBoolean(process.env.SMTP_IGNORE_TLS, false);
  }

  if (process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== undefined) {
    // Historical configuration used the inverse naming convention
    return !resolveBoolean(process.env.SMTP_TLS_REJECT_UNAUTHORIZED, true);
  }

  return false;
};


const buildTransporter = async () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const smtpHost = getEnvValue("SMTP_HOST");
  if (!smtpHost) {
    throw new Error(
      "SMTP_HOST is not configured. Please define SMTP_* environment variables before sending email."
    );
  }

const smtpUser = getEnvValue("SMTP_USER", "SMTP_USERNAME");
  const smtpPass = getEnvValue("SMTP_PASS", "SMTP_PASSWORD");
  const auth = smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined;
  const allowInvalidCertificates = shouldAllowInvalidCertificates();

  const configuredPort = resolvePort();
  const secure = resolveSecureOption(configuredPort);
  const port = configuredPort ?? (secure ? 465 : 587);
  const service = getEnvValue("SMTP_SERVICE");

  if (secure === false && port === 465 && process.env.SMTP_SECURE !== undefined) {
    throw new Error(
      "SMTP_PORT is set to 465 but SMTP_SECURE is false. Port 465 requires an implicit TLS (secure) connection. " +
        "Either set SMTP_SECURE=true or change the port to 587 for STARTTLS."
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port,
    secure,
    requireTLS: resolveRequireTls(),
    auth,
    tls: allowInvalidCertificates ? { rejectUnauthorized: false } : undefined,
    ...(service ? { service } : {}),
  });

  try {
    await transporter.verify();
  } catch (error) {
    cachedTransporter = null;
    const message =
      "Failed to verify SMTP configuration: " +
      (error instanceof Error ? error.message : String(error)) +
      ". Please confirm SMTP_HOST, SMTP_PORT, SMTP_SECURE, and credential values.";
    const wrappedError = new Error(message);
    if (error instanceof Error) {
      wrappedError.cause = error;
    }
    throw wrappedError;
  }
  cachedTransporter = transporter;
  return cachedTransporter;
};

export const sendEmail = async ({ to, subject, html, text, attachments }) => {
  const transporter = await buildTransporter();

  const fromAddress =
    getEnvValue("MAIL_FROM", "SMTP_FROM", "SMTP_FROM_ADDRESS") ||
    getEnvValue("SMTP_USER", "SMTP_USERNAME");
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
    <p>Terima kasih telah mendaftar pada platform Pelatihan dan Penyaluran Tenaga Kerja Fitalenta.</p>
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