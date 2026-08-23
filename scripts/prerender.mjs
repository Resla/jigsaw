// Post-build step: crawls the built SPA with a headless browser and writes a static
// index.html snapshot for every public route, plus robots.txt and sitemap.xml.
// Dynamic/personal routes (custom puzzles, /my-puzzles, daily-challenge URLs) are left as
// pure client-rendered fallback — they're `noindex` anyway, see src/hooks/useSeo.ts usage.
import { createServer } from 'node:http';
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

async function loadSiteData() {
  const entry = `
    export { galleryImages } from ${JSON.stringify(path.join(ROOT, 'src/data/gallery.ts'))};
    export { categories } from ${JSON.stringify(path.join(ROOT, 'src/data/categories.ts'))};
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

function buildRoutes(galleryImages, categories) {
  const routes = [{ url: '/', changefreq: 'weekly', priority: 1.0 }];
  for (const category of categories) {
    routes.push({ url: `/category/${category.slug}`, changefreq: 'weekly', priority: 0.8 });
  }
  for (const image of galleryImages) {
    routes.push({ url: `/puzzle/${image.id}`, changefreq: 'monthly', priority: 0.6 });
  }
  return routes;
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

async function prerenderRoutes(routes) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const route of routes) {
    const url = `http://localhost:${PORT}${route.url}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    // Give React a beat to finish painting after network settles.
    await page.waitForSelector('#root > *', { timeout: 5000 }).catch(() => {});
    const html = `<!doctype html>\n${await page.evaluate(() => document.documentElement.outerHTML)}`;

    const outDir = route.url === '/' ? DIST : path.join(DIST, route.url.replace(/^\//, ''));
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), html, 'utf-8');
    console.log(`  prerendered ${route.url}`);
  }
  await browser.close();
}

async function writeRobotsAndSitemap(routes, siteUrl) {
  const urlEntries = routes
    .map(
      (r) =>
        `  <url>\n    <loc>${siteUrl}${r.url}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf-8');

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  await writeFile(path.join(DIST, 'robots.txt'), robots, 'utf-8');

  console.log(`  wrote sitemap.xml (${routes.length} urls) and robots.txt`);
}

function shouldSkipBrowser() {
  if (process.env.SKIP_PRERENDER === '1') return true;
  // Cloudflare Pages sets CF_PAGES=1. Chromium is not available there unless we
  // explicitly opt in with PRERENDER=1 after installing Playwright browsers.
  if (process.env.CF_PAGES === '1' && process.env.PRERENDER !== '1') return true;
  return false;
}

async function main() {
  if (!existsSync(DIST) || !existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist/ not found — run `npm run build` first.');
    process.exit(1);
  }

  console.log('Loading site data (gallery + categories)...');
  const { galleryImages, categories, SITE_URL } = await loadSiteData();
  const routes = buildRoutes(galleryImages, categories);
  console.log(`Found ${routes.length} public routes to prerender.`);

  if (shouldSkipBrowser()) {
    console.log('Skipping Chromium prerender (Cloudflare / SKIP_PRERENDER). Writing sitemap only.');
    await writeRobotsAndSitemap(routes, SITE_URL);
    return;
  }

  console.log('Starting local static server...');
  const server = await startStaticServer();

  try {
    console.log('Prerendering routes with headless Chromium...');
    try {
      await prerenderRoutes(routes);
    } catch (err) {
      console.warn('Prerender failed; continuing with sitemap only.');
      console.warn(err instanceof Error ? err.message : err);
    }

    console.log('Writing robots.txt and sitemap.xml...');
    await writeRobotsAndSitemap(routes, SITE_URL);
  } finally {
    server.close();
  }

  console.log('Prerender complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
