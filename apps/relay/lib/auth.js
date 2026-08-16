const crypto = require('crypto');
const store = require('./store');

/**
 * Per-device token auth — packet-m009. A token is generated once, at pairing time,
 * per device; only its sha256 hash is ever stored server-side. See the packet's
 * "Token bootstrap" section for how a device first receives its token.
 */

function generateToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function timingSafeEqualHex(a, b) {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function extractBearerToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token || null;
}

/** True only if the request carries a valid, matching token for this exact deviceId. */
async function verifyDeviceAuth(req, deviceId) {
  const token = extractBearerToken(req);
  if (!token || !deviceId) return false;
  const storedHash = await store.getTokenHash(deviceId);
  if (!storedHash) return false;
  return timingSafeEqualHex(hashToken(token), storedHash);
}

module.exports = { generateToken, hashToken, extractBearerToken, verifyDeviceAuth };
