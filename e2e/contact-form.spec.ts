import { test, expect } from '@playwright/test';

const VALID_MESSAGE = 'This is a valid message with more than twenty characters.';

test('contact form shows validation errors and then submits successfully', async ({ page }) => {
  await page.goto('/contact');

  const submitButton = page.getByRole('button', { name: /send message/i });
  await submitButton.click();

  await expect(page.getByText(/name is required/i)).toBeVisible();
  await expect(page.getByText(/email is required/i)).toBeVisible();
  await expect(page.getByText(/message is required/i)).toBeVisible();

  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Message').fill(VALID_MESSAGE);

  await submitButton.click();

  await expect(
    page.getByText(/thank you for reaching out. i will get back to you soon./i)
  ).toBeVisible();
});
