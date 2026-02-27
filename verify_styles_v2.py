from playwright.sync_api import sync_playwright

def verify_toast_and_styles():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        try:
            print("Navigating to home page...")
            page.goto("http://localhost:3000", timeout=60000)

            # Wait for content to load
            print("Waiting for content...")
            page.wait_for_selector(".group.relative", timeout=10000)

            # Check Tailwind styles
            print("Checking Tailwind styles...")
            body_bg = page.evaluate("getComputedStyle(document.body).backgroundColor")
            print(f"Body background: {body_bg}")

            # Hover over the first product card to reveal the add button
            print("Interacting with product card...")
            card = page.locator(".group.relative").first
            card.hover()

            # Click the add to cart button
            print("Adding to cart...")
            add_btn = card.locator("button:has-text('Thêm nhanh')")
            # Force click because of potential overlapping elements or animations
            add_btn.click(force=True)

            # Wait for toast notification
            print("Waiting for toast...")
            # The toast has class 'animate-scale-up' or similar from ToastContext
            # Use a broader selector or text match if needed
            toast = page.locator("text='Đã thêm'")
            toast.wait_for(state="visible", timeout=5000)

            # Take screenshot of the toast and page
            print("Taking screenshot...")
            page.screenshot(path="verification_success.png", full_page=True)
            print("Success!")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_toast_and_styles()
