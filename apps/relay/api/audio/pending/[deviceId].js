const store = require('../../../lib/store');
const { verifyDeviceAuth } = require('../../../lib/auth');

/**
 * GET /api/audio/pending/:deviceId?bookId=... -> { pending: [{ messageId,
 * fromDeviceId, bookId, pageIndex, createdAt, expiresAt }] }
 *
 * packet-m011 — the discovery endpoint packet-m009's audio design didn't have:
 * lets a device ask "what's waiting for me" (optionally scoped to one book)
 * without downloading any audio bytes. Metadata only — blobUrl is deliberately
 * never included here, same as it's never given to a client anywhere else.
 *
 * Requires Authorization for deviceId. Reads the audio-pending index built in
 * packet-m009 (originally only used for revoke-time cleanup); any index entry
 * whose metadata has already expired is silently skipped rather than treated as
 * an error — TTL drift between the index and the metadata it points to is
 * expected, not a bug.
 */
module.exports = async function handler(req, res) {
  if (store.handlePreflight(req, res)) return;
  if (req.method !== 'GET') return store.sendJson(res, 405, { error: 'Method not allowed' });

  const deviceId = decodeURIComponent(String(req.query.deviceId || ''));
  if (!deviceId) return store.sendJson(res, 400, { error: 'deviceId required' });

  const authed = await verifyDeviceAuth(req, deviceId);
  if (!authed) return store.sendJson(res, 401, { error: 'Missing or invalid token for this device' });

  const bookIdFilter = req.query.bookId ? decodeURIComponent(String(req.query.bookId)) : null;

  const messageIds = await store.getAudioPending(deviceId);
  const entries = await Promise.all(messageIds.map((messageId) => store.getAudioMeta(messageId).then((meta) => ({ messageId, meta }))));

  const pending = entries
    .filter(({ meta }) => meta && !meta.delivered)
    .filter(({ meta }) => !bookIdFilter || meta.bookId === bookIdFilter)
    .map(({ messageId, meta }) => ({
      messageId,
      fromDeviceId: meta.fromDeviceId,
      bookId: meta.bookId,
      pageIndex: meta.pageIndex,
      createdAt: meta.createdAt,
      expiresAt: meta.expiresAt,
    }));

  return store.sendJson(res, 200, { pending });
};
