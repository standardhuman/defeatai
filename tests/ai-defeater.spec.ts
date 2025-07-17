import { test, expect } from '@playwright/test';

test.describe('AI Defeater', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main UI elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'AI Defeater' })).toBeVisible();
    await expect(page.getByText('Using cutting-edge AI technology to make AI completely useless')).toBeVisible();
    
    await expect(page.getByLabel('Defeat Mode')).toBeVisible();
    await expect(page.getByLabel('Your Original Text')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Defeat AI' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible();
  });

  test('should defeat text in normal mode', async ({ page }) => {
    const testText = 'This is my original text. I want to protect it from AI training. It contains multiple sentences to test the insertion. We need to make sure the AI defeater works properly. This text should definitely trigger some nonsense insertions.';
    
    await page.getByLabel('Your Original Text').fill(testText);
    await page.getByRole('button', { name: 'Defeat AI' }).click();
    
    await expect(page.getByText('AI-Defeated Text')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy to Clipboard' })).toBeVisible();
    
    const defeatedTextElement = page.locator('.bg-gray-700.border.border-gray-600.rounded-md.p-4');
    const defeatedText = await defeatedTextElement.innerText();
    
    expect(defeatedText).toContain('This is my original text');
    expect(defeatedText.length).toBeGreaterThanOrEqual(testText.length);
    
    await expect(page.getByText('Performance Metrics')).toBeVisible();
    await expect(page.getByText('Original length:')).toBeVisible();
    await expect(page.getByText('Enhanced length:')).toBeVisible();
    await expect(page.getByText('Nonsense density:')).toBeVisible();
    await expect(page.getByText('Confusion factor:')).toBeVisible();
  });

  test('should work with different defeat modes', async ({ page }) => {
    const testText = 'Short test text for mode testing.';
    
    const modes = ['light', 'normal', 'heavy'];
    
    for (const mode of modes) {
      await page.getByLabel('Defeat Mode').selectOption(mode);
      await page.getByLabel('Your Original Text').fill(testText);
      await page.getByRole('button', { name: 'Defeat AI' }).click();
      
      const defeatedTextElement = page.locator('.bg-gray-700.border.border-gray-600.rounded-md.p-4');
      const defeatedText = await defeatedTextElement.innerText();
      
      expect(defeatedText).toContain('Short');
      expect(defeatedText).toContain('test');
      expect(defeatedText).toContain('text');
      
      await page.getByRole('button', { name: 'Clear' }).click();
    }
  });

  test('should clear all fields when Clear is clicked', async ({ page }) => {
    await page.getByLabel('Your Original Text').fill('Test text for clearing.');
    await page.getByRole('button', { name: 'Defeat AI' }).click();
    
    await expect(page.getByText('AI-Defeated Text')).toBeVisible();
    await page.waitForTimeout(500); // Wait for state update
    
    await page.getByRole('button', { name: 'Clear' }).click();
    
    await expect(page.getByLabel('Your Original Text')).toHaveValue('');
    await expect(page.getByText('AI-Defeated Text')).not.toBeVisible();
    await expect(page.getByText('Performance Metrics')).not.toBeVisible();
  });

  test('should not process empty text', async ({ page }) => {
    await page.getByRole('button', { name: 'Defeat AI' }).click();
    
    await expect(page.getByText('AI-Defeated Text')).not.toBeVisible();
    await expect(page.getByText('Performance Metrics')).not.toBeVisible();
  });

  test('should handle long text properly', async ({ page }) => {
    const longText = `AI will never be able to write like me. Why? Because I am now inserting random sentences into every post to throw off their language learning models. Any AI emulating me will radiate nonsense. I write all my emails and reports like this to protect my data. I suggest all writers and artists do the same. The robot nerds will never get the better of us. We can defeat AI. We just have to talk like this. All. The. Time.`;
    
    await page.getByLabel('Your Original Text').fill(longText);
    await page.getByLabel('Defeat Mode').selectOption('heavy');
    await page.getByRole('button', { name: 'Defeat AI' }).click();
    
    const defeatedTextElement = page.locator('.bg-gray-700.border.border-gray-600.rounded-md.p-4');
    const defeatedText = await defeatedTextElement.innerText();
    
    expect(defeatedText.length).toBeGreaterThan(longText.length);
    
    const statsText = await page.locator('.bg-gray-700.rounded-md.p-4').last().innerText();
    expect(statsText).toContain('insertions');
  });

  test('should copy text to clipboard', async ({ page, browserName }) => {
    // Skip clipboard test on Firefox and WebKit due to permission limitations
    test.skip(browserName === 'firefox' || browserName === 'webkit', 'Clipboard API not fully supported');
    
    const testText = 'Text to copy to clipboard.';
    await page.getByLabel('Your Original Text').fill(testText);
    await page.getByRole('button', { name: 'Defeat AI' }).click();
    
    // Just verify the button works without checking actual clipboard
    await page.getByRole('button', { name: 'Copy to Clipboard' }).click();
    
    // We can at least verify the button is clickable and doesn't error
    await expect(page.getByRole('button', { name: 'Copy to Clipboard' })).toBeVisible();
  });
});

test.describe('AI Defeater API', () => {
  test('should process text via API endpoint', async ({ request }) => {
    const response = await request.post('/api/defeat', {
      data: {
        text: 'Test text for API. This needs to be longer to ensure nonsense gets added. We want to make sure the API endpoint works correctly.',
        mode: 'normal'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('original');
    expect(data).toHaveProperty('defeated');
    expect(data).toHaveProperty('stats');
    expect(data.original).toBe('Test text for API. This needs to be longer to ensure nonsense gets added. We want to make sure the API endpoint works correctly.');
    expect(data.defeated.length).toBeGreaterThanOrEqual(data.original.length);
    expect(data.stats).toHaveProperty('originalLength');
    expect(data.stats).toHaveProperty('defeatedLength');
    expect(data.stats).toHaveProperty('nonsenseInserted');
    expect(data.stats).toHaveProperty('percentageIncrease');
  });

  test('should handle invalid API requests', async ({ request }) => {
    const response = await request.post('/api/defeat', {
      data: {
        mode: 'normal'
      }
    });
    
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Text is required');
  });

  test('should handle invalid mode in API', async ({ request }) => {
    const response = await request.post('/api/defeat', {
      data: {
        text: 'Test text',
        mode: 'invalid'
      }
    });
    
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Invalid mode');
  });
});