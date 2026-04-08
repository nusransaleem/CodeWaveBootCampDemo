import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 60000,
  use: {
    baseURL: 'https://www.daraz.lk',
    locale: 'en-US',
    viewport: { width: 1920, height: 1280 },
    launchOptions: {
      args: ['--start-maximized']
    },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});