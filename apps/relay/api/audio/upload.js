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
 * True private access (confirmed available in @vercel/blob 2.8.0, not just public-
 * with-an-unguessable-URL as originally assumed when this file was drafted): the
 * blob requires BLOB_READ_WRITE_TOKEN to read at all, on top of never returning the
 * URL to any client and routing every read through api/audio/[messageId].js.
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
    access: 'private',
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
