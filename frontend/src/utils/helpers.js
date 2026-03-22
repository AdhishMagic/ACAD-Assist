export function getInitials(name = "") {
  const safe = String(name || "").trim();
  if (!safe) return "U";
  return safe
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function toTitleCase(value = "") {
  const safe = String(value || "").trim();
  if (!safe) return "";
  return safe.charAt(0).toUpperCase() + safe.slice(1);
}

export function getDisplayNameFromUser(user) {
  if (!user) return "";
  const first = user.first_name || user.firstName || "";
  const last = user.last_name || user.lastName || "";
  const combined = `${first} ${last}`.trim();
  if (combined) return combined;
  if (user.name) return String(user.name);
  if (user.username) return String(user.username);
  if (user.email) return String(user.email).split("@")[0];
  return "";
}

export function splitFullName(fullName = "") {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: "", last_name: "" };
  if (parts.length === 1) return { first_name: parts[0], last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}
