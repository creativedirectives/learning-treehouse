const crypto = require('crypto');
const store = require('../lib/store');
const { verifyDeviceAuth } = require('../lib/auth');
const { parseJsonBody, MAX_JSON_BYTES } = require('../lib/rate-limit');

/**
 * POST /api/events — { fromDeviceId, toDeviceId, type, payload? } -> { queued: true }
 * Requires Authorization for fromDeviceId. Devices must be paired. Same
 * delivered-or-expire event queue behavior as the frozen apps/relay/server.js
 * reference, now authenticated and body-capped.
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

  if (!body.fromDeviceId || !body.toDeviceId || !body.type) {
    return store.sendJson(res, 400, { error: 'fromDeviceId, toDeviceId, type required' });
  }

  const authed = await verifyDeviceAuth(req, body.fromDeviceId);
  if (!authed) return store.sendJson(res, 401, { error: 'Missing or invalid token for fromDeviceId' });

  const paired = await store.isPaired(body.fromDeviceId, body.toDeviceId);
  if (!paired) return store.sendJson(res, 403, { error: 'Devices are not paired' });

  const event = {
    id: crypto.randomUUID(),
    fromDeviceId: body.fromDeviceId,
    type: body.type,
    payload: body.payload ?? null,
    expiresAt: Date.now() + store.EVENT_TTL_SECONDS * 1000,
  };
  await store.pushEvent(body.toDeviceId, event);

  return store.sendJson(res, 200, { queued: true });
};
