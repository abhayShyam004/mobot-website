import http.server
import socketserver
import threading
import time
import sys
from playwright.sync_api import sync_playwright

PORT = 5183
DIRECTORY = "dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    def log_message(self, format, *args):
        pass  # suppress request logging

httpd = socketserver.TCPServer(("", PORT), Handler)
server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
server_thread.start()
print(f"[TEST] HTTP server serving {DIRECTORY} at http://localhost:{PORT}")

time.sleep(0.5)

errors = []
console_logs = []

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: errors.append(f"[PAGE ERROR] {err}"))

        print("[TEST] Navigating to page...")
        page.goto(f"http://localhost:{PORT}", wait_until="networkidle")

        # 1. Check favicon
        favicon_links = page.eval_on_selector_all('link[rel*="icon"]', 'els => els.map(e => ({ rel: e.rel, href: e.href }))')
        print(f"[TEST] Favicon links found: {len(favicon_links)}")
        for fav in favicon_links:
            print(f"  - {fav['rel']}: {fav['href']}")
        assert any("logo.png" in f['href'] or "favicon" in f['href'] for f in favicon_links), "No valid favicon found"

        # 2. Check Navbar logo
        nav_logo = page.query_selector('a[aria-label="MOBOT Homepage"] img')
        assert nav_logo is not None, "Navbar logo img element not found"
        nav_logo_info = page.evaluate('''(el) => ({
            src: el.src,
            naturalWidth: el.naturalWidth,
            naturalHeight: el.naturalHeight,
            clientWidth: el.clientWidth,
            clientHeight: el.clientHeight,
            visible: el.offsetWidth > 0 && el.offsetHeight > 0
        })''', nav_logo)
        print("[TEST] Navbar Logo Info:", nav_logo_info)
        assert nav_logo_info['naturalWidth'] > 0, "Navbar logo image failed to load"
        assert nav_logo_info['visible'], "Navbar logo is not visible"

        # 3. Check Footer logo
        footer_logo = page.query_selector('footer img, #footer img, .flex.items-center.gap-2\\.5 img')
        assert footer_logo is not None, "Footer logo img element not found"
        footer_logo_info = page.evaluate('''(el) => ({
            src: el.src,
            naturalWidth: el.naturalWidth,
            naturalHeight: el.naturalHeight,
            clientWidth: el.clientWidth,
            clientHeight: el.clientHeight,
            visible: el.offsetWidth > 0 && el.offsetHeight > 0
        })''', footer_logo)
        print("[TEST] Footer Logo Info:", footer_logo_info)
        assert footer_logo_info['naturalWidth'] > 0, "Footer logo image failed to load"
        assert footer_logo_info['visible'], "Footer logo is not visible"

        # 4. Check Hero circle spinner
        spinner = page.query_selector('#hero-circle-spinner')
        assert spinner is not None, "Hero circle spinner (#hero-circle-spinner) element not found"

        # Get initial transform and styles
        initial_transform = page.evaluate('(el) => el.style.transform', spinner)
        origin = page.evaluate('(el) => window.getComputedStyle(el).transformOrigin', spinner)
        print(f"[TEST] Hero spinner origin: {origin}, initial transform: '{initial_transform}'")

        # Wait 2.2 seconds to allow first autonomous spin to fire
        print("[TEST] Waiting for autonomous spin...")
        time.sleep(2.5)

        rot_after_autonomous = page.evaluate('(el) => el.style.transform', spinner)
        print(f"[TEST] Hero spinner transform after autonomous wait: '{rot_after_autonomous}'")
        assert rot_after_autonomous != initial_transform, "Hero spinner did not rotate autonomously!"

        # Trigger hover interaction
        print("[TEST] Triggering hover on hero circle...")
        trigger_target = page.query_selector('#hero-circle-spinner')
        if trigger_target:
            trigger_target.hover()
        time.sleep(1.0)
        rot_after_hover = page.evaluate('(el) => el.style.transform', spinner)
        print(f"[TEST] Hero spinner transform after hover: '{rot_after_hover}'")

        # Trigger click interaction
        print("[TEST] Triggering click on hero circle...")
        page.click('#hero-circle-spinner', force=True)
        time.sleep(1.0)
        rot_after_click = page.evaluate('(el) => el.style.transform', spinner)
        print(f"[TEST] Hero spinner transform after click: '{rot_after_click}'")

        # Capture Hero screenshot showing navbar and hero headline with spinning circle
        hero_box = page.query_selector('header, nav, #hero')
        screenshot_path_hero = "/home/abhay/.gemini/antigravity-cli/brain/3f63011f-e7ea-4b2a-9d0c-ac2e4ec1fdcb/mobot_hero_spinning_logo.png"
        page.screenshot(path=screenshot_path_hero, clip={"x": 0, "y": 0, "width": 1440, "height": 720})
        print(f"[TEST] Saved hero screenshot to {screenshot_path_hero}")

        # Scroll to footer and capture screenshot
        page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        time.sleep(0.5)
        screenshot_path_footer = "/home/abhay/.gemini/antigravity-cli/brain/3f63011f-e7ea-4b2a-9d0c-ac2e4ec1fdcb/mobot_footer_logo.png"
        page.screenshot(path=screenshot_path_footer, clip={"x": 0, "y": 900 - 450, "width": 1440, "height": 450})
        print(f"[TEST] Saved footer screenshot to {screenshot_path_footer}")

        # Check console errors
        print(f"[TEST] Total console logs: {len(console_logs)}")
        for log in console_logs:
            if "error" in log.lower():
                print("  Console err:", log)
        if errors:
            print("[TEST] Page errors encountered:", errors)
            sys.exit(1)

        print("\n>>> ALL PLAYWRIGHT VERIFICATION CHECKS PASSED PERFECTLY! <<<")

finally:
    httpd.shutdown()
