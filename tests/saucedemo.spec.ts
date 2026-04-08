import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('Sauce Demo - Essential Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // 1. Successful Login
  test('TC1 - should login successfully with valid credentials', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  // 2. Failed Login (Locked out user)
  test('TC2 - should show error for locked out user', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    const error = page.locator('[data-test="error"]');
    await expect(error).toContainText('Sorry, this user has been locked out.');
  });

  // 3. Form Validation (Empty password)
  test('TC3 - should show error when password is empty', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
  });

  // 4. Product Sorting (Price Low to High)
  test('TC4 - should sort products by price low to high', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const prices = await page.locator('.inventory_item_price').allInnerTexts();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
  });

  // 5. Add to Cart
  test('TC5 - should update cart badge when item is added', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  // 6. Remove from Cart (via Inventory Page)
  test('TC6 - should remove item and clear badge', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  // 7. Cart Persistence
  test('TC7 - item should remain in cart after navigating away and back', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  // 8. Individual Product Details
  test('TC8 - should navigate to product detail page', async ({ page }) => {
    await login(page);
    await page.locator('#item_4_title_link').click();
    await expect(page).toHaveURL(/inventory-item.html\?id=4/);
    await expect(page.locator('.inventory_details_name')).toBeVisible();
  });

  // 9. Complete End-to-End Checkout
  test('TC9 - should complete a successful checkout flow', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Info step
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Overview step
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  // 10. Logout
  test('TC10 - should logout successfully', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});

// Helper function to keep tests DRY
async function login(page) {
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
}
