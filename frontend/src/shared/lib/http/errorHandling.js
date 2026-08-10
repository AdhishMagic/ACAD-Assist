export function getHttpErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) return data;
  if (typeof data?.detail === "string" && data.detail.trim()) return data.detail;
  if (typeof data?.message === "string" && data.message.trim()) return data.message;

  if (data && typeof data === "object") {
    const fieldError = Object.values(data).flat().find((value) => typeof value === "string" && value.trim());
    if (fieldError) return fieldError;
  }

  return typeof error?.message === "string" && error.message.trim() ? error.message : fallback;
}
