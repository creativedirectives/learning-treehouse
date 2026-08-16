const crypto = require('crypto');
const store = require('../lib/store');
const { parseJsonBody, MAX_JSON_BYTES } = require('../lib/rate-limit');

/**
 * POST /api/invites — { deviceId } -> { code, expiresInMinutes }
 * No auth: nothing exists to protect before a pairing does. Code shape (24-bit hex)
 * is unchanged from the frozen apps/relay/server.js reference — throttling on
 * redemption (api/pairings.js), not code width, is the fix for audit-001.
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

  if (!body.deviceId) return store.sendJson(res, 400, { error: 'deviceId required' });

  const code = crypto.randomBytes(3).toString('hex').toUpperCase();
  await store.createInvite(code, body.deviceId);

  return store.sendJson(res, 200, { code, expiresInMinutes: store.INVITE_TTL_SECONDS / 60 });
};
