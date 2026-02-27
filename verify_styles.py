
from playwright.sync_api import sync_playwright

def verify_toast_and_styles():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Go to home page
            print("Navigating to home page...")
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            # Check for Tailwind classes being applied (e.g., background color)
            print("Checking for Tailwind styles...")
            body_bg = page.eval_on_selector("body", "e => getComputedStyle(e).backgroundColor")
            print(f"Body background color: {body_bg}")

            # Verify ProductCard styles
            print("Verifying product cards...")
            page.wait_for_selector(".group.relative.bg-white")

            # Trigger a toast by adding to cart
            print("Triggering toast notification...")
            # Find the first "Thêm nhanh" button (it's hidden by default, visible on hover)
            # We can force click it or hover first
            product_card = page.locator(".group.relative.bg-white").first
            product_card.hover()

            # Click the add to cart button
            add_btn = product_card.locator("button", has_text="Thêm nhanh")
            add_btn.click()

            # Wait for toast
            print("Waiting for toast...")
            toast = page.locator(".animate-scale-up").first
            toast.wait_for(state="visible", timeout=5000)

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification_toast.png", full_page=True)
            print("Screenshot saved to verification_toast.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="error_screenshot.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_toast_and_styles()
