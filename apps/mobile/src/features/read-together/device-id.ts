import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Persistent device identity for the real Family Circle channel — this is the one
 * piece of local state approved to survive app restarts (per DECISION_LOG.md,
 * 2026-08-05: "device identity... no name, login, or personal info required"). Without
 * persistence, every reload during development made a phone look like a brand-new
 * device to the relay, silently orphaning any pairing made before the reload.
 */
const STORAGE_KEY = 'learning-treehouse.read-together.device-id';

let cachedDeviceId: string | null = null;

function generateDeviceId(): string {
  return `device-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

export async function getOrCreateDeviceId(): Promise<string> {
  if (cachedDeviceId) return cachedDeviceId;

  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) {
    cachedDeviceId = stored;
    return stored;
  }

  const created = generateDeviceId();
  await AsyncStorage.setItem(STORAGE_KEY, created);
  cachedDeviceId = created;
  return created;
}
