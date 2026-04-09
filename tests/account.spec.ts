import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DarazPage } from '../pages/DarazPage';
import testData from '../data/testData.json';

test.describe('Auth & Language', () => {
  let daraz: DarazPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    daraz = new DarazPage(page);
    loginPage = new LoginPage(page);
    await daraz.navigate();
  });

  test('TC-01: Login Validation', async ({ page }) => {
    await loginPage.login(testData.user.email, testData.user.password);
    // Assert : user name is displayed in the user button 
    await expect(page.locator('#myAccountTrigger')).toHaveText(new RegExp(testData.user.displayName, 'i'));
  });

  test('TC-02: Language Change', async ({ page }) => {
    await daraz.switchLanguage(testData.user.language);
    // assert : help and support is showing in English
    await expect(page.getByText(/Help & Support/i)).toBeVisible();
    // aseert : change language button is not in english
    await expect(page.getByText(/භාෂාව තෝරන්න/i)).toBeVisible();
  });
});