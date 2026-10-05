const KEY = "lunara_saved_sessions";

function readSessions() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
const accountKey = (email, role) => `${role}:${email.trim().toLowerCase()}`;

export function getSavedSession(email, role) {
  return readSessions()?.[accountKey(email, role)] || null;
}

export function saveSession(email, role, session) {
  if (!session?.refresh_token || !session?.user?.id) return;
  try {
    const sessions = readSessions();
    sessions[accountKey(email, role)] = {
      refresh_token: session.refresh_token,
      userId: session.user.id,
    };
    localStorage.setItem(KEY, JSON.stringify(sessions));
  } catch {
    /* Remembering accounts is optional when storage is unavailable. */
  }
}

export function removeSavedSession(email, role) {
  try {
    const sessions = readSessions();
    delete sessions[accountKey(email, role)];
    localStorage.setItem(KEY, JSON.stringify(sessions));
  } catch {
    /* Storage can be disabled by the browser. */
  }
}

export function clearSavedSessionsForUser(userId) {
  try {
    const sessions = readSessions();
    for (const key of Object.keys(sessions)) {
      if (sessions[key]?.userId === userId) delete sessions[key];
    }
    localStorage.setItem(KEY, JSON.stringify(sessions));
  } catch {
    /* Storage can be disabled by the browser. */
  }
}
