const { list, del } = require('@vercel/blob');
const store = require('../../lib/store');

/**
 * GET /api/cron/sweep-audio — Vercel Cron target, schedule in ../../vercel.json.
 * Blob has no per-object TTL, so this is the orphan sweep: any Blob object under
 * `audio/` whose KV metadata is already gone (expired via TTL, or already deleted
 * on delivery but the blob delete failed) gets deleted here.
 *
 * If CRON_SECRET is set (Vercel auto-sends it as this header for Cron-triggered
 * requests — see apps/relay/README.md), this rejects any call that doesn't carry
 * it, so the endpoint can't be triggered by hitting its public URL directly.
 */
module.exports = async function handler(req, res) {
  if (process.env.CRON_SECRET) {
    const expected = `Bearer ${process.env.CRON_SECRET}`;
    if (req.headers.authorization !== expected) {
      return store.sendJson(res, 401, { error: 'Unauthorized' });
    }
  }

  const { blobs } = await list({ prefix: 'audio/' });

  let swept = 0;
  for (const blob of blobs) {
    const messageId = blob.pathname.split('/')[1];
    if (!messageId) continue;
    const meta = await store.getAudioMeta(messageId);
    if (!meta) {
      await del(blob.url).catch(() => {});
      swept += 1;
    }
  }

  return store.sendJson(res, 200, { checked: blobs.length, swept });
};
