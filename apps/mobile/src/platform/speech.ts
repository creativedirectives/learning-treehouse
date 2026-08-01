import * as Speech from 'expo-speech';

type Callbacks = { readonly onDone: () => void; readonly onError: () => void; };
let latestRequest = 0;

/** Speaks one local word and replaces any utterance that was already queued. */
export async function speakWord(word: string, callbacks: Callbacks): Promise<void> {
  const request = ++latestRequest;
  try {
    await Speech.stop();
    if (request !== latestRequest) return;
    Speech.speak(word, {
      onDone: () => { if (request === latestRequest) callbacks.onDone(); },
      onError: () => { if (request === latestRequest) callbacks.onError(); },
    });
  } catch {
    if (request === latestRequest) callbacks.onError();
  }
}
export function stopSpeakingWord(): void { latestRequest += 1; void Speech.stop(); }
