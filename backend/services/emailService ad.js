import nodemailer from "nodemailer";

let cachedTransporter = null;

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();

  if (["1", "true", "yes", "y"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "n"].includes(normalized)) {
    return false;
  }

  return defaultValue;
};

const buildTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secureEnv = process.env.SMTP_SECURE;
  let secure =
    secureEnv !== undefined && secureEnv !== null
      ? parseBoolean(secureEnv)
      : port === 465;

  if (port === 465 && !secure) {
    if (process.env.SMTP_SECURE) {
      // If the deployer explicitly disabled TLS on port 465 we surface a clearer error
      throw new Error(
        "Port 465 requires TLS. Set SMTP_SECURE=true or switch to port 587 with SMTP_SECURE=false."
      );
    }

    secure = true;
  }

  if (!host) {
    throw new Error(
      "SMTP_HOST is not configured. Please define SMTP_* environment variables before sending email."
    );
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error(
      "SMTP_USER/SMTP_PASSWORD are not configured. Please define SMTP_* environment variables before sending email."
    );
  }

  const rejectUnauthorized = parseBoolean(
    process.env.SMTP_TLS_REJECT_UNAUTHORIZED,
    true
  );

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized,
    },
    connectionTimeout: parseInt(
      process.env.SMTP_CONNECTION_TIMEOUT || "10000",
      10
    ),
    greetingTimeout: parseInt(process.env.SMTP_GREETING_TIMEOUT || "10000", 10),
    socketTimeout: parseInt(process.env.SMTP_SOCKET_TIMEOUT || "20000", 10),
  });

  cachedTransporter = transporter;
  return transporter;
};

const defaultFrom = () => {
  if (process.env.SMTP_FROM && process.env.SMTP_FROM.trim().length > 0) {
    return process.env.SMTP_FROM.trim();
  }

  if (process.env.SMTP_USER && process.env.SMTP_USER.trim().length > 0) {
    return process.env.SMTP_USER.trim();
  }

  throw new Error(
    "SMTP_FROM is not configured. Please define SMTP_FROM or reuse SMTP_USER as the sender address."
  );
};

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) {
    throw new Error("Recipient email address is required");
  }

  if (!subject) {
    throw new Error("Email subject is required");
  }

  const transporter = buildTransporter();

  await transporter.sendMail({
    from: defaultFrom(),
    to,
    subject,
    html,
    text,
  });
};

const createHtmlLayout = ({ title, intro, content, footer }) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f9fc; padding: 24px; color: #1f2933;">
    <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);">
      <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 24px; color: #ffffff;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 600;">${title}</h1>
        <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.85;">${intro}</p>
      </div>
      <div style="padding: 24px; font-size: 15px; line-height: 1.6;">
        ${content}
      </div>
      <div style="background: #f1f5f9; padding: 18px 24px; font-size: 12px; color: #475569;">
        ${footer || "&copy; " + new Date().getFullYear() + " Fitalenta. Semua hak dilindungi."}
      </div>
    </div>
  </div>
`;

export const createVerificationEmailTemplate = ({ fullName, verifyUrl }) =>
  createHtmlLayout({
    title: "Verifikasi Email Anda",
    intro: "Terima kasih telah mendaftar di Program Fitalenta.",
    content: `
      <p>Halo ${fullName || "Peserta"},</p>
      <p>Kami menerima permintaan pembuatan akun dengan alamat email ini. Klik tombol di bawah untuk memverifikasi email Anda dan mengaktifkan akun:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${verifyUrl}" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 9999px; font-weight: 600; display: inline-block;">Verifikasi Sekarang</a>
      </div>
      <p>Jika tombol tidak berfungsi, salin tautan berikut dan tempelkan di peramban Anda:</p>
      <p style="background: #f1f5f9; padding: 12px; border-radius: 8px; word-break: break-all;">${verifyUrl}</p>
      <p>Tautan ini berlaku selama ${
        process.env.VERIFICATION_TOKEN_EXPIRY_HOURS || 24
      } jam.</p>
    `,
  });

export const createPasswordResetEmailTemplate = ({ fullName, resetUrl }) =>
  createHtmlLayout({
    title: "Permintaan Atur Ulang Password",
    intro: "Kami menerima permintaan untuk mengatur ulang password akun Anda.",
    content: `
      <p>Halo ${fullName || "Peserta"},</p>
      <p>Klik tombol di bawah untuk membuat password baru:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="background: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 9999px; font-weight: 600; display: inline-block;">Atur Ulang Password</a>
      </div>
      <p>Jika Anda tidak meminta pengaturan ulang password, abaikan email ini.</p>
      <p style="font-size: 13px; color: #64748b;">Tautan ini akan kedaluwarsa dalam ${
        process.env.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES || 30
      } menit.</p>
    `,
  });

export const createInvoiceEmailTemplate = ({
  fullName,
  programName,
  invoiceNumber,
  amount,
  dueDate,
  paymentUrl,
}) =>
  createHtmlLayout({
    title: "Tagihan Cicilan Program",
    intro: programName || "Program Fitalenta",
    content: `
      <p>Halo ${fullName || "Peserta"},</p>
      <p>Tagihan cicilan untuk program <strong>${
        programName || "Fitalenta"
      }</strong> telah diterbitkan dengan detail berikut:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tbody>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Nomor Invoice</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right;">${
              invoiceNumber || "-"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Jumlah Tagihan</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right;">${
              amount || "-"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Jatuh Tempo</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right;">${
              dueDate || "-"
            }</td>
          </tr>
        </tbody>
      </table>
      <p>Silakan menyelesaikan pembayaran sebelum tanggal jatuh tempo. Anda dapat melihat detail pembayaran pada tautan berikut:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${paymentUrl}" style="background: #f97316; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 9999px; font-weight: 600; display: inline-block;">Lihat Detail Pembayaran</a>
      </div>
    `,
  });

export const createPaymentStatusEmailTemplate = ({
  fullName,
  programName,
  statusText,
  amount,
  invoiceNumber,
  notes,
  paymentUrl,
}) =>
  createHtmlLayout({
    title: "Pembaruan Status Pembayaran",
    intro: programName || "Program Fitalenta",
    content: `
      <p>Halo ${fullName || "Peserta"},</p>
      <p>Status pembayaran untuk invoice <strong>${
        invoiceNumber || "-"
      }</strong> telah diperbarui menjadi <strong>${statusText || "-"}</strong>.</p>
      <p>Total pembayaran yang telah kami terima saat ini adalah <strong>${
        amount || "-"
      }</strong>.</p>
      ${
        notes
          ? `<p style="background: #f8fafc; padding: 12px 16px; border-left: 4px solid #2563eb; border-radius: 8px; color: #475569;">Catatan: ${notes}</p>`
          : ""
      }
      <p>Anda dapat meninjau riwayat pembayaran lengkap melalui tautan berikut:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${paymentUrl}" style="background: #0ea5e9; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 9999px; font-weight: 600; display: inline-block;">Lihat Pembayaran</a>
      </div>
    `,
  });

export default {
  sendEmail,
  createVerificationEmailTemplate,
  createPasswordResetEmailTemplate,
  createInvoiceEmailTemplate,
  createPaymentStatusEmailTemplate,
};