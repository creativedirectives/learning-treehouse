import { books } from '@learning-treehouse/book-model';
import type { Book } from '@learning-treehouse/book-model';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { BookReader } from './src/features/reader/book-reader';
import { ParentGuide } from './src/features/parent/parent-guide';
import { SpellingBee } from './src/features/practice/spelling-bee';
import { ConnectScreen } from './src/features/read-together/connect-screen';
import { readTogetherDemoBook } from './src/features/read-together/demo-book';
import { getOrCreateDeviceId } from './src/features/read-together/device-id';
import { ReadTogether } from './src/features/read-together/read-together';
import { RealReadTogether } from './src/features/read-together/real-read-together';
import { createRealReadTogetherChannel, type RealReadTogetherChannel } from './src/features/read-together/real-channel';
import { BookShelf } from './src/features/shelf/book-shelf';

export default function App() {
  const [openBook, setOpenBook] = useState<Book | null>(null);
  const [screen, setScreen] = useState<'shelf' | 'parent-guide' | 'reader' | 'spelling-bee' | 'read-together' | 'connect' | 'read-together-real'>('shelf');
  const [realChannel, setRealChannel] = useState<RealReadTogetherChannel | null>(null);
  const [pairedCode, setPairedCode] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const maryBook = books.find((book) => book.id === 'mary-had-a-little-lamb' && book.availability === 'full');
  const shelfBooks = [books[0], readTogetherDemoBook, ...books.slice(1)];

  useEffect(() => {
    void getOrCreateDeviceId().then(setDeviceId);
  }, []);

  function openReader(book: Book) {
    setOpenBook(book);
    setScreen('reader');
  }

  function returnToShelf() {
    setOpenBook(null);
    setScreen('shelf');
  }

  function openSpellingBee(book: Book) {
    setOpenBook(book);
    setScreen('spelling-bee');
  }

  function openReadTogether() {
    setOpenBook(readTogetherDemoBook);
    setScreen('read-together');
  }

  function returnToParentGuide() {
    setScreen('parent-guide');
  }

  function openConnect() {
    setScreen('connect');
  }

  function handlePaired({ serverUrl, partnerId, code }: { serverUrl: string; partnerId: string; code: string }) {
    if (!deviceId) return;
    setOpenBook(readTogetherDemoBook);
    setRealChannel(createRealReadTogetherChannel({ serverUrl, deviceId, partnerId }));
    setPairedCode(code);
    setScreen('read-together-real');
  }

  return (
    <SafeAreaView style={styles.container}>
      {screen === 'reader' && openBook ? (
        <BookReader book={openBook} onBackToShelf={returnToShelf} onStartSpelling={() => openSpellingBee(openBook)} />
      ) : screen === 'spelling-bee' && openBook ? (
        <SpellingBee book={openBook} onBackToGuide={returnToParentGuide} onBackToShelf={returnToShelf} />
      ) : screen === 'read-together' && openBook ? (
        <ReadTogether book={openBook} onBackToGuide={returnToParentGuide} onBackToShelf={returnToShelf} />
      ) : screen === 'connect' && deviceId ? (
        <ConnectScreen deviceId={deviceId} onPaired={handlePaired} onBackToShelf={returnToShelf} />
      ) : screen === 'read-together-real' && openBook && realChannel ? (
        <RealReadTogether book={openBook} channel={realChannel} code={pairedCode} onBackToShelf={returnToShelf} />
      ) : screen === 'parent-guide' && maryBook ? (
        <ParentGuide
          book={maryBook}
          onBackToShelf={returnToShelf}
          onStartReading={() => openReader(maryBook)}
          onStartSpelling={() => openSpellingBee(maryBook)}
          onStartReadTogether={openReadTogether}
        />
      ) : (
        <BookShelf
          books={shelfBooks}
          onOpenBook={openReader}
          onOpenParentGuide={() => setScreen('parent-guide')}
          onStartReading={() => maryBook && openReader(maryBook)}
          onStartSpelling={() => maryBook && openSpellingBee(maryBook)}
          onStartReadTogether={openReadTogether}
          onConnectFamily={openConnect}
        />
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
