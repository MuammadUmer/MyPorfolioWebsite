import { test, expect } from '@playwright/test';

test('main navigation between routes works', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { name: /muhammad umer/i })).toBeVisible();

  await page.getByRole('link', { name: /projects/i }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();

  await page.getByRole('link', { name: /about/i }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();
});
