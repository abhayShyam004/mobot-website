const fs = require('fs');
const path = require('path');

const candidates = [
  '/tmp/user_xai_bot.html',
  '/run/media/abhay/Abhay/Downloads/AI teammates that finish the work ï½ Grok Bot (10_17_2026 11ï¼53ï¼09 AM).html'
];

let srcPath = candidates.find(p => fs.existsSync(p));
if (!srcPath) {
  const targetHtml = path.resolve(__dirname, '../index.html');
  if (fs.existsSync(targetHtml)) {
    console.log('[MOBOT-ADAPT] Authoritative template source not found in local paths, but index.html already exists. Using committed index.html.');
    process.exit(0);
  }
  console.error('Source HTML not found in candidates and index.html not found');
  process.exit(1);
}

console.log('[MOBOT-ADAPT] Authoritative template source:', srcPath);
let html = fs.readFileSync(srcPath, 'utf8');

// ========================================================
// 1. REMOVE SINGLEFILE ARTIFACTS & OFFLINE RESTRICTIONS
// ========================================================
const autofillIdx = html.indexOf('<div id=autofill-wizard');
if (autofillIdx !== -1) {
  html = html.slice(0, autofillIdx);
}
html = html.replace(/<meta\s+http-equiv=["']?content-security-policy["']?[^>]*>/gi, '');
html = html.replace(/<style[^>]*>\s*\.sf-hidden\{display:none!important\}\s*<\/style>/gi, '');
html = html.replace(/<style[^>]*>\s*:host\{--accent-color:[\s\S]*?<\/style>/gi, '');
html = html.replace(/\bsf-hidden\b/g, '');
html = html.replace(/class=\s*>/g, '>');
html = html.replace(/<html lang=en class=dark style=color-scheme:dark>/i, '<html lang=en style="color-scheme:light">');
html = html.replace(/<html\s+class=dark/i, '<html');
html = html.replace(/color-scheme:dark/g, 'color-scheme:light');
html = html.replace('bg-background text-primary font-sans antialiased', 'bg-background text-primary font-sans antialiased overflow-x-clip');

// Remove SingleFile 16x16 video overlay link
html = html.replace(/<a href=https:\/\/media\.x\.ai\/[^>]*style="z-index:2147483647!important;[\s\S]*?<\/a>/gi, '');

// Remove Video Section ("The SpaceXSI team runs on Grok Bot" / "The team runs on MOBOT" & preview picture)
html = html.replace(/<section\s+id=["']?video["']?[\s\S]*?<\/section>/gi, '');
html = html.replace(/<section[^>]*>[\s\S]*?(?:The SpaceXSI team runs on Grok Bot|The team runs on MOBOT)[\s\S]*?<\/section>/gi, '');

// ========================================================
// 1.5 FAVICON & TOUCH ICONS (MOBOT)
// ========================================================
html = html.replace(/<link rel=icon href="data:image\/png;base64,[^"]+" sizes=512x512 type=image\/png>/i,
  `<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png">\n    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n    <link rel="icon" type="image/png" href="/favicon.png">\n    <link rel="apple-touch-icon" href="/apple-touch-icon.png">\n    <link rel="shortcut icon" href="/favicon.ico">`
);

// ========================================================
// 2. PROTECT BASE64 ASSETS (FONTS / WALLPAPERS)
// ========================================================
const placeholders = new Map();
const b64Regex = /data:[^;]+;base64,[A-Za-z0-9+/=]+/g;
html = html.replace(b64Regex, (match) => {
  const key = `__B64_TOKEN_${placeholders.size}__`;
  placeholders.set(key, match);
  return key;
});
console.log(`[MOBOT-ADAPT] Protected ${placeholders.size} base64 assets.`);

// ========================================================
// 3. PAGE TITLE & METADATA
// ========================================================
html = html.replace(/<title>.*?<\/title>/i, '<title>MOBOT â Autonomous AI Companions for Android</title>');
html = html.replace(/content=SpaceXSI/g, 'content=MOBOT');
html = html.replace(/content=@spacexsi/g, 'content=@mobot_app');
html = html.replace(/content="@spacexsi"/g, 'content="@mobot_app"');
html = html.replace(/AI teammates that finish the work \| Grok Bot/g, 'Autonomous AI Companions that finish the work | MOBOT');

// ========================================================
// 4. NAVBAR BRANDING & ACCESSIBILITY
// ========================================================
const oldLogoRegex = /<a aria-label="Grok Bot Homepage"[\s\S]*?<\/a>/;
const mobotNavBrand = `<a aria-label="MOBOT Homepage" href="#hero" class="flex items-center gap-2.5 outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20">
  <img src="/logo.png" alt="MOBOT" width="30" height="30" class="size-[30px] object-contain select-none pointer-events-none" />
  <span class="font-display text-lg font-bold tracking-tight text-primary">MOBOT</span>
</a>`;
html = html.replace(oldLogoRegex, mobotNavBrand);
html = html.replace(/<a aria-label="SpaceXSI Homepage"[\s\S]*?<\/a>/g, mobotNavBrand);
html = html.replace(/aria-label="SpaceXSI Logo - Right click to copy SVG"/g, 'aria-label="MOBOT Logo"');
html = html.replace(/aria-label=SpaceXSI/g, 'aria-label=MOBOT');

// Common URLs and SVG Icons
const mobotApkUrl = 'https://github.com/abhayShyam004/MOBOT/releases/download/v1.1.2/MOBOT-1.1.2-arm64-v8a.apk';
const gmailFeedbackUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=abhay315204@gmail.com&su=feedback+on+mobot';
const androidIconSvg = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-4 shrink-0"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.05-.83.22l-1.88 3.24c-1.34-.59-2.85-.92-4.47-.92s-3.13.33-4.47.92L5.65 5.67c-.19-.29-.55-.38-.84-.22-.31.16-.42.54-.26.85l1.84 3.18C3.8 11.23 2 14.18 2 17.52h20c0-3.34-1.8-6.29-4.4-8.04zM7 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm10 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`;
const githubIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-5 shrink-0"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`;

// Header CTA buttons: Direct Download APK
const desktopHeaderDownloadRegex = /<div class="relative hidden nav:block">[\s\S]*?href=https:\/\/x\.ai\/build><span>Grok Build<\/span><\/a><\/div><\/div><\/div><\/div><\/div>/;
const desktopHeaderDownloadBtn = `<div class="relative hidden nav:block">
  <a href="${mobotApkUrl}" download data-track="header.primary" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-medium h-9 px-5 text-sm hover:opacity-90 transition-opacity">Download APK</a>
</div>`;
html = html.replace(desktopHeaderDownloadRegex, desktopHeaderDownloadBtn);

// Clean up old mobile hidden download link
html = html.replace(
  /<a download data-track=header\.primary aria-hidden=true[^>]*>Download<\/a>/,
  ''
);

html = html.replace(/<span class="truncate">Get Grok<\/span>/g, '<span class="truncate">Download APK</span>');
html = html.replace(/href=https:\/\/grok\.com\/\?product=grok-bot/g, `href="${mobotApkUrl}" download`);

// Header Contact Sales button -> redirect to Gmail
const headerContactSalesBtn = `<a data-track="header.contact-sales" class="relative isolate shrink-0 items-center justify-center border-0 text-sm font-medium transition-[color,background-color,border-color,filter] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:shrink-0 gap-x-3 px-[18px] py-2.5 sm:text-sm [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:sm:size-4 bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] rounded-full [--btn-bg:color-mix(in_srgb,hsl(var(--primary))_3%,hsl(var(--card)))] [--btn-hover:color-mix(in_srgb,hsl(var(--primary))_7%,hsl(var(--card)))] [--btn-text:theme(colors.primary)] hidden nav:flex" data-fill="soft" href="${gmailFeedbackUrl}" target="_blank" rel="noopener noreferrer"><span class="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden " aria-hidden="true"></span>Contact Sales</a>`;
html = html.replace(/<a [^>]*data-track=header\.contact-sales[\s\S]*?<\/a>/, headerContactSalesBtn);

// Style and ensure accessibility for mobile hamburger button
const mobileHamburgerBtn = `<button type="button" aria-label="Open menu" aria-expanded="false" data-drawer-trigger="true" class="size-10 rounded-full flex items-center justify-center text-primary bg-primary/5 hover:bg-primary/10 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 nav:hidden">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5 shrink-0">
    <line x1="4" y1="6" x2="20" y2="6"></line>
    <line x1="4" y1="12" x2="20" y2="12"></line>
    <line x1="4" y1="18" x2="20" y2="18"></line>
  </svg>
</button>`;
html = html.replace(/<button type=button[\s\S]*?visible nav:hidden[\s\S]*?<g id="?name=drawer"?[\s\S]*?<\/svg><\/button>/, mobileHamburgerBtn);

// ========================================================
// 5. HERO SECTION
// ========================================================
html = html.replace(/Introducing Grok Bot/g, 'MOBOT 1.1.2 is here');
html = html.replace(/Grok Bot is here/g, 'MOBOT 1.1.2 is here');
html = html.replace(/MOBOT 1.0 is here/g, 'MOBOT 1.1.2 is here');
html = html.replace(/A new way to get work done/g, 'Autonomous AI Companions for Android');

// Hero launch post badge -> link directly to GitHub README
html = html.replace(/href=https:\/\/x\.ai\/news\/introducing-grok-bot/g, 'href="https://github.com/abhayShyam004/MOBOT#readme"');
html = html.replace(/href=https:\/\/x\.ai\/blog\/grok-bot/g, 'href="https://github.com/abhayShyam004/MOBOT#readme"');
html = html.replace(
  'dark:bg-card/60 hover:border-primary/15 dark:hover:bg-card transition-colors mb-4 sm:mb-5',
  'bg-primary/5 hover:bg-primary/10 border border-border text-primary shadow-sm transition-all mb-4 sm:mb-5'
);
html = html.replace(
  /<span class="hidden sm:inline"><span class=text-primary\/30> â¢ <\/span><span class="text-primary group-hover\/launch:text-primary\/80 transition-colors">Read the launch post<\/span><\/span>/,
  '<span class="inline"><span class="text-primary/40"> â¢ </span><span class="text-primary group-hover/launch:text-primary/80 transition-colors">Read launch post</span></span>'
);

// Hero title & subtitle
html = html.replace(/<span style=display:inline-block;position:relative;opacity:1;transform:none>Bot<\/span><\/h1>/g, '</h1>');

// Hero spinning circle
html = html.replace(
  /<span style=position:absolute;left:50%;top:50%;width:153\.333%;height:153\.333%;transform:translate\(-50%,-50%\);pointer-events:none><svg xmlns=http:\/\/www\.w3\.org\/2000\/svg id=motion-_r_2e_ width=100% height=100% viewBox="0 0 92 92">([\s\S]*?)<\/svg><\/span>/,
  '<span style="position:absolute;left:50%;top:50%;width:153.333%;height:153.333%;transform:translate(-50%,-50%);pointer-events:auto;cursor:pointer;"><svg xmlns="http://www.w3.org/2000/svg" id="motion-_r_2e_" width="100%" height="100%" viewBox="0 0 92 92"><g id="hero-circle-spinner" style="transform-origin: 44.87px 46.23px; will-change: transform;">$1</g></svg></span>'
);
html = html.replace(
  /AI teammates you can give real work to\. Bots can sign in to your tools, use them just like you do, and come back with finished work\./g,
  'Autonomous Android companions that execute real work. Orchestrate Google Maps intents, background routines, and local workflows with zero telemetry.'
);
html = html.replace(
  /Set a goal, hand off a project, and step in when needed\. Your AI teammates work proactively, keep context, and learn how you work\./g,
  'Set a goal, hand off a project, and step in when needed. Your Android AI companion works proactively, keeps persistent memory, and orchestrates real device tools.'
);

// Hero CTA buttons (Android robot icon + APK direct download link & GitHub icon button)
const heroDownloadBtn = `<a href="${mobotApkUrl}" download class="inline-flex items-center justify-center rounded-full transition-colors bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-contrast h-9 gap-1.5 px-4 text-sm font-normal md:h-11 md:px-6 md:text-base" data-track="bot.hero.download">${androidIconSvg}Download Android APK</a>`;
html = html.replace(/<a [^>]*data-track=bot\.hero\.download[\s\S]*?<\/a>/, heroDownloadBtn);

const heroGithubBtn = `<a aria-label="View on GitHub" title="View on GitHub" class="inline-flex items-center justify-center rounded-full transition-colors bg-theme-card-03-hex text-theme-text duration-200 ease-out hover:bg-theme-fg-10 h-9 w-9 md:h-11 md:w-11 p-0 shrink-0" data-track="bot.hero.contact-sales" href="https://github.com/abhayShyam004/MOBOT" target="_blank" rel="noopener noreferrer">${githubIconSvg}</a>`;
html = html.replace(/<a [^>]*data-track=bot\.hero\.contact-sales[\s\S]*?<\/a>/, heroGithubBtn);

// Hero Desktop Demo Window
html = html.replace(/John Doe/g, 'Abhay Shyam');
html = html.replace(/Armand Segall/g, 'Abhay Shyam');

// Specific Sidebar bot items in Hero Window
html = html.replace(/<span class="block truncate text-\[14px\] leading-5 tracking-\[-0\.15px\]"[^>]*>Chief<\/span>/g,
  '<span class="block truncate text-[14px] leading-5 tracking-[-0.15px]" style=color:var(--mobot-sidebar-text-primary);opacity:1;transform:none>Eval Bot</span>');
html = html.replace(/booked the venue and sent the confirmation around\./g,
  'privacy audit verified clean. zero telemetry.');

html = html.replace(/<span class="block truncate text-\[14px\] leading-5 tracking-\[-0\.15px\]"[^>]*>Sales Outbound<\/span>/g,
  '<span class="block truncate text-[14px] leading-5 tracking-[-0.15px]" style=color:var(--mobot-sidebar-text-primary);opacity:1;transform:none>Yuki</span>');
html = html.replace(/>Done\./g, '>route opened in maps.');

html = html.replace(/<span class="block truncate text-\[14px\] leading-5 tracking-\[-0\.15px\]"[^>]*>Inbox Manager<\/span>/g,
  '<span class="block truncate text-[14px] leading-5 tracking-[-0.15px]" style=color:var(--mobot-sidebar-text-primary);opacity:1;transform:none>Pixel</span>');
html = html.replace(/sent\. inbox at zero, 5 drafts parked for tomorrow\./g,
  'receipt parsed: $142.50 across 4 line items.');

html = html.replace(/<span class="block truncate text-\[14px\] leading-5 tracking-\[-0\.15px\]"[^>]*>Account Manager<\/span>/g,
  '<span class="block truncate text-[14px] leading-5 tracking-[-0.15px]" style=color:var(--mobot-sidebar-text-primary);opacity:1;transform:none>Sage</span>');
html = html.replace(/invite's out to vicky\. globex note held in drafts\./g,
  'sqlite vector index optimized.');

html = html.replace(/<span class="block truncate text-\[14px\] leading-5 tracking-\[-0\.15px\]"[^>]*>Talent Scout<\/span>/g,
  '<span class="block truncate text-[14px] leading-5 tracking-[-0.15px]" style=color:var(--mobot-sidebar-text-primary);opacity:1;transform:none>Scout</span>');
html = html.replace(/3 intros drafted in your voice, held for your ok\./g,
  'watch active: flight AA1024 monitoring.');

html = html.replace(/<span class="block truncate text-\[14px\] leading-5 tracking-\[-0\.15px\]"[^>]*>Expense Manager<\/span>/g,
  '<span class="block truncate text-[14px] leading-5 tracking-[-0.15px]" style=color:var(--mobot-sidebar-text-primary);opacity:1;transform:none>Taffy</span>');
html = html.replace(/report filed\. 9 receipts, nothing outstanding\./g,
  'document scanner intent executed.');

html = html.replace(/<span class="block truncate text-\[14px\] leading-5 tracking-\[-0\.15px\]"[^>]*>Offsite crew<\/span>/g,
  '<span class="block truncate text-[14px] leading-5 tracking-[-0.15px]" style=color:var(--mobot-sidebar-text-primary);opacity:1;transform:none>Plum</span>');
html = html.replace(/that leaves the pipeline\. i'd spin up a dedicated agent\./g,
  'whisper audio note transcribed.');

// Exact verified phone chat turn for Yuki
html = html.replace(
  /Hey Armand, good to meet you\. What do you want me around for\? Anything concrete, or more of a general sidekick\?/g,
  'Hey Abhay, good to meet you. What do you want me around for? Anything concrete, or more of a general sidekick?'
);
html = html.replace(
  /Overnight pipeline generation and outbound\.[\s\S]*?sequences in my voice\./g,
  'take me yo the nearest metro station'
);
html = html.replace(
  /Can you follow up with all customers who showed interest in our enterprise tier\?/g,
  'take me yo the nearest metro station'
);
html = html.replace(/Renamed to Sales Outbound/g, 'Intent: com.google.android.apps.maps');
html = html.replace(
  /Checking what's connected\. Hex, Gmail, and LinkedIn are already signed in\. Salesforce isn't\./g,
  'I opened your maps app with a search for the nearest metro station. Depending on your location permissions, it may ask you to enable location first.'
);
html = html.replace(
  /Running the pipeline generation routine now\. Scanning 48 contacts, matched 12 high-intent leads across target accounts\./g,
  'I opened your maps app with a search for the nearest metro station. Depending on your location permissions, it may ask you to enable location first.'
);
html = html.replace(
  /I've drafted 12 personalized follow-up emails for the enterprise prospects\. Would you like me to send them now\?/g,
  'I opened your maps app with a search for the nearest metro station. Depending on your location permissions, it may ask you to enable location first.'
);
html = html.replace(
  /<span class="block truncate text-\[13px\] leading-\[18px\] tracking-\[-0\.08px\]"[^>]*>Sales Outbound<\/span>/g,
  '<span class="block truncate text-[13px] leading-[18px] tracking-[-0.08px]" style=color:var(--cursor-text-primary);opacity:1;transform:none>Yuki</span>'
);
html = html.replace(/aria-label="Open Sales Outbound's computer"/g, 'aria-label="Open Yuki\'s companion"');
html = html.replace(/â¢ Gmail Connector/g, 'â¢ Android Intent: Google Maps');

// Make composer interactive
html = html.replace('contenteditable=false data-empty', 'contenteditable=true data-empty tabindex=0');
html = html.replace('aria-readonly=true class=baby-grok-bot-composer-field-input', 'aria-readonly=false class=baby-grok-bot-composer-field-input');
html = html.replace(/data-placeholder="Ask Sales Outbound"/g, 'data-placeholder="Ask Yuki"');
html = html.replace(/data-placeholder="Ask Yuki"/g, 'data-placeholder="Ask Yuki"');
html = html.replace(/Ask Sales Outbound/g, 'Ask Yuki');

// Sidebar resize separator
html = html.replace('role=separator></div></div><div class=baby-grok-bot-chat', 'role=separator tabindex="0" aria-valuenow="280" aria-valuemin="220" aria-valuemax="400" aria-label="Resize sidebar"></div></div><div class=baby-grok-bot-chat');

// ========================================================
// 6. STATEMENT CARD & 2x2 FEATURE GRID
// ========================================================
html = html.replace(
  /<h2 class="font-display text-3xl tracking-tight text-balance sm:text-4xl">Message Bots like teammates<\/h2>/g,
  '<h2 class="font-display text-3xl tracking-tight text-balance sm:text-4xl">Message Bots like teammates... on Android</h2>'
);
html = html.replace(
  /Give tasks to Bots like you would a teammate on desktop or iOS\./g,
  'Give tasks to Bots like you would a teammate on Android.'
);
html = html.replace(
  /Your AI teammates take projects from start to end, keep context on how you work and get smarter over time, and come back when your approval is needed\./g,
  'Your AI companion takes projects from start to end, keeps durable context on how you work, and comes back when your approval is needed.'
);

// Peering mascot blue gradient in statement card
html = html.replace(
  /<svg xmlns=http:\/\/www\.w3\.org\/2000\/svg id=motion-_r_2k_ width=100% height=100% viewBox="0 0 755\.62 755\.62">/,
  '<svg xmlns=http://www.w3.org/2000/svg id=motion-_r_2k_ width=100% height=100% viewBox="0 0 755.62 755.62"><defs><radialGradient id="yuki-statement-grad" cx="45%" cy="40%" r="65%"><stop offset="0%" stop-color="#60A5FA"/><stop offset="60%" stop-color="#2563EB"/><stop offset="100%" stop-color="#1D4ED8"/></radialGradient></defs>'
);
html = html.replace(/viewBox="0 0 755\.62 755\.62"><path d="M604\.5 377\.81[\s\S]*?" fill=var\(--fg\)/, (m) => m.replace('fill=var(--fg)', 'fill="url(#yuki-statement-grad)"'));

// 2x2 Feature Grid Cards
html = html.replace(/Work with many Bots at once/g, 'Parallel Companion Roster');
html = html.replace(
  /Create a Bot, give it a task, and add another when the work growsâone on a project, one on outbound, one on systems\. AI teammates work in parallel, collaborate where it makes sense, and keep working 24\/7\./g,
  'Deploy a roster of specialist bots on your phoneâone on daily companion tasks, one on world watches, one on document extraction. Agents execute in parallel with persistent state.'
);

html = html.replace(/Bots work where you work/g, 'Direct Android System Hands');
html = html.replace(/Grok Bot works where you work/g, 'Direct Android System Hands');
html = html.replace(
  /Bots interact with your desktop through native mouse, keyboard, and screen capabilities\./g,
  'MOBOT interacts directly with Android intent filters, Google Maps navigation, camera QR pairing, voice dictation, and sandboxed device workspaces.'
);
html = html.replace(
  /Log Grok Bot in once\. It uses your apps and websites just like you would, including the tools that are harder to navigate\./g,
  'Connect your companion once. It orchestrates device intents, system apps, and background tasks seamlessly with granular privacy controls.'
);

html = html.replace(/Teach Bots new skills/g, 'Proactive Background Routines');
html = html.replace(/Grok Bot's own computer/g, 'Proactive Background Routines');
html = html.replace(/Show a Bot how it[â']s done/g, 'Proactive Background Routines');
html = html.replace(
  /Ask a Bot to follow along as you complete a workflow once\. It saves it as a routine and runs it on its own next time\./g,
  'Schedule recurring morning digests, periodic API checks, and background monitors that run reliably around the clock.'
);
html = html.replace(
  /Record your workflow once, and your Bot learns the steps\./g,
  'Schedule recurring morning digests, periodic API checks, and background monitors that run reliably around the clock.'
);

html = html.replace(/Bots get smarter over time/g, 'Local Persistent Memory');
html = html.replace(
  /Bots keep context and learn from each other\. Show one a workflow today, hand off the project by Friday\./g,
  'Bots maintain persistent SQLite workspaces and vector memory on your device, getting smarter with zero telemetry.'
);

html = html.replace(/Connect the Bots/g, 'Multi-Agent Swarm');
html = html.replace(
  /Put a few Bots in the same thread and they pass work between themselves\. You watch them take action instead of approving every step\./g,
  'Run specialist bots (Yuki, Eval Bot, Pixel, Sage, Scout) concurrently with seamless context hand-offs.'
);

html = html.replace(/Keep projects moving forward/g, 'Autonomous Goals & World Watches');
html = html.replace(
  /Bots track milestones and surface blockers so work never stalls\./g,
  'Tracks multi-step milestones, surfaces NEXT and BLOCKER alerts, and maintains 24/7 condition watches with single-tap Check Now verification.'
);

// ========================================================
// 7. USE CASES SECTION (8 PILLS & PHONE MOCKUP)
// ========================================================
html = html.replace(/Give each Bot a job/g, 'Specialist Swarm Roster');

// Update pills precisely
html = html.replace(/>Sales Outbound<\/button>/g, '>Yuki</button>');
html = html.replace(/>Talent Scout<\/button>/g, '>Eval Bot</button>');
html = html.replace(/>Paid Media<\/button>/g, '>Pixel</button>');
html = html.replace(/>Expense Manager<\/button>/g, '>Sage</button>');
html = html.replace(/>Product Performance<\/button>/g, '>Scout</button>');
html = html.replace(/>Bug Reproduction<\/button>/g, '>Taffy</button>');
html = html.replace(/>Account Health<\/button>/g, '>Plum</button>');
html = html.replace(/>Chief of Staff<\/button>/g, '>Vega</button>');

// Update initial phone mockup transcript in use-cases
html = html.replace(
  /work the pipeline overnight: research the accounts, score the contacts, draft email and linkedin in my voice\. nothing goes out without me\./g,
  'take me yo the nearest metro station'
);
html = html.replace(/Created routine/g, 'Triggered Android Intent');
html = html.replace(/Overnight outbound batch/g, 'Google Maps Navigation');

// ========================================================
// 8. VIDEO SECTION (REMOVED: "The team runs on MOBOT" & preview)
// ========================================================
html = html.replace(/<section\s+id=["']?video["']?[\s\S]*?<\/section>/gi, '');
html = html.replace(/<section[^>]*>[\s\S]*?(?:The SpaceXSI team runs on Grok Bot|The team runs on MOBOT)[\s\S]*?<\/section>/gi, '');

// ========================================================
// 9. PRICING & ARCHITECTURE SECTION
// ========================================================
html = html.replace(/cursor\.com\/contact-sales\?product=grok-bot/g, 'github.com/abhayShyam004/MOBOT');
html = html.replace(/cursor\.com\/download/g, 'github.com/abhayShyam004/MOBOT/releases/latest');
html = html.replace(/https:\/\/grok\.com\/\?product=grok-bot/g, 'https://github.com/abhayShyam004/MOBOT');

// Clean pricing numbers and cards
html = html.replace(/>\$30</g, '>$0<');
html = html.replace(/>\$100</g, '>Free<');
html = html.replace(/>\$200</g, '>Local<');
html = html.replace(/>\/ month</g, '>forever Â· MIT<');
html = html.replace(/billed annually or \$\d+ billed monthly/g, '100% Free & Open Source on GitHub');
html = html.replace(
  /Already on an eligible Premium, Super, Ultra, Teams, or Enterprise plan\? Grok Bot is included\./g,
  'All agent state, credentials, and SQLite workspaces remain securely on your device. Zero telemetry.'
);
html = html.replace(/Grok Bot is included\./g, 'MIT Open Source License.');
html = html.replace(/Sign in with your plan/g, 'Audit Source on GitHub');
html = html.replace(/Weekly Grok Bot usage included/g, 'Zero Telemetry & Local SQLite Storage');

// Replace pricing card CTA buttons
const pricingGithubBtn = `<a aria-label="View on GitHub" title="View on GitHub" class="inline-flex items-center justify-center rounded-full transition-colors bg-theme-card-03-hex text-theme-text duration-200 ease-out hover:bg-theme-fg-10 h-11 w-11 p-0 shrink-0" data-track="bot.pricing.contact-sales" href="https://github.com/abhayShyam004/MOBOT" target="_blank" rel="noopener noreferrer">${githubIconSvg}</a>`;
html = html.replace(/<a [^>]*data-track=bot\.pricing\.contact-sales[\s\S]*?<\/a>/, pricingGithubBtn);

html = html.replace(
  /<a [^>]*product=grok-bot">Get Premium<\/a>/g,
  `<a href="${mobotApkUrl}" download class="inline-flex items-center justify-center rounded-full bg-primary text-background font-medium py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Download APK</a>`
);
html = html.replace(
  /<a [^>]*product=grok-bot">Get Super<\/a>/g,
  '<a href="https://github.com/abhayShyam004/MOBOT" class="inline-flex items-center justify-center rounded-full bg-cyan-400 text-black font-semibold py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Get on GitHub</a>'
);
html = html.replace(
  /<a [^>]*product=grok-bot">Get Ultra<\/a>/g,
  '<a href="https://github.com/abhayShyam004/MOBOT#readme" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-medium py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">View Source</a>'
);

// ========================================================
// 10. DOWNLOAD SECTION
// ========================================================
html = html.replace(/Download Grok Bot/g, 'Download MOBOT');
html = html.replace(
  /One team, wherever you are â on your desk and in your pocket\./g,
  'Autonomous on-device agent companion for Android. Run directly on your phone with zero root required.'
);
html = html.replace(/https:\/\/cursor\.com\/download/g, mobotApkUrl);

// Replace Linux penguin SVG & accordion button in download section with direct APK download link
const androidIconLargeSvg = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-6 shrink-0"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.05-.83.22l-1.88 3.24c-1.34-.59-2.85-.92-4.47-.92s-3.13.33-4.47.92L5.65 5.67c-.19-.29-.55-.38-.84-.22-.31.16-.42.54-.26.85l1.84 3.18C3.8 11.23 2 14.18 2 17.52h20c0-3.34-1.8-6.29-4.4-8.04zM7 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm10 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`;

const directDownloadCard = `<a href="${mobotApkUrl}" download data-track="bot.downloads.apk-primary" class="bg-theme-bg-subtle hover:bg-theme-card-03-hex group flex w-full cursor-pointer items-center gap-4 rounded-2xl px-5 py-4 text-left font-sans transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
  <span class="text-primary flex size-12 shrink-0 items-center justify-center">
    ${androidIconLargeSvg}
  </span>
  <span class="flex min-w-0 flex-col">
    <span class="text-sm font-medium">Download Android APK (ARM64)</span>
    <span class="text-theme-text-muted text-xs">.apk Â· Android 10+ Â· Direct APK Download</span>
  </span>
  <span class="text-theme-text-muted group-hover:text-theme-text mr-3 ml-auto shrink-0 transition-colors">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
  </span>
</a>`;

html = html.replace(
  /<button type=button aria-expanded=false aria-controls=_r_0_ data-linux-picker-trigger=true[\s\S]*?<\/button>/,
  directDownloadCard
);

html = html.replace(
  /<span>More downloads<\/span><span class="text-theme-text-muted text-xs font-normal">Other platforms and devices<\/span>/g,
  '<span>Alternative Installs</span><span class="text-theme-text-muted text-xs font-normal">ADB CLI, Termux & source build</span>'
);

const androidDropdownMarkup = `<div id="_r_0_" role="region" aria-label="Alternative install options" class="linux-picker-panel hidden mt-2 rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur-xl shadow-2xl">
  <div class="flex flex-col gap-2">
    <a href="${mobotApkUrl}" download class="flex items-center justify-between rounded-xl p-3 text-sm text-white/90 hover:bg-white/10 transition-colors">
      <span class="font-medium">.apk (Android 10+ ARM64)</span>
      <span class="text-xs text-white/50">Primary Package</span>
    </a>
    <a href="https://github.com/abhayShyam004/MOBOT#fast-adb-install" class="flex items-center justify-between rounded-xl p-3 text-sm text-white/90 hover:bg-white/10 transition-colors">
      <span class="font-medium">Fast ADB Install (adb install -r companion.apk)</span>
      <span class="text-xs text-white/50">Developer CLI</span>
    </a>
    <a href="https://github.com/abhayShyam004/MOBOT" class="flex items-center justify-between rounded-xl p-3 text-sm text-white/90 hover:bg-white/10 transition-colors">
      <span class="font-medium">Source Code (git clone)</span>
      <span class="text-xs text-white/50">GitHub</span>
    </a>
  </div>
</div>`;

html = html.replace(
  /(<button type=button aria-haspopup=dialog data-track=bot\.downloads\.more[\s\S]*?<\/button>)/,
  `$1\n${androidDropdownMarkup}`
);

// ========================================================
// 11. GUIDES SECTION
// ========================================================
html = html.replace(/Grok Bot Guides/g, 'MOBOT Developer Guides');
html = html.replace(
  /How PMs, designers, and GTM run Grok Bot day to day\./g,
  'Learn how to configure multi-model API keys, define proactive routines, and build companion skills.'
);
html = html.replace(/https:\/\/cursor\.com\/bot\/guides/g, 'https://github.com/abhayShyam004/MOBOT#readme');

// ========================================================
// 11.5 COMMUNITY & CONTRIBUTION SECTION
// ========================================================
const communitySection = `<section id="community" class="relative overflow-hidden">
  <div class="mx-auto w-full max-w-[var(--site-content-width)] px-4 py-10 sm:py-16 md:py-24 sm:px-6">
    <div class="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center mb-10 sm:mb-14">
      <div class="inline-flex items-center gap-2 rounded-full border border-border bg-primary/5 px-3 py-1 text-xs font-semibold tracking-wide text-primary shadow-sm">
        Open Source & Community
      </div>
      <h2 class="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
        Help Us Build MOBOT
      </h2>
      <p class="max-w-xl text-base sm:text-lg text-secondary leading-relaxed">
        MOBOT is an open-source, community-built autonomous companion for Android. Whether you want to add new intent skills, audit privacy, or report edge-case bugs, your contributions shape the future of on-device AI.
      </p>
    </div>

    <div class="grid w-full gap-6 md:grid-cols-2 max-w-5xl mx-auto">
      <!-- Card 1: GitHub Open Source -->
      <article class="bg-card border border-border flex flex-col justify-between rounded-3xl p-6 sm:p-8 shadow-sm">
        <div>
          <div class="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            ${githubIconSvg}
          </div>
          <h3 class="font-display text-xl font-bold tracking-tight text-primary mb-2">
            Contribute on GitHub
          </h3>
          <p class="text-secondary text-sm leading-relaxed mb-6">
            Review the codebase, propose features, submit pull requests, or discuss architecture roadmaps with developers.
          </p>
          <ul class="flex flex-col gap-3 text-sm text-secondary mb-8 border-t border-border pt-6">
            <li class="flex items-center gap-2.5">
              <span class="text-emerald-500 font-bold shrink-0">â</span>
              <span>100% Free & Open Source under MIT License</span>
            </li>
            <li class="flex items-center gap-2.5">
              <span class="text-emerald-500 font-bold shrink-0">â</span>
              <span>Modular Kotlin Android & Intent dispatchers</span>
            </li>
            <li class="flex items-center gap-2.5">
              <span class="text-emerald-500 font-bold shrink-0">â</span>
              <span>Open roadmap & active GitHub Discussions</span>
            </li>
          </ul>
        </div>
        <div>
          <a href="https://github.com/abhayShyam004/MOBOT" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-background font-semibold py-3 px-6 text-sm hover:opacity-90 active:scale-95 transition-all w-full shadow-sm">
            ${githubIconSvg}
            <span>Star & Fork on GitHub</span>
          </a>
        </div>
      </article>

      <!-- Card 2: Bug Reports & Feedback -->
      <article class="bg-card border border-border flex flex-col justify-between rounded-3xl p-6 sm:p-8 shadow-sm">
        <div>
          <div class="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-6 text-primary">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h3 class="font-display text-xl font-bold tracking-tight text-primary mb-2">
            Direct Bug Reports & Feedback
          </h3>
          <p class="text-secondary text-sm leading-relaxed mb-6">
            Encountered a bug or an intent error? Email the lead developer directly. Include these 3 items for fastest resolution:
          </p>
          <div class="rounded-2xl bg-primary/[0.03] border border-border p-4 mb-8">
            <ol class="flex flex-col gap-2.5 text-xs sm:text-sm text-secondary">
              <li class="flex items-start gap-2">
                <span class="font-semibold text-primary">1.</span>
                <span>Attach a screenshot or short recording of the screen</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="font-semibold text-primary">2.</span>
                <span>Copy the exact error message or unexpected behavior</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="font-semibold text-primary">3.</span>
                <span>Briefly describe the user action right before it happened</span>
              </li>
            </ol>
          </div>
        </div>
        <div>
          <a href="mailto:abhay315204@gmail.com?subject=feedback%20on%20mobot" class="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card hover:bg-primary/5 text-primary font-semibold py-3 px-6 text-sm active:scale-95 transition-all w-full shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 shrink-0">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>Email abhay315204@gmail.com</span>
          </a>
        </div>
      </article>
    </div>
  </div>
</section>`;

html = html.replace(
  /(<\/section>\s*<section id=["']?faqs["']?>)/i,
  `\n${communitySection}\n$1`
);

// Global Section Spacing Optimization for Mobile
html = html.replace(/py-20 sm:py-28/g, 'py-10 sm:py-16 md:py-24');
html = html.replace(
  'p-8 pb-44 sm:gap-5 sm:px-12 sm:py-10 md:pr-[42%] md:pb-10',
  'p-6 pb-28 sm:gap-5 sm:px-12 sm:py-10 md:pr-[42%] md:pb-10'
);
html = html.replace(
  '<h2 class="font-display text-3xl tracking-tight text-balance sm:text-4xl text-center">Pricing</h2>',
  '<h2 class="font-display text-3xl tracking-tight text-balance sm:text-4xl text-center text-primary">Pricing</h2>'
);

// ========================================================
// 12. FAQ SECTION (ACCORDION & JSON-LD)
// ========================================================
const mobotFaqs = [
  {
    q: 'What is MOBOT and how is it different from AI assistants?',
    a: 'MOBOT is an autonomous companion that runs natively on Android. Unlike cloud chatbots that only return text, MOBOT executes actions using direct Android intents (Google Maps, camera, notifications, background routines), keeps persistent memory in local SQLite, and operates completely offline with zero telemetry.'
  },
  {
    q: 'Is MOBOT available for iOS, macOS, Windows, or Linux?',
    a: 'No. MOBOT is exclusively built for Android (Android 10+ ARM64). MOBOT utilizes native Android platform capabilities including system intents, local SQLite databases, foreground services, and quick setting tiles that are specific to the Android operating system. There are no iOS or desktop applications.'
  },
  {
    q: 'Does MOBOT require root access or custom firmware?',
    a: 'No root is required. MOBOT runs as a standard Android application using sandboxed Android APIs, intent dispatchers, and foreground services.'
  },
  {
    q: 'Which AI models can I use with MOBOT?',
    a: 'MOBOT supports Bring-Your-Own-Key (BYOK) for leading frontier models including Claude 3.5 Sonnet, GPT-4o, and DeepSeek-V3, as well as local on-device small models via GGUF and ONNX runtimes.'
  },
  {
    q: 'Where do I talk to MOBOT?',
    a: 'You interact directly on your Android phone through voice dictation, chat bubbles, quick setting tiles, and background world watch notifications.'
  },
  {
    q: 'How much does MOBOT cost?',
    a: 'MOBOT is 100% free and open-source under the MIT license. You only pay for your own LLM API tokens if you connect cloud models, or $0 forever when running local models.'
  },
  {
    q: 'Do Bots share one memory database?',
    a: 'Yes. Every MOBOT specialist bot on your device accesses a unified, ACID-compliant local SQLite database with vector indexing, allowing seamless task hand-offs while isolating sensitive workspace threads.'
  },
  {
    q: 'How does MOBOT handle my data &amp; privacy?',
    a: 'All agent conversations, workspace files, credentials, and location intents remain exclusively on your device. MOBOT has no analytics servers, no cloud telemetry, and no intermediate proxy.'
  }
];

// Replace JSON-LD schema in FAQs
const mobotJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": mobotFaqs.map(f => ({
    "@type": "Question",
    "name": f.q.replace(/&amp;/g, '&'),
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a.replace(/&amp;/g, '&')
    }
  }))
});
html = html.replace(/\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?\}\]\}<\/script>/, mobotJsonLd + '</script>');

// Replace FAQ questions and answers in accordion
html = html.replace(/How is Grok Bot different from AI assistants\?/g, mobotFaqs[0].q);
html = html.replace(/Bots have their own computer, so they can work inside your apps and tools\. They also run in parallel, 24\/7, even when your laptop is closed\./g, mobotFaqs[0].a);

html = html.replace(/Who is Grok Bot available for today\?/g, mobotFaqs[1].q);
html = html.replace(/Grok Bot is included with Premium, Super, Ultra, Teams, and Enterprise\./g, mobotFaqs[1].a);

html = html.replace(/Is Grok Bot available for enterprises\?/g, mobotFaqs[2].q);
html = html.replace(/Yes\. Grok Bot is generally available for Enterprise[\s\S]*?donât already have a seat\./g, mobotFaqs[2].a);

html = html.replace(/Where do I talk to Grok Bot\?/g, mobotFaqs[4].q);
html = html.replace(/Work with Grok Bot from your desktop \(macOS or Windows\) or your phone with the iOS app\./g, mobotFaqs[4].a);

html = html.replace(/How much does Grok Bot cost\?/g, mobotFaqs[5].q);
html = html.replace(/Grok Bot subscriptions come with weekly usage included[\s\S]*?contact sales<\/a>\./g, mobotFaqs[5].a);

html = html.replace(/Do Bots share one computer\?/g, mobotFaqs[6].q);
html = html.replace(/Yes\. Every Grok Bot shares one persistent cloud computer[\s\S]*?not per Grok Bot\./g, mobotFaqs[6].a);

html = html.replace(/How does Grok Bot handle my data &amp; privacy\?/g, mobotFaqs[7].q);
html = html.replace(/How does Grok Bot handle my data & privacy\?/g, mobotFaqs[7].q);
html = html.replace(/Grok Bot uses the same Cursor SSO, auth, and privacy mode you already trust[\s\S]*?network controls at boot\./g, mobotFaqs[7].a);

// ========================================================
// 13. FINAL CTA SECTION & MASCOT SPLIT EYES
// ========================================================
html = html.replace(/Meet your first Bot/g, 'Meet Yuki & Your MOBOT Swarm');
html = html.replace(
  /An AI teammate you can trust to get work done/g,
  'An autonomous Android companion you can trust to orchestrate real work directly on your device.'
);
html = html.replace(/Get started for free/g, 'Download Android APK');

// Footer CTA buttons (Direct APK Download + GitHub icon button)
const footerDownloadBtn = `<a href="${mobotApkUrl}" download class="inline-flex items-center justify-center rounded-full transition-colors bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-contrast h-11 gap-1.5 px-6 text-base font-normal" data-track="bot.footer.download">${androidIconSvg}Download Android APK</a>`;
html = html.replace(/<a [^>]*data-track=bot\.footer\.download[\s\S]*?<\/a>/, footerDownloadBtn);

const footerGithubBtn = `<a aria-label="View on GitHub" title="View on GitHub" class="inline-flex items-center justify-center rounded-full transition-colors bg-theme-card-03-hex text-theme-text duration-200 ease-out hover:bg-theme-fg-10 h-11 w-11 p-0 shrink-0" data-track="bot.footer.contact-sales" href="https://github.com/abhayShyam004/MOBOT" target="_blank" rel="noopener noreferrer">${githubIconSvg}</a>`;
html = html.replace(/<a [^>]*data-track=bot\.footer\.contact-sales[\s\S]*?<\/a>/, footerGithubBtn);

// Replace footer semi-circle with enlarged (1.25x), rotated (15deg clockwise) concave kite
const circlePath = 'd="M1301.32 813.33A488 488 0 0 0 813.33 325.33A488 488 0 0 0 325.33 813.33A488 488 0 0 0 813.33 1301.32A488 488 0 0 0 1301.32 813.33Z"';
const concaveKitePath = 'd="M 1062.8 194.6 Q 1085.4 187.7 1101.4 204.9 C 1187.3 357.8 1321.5 554.5 1418.9 710.5 Q 1442.2 729.7 1417.7 743.9 C 1297.7 826.9 1146.8 949.5 1005.1 1074.6 C 917.1 1146.1 841.6 1207.4 803.9 1238.1 C 786.6 1192.7 751.9 1101.9 711.4 995.9 C 651.3 816.7 581.9 635.1 519.4 503.2 Q 505.3 478.7 535.1 473.7 C 697.5 387.3 912.0 284.1 1062.8 194.6 Z"';
html = html.replace(circlePath, concaveKitePath);

// Split mascot eyes in #get-started into #mascot-eye-left and #mascot-eye-right
const targetEyePathStart = '<path d="M955.74 747.83';
const eyePathIdx = html.indexOf(targetEyePathStart);
if (eyePathIdx !== -1 && !html.includes('id="mascot-eye-left"')) {
  const eyeClosingIdx = html.indexOf('</path>', eyePathIdx);
  if (eyeClosingIdx !== -1) {
    const fullPathStr = html.slice(eyePathIdx, eyeClosingIdx + 7);
    const dMatch = fullPathStr.match(/d="([^"]+)"/);
    if (dMatch) {
      const d = dMatch[1];
      const splitIdx = d.indexOf('M1140.06');
      if (splitIdx !== -1) {
        const leftD = d.slice(0, splitIdx);
        const rightD = d.slice(splitIdx);
        const wrappedGroup = `<g id="mascot-eyes" class="mascot-eyes">` +
          `<g id="mascot-eye-left" class="mascot-eye" style="will-change: transform; transform: translate(0px, 0px);"><path d="${leftD}" fill="var(--bg)"></path></g>` +
          `<g id="mascot-eye-right" class="mascot-eye" style="will-change: transform; transform: translate(0px, 0px);"><path d="${rightD}" fill="var(--bg)"></path></g>` +
          `</g>`;
        html = html.slice(0, eyePathIdx) + wrappedGroup + html.slice(eyeClosingIdx + 7);
      }
    }
  }
}

// ========================================================
// 14. FOOTER SECTION & LINKS
// ========================================================
html = html.replace(/Â© \d{4} SpaceX SI LLC/g, 'Â© 2026 MOBOT Â· MIT Open Source');
html = html.replace(/Built with Grok/g, 'Open Source on GitHub');
html = html.replace(/Grok Bot is here/g, 'MOBOT 1.1.2 is here');
html = html.replace(/>Grok Bot</g, '>MOBOT<');
html = html.replace(/>Grok Build</g, '>Android APK<');
html = html.replace(/>Grok on X</g, '>GitHub Repo<');
html = html.replace(/>Grokipedia</g, '>Companion Docs<');
html = html.replace(/>grok\.com</g, '>GitHub<');
html = html.replace(/>@grok</g, '>@mobot<');
html = html.replace(/>@spacexsi</g, '>@mobot<');
html = html.replace(/sam@x\.ai/g, 'companion@mobot.local');
html = html.replace(/https:\/\/grokipedia\.com\/?/g, 'https://github.com/abhayShyam004/MOBOT#readme');
html = html.replace(/ai\.x\.grok/g, 'com.openmausbot.companion');
html = html.replace(/https:\/\/x\.com\/i\/grok/g, 'https://github.com/abhayShyam004/MOBOT');
html = html.replace(/@SpaceXSI/g, '@mobot');

// Contact Sales link in Footer redirect to Gmail
html = html.replace(/href=https:\/\/x\.ai\/contact-sales/gi, `href="${gmailFeedbackUrl}" target="_blank" rel="noopener noreferrer"`);
html = html.replace(/href=https:\/\/cursor\.com\/contact-sales[^\s"'>]*/gi, `href="${gmailFeedbackUrl}" target="_blank" rel="noopener noreferrer"`);

// Replace footer brand logo and copyright
const oldFooterBrandRegex = /<svg width=131 height=16 viewBox="0\.1128 0\.543 146\.6922 17\.8613"[\s\S]*?Â© \d{4} SpaceXAI LLC<\/span>/;
const mobotFooterBrand = `<div class="flex items-center gap-2.5">
  <img src="/logo.png" alt="MOBOT" width="24" height="24" class="size-6 object-contain select-none pointer-events-none" />
  <span class="font-display text-base font-bold tracking-tight text-primary">MOBOT</span>
</div>
<span class="text-primary mt-4 block text-[10px] leading-none">Â© 2026 MOBOT Â· MIT Open Source License</span>`;
html = html.replace(oldFooterBrandRegex, mobotFooterBrand);

// Footer download links: Android -> Download APK, iOS -> Releases
html = html.replace(/href="?https:\/\/play\.google\.com\/store\/apps\/details\?id=[^"'\s>]+"?/g, `href="${mobotApkUrl}" download`);
html = html.replace(/>Android<\/a>/g, '>Download APK</a>');
html = html.replace(/href="?https:\/\/apps\.apple\.com\/app\/apple-store\/id\d+"?[^>]*>iOS<\/a>/g, `href="https://github.com/abhayShyam004/MOBOT/releases" target="_blank" rel="noopener noreferrer">Releases</a>`);

// Any remaining cursor download links -> APK URL
html = html.replace(/https:\/\/api2\.cursor\.sh\/updates\/[^\s"'>]+/g, mobotApkUrl);
html = html.replace(/href=https:\/\/cursor\.com\/download[^\s"'>]*/g, `href="${mobotApkUrl}" download`);

// Generic URL replacements
html = html.replace(/https:\/\/grok\.com/g, 'https://github.com/abhayShyam004/MOBOT');
html = html.replace(/https:\/\/x\.ai/g, 'https://github.com/abhayShyam004/MOBOT');
html = html.replace(/https:\/\/docs\.x\.ai\/developers\/models/g, 'https://github.com/abhayShyam004/MOBOT');
html = html.replace(/https:\/\/docs\.x\.ai\/grok\/user-guide/g, 'https://github.com/abhayShyam004/MOBOT#readme');
html = html.replace(/https:\/\/docs\.x\.ai\/?/g, 'https://github.com/abhayShyam004/MOBOT#readme');
html = html.replace(/https:\/\/console\.x\.ai\/[^\s"'>]*/g, 'https://github.com/abhayShyam004/MOBOT');
html = html.replace(/https:\/\/status\.x\.ai\/?/g, 'https://github.com/abhayShyam004/MOBOT');
html = html.replace(/https:\/\/x\.com\/spacexsi/g, 'https://github.com/abhayShyam004/MOBOT');
html = html.replace(/https:\/\/x\.com\/grok/g, 'https://github.com/abhayShyam004/MOBOT');
html = html.replace(/https:\/\/discord\.com\/invite\/kqCc86jM55/g, 'https://github.com/abhayShyam004/MOBOT/discussions');

// ========================================================
// 15. BRAND KEYWORD SCRUB (CLASSES, ATTRIBUTES, VARS)
// ========================================================
html = html.replace(/baby-grok-bot/g, 'baby-mobot');
html = html.replace(/grok-bot/gi, 'mobot');
html = html.replace(/grokipedia/gi, 'mobot-docs');
html = html.replace(/\b([Gg])rok\b/g, 'MOBOT');
html = html.replace(/\bx\.ai\b/gi, 'mobot.local');
html = html.replace(/\bspacexsi\b/gi, 'mobot');
html = html.replace(/\bcursor\.com\b/gi, 'github.com/abhayShyam004/MOBOT');

// ========================================================
// 16. RESTORE PROTECTED BASE64 ASSETS
// ========================================================
for (const [key, val] of placeholders.entries()) {
  html = html.replace(key, val);
}
console.log(`[MOBOT-ADAPT] Restored ${placeholders.size} base64 assets.`);

// ========================================================
// 17. APPEND MODULE SCRIPT
// ========================================================
const scriptTag = '\n    <script type="module" src="/src/main.ts"></script>\n  </body>\n</html>';
html += scriptTag;

const targetHtml = path.resolve(__dirname, '../index.html');
fs.writeFileSync(targetHtml, html, 'utf8');
console.log(`[MOBOT-ADAPT] Successfully written ${html.length} bytes to ${targetHtml}`);
