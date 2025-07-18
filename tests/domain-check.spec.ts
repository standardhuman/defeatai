import { test, expect } from '@playwright/test';

test.describe('Domain Check', () => {
  test('should load monkeybot.wtf', async ({ page }) => {
    console.log('Checking monkeybot.wtf...');
    
    try {
      const response = await page.goto('https://monkeybot.wtf', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      console.log('Response status:', response?.status());
      console.log('Response URL:', response?.url());
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'domain-check.png' });
      
      // Check if it's our app
      const title = await page.title();
      console.log('Page title:', title);
      
      // Check for our app content
      const hasAIDefeater = await page.locator('text=AI Defeater').count();
      console.log('AI Defeater elements found:', hasAIDefeater);
      
      if (hasAIDefeater > 0) {
        console.log('SUCCESS: App loaded correctly');
        await expect(page.locator('text=AI Defeater')).toBeVisible();
      } else {
        console.log('App content not found. Page content:');
        const bodyText = await page.locator('body').innerText();
        console.log(bodyText.substring(0, 500) + '...');
      }
      
    } catch (error) {
      console.log('Error loading page:', error);
      throw error;
    }
  });

  test('should also check www.monkeybot.wtf', async ({ page }) => {
    console.log('Checking www.monkeybot.wtf...');
    
    try {
      const response = await page.goto('https://www.monkeybot.wtf', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      console.log('WWW Response status:', response?.status());
      console.log('WWW Response URL:', response?.url());
      
      const title = await page.title();
      console.log('WWW Page title:', title);
      
    } catch (error) {
      console.log('Error loading www version:', error);
      throw error;
    }
  });

  test('should check DNS propagation', async ({ page }) => {
    console.log('Checking DNS propagation...');
    
    // Check both with and without www
    const domains = ['monkeybot.wtf', 'www.monkeybot.wtf'];
    
    for (const domain of domains) {
      try {
        const response = await page.goto(`https://${domain}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        
        console.log(`${domain} - Status: ${response?.status()}, URL: ${response?.url()}`);
        
      } catch (error) {
        console.log(`${domain} - Error: ${error}`);
      }
    }
  });
});