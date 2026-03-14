export function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
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
