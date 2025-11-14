const requests = new Map();

const getKey = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.ip || req.connection.remoteAddress || "unknown";
};

const cleanup = (now, windowMs) => {
  for (const [key, value] of requests.entries()) {
    const lastWindowStart = value.firstRequestAt;
    if (now - lastWindowStart > windowMs * 2) {
      requests.delete(key);
    }
  }
};

const createRateLimiter = ({ windowMs, maxRequests }) => (req, res, next) => {
  const now = Date.now();
  cleanup(now, windowMs);

  const key = getKey(req);
  const record = requests.get(key);

  if (!record || now - record.firstRequestAt > windowMs) {
    requests.set(key, {
      firstRequestAt: now,
      requestCount: 1,
    });
    return next();
  }

  record.requestCount += 1;
  if (record.requestCount > maxRequests) {
    const retryAfter = Math.ceil(
      (windowMs - (now - record.firstRequestAt)) / 1000
    );
    res.setHeader("Retry-After", retryAfter);
    return res.status(429).json({
      success: false,
      message:
        "Terlalu banyak permintaan dari alamat IP yang sama. Coba lagi beberapa saat lagi.",
    });
  }

  return next();
};

const RATE_LIMIT_WINDOW_MS = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  10
);
const RATE_LIMIT_MAX_REQUESTS = parseInt(
  process.env.RATE_LIMIT_MAX_REQUESTS || 300,
  10
);

export default createRateLimiter({
  windowMs: RATE_LIMIT_WINDOW_MS,
  maxRequests: RATE_LIMIT_MAX_REQUESTS,
});