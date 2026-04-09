import { Page, Locator, expect } from '@playwright/test';

export class DarazPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[type="search"]');
    this.cartBadge = page.locator('#topActionCartNumber');
  }

  async navigate() {
    await this.page.goto('/');
    await this.closePopup();
  }

  async switchLanguage(lang: string) {
    const switchID = "#topActionSwitchLang";
    await this.page.locator(switchID).click({ force: true });
    await this.page.locator(`[data-lang="${lang}"]`).click({ force: true });
    await this.page.waitForLoadState('networkidle');
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async addToCart(productName: string) {
    await this.page.locator(`a:has-text("${productName}")`).first().click();
    await this.page.getByRole('button', { name: 'Add to Cart' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async removeFromCart(productName: string) {
    await this.cartBadge.click();
    await this.page.waitForLoadState('networkidle');
    const itemRow = this.page.locator('.cart-item-left', { hasText: productName });
    await itemRow.locator('input[type="checkbox"]').first().click();
    await this.page.locator('.automation-btn-delete').first().click();
    await this.page.locator('button:has-text("REMOVE")').click();
    await this.page.waitForLoadState('networkidle');
  }

  private async closePopup() {
    try {
      const closeBtn = this.page.locator('.popup-close, .close-btn').first();
      if (await closeBtn.isVisible({ timeout: 5000 })) await closeBtn.click();
    } catch (e) {}
  }
}