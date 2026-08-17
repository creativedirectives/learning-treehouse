import type { Book } from '@learning-treehouse/book-model';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { RealReadTogetherChannel } from './real-channel';

type Props = {
  readonly book: Book;
  readonly channel: RealReadTogetherChannel;
  readonly code: string | null;
  readonly onBackToShelf: () => void;
  /** Called after the connection is successfully revoked, both sides. */
  readonly onRevoked: () => void;
};

export function RealReadTogether({ book, channel, code, onBackToShelf, onRevoked }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [youConfirmed, setYouConfirmed] = useState(false);
  const [partnerConfirmed, setPartnerConfirmed] = useState(false);
  const [revoking, setRevoking] = useState(false);

  useEffect(
    () =>
      channel.subscribe((event) => {
        if (event.pageIndex !== pageIndex) return;
        if (event.fromRole === 'you') setYouConfirmed(true);
        if (event.fromRole === 'partner') setPartnerConfirmed(true);
      }),
    [channel, pageIndex],
  );

  useEffect(() => () => channel.stop(), [channel]);

  const page = book.pages[pageIndex];
  if (!page) return null;

  const isLastPage = pageIndex === book.pages.length - 1;
  const bothConfirmed = youConfirmed && partnerConfirmed;

  function confirmFinished() {
    channel.sendPageComplete('you', pageIndex);
  }

  function nextPage() {
    setPageIndex((current) => Math.min(current + 1, book.pages.length - 1));
    setYouConfirmed(false);
    setPartnerConfirmed(false);
  }

  function confirmRemoveConnection() {
    Alert.alert(
      'Remove this connection?',
      'Neither device will be able to send or receive anything from the other. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setRevoking(true);
            void channel.revoke().then((succeeded) => {
              setRevoking(false);
              if (succeeded) onRevoked();
              else Alert.alert('Could not remove the connection', 'Check your connection and try again.');
            });
          },
        },
      ],
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.topRow}>
        <Pressable accessibilityRole="button" onPress={onBackToShelf} style={styles.back}>
          <Text style={styles.backText}>Back to shelf</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={revoking}
          onPress={confirmRemoveConnection}
          style={({ pressed }) => [styles.removeConnection, pressed && !revoking && styles.pressed]}
        >
          <Text style={styles.removeConnectionText}>{revoking ? 'Removing…' : 'Remove connection'}</Text>
        </Pressable>
      </View>

      <Text style={styles.eyebrow}>READ TOGETHER · LIVE, WITH FAMILY</Text>

      <View style={styles.card}>
        <View style={styles.promptRow}>
          <Text style={styles.prompt}>{book.title}</Text>
          <Text style={styles.progress}>
            Page {pageIndex + 1} of {book.pages.length}
          </Text>
        </View>
        <Text style={styles.pageText}>{page.readAlong.text}</Text>

        <Text accessibilityLiveRegion="polite" style={styles.status}>
          {partnerConfirmed ? '🙂 Your family member finished this page too.' : 'Waiting on your family member...'}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: youConfirmed }}
          disabled={youConfirmed}
          onPress={confirmFinished}
          style={({ pressed }) => [styles.primaryAction, youConfirmed && styles.disabled, pressed && !youConfirmed && styles.pressed]}
        >
          <Text style={styles.primaryActionText}>{youConfirmed ? 'You confirmed' : 'Finished this page'}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !bothConfirmed || isLastPage }}
          disabled={!bothConfirmed || isLastPage}
          onPress={nextPage}
          style={({ pressed }) => [styles.secondaryAction, (!bothConfirmed || isLastPage) && styles.disabled, pressed && bothConfirmed && !isLastPage && styles.pressed]}
        >
          <Text style={styles.secondaryActionText}>Next page</Text>
        </Pressable>
      </View>

      {isLastPage && bothConfirmed ? (
        <View style={styles.doneCard}>
          <Text style={styles.doneTitle}>You read it together</Text>
          <Text style={styles.doneText}>Really together — that page confirmation just came from another phone.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  topRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 26 },
  back: { alignSelf: 'flex-start', paddingVertical: 6 },
  backText: { color: '#285842', fontSize: 16, fontWeight: '700' },
  removeConnection: { alignSelf: 'flex-end', paddingVertical: 6 },
  removeConnectionText: { color: '#a13f3f', fontSize: 14, fontWeight: '700' },
  eyebrow: { color: '#285842', fontSize: 13, fontWeight: '800', letterSpacing: 1.2 },
  card: { backgroundColor: '#fff9ed', borderColor: '#d6dbc8', borderRadius: 24, borderWidth: 1, marginTop: 16, padding: 22 },
  promptRow: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between' },
  prompt: { color: '#173b2b', fontSize: 24, fontWeight: '800' },
  progress: { color: '#4e6254', fontSize: 15, fontWeight: '700' },
  pageText: { color: '#173b2b', fontSize: 26, fontWeight: '700', lineHeight: 36, marginTop: 14 },
  status: { color: '#4e6254', fontSize: 15, fontWeight: '700', lineHeight: 21, marginTop: 14 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  primaryAction: { alignItems: 'center', backgroundColor: '#f3b84d', borderRadius: 22, flex: 1, paddingHorizontal: 16, paddingVertical: 14 },
  primaryActionText: { color: '#173b2b', fontSize: 16, fontWeight: '800' },
  secondaryAction: { alignItems: 'center', borderColor: '#285842', borderRadius: 22, borderWidth: 1, flex: 1, paddingHorizontal: 16, paddingVertical: 14 },
  secondaryActionText: { color: '#285842', fontSize: 16, fontWeight: '800' },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.8 },
  doneCard: { backgroundColor: '#e8f3d8', borderColor: '#a4be79', borderRadius: 22, borderWidth: 1, marginTop: 24, padding: 18 },
  doneTitle: { color: '#173b2b', fontSize: 21, fontWeight: '800' },
  doneText: { color: '#4e6254', fontSize: 16, lineHeight: 23, marginTop: 6 },
});
