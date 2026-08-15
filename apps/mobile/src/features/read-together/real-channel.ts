import type { ReadTogetherChannel, ReadTogetherEvent, ReadTogetherRole } from './channel';

type RealChannelOptions = {
  readonly serverUrl: string;
  readonly deviceId: string;
  readonly partnerId: string;
};

export type RealReadTogetherChannel = ReadTogetherChannel & {
  stop(): void;
};

/**
 * Real implementation of ReadTogetherChannel, talking to the Family Circle relay
 * (apps/relay). Polls for events rather than holding an open socket — works inside
 * Expo Go with no native modules. A local send is reflected to listeners immediately
 * (so the sender's own confirmation shows right away) in addition to being posted to
 * the relay for the paired device to pick up.
 */
export function createRealReadTogetherChannel(options: RealChannelOptions): RealReadTogetherChannel {
  const listeners = new Set<(event: ReadTogetherEvent) => void>();
  let polling = true;

  async function pollOnce() {
    try {
      const response = await fetch(`${options.serverUrl}/events/${encodeURIComponent(options.deviceId)}`);
      if (!response.ok) return;
      const data = (await response.json()) as { events?: readonly { type: string; payload?: { pageIndex?: number } }[] };
      for (const item of data.events ?? []) {
        if (item.type === 'page-complete' && typeof item.payload?.pageIndex === 'number') {
          const event: ReadTogetherEvent = { fromRole: 'partner', pageIndex: item.payload.pageIndex };
          listeners.forEach((listener) => listener(event));
        }
      }
    } catch {
      // Network hiccup on a local dev server; the next poll tick tries again.
    }
  }

  async function pollLoop() {
    while (polling) {
      await pollOnce();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  void pollLoop();

  return {
    sendPageComplete(fromRole: ReadTogetherRole, pageIndex: number) {
      const event: ReadTogetherEvent = { fromRole, pageIndex };
      listeners.forEach((listener) => listener(event));
      void fetch(`${options.serverUrl}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
  };
}
