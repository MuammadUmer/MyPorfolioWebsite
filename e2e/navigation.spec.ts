import { test, expect } from '@playwright/test';

test('home page shows the hero and every section in layout order', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: /muhammad umer/i })).toBeVisible();

  const sectionIds = await page
    .locator('main > section')
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(sectionIds).toEqual([
    'mu-home__hero__section--primary',
    'mu-home__about__section--primary',
    'mu-home__skills__section--primary',
    'mu-home__projects__section--primary',
    'mu-home__certifications__section--primary',
    'mu-home__experience__section--primary',
    'mu-home__contact__section--primary',
  ]);
});

test('home navigation scrolls to the section and updates the active item', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: /primary navigation/i });

  await nav.getByRole('link', { name: 'Skills' }).click();
  await expect(page).toHaveURL(/#skills$/);
  await expect(page.getByRole('heading', { level: 2, name: /skills & tools/i })).toBeInViewport();
  await expect(nav.getByRole('link', { name: 'Skills' })).toHaveAttribute('aria-current', 'location');
});

test('routes keep working from the header on inner pages', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('heading', { level: 1, name: /selected projects/i })).toBeVisible();

  const nav = page.getByRole('navigation', { name: /primary navigation/i });
  await nav.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { level: 1, name: /about me/i })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
});

test('theme toggle switches and persists across reloads', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const toggle = page.getByRole('button', { name: 'Toggle theme' }).first();

  await expect(html).not.toHaveClass(/dark/);
  await toggle.click();
  await expect(html).toHaveClass(/dark/);

  await page.reload();
  await expect(html).toHaveClass(/dark/);
});

test('content stays visible when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 2, name: /about me/i })).toBeVisible();
  const opacity = await page
    .locator('.reveal-words .word')
    .first()
    .evaluate((node) => getComputedStyle(node).opacity);
  expect(opacity).toBe('1');
});

test('mobile menu opens, lists every section and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  await page.getByRole('button', { name: /open navigation menu/i }).click();
  const menu = page.getByRole('navigation', { name: /mobile primary navigation/i });
  for (const name of ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact']) {
    await expect(menu.getByRole('link', { name, exact: true })).toBeVisible();
  }

  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
});

test('no horizontal scrolling at 360px on any main route', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of ['/', '/about', '/skills', '/projects', '/projects/innova-care', '/experience', '/contact']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(0);
  }
});
