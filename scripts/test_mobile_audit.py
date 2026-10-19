import http.server
import socketserver
import threading
import time
import sys
from playwright.sync_api import sync_playwright

PORT = 5184
DIRECTORY = "dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    def log_message(self, format, *args):
        pass

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
        # Mobile viewport at 425px width
        context = browser.new_context(viewport={"width": 425, "height": 850})
        page = context.new_page()

        page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: errors.append(f"[PAGE ERROR] {err}"))

        print("[TEST] Navigating to page at 425px mobile viewport...")
        page.goto(f"http://localhost:{PORT}", wait_until="networkidle")

        # 1. Header & Hamburger button alignment
        header = page.query_selector("header")
        assert header is not None, "Header element not found"

        brand = header.query_selector('a[aria-label="MOBOT Homepage"]')
        assert brand is not None, "Navbar MOBOT brand not found"
        brand_box = brand.bounding_box()
        print(f"[TEST] Navbar brand bounding box: {brand_box}")

        menu_btn = header.query_selector('button[aria-label="Open menu"]')
        assert menu_btn is not None, "Hamburger button not found inside header!"
        menu_box = menu_btn.bounding_box()
        print(f"[TEST] Hamburger menu button bounding box: {menu_box}")

        # Check vertical alignment: brand and menu button should be on the same vertical bar
        y_diff = abs(brand_box['y'] - menu_box['y'])
        print(f"[TEST] Vertical alignment difference: {y_diff:.2f}px")
        assert y_diff < 15, f"Hamburger button is visually detached from header! y_diff={y_diff}px"

        # Screenshot Header
        header_shot = "/home/abhay/.gemini/antigravity-cli/brain/3f63011f-e7ea-4b2a-9d0c-ac2e4ec1fdcb/mobile_verified_header_425.png"
        page.screenshot(path=header_shot, clip={"x": 0, "y": 0, "width": 425, "height": 180})
        print(f"[TEST] Saved mobile header screenshot to {header_shot}")

        # 2. Test Hamburger Menu Drawer interaction
        print("[TEST] Testing mobile hamburger drawer interaction...")
        drawer = page.query_selector("#mobile-menu-drawer")
        assert drawer is not None, "Mobile menu drawer not created in DOM"
        drawer_hidden = page.evaluate('document.getElementById("mobile-menu-drawer").classList.contains("hidden")')
        assert drawer_hidden, "Drawer should be hidden initially"

        menu_btn.click()
        time.sleep(0.3)

        drawer_visible = page.evaluate('!document.getElementById("mobile-menu-drawer").classList.contains("hidden")')
        assert drawer_visible, "Drawer did not open upon clicking hamburger button!"

        # Check drawer contents
        drawer_links = page.eval_on_selector_all(
            '#mobile-menu-drawer a',
            'els => els.map(e => ({ text: e.innerText.trim(), href: e.href }))'
        )
        print(f"[TEST] Drawer links ({len(drawer_links)}):")
        for l in drawer_links:
            print(f"  - {l['text']}: {l['href']}")

        assert any("Help Build MOBOT" in l['text'] or "#community" in l['href'] for l in drawer_links), "Help Build MOBOT link missing in drawer"
        assert any("Download Android APK" in l['text'] or "arm64" in l['href'] for l in drawer_links), "Download APK link missing in drawer"

        # Screenshot opened drawer
        drawer_shot = "/home/abhay/.gemini/antigravity-cli/brain/3f63011f-e7ea-4b2a-9d0c-ac2e4ec1fdcb/mobile_verified_drawer_425.png"
        page.screenshot(path=drawer_shot, clip={"x": 0, "y": 0, "width": 425, "height": 700})
        print(f"[TEST] Saved mobile drawer screenshot to {drawer_shot}")

        # Test close button
        close_btn = page.query_selector("#close-mobile-menu")
        assert close_btn is not None, "Drawer close button not found"
        close_btn.click()
        time.sleep(0.3)
        assert page.evaluate('document.getElementById("mobile-menu-drawer").classList.contains("hidden")'), "Drawer did not close on close button click"

        # Test open and Escape key close
        menu_btn.click()
        time.sleep(0.2)
        page.keyboard.press("Escape")
        time.sleep(0.2)
        assert page.evaluate('document.getElementById("mobile-menu-drawer").classList.contains("hidden")'), "Drawer did not close on Escape key"

        # 3. Check Launch post badge
        badge = page.query_selector('a.group\\/launch')
        assert badge is not None, "Hero launch badge not found"
        badge_href = page.evaluate('el => el.href', badge)
        badge_text = page.evaluate('el => el.innerText', badge)
        print(f"[TEST] Launch badge text: '{badge_text}', href: '{badge_href}'")
        assert "github.com/abhayShyam004/MOBOT#readme" in badge_href, f"Launch badge does not redirect to README: {badge_href}"
        assert "MOBOT 1.0 is here" in badge_text, f"Launch badge missing MOBOT 1.0 text: {badge_text}"

        # 4. Check Hero Chat Demo Window on Mobile (425px)
        sidebar_slot = page.query_selector(".baby-mobot-sidebar-slot")
        if sidebar_slot:
            sidebar_display = page.evaluate('el => window.getComputedStyle(el).display', sidebar_slot)
            print(f"[TEST] Hero demo sidebar display on 425px: {sidebar_display}")
            assert sidebar_display == "none", f"Sidebar should be hidden on mobile, got {sidebar_display}"

        chat_elem = page.query_selector(".baby-mobot-chat")
        assert chat_elem is not None, "Hero demo chat element not found"
        chat_box = chat_elem.bounding_box()
        print(f"[TEST] Hero demo chat bounding box on mobile: {chat_box}")
        assert chat_box['width'] > 300, f"Chat window is too narrow: {chat_box['width']}px"

        # Screenshot Hero on mobile
        hero_shot = "/home/abhay/.gemini/antigravity-cli/brain/3f63011f-e7ea-4b2a-9d0c-ac2e4ec1fdcb/mobile_verified_hero_425.png"
        page.screenshot(path=hero_shot, clip={"x": 0, "y": 0, "width": 425, "height": 850})
        print(f"[TEST] Saved mobile hero screenshot to {hero_shot}")

        # 5. Check Statement Card on mobile
        stmt = page.query_selector(".statement-card, section#statement")
        assert stmt is not None, "Statement card section not found"
        stmt.scroll_into_view_if_needed()
        time.sleep(0.3)
        stmt_shot = "/home/abhay/.gemini/antigravity-cli/brain/3f63011f-e7ea-4b2a-9d0c-ac2e4ec1fdcb/mobile_verified_statement_425.png"
        stmt.screenshot(path=stmt_shot)
        print(f"[TEST] Saved statement card screenshot to {stmt_shot}")

        # 6. Check Pricing Section Toggle & Contrast on Mobile
        pricing_sec = page.query_selector("#pricing")
        assert pricing_sec is not None, "Pricing section not found"
        pricing_sec.scroll_into_view_if_needed()
        time.sleep(0.3)

        indiv_btn = pricing_sec.query_selector('button[data-track="bot.pricing.tab.individual"]')
        teams_btn = pricing_sec.query_selector('button[data-track="bot.pricing.tab.teams"]')
        assert indiv_btn is not None and teams_btn is not None, "Pricing tab buttons not found"

        indiv_styles = page.evaluate('''(el) => {
            const cs = window.getComputedStyle(el);
            return { color: cs.color, bg: cs.backgroundColor, text: el.innerText };
        }''', indiv_btn)
        print(f"[TEST] Individual Tab (Active):", indiv_styles)
        assert indiv_styles['color'] != indiv_styles['bg'], "Active tab text has same color as background!"

        # Screenshot Pricing with Individual tab active
        pricing_shot = "/home/abhay/.gemini/antigravity-cli/brain/3f63011f-e7ea-4b2a-9d0c-ac2e4ec1fdcb/mobile_verified_pricing_425.png"
        pricing_sec.screenshot(path=pricing_shot)
        print(f"[TEST] Saved pricing screenshot to {pricing_shot}")

        # Click Teams tab
        teams_btn.click()
        time.sleep(0.3)
        teams_styles = page.evaluate('''(el) => {
            const cs = window.getComputedStyle(el);
            return { color: cs.color, bg: cs.backgroundColor, text: el.innerText };
        }''', teams_btn)
        print(f"[TEST] Teams Tab after click (Active):", teams_styles)
        assert teams_styles['color'] != teams_styles['bg'], "Teams tab text has same color as background!"

        # 7. Check Community Section
        community_sec = page.query_selector("#community")
        assert community_sec is not None, "Community section (#community) not found!"
        community_sec.scroll_into_view_if_needed()
        time.sleep(0.3)

        comm_heading = community_sec.query_selector("h2")
        assert comm_heading is not None, "Community heading not found"
        assert "Help Us Build MOBOT" in comm_heading.inner_text(), f"Unexpected heading: {comm_heading.inner_text()}"

        # Check GitHub button
        comm_gh_btn = community_sec.query_selector('a[href*="github.com/abhayShyam004/MOBOT"]')
        assert comm_gh_btn is not None, "Community GitHub link button not found"

        # Check Email feedback button
        comm_email_btn = community_sec.query_selector('a[href*="abhay315204@gmail.com"]')
        assert comm_email_btn is not None, "Community email feedback button not found"
        email_href = page.evaluate('el => el.href', comm_email_btn)
        print(f"[TEST] Community Email button href: {email_href}")
        assert "mailto:abhay315204@gmail.com" in email_href, "Invalid email mailto"
        assert "feedback" in email_href, "Missing feedback subject"

        # Screenshot Community section
        comm_shot = "/home/abhay/.gemini/antigravity-cli/brain/3f63011f-e7ea-4b2a-9d0c-ac2e4ec1fdcb/mobile_verified_community_425.png"
        community_sec.screenshot(path=comm_shot)
        print(f"[TEST] Saved community section screenshot to {comm_shot}")

        # 8. Check Android-Only Clarification in FAQs
        faqs_sec = page.query_selector("#faqs")
        assert faqs_sec is not None, "FAQs section not found"
        faqs_sec.scroll_into_view_if_needed()
        time.sleep(0.3)

        faq_text = faqs_sec.inner_text()
        assert "Is MOBOT available for iOS, macOS, Windows, or Linux?" in faq_text, "Android-only FAQ question missing"
        assert "No. MOBOT is exclusively built for Android" in faq_text, "Android-only FAQ answer missing"

        faqs_shot = "/home/abhay/.gemini/antigravity-cli/brain/3f63011f-e7ea-4b2a-9d0c-ac2e4ec1fdcb/mobile_verified_faqs_425.png"
        faqs_sec.screenshot(path=faqs_shot)
        print(f"[TEST] Saved FAQs screenshot to {faqs_shot}")

        if errors:
            print("[TEST] Errors encountered:", errors)
            sys.exit(1)

        print("\n>>> ALL MOBILE AUDIT CHECKS PASSED FLAWLESSLY! <<<")

finally:
    httpd.shutdown()
