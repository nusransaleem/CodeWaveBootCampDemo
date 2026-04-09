import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginTrigger: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginTrigger = page.locator('#anonLogin');
    this.emailInput = page.locator('input[type="text"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginBtn = page.getByRole('button', { name: 'LOGIN' });
  }

  async login(email: string, pass: string) {
    await this.loginTrigger.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginBtn.click();
    // Ensure login finishes by checking the account trigger
    await expect(this.page.locator('#myAccountTrigger')).toBeVisible({ timeout: 15000 });
  }
}