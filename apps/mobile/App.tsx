import { books } from '@learning-treehouse/book-model';
import type { Book } from '@learning-treehouse/book-model';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { BookReader } from './src/features/reader/book-reader';
import { BookShelf } from './src/features/shelf/book-shelf';

export default function App() {
  const [openBook, setOpenBook] = useState<Book | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      {openBook ? (
        <BookReader book={openBook} onBackToShelf={() => setOpenBook(null)} />
      ) : (
        <BookShelf books={books} onOpenBook={setOpenBook} />
      )}
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f3e8',
  },
});
