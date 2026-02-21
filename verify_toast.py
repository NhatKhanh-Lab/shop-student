
from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_toast(page: Page):
    # Go to products page
    page.goto("http://localhost:4173/#/products")

    # Wait for products to load (assuming there are some)
    # The page might show "Loading..." or similar.
    # Let's wait for a product card.
    page.wait_for_selector(".group.relative.bg-white", timeout=10000)

    # Find a "Add to Cart" button.
    # In ProductCard.tsx: <button onClick={handleAddToCart} ...>Thêm nhanh</button> (desktop overlay)
    # or mobile button: <button ...><span ...>add</span></button>

    # Let's target the "Thêm nhanh" button. It's hidden by default on desktop until hover.
    # But Playwright can click hidden elements if we force it or hover first.

    # Let's hover over the first product card.
    first_product = page.locator(".group.relative.bg-white").first
    first_product.hover()

    # Now click "Thêm nhanh".
    add_btn = first_product.get_by_text("Thêm nhanh")
    add_btn.click()

    # Wait for toast
    # Toast container: fixed bottom-4 right-4
    # Toast item: animate-slide-in

    toast = page.locator(".animate-slide-in").first
    expect(toast).to_be_visible()

    # Take screenshot
    time.sleep(1) # Wait for animation
    page.screenshot(path="/home/jules/verification/toast_verification.png")
    print("Screenshot saved to /home/jules/verification/toast_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_toast(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/error.png")
        finally:
            browser.close()
