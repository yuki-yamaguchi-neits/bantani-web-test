const PAGE_SLUGS = new Set([
  'about',
  'build-grave',
  'repair-close',
  'works',
  'knowledge',
  'contact',
  'privacy-policy'
]);

function unauthorized() {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Bantani test environment", charset="UTF-8"',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet'
    }
  });
}

function decodeBasicCredentials(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function hasValidCredentials(request, env) {
  const header = request.headers.get('Authorization');
  const match = header?.match(/^Basic\s+(.+)$/i);
  if (!match) return false;

  try {
    const decoded = decodeBasicCredentials(match[1]);
    const separator = decoded.indexOf(':');
    if (separator < 0) return false;
    const username = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);
    return username === env.BASIC_AUTH_USERNAME && password === env.BASIC_AUTH_PASSWORD;
  } catch {
    return false;
  }
}

function canonicalRedirect(requestUrl) {
  const url = new URL(requestUrl);
  const physicalPage = url.pathname.match(/^\/pages\/([^/]+)(?:\/index\.html)?$/);
  const physicalDirectory = url.pathname.match(/^\/pages\/([^/]+)\/$/);
  const indexPage = url.pathname.match(/^\/([^/]+)\/index\.html$/);

  if (url.pathname === '/index.html') {
    return `/${url.search}`;
  }

  if (physicalPage && PAGE_SLUGS.has(physicalPage[1])) {
    return `/${physicalPage[1]}/${url.search}`;
  }

  if (physicalDirectory && PAGE_SLUGS.has(physicalDirectory[1])) {
    return `/${physicalDirectory[1]}/${url.search}`;
  }

  if (indexPage && PAGE_SLUGS.has(indexPage[1])) {
    return `/${indexPage[1]}/${url.search}`;
  }

  if (url.pathname.endsWith('/')) return null;

  const slug = url.pathname.slice(1);
  return PAGE_SLUGS.has(slug) ? `/${slug}/${url.search}` : null;
}

function assetRequest(request) {
  const url = new URL(request.url);
  const slug = url.pathname.match(/^\/([^/]+)\/$/)?.[1];
  if (!slug || !PAGE_SLUGS.has(slug)) return request;

  url.pathname = `/pages/${slug}/`;
  return new Request(url, request);
}

function redirect(location) {
  return new Response(null, {
    status: 301,
    headers: {
      Location: location,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet'
    }
  });
}

export default {
  async fetch(request, env) {
    if (!env.BASIC_AUTH_USERNAME || !env.BASIC_AUTH_PASSWORD || !hasValidCredentials(request, env)) {
      return unauthorized();
    }

    const redirectLocation = canonicalRedirect(request.url);
    if (redirectLocation) return redirect(redirectLocation);

    const response = await env.ASSETS.fetch(assetRequest(request));
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    headers.set('Cache-Control', 'no-store');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
};
