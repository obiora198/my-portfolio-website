import { test, expect } from '@playwright/test';

test.describe('VTU Services Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the services API
    await page.route('**/api/vtu/services*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: '000',
          content: [
            { serviceID: 'mtn', name: 'MTN Airtime', image: 'https://example.com/mtn.png' },
            { serviceID: 'glo', name: 'GLO Airtime', image: 'https://example.com/glo.png' },
          ]
        }),
      });
    });

    // Mock transaction history
    await page.route('**/api/vtu/history', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/vtu');
  });

  test('should display hero section and services', async ({ page }) => {
    // Check Hero title
    await expect(page.locator('h1')).toContainText('Stay Connected');

    // Check Services title
    await expect(page.getByRole('heading', { name: 'Our Services', exact: true })).toBeVisible();

    // Check if services grid is visible
    const servicesGrid = page.locator('section').filter({ hasText: 'Our Services' });
    await expect(servicesGrid).toBeVisible();
  });

  test('should open purchase modal when clicking a service', async ({ page }) => {
    // Click on Airtime Top-up service
    await page.click('text=Airtime Top-up');

    // Check if modal is visible - use getByRole to be more specific
    const modal = page.locator('div[role="dialog"], .relative.w-full.max-w-2xl');
    await expect(modal.getByRole('heading', { name: 'Purchase Services' })).toBeVisible();

    // Check if tabs are visible
    await expect(modal.getByRole('button', { name: 'Airtime', exact: true })).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Data', exact: true })).toBeVisible();
  });

  test('should show validation error for invalid phone number', async ({ page }) => {
    await page.click('text=Airtime Top-up');

    const modal = page.locator('div[role="dialog"], .relative.w-full.max-w-2xl');
    await expect(modal).toBeVisible();

    const serviceButton = modal.locator('button').filter({ hasText: 'MTN' }).first();
    await serviceButton.waitFor({ state: 'visible' });
    await serviceButton.click();

    // Fill phone FIRST, as amount depends on it in the current UI logic
    const phoneInput = modal.locator('input[placeholder="08012345678"]');
    await phoneInput.fill('12345');

    // Amount should now be visible
    const amountInput = modal.locator('input[placeholder="Enter amount"]');
    await amountInput.waitFor({ state: 'visible' });
    await amountInput.fill('100');

    // Check for error message
    await expect(modal.locator('text=Enter valid Nigerian number')).toBeVisible();
  });

  test('should perform airtime purchase successfully with mocked API', async ({ page }) => {
    // Mock the pay API
    await page.route('**/api/vtu/pay', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: '000',
          response_description: 'TRANSACTION SUCCESSFUL',
          content: {
            transactions: {
              status: 'delivered',
              requestId: '202604141200abc'
            }
          }
        }),
      });
    });

    await page.click('text=Airtime Top-up');
    const modal = page.locator('div[role="dialog"], .relative.w-full.max-w-2xl');
    await expect(modal).toBeVisible();

    const serviceButton = modal.locator('button').filter({ hasText: 'MTN' }).first();
    await serviceButton.waitFor({ state: 'visible' });
    await serviceButton.click();

    await modal.locator('input[placeholder="08012345678"]').fill('08012345678');

    // Amount should be visible after phone
    const amountInput = modal.locator('input[placeholder="Enter amount"]');
    await amountInput.waitFor({ state: 'visible' });
    await amountInput.fill('100');

    // Click Pay Now
    const payButton = modal.locator('button:has-text("Pay Now")');
    await payButton.click();

    // Check for success modal
    await expect(page.locator('text=Transaction successful!')).toBeVisible({ timeout: 10000 });
  });

  test('should verify smartcard and pay for TV subscription', async ({ page }) => {
    // Mock services for TV tab
    await page.route('**/api/vtu/services?identifier=tv-subscription', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: '000',
          content: [{ serviceID: 'dstv', name: 'DStv', image: 'https://example.com/dstv.png' }]
        }),
      });
    });

    // Mock variations for TV
    await page.route('**/api/vtu/service-variations?serviceID=dstv*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: {
            variations: [
              { variation_code: 'dstv-padi', name: 'DStv Padi', variation_amount: '2500' }
            ]
          }
        }),
      });
    });

    // Mock merchant verify
    await page.route('**/api/vtu/merchant-verify', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: '000',
          content: {
            Customer_Name: 'JOHN DOE'
          }
        }),
      });
    });

    await page.click('text=Cable TV');

    const modal = page.locator('div[role="dialog"], .relative.w-full.max-w-2xl');
    await expect(modal).toBeVisible();

    // Switch to TV tab in modal
    await modal.getByRole('button', { name: 'TV', exact: true }).click();

    // Wait for services to refresh
    const dstvButton = modal.locator('button').filter({ hasText: 'DStv' }).first();
    await dstvButton.waitFor({ state: 'visible', timeout: 10000 });
    await dstvButton.click();

    // Select plan - handle CustomSelect dropdown
    await modal.locator('text=Choose a plan...').click();

    // Select the plan button in the dropdown
    const planOption = page.locator('button').filter({ hasText: 'DStv Padi' }).first();
    await planOption.waitFor({ state: 'visible', timeout: 10000 });
    await planOption.click();

    // Fill smartcard
    await modal.locator('input[placeholder="Enter smartcard number"]').fill('1212121212');

    // Click verify
    await modal.locator('button:has-text("Verify Number")').click();
    await expect(modal.locator('text=JOHN DOE')).toBeVisible({ timeout: 10000 });

    // Fill phone
    const phoneInput = modal.locator('input[placeholder="08012345678"]');
    await phoneInput.fill('08012345678');

    // Ensure button is enabled before clicking
    const payButton = modal.locator('button:has-text("Pay Now")');
    await expect(payButton).toBeEnabled();

    // Mock pay
    await page.route('**/api/vtu/pay', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: '000',
          content: {
            transactions: {
              status: 'delivered',
              requestId: 'TV-123456'
            }
          }
        }),
      });
    });

    await payButton.click();

    // Use Success! text as it's more prominent as a heading
    await expect(page.locator('h3:has-text("Success!")')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Transaction successful!')).toBeVisible();
  });
});
