from playwright.sync_api import sync_playwright
import os

# Example: Automating static HTML files using file:// URLs

# Path to your HTML file
html_file = os.path.abspath('sample-app/index.html')
file_url = f'file://{html_file}'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # Use headed mode for visibility
    page = browser.new_page()

    # Navigate to local HTML file
    page.goto(file_url)
    
    # For static HTML, no need to wait for networkidle
    # Just wait for the DOM to be ready
    page.wait_for_load_state('domcontentloaded')

    # Get page title
    title = page.title()
    print(f"Page title: {title}")

    # Get all text content
    body_text = page.locator('body').inner_text()
    print(f"\nPage content preview:\n{body_text[:500]}...")

    # Take screenshot
    page.screenshot(path='/tmp/static_page.png', full_page=True)
    print("\nScreenshot saved to /tmp/static_page.png")

    browser.close()
