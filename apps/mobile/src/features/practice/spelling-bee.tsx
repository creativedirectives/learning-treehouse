import type { Book, BookWord } from '@learning-treehouse/book-model';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { speakWord, stopSpeakingWord } from '../../platform/speech';

type Props = {
  readonly book: Book;
  readonly onBackToGuide: () => void;
  readonly onBackToShelf: () => void;
};

function getPracticeWords(book: Book): readonly BookWord[] {
  return book.words.filter((word) => word.vocabulary);
}

function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function SpellingBee({ book, onBackToGuide, onBackToShelf }: Props) {
  const practiceWords = useMemo(() => getPracticeWords(book), [book]);
  const [wordIndex, setWordIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('Listen to the word, type it, then check together.');
  const [speaking, setSpeaking] = useState(false);
  const word = practiceWords[wordIndex];
  const correctCount = practiceWords.filter((practiceWord, index) => index < wordIndex && practiceWord.normalizedText).length;

  useEffect(() => () => stopSpeakingWord(), []);

  if (!word) {
    return (
      <ScrollView contentContainerStyle={styles.screen}>
        <Pressable accessibilityRole="button" onPress={onBackToShelf} style={styles.back}>
          <Text style={styles.backText}>Back to shelf</Text>
        </Pressable>
        <Text style={styles.eyebrow}>SPELLING BEE</Text>
        <Text style={styles.title}>No practice words yet</Text>
        <Text style={styles.intro}>This book does not have spelling words ready.</Text>
      </ScrollView>
    );
  }

  const isLastWord = wordIndex === practiceWords.length - 1;
  const normalizedAnswer = normalizeAnswer(answer);
  const isCorrect = normalizedAnswer === word.normalizedText;

  function hearCurrentWord() {
    setSpeaking(true);
    setResult(`Listen for "${word.text}", then try spelling it.`);
    void speakWord(word.text, {
      onDone: () => setSpeaking(false),
      onError: () => {
        setSpeaking(false);
        setResult('Device speech is unavailable right now. A grown-up can say the word.');
      },
    });
  }

  function checkAnswer() {
    if (!normalizedAnswer) {
      setResult('Type the word before checking.');
      return;
    }

    setResult(
      isCorrect
        ? `Correct. "${word.text}" is spelled ${word.text}.`
        : `Try again together. The word sounds like "${word.text}".`,
    );
  }

  function nextWord() {
    stopSpeakingWord();
    setSpeaking(false);
    setAnswer('');
    setResult('Listen to the word, type it, then check together.');
    setWordIndex((current) => Math.min(current + 1, practiceWords.length - 1));
  }

  function restart() {
    stopSpeakingWord();
    setSpeaking(false);
    setAnswer('');
    setResult('Listen to the word, type it, then check together.');
    setWordIndex(0);
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={styles.topActions}>
        <Pressable accessibilityRole="button" onPress={onBackToGuide} style={styles.back}>
          <Text style={styles.backText}>Back to guide</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onBackToShelf} style={styles.back}>
          <Text style={styles.backText}>Shelf</Text>
        </Pressable>
      </View>

      <Text style={styles.eyebrow}>BOOK-POWERED SPELLING BEE</Text>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.progress}>
        Word {wordIndex + 1} of {practiceWords.length}
      </Text>

      <View style={styles.card}>
        <Text style={styles.prompt}>Spell this word</Text>
        <Text style={styles.definition}>{word.vocabulary?.definition}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: speaking }}
          accessibilityLabel={`Hear ${word.text}`}
          accessibilityHint="Says the current spelling word aloud."
          onPress={hearCurrentWord}
          style={({ pressed }) => [styles.hearButton, speaking && styles.hearButtonActive, pressed && styles.pressed]}
        >
          <Text style={styles.hearButtonText}>{speaking ? 'Saying word...' : 'Hear word'}</Text>
        </Pressable>

        <TextInput
          accessibilityLabel="Type the spelling word"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setAnswer}
          placeholder="type the word"
          placeholderTextColor="#8a927d"
          returnKeyType="done"
          style={styles.input}
          value={answer}
        />

        <Text accessibilityLiveRegion="polite" style={[styles.result, isCorrect && normalizedAnswer ? styles.correct : null]}>
          {result}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={checkAnswer} style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}>
          <Text style={styles.primaryActionText}>Check spelling</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !isCorrect || isLastWord }}
          disabled={!isCorrect || isLastWord}
          onPress={nextWord}
          style={({ pressed }) => [styles.secondaryAction, (!isCorrect || isLastWord) && styles.disabled, pressed && isCorrect && !isLastWord && styles.pressed]}
        >
          <Text style={styles.secondaryActionText}>Next word</Text>
        </Pressable>
      </View>

      {isLastWord && isCorrect ? (
        <View style={styles.doneCard}>
          <Text style={styles.doneTitle}>Practice loop complete</Text>
          <Text style={styles.doneText}>You practiced {correctCount + 1} book words together. Nothing was saved.</Text>
          <Pressable accessibilityRole="button" onPress={restart} style={({ pressed }) => [styles.restartAction, pressed && styles.pressed]}>
            <Text style={styles.restartActionText}>Practice again</Text>
          </Pressable>
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
  title: { color: '#173b2b', fontSize: 34, fontWeight: '800', lineHeight: 40, marginTop: 8 },
  intro: { color: '#4e6254', fontSize: 17, lineHeight: 25, marginTop: 12 },
  progress: { color: '#4e6254', fontSize: 15, fontWeight: '700', marginTop: 12 },
  card: { backgroundColor: '#fff9ed', borderColor: '#d6dbc8', borderRadius: 24, borderWidth: 1, marginTop: 28, padding: 22 },
  prompt: { color: '#173b2b', fontSize: 24, fontWeight: '800' },
  definition: { color: '#4e6254', fontSize: 17, lineHeight: 25, marginTop: 10 },
  hearButton: { alignItems: 'center', backgroundColor: '#e8f3d8', borderColor: '#a4be79', borderRadius: 20, borderWidth: 1, marginTop: 18, paddingHorizontal: 18, paddingVertical: 13 },
  hearButtonActive: { backgroundColor: '#f3b84d', borderColor: '#b47514' },
  hearButtonText: { color: '#173b2b', fontSize: 16, fontWeight: '800' },
  input: { backgroundColor: '#fffdf8', borderColor: '#a4be79', borderRadius: 18, borderWidth: 1, color: '#173b2b', fontSize: 24, fontWeight: '800', marginTop: 18, paddingHorizontal: 16, paddingVertical: 14 },
  result: { color: '#4e6254', fontSize: 16, fontWeight: '700', lineHeight: 23, marginTop: 14 },
  correct: { color: '#285842' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  primaryAction: { alignItems: 'center', backgroundColor: '#f3b84d', borderRadius: 22, flex: 1, paddingHorizontal: 16, paddingVertical: 14 },
  primaryActionText: { color: '#173b2b', fontSize: 16, fontWeight: '800' },
  secondaryAction: { alignItems: 'center', borderColor: '#285842', borderRadius: 22, borderWidth: 1, flex: 1, paddingHorizontal: 16, paddingVertical: 14 },
  secondaryActionText: { color: '#285842', fontSize: 16, fontWeight: '800' },
  doneCard: { backgroundColor: '#e8f3d8', borderColor: '#a4be79', borderRadius: 22, borderWidth: 1, marginTop: 24, padding: 18 },
  doneTitle: { color: '#173b2b', fontSize: 21, fontWeight: '800' },
  doneText: { color: '#4e6254', fontSize: 16, lineHeight: 23, marginTop: 6 },
  restartAction: { alignItems: 'center', backgroundColor: '#285842', borderRadius: 20, marginTop: 16, paddingHorizontal: 16, paddingVertical: 13 },
  restartActionText: { color: '#fff9ed', fontSize: 16, fontWeight: '800' },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.8 },
});
