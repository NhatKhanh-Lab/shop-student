from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Register
        print("Navigating to Login...")
        try:
            page.goto("http://localhost:4173/#/login", timeout=60000)

            print("Switching to register...")
            page.click("text=Đăng ký miễn phí")

            print("Registering...")
            page.fill("input[name='name']", "Toast Test User")
            page.fill("input[name='email']", "toast@example.com")
            page.fill("input[name='password']", "password123")
            page.fill("input[name='confirmPassword']", "password123")

            print("Submitting registration...")
            page.click("button:has-text('Đăng ký tài khoản')")

            # 2. Verify redirect and Toast
            print("Waiting for success toast...")
            # Toast should appear. Look for the toast container or content.
            # Toast message: "Chào mừng Toast Test User..."
            # Wait for selector .animate-scale-up which is the toast animation class
            toast = page.locator(".animate-scale-up")
            toast.first.wait_for(timeout=10000)
            print("Toast found!")

            # Screenshot IMMEDIATELY
            page.screenshot(path="verification_success.png")

        except Exception as e:
            print(f"Error during test: {e}")
            page.screenshot(path="verification_failed.png")

        browser.close()

if __name__ == "__main__":
    run()
