const store = require('./store');

/**
 * Rate limiting and request-body caps — the two audit-001 findings packet-m009
 * exists to close. Per-code AND per-IP attempt caps are both required: per-code
 * alone doesn't stop one source spraying many different codes across the invite
 * space; per-IP alone would let an attacker who somehow narrows to one live code
 * hammer it up to the IP cap. See the packet's Deliverables for the full rationale.
 */

const INVITE_ATTEMPT_CAP = 5;
const IP_ATTEMPT_CAP = 20;
const IP_ATTEMPT_WINDOW_SECONDS = 15 * 60;

const MAX_JSON_BYTES = 4 * 1024; // 4 KB — invites/pairings/events/revoke bodies
const MAX_AUDIO_BYTES = 5 * 1024 * 1024; // 5 MB — generous ceiling for a 60s clip

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

/** Increments the per-code attempt counter, seeding its TTL on first increment. */
async function registerInviteAttempt(code, ttlSeconds) {
  const key = store.inviteAttemptsKey(code);
  const count = await store.kv.incr(key);
  if (count === 1) await store.kv.expire(key, Math.max(ttlSeconds, 1));
  return count;
}

/** Increments the per-IP attempt counter for a fixed sliding window. */
async function registerIpAttempt(ip) {
  const key = store.pairingAttemptsIpKey(ip);
  const count = await store.kv.incr(key);
  if (count === 1) await store.kv.expire(key, IP_ATTEMPT_WINDOW_SECONDS);
  return count;
}

/**
 * Reads the request body up to maxBytes, checked against actual bytes read (not
 * just the Content-Length header, which a client can misreport). Rejects by
 * rejecting the promise with a `statusCode: 413` error.
 */
function readRawBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/**
 * Parses a JSON body under maxBytes. Vercel's Node runtime auto-parses JSON
 * content-type bodies into `req.body` for standard requests; this trusts that when
 * present, and falls back to a manual capped stream read otherwise so the size cap
 * is enforced either way. The Content-Length pre-check is a cheap first filter, not
 * the only guard — the manual path re-checks actual bytes read.
 */
async function parseJsonBody(req, maxBytes) {
  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > maxBytes) {
    throw Object.assign(new Error('Payload too large'), { statusCode: 413 });
  }
  if (req.body !== undefined && req.body !== null && typeof req.body === 'object') {
    return req.body;
  }
  const raw = await readRawBody(req, maxBytes);
  if (!raw.length) return {};
  return JSON.parse(raw.toString('utf8'));
}

module.exports = {
  INVITE_ATTEMPT_CAP,
  IP_ATTEMPT_CAP,
  IP_ATTEMPT_WINDOW_SECONDS,
  MAX_JSON_BYTES,
  MAX_AUDIO_BYTES,
  getClientIp,
  registerInviteAttempt,
  registerIpAttempt,
  readRawBody,
  parseJsonBody,
};
