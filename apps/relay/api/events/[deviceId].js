const store = require('../../lib/store');
const { verifyDeviceAuth } = require('../../lib/auth');

/**
 * GET /api/events/:deviceId -> { events }
 * Requires Authorization for deviceId — closes the audit-001 gap where a bare
 * deviceId guess was enough to read a device's queue. Drains and clears on read,
 * same delivered-or-expire behavior as before.
 */
module.exports = async function handler(req, res) {
  if (store.handlePreflight(req, res)) return;
  if (req.method !== 'GET') return store.sendJson(res, 405, { error: 'Method not allowed' });

  const deviceId = decodeURIComponent(String(req.query.deviceId || ''));
  if (!deviceId) return store.sendJson(res, 400, { error: 'deviceId required' });

  const authed = await verifyDeviceAuth(req, deviceId);
  if (!authed) return store.sendJson(res, 401, { error: 'Missing or invalid token for this device' });

  const events = await store.drainEvents(deviceId);
  return store.sendJson(res, 200, { events });
};
