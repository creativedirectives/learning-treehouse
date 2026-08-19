import type { AudioSource } from 'expo-audio';

/**
 * Client helpers for packet-m011's page-attached audio endpoints. Talks
 * directly to the deployed relay (apps/relay) — no local mock, matching how
 * real-channel.ts (packet-m010) already works.
 */

export type PendingAudioMessage = {
  readonly messageId: string;
  readonly fromDeviceId: string;
  readonly bookId: string;
  readonly pageIndex: number;
  readonly createdAt: number;
  readonly expiresAt: number;
};

function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

/**
 * What's waiting for this device in this book — metadata only, no audio
 * bytes. Fails soft (empty list) on any network error, matching the pattern
 * used for polling elsewhere in this feature — a failed check just means no
 * indicator shows this time, not a crash.
 */
export async function fetchPendingForBook(
  serverUrl: string,
  deviceId: string,
  token: string,
  bookId: string,
): Promise<readonly PendingAudioMessage[]> {
  try {
    const response = await fetch(
      `${serverUrl}/api/audio/pending/${encodeURIComponent(deviceId)}?bookId=${encodeURIComponent(bookId)}`,
      { headers: authHeader(token) },
    );
    if (!response.ok) return [];
    const data = (await response.json()) as { pending?: readonly PendingAudioMessage[] };
    return data.pending ?? [];
  } catch {
    return [];
  }
}

type UploadOptions = {
  readonly serverUrl: string;
  readonly fromDeviceId: string;
  readonly toDeviceId: string;
  readonly token: string;
  readonly bookId: string;
  readonly pageIndex: number;
  /** Local file URI from AudioRecorder.uri after stopping a recording. */
  readonly fileUri: string;
};

/**
 * Reads a locally recorded file and uploads it. fetch(fileUri) + .blob() is
 * the standard React Native pattern for reading a local file as upload body
 * — no extra filesystem package needed for this direction.
 */
export async function uploadPageRecording(options: UploadOptions): Promise<boolean> {
  try {
    const localFile = await fetch(options.fileUri);
    const bytes = await localFile.blob();
    const uploadUrl =
      `${options.serverUrl}/api/audio/upload` +
      `?fromDeviceId=${encodeURIComponent(options.fromDeviceId)}` +
      `&toDeviceId=${encodeURIComponent(options.toDeviceId)}` +
      `&bookId=${encodeURIComponent(options.bookId)}` +
      `&pageIndex=${options.pageIndex}`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'audio/m4a', ...authHeader(options.token) },
      body: bytes,
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * The AudioSource for playing a pending message directly from the relay —
 * expo-audio fetches this itself (with the auth header attached), no manual
 * download step needed.
 */
export function audioSourceFor(serverUrl: string, messageId: string, token: string): AudioSource {
  return {
    uri: `${serverUrl}/api/audio/${encodeURIComponent(messageId)}`,
    headers: authHeader(token),
  };
}
