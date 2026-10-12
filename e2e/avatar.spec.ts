import { test, expect } from '@playwright/test';

// Headless test browsers report varying connection types; present a normal desktop connection.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      value: { effectiveType: '4g', saveData: false },
      configurable: true,
    });
  });
});

test('hero shows the avatar poster immediately, then upgrades to the interactive 3D view', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const avatar = page.locator('[data-avatar-state]').first();
  await expect(avatar).toBeVisible();
  await expect(avatar.getByRole('img', { name: /3D avatar of Muhammad Umer/i })).toBeVisible();

  await expect(page.locator('[data-avatar-state="model"]')).toBeVisible({ timeout: 45_000 });
  await expect(page.locator('model-viewer')).toHaveCount(1);
});

test('the 3D avatar turns toward the cursor', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('[data-avatar-state="model"]')).toBeVisible({ timeout: 45_000 });

  const orbit = () => page.evaluate(() => (document.querySelector('model-viewer') as HTMLElement & { cameraOrbit: string }).cameraOrbit);
  await page.mouse.move(1350, 100, { steps: 8 });
  await page.waitForTimeout(800);
  const towardRight = await orbit();
  await page.mouse.move(80, 800, { steps: 8 });
  await page.waitForTimeout(800);
  const towardLeft = await orbit();

  expect(towardRight).not.toBe(towardLeft);
  expect(parseFloat(towardRight)).toBeLessThan(0);
  expect(parseFloat(towardLeft)).toBeGreaterThan(0);
});

test('reduced motion keeps the still poster and never loads the viewer', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForTimeout(4000);

  await expect(page.locator('[data-avatar-state="poster"]').first()).toBeVisible();
  await expect(page.locator('model-viewer')).toHaveCount(0);
});

test('phones get the poster only, without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForTimeout(3000);

  await expect(page.locator('model-viewer')).toHaveCount(0);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('the header shows the MU circuit logo and the ID badge uses the avatar', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const brand = page.locator('#mu-global__header__link--brand');
  await expect(brand).toHaveAttribute('aria-label', 'Go to home');
  await expect(brand.locator('svg[data-logo="mu-circuit"]')).toBeVisible();
  await expect(brand).not.toHaveText(/MU/);

  await page.evaluate(() => document.getElementById('about')?.scrollIntoView());
  await expect(page.locator('.badge-scene img')).toHaveCount(1);
});

test('the ID card hangs on a lanyard: strap + grommet, can be dragged, swings back, and flips', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.getElementById('about')?.scrollIntoView();
  });
  await page.waitForTimeout(1200);

  const scene = page.getByTestId('id-badge-scene');
  await expect(scene.locator('[data-lanyard="strap"]')).toBeVisible();
  await expect(scene.locator('.badge-face svg[viewBox="0 0 32 32"]')).toHaveCount(2);

  const swing = () =>
    page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.badge-swing') as Element).getPropertyValue('--swing')) || 0);

  const box = (await scene.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + 220);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 120, box.y + 260, { steps: 6 });
  expect(Math.abs(await swing())).toBeGreaterThan(0.1);

  await page.mouse.up();
  await page.waitForTimeout(400);
  const swinging = await swing();
  expect(Math.abs(swinging)).toBeLessThan(0.75);

  await scene.getByRole('button', { name: /flip card/i }).click();
  await expect(page.locator('.badge-flip')).toHaveAttribute('data-flipped', 'true');
});

test('the hero avatar plays its own animation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('[data-avatar-state="model"]')).toBeVisible({ timeout: 45_000 });
  const times = [] as number[];
  for (let i = 0; i < 2; i += 1) {
    times.push(await page.evaluate(() => (document.querySelector('model-viewer') as HTMLElement & { currentTime: number }).currentTime));
    await page.waitForTimeout(1200);
  }
  expect(times[1]).toBeGreaterThan(times[0]);
});
