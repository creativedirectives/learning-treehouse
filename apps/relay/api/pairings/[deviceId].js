const store = require('../../lib/store');

/**
 * GET /api/pairings/:deviceId -> { partners, token? }
 * No auth: this is the inviter's poll loop while waiting for a partner, called
 * before the inviter has any token. The moment a not-yet-claimed token exists for
 * this device (set by api/pairings.js on a successful redemption elsewhere), it is
 * drained and returned exactly once here — single-use, mirrors invite-burn. After
 * that first drain, repeat calls (including a guess of this deviceId by anyone else)
 * get partners only, never a token.
 */
module.exports = async function handler(req, res) {
  if (store.handlePreflight(req, res)) return;
  if (req.method !== 'GET') return store.sendJson(res, 405, { error: 'Method not allowed' });

  const deviceId = decodeURIComponent(String(req.query.deviceId || ''));
  if (!deviceId) return store.sendJson(res, 400, { error: 'deviceId required' });

  const partners = await store.getPartners(deviceId);
  const token = await store.claimToken(deviceId);

  return store.sendJson(res, 200, token ? { partners, token } : { partners });
};
