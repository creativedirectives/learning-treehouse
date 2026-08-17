import type { ReadTogetherChannel, ReadTogetherEvent, ReadTogetherRole } from './channel';

type RealChannelOptions = {
  readonly serverUrl: string;
  readonly deviceId: string;
  readonly partnerId: string;
  readonly token: string;
  /**
   * Fires once if the relay rejects the token (401) — a dead or revoked
   * credential, not a transient network blip. Polling stops after this fires.
   */
  readonly onAuthError?: () => void;
};

export type RealReadTogetherChannel = ReadTogetherChannel & {
  stop(): void;
  revoke(): Promise<boolean>;
};

const BASE_POLL_DELAY_MS = 2000;
const MAX_POLL_DELAY_MS = 30000;

/**
 * Real implementation of ReadTogetherChannel, talking to the deployed Family
 * Circle relay (apps/relay, packet-m009). Polls for events rather than holding an
 * open socket — works inside Expo Go with no native modules. A local send is
 * reflected to listeners immediately (so the sender's own confirmation shows right
 * away) in addition to being posted to the relay for the paired device to pick up.
 *
 * The poll interval backs off exponentially on consecutive failures (2s, capped at
 * 30s), resetting to 2s on the next success — appropriate for a real deployed
 * backend over a real network, unlike the same-WiFi dev server this replaced. A
 * 401 is treated as fatal rather than transient: polling stops and onAuthError
 * fires once instead of retrying forever against a dead credential.
 */
export function createRealReadTogetherChannel(options: RealChannelOptions): RealReadTogetherChannel {
  const listeners = new Set<(event: ReadTogetherEvent) => void>();
  let polling = true;
  let authFailed = false;
  let pollDelay = BASE_POLL_DELAY_MS;

  function authHeader(): Record<string, string> {
    return { Authorization: `Bearer ${options.token}` };
  }

  async function pollOnce(): Promise<boolean> {
    try {
      const response = await fetch(`${options.serverUrl}/api/events/${encodeURIComponent(options.deviceId)}`, {
        headers: authHeader(),
      });
      if (response.status === 401) {
        authFailed = true;
        options.onAuthError?.();
        return false;
      }
      if (!response.ok) return false;
      const data = (await response.json()) as { events?: readonly { type: string; payload?: { pageIndex?: number } }[] };
      for (const item of data.events ?? []) {
        if (item.type === 'page-complete' && typeof item.payload?.pageIndex === 'number') {
          const event: ReadTogetherEvent = { fromRole: 'partner', pageIndex: item.payload.pageIndex };
          listeners.forEach((listener) => listener(event));
        }
      }
      return true;
    } catch {
      // Network hiccup; the caller backs off and tries again.
      return false;
    }
  }

  async function pollLoop() {
    while (polling && !authFailed) {
      const succeeded = await pollOnce();
      if (!polling || authFailed) break;
      pollDelay = succeeded ? BASE_POLL_DELAY_MS : Math.min(pollDelay * 2, MAX_POLL_DELAY_MS);
      await new Promise((resolve) => setTimeout(resolve, pollDelay));
    }
  }
  void pollLoop();

  return {
    sendPageComplete(fromRole: ReadTogetherRole, pageIndex: number) {
      const event: ReadTogetherEvent = { fromRole, pageIndex };
      listeners.forEach((listener) => listener(event));
      void fetch(`${options.serverUrl}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({
          fromDeviceId: options.deviceId,
          toDeviceId: options.partnerId,
          type: 'page-complete',
          payload: { pageIndex },
        }),
      });
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    stop() {
      polling = false;
    },
    async revoke() {
      try {
        const response = await fetch(`${options.serverUrl}/api/connections/revoke`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeader() },
          body: JSON.stringify({ deviceId: options.deviceId, partnerId: options.partnerId }),
        });
        return response.ok;
      } catch {
        return false;
      }
    },
  };
}
