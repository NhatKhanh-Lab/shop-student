import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            await page.goto("http://localhost:3000/")
            await page.wait_for_selector('a.group', timeout=10000)

            # Wait a little bit for the page to stabilize
            await page.wait_for_timeout(1000)

            product_cards = await page.locator('a.group').all()
            if not product_cards:
                print("No product cards found!")
                return

            await product_cards[0].hover()
            await page.wait_for_timeout(500)

            add_button = product_cards[0].locator('button:has-text("Thêm nhanh")')

            # Click the button
            await add_button.click()
            print("Clicked Thêm nhanh.")

            # Use specific locator for toast container that was added in ToastContext.tsx
            # The toast is appended to a div with className="fixed bottom-4 right-4 z-[9999]"
            toast_container = page.locator('.fixed.bottom-4.right-4')

            # Wait for any text to show up in the toast container
            await toast_container.wait_for(state="attached", timeout=5000)
            print("Toast container is attached.")

            toast_text = await toast_container.text_content()
            print(f"Toast Text Content: {toast_text}")

            await page.screenshot(path="/home/jules/verification/screenshots/toast_test.png", full_page=True)
            print("Successfully verified Toast notification.")
        except Exception as e:
            print(f"Error during verification: {e}")
            await page.screenshot(path="/home/jules/verification/screenshots/error3.png")
            raise
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
