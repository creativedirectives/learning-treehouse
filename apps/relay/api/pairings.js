const store = require('../lib/store');
const { generateToken, hashToken } = require('../lib/auth');
const { parseJsonBody, MAX_JSON_BYTES, INVITE_ATTEMPT_CAP, IP_ATTEMPT_CAP, getClientIp, registerInviteAttempt, registerIpAttempt } = require('../lib/rate-limit');

/**
 * POST /api/pairings — { code, deviceId, label? } -> { pairedWith, token }
 * Redeems an invite. This is the endpoint audit-001 flagged: a 24-bit code with
 * unlimited guess attempts yielding a completed pairing. Two independent throttles
 * apply on every attempt, success or failure — see packet-m009 Deliverables.
 * Also the auth bootstrap: issues a token for both devices on success (see
 * lib/auth.js and api/pairings/[deviceId].js for the other half of the handshake).
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

  if (!body.code || !body.deviceId) {
    return store.sendJson(res, 400, { error: 'code and deviceId required' });
  }

  const ip = getClientIp(req);
  const ipAttempts = await registerIpAttempt(ip);
  if (ipAttempts > IP_ATTEMPT_CAP) {
    return store.sendJson(res, 429, { error: 'Too many pairing attempts from this network. Try again later.' });
  }

  const code = String(body.code).toUpperCase();
  const invite = await store.getInvite(code);
  const attemptTtl = invite ? Math.max(1, Math.ceil((invite.expiresAt - Date.now()) / 1000)) : store.INVITE_TTL_SECONDS;
  const codeAttempts = await registerInviteAttempt(code, attemptTtl);

  if (codeAttempts > INVITE_ATTEMPT_CAP) {
    await store.deleteInvite(code);
    return store.sendJson(res, 429, { error: 'Too many attempts on this code. It has been invalidated.' });
  }

  if (!invite) return store.sendJson(res, 404, { error: 'Invite not found or expired' });
  if (invite.fromDeviceId === body.deviceId) return store.sendJson(res, 400, { error: 'Cannot pair with yourself' });

  await store.deleteInvite(code);

  const inviterId = invite.fromDeviceId;
  const redeemerId = body.deviceId;

  await store.addPairing(inviterId, redeemerId);
  await store.setLabel(inviterId, redeemerId, body.label);

  // A token is a per-device credential, not a per-connection one (see api/connections/
  // revoke.js) — a device already holding one from an earlier pairing keeps it. Only a
  // device pairing for the first time ever gets a freshly issued token here.
  const [existingRedeemerHash, existingInviterHash] = await Promise.all([
    store.getTokenHash(redeemerId),
    store.getTokenHash(inviterId),
  ]);

  let redeemerToken = null;
  if (!existingRedeemerHash) {
    redeemerToken = generateToken();
    await store.setTokenHash(redeemerId, hashToken(redeemerToken));
  }

  if (!existingInviterHash) {
    const inviterToken = generateToken();
    await Promise.all([store.setTokenHash(inviterId, hashToken(inviterToken)), store.setUnclaimedToken(inviterId, inviterToken)]);
  }

  return store.sendJson(res, 200, { pairedWith: inviterId, token: redeemerToken });
};
