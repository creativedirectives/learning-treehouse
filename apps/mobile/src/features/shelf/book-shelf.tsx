import type { Book } from '@learning-treehouse/book-model';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  readonly books: readonly Book[];
  readonly onOpenBook: (book: Book) => void;
  readonly onOpenParentGuide: () => void;
  readonly onStartReading: () => void;
  readonly onStartSpelling: () => void;
  readonly onStartReadTogether: () => void;
  readonly onConnectFamily: () => void;
};

export function BookShelf({ books, onOpenBook, onOpenParentGuide, onStartReading, onStartSpelling, onStartReadTogether, onConnectFamily }: Props) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOUR COZY READING TREEHOUSE</Text>
        <Text style={styles.title}>Pick a book to begin</Text>
        <Text style={styles.intro}>Every book opens a new reading adventure. Read together and discover new words.</Text>

        <View style={styles.parentSection}>
          <Text style={styles.parentSectionTitle}>Parent dashboard</Text>
          <Text style={styles.parentSectionDetail}>Start an activity without leaving this page.</Text>
          <View style={styles.parentActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Start reading"
              onPress={onStartReading}
              style={({ pressed }) => [styles.parentAction, pressed && styles.pressed]}
            >
              <Text style={styles.parentActionText}>Start reading</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Practice spelling"
              onPress={onStartSpelling}
              style={({ pressed }) => [styles.parentAction, pressed && styles.pressed]}
            >
              <Text style={styles.parentActionText}>Practice spelling</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Read together"
              onPress={onStartReadTogether}
              style={({ pressed }) => [styles.parentAction, pressed && styles.pressed]}
            >
              <Text style={styles.parentActionText}>Read together</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Read together with family"
              accessibilityHint="Pair with a family member's device over your WiFi network."
              onPress={onConnectFamily}
              style={({ pressed }) => [styles.parentAction, styles.familyAction, pressed && styles.pressed]}
            >
              <Text style={styles.parentActionText}>Read together (family)</Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Parent guide"
            accessibilityHint="Opens reading tips and this book's practice words."
            onPress={onOpenParentGuide}
            style={({ pressed }) => [styles.parentGuideLink, pressed && styles.pressed]}
          >
            <Text style={styles.parentGuideLinkText}>Parent guide · reading tips &amp; words</Text>
          </Pressable>
        </View>

        <Text style={styles.shelfLabel}>THE BOOK SHELF</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.shelfRow}
      >
        {books.map((book, index) => {
          const isReadable = book.availability === 'full';
          return (
            <Pressable
              key={book.id}
              accessibilityRole={isReadable ? 'button' : undefined}
              accessibilityState={{ disabled: !isReadable }}
              disabled={!isReadable}
              onPress={() => onOpenBook(book)}
              style={({ pressed }) => [styles.card, covers[index % covers.length], !isReadable && styles.preview, pressed && isReadable && styles.pressed]}
            >
              <Text style={styles.status}>{isReadable ? 'READY TO READ' : 'PREVIEW · READ-ONLY'}</Text>
              <Text style={styles.cardTitle}>{book.title}</Text>
              <Text style={styles.cardDetail}>{isReadable ? 'Tap to read together and discover words.' : 'A shelf preview. Activities are not available yet.'}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: 40, paddingTop: 30 },
  header: { marginBottom: 12, paddingHorizontal: 24 },
  eyebrow: { color: '#285842', fontSize: 13, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: '#173b2b', fontSize: 42, fontWeight: '800', letterSpacing: -1.2, marginTop: 10 },
  intro: { color: '#4e6254', fontSize: 17, lineHeight: 25, marginBottom: 28, marginTop: 12 },
  shelfLabel: { color: '#285842', fontSize: 14, fontWeight: '800', letterSpacing: 1.1, marginBottom: 12 },
  parentSection: { backgroundColor: '#e8f3d8', borderColor: '#a4be79', borderRadius: 18, borderWidth: 1, marginBottom: 24, padding: 16 },
  parentSectionTitle: { color: '#173b2b', fontSize: 18, fontWeight: '800' },
  parentSectionDetail: { color: '#4e6254', fontSize: 14, lineHeight: 20, marginTop: 3 },
  parentActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  parentAction: { backgroundColor: '#fff9ed', borderColor: '#a4be79', borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  familyAction: { backgroundColor: '#f3b84d', borderColor: '#b47514' },
  parentActionText: { color: '#173b2b', fontSize: 14, fontWeight: '800' },
  parentGuideLink: { marginTop: 14, paddingVertical: 4 },
  parentGuideLinkText: { color: '#285842', fontSize: 14, fontWeight: '700' },
  shelfRow: { gap: 14, paddingHorizontal: 24 },
  card: { borderRadius: 22, minHeight: 158, padding: 22, shadowColor: '#173b2b', shadowOpacity: 0.12, shadowOffset: { width: 0, height: 5 }, shadowRadius: 8, elevation: 3, width: 210 },
  preview: { opacity: 0.72 }, pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  status: { color: '#fff9ed', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  cardTitle: { color: '#fffdf8', fontSize: 27, fontWeight: '800', lineHeight: 32, marginTop: 12 },
  cardDetail: { color: '#fffdf8', fontSize: 15, lineHeight: 21, marginTop: 8 },
  green: { backgroundColor: '#4b8967' }, blue: { backgroundColor: '#8197c6' }, rose: { backgroundColor: '#d28c83' }, gold: { backgroundColor: '#c69d5a' },
});
const covers = [styles.green, styles.blue, styles.rose, styles.gold];
