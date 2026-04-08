import {
  Page,
  Locator,
  expect
} from '@playwright/test';

export class DarazPage {

  readonly page: Page;
  readonly searchInput: Locator;
  readonly cartBadge: Locator;
  readonly deleteBtn: Locator;
  readonly confirmRemoveBtn: Locator;

  constructor(page: Page) {
      this.page = page;
      this.searchInput = page.locator('input[type="search"]');
      this.cartBadge = page.locator('#topActionCartNumber');
      this.deleteBtn = page.locator('.automation-btn-delete').first();
      this.confirmRemoveBtn = page.locator('button:has-text("REMOVE")');
  }

  async navigate() {
      await this.page.goto('/');
      // Handle the initial promo popup if it appears
      await this.closePopup();
  }
  async search(keyword: string) {
      await this.searchInput.fill(keyword);
      await this.searchInput.press('Enter');
      await this.page.waitForLoadState('networkidle');
  }
  async addToCart(identifier: string) {
      const productLocator = this.page.locator(`a[title*="${identifier}"], a[href*="${identifier}"]`).first();
      // 1. Wait for it to be attached to the DOM
      await productLocator.waitFor({state: 'attached'});
      // 2. Scroll it into view (essential for long search result pages)
      await productLocator.scrollIntoViewIfNeeded();
      // 3. Perform the click
      await productLocator.click();
      await this.page.getByRole('button', {name: 'Add to Cart'}).click();
  }
  async removeFromCart(name_part: string) {
      await this.cartBadge.click();
      await this.page.waitForLoadState('networkidle');
      await this.tickCheckboxByProductName(name_part);
      await this.deleteBtn.click();
      await this.confirmRemoveBtn.click();
      // Wait for the "Cart is empty" state to trigger
      await this.page.waitForLoadState('networkidle');
  }
  async tickCheckboxByProductName(partialName: string) {
      const cartItem = this.page.locator('.cart-item-left', {hasText: partialName});
      await cartItem.locator('input[type="checkbox"]').first().click();
  }
  async closePopup() {
      const closePopup = this.page.locator('.popup-close, .close-btn').first();
      try {
          if (await closePopup.isVisible({
                  timeout: 5000
              })) {
              await closePopup.click();
          }
      } catch (e) {
          /* No popup appeared */ }
  }
}