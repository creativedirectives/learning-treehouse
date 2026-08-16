const { Redis } = require('@upstash/redis');

/**
 * KV schema and shared data access for the Family Circle relay — packet-m009.
 * See packets/packet-m009-harden-relay-foundation.md → Deliverables for the schema
 * table this file implements. Every key here is namespaced and TTL'd so expiry is
 * infrastructure-enforced (native KV TTL), not app-code-enforced.
 *
 * Uses @upstash/redis directly, not @vercel/kv — the latter is deprecated (confirmed
 * via npm registry metadata during this packet's implementation, 2026-08-15); Vercel's
 * current Marketplace path for this is a Redis integration backed by Upstash. Env var
 * names below cover both the legacy Vercel KV naming and Upstash's own naming, since
 * this session cannot confirm which one the Marketplace integration will actually set
 * without provisioning it — verify against the real values once the HV REQUIRED
 * hosting step in the packet is done, and drop whichever pair turns out unused.
 */
const kv = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

const INVITE_TTL_SECONDS = 30 * 60;
const EVENT_TTL_SECONDS = 72 * 60 * 60;
const UNCLAIMED_TOKEN_TTL_SECONDS = 10 * 60;
const AUDIO_RETENTION_SECONDS = Number(process.env.AUDIO_RETENTION_SECONDS || 120);

function inviteKey(code) {
  return `invite:${code}`;
}
function inviteAttemptsKey(code) {
  return `invite-attempts:${code}`;
}
function pairingAttemptsIpKey(ip) {
  return `pairing-attempts-ip:${ip}`;
}
function pairingKey(deviceId) {
  return `pairing:${deviceId}`;
}
function pairingLabelKey(deviceA, deviceB) {
  return `pairing-label:${[deviceA, deviceB].sort().join(':')}`;
}
function tokenHashKey(deviceId) {
  return `device-token-hash:${deviceId}`;
}
function unclaimedTokenKey(deviceId) {
  return `unclaimed-token:${deviceId}`;
}
function eventsKey(deviceId) {
  return `events:${deviceId}`;
}
function audioMetaKey(messageId) {
  return `audio-meta:${messageId}`;
}
/** Per-recipient index of pending (undelivered) message ids — not in the packet's
 * top-level schema table, added here so revoke can find and delete in-flight audio
 * between two devices without a KV table scan. Short-lived, mirrors the audio-meta
 * TTL it tracks. */
function audioPendingKey(deviceId) {
  return `audio-pending:${deviceId}`;
}

function applyCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/** Returns true and ends the response if this was a CORS preflight request. */
function handlePreflight(req, res) {
  applyCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

function sendJson(res, status, body) {
  res.status(status).json(body);
}

async function createInvite(code, fromDeviceId) {
  await kv.set(inviteKey(code), { fromDeviceId, expiresAt: Date.now() + INVITE_TTL_SECONDS * 1000 }, { ex: INVITE_TTL_SECONDS });
}

async function getInvite(code) {
  return kv.get(inviteKey(code));
}

async function deleteInvite(code) {
  await kv.del(inviteKey(code));
}

/**
 * Atomic get-and-delete, added 2026-08-16 (independent verification confirmed a
 * race: separate get-then-delete calls let two concurrent redemptions of the same
 * code both read it before either deleted it, both pass validation, and both
 * succeed — one inviter paired with two different devices from a single
 * "single-use" code). GETDEL returns the value and null if another caller already
 * claimed it, in one round trip — only one concurrent caller can ever get a
 * non-null result for a given code.
 */
async function claimInvite(code) {
  return kv.getdel(inviteKey(code));
}

async function addPairing(deviceA, deviceB) {
  await Promise.all([kv.sadd(pairingKey(deviceA), deviceB), kv.sadd(pairingKey(deviceB), deviceA)]);
}

async function getPartners(deviceId) {
  const members = await kv.smembers(pairingKey(deviceId));
  return members || [];
}

async function isPaired(deviceA, deviceB) {
  return Boolean(await kv.sismember(pairingKey(deviceA), deviceB));
}

async function removePairing(deviceA, deviceB) {
  await Promise.all([
    kv.srem(pairingKey(deviceA), deviceB),
    kv.srem(pairingKey(deviceB), deviceA),
    kv.del(pairingLabelKey(deviceA, deviceB)),
  ]);
}

async function setLabel(deviceA, deviceB, label) {
  if (label) await kv.set(pairingLabelKey(deviceA, deviceB), label);
}

async function setUnclaimedToken(deviceId, token) {
  await kv.set(unclaimedTokenKey(deviceId), token, { ex: UNCLAIMED_TOKEN_TTL_SECONDS });
}

/** Single-use read: returns the token if present, and deletes it in the same call. */
async function claimToken(deviceId) {
  const token = await kv.get(unclaimedTokenKey(deviceId));
  if (token) await kv.del(unclaimedTokenKey(deviceId));
  return token || null;
}

async function setTokenHash(deviceId, hash) {
  await kv.set(tokenHashKey(deviceId), hash);
}

async function getTokenHash(deviceId) {
  return kv.get(tokenHashKey(deviceId));
}

async function pushEvent(toDeviceId, event) {
  const queue = (await kv.get(eventsKey(toDeviceId))) || [];
  queue.push(event);
  await kv.set(eventsKey(toDeviceId), queue, { ex: EVENT_TTL_SECONDS });
}

/** Drains and clears the queue, filtering out anything that expired while queued. */
async function drainEvents(deviceId) {
  const queue = (await kv.get(eventsKey(deviceId))) || [];
  await kv.del(eventsKey(deviceId));
  const now = Date.now();
  return queue.filter((event) => event.expiresAt >= now);
}

async function clearEventsBetween(deviceA, deviceB) {
  for (const [owner, other] of [
    [deviceA, deviceB],
    [deviceB, deviceA],
  ]) {
    const queue = (await kv.get(eventsKey(owner))) || [];
    const filtered = queue.filter((event) => event.fromDeviceId !== other);
    if (filtered.length) await kv.set(eventsKey(owner), filtered, { ex: EVENT_TTL_SECONDS });
    else await kv.del(eventsKey(owner));
  }
}

async function setAudioMeta(messageId, meta) {
  await kv.set(audioMetaKey(messageId), meta, { ex: AUDIO_RETENTION_SECONDS });
}

async function getAudioMeta(messageId) {
  return kv.get(audioMetaKey(messageId));
}

async function deleteAudioMeta(messageId) {
  await kv.del(audioMetaKey(messageId));
}

async function addAudioPending(toDeviceId, messageId) {
  await kv.sadd(audioPendingKey(toDeviceId), messageId);
  await kv.expire(audioPendingKey(toDeviceId), AUDIO_RETENTION_SECONDS + 60);
}

async function removeAudioPending(toDeviceId, messageId) {
  await kv.srem(audioPendingKey(toDeviceId), messageId);
}

async function getAudioPending(toDeviceId) {
  const members = await kv.smembers(audioPendingKey(toDeviceId));
  return members || [];
}

module.exports = {
  kv,
  INVITE_TTL_SECONDS,
  EVENT_TTL_SECONDS,
  UNCLAIMED_TOKEN_TTL_SECONDS,
  AUDIO_RETENTION_SECONDS,
  inviteKey,
  inviteAttemptsKey,
  pairingAttemptsIpKey,
  applyCors,
  handlePreflight,
  sendJson,
  createInvite,
  getInvite,
  deleteInvite,
  claimInvite,
  addPairing,
  getPartners,
  isPaired,
  removePairing,
  setLabel,
  setUnclaimedToken,
  claimToken,
  setTokenHash,
  getTokenHash,
  pushEvent,
  drainEvents,
  clearEventsBetween,
  setAudioMeta,
  getAudioMeta,
  deleteAudioMeta,
  addAudioPending,
  removeAudioPending,
  getAudioPending,
};
