import { test, expect } from '@playwright/test';

test.describe('Chikmagalur Store E2E Tests', () => {
  test('Complete user journey and admin verification', async ({ page }) => {
    test.setTimeout(60000); // 60 seconds timeout

    // 1. Visit homepage
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle(/Chikmagalur/i);

    // 3. Login/Register
    await page.goto('http://localhost:3000/login');
    const testEmail = `e2etest_${Date.now()}@chikmagalur.com`;
    
    // Switch to Register tab
    await page.click('button:has-text("Sign Up")');
    await page.fill('input[placeholder="John Doe"]', 'E2E User');
    await page.fill('input[placeholder="you@example.com"]', testEmail);
    await page.fill('input[placeholder="••••••••"]', 'TestPassword123!');
    await page.click('button[type="submit"]:has-text("Create Account")');

    // Wait for redirect to home
    await expect(page).toHaveURL('http://localhost:3000/');

    // 4. Add items to cart
    await page.click('text=Shop Now');
    
    // Add first product
    await page.locator('button:has-text("Quick Add")').first().click();
    
    // Wait for drawer to open and close it
    await expect(page.locator('text=Your Cart')).toBeVisible();
    await page.click('button:has(.lucide-x)'); // Close cart (assuming it has X icon)

    // 5. Checkout Process
    await page.click('header button:has(.lucide-shopping-bag)');
    await page.click('text=Proceed to Checkout');

    // Fill checkout form (Wait for modal to be visible)
    await expect(page.locator('text=Direct Roastery Checkout')).toBeVisible();
    
    // Use new address if option exists, otherwise just fill the default empty fields
    const addAddressBtn = page.locator('text=Add New Delivery Address');
    if (await addAddressBtn.isVisible()) {
      await addAddressBtn.click();
    }

    await page.fill('input[placeholder="John Doe"]', 'E2E Test User');
    await page.fill('input[placeholder="+91 9876543210"]', '+91 9999999999');
    await page.fill('input[placeholder="123 Coffee Estate Road"]', '123 E2E Street');
    await page.fill('input[placeholder="Bengaluru"]', 'E2E City');

    await page.click('button:has-text("Place Order")');

    // Wait for success screen
    await expect(page.locator('text=Order Successfully Placed')).toBeVisible();
    await page.click('button:has-text("Continue Shopping")');

    // 6. Verify Admin Dashboard
    await page.click('text=Admin Panel');
    await expect(page).toHaveURL('http://localhost:3000/admin');

    // Go to Orders tab
    await page.click('button:has-text("Orders")');
    await expect(page.locator('h2:has-text("Order Management")')).toBeVisible();

    // Verify the newly placed order is present
    await expect(page.locator('td:has-text("E2E Test User")').first()).toBeVisible();
  });
});
