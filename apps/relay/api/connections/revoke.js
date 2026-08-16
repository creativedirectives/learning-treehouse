const { del } = require('@vercel/blob');
const store = require('../../lib/store');
const { verifyDeviceAuth } = require('../../lib/auth');
const { parseJsonBody, MAX_JSON_BYTES } = require('../../lib/rate-limit');

/**
 * POST /api/connections/revoke — { deviceId, partnerId } -> { revoked: true }
 * "Remove connection" server-side support (DECISION_LOG.md, v1 revocation).
 * Requires Authorization for deviceId. Deletes the pairing on both sides plus any
 * in-flight text events and pending audio between the two devices. Idempotent: safe
 * to call even if the pairing no longer exists. Does NOT revoke either device's own
 * token — a token is a per-device credential (see api/pairings.js), and either
 * device may still be paired with other family members after this call. The
 * confirmation dialog and the client call itself are packet-m010.
 */
module.exports = async function handler(req, res) {
  if (store.handlePreflight(req, res)) return;
  if (req.method !== 'POST') return store.sendJson(res, 405, { error: 'Method not allowed' });

  let body;
  try {
    body = await parseJsonBody(req, MAX_JSON_BYTES);
  } catch (err) {
    return store.sendJson(res, err.statusCode || 400, { error: 'Invalid request body' });
  }

  if (!body.deviceId || !body.partnerId) {
    return store.sendJson(res, 400, { error: 'deviceId and partnerId required' });
  }

  const authed = await verifyDeviceAuth(req, body.deviceId);
  if (!authed) return store.sendJson(res, 401, { error: 'Missing or invalid token for deviceId' });

  await store.removePairing(body.deviceId, body.partnerId);
  await store.clearEventsBetween(body.deviceId, body.partnerId);
  await clearAudioBetween(body.deviceId, body.partnerId);

  return store.sendJson(res, 200, { revoked: true });
};

async function clearAudioBetween(deviceA, deviceB) {
  for (const [owner, other] of [
    [deviceA, deviceB],
    [deviceB, deviceA],
  ]) {
    const pendingIds = await store.getAudioPending(owner);
    for (const messageId of pendingIds) {
      const meta = await store.getAudioMeta(messageId);
      if (!meta || meta.fromDeviceId !== other) continue;
      await del(meta.blobUrl).catch(() => {});
      await store.deleteAudioMeta(messageId);
      await store.removeAudioPending(owner, messageId);
    }
  }
}
