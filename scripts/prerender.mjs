// Post-build step: crawls the built SPA with a headless browser and writes a static
// index.html snapshot for every public route, plus robots.txt and sitemap.xml.
// Dynamic/personal routes (custom puzzles, /my-puzzles, daily-challenge URLs) are left as
// pure client-rendered fallback — they're `noindex` anyway, see src/hooks/useSeo.ts usage.
//
// Prerender failure is fatal. A production build must not succeed if required
// indexable routes would be deployed as the empty SPA shell.
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = 4173 + Math.floor(Math.random() * 1000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const REQUIRED_SNAPSHOTS = [
  '/',
  '/category/animals',
  '/puzzle/autumn-forest',
  '/stories',
  '/spot-it/night-carnival',
];

async function loadSiteData() {
  const entry = `
    export { galleryImages } from ${JSON.stringify(path.join(ROOT, 'src/data/gallery.ts'))};
    export { categories } from ${JSON.stringify(path.join(ROOT, 'src/data/categories.ts'))};
    export { stories } from ${JSON.stringify(path.join(ROOT, 'src/data/stories.ts'))};
    export { spotPuzzles } from ${JSON.stringify(path.join(ROOT, 'src/data/spotIt.ts'))};
    export { SITE_URL } from ${JSON.stringify(path.join(ROOT, 'src/data/siteConfig.ts'))};
  `;
  const result = await esbuild.build({
    stdin: { contents: entry, resolveDir: ROOT, loader: 'ts' },
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
  });
  const code = result.outputFiles[0].text;
  const tmpFile = path.join(ROOT, 'node_modules', '.prerender-data.mjs');
  await writeFile(tmpFile, code, 'utf-8');
  const mod = await import(`${new URL('file://' + tmpFile.replace(/\\/g, '/'))}?t=${Date.now()}`);
  return mod;
}

function buildRoutes(galleryImages, categories, storyList = [], spotList = []) {
  const routes = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/daily-jigsaw-puzzle', changefreq: 'daily', priority: 0.9 },
    { url: '/stories', changefreq: 'weekly', priority: 0.8 },
    { url: '/play', changefreq: 'weekly', priority: 0.7 },
    { url: '/spot-it', changefreq: 'weekly', priority: 0.7 },
  ];
  for (const category of categories) {
    routes.push({ url: `/category/${category.slug}`, changefreq: 'weekly', priority: 0.8 });
  }
  for (const story of storyList) {
    routes.push({ url: `/story/${story.slug}`, changefreq: 'monthly', priority: 0.7 });
  }
  for (const puzzle of spotList) {
    routes.push({ url: `/spot-it/${puzzle.slug}`, changefreq: 'monthly', priority: 0.6 });
  }
  for (const image of galleryImages) {
    routes.push({ url: `/puzzle/${image.id}`, changefreq: 'monthly', priority: 0.6 });
  }
  return routes;
}

function isRequiredIndexable(url) {
  return (
    url === '/' ||
    url === '/daily-jigsaw-puzzle' ||
    url === '/stories' ||
    url === '/spot-it' ||
    url.startsWith('/category/') ||
    url.startsWith('/puzzle/') ||
    url.startsWith('/story/') ||
    url.startsWith('/spot-it/')
  );
}

function snapshotPath(url) {
  return url === '/' ? path.join(DIST, 'index.html') : path.join(DIST, url.replace(/^\//, ''), 'index.html');
}

function expectedCanonical(siteUrl, url) {
  return url === '/' ? `${siteUrl}/` : `${siteUrl}${url}`;
}

function stripSlash(value) {
  return value.replace(/\/$/, '');
}

function extractTitle(html) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() ?? '';
}

function extractCanonical(html) {
  return (
    html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1] ??
    html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical/i)?.[1] ??
    ''
  );
}

function extractDescription(html) {
  return (
    html.match(/name=["']description["'][^>]*content=["']([^"']*)/i)?.[1] ??
    html.match(/content=["']([^"']*)["'][^>]*name=["']description/i)?.[1] ??
    ''
  );
}

function assertSnapshotHtml(html, route, siteUrl, homeTitle) {
  const errors = [];
  const title = extractTitle(html);
  if (!title) errors.push('missing <title>');

  const desc = extractDescription(html);
  if (!desc) errors.push('missing meta description');

  const canonical = extractCanonical(html);
  const expected = expectedCanonical(siteUrl, route.url);
  if (!canonical) {
    errors.push('missing canonical');
  } else if (stripSlash(canonical) !== stripSlash(expected)) {
    errors.push(`canonical ${canonical} != ${expected}`);
  }

  if (!/<h1[\s>]/i.test(html)) errors.push('missing H1');

  if (/<div id="root">\s*<\/div>/i.test(html)) errors.push('empty #root shell');

  const hrefCount = (html.match(/<a\s[^>]*href=/gi) ?? []).length;
  if (hrefCount < 1) errors.push('no crawlable <a href> links');

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length < 80) errors.push('not enough visible text');

  if (route.url !== '/' && homeTitle && title === homeTitle) {
    errors.push('title is still the homepage title');
  }

  if (errors.length) {
    throw new Error(`${route.url}: ${errors.join('; ')}`);
  }
}

function startStaticServer() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let filePath = path.join(DIST, urlPath);
      let ext = path.extname(filePath);

      if (!ext) {
        // SPA route (no extension) — always serve the client-rendered shell, even if a
        // prerendered snapshot from a previous run exists on disk, so we crawl fresh content.
        filePath = path.join(DIST, 'index.html');
        ext = '.html';
      } else if (!existsSync(filePath)) {
        filePath = path.join(DIST, 'index.html');
        ext = '.html';
      }

      const body = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
      res.end(body);
    } catch (err) {
      res.writeHead(500);
      res.end(String(err));
    }
  });
  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server));
  });
}

