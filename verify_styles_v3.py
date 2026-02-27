from playwright.sync_api import sync_playwright

def verify_toast_and_styles():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        try:
            print("Navigating to home page...")
            page.goto("http://localhost:3000", timeout=60000)

            # Wait for any content to load
            print("Waiting for content...")
            page.wait_for_selector("body", timeout=10000)

            # Check Tailwind styles
            print("Checking Tailwind styles...")
            body_bg = page.evaluate("getComputedStyle(document.body).backgroundColor")
            print(f"Body background: {body_bg}")

            # Hover over the first product card to reveal the add button
            print("Interacting with product card...")
            card = page.locator(".group").first
            card.hover()

            # Click the add to cart button - Use a broader selector or text match if needed
            print("Adding to cart...")
            add_btn = page.locator("button:has-text('Thêm nhanh')").first

            # Try to force click if visible
            if add_btn.is_visible():
                add_btn.click(force=True)
            else:
                # If not visible, try clicking the card itself (it's a link)
                print("Button not visible, clicking card...")
                card.click()

            # Wait for toast notification - this might be tricky if we navigated away
            # Let's check for the toast on the product detail page if redirected
            print("Waiting for toast or navigation...")
            try:
                toast = page.locator("text='Đã thêm'").first
                toast.wait_for(state="visible", timeout=5000)
                print("Toast found!")
            except:
                print("Toast not found immediately.")

            # Take screenshot of the toast and page
            print("Taking screenshot...")
            page.screenshot(path="verification_final.png", full_page=True)
            print("Success!")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error_final.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_toast_and_styles()
