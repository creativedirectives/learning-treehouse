import type { Book } from '@learning-treehouse/book-model';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { createMockReadTogetherChannel, type ReadTogetherChannel, type ReadTogetherRole } from './channel';

type Props = {
  readonly book: Book;
  readonly onBackToGuide: () => void;
  readonly onBackToShelf: () => void;
};

const ROLE_LABEL: Record<ReadTogetherRole, string> = { you: 'You', partner: 'Partner' };
const OTHER_ROLE: Record<ReadTogetherRole, ReadTogetherRole> = { you: 'partner', partner: 'you' };

export function ReadTogether({ book, onBackToGuide, onBackToShelf }: Props) {
  const channelRef = useRef<ReadTogetherChannel | null>(null);
  if (!channelRef.current) {
    channelRef.current = createMockReadTogetherChannel();
  }
  const channel = channelRef.current;

  const [pageIndex, setPageIndex] = useState(0);
  const [activeRole, setActiveRole] = useState<ReadTogetherRole>('you');
  const [completedByRole, setCompletedByRole] = useState<Record<ReadTogetherRole, boolean>>({ you: false, partner: false });

  useEffect(
    () =>
      channel.subscribe((event) => {
        setCompletedByRole((current) => (event.pageIndex === pageIndex ? { ...current, [event.fromRole]: true } : current));
      }),
    [channel, pageIndex],
  );

  const page = book.pages[pageIndex];
  if (!page) return null;

  const isLastPage = pageIndex === book.pages.length - 1;
  const bothConfirmed = completedByRole.you && completedByRole.partner;
  const partnerRole = OTHER_ROLE[activeRole];
  const activeConfirmed = completedByRole[activeRole];
  const partnerHasConfirmed = completedByRole[partnerRole];

  function confirmFinished() {
    channel.sendPageComplete(activeRole, pageIndex);
  }

  function switchRole() {
    setActiveRole((current) => OTHER_ROLE[current]);
  }

  function nextPage() {
    setPageIndex((current) => Math.min(current + 1, book.pages.length - 1));
    setCompletedByRole({ you: false, partner: false });
    setActiveRole('you');
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.topActions}>
        <Pressable accessibilityRole="button" onPress={onBackToGuide} style={styles.back}>
          <Text style={styles.backText}>Back to guide</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onBackToShelf} style={styles.back}>
          <Text style={styles.backText}>Shelf</Text>
        </Pressable>
      </View>

      <Text style={styles.eyebrow}>READ TOGETHER · TAKE TURNS</Text>

      <View style={styles.card}>
        <View style={styles.promptRow}>
          <Text style={styles.prompt}>{book.title}</Text>
          <Text style={styles.progress}>
            Page {pageIndex + 1} of {book.pages.length}
          </Text>
        </View>
        <Text style={styles.pageText}>{page.readAlong.text}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Switch to viewing as ${ROLE_LABEL[partnerRole]}`}
          accessibilityHint="Lets one phone show both reading partners for this demo."
          onPress={switchRole}
          style={({ pressed }) => [styles.roleToggle, pressed && styles.pressed]}
        >
          <Text style={styles.roleToggleText}>Viewing as {ROLE_LABEL[activeRole]} · tap to switch</Text>
        </Pressable>

        <Text accessibilityLiveRegion="polite" style={styles.status}>
          {partnerHasConfirmed ? `🙂 ${ROLE_LABEL[partnerRole]} finished this page too.` : `Waiting on ${ROLE_LABEL[partnerRole]}...`}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: activeConfirmed }}
          disabled={activeConfirmed}
          onPress={confirmFinished}
          style={({ pressed }) => [styles.primaryAction, activeConfirmed && styles.disabled, pressed && !activeConfirmed && styles.pressed]}
        >
          <Text style={styles.primaryActionText}>{activeConfirmed ? `${ROLE_LABEL[activeRole]} confirmed` : 'Finished this page'}</Text>
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
          <Text style={styles.doneText}>Nothing was saved. Head back to the guide or the shelf whenever you're ready.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  topActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 26 },
  back: { paddingVertical: 6 },
  backText: { color: '#285842', fontSize: 16, fontWeight: '700' },
  eyebrow: { color: '#285842', fontSize: 13, fontWeight: '800', letterSpacing: 1.2 },
  card: { backgroundColor: '#fff9ed', borderColor: '#d6dbc8', borderRadius: 24, borderWidth: 1, marginTop: 16, padding: 22 },
  promptRow: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between' },
  prompt: { color: '#173b2b', fontSize: 24, fontWeight: '800' },
  progress: { color: '#4e6254', fontSize: 15, fontWeight: '700' },
  pageText: { color: '#173b2b', fontSize: 26, fontWeight: '700', lineHeight: 36, marginTop: 14 },
  roleToggle: { alignItems: 'center', backgroundColor: '#e8f3d8', borderColor: '#a4be79', borderRadius: 18, borderWidth: 1, marginTop: 18, paddingHorizontal: 16, paddingVertical: 12 },
  roleToggleText: { color: '#173b2b', fontSize: 15, fontWeight: '800' },
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
