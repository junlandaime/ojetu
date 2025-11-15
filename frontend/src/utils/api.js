// buat util tunggal, mis. frontend/src/utils/api.js
const trimTrailingSlash = (value) => value?.replace(/\/+$/, "") || "";

const resolveApiBaseUrl = () => {
  const rawBaseUrl = trimTrailingSlash(import.meta.env.VITE_API_URL);

  if (!rawBaseUrl) {
    return trimTrailingSlash(window.location.origin);
  }

  if (/^https?:\/\//i.test(rawBaseUrl)) {
    return rawBaseUrl;
  }

  return rawBaseUrl;
};

export const API_BASE_URL = resolveApiBaseUrl();

const resolveFileBaseUrl = () => {
    const explicitFileBaseUrl = trimTrailingSlash(
    import.meta.env.VITE_FILE_BASE_URL
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
