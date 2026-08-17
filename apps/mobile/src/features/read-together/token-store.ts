import * as SecureStore from 'expo-secure-store';

/**
 * Persistent auth-token storage for the real Family Circle channel — the token
 * counterpart to device-id.ts's device identity. Unlike device-id.ts, this must
 * NOT use AsyncStorage (per DECISION_LOG.md, 2026-08-05: the device ID may persist
 * there, the token may not) — expo-secure-store only.
 */
const STORAGE_KEY = 'learning-treehouse.read-together.auth-token';

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(STORAGE_KEY);
}

export async function setStoredToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEY, token);
}

export async function clearStoredToken(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}
