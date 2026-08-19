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
import { PageRecorder } from './src/features/read-together/page-recorder';
import { clearStoredPartnerId, getStoredPartnerId, setStoredPartnerId } from './src/features/read-together/partner-store';
import { ReadTogether } from './src/features/read-together/read-together';
import { RealReadTogether } from './src/features/read-together/real-read-together';
import { createRealReadTogetherChannel, type RealReadTogetherChannel } from './src/features/read-together/real-channel';
import { clearStoredToken, getStoredToken } from './src/features/read-together/token-store';
import { BookShelf } from './src/features/shelf/book-shelf';

/**
 * packet-m012: matches connect-screen.tsx's DEFAULT_RELAY_URL. Duplicated
 * rather than imported/exported to keep this packet's edits to exactly the
 * files it scoped — connect-screen.tsx isn't touched here.
 */
const RELAY_URL = 'https://learning-treehouse-relay.vercel.app';

export default function App() {
  const [openBook, setOpenBook] = useState<Book | null>(null);
  const [screen, setScreen] = useState<'shelf' | 'parent-guide' | 'reader' | 'spelling-bee' | 'read-together' | 'connect' | 'read-together-real' | 'page-recorder'>('shelf');
  const [realChannel, setRealChannel] = useState<RealReadTogetherChannel | null>(null);
  const [pairedCode, setPairedCode] = useState<string | null>(null);
  const [pairedPartnerId, setPairedPartnerId] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [storedToken, setStoredTokenState] = useState<string | null>(null);
  const maryBook = books.find((book) => book.id === 'mary-had-a-little-lamb' && book.availability === 'full');
  const shelfBooks = [books[0], readTogetherDemoBook, ...books.slice(1)];

  useEffect(() => {
    void getOrCreateDeviceId().then(setDeviceId);
    // packet-m012: loads whatever token a prior pairing already stored, so the
    // "record a message" / "someone left you a message" features work on
    // return visits without needing to pair again this session.
    void getStoredToken().then(setStoredTokenState);
    // Correction, same packet: pairedPartnerId used to live only in this
    // component's state, so it was lost on every relaunch — the "Record a
    // message" entry point silently vanished for an already-paired returning
    // user even though their token (and therefore incoming messages) still
    // worked fine. Restoring it here mirrors the token's own restore above.
    void getStoredPartnerId().then(setPairedPartnerId);
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

  async function handlePaired({ serverUrl, partnerId, code, token }: { serverUrl: string; partnerId: string; code: string; token: string | null }) {
    if (!deviceId) return;
    const effectiveToken = token ?? (await getStoredToken());
    if (!effectiveToken) {
      // Shouldn't happen in the normal flow — connect-screen.tsx always stores a
      // token before calling onPaired. Defensive only: bounce back rather than
      // construct a channel with no credential.
      setScreen('connect');
      return;
    }
    setStoredTokenState(effectiveToken);
    setPairedPartnerId(partnerId);
    void setStoredPartnerId(partnerId);
    setOpenBook(readTogetherDemoBook);
    setRealChannel(
      createRealReadTogetherChannel({
        serverUrl,
        deviceId,
        partnerId,
        token: effectiveToken,
        onAuthError: () => {
          // Flagged during packet-m012 verification: this used to clear only
          // the token, leaving a stale pairedPartnerId (and therefore a live
          // "Record a message" button) around after a revoke-from-the-other-
          // side made that token unusable. A device revoked out from under it
          // has nothing valid left to record for.
          void clearStoredToken();
          void clearStoredPartnerId();
          setStoredTokenState(null);
          setPairedPartnerId(null);
          setRealChannel(null);
          setScreen('connect');
        },
      }),
    );
    setPairedCode(code);
    setScreen('read-together-real');
  }

  function handleRevoked() {
    setRealChannel(null);
    setPairedCode(null);
    setPairedPartnerId(null);
    void clearStoredPartnerId();
    setOpenBook(null);
    setScreen('shelf');
  }

  function openPageRecorder() {
    setScreen('page-recorder');
  }

  return (
    <SafeAreaView style={styles.container}>
      {screen === 'reader' && openBook ? (
        <BookReader
          book={openBook}
          onBackToShelf={returnToShelf}
          onStartSpelling={() => openSpellingBee(openBook)}
          deviceId={deviceId ?? undefined}
          token={storedToken ?? undefined}
          serverUrl={RELAY_URL}
          partnerId={pairedPartnerId ?? undefined}
          onRecordForPartner={pairedPartnerId ? openPageRecorder : undefined}
        />
      ) : screen === 'page-recorder' && openBook && deviceId && pairedPartnerId && storedToken ? (
        <PageRecorder
          book={openBook}
          deviceId={deviceId}
          partnerId={pairedPartnerId}
          serverUrl={RELAY_URL}
          token={storedToken}
          onDone={() => setScreen('reader')}
        />
      ) : screen === 'spelling-bee' && openBook ? (
        <SpellingBee book={openBook} onBackToGuide={returnToParentGuide} onBackToShelf={returnToShelf} />
      ) : screen === 'read-together' && openBook ? (
        <ReadTogether book={openBook} onBackToGuide={returnToParentGuide} onBackToShelf={returnToShelf} />
      ) : screen === 'connect' && deviceId ? (
        <ConnectScreen deviceId={deviceId} onPaired={handlePaired} onBackToShelf={returnToShelf} />
      ) : screen === 'read-together-real' && openBook && realChannel ? (
        <RealReadTogether book={openBook} channel={realChannel} code={pairedCode} onBackToShelf={returnToShelf} onRevoked={handleRevoked} />
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
