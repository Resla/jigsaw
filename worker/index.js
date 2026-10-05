import { PuzzleRoom, randomRoomCode } from './room.js';

export { PuzzleRoom };

const CANONICAL_HOST = 'puzzleharbour.com';
const LEGACY_HOSTS = new Set(['jigsaw.puzzel.workers.dev', 'www.puzzleharbour.com']);

function isGoogleVerificationFile(pathname) {
  return /^\/google[a-z0-9]+\.html$/i.test(pathname);
}

function roomStub(env, code) {
  const id = env.ROOMS.idFromName(code.toUpperCase());
  return env.ROOMS.get(id);
}

async function handleRooms(request, env) {
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);

  if (request.method === 'POST' && parts.length === 2 && parts[1] === 'rooms') {
    const body = await request.json().catch(() => null);
    if (!body?.imageId || !body?.pieces) {
      return Response.json({ error: 'Need a picture and a piece count' }, { status: 400 });
    }
    const code = randomRoomCode();
    const hostId = String(body.playerId || crypto.randomUUID());
    const stub = roomStub(env, code);
    return stub.fetch(
      new Request('https://room/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          code,
          imageId: String(body.imageId),
          pieces: Number(body.pieces),
          title: String(body.title || 'Puzzle'),
          hostId,
          name: String(body.name || 'Host').slice(0, 24),
        }),
      }),
    );
  }

  const code = parts[2];
  if (!code) return Response.json({ error: 'Missing room' }, { status: 400 });
  const stub = roomStub(env, code);

  if (parts[3] === 'ws') {
    return stub.fetch(request);
  }

  return stub.fetch(request);
}

function isAssetPath(pathname) {
  const last = pathname.split('/').pop() || '';
  return last.includes('.');
}

function isClientOnlyPath(pathname) {
  return pathname === '/my-puzzles' || pathname.startsWith('/play/') || pathname.startsWith('/puzzle/custom/');
}

async function fetchAsset(env, request, url) {
  let response = await env.ASSETS.fetch(new Request(url, request));
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('Location');
    if (location) {
      response = await env.ASSETS.fetch(new Request(new URL(location, url.origin), request));
    }
  }
  return response;
}

async function serveHtml(snapshot, status) {
  return new Response(snapshot.body, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': status === 404 ? 'public, max-age=300' : 'public, max-age=3600',
    },
  });
}

async function serveNotFound(request, env) {
  const url = new URL(request.url);
  const snapshot = await fetchAsset(env, request, new URL('/404/index.html', url.origin));
  if (!snapshot.ok) {
    return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
  return serveHtml(snapshot, 404);
}

async function serveSpa(request, env) {
  const url = new URL(request.url);
  const snapshot = await fetchAsset(env, request, new URL('/index.html', url.origin));
  if (!snapshot.ok) {
    return new Response('App unavailable', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
  return snapshot;
}

/** Serve prerendered dist/{path}/index.html for pretty URLs before the SPA shell. */
async function serveSite(request, env) {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method;
  if ((method === 'GET' || method === 'HEAD') && pathname !== '/' && !isAssetPath(pathname)) {
    const trimmed = pathname.replace(/\/+$/, '');
    if (trimmed) {
      const snapshot = await fetchAsset(env, request, new URL(`${trimmed}/index.html`, url.origin));
      if (snapshot.ok) {
        return trimmed === '/404' ? serveHtml(snapshot, 404) : snapshot;
      }
      if (isClientOnlyPath(trimmed)) {
        return serveSpa(request, env);
      }
      return serveNotFound(request, env);
    }
  }
  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (LEGACY_HOSTS.has(url.hostname) && !isGoogleVerificationFile(url.pathname)) {
      url.hostname = CANONICAL_HOST;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname.startsWith('/api/rooms')) {
      return handleRooms(request, env);
    }
    if (url.pathname === '/robots.txt' || url.pathname === '/sitemap.xml' || url.pathname === '/ads.txt') {
      const asset = await env.ASSETS.fetch(request);
      if (asset.ok) {
        const type =
          url.pathname === '/sitemap.xml' ? 'application/xml; charset=utf-8' : 'text/plain; charset=utf-8';
        return new Response(asset.body, {
          status: 200,
          headers: {
            'content-type': type,
            'cache-control': 'public, max-age=3600',
          },
        });
      }
    }
    return serveSite(request, env);
  },
};
