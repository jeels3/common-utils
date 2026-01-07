// src/date.ts
function formatDate(date) {
  return date.toISOString().split("T")[0] ?? "";
}

// src/string.ts
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
export {
  capitalize,
  formatDate
};
