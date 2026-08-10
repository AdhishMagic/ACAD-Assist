export function getFileUrl(value) {
  if (!value || typeof value !== "string") return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("blob:")) return value;

  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  if (!apiBase || value.startsWith("/api/")) return value;

  return `${apiBase.replace(/\/$/, "")}/${value.replace(/^\//, "")}`;
}
