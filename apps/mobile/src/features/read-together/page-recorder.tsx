import type { Book } from '@learning-treehouse/book-model';
import { RecordingPresets, requestRecordingPermissionsAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { uploadPageRecording } from './audio-message-client';

type Props = {
  readonly book: Book;
  readonly deviceId: string;
  readonly partnerId: string;
  readonly serverUrl: string;
  readonly token: string;
  readonly onDone: () => void;
};

/**
 * Recording side of packet-m012: a circle member picks a page in a shared
 * book and records a message for it. No live sync with what page the
 * recipient is actually on (that mechanism was retired with packet-m010's
 * synchronous flow) — any page in the book can get a recording, matching the
 * corrected feature's "optional, not every page" design.
 */
export function PageRecorder({ book, deviceId, partnerId, serverUrl, token, onDone }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [status, setStatus] = useState('Pick a page, then record a message for it.');
  const [sending, setSending] = useState(false);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  const page = book.pages[pageIndex];
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === book.pages.length - 1;
  const hasRecording = Boolean(recorderState.url) && !recorderState.isRecording;

  async function startRecording() {
    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) {
      setStatus('Microphone access is needed to record a message. You can still read together without it.');
      return;
    }
    await recorder.prepareToRecordAsync();
    recorder.record();
    setStatus('Recording…');
  }

  async function stopRecording() {
    await recorder.stop();
    setStatus('Recording ready. Send it, or record again.');
  }

  async function sendRecording() {
    if (!recorderState.url) return;
    setSending(true);
    const ok = await uploadPageRecording({
      serverUrl,
      fromDeviceId: deviceId,
      toDeviceId: partnerId,
      token,
      bookId: book.id,
      pageIndex,
      fileUri: recorderState.url,
    });
    setSending(false);
    setStatus(ok ? 'Sent! They will hear it when they get to this page.' : 'Could not send that recording. Check your connection and try again.');
  }

  function moveToPage(nextIndex: number) {
    setStatus('Pick a page, then record a message for it.');
    setPageIndex(nextIndex);
  }

  if (!page) return null;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Pressable accessibilityRole="button" onPress={onDone} style={styles.back}>
        <Text style={styles.backText}>Done</Text>
      </Pressable>

      <Text style={styles.eyebrow}>RECORD A MESSAGE</Text>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.progress}>
        Page {pageIndex + 1} of {book.pages.length}
      </Text>

      <View style={styles.pageCard}>
        <Text style={styles.pageText}>{page.readAlong.text}</Text>
      </View>

      <View style={styles.navigation}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isFirstPage }}
          disabled={isFirstPage}
          onPress={() => moveToPage(pageIndex - 1)}
          style={({ pressed }) => [styles.navButton, isFirstPage && styles.disabled, pressed && !isFirstPage && styles.pressed]}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isLastPage }}
          disabled={isLastPage}
          onPress={() => moveToPage(pageIndex + 1)}
          style={({ pressed }) => [styles.navButton, isLastPage && styles.disabled, pressed && !isLastPage && styles.pressed]}
        >
          <Text style={styles.navButtonText}>Next</Text>
        </Pressable>
      </View>

      <View style={styles.recordCard}>
        {recorderState.isRecording ? (
          <Pressable accessibilityRole="button" onPress={stopRecording} style={({ pressed }) => [styles.stopAction, pressed && styles.pressed]}>
            <Text style={styles.stopActionText}>Stop recording</Text>
          </Pressable>
        ) : (
          <Pressable accessibilityRole="button" onPress={startRecording} style={({ pressed }) => [styles.recordAction, pressed && styles.pressed]}>
            <Text style={styles.recordActionText}>{hasRecording ? 'Record again' : 'Record a message for this page'}</Text>
          </Pressable>
        )}

        {hasRecording ? (
          <Pressable
            accessibilityRole="button"
            disabled={sending}
            onPress={sendRecording}
            style={({ pressed }) => [styles.sendAction, pressed && !sending && styles.pressed]}
          >
            <Text style={styles.sendActionText}>{sending ? 'Sending…' : 'Send'}</Text>
          </Pressable>
        ) : null}

        <Text accessibilityLiveRegion="polite" style={styles.status}>
          {status}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  back: { alignSelf: 'flex-start', marginBottom: 26, paddingVertical: 6 },
  backText: { color: '#285842', fontSize: 16, fontWeight: '700' },
  eyebrow: { color: '#285842', fontSize: 13, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#173b2b', fontSize: 30, fontWeight: '800', lineHeight: 36, marginTop: 8 },
  progress: { color: '#4e6254', fontSize: 15, fontWeight: '700', marginTop: 8 },
  pageCard: { backgroundColor: '#fff9ed', borderColor: '#d6dbc8', borderRadius: 20, borderWidth: 1, marginTop: 18, padding: 20 },
  pageText: { color: '#173b2b', fontSize: 22, fontWeight: '700', lineHeight: 30 },
  navigation: { flexDirection: 'row', gap: 12, marginTop: 16 },
  navButton: { alignItems: 'center', borderColor: '#285842', borderRadius: 18, borderWidth: 1, flex: 1, paddingVertical: 12 },
  navButtonText: { color: '#285842', fontSize: 15, fontWeight: '800' },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.8 },
  recordCard: { backgroundColor: '#fff9ed', borderColor: '#d6dbc8', borderRadius: 20, borderWidth: 1, marginTop: 20, padding: 20 },
  recordAction: { alignItems: 'center', backgroundColor: '#f3b84d', borderRadius: 18, paddingVertical: 14 },
  recordActionText: { color: '#173b2b', fontSize: 16, fontWeight: '800' },
  stopAction: { alignItems: 'center', backgroundColor: '#a13f3f', borderRadius: 18, paddingVertical: 14 },
  stopActionText: { color: '#fff9ed', fontSize: 16, fontWeight: '800' },
  sendAction: { alignItems: 'center', borderColor: '#285842', borderRadius: 18, borderWidth: 1, marginTop: 12, paddingVertical: 14 },
  sendActionText: { color: '#285842', fontSize: 16, fontWeight: '800' },
  status: { color: '#4e6254', fontSize: 14, lineHeight: 20, marginTop: 14 },
});
