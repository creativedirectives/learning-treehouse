import type { Book } from '@learning-treehouse/book-model';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  readonly book: Book;
  readonly onBackToShelf: () => void;
  readonly onStartReading: () => void;
  readonly onStartSpelling: () => void;
};

export function ParentGuide({ book, onBackToShelf, onStartReading, onStartSpelling }: Props) {
  const practiceWords = book.words.filter((word) => word.vocabulary);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back to shelf" onPress={onBackToShelf} style={styles.back}>
        <Text style={styles.backText}>Back to shelf</Text>
      </Pressable>
      <Text style={styles.eyebrow}>FOR GROWN-UPS</Text>
      <Text style={styles.title}>Read together with {book.title}</Text>
      <Text style={styles.intro}>
        Start with the story, pause for words your child wants help with, and talk about the words that belong to this book.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>A simple reading loop</Text>
        <Text style={styles.step}>1. Read one page together.</Text>
        <Text style={styles.step}>2. Tap any story word to hear it aloud.</Text>
        <Text style={styles.step}>3. Talk about a practice word when it feels useful.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{book.title} practice words</Text>
        {practiceWords.map((word) => (
          <View key={word.id} style={styles.wordCard}>
            <Text style={styles.word}>{word.text}</Text>
            <Text style={styles.definition}>{word.vocabulary?.definition}</Text>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Start reading ${book.title}`}
        accessibilityHint="Opens the first page of the story."
        onPress={onStartReading}
        style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
      >
        <Text style={styles.primaryActionText}>Start reading</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Practice spelling words from ${book.title}`}
        accessibilityHint="Opens a local spelling practice using this book's words."
        onPress={onStartSpelling}
        style={({ pressed }) => [styles.secondaryAction, styles.spellingAction, pressed && styles.pressed]}
      >
        <Text style={styles.secondaryActionText}>Practice spelling</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Return to book shelf" onPress={onBackToShelf} style={styles.secondaryAction}>
        <Text style={styles.secondaryActionText}>Return to shelf</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  back: { alignSelf: 'flex-start', marginBottom: 26, paddingVertical: 6 },
  backText: { color: '#285842', fontSize: 16, fontWeight: '700' },
  eyebrow: { color: '#285842', fontSize: 13, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#173b2b', fontSize: 34, fontWeight: '800', lineHeight: 40, marginTop: 8 },
  intro: { color: '#4e6254', fontSize: 17, lineHeight: 25, marginTop: 12 },
  section: { marginTop: 28 },
  sectionTitle: { color: '#173b2b', fontSize: 22, fontWeight: '800', marginBottom: 10 },
  step: { color: '#4e6254', fontSize: 16, lineHeight: 24, marginTop: 6 },
  wordCard: { backgroundColor: '#fff9ed', borderColor: '#d6dbc8', borderRadius: 16, borderWidth: 1, marginTop: 10, padding: 16 },
  word: { color: '#285842', fontSize: 18, fontWeight: '800' },
  definition: { color: '#4e6254', fontSize: 15, lineHeight: 21, marginTop: 4 },
  primaryAction: { alignItems: 'center', backgroundColor: '#f3b84d', borderRadius: 24, marginTop: 30, paddingHorizontal: 24, paddingVertical: 15 },
  primaryActionText: { color: '#173b2b', fontSize: 17, fontWeight: '800' },
  secondaryAction: { alignItems: 'center', borderColor: '#285842', borderRadius: 24, borderWidth: 1, marginTop: 12, paddingHorizontal: 24, paddingVertical: 14 },
  spellingAction: { backgroundColor: '#fff9ed' },
  secondaryActionText: { color: '#285842', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.8 },
});
