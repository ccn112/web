/**
 * First-party device id — the browser's continuity key for AI chat and the
 * consultation thread. NOT authentication: the server treats it as a hint only,
 * and any device that did not create a conversation must verify by email OTP
 * before it can read history.
 *
 * Deliberately a random UUID in localStorage (no fingerprinting), and nothing
 * sensitive is ever stored alongside it.
 */

export const DEVICE_KEY = "xtech_chat_device";

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Read the device id, creating one on first visit. Returns "" on the server. */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = uuid();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    // Private mode / storage disabled: fall back to a per-tab id so the current
    // session still works (continuity is lost on reload, which is acceptable).
    return uuid();
  }
}
