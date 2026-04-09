import { test, expect } from '@playwright/test';
import { DarazPage } from '../pages/DarazPage';
import { LoginPage } from '../pages/LoginPage';
import testData from '../data/testData.json';

/**
 * We use 'serial' mode because cart actions are stateful.
 * If these ran in parallel, they would conflict with each other on the same account.
 */
test.describe.configure({ mode: 'serial' });

test.describe('Cart Management Flow', () => {
  let daraz: DarazPage;
  let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        daraz = new DarazPage(page);
        loginPage = new LoginPage(page);

        await daraz.navigate();
        await loginPage.login(testData.user.email, testData.user.password);
    });

    test('TC-07: Add Product to Cart', async ({ page }) => {
        const { search_key,brand, model } = testData.products.headphones;

        //Capture count before
        const beforeCartItemCount = await daraz.cartBadge.innerText();

        // search
        await daraz.search(search_key);
        // select brand
        await daraz.page.locator(`span:has-text("${brand}")`).first().click();
        await daraz.page.waitForLoadState('networkidle');
        // add model to the cart
        await daraz.addToCart(model);

        // Assert success message
        await expect(page.getByText('Added to cart successfully!')).toBeVisible();

        // Close the success dialog to clean up the UI
        await page.locator('.next-dialog-close').click();

        // Assert cart badge count (assuming starting from 0)
        await expect(daraz.cartBadge).toHaveText((Number(beforeCartItemCount) + 1).toString());
    });

    test('TC-08: Persistent Cart on Refresh', async ({ page }) => {
        // Check that the item added in TC-07 is still there
        await expect(daraz.cartBadge).not.toHaveText('0');

        await page.reload();
        await page.waitForLoadState('networkidle');

        // Assert it remains after reload
        await expect(daraz.cartBadge).not.toHaveText('0');
    });

    test('TC-09: Remove Item from Cart (CRUD)', async () => {
        const { model } = testData.products.headphones;

        // Capture count before removal
        const beforeCartItemCount = await daraz.cartBadge.innerText();
        
        await daraz.removeFromCart(model);

        const newCount = Number(beforeCartItemCount) - 1;

        // If newCount is 1 or more, use the number; otherwise, use empty string
        const finalValue = newCount > 0 ? newCount.toString() : "";

        // We can also use simple math here if beforeValue was known
        await expect(daraz.cartBadge).toHaveText(finalValue, { timeout: 10000 });
    });
});