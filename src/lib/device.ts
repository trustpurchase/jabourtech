const KEY = "btp_device_uuid";

/** Identifiant unique persistant de l'appareil (device binding). */
export function getDeviceFingerprint(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
