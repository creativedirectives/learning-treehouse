import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * packet-m012 correction: independent verification found the most-recently-
 * paired partner ID was tracked only in App.tsx component state, so it was
 * lost on every app relaunch — a previously-paired device kept receiving and
 * playing messages fine (that only needs the persisted token), but the
 * "Record a message" entry point silently disappeared until the user re-ran
 * the Connect flow. A partner's device ID is not sensitive the same way the
 * auth token is (same reasoning device-id.ts already uses for this device's
 * own ID), so AsyncStorage is the right store here, not expo-secure-store.
 */
const STORAGE_KEY = 'learning-treehouse.read-together.last-paired-partner-id';

export async function getStoredPartnerId(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEY);
}

export async function setStoredPartnerId(partnerId: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, partnerId);
}

export async function clearStoredPartnerId(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
