import { test, expect } from '@playwright/test';

test('basic app test', async ({ page }) => {
  await page.goto('/');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check if page loads at all
  const title = await page.title();
  console.log('Page title:', title);
  
  // Take screenshot for debugging
  await page.screenshot({ path: 'test-screenshot.png' });
  
  // Check basic content
  const content = await page.content();
  expect(content).toContain('AI Defeater');
});