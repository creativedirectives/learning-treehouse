import type { Book } from '@learning-treehouse/book-model';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { speakWord, stopSpeakingWord } from '../../platform/speech';

type Props = {
  readonly book: Book;
  readonly onBackToShelf: () => void;
  readonly onStartSpelling: () => void;
};

function normalizeInlineToken(token: string): string {
  return token.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function BookReader({ book, onBackToShelf, onStartSpelling }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);
  const [speechStatus, setSpeechStatus] = useState('Tap a word to hear it.');
  const page = book.pages[pageIndex];
  const pageWords = useMemo(() => book.words.filter((word) => word.pageId === page?.id), [book.words, page?.id]);
  const wordsByNormalizedText = useMemo(
    () => new Map(pageWords.map((word) => [word.normalizedText, word])),
    [pageWords],
  );
  useEffect(() => () => stopSpeakingWord(), []);
  if (!page) return null;
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === book.pages.length - 1;

  function moveToPage(nextIndex: number) {
    stopSpeakingWord(); setSpeakingWordId(null); setSpeechStatus('Tap a word to hear it.'); setPageIndex(nextIndex);
  }
  function hearWord(id: string, text: string) {
    setSpeakingWordId(id); setSpeechStatus(`Trying to say “${text}”…`);
    void speakWord(text, {
      onDone: () => { setSpeakingWordId((current) => current === id ? null : current); setSpeechStatus(`Finished saying “${text}”.`); },
      onError: () => { setSpeakingWordId((current) => current === id ? null : current); setSpeechStatus('Device speech is unavailable right now. You can keep reading.'); },
    });
  }
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Pressable accessibilityRole="button" onPress={onBackToShelf} style={styles.back}><Text style={styles.backText}>← Back to shelf</Text></Pressable>
      <Text style={styles.eyebrow}>READ TOGETHER</Text><Text style={styles.title}>{book.title}</Text>
      <Text accessibilityLiveRegion="polite" style={styles.progress}>Page {pageIndex + 1} of {book.pages.length}</Text>
      <View style={styles.pageCard}>
        <Text style={styles.pageText}>
          {page.readAlong.text.split(/(\s+)/).map((token, index) => {
            const normalizedToken = normalizeInlineToken(token);
            const word = wordsByNormalizedText.get(normalizedToken);
            const speechId = word?.id ?? `inline-${page.id}-${index}`;
            const textToSpeak = word?.text ?? normalizedToken;
            const active = speechId === speakingWordId;

            if (!normalizedToken) return token;

            return (
              <Text
                key={speechId}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Hear ${textToSpeak}`}
                accessibilityHint="Double tap to hear this word."
                onPress={() => hearWord(speechId, textToSpeak)}
                style={[styles.inlineWord, word && styles.inlineVocabularyWord, active && styles.activeInlineWord]}
              >
                {token}
              </Text>
            );
          })}
        </Text>
      </View>
      <View style={styles.wordsSection}>
        <Text style={styles.wordsTitle}>Words to notice</Text><Text style={styles.hint}>Tap a word to hear its pronunciation.</Text>
        <View style={styles.wordRow}>{pageWords.map((word) => {
          const active = speakingWordId === word.id;
          return <Pressable key={word.id} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => hearWord(word.id, word.text)} style={({ pressed }) => [styles.word, active && styles.activeWord, pressed && styles.pressed]}>
            <Text style={[styles.wordText, active && styles.activeWordText]}>{word.text}</Text>
            {word.vocabulary ? <Text style={[styles.definition, active && styles.activeWordText]}>{word.vocabulary.definition}</Text> : null}
          </Pressable>;
        })}</View>
        <Text accessibilityLiveRegion="polite" style={styles.speechStatus}>{speechStatus}</Text>
      </View>
      <View style={styles.navigation}>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: isFirstPage }} disabled={isFirstPage} onPress={() => moveToPage(pageIndex - 1)} style={({ pressed }) => [styles.previous, isFirstPage && styles.disabled, pressed && !isFirstPage && styles.pressed]}><Text style={styles.previousText}>Previous</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: isLastPage }} disabled={isLastPage} onPress={() => moveToPage(pageIndex + 1)} style={({ pressed }) => [styles.next, isLastPage && styles.disabled, pressed && !isLastPage && styles.pressed]}><Text style={styles.nextText}>Next</Text></Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Practice spelling words from ${book.title}`}
        accessibilityHint="Opens local spelling practice using this book's words."
        onPress={onStartSpelling}
        style={({ pressed }) => [styles.spellingAction, pressed && styles.pressed]}
      >
        <Text style={styles.spellingActionText}>Practice spelling</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, padding: 24, paddingBottom: 40 }, back: { alignSelf: 'flex-start', marginBottom: 26, paddingVertical: 6 }, backText: { color: '#285842', fontSize: 16, fontWeight: '700' },
  eyebrow: { color: '#285842', fontSize: 13, fontWeight: '800', letterSpacing: 1.2 }, title: { color: '#173b2b', fontSize: 34, fontWeight: '800', lineHeight: 40, marginTop: 8 }, progress: { color: '#4e6254', fontSize: 15, fontWeight: '700', marginTop: 12 },
  pageCard: { backgroundColor: '#fff9ed', borderRadius: 24, marginTop: 28, padding: 26 }, pageText: { color: '#173b2b', fontSize: 32, fontWeight: '700', lineHeight: 44 }, inlineWord: { color: '#285842', textDecorationLine: 'underline', textDecorationStyle: 'dotted' }, inlineVocabularyWord: { backgroundColor: '#e8f3d8', color: '#173b2b', fontWeight: '800', textDecorationLine: 'none' }, activeInlineWord: { backgroundColor: '#f3b84d', color: '#173b2b', textDecorationLine: 'none' },
  wordsSection: { marginTop: 28 }, wordsTitle: { color: '#173b2b', fontSize: 22, fontWeight: '800' }, hint: { color: '#4e6254', fontSize: 15, marginTop: 4 }, wordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  word: { backgroundColor: '#e8f3d8', borderColor: '#a4be79', borderRadius: 18, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12 }, activeWord: { backgroundColor: '#f3b84d', borderColor: '#b47514' }, wordText: { color: '#285842', fontSize: 18, fontWeight: '800' }, definition: { color: '#4e6254', fontSize: 13, lineHeight: 18, marginTop: 4, maxWidth: 230 }, activeWordText: { color: '#173b2b' }, speechStatus: { color: '#4e6254', fontSize: 14, fontWeight: '600', lineHeight: 20, marginTop: 16 },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 34 }, previous: { borderColor: '#285842', borderRadius: 24, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 13 }, next: { backgroundColor: '#f3b84d', borderRadius: 24, paddingHorizontal: 24, paddingVertical: 13 }, previousText: { color: '#285842', fontSize: 16, fontWeight: '800' }, nextText: { color: '#173b2b', fontSize: 16, fontWeight: '800' }, disabled: { opacity: 0.4 }, pressed: { opacity: 0.78 },
  spellingAction: { alignItems: 'center', borderColor: '#285842', borderRadius: 24, borderWidth: 1, marginTop: 18, paddingHorizontal: 24, paddingVertical: 14 }, spellingActionText: { color: '#285842', fontSize: 16, fontWeight: '800' },
});
