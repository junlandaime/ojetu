// buat util tunggal, mis. frontend/src/utils/api.js
export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  window.location.origin;

export const buildFileUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
};