function installChromium() {
  console.log('Installing Playwright Chromium…');
  const result = spawnSync('npx', ['playwright', 'install', 'chromium'], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error('Playwright Chromium install failed. Run: npx playwright install chromium');
  }
}

async function launchChromium() {
  try {
    return await chromium.launch();
  } catch (err) {
    console.warn(err instanceof Error ? err.message : err);
    for (const channel of ['chrome', 'msedge']) {
      try {
        const browser = await chromium.launch({ channel });
        console.log(`Using installed ${channel} for prerender.`);
        return browser;
      } catch {}
    }
    installChromium();
    return chromium.launch();
  }
}

async function prerenderRoutes(routes, siteUrl) {
  const browser = await launchChromium();
  const page = await browser.newPage();
  let homeTitle = '';
  try {
    for (const route of routes) {
      const url = `http://localhost:${PORT}${route.url}`;
      const expectedUrl = expectedCanonical(siteUrl, route.url);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#root > *', { timeout: 15000 });
      // useSeo writes title/OG/canonical in an effect — wait until they match this route
      // so we never snapshot the homepage shell onto a category or puzzle URL.
      await page.waitForFunction(
        ({ expectedPath, expectedUrl: expectedOg }) => {
          const seoPath = document.documentElement.dataset.seoPath;
          const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
          return seoPath === expectedPath || ogUrl === expectedOg;
        },
        { expectedPath: route.url, expectedUrl },
        { timeout: 20000 },
      );
      await page.waitForLoadState('networkidle').catch(() => {});
      const html = `<!doctype html>\n${await page.evaluate(() => document.documentElement.outerHTML)}`;
      if (route.url === '/') homeTitle = extractTitle(html);
      if (isRequiredIndexable(route.url)) {
        assertSnapshotHtml(html, route, siteUrl, homeTitle);
      }

      const outFile = snapshotPath(route.url);
      await mkdir(path.dirname(outFile), { recursive: true });
      await writeFile(outFile, html, 'utf-8');
      console.log(`  prerendered ${route.url}`);
    }
  } finally {
    await browser.close();
  }
}

async function validateRequiredSnapshots(routes, siteUrl) {
  const homeTitle = extractTitle(await readFile(snapshotPath('/'), 'utf-8'));
  const required = routes.filter((route) => isRequiredIndexable(route.url));
  for (const route of required) {
    const file = snapshotPath(route.url);
    if (!existsSync(file)) {
      throw new Error(`Missing snapshot ${file}`);
    }
    const html = await readFile(file, 'utf-8');
    assertSnapshotHtml(html, route, siteUrl, homeTitle);
  }
  for (const url of REQUIRED_SNAPSHOTS) {
    const file = snapshotPath(url);
    if (!existsSync(file)) throw new Error(`Missing required snapshot ${file}`);
  }
  console.log(`Validated ${required.length} indexable snapshots.`);
}

async function writeRobotsAndSitemap(routes, siteUrl) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urlEntries = routes
    .map(
      (r) =>
        `  <url>\n    <loc>${siteUrl}${r.url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf-8');

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  await writeFile(path.join(DIST, 'robots.txt'), robots, 'utf-8');

  console.log(`  wrote sitemap.xml (${routes.length} urls) and robots.txt`);
}

async function main() {
  if (!existsSync(DIST) || !existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist/ not found — run `npm run build` first.');
    process.exit(1);
  }

  if (process.env.SKIP_PRERENDER === '1') {
    console.error('SKIP_PRERENDER=1 is not allowed. Indexable routes must be prerendered.');
    process.exit(1);
  }
  if (process.env.CF_PAGES === '1' && process.env.PRERENDER !== '1') {
    console.error('Cloudflare Pages builds must prerender. Set PRERENDER=1 and install Playwright Chromium.');
    process.exit(1);
  }

  console.log('Loading site data (gallery + categories)...');
  const { galleryImages, categories, stories, spotPuzzles, SITE_URL } = await loadSiteData();
  const routes = buildRoutes(galleryImages, categories, stories, spotPuzzles);
  console.log(`Found ${routes.length} public routes to prerender.`);

  console.log('Starting local static server...');
  const server = await startStaticServer();

  try {
    console.log('Prerendering routes with headless Chromium...');
    await prerenderRoutes(routes, SITE_URL);
    console.log('Writing robots.txt and sitemap.xml...');
    await writeRobotsAndSitemap(routes, SITE_URL);
    await validateRequiredSnapshots(routes, SITE_URL);
  } catch (err) {
    console.error('Prerender failed. Production build aborted.');
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  } finally {
    server.close();
  }

  console.log('Prerender complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
