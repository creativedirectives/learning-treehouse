import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { setStoredToken } from './token-store';

type Props = {
  readonly deviceId: string;
  readonly onPaired: (params: { serverUrl: string; partnerId: string; code: string; token: string | null }) => void;
  readonly onBackToShelf: () => void;
};

/**
 * Prefilled with the deployed packet-m009 relay so this doesn't need typing on the
 * usual case. Left editable (not hardcoded) for testing against a different
 * deployment.
 */
const DEFAULT_RELAY_URL = 'https://learning-treehouse-relay.vercel.app';

async function postJson(url: string, body: unknown): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as Record<string, unknown>;
    return { ok: response.ok, data };
  } catch {
    return { ok: false, data: { error: 'Could not reach that server. Check the address and that both devices are on the same WiFi.' } };
  }
}

export function ConnectScreen({ deviceId, onPaired, onBackToShelf }: Props) {
  const [serverUrl, setServerUrl] = useState(DEFAULT_RELAY_URL);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [enteredCode, setEnteredCode] = useState('');
  const [status, setStatus] = useState('Enter the relay address running on your computer, then get a code or enter one.');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joinedPartnerId, setJoinedPartnerId] = useState<string | null>(null);

  const normalizedServerUrl = serverUrl.trim().replace(/\/$/, '');

  useEffect(() => {
    if (!inviteCode || joinedPartnerId) return;

    async function checkForPartner() {
      try {
        const response = await fetch(`${normalizedServerUrl}/api/pairings/${encodeURIComponent(deviceId)}`);
        if (!response.ok) return;
        const data = (await response.json()) as { partners?: readonly string[]; token?: string };
        const partnerId = data.partners?.[0];
        if (partnerId) {
          setJoinedPartnerId(partnerId);
          if (data.token) void setStoredToken(data.token);
          setStatus('Your family member joined! Tap below to start reading together.');
        }
      } catch {
        // Relay hiccup while waiting; the next tick tries again.
      }
    }

    const interval = setInterval(checkForPartner, 2000);
    return () => clearInterval(interval);
  }, [inviteCode, joinedPartnerId, normalizedServerUrl, deviceId]);

  function continueToReading() {
    if (!inviteCode || !joinedPartnerId) return;
    // token is null here deliberately — checkForPartner already stored it (if this
    // device didn't already have one) the moment the partner was detected.
    onPaired({ serverUrl: normalizedServerUrl, partnerId: joinedPartnerId, code: inviteCode, token: null });
  }

  async function getInviteCode() {
    if (!normalizedServerUrl) {
      setStatus('Enter the relay server address first.');
      return;
    }
    setBusy(true);
    const result = await postJson(`${normalizedServerUrl}/api/invites`, { deviceId });
    setBusy(false);
    if (!result.ok) {
      setStatus(String(result.data.error ?? 'Could not get an invite code.'));
      return;
    }
    setInviteCode(String(result.data.code));
    setJoinedPartnerId(null);
    setStatus('Share this code, then wait here. Once they join, a button appears below to continue.');
  }

  async function redeemCode() {
    if (!normalizedServerUrl || !enteredCode.trim()) {
      setStatus('Enter both the relay address and the code.');
      return;
    }
    setBusy(true);
    const result = await postJson(`${normalizedServerUrl}/api/pairings`, { code: enteredCode.trim(), deviceId, label: 'Family' });
    setBusy(false);
    if (!result.ok) {
      setStatus(String(result.data.error ?? 'Could not connect with that code.'));
      return;
    }
    const token = typeof result.data.token === 'string' ? result.data.token : null;
    if (token) await setStoredToken(token);
    onPaired({ serverUrl: normalizedServerUrl, partnerId: String(result.data.pairedWith), code: enteredCode.trim().toUpperCase(), token });
  }

  async function copyCode() {
    if (!inviteCode) return;
    await Clipboard.setStringAsync(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function pasteCode() {
    const text = await Clipboard.getStringAsync();
    if (text) setEnteredCode(text.trim());
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Pressable accessibilityRole="button" onPress={onBackToShelf} style={styles.back}>
        <Text style={styles.backText}>Back to shelf</Text>
      </Pressable>

      <Text style={styles.eyebrow}>FAMILY CIRCLE · CONNECT</Text>
      <Text style={styles.title}>Read together, for real</Text>
      <Text style={styles.intro}>
        One side gets a code, the other enters it.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Relay server address</Text>
        <TextInput
          accessibilityLabel="Relay server address"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setServerUrl}
          placeholder="http://192.168.1.23:4000"
          placeholderTextColor="#8a927d"
          style={styles.input}
          value={serverUrl}
        />

        <Text accessibilityLiveRegion="polite" style={styles.status}>
          {status}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Option A — get a code to share</Text>
        <Pressable accessibilityRole="button" disabled={busy} onPress={getInviteCode} style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}>
          <Text style={styles.primaryActionText}>Generate invite code</Text>
        </Pressable>
        {inviteCode ? (
          <View style={styles.inputRow}>
            <View style={[styles.input, styles.inputRowInput, styles.codeDisplayBox]}>
              <Text style={styles.codeDisplay}>{inviteCode}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Copy invite code"
              onPress={copyCode}
              style={({ pressed }) => [styles.iconButton, styles.inputRowButton, pressed && styles.pressed]}
            >
              <Text style={styles.iconButtonText}>{copied ? '✓' : '⧉'}</Text>
            </Pressable>
          </View>
        ) : null}
        {joinedPartnerId ? (
          <Pressable accessibilityRole="button" onPress={continueToReading} style={({ pressed }) => [styles.primaryAction, styles.continueAction, pressed && styles.pressed]}>
            <Text style={styles.primaryActionText}>Start reading together</Text>
          </Pressable>
        ) : null}
      </View>

      {joinedPartnerId ? null : (
      <View style={styles.card}>
        <Text style={styles.label}>Option B — enter a code you were sent</Text>
        <View style={styles.inputRow}>
          <TextInput
            accessibilityLabel="Invite code"
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={setEnteredCode}
            placeholder="e.g. 81EB81"
            placeholderTextColor="#8a927d"
            style={[styles.input, styles.inputRowInput]}
            value={enteredCode}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Paste invite code"
            onPress={pasteCode}
            style={({ pressed }) => [styles.squareButton, styles.inputRowButton, pressed && styles.pressed]}
          >
            <Text style={styles.squareButtonText}>Paste</Text>
          </Pressable>
        </View>
        <Pressable accessibilityRole="button" disabled={busy} onPress={redeemCode} style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}>
          <Text style={styles.secondaryActionText}>Connect with this code</Text>
        </Pressable>
      </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  back: { alignSelf: 'flex-start', marginBottom: 26, paddingVertical: 6 },
  backText: { color: '#285842', fontSize: 16, fontWeight: '700' },
  eyebrow: { color: '#285842', fontSize: 13, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#173b2b', fontSize: 30, fontWeight: '800', lineHeight: 36, marginTop: 8 },
  intro: { color: '#4e6254', fontSize: 15, lineHeight: 22, marginTop: 10 },
  card: { backgroundColor: '#fff9ed', borderColor: '#d6dbc8', borderRadius: 20, borderWidth: 1, marginTop: 18, padding: 18 },
  label: { color: '#173b2b', fontSize: 16, fontWeight: '800' },
  input: { backgroundColor: '#fffdf8', borderColor: '#a4be79', borderRadius: 14, borderWidth: 1, color: '#173b2b', fontSize: 16, fontWeight: '700', marginTop: 12, paddingHorizontal: 14, paddingVertical: 12 },
  status: { color: '#4e6254', fontSize: 14, lineHeight: 20, marginTop: 12 },
  primaryAction: { alignItems: 'center', backgroundColor: '#f3b84d', borderRadius: 18, marginTop: 12, paddingVertical: 13 },
  primaryActionText: { color: '#173b2b', fontSize: 15, fontWeight: '800' },
  secondaryAction: { alignItems: 'center', borderColor: '#285842', borderRadius: 18, borderWidth: 1, marginTop: 12, paddingVertical: 13 },
  secondaryActionText: { color: '#285842', fontSize: 15, fontWeight: '800' },
  continueAction: { marginTop: 14 },
  codeDisplayBox: { justifyContent: 'center' },
  codeDisplay: { color: '#173b2b', fontSize: 22, fontWeight: '800', letterSpacing: 4 },
  squareButton: { alignItems: 'center', backgroundColor: '#fff9ed', borderColor: '#a4be79', borderRadius: 10, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 },
  squareButtonText: { color: '#173b2b', fontSize: 11, fontWeight: '800' },
  iconButton: { alignItems: 'center', backgroundColor: '#173b2b', borderRadius: 10, height: 44, justifyContent: 'center', width: 44 },
  iconButtonText: { color: '#fff9ed', fontSize: 18, fontWeight: '800' },
  inputRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  inputRowInput: { flex: 1, marginTop: 0 },
  inputRowButton: { marginTop: 0 },
  pressed: { opacity: 0.8 },
});
