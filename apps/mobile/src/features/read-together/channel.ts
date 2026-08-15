export type ReadTogetherRole = 'you' | 'partner';

export type ReadTogetherEvent = {
  readonly fromRole: ReadTogetherRole;
  readonly pageIndex: number;
};

/**
 * Swap point for a future real (two-device) transport. A real implementation would
 * send `sendPageComplete` over whatever local/remote signal gets decided later, and
 * fire `subscribe` listeners when a confirmation arrives from the other device. The
 * screen that consumes this interface does not need to change when that swap happens.
 */
export interface ReadTogetherChannel {
  sendPageComplete(fromRole: ReadTogetherRole, pageIndex: number): void;
  subscribe(listener: (event: ReadTogetherEvent) => void): () => void;
}

/** Local-only mock. No network of any kind — confirmations loop back on this device. */
export function createMockReadTogetherChannel(): ReadTogetherChannel {
  const listeners = new Set<(event: ReadTogetherEvent) => void>();

  return {
    sendPageComplete(fromRole, pageIndex) {
      const event: ReadTogetherEvent = { fromRole, pageIndex };
      listeners.forEach((listener) => listener(event));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
