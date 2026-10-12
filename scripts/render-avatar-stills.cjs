/**
 * Builds the avatar assets from an (optimised) GLB and wires them into src/data/profile.json:
 *   public/avatar/<name>.<hash>.glb     the model (copied/renamed with a content hash)
 *   public/avatar/poster.<hash>.webp    800x1000 transparent hero poster + ID-badge portrait
 *   public/avatar/logo.<hash>.webp      192x192 transparent logo mark (shown in a circle)
 *
 * File names carry a content hash on purpose: browsers and next/image cache avatar files for hours, so a
 * changed avatar must get a new URL to show up everywhere immediately.
 *
 * usage: npm run avatar:stills -- public/avatar/muhammad-umer.glb [--poster-target="0m 1.45m 0m"] [--poster-radius=2.6m]
 *                                                                  [--head-y=1.7] [--logo-radius=0.8]
 *
 * --poster-target  point the hero camera looks at (default: keep the value already in profile.json)
 * --poster-radius  camera distance for the hero framing (default: keep the value already in profile.json)
 * --head-y         height (model units, usually metres) of the face centre for the logo; default = 13% below the top
 * --logo-radius    camera distance for the logo close-up; default = 38% of the model height
 * Set PW_CHROMIUM to a Chromium/Chrome executable if Playwright's own browser is not installed.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('@playwright/test');

const [model, ...flags] = process.argv.slice(2);
if (!model || !fs.existsSync(model)) {
  console.error(
    'Usage: npm run avatar:stills -- <path-to-model.glb> [--poster-target="0m 1.45m 0m"] [--poster-radius=2.6m] [--head-y=1.7] [--logo-radius=0.8]'
  );
  process.exit(1);
}

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'avatar');
const profilePath = path.join(root, 'src', 'data', 'profile.json');
const flag = (name) => {
  const found = flags.find((f) => f.startsWith(`--${name}=`));
  return found ? found.slice(name.length + 3) : undefined;
};
const viewerJs = require.resolve('@google/model-viewer/dist/model-viewer.min.js');
const hashOf = (buffer) => crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 8);

const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
const existing = profile.avatar || {};
const posterTarget = flag('poster-target') || existing.framing?.target || 'auto auto auto';
const posterRadius = flag('poster-radius') || existing.framing?.radius || 'auto';

// Lighting used for both the stills and the live viewer (keep in sync with Avatar3D.tsx).
const LIGHTING = 'environment-image="legacy" exposure="1" shadow-intensity="0"';

const html = `<!doctype html><html><body style="margin:0;background:transparent">
<script type="module" src="/mv.js"></script>
<model-viewer id="mv" src="/model.glb" camera-orbit="0deg 84deg auto" field-of-view="22deg"
  min-camera-orbit="auto auto 0.2m" max-camera-orbit="auto auto 20m" ${LIGHTING} interaction-prompt="none"
  style="width:800px;height:1000px;background:transparent;--poster-color:transparent"></model-viewer></body></html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.setHeader('content-type', 'text/html');
    return res.end(html);
  }
  if (req.url === '/mv.js') {
    res.setHeader('content-type', 'text/javascript');
    return res.end(fs.readFileSync(viewerJs));
  }
  if (req.url === '/model.glb') {
    res.setHeader('content-type', 'model/gltf-binary');
    return res.end(fs.readFileSync(model));
  }
  res.statusCode = 404;
  res.end();
});

(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport: { width: 900, height: 1100 } });
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.waitForFunction(() => document.getElementById('mv')?.loaded, null, { timeout: 60000 });

  const info = await page.evaluate(() => {
    const mv = document.getElementById('mv');
    const d = mv.getDimensions();
    const c = mv.getBoundingBoxCenter();
    return { dims: [d.x, d.y, d.z], center: [c.x, c.y, c.z] };
  });
  const top = info.center[1] + info.dims[1] / 2;
  const headY = parseFloat(flag('head-y')) || top - 0.13 * info.dims[1];
  const logoRadius = parseFloat(flag('logo-radius')) || info.dims[1] * 0.38;
  console.log(`model ${info.dims.map((n) => n.toFixed(2)).join(' x ')} | face centre y ${headY.toFixed(2)}`);

  const grab = async (attrs, size) => {
    await page.evaluate(
      async ({ attrs, size }) => {
        const mv = document.getElementById('mv');
        mv.style.width = `${size[0]}px`;
        mv.style.height = `${size[1]}px`;
        Object.entries(attrs).forEach(([key, value]) => mv.setAttribute(key, value));
        mv.jumpCameraToGoal();
        await new Promise((resolve) => setTimeout(resolve, 1200));
      },
      { attrs, size }
    );
    const base64 = await page.evaluate(async () => {
      const blob = await document.getElementById('mv').toBlob({ mimeType: 'image/webp', qualityArgument: 0.92 });
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let binary = '';
      for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return btoa(binary);
    });
    return Buffer.from(base64, 'base64');
  };

  const posterBuffer = await grab(
    { 'camera-orbit': `0deg 84deg ${posterRadius}`, 'camera-target': posterTarget, 'field-of-view': '22deg' },
    [800, 1000]
  );
  const logoBuffer = await grab(
    {
      'camera-orbit': `0deg 86deg ${logoRadius.toFixed(3)}m`,
      'camera-target': `${info.center[0]}m ${headY.toFixed(3)}m ${info.center[2]}m`,
      'field-of-view': '30deg',
    },
    [192, 192]
  );

  await browser.close();
  server.close();

  // ---- write hashed files, drop stale ones, update profile.json ----
  fs.mkdirSync(outDir, { recursive: true });
  const modelBuffer = fs.readFileSync(model);
  const baseName = path.basename(model).replace(/\.[0-9a-f]{8}(?=\.glb$)/, '').replace(/\.glb$/, '');
  const names = {
    model: `${baseName}.${hashOf(modelBuffer)}.glb`,
    poster: `poster.${hashOf(posterBuffer)}.webp`,
    logo: `logo.${hashOf(logoBuffer)}.webp`,
  };
  fs.writeFileSync(path.join(outDir, names.model), modelBuffer);
  fs.writeFileSync(path.join(outDir, names.poster), posterBuffer);
  fs.writeFileSync(path.join(outDir, names.logo), logoBuffer);

  const keep = new Set(Object.values(names));
  for (const file of fs.readdirSync(outDir)) {
    if (!keep.has(file) && /\.(glb|webp)$/.test(file)) fs.rmSync(path.join(outDir, file));
  }

  profile.avatar = {
    model: `/avatar/${names.model}`,
    poster: `/avatar/${names.poster}`,
    logo: `/avatar/${names.logo}`,
    alt: existing.alt || `3D avatar of ${profile.name}`,
    framing: { target: posterTarget, radius: posterRadius },
  };
  fs.writeFileSync(profilePath, `${JSON.stringify(profile, null, 2)}\n`);

  console.log(`model:  public/avatar/${names.model} (${(modelBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`poster: public/avatar/${names.poster} (${(posterBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`logo:   public/avatar/${names.logo} (${(logoBuffer.length / 1024).toFixed(1)} KB)`);
  console.log('src/data/profile.json updated.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
