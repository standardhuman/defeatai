import { test, expect } from '@playwright/test';

test.describe('Updated Defeat Modes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('heavy mode should insert nonsense within every sentence', async ({ page }) => {
    const testText = 'AI will never be able to write like me. Because I am now inserting random sentences. We can defeat AI together.';
    
    await page.getByLabel('Your Original Text').fill(testText);
    await page.getByLabel('Defeat Mode').selectOption('heavy');
    await page.getByRole('button', { name: 'Defeat AI' }).click();
    
    const defeatedText = await page.locator('.bg-gray-700.border.border-gray-600.rounded-md.p-4').innerText();
    
    // In heavy mode, each sentence should have nonsense inserted within it
    // The text should still contain the original words but with nonsense mixed in
    expect(defeatedText).toContain('AI');
    expect(defeatedText).toContain('write');
    expect(defeatedText).toContain('like me');
    
    // The defeated text should be significantly longer
    expect(defeatedText.length).toBeGreaterThan(testText.length * 1.3);
    
    // Check that sentences still end with proper punctuation
    expect(defeatedText).toMatch(/\./g);
  });

  test('normal mode should insert nonsense frequently', async ({ page }) => {
    const testText = 'First sentence. Second sentence. Third sentence. Fourth sentence. Fifth sentence.';
    
    await page.getByLabel('Your Original Text').fill(testText);
    await page.getByLabel('Defeat Mode').selectOption('normal');
    await page.getByRole('button', { name: 'Defeat AI' }).click();
    
    const defeatedText = await page.locator('.bg-gray-700.border.border-gray-600.rounded-md.p-4').innerText();
    
    // Normal mode should add nonsense frequently (at least 2 insertions for 5 sentences)
    const nonsenseCount = (defeatedText.match(/\. [A-Z][^.!?]+\./g) || []).length;
    expect(nonsenseCount).toBeGreaterThanOrEqual(2);
  });

  test('light mode should insert nonsense occasionally', async ({ page }) => {
    const testText = 'First sentence. Second sentence. Third sentence. Fourth sentence. Fifth sentence. Sixth sentence.';
    
    await page.getByLabel('Your Original Text').fill(testText);
    await page.getByLabel('Defeat Mode').selectOption('light');
    await page.getByRole('button', { name: 'Defeat AI' }).click();
    
    const defeatedText = await page.locator('.bg-gray-700.border.border-gray-600.rounded-md.p-4').innerText();
    
    // Light mode should add nonsense occasionally (at least 1 insertion for 6 sentences)
    const nonsenseCount = (defeatedText.match(/\. [A-Z][^.!?]+\./g) || []).length;
    expect(nonsenseCount).toBeGreaterThanOrEqual(1);
    
    // But not too many (less than heavy mode would)
    expect(nonsenseCount).toBeLessThan(5);
  });

  test('UI labels should reflect correct frequencies', async ({ page }) => {
    // Check that the select options have the updated labels
    const lightOption = page.locator('option[value="light"]');
    const normalOption = page.locator('option[value="normal"]');
    const heavyOption = page.locator('option[value="heavy"]');
    
    await expect(lightOption).toHaveText('Light - Insert nonsense in ~25% of sentences');
    await expect(normalOption).toHaveText('Normal - Insert nonsense in ~50% of sentences');
    await expect(heavyOption).toHaveText('Heavy - Insert nonsense in EVERY sentence');
  });
});