const crypto = require('crypto');
const { put } = require('@vercel/blob');
const store = require('../../lib/store');
const { verifyDeviceAuth } = require('../../lib/auth');
const { readRawBody, MAX_AUDIO_BYTES } = require('../../lib/rate-limit');

/**
 * POST /api/audio/upload?fromDeviceId=...&toDeviceId=... (raw audio bytes as body)
 * -> { messageId, expiresInSeconds }
 *
 * Foundation only — no caller exists yet in this packet (packet-m012 builds the
 * voice-message feature that uses this). Requires Authorization for fromDeviceId.
 * The body is raw bytes, not JSON, so from/to travel as query params rather than a
 * JSON envelope — kept intentionally simple since no client contract is locked yet.
 *
 * "Private" per DECISION_LOG.md means the URL is never returned to any client and
 * every read goes through api/audio/[messageId].js. @vercel/blob's `put` currently
 * only supports access: 'public' (an unguessable per-object URL, not a public
 * listing) — treated as private-by-convention here, not access-controlled by the
 * platform. Flag this at implementation-verification time if the SDK has since
 * added true private access.
 */
module.exports = async function handler(req, res) {
  if (store.handlePreflight(req, res)) return;
  if (req.method !== 'POST') return store.sendJson(res, 405, { error: 'Method not allowed' });

  const fromDeviceId = decodeURIComponent(String(req.query.fromDeviceId || ''));
  const toDeviceId = decodeURIComponent(String(req.query.toDeviceId || ''));
  if (!fromDeviceId || !toDeviceId) {
    return store.sendJson(res, 400, { error: 'fromDeviceId and toDeviceId query params required' });
  }

  const authed = await verifyDeviceAuth(req, fromDeviceId);
  if (!authed) return store.sendJson(res, 401, { error: 'Missing or invalid token for fromDeviceId' });

  const paired = await store.isPaired(fromDeviceId, toDeviceId);
  if (!paired) return store.sendJson(res, 403, { error: 'Devices are not paired' });

  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > MAX_AUDIO_BYTES) {
    return store.sendJson(res, 413, { error: 'Audio payload too large' });
  }

  let bytes;
  try {
    bytes = await readRawBody(req, MAX_AUDIO_BYTES);
  } catch (err) {
    return store.sendJson(res, err.statusCode || 400, { error: 'Audio payload too large' });
  }
  if (!bytes.length) return store.sendJson(res, 400, { error: 'Empty upload' });

  const messageId = crypto.randomUUID();
  const blob = await put(`audio/${messageId}`, bytes, {
    access: 'public',
    contentType: req.headers['content-type'] || 'application/octet-stream',
  });

  await store.setAudioMeta(messageId, {
    fromDeviceId,
    toDeviceId,
    blobUrl: blob.url,
    expiresAt: Date.now() + store.AUDIO_RETENTION_SECONDS * 1000,
    delivered: false,
  });
  await store.addAudioPending(toDeviceId, messageId);

  return store.sendJson(res, 200, { messageId, expiresInSeconds: store.AUDIO_RETENTION_SECONDS });
};
