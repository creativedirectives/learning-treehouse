import type { Book } from '@learning-treehouse/book-model';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { readonly books: readonly Book[]; readonly onOpenBook: (book: Book) => void; };

export function BookShelf({ books, onOpenBook }: Props) {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>YOUR COZY READING TREEHOUSE</Text>
      <Text style={styles.title}>Pick a book to begin</Text>
      <Text style={styles.intro}>Every book opens a new reading adventure. Read together and discover new words.</Text>
      <Text style={styles.shelfLabel}>THE BOOK SHELF</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={books}
        keyExtractor={(book) => book.id}
        renderItem={({ item: book, index }) => {
          const isReadable = book.availability === 'full';
          return (
            <Pressable accessibilityRole={isReadable ? 'button' : undefined} accessibilityState={{ disabled: !isReadable }} disabled={!isReadable} onPress={() => onOpenBook(book)} style={({ pressed }) => [styles.card, covers[index % covers.length], !isReadable && styles.preview, pressed && isReadable && styles.pressed]}>
              <Text style={styles.status}>{isReadable ? 'READY TO READ' : 'PREVIEW · READ-ONLY'}</Text>
              <Text style={styles.cardTitle}>{book.title}</Text>
              <Text style={styles.cardDetail}>{isReadable ? 'Tap to read together and discover words.' : 'A shelf preview. Activities are not available yet.'}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, paddingTop: 30 },
  eyebrow: { color: '#285842', fontSize: 13, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: '#173b2b', fontSize: 42, fontWeight: '800', letterSpacing: -1.2, marginTop: 10 },
  intro: { color: '#4e6254', fontSize: 17, lineHeight: 25, marginBottom: 28, marginTop: 12 },
  shelfLabel: { color: '#285842', fontSize: 14, fontWeight: '800', letterSpacing: 1.1, marginBottom: 12 },
  list: { gap: 14, paddingBottom: 40 },
  card: { borderRadius: 22, minHeight: 158, padding: 22, shadowColor: '#173b2b', shadowOpacity: 0.12, shadowOffset: { width: 0, height: 5 }, shadowRadius: 8, elevation: 3 },
  preview: { opacity: 0.72 }, pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  status: { color: '#fff9ed', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  cardTitle: { color: '#fffdf8', fontSize: 27, fontWeight: '800', lineHeight: 32, marginTop: 12 },
  cardDetail: { color: '#fffdf8', fontSize: 15, lineHeight: 21, marginTop: 8 },
  green: { backgroundColor: '#4b8967' }, blue: { backgroundColor: '#8197c6' }, rose: { backgroundColor: '#d28c83' }, gold: { backgroundColor: '#c69d5a' },
});
const covers = [styles.green, styles.blue, styles.rose, styles.gold];
