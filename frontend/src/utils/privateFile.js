import { buildFileUrl } from "./api";

// Keep the original ojetu file-serving configuration. Its backend exposes
// /uploads, not the development-only /api/uploads/private endpoint.
export const getPrivateFileUrl = async (filePath) => {
  if (!filePath) return null;
  const normalizedPath = String(filePath).trim().replace(/\\/g, "/");
  const match = normalizedPath.match(/(?:\/)?uploads\/(photos|documents|payments)\/([^/?#]+)/);
  if (!match) throw new Error("Path file tidak valid");
  return buildFileUrl(`/uploads/${match[1]}/${match[2]}`);
};

export const revokePrivateFileUrl = (url) => {
  if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
};
