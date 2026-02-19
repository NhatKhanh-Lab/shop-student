
import os
import time
from playwright.sync_api import sync_playwright, expect

def verify_toast_and_navbar():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        # 1. Navigate to Home
        print("Navigating to home page...")
        try:
            page.goto("http://localhost:3000", timeout=60000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            # Try checking the log file
            if os.path.exists("dev_server.log"):
                with open("dev_server.log", "r") as f:
                    print("Dev Server Log:")
                    print(f.read())
            raise

        # Wait for content to load
        page.wait_for_load_state("networkidle")

        # Take initial screenshot
        os.makedirs("verification", exist_ok=True)
        page.screenshot(path="verification/home_initial.png")
        print("Initial screenshot taken.")

        # 2. Add to Cart (Trigger Toast)
        print("Triggering Add to Cart...")
        # Find a product card. ProductCard has a link to /product/:id.
        # Inside it, there is a button for add to cart.
        # In ProductCard.tsx:
        # Desktop overlay button: text "Thêm nhanh"
        # Mobile button: icon "add"

        # We are on desktop viewport (1280px).
        # The overlay button appears on hover.
        # But we can also click it if we force it or just use the mobile button if visible?
        # Actually, let's hover the first product card.

        product_cards = page.locator("a[href^='/product/']")
        if product_cards.count() > 0:
            first_card = product_cards.first
            print("Found product card, hovering...")
            first_card.hover()

            # Click "Thêm nhanh" button
            add_btn = first_card.locator("button:has-text('Thêm nhanh')")
            if add_btn.is_visible():
                add_btn.click()
            else:
                # Fallback: try to find any button with 'add_shopping_cart' icon or similar
                print("Thêm nhanh button not visible, trying generic add button...")
                first_card.locator("button").first.click()
        else:
            print("No product cards found!")
            return

        # 3. Verify Toast
        print("Verifying Toast...")
        # Toast container: fixed bottom-4 right-4
        # Toast item text: "Giỏ hàng" or "Đã thêm"

        toast = page.locator("text=Giỏ hàng").first
        try:
            expect(toast).to_be_visible(timeout=5000)
            print("Toast is visible!")
        except Exception as e:
            print("Toast did not appear.")
            page.screenshot(path="verification/toast_failed.png")
            raise e

        # Take screenshot of toast
        page.screenshot(path="verification/toast_success.png")

        # 4. Verify Navbar Structure (Static check)
        print("Verifying Navbar structure...")
        # Check for the pt-2 class on the dropdown container
        # The dropdown is likely inside the User Menu.
        # If user is NOT logged in, the dropdown is NOT rendered.
        # AuthContext default state is loading -> check firebase -> null.
        # So likely we are not logged in.

        # We can check the Login button is present
        login_btn = page.locator("text=Đăng nhập")
        if login_btn.is_visible():
            print("User is not logged in. Cannot verify User Menu dropdown visually.")
            print("However, we can verify the 'Login' button style or presence.")
        else:
            # If by some miracle we are logged in (e.g. persistent state?)
            print("User is logged in (unexpected). Checking dropdown.")
            avatar = page.locator("img[alt='User Avatar']") # or similar
            if avatar.is_visible():
                avatar.hover()
                dropdown = page.locator("div.absolute.right-0.top-full.pt-2")
                expect(dropdown).to_be_attached()
                print("Dropdown with pt-2 found in DOM.")

        browser.close()

if __name__ == "__main__":
    verify_toast_and_navbar()
