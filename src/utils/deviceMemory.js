/**
 * Device Memory - Store and manage saved login accounts
 * Data is stored in localStorage and cleared with browser cache
 * Each saved account includes encrypted credentials for quick login
 */

const STORAGE_KEY = "lunara_saved_accounts";
const ENCRYPTION_KEY = "lunara_device_memory"; // Simple XOR encryption for browser-only storage

/**
 * Simple encryption for browser-only storage
 * NOT for security - just to obscure data if user inspects localStorage
 */
function encryptData(data, key) {
  return btoa(
    JSON.stringify(data)
      .split("")
      .map((char, i) =>
        String.fromCharCode(
          char.charCodeAt(0) ^ key.charCodeAt(i % key.length),
        ),
      )
      .join(""),
  );
}

function decryptData(encrypted, key) {
  try {
    const decrypted = atob(encrypted)
      .split("")
      .map((char, i) =>
        String.fromCharCode(
          char.charCodeAt(0) ^ key.charCodeAt(i % key.length),
        ),
      )
      .join("");
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

/**
 * Get all saved accounts for a specific role
 */
export function getSavedAccounts(role) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const decrypted = decryptData(stored, ENCRYPTION_KEY);
    if (!decrypted) return [];

    // Filter by role
    return decrypted.filter((acc) => acc.role === role) || [];
  } catch (e) {
    console.error("Error reading saved accounts:", e);
    return [];
  }
}

/**
 * Save an account (email + password + role)
 */
export function saveAccount(email, password, role) {
  try {
    const accounts = getSavedAccounts("*"); // Get all roles
    const accountIndex = accounts.findIndex(
      (acc) => acc.email === email && acc.role === role,
    );

    if (accountIndex >= 0) {
      // Update existing
      accounts[accountIndex] = { email, password, role, savedAt: Date.now() };
    } else {
      // Add new
      accounts.push({ email, password, role, savedAt: Date.now() });
    }

    const encrypted = encryptData(accounts, ENCRYPTION_KEY);
    localStorage.setItem(STORAGE_KEY, encrypted);
    return true;
  } catch (e) {
    console.error("Error saving account:", e);
    return false;
  }
}

/**
 * Get a specific saved account by email and role
 */
export function getSavedAccount(email, role) {
  const accounts = getSavedAccounts(role);
  return accounts.find((acc) => acc.email === email) || null;
}

/**
 * Remove a saved account
 */
export function removeSavedAccount(email, role) {
  try {
    const all = getSavedAccounts("*");
    const filtered = all.filter(
      (acc) => !(acc.email === email && acc.role === role),
    );
    const encrypted = encryptData(filtered, ENCRYPTION_KEY);
    localStorage.setItem(STORAGE_KEY, encrypted);
    return true;
  } catch (e) {
    console.error("Error removing account:", e);
    return false;
  }
}

/**
 * Clear all saved accounts
 */
export function clearAllSavedAccounts() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error("Error clearing accounts:", e);
    return false;
  }
}

/**
 * Get all saved accounts (all roles)
 */
export function getAllSavedAccounts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return decryptData(stored, ENCRYPTION_KEY) || [];
  } catch (e) {
    console.error("Error reading all accounts:", e);
    return [];
  }
}
