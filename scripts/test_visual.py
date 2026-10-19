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

        # 1b. Check Default Theme is Light Mode
        is_dark = page.evaluate('document.documentElement.classList.contains("dark")')
        html_color_scheme = page.evaluate('document.documentElement.style.colorScheme')
        print(f"[TEST] Theme check: is_dark={is_dark}, color_scheme={html_color_scheme}")
        assert not is_dark, "Default theme must be LIGHT mode, but documentElement has 'dark' class!"

        # 2. Check Navbar logo and MOBOT text color in light mode
        nav_brand = page.query_selector('a[aria-label="MOBOT Homepage"]')
        assert nav_brand is not None, "Navbar MOBOT brand not found"
        nav_logo = nav_brand.query_selector('img')
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

        nav_text = nav_brand.query_selector('span')
        assert nav_text is not None, "Navbar MOBOT text span not found"
        text_color = page.evaluate('el => window.getComputedStyle(el).color', nav_text)
        print(f"[TEST] Navbar MOBOT text color in light mode: {text_color}")
        # In light mode, text color must not be white rgb(255, 255, 255)
        assert text_color != "rgb(255, 255, 255)", f"Navbar text is white in light mode: {text_color}"

        # 3. Check Contact Sales links (Redirect to Gmail)
        contact_sales_links = page.eval_on_selector_all(
            'a[data-track*="contact-sales"], a:has-text("Contact Sales")',
            'els => els.map(e => ({ text: e.innerText.trim(), href: e.href, target: e.target }))'
        )
        print(f"[TEST] Contact sales links found: {len(contact_sales_links)}")
        for cs in contact_sales_links:
            print("  - Contact Sales link:", cs)
            if cs['text'] == "Contact Sales" or "contact-sales" in cs.get('href', ''):
                assert "mail.google.com/mail" in cs['href'], f"Contact sales does not redirect to Gmail: {cs['href']}"
                assert "abhay315204%40gmail.com" in cs['href'] or "abhay315204@gmail.com" in cs['href'], "Missing recipient email"
                assert "feedback+on+mobot" in cs['href'] or "feedback%20on%20mobot" in cs['href'], "Missing subject"

        # 4. Check Download Android APK button (Android logo & direct APK URL)
        expected_apk_url = "https://github.com/abhayShyam004/MOBOT/releases/download/v1.1.0/MOBOT-1.1.0-arm64-v8a.apk"
        hero_download = page.query_selector('a[data-track="bot.hero.download"]')
        assert hero_download is not None, "Hero download button not found"
        hero_download_href = page.evaluate('el => el.href', hero_download)
        hero_download_svg = page.evaluate('el => el.querySelector("svg") ? el.querySelector("svg").outerHTML : null', hero_download)
        print(f"[TEST] Hero download href: {hero_download_href}")
        assert hero_download_href == expected_apk_url, f"Hero download URL mismatch: {hero_download_href}"
        assert hero_download_svg is not None, "Hero download button missing icon SVG"
        # Verify it is Android robot SVG and not Tux penguin (448 512)
        assert "viewBox=\"0 0 24 24\"" in hero_download_svg, "Hero download button icon is not 24x24 Android icon"
        assert "M17.6 9.48" in hero_download_svg, "Hero download button is not the Android robot icon"

        # 5. Check "View on GitHub" text replaced with GitHub icon buttons
        view_on_gh_elements = page.eval_on_selector_all(
            'a:has-text("View on GitHub"), button:has-text("View on GitHub")',
            'els => els.map(e => e.outerHTML)'
        )
        print(f"[TEST] Any leftover 'View on GitHub' text buttons: {len(view_on_gh_elements)}")
        assert len(view_on_gh_elements) == 0, f"Found leftover text buttons: {view_on_gh_elements}"

        # Check GitHub icon button exists and links to GitHub repo
        gh_icon_buttons = page.eval_on_selector_all(
            'a[aria-label="View on GitHub"], a[title="View on GitHub"]',
            'els => els.map(e => ({ href: e.href, hasSvg: !!e.querySelector("svg") }))'
        )
        print(f"[TEST] GitHub icon buttons found: {len(gh_icon_buttons)}")
        assert len(gh_icon_buttons) >= 2, "Expected at least 2 GitHub icon buttons"
        for btn in gh_icon_buttons:
            print("  - GitHub Icon Button:", btn)
            assert "github.com/abhayShyam004/MOBOT" in btn['href'], f"GitHub button has invalid href: {btn['href']}"
            assert btn['hasSvg'], "GitHub button missing SVG icon"

        # 6. Check Footer logo
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

        # 7. Check Hero circle spinner
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

        # Capture Hero screenshot showing navbar and hero headline with spinning circle in light mode
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
