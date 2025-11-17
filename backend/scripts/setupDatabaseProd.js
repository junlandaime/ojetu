import mysql from "mysql2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProd = process.env.NODE_ENV === "production";
const dbName = process.env.DB_NAME || "intern_registration";

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  multipleStatements: true,
  // ⚠️ database TIDAK kita set di sini,
  // kita set nanti dengan USE / changeUser supaya fleksibel
});

const schemaPath = path.join(__dirname, "../../database/schema2.sql"); 
let schema = fs.readFileSync(schemaPath, "utf8");

if (process.env.NODE_ENV === "production") {
  // Patch collation supaya cocok dengan MySQL versi hosting
  schema = schema.replace(/utf8mb4_0900_ai_ci/g, "utf8mb4_unicode_ci");
}

console.log("Setting up database...");
console.log(`Environment: ${isProd ? "production" : "development"}`);
console.log(`Target database: ${dbName}`);

const setupDatabase = async () => {
  try {
    // 1. Connect ke MySQL server
    await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log("✅ Connected to MySQL server");

    // 2. HANYA di non-production: CREATE DATABASE
    if (!isProd) {
      await new Promise((resolve, reject) => {
        connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log(`✅ Database "${dbName}" created or already exists`);
    } else {
      console.log("ℹ️ Production mode: skip CREATE DATABASE (dibuat lewat cPanel)");
    }

    // 3. Pakai database yang ditentukan
    await new Promise((resolve, reject) => {
      connection.query(`USE \`${dbName}\``, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log(`✅ Using database "${dbName}"`);

    // 4. Jalankan schema.sql (bikin tabel dsb.)
    await new Promise((resolve, reject) => {
      connection.query(schema, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log("✅ Database schema created successfully");

    connection.end();
    console.log("🎉 Database setup completed. Run 'npm run db:seed' to seed data if needed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    connection.end();
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  connection.end();
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  connection.end();
  process.exit(1);
});

setupDatabase();
