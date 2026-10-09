import { test, expect } from '@playwright/test';

test('user can open a project detail page from projects index', async ({ page }) => {
  await page.goto('/projects');

  const innovaLink = page.getByRole('link', { name: /innova care/i }).first();
  await expect(innovaLink).toBeVisible();

  await innovaLink.click();

  await expect(page).toHaveURL(/\/projects\/innova-care/);
  await expect(page.getByRole('heading', { level: 1, name: /innova care/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Key Contributions' })).toBeVisible();
});

test('home accordion opens a project panel and links to its case study', async ({ page }) => {
  await page.goto('/');
  await page.locator('#projects').scrollIntoViewIfNeeded();

  const eizhar = page.getByRole('button', { name: /eizhar/i });
  await eizhar.click();
  await expect(eizhar).toHaveAttribute('aria-expanded', 'true');

  await page.getByRole('link', { name: /view case study/i }).click();
  await expect(page).toHaveURL(/\/projects\/eizhar$/);
});

test('in-progress projects show their badge on the index', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByText('In Progress')).toHaveCount(3);
});
