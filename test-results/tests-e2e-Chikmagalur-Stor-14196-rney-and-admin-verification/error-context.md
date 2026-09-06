# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e.spec.js >> Chikmagalur Store E2E Tests >> Complete user journey and admin verification
- Location: tests\e2e.spec.js:4:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="John Doe"]')

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - generic [ref=f1e6]:
      - link "CHIKMAGALUR Filter Coffee" [ref=f1e8] [cursor=pointer]:
        - /url: /
        - text: CHIKMAGALUR
        - generic [ref=f1e9]: Filter Coffee
      - navigation [ref=f1e10]:
        - link "Home" [ref=f1e11] [cursor=pointer]:
          - /url: /
        - link "Shop" [ref=f1e12] [cursor=pointer]:
          - /url: /shop
        - link "Franchise" [ref=f1e13] [cursor=pointer]:
          - /url: /franchise
        - link "Contact" [ref=f1e14] [cursor=pointer]:
          - /url: /contact
      - generic [ref=f1e15]:
        - link "Profile" [ref=f1e16] [cursor=pointer]:
          - /url: /profile
          - generic [ref=f1e21]: Account
        - button "Shopping cart with 2 items" [ref=f1e22] [cursor=pointer]:
          - generic [ref=f1e26]: "2"
  - main [ref=f1e27]:
    - generic [ref=f1e32]:
      - heading "Join the Family" [level=2] [ref=f1e37]
      - paragraph [ref=f1e38]: Create an account for a seamless checkout experience.
      - generic [ref=f1e39]:
        - generic [ref=f1e40]:
          - generic [ref=f1e41]: Full Name
          - textbox "Your Name" [ref=f1e43]
        - generic [ref=f1e44]:
          - generic [ref=f1e45]: Email Address
          - textbox "you@example.com" [ref=f1e47]
        - generic [ref=f1e48]:
          - generic [ref=f1e49]: Password
          - textbox "••••••••" [ref=f1e51]
        - button "Create Account" [ref=f1e52]
      - paragraph [ref=f1e56]:
        - text: Already have an account?
        - button "Sign In" [active] [ref=f1e57]
  - contentinfo [ref=f1e58]:
    - generic [ref=f1e59]:
      - generic [ref=f1e60]:
        - generic [ref=f1e61]:
          - heading "CHIKMAGALUR COFFEE WORKS" [level=3] [ref=f1e62]
          - paragraph [ref=f1e63]: Bringing you the finest Chikmagalur coffee. Experience the rich heritage and perfect aroma in every cup.
          - generic [ref=f1e64]:
            - link [ref=f1e65] [cursor=pointer]:
              - /url: "#"
            - link [ref=f1e68] [cursor=pointer]:
              - /url: "#"
            - link [ref=f1e72] [cursor=pointer]:
              - /url: "#"
        - generic [ref=f1e75]:
          - heading "QUICK LINKS" [level=3] [ref=f1e76]
          - list [ref=f1e77]:
            - listitem [ref=f1e78]:
              - link "Search" [ref=f1e79] [cursor=pointer]:
                - /url: /
            - listitem [ref=f1e80]:
              - link "Shop" [ref=f1e81] [cursor=pointer]:
                - /url: /shop
            - listitem [ref=f1e82]:
              - link "Franchise" [ref=f1e83] [cursor=pointer]:
                - /url: /franchise
            - listitem [ref=f1e84]:
              - link "About Us" [ref=f1e85] [cursor=pointer]:
                - /url: /
            - listitem [ref=f1e86]:
              - link "Contact" [ref=f1e87] [cursor=pointer]:
                - /url: /contact
        - generic [ref=f1e88]:
          - heading "POLICIES" [level=3] [ref=f1e89]
          - list [ref=f1e90]:
            - listitem [ref=f1e91]:
              - link "Shipping & Returns" [ref=f1e92] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=f1e93]:
              - link "Privacy Policy" [ref=f1e94] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=f1e95]:
              - link "Terms of Service" [ref=f1e96] [cursor=pointer]:
                - /url: "#"
        - generic [ref=f1e97]:
          - heading "CONTACT US" [level=3] [ref=f1e98]
          - list [ref=f1e99]:
            - listitem [ref=f1e100]:
              - link "Beside Dilsukhnagar Public school, Opposite Peddabavi Gardens, Badangpet, Ranga Reddy, Telangana - 500058" [ref=f1e104] [cursor=pointer]:
                - /url: https://maps.app.goo.gl/pTUVhB46Xc9ijihA6
                - text: Beside Dilsukhnagar Public school,Opposite Peddabavi Gardens,Badangpet, Ranga Reddy,Telangana - 500058
            - listitem [ref=f1e105]:
              - link "+91 81250 52714" [ref=f1e108] [cursor=pointer]:
                - /url: tel:+918125052714
            - listitem [ref=f1e109]:
              - link "Chikmagalurhyderabad@gmail.com" [ref=f1e113] [cursor=pointer]:
                - /url: mailto:Chikmagalurhyderabad@gmail.com
      - generic [ref=f1e114]:
        - paragraph [ref=f1e115]: © 2026 Chikmagalur Coffee Works. All rights reserved.
        - generic [ref=f1e116]: Preserving the Legacy of Indian Coffee Culture
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Chikmagalur Store E2E Tests', () => {
  4  |   test('Complete user journey and admin verification', async ({ page }) => {
  5  |     test.setTimeout(60000); // 60 seconds timeout
  6  | 
  7  |     // 1. Visit homepage
  8  |     await page.goto('http://localhost:3000/');
  9  |     await expect(page).toHaveTitle(/Chikmagalur/i);
  10 | 
  11 |     // 3. Login/Register
  12 |     await page.goto('http://localhost:3000/login');
  13 |     const testEmail = `e2etest_${Date.now()}@chikmagalur.com`;
  14 |     
  15 |     // Switch to Register tab
  16 |     await page.click('button:has-text("Sign Up")');
> 17 |     await page.fill('input[placeholder="John Doe"]', 'E2E User');
     |                ^ Error: page.fill: Test timeout of 60000ms exceeded.
  18 |     await page.fill('input[placeholder="you@example.com"]', testEmail);
  19 |     await page.fill('input[placeholder="••••••••"]', 'TestPassword123!');
  20 |     await page.click('button[type="submit"]:has-text("Create Account")');
  21 | 
  22 |     // Wait for redirect to home
  23 |     await expect(page).toHaveURL('http://localhost:3000/');
  24 | 
  25 |     // 4. Add items to cart
  26 |     await page.click('text=Shop Now');
  27 |     
  28 |     // Add first product
  29 |     await page.locator('button:has-text("Quick Add")').first().click();
  30 |     
  31 |     // Wait for drawer to open and close it
  32 |     await expect(page.locator('text=Your Cart')).toBeVisible();
  33 |     await page.click('button:has(.lucide-x)'); // Close cart (assuming it has X icon)
  34 | 
  35 |     // 5. Checkout Process
  36 |     await page.click('header button:has(.lucide-shopping-bag)');
  37 |     await page.click('text=Proceed to Checkout');
  38 | 
  39 |     // Fill checkout form (Wait for modal to be visible)
  40 |     await expect(page.locator('text=Direct Roastery Checkout')).toBeVisible();
  41 |     
  42 |     // Use new address if option exists, otherwise just fill the default empty fields
  43 |     const addAddressBtn = page.locator('text=Add New Delivery Address');
  44 |     if (await addAddressBtn.isVisible()) {
  45 |       await addAddressBtn.click();
  46 |     }
  47 | 
  48 |     await page.fill('input[placeholder="John Doe"]', 'E2E Test User');
  49 |     await page.fill('input[placeholder="+91 9876543210"]', '+91 9999999999');
  50 |     await page.fill('input[placeholder="123 Coffee Estate Road"]', '123 E2E Street');
  51 |     await page.fill('input[placeholder="Bengaluru"]', 'E2E City');
  52 | 
  53 |     await page.click('button:has-text("Place Order")');
  54 | 
  55 |     // Wait for success screen
  56 |     await expect(page.locator('text=Order Successfully Placed')).toBeVisible();
  57 |     await page.click('button:has-text("Continue Shopping")');
  58 | 
  59 |     // 6. Verify Admin Dashboard
  60 |     await page.click('text=Admin Panel');
  61 |     await expect(page).toHaveURL('http://localhost:3000/admin');
  62 | 
  63 |     // Go to Orders tab
  64 |     await page.click('button:has-text("Orders")');
  65 |     await expect(page.locator('h2:has-text("Order Management")')).toBeVisible();
  66 | 
  67 |     // Verify the newly placed order is present
  68 |     await expect(page.locator('td:has-text("E2E Test User")').first()).toBeVisible();
  69 |   });
  70 | });
  71 | 
```