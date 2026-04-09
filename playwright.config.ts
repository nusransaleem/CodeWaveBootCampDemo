/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel. 
     Note: Our cart.spec.ts will override this to run serially. 
  */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI to avoid account locking.
     On local, 'undefined' uses default parallelism based on CPU cores.
  */
  workers: process.env.CI ? 2 : undefined,
  /* Maximum time one test can run for. */
  timeout: 60000,

  reporter: [['html'], ['list']],
  
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://www.daraz.lk',
    locale: 'en-US',
    timezoneId: 'Asia/Colombo',
    
    /* Required for --start-maximized to work correctly */
    viewport: null, 
    
    launchOptions: {
      args: ['--start-maximized']
    },

    /* Collect trace when retrying the failed test. */
    trace: 'retain-on-failure',
    screenshot: 'on', 
    /* Other helpful settings for failures */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});