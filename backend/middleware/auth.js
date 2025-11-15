import jwt from "jsonwebtoken";

const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "access_token";
const JWT_SECRET = process.env.JWT_SECRET || "";
const COOKIE_MAX_AGE_DAYS = parseInt(process.env.JWT_COOKIE_MAX_AGE_DAYS || "7", 10);

const parseCookies = (cookieHeader = "") => {
  return cookieHeader.split(";").reduce((acc, part) => {
    const trimmed = part.trim();
    if (!trimmed) {
      return acc;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return acc;
    }

    const key = decodeURIComponent(trimmed.slice(0, separatorIndex));
    const value = decodeURIComponent(trimmed.slice(separatorIndex + 1));
    acc[key] = value;
    return acc;
  }, {});
};

export const getAuthToken = (req) => {
  if (!req.cookies) {
    req.cookies = parseCookies(req.headers?.cookie || "");
  }

  const header = req.headers?.authorization;
  if (typeof header === "string" && header.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }

  return req.cookies?.[JWT_COOKIE_NAME];
};

export const authenticateRequest = (req, res, next) => {
  if (!req.cookies) {
    req.cookies = parseCookies(req.headers?.cookie || "");
  }

  const token = getAuthToken(req);

  if (!token || !JWT_SECRET) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    if (error.name !== "TokenExpiredError") {
      console.warn("Invalid auth token provided", error.message);
    }
  }

  return next();
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Autentikasi diperlukan untuk mengakses sumber daya ini.",
    });
  }

  return next();
};

export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Autentikasi diperlukan untuk mengakses sumber daya ini.",
    });
  }

  const userRole = req.user.userType || req.user.role;
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({
      success: false,
      message: "Anda tidak memiliki izin untuk melakukan aksi ini.",
    });
  }

  return next();
};

export const requireAdmin = requireRole("admin");

export const setAuthCookie = (res, token) => {
  if (!token) {
    return;
  }

  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const secure = process.env.NODE_ENV === "production";

  res.cookie(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: secure ? "strict" : "lax",
    maxAge,
    path: "/",
  });
};

export const clearAuthCookie = (res) => {
  const secure = process.env.NODE_ENV === "production";

  res.clearCookie(JWT_COOKIE_NAME, {
    httpOnly: true,
    secure,
    sameSite: secure ? "strict" : "lax",
    path: "/",
  });
};

export default authenticateRequest;