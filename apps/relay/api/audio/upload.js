const crypto = require('crypto');
const { put } = require('@vercel/blob');
const store = require('../../lib/store');
const { verifyDeviceAuth } = require('../../lib/auth');
const { readRawBody, MAX_AUDIO_BYTES } = require('../../lib/rate-limit');

/**
 * POST /api/audio/upload?fromDeviceId=...&toDeviceId=...&bookId=...&pageIndex=...
 * (raw audio bytes as body) -> { messageId, expiresInSeconds }
 *
 * Requires Authorization for fromDeviceId. The body is raw bytes, not JSON, so
 * metadata travels as query params rather than a JSON envelope.
 *
 * packet-m011 addition: bookId/pageIndex tie a recording to a specific page, and
 * createdAt is stored so GET /api/audio/pending/:deviceId can list/sort what's
 * waiting for a device without downloading any audio — the discovery mechanism
 * the original packet-m009 design didn't have (it assumed a caller already knew
 * a specific messageId).
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
  const bookId = decodeURIComponent(String(req.query.bookId || ''));
  // Checked as a raw string before Number() coercion — independent verification
  // found Number('') and Number('   ') both coerce to 0, which then passes
  // Number.isInteger(0) && 0 >= 0, silently accepting an empty/whitespace
  // pageIndex as page 0 instead of rejecting it.
  const rawPageIndex = req.query.pageIndex;
  const pageIndexProvided = typeof rawPageIndex === 'string' && rawPageIndex.trim() !== '';
  const pageIndex = pageIndexProvided ? Number(rawPageIndex) : NaN;
  if (!fromDeviceId || !toDeviceId) {
    return store.sendJson(res, 400, { error: 'fromDeviceId and toDeviceId query params required' });
  }
  if (!bookId) return store.sendJson(res, 400, { error: 'bookId query param required' });
  if (!pageIndexProvided || !Number.isInteger(pageIndex) || pageIndex < 0) {
    return store.sendJson(res, 400, { error: 'pageIndex query param required and must be a non-negative integer' });
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
    bookId,
    pageIndex,
    blobUrl: blob.url,
    createdAt: Date.now(),
    expiresAt: Date.now() + store.AUDIO_RETENTION_SECONDS * 1000,
    delivered: false,
  });
  await store.addAudioPending(toDeviceId, messageId);

  return store.sendJson(res, 200, { messageId, expiresInSeconds: store.AUDIO_RETENTION_SECONDS });
};
