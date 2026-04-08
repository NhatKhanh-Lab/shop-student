import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            # Go to the local dev server
            await page.goto("http://localhost:3000/")

            # Wait for products to load
            await page.wait_for_selector('a.group', timeout=10000)

            # Scroll down a bit to ensure products are in view
            await page.evaluate("window.scrollBy(0, 300)")
            await page.wait_for_timeout(1000)

            # Hover over the first product card to reveal the button
            product_cards = await page.locator('a.group').all()
            if not product_cards:
                print("No product cards found!")
                await browser.close()
                return

            await product_cards[0].hover()
            await page.wait_for_timeout(500)

            # Click the "Thêm nhanh" button inside the quick action overlay
            add_button = product_cards[0].locator('button:has-text("Thêm nhanh")')
            await add_button.click()

            # Wait for the toast notification to appear
            # The toast contains text "Giỏ hàng" or "Đã thêm"
            toast = page.locator('text="Đã thêm"')
            await toast.wait_for(timeout=5000)

            # Take a screenshot to verify the toast
            await page.screenshot(path="/home/jules/verification/screenshots/toast_success.png", full_page=True)
            print("Successfully verified Toast notification.")
        except Exception as e:
            print(f"Error during verification: {e}")
            await page.screenshot(path="/home/jules/verification/screenshots/error2.png")
            raise
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
