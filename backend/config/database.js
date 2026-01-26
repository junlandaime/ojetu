import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Create connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "intern_registration",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "+07:00", // WIB
});

// Get promise-based interface
const promisePool = db.promise();

// --- HELPER FUNCTIONS ---

// Helper: Ubah Bulan Angka (0-11) ke Angka Romawi
const getRomanMonth = () => {
  const months = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const currentMonthIndex = new Date().getMonth(); 
  return months[currentMonthIndex];
};

export const generateRegistrationCode = async () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `REG-${timestamp}-${random}`;
};

/**
 * Generate Invoice Number
 * Format: 131-TG/INV/FITALENTA/<<ROMAN>>/<<YEAR>>
 * Logic: Cari nomor urut terbesar dari database, increment +1.
 */
export const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const romanMonth = getRomanMonth();
  const defaultStart = 31; // Mulai dari 131 jika belum ada data

  try {
    // QUERY PENTING:
    // Kita mengambil data payments, memfilter yang formatnya sesuai invoice baru,
    // lalu mengurutkan berdasarkan ANGKA di depan (substring sebelum '-TG') secara descending.
    const query = `
      SELECT invoice_number 
      FROM payments 
      WHERE invoice_number LIKE '%-TG/INV/FITALENTA/%' 
      ORDER BY CAST(SUBSTRING_INDEX(invoice_number, '-TG', 1) AS UNSIGNED) DESC 
      LIMIT 1
    `;
    
    const [rows] = await promisePool.query(query);

    let nextSequence = defaultStart;

    if (rows.length > 0 && rows[0].invoice_number) {
      const lastInvoice = rows[0].invoice_number;
      // Ambil angka depan: "131-TG/..." -> "131"
      const lastSeqStr = lastInvoice.split('-TG')[0];
      const lastSeq = parseInt(lastSeqStr);

      if (!isNaN(lastSeq)) {
        nextSequence = lastSeq + 1;
      }
    }

    // Format Akhir
    return `${nextSequence}-TG/INV/FITALENTA/${romanMonth}/${year}`;

  } catch (error) {
    console.error("Error generating invoice number:", error);
    // Fallback darurat jika DB error
    return `${defaultStart}-TG/INV/FITALENTA/${romanMonth}/${year}`;
  }
};

/**
 * Generate Receipt Number
 * Format: 121/TRX/FITALENTA/<<ROMAN>>/<<YEAR>>
 * Logic: Cari nomor urut terbesar dari database, increment +1.
 */
export const generateReceiptNumber = async () => {
  const year = new Date().getFullYear();
  const romanMonth = getRomanMonth();
  const defaultStart = 21; // Mulai dari 121 jika belum ada data

  try {
    // QUERY PENTING:
    // Memfilter yang formatnya sesuai receipt baru,
    // lalu mengurutkan berdasarkan ANGKA di depan (substring sebelum '/TRX') secara descending.
    const query = `
      SELECT receipt_number 
      FROM payments 
      WHERE receipt_number LIKE '%/TRX/FITALENTA/%' 
      ORDER BY CAST(SUBSTRING_INDEX(receipt_number, '/TRX', 1) AS UNSIGNED) DESC 
      LIMIT 1
    `;

    const [rows] = await promisePool.query(query);

    let nextSequence = defaultStart;

    if (rows.length > 0 && rows[0].receipt_number) {
      const lastReceipt = rows[0].receipt_number;
      // Ambil angka depan: "121/TRX/..." -> "121"
      const lastSeqStr = lastReceipt.split('/TRX')[0];
      const lastSeq = parseInt(lastSeqStr);

      if (!isNaN(lastSeq)) {
        nextSequence = lastSeq + 1;
      }
    }

    // Format Akhir
    return `${nextSequence}/TRX/FITALENTA/${romanMonth}/${year}`;

  } catch (error) {
    console.error("Error generating receipt number:", error);
    return `${defaultStart}/TRX/FITALENTA/${romanMonth}/${year}`;
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    const [rows] = await promisePool.query("SELECT 1 + 1 AS result");
    console.log("Database connection test successful");
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
};

// Export both regular and promise pool
export { promisePool };
export default db;