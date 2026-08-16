const { get, del } = require('@vercel/blob');
const { buffer } = require('node:stream/consumers');
const store = require('../../lib/store');
const { verifyDeviceAuth } = require('../../lib/auth');

/**
 * GET /api/audio/:messageId -> raw audio bytes (application/octet-stream)
 * Requires Authorization for the metadata's toDeviceId. Delete-on-read: bytes and
 * metadata are removed the moment they're successfully delivered — TTL is the
 * backstop for undelivered audio (see api/cron/sweep-audio.js), not the primary
 * cleanup path. A second read of the same messageId 404s.
 */
module.exports = async function handler(req, res) {
  if (store.handlePreflight(req, res)) return;
  if (req.method !== 'GET') return store.sendJson(res, 405, { error: 'Method not allowed' });

  const messageId = decodeURIComponent(String(req.query.messageId || ''));
  if (!messageId) return store.sendJson(res, 400, { error: 'messageId required' });

  const meta = await store.getAudioMeta(messageId);
  if (!meta || meta.delivered) return store.sendJson(res, 404, { error: 'Not found or already delivered' });

  const authed = await verifyDeviceAuth(req, meta.toDeviceId);
  if (!authed) return store.sendJson(res, 401, { error: 'Missing or invalid token for the recipient device' });

  let bytes;
  try {
    const result = await get(meta.blobUrl, { access: 'private' });
    if (!result || !result.stream) return store.sendJson(res, 404, { error: 'Audio no longer available' });
    bytes = await buffer(result.stream);
  } catch {
    return store.sendJson(res, 502, { error: 'Could not retrieve audio' });
  }

  await del(meta.blobUrl).catch(() => {});
  await store.deleteAudioMeta(messageId);
  await store.removeAudioPending(meta.toDeviceId, messageId);

  store.applyCors(res);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.status(200).send(bytes);
};
