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

test('the header logo and ID badge use the avatar instead of the MU monogram', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const brand = page.locator('#mu-global__header__link--brand');
  await expect(brand).toHaveAttribute('aria-label', 'Go to home');
  await expect(brand.locator('img')).toBeVisible();
  await expect(brand).not.toHaveText(/MU/);

  await page.evaluate(() => document.getElementById('about')?.scrollIntoView());
  await expect(page.locator('.badge-scene img')).toHaveCount(2);
});
