import { books } from '@learning-treehouse/book-model';
import type { Book } from '@learning-treehouse/book-model';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { BookReader } from './src/features/reader/book-reader';
import { ParentGuide } from './src/features/parent/parent-guide';
import { BookShelf } from './src/features/shelf/book-shelf';

export default function App() {
  const [openBook, setOpenBook] = useState<Book | null>(null);
  const [screen, setScreen] = useState<'shelf' | 'parent-guide' | 'reader'>('shelf');
  const maryBook = books.find((book) => book.id === 'mary-had-a-little-lamb' && book.availability === 'full');

  function openReader(book: Book) {
    setOpenBook(book);
    setScreen('reader');
  }

  function returnToShelf() {
    setOpenBook(null);
    setScreen('shelf');
  }

  return (
    <SafeAreaView style={styles.container}>
      {screen === 'reader' && openBook ? (
        <BookReader book={openBook} onBackToShelf={returnToShelf} />
      ) : screen === 'parent-guide' && maryBook ? (
        <ParentGuide book={maryBook} onBackToShelf={returnToShelf} onStartReading={() => openReader(maryBook)} />
      ) : (
        <BookShelf books={books} onOpenBook={openReader} onOpenParentGuide={() => setScreen('parent-guide')} />
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
