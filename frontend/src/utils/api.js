// buat util tunggal, mis. frontend/src/utils/api.js
const trimTrailingSlash = (value) => value?.replace(/\/+$/, "") || "";

const getRuntimeConfig = (key) => {
  if (typeof window === "undefined") return "";
  return window.__APP_CONFIG__?.[key];
};

const resolveApiBaseUrl = () => {
  const rawBaseUrl = trimTrailingSlash(
    getRuntimeConfig("VITE_API_URL") || import.meta.env.VITE_API_URL
  );

  if (!rawBaseUrl) {
    const fallbackOrigin = trimTrailingSlash(window.location.origin);
    console.warn(
      "VITE_API_URL tidak ditemukan, fallback ke origin yang sama:",
      fallbackOrigin
    );
    return fallbackOrigin;
  }

  if (/^https?:\/\//i.test(rawBaseUrl)) {
    return rawBaseUrl;
  }

  if (rawBaseUrl.startsWith("/")) {
    return rawBaseUrl;
  }

  // Jika pengguna hanya mengisi domain tanpa slash di depan, jadikan path relatif
  return `/${rawBaseUrl}`;
};

export const API_BASE_URL = resolveApiBaseUrl();

const resolveFileBaseUrl = () => {
    const explicitFileBaseUrl = trimTrailingSlash(
    getRuntimeConfig("VITE_FILE_BASE_URL") || import.meta.env.VITE_FILE_BASE_URL
  );

  if (explicitFileBaseUrl) {
    if (/^https?:\/\//i.test(explicitFileBaseUrl)) {
      return explicitFileBaseUrl;
    }

    if (explicitFileBaseUrl.startsWith("/")) {
      return `${trimTrailingSlash(window.location.origin)}${explicitFileBaseUrl}`;
    }
  }

  const apiBaseUrl = API_BASE_URL;

  if (/^https?:\/\//i.test(apiBaseUrl)) {
    try {
      const parsed = new URL(apiBaseUrl);
      const sanitizedPath = trimTrailingSlash(
        parsed.pathname.replace(/\/api(\/)?$/, "")
      );

      const basePath =
        sanitizedPath && sanitizedPath !== "/" ? sanitizedPath : "";

      return `${parsed.origin}${basePath}`;
    } catch {
      return trimTrailingSlash(window.location.origin);
    }
  }

  if (apiBaseUrl.startsWith("/")) {
    const sanitizedPath = trimTrailingSlash(
      apiBaseUrl.replace(/\/api(\/)?$/, "")
    );
    const basePath = sanitizedPath && sanitizedPath !== "/" ? sanitizedPath : "";
    return `${trimTrailingSlash(window.location.origin)}${basePath}`;
  }

  return trimTrailingSlash(window.location.origin);
};

const FILE_BASE_URL = resolveFileBaseUrl();

export const buildFileUrl = (path) => {
  if (!path) return null;
  const rawPath = `${path}`.trim();
  if (/^https?:\/\//i.test(rawPath)) return rawPath;

  const sanitizedPath = rawPath
    .replace(/\\/g, "/")
    .replace(/\s+/g, (match) => match.replace(/\s/g, "%20"))
    .replace(/\/+/g, "/");

  const normalizedPath = sanitizedPath.startsWith("/")
    ? sanitizedPath
    : `/${sanitizedPath}`;

  return `${FILE_BASE_URL}${normalizedPath}`;
};
