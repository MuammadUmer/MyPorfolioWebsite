import { test, expect } from '@playwright/test';

test('user can open a project detail page from projects index', async ({ page }) => {
  await page.goto('/projects');

  const innovaLink = page.getByRole('link', { name: /innova care/i }).first();
  await expect(innovaLink).toBeVisible();

  await innovaLink.click();

  await expect(page).toHaveURL(/\/projects\/innova-care/);
  await expect(
    page.getByRole('heading', { name: /innova care/i })
  ).toBeVisible();
});
