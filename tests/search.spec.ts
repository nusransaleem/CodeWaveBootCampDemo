import { test, expect } from '@playwright/test';
import { DarazPage } from '../pages/DarazPage';
import testData from '../data/testData.json';

test.describe('Search Tests', () => {
    let daraz: DarazPage;

    test.beforeEach(async ({ page }) => {
        daraz = new DarazPage(page);
        await daraz.navigate();
    });

    test('TC-03: Search Product', async () => {
        const searchKey = testData.products.phones.search_key; // "samsung galaxy"
        await daraz.search(searchKey);
        //assert : filter label shows number of searched items
        await expect(daraz.page.locator('body')).toContainText(`items found for "${searchKey}"`, { ignoreCase: true });
    });

    test("TC-04: Search Auto-suggest Visibility", async ({page}) => {
        await daraz.searchInput.fill("Apple");
        // ASSERT : Check whether related products are list down when searching
        await expect(daraz.page.locator('div[class^="suggest-list"]')).toBeVisible();
        // We have to assert suggested items. (need to be implement)
    });

    test('TC-05: Price Filter', async ({ page }) => {
        const {search_key,min_price,max_price} = testData.products.watches;
        await daraz.search(search_key);
        await page.locator('input[placeholder="Min"]').fill(min_price);
        await page.locator('input[placeholder="Max"]').fill(max_price);
        await page.locator('.ant-btn-primary').click();
        const priceRegex = new RegExp(`price=${min_price}-${max_price}`);
        // assert : url contains min and max value
        await expect(page).toHaveURL(priceRegex);
        // assert for filter lable need to be added
        // assert for check whether filtered product are in the above range
    });

    test('TC-06: Brand Filter Application', async ({ page }) => {
        const { search_key, brand } = testData.products.laptops;
        await daraz.search(search_key);
        // Click brand filter
        await daraz.page.locator(`span:has-text("${brand}")`).first().click();
        await daraz.page.waitForLoadState('networkidle');
        //ASSERT: Check if the URL contains the brand name (lowercase)
        await expect(page).toHaveURL(new RegExp(brand.toLowerCase()));
    
        //ASSERT: Verify the "Filtered By" label appears if available
        const filterSection = page.getByText('Filtered By:').locator('..'); 
        await expect(filterSection).toContainText(brand);
      });
});