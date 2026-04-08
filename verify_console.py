import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        page.on("console", lambda msg: print(f"Browser Console [{msg.type}]: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser Error: {err.message}"))

        try:
            await page.goto("http://localhost:3000/")
            await page.wait_for_selector('a.group', timeout=10000)

            product_cards = await page.locator('a.group').all()
            if not product_cards:
                print("No product cards found!")
                return

            await product_cards[0].hover()
            await page.wait_for_timeout(500)

            add_button = product_cards[0].locator('button:has-text("Thêm nhanh")')
            await add_button.click()

            print("Clicked 'Thêm nhanh', waiting 3 seconds...")
            await page.wait_for_timeout(3000)

        except Exception as e:
            print(f"Error during verification: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
