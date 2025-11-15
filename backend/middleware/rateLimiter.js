import { promisePool } from "../config/database.js";

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10); // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "300", 10);
const TABLE_NAME = "rate_limit_counters";

let tableEnsured = false;

const ensureTable = async () => {
  if (tableEnsured) {
    return;
  }

  await promisePool.query(`
    CREATE TABLE IF NOT EXISTS \`${TABLE_NAME}\` (
      rate_key VARCHAR(191) PRIMARY KEY,
      points INT NOT NULL,
      expires_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  tableEnsured = true;
};

const getKey = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  

return req.ip || req.connection?.remoteAddress || "unknown";
};

const toMysqlDate = (date) => date.toISOString().slice(0, 19).replace("T", " ");

  const rateLimiter = async (req, res, next) => {
  try {
    await ensureTable();
  } catch (error) {
    console.error("Failed to ensure rate limit table", error);
    return next();
  }

  const key = `${req.method}:${getKey(req)}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + WINDOW_MS);

  let connection;

  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    await connection.query(`DELETE FROM \`${TABLE_NAME}\` WHERE expires_at < ?`, [
      toMysqlDate(now),
    ]);

    const [rows] = await connection.query(
      `SELECT points, expires_at FROM \`${TABLE_NAME}\` WHERE rate_key = ? FOR UPDATE`,
      [key]
    );
    if (rows.length === 0 || new Date(rows[0].expires_at) <= now) {
      await connection.query(
        `REPLACE INTO \`${TABLE_NAME}\` (rate_key, points, expires_at) VALUES (?, ?, ?)`,
        [key, 1, toMysqlDate(expiresAt)]
      );
      await connection.commit();
      return next();
    }

    const current = rows[0];
    if (current.points >= MAX_REQUESTS) {
      await connection.rollback();
      const retryAfter = Math.max(
        1,
        Math.ceil((new Date(current.expires_at).getTime() - now.getTime()) / 1000)
      );

      res.setHeader("Retry-After", retryAfter.toString());
      return res.status(429).json({
        success: false,
        message:
          "Terlalu banyak permintaan dari alamat IP yang sama. Coba lagi beberapa saat lagi.",
      });
    }

    await connection.query(
      `UPDATE \`${TABLE_NAME}\` SET points = points + 1 WHERE rate_key = ?`,
      [key]
    );

    await connection.commit();
    return next();
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Failed to rollback rate limiter transaction", rollbackError);
      }
    }

    console.error("Rate limiter error", error);
    return next();
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export default rateLimiter;