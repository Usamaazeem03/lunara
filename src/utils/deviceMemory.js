import {
  saveSession,
  removeSavedSession,
} from "./savedAccountSessions.js";

// Account labels are separate from sessions. Passwords are never stored.
const STORAGE_KEY = "lunara_saved_accounts";
const LEGACY_KEY = "lunara_device_memory";

export function getAllSavedAccounts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    let values;
    try {
      values = JSON.parse(stored);
    } catch {
      const decoded = atob(stored)
        .split("")
        .map((char, index) =>
          String.fromCharCode(
            char.charCodeAt(0) ^
              LEGACY_KEY.charCodeAt(index % LEGACY_KEY.length),
          ),
        )
        .join("");
      values = JSON.parse(decoded);
    }
    const accounts = (Array.isArray(values) ? values : [])
      .filter(
        (value) =>
          typeof value.email === "string" &&
          ["owner", "client"].includes(value.role),
      )
      .map(({ email, role }) => ({ email, role }));
    // Rewrite old entries immediately to discard stored passwords.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    return accounts;
  } catch {
    return [];
  }
}
export function getSavedAccounts(role) {
  const accounts = getAllSavedAccounts();
  return role === "*"
    ? accounts
    : accounts.filter((account) => account.role === role);
}
export function saveAccount(email, role, session) {
  try {
    const accounts = getAllSavedAccounts().filter(
      (account) => account.email !== email || account.role !== role,
    );
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...accounts, { email, role }]),
    );
    if (session) saveSession(email, role, session);
    return true;
  } catch {
    return false;
  }
}
export function removeSavedAccount(email, role) {
  removeSavedSession(email, role);
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        getAllSavedAccounts().filter(
          (account) => account.email !== email || account.role !== role,
        ),
      ),
    );
    return true;
  } catch {
    return false;
  }
}
