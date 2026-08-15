const http = require('http');
const crypto = require('crypto');

/**
 * Family Circle relay — reference implementation of the architecture locked in
 * DECISION_LOG.md (2026-08-05). In-memory only: durable pairing lasts as long as this
 * process runs; events are deleted the moment they are delivered (or expire, unread,
 * after EVENT_TTL_MS). No accounts, no passwords — trust rests on the invite code
 * being random, single-use, and short-lived. Not yet deployed anywhere; run locally
 * for same-WiFi testing until a real hosting decision is made.
 */

const PORT = process.env.PORT || 4000;
const INVITE_TTL_MS = 30 * 60 * 1000;
const EVENT_TTL_MS = 72 * 60 * 60 * 1000;

const invites = new Map();
const pairings = new Map();
const pairingLabels = new Map();
const events = new Map();

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

function cleanupExpiredInvites() {
  const now = Date.now();
  for (const [code, invite] of invites) {
    if (invite.expiresAt < now) invites.delete(code);
  }
}

function cleanupExpiredEvents(deviceId) {
  const now = Date.now();
  const fresh = (events.get(deviceId) || []).filter((event) => event.expiresAt >= now);
  events.set(deviceId, fresh);
  return fresh;
}

const server = http.createServer(async (req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);

  if (req.method === 'GET' && req.url === '/') {
    return json(res, 200, { status: 'ok', service: 'family-circle-relay' });
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (req.method === 'POST' && url.pathname === '/invites') {
      const body = await readBody(req);
      if (!body.deviceId) return json(res, 400, { error: 'deviceId required' });
      cleanupExpiredInvites();
      const code = crypto.randomBytes(3).toString('hex').toUpperCase();
      invites.set(code, { fromDeviceId: body.deviceId, expiresAt: Date.now() + INVITE_TTL_MS });
      return json(res, 200, { code, expiresInMinutes: INVITE_TTL_MS / 60000 });
    }

    if (req.method === 'POST' && url.pathname === '/pairings') {
      const body = await readBody(req);
      if (!body.code || !body.deviceId) return json(res, 400, { error: 'code and deviceId required' });
      cleanupExpiredInvites();
      const invite = invites.get(String(body.code).toUpperCase());
      if (!invite) return json(res, 404, { error: 'Invite not found or expired' });
      if (invite.fromDeviceId === body.deviceId) return json(res, 400, { error: 'Cannot pair with yourself' });
      invites.delete(String(body.code).toUpperCase());

      const a = invite.fromDeviceId;
      const b = body.deviceId;
      if (!pairings.has(a)) pairings.set(a, new Set());
      if (!pairings.has(b)) pairings.set(b, new Set());
      pairings.get(a).add(b);
      pairings.get(b).add(a);
      if (body.label) pairingLabels.set(`${a}:${b}`, body.label);

      return json(res, 200, { pairedWith: a });
    }

    if (req.method === 'GET' && url.pathname.startsWith('/pairings/')) {
      const deviceId = decodeURIComponent(url.pathname.split('/')[2] || '');
      return json(res, 200, { partners: Array.from(pairings.get(deviceId) || []) });
    }

    if (req.method === 'POST' && url.pathname === '/events') {
      const body = await readBody(req);
      if (!body.fromDeviceId || !body.toDeviceId || !body.type) {
        return json(res, 400, { error: 'fromDeviceId, toDeviceId, type required' });
      }
      const partners = pairings.get(body.fromDeviceId);
      if (!partners || !partners.has(body.toDeviceId)) {
        return json(res, 403, { error: 'Devices are not paired' });
      }
      const queue = events.get(body.toDeviceId) || [];
      queue.push({
        id: crypto.randomUUID(),
        fromDeviceId: body.fromDeviceId,
        type: body.type,
        payload: body.payload ?? null,
        expiresAt: Date.now() + EVENT_TTL_MS,
      });
      events.set(body.toDeviceId, queue);
      return json(res, 200, { queued: true });
    }

    if (req.method === 'GET' && url.pathname.startsWith('/events/')) {
      const deviceId = decodeURIComponent(url.pathname.split('/')[2] || '');
      const fresh = cleanupExpiredEvents(deviceId);
      events.set(deviceId, []);
      return json(res, 200, { events: fresh });
    }

    return json(res, 404, { error: 'Not found' });
  } catch {
    return json(res, 500, { error: 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`Family Circle relay listening on port ${PORT}`);
});
