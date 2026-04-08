import {test,expect} from "@playwright/test";
import {DarazPage} from "../pages/DarazPage";

test.describe("Daraz LK: Core E-Commerce Flow", () => {

  let daraz: DarazPage;

  test.beforeEach(async ({page}) => {
      daraz = new DarazPage(page);
      await daraz.navigate();
  });

  test('TC-01: Login Validation (Postive Path)', async ({page}) => {
      await login(page);
      // ASSERT: Check whether user button visible with user name
      await expect(page.locator('#myAccountTrigger')).toHaveText(/CodeWaveTester's account/);
  });

  test("TC-02: Verify language change to English", async ({page}) => {
      const switchID = "#topActionSwitchLang";
      // SWITCH TO English
      await page.locator(switchID).waitFor({state: "visible"});
      await page.click(switchID, {force: true});
      const engOption = page.locator('[data-lang="en"]');
      await engOption.waitFor({ state: "visible"});
      await engOption.click({force: true});
      // ASSERTION: Check for Sinhala text in the language change button
      await expect(page.getByText("භාෂාව තෝරන්න"), "FAIL: UI did not switch back to English").toBeVisible({timeout: 15000});   
  });

  test("TC-03: Product Search Functionality", async ({page}) => {
      // 1. Perform the search
      await daraz.search("Samsung Galaxy");
      await page.waitForLoadState("networkidle");
      // ASSERTION: Check whether item found label appered for with searched item.
      await expect(page.locator("body")).toContainText(/items found for "samsung galaxy"/i);
  });

  test("TC-04: Search Auto-suggest Visibility", async ({page}) => {
      await daraz.searchInput.fill("Apple");
      // ASSERT : Check whether related products are list down when searching
      await expect(page.locator('div[class^="suggest-list"]')).toBeVisible();
  });

  test('TC-05: Price Range Validation', async ({page}) => {
      await daraz.search('Watch');
      await page.locator('input[placeholder="Min"]').fill('1000');
      await page.locator('input[placeholder="Max"]').fill('5000');
      await page.locator('.ant-btn-primary').click();
      // ASSERT : Check whether filtered price range in the url
      await expect(page).toHaveURL(/price=1000-5000/);
      // ASSERT : Check whether filtered price range in the label
  });

  test('TC-06: Brand Filter Application', async ({ page }) => {
    await daraz.search('Laptop');
    await page.locator('span:has-text("Lenovo")').first().click();
    // ASSERT : Check whether url filter with the brand name
    await expect(page).toHaveURL(/lenovo/);
    // ASSERT : Check filtered by label
    // to be added
  });

  test('TC-07: Add Product to Cart', async ({page}) => {
      await login(page);
      await daraz.search('Headphones');
      await page.locator('span:has-text("JBL")').first().click();
      await daraz.addToCart('720BT');
      await expect(page.getByText('Added to cart successfully!')).toBeVisible;
      await page.locator('.next-dialog-close').click();
      // ASSERT : Check whether cart icon value increased by 1
      await expect(daraz.cartBadge).toHaveText('1');
  });

  test('TC-08: Persistent Cart on Refresh', async ({page}) => {
      await login(page);
      await daraz.search('Bottle');
      await daraz.addToCart('500ml');
      await page.locator('.next-dialog-close').click();
      await page.reload();
      // ASSERT : Check whether cart icon not set to zero
      await expect(daraz.cartBadge).not.toHaveText('0');
  });

  test('TC-09: Remove Item from Cart (CRUD)', async ({page}) => {
      await login(page);
      await daraz.search('smart watches');

      const beforeValue = await daraz.cartBadge.innerText();
      await daraz.addToCart('T900');
  
      const closeBtn = page.locator('.next-dialog-close');
      await closeBtn.waitFor({ state: 'visible' });
      await closeBtn.click();
    
      await daraz.removeFromCart('T900');
      // ASSERT : check whether cart value is equal to the value that had before the adding removed item.
      await expect(daraz.cartBadge).toHaveText(beforeValue, { timeout: 10000 });
  });
});

async function login(page) {
  await page.locator('#anonLogin').click();
  await page.locator('input[type="text"]').fill('codewaveautomation@gmail.com');
  await page.locator('input[type="password"]').fill('CodeWaveTeste@001');
  await page.getByRole('button', {name: 'LOGIN'}).click();
}