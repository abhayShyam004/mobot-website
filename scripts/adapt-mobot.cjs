const fs = require('fs');
const path = require('path');

const candidates = [
  '/tmp/user_xai_bot.html',
  '/run/media/abhay/Abhay/Downloads/AI teammates that finish the work ｜ Grok Bot (10_17_2026 11：53：09 AM).html'
];

let srcPath = candidates.find(p => fs.existsSync(p));
if (!srcPath) {
  console.error('Source HTML not found in candidates');
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
html = html.replace(/value\s*>/g, '>');
html = html.replace('bg-background text-primary font-sans antialiased', 'bg-background text-primary font-sans antialiased overflow-x-clip');

// Remove SingleFile 16x16 video overlay link
html = html.replace(/<a href=https:\/\/media\.x\.ai\/[^>]*style="z-index:2147483647!important;[\s\S]*?<\/a>/gi, '');

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
html = html.replace(/<title>.*?<\/title>/i, '<title>MOBOT — Autonomous AI Companions for Android</title>');
html = html.replace(/content=SpaceXSI/g, 'content=MOBOT');
html = html.replace(/content=@spacexsi/g, 'content=@mobot_app');
html = html.replace(/content="@spacexsi"/g, 'content="@mobot_app"');
html = html.replace(/AI teammates that finish the work \| Grok Bot/g, 'Autonomous AI Companions that finish the work | MOBOT');

// ========================================================
// 4. NAVBAR BRANDING & ACCESSIBILITY
// ========================================================
const oldLogoRegex = /<a aria-label="Grok Bot Homepage"[\s\S]*?<\/a>/;
const mobotNavBrand = `<a aria-label="MOBOT Homepage" href="#hero" class="flex items-center gap-2.5 outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-white/20">
  <img src="/logo.png" alt="MOBOT" width="30" height="30" class="size-[30px] object-contain drop-shadow select-none pointer-events-none" />
  <span class="font-display text-lg font-bold tracking-tight text-white">MOBOT</span>
</a>`;
html = html.replace(oldLogoRegex, mobotNavBrand);
html = html.replace(/<a aria-label="SpaceXSI Homepage"[\s\S]*?<\/a>/g, mobotNavBrand);
html = html.replace(/aria-label="SpaceXSI Logo - Right click to copy SVG"/g, 'aria-label="MOBOT Logo"');
html = html.replace(/aria-label=SpaceXSI/g, 'aria-label=MOBOT');

// Header CTA button: "Get Grok" -> "Download APK"
html = html.replace(/<span class="truncate">Get Grok<\/span>/g, '<span class="truncate">Download APK</span>');
html = html.replace(/href=https:\/\/grok\.com\/\?product=grok-bot/g, 'href="#download"');

// Accessibility for mobile drawer
html = html.replace(/(<button[^>]*)(class=["'][^"']*visible nav:hidden[^"']*["'])/g, '$1aria-label="Open menu" $2');
if (!html.includes('aria-label="Open menu"')) {
  html = html.replace(/<button type=button([^>]*><svg[^>]*><g id="name=drawer")/g, '<button type=button aria-label="Open menu"$1');
}

// ========================================================
// 5. HERO SECTION
// ========================================================
html = html.replace(/Introducing Grok Bot/g, 'MOBOT 1.0 is here');
html = html.replace(/A new way to get work done/g, 'Autonomous AI Companions for Android');
html = html.replace(/href=https:\/\/x\.ai\/blog\/grok-bot/g, 'href="https://github.com/abhayShyam004/MOBOT"');

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

// Hero CTA buttons
html = html.replace(/>Download for Linux<\/a>/g, '>Download Android APK</a>');
html = html.replace(/Download for Linux \(Ubuntu \/ Debian x64\)/g, 'Download Android APK');
html = html.replace(/Contact sales/g, 'View on GitHub');
html = html.replace(/href=https:\/\/cursor\.com\/contact-sales\?product=grok-bot/g, 'href="https://github.com/abhayShyam004/MOBOT" target="_blank" rel="noopener noreferrer"');
html = html.replace(/href=https:\/\/api2\.cursor\.sh\/updates\/download\/stable\/linux-x64\/grok-bot-[a-f0-9]+/g, 'href="https://github.com/abhayShyam004/MOBOT/releases/latest"');

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
  /Overnight pipeline generation and outbound\.\s+Pick eligible prospects from this Google Sheet, research them on the web, grab context from Salesforce, and draft personalized outreach\./g,
  'take me yo the nearest metro station'
);
html = html.replace(
  /Can you follow up with all customers who showed interest in our enterprise tier\?/g,
  'take me yo the nearest metro station'
);
html = html.replace(
  /Running the pipeline generation routine now\. Scanning 48 contacts, matched 12 high-intent leads across target accounts\./g,
  'I opened your maps app with a search for the nearest metro station. Depending on your location permissions, it may ask you to enable location first.'
);
html = html.replace(
  /I've drafted 12 personalized follow-up emails for the enterprise prospects\. Would you like me to send them now\?/g,
  'I opened your maps app with a search for the nearest metro station. Depending on your location permissions, it may ask you to enable location first.'
);
html = html.replace(/• Gmail Connector/g, '• Android Intent: Google Maps');

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
  /Create a Bot, give it a task, and add another when the work grows—one on a project, one on outbound, one on systems\. AI teammates work in parallel, collaborate where it makes sense, and keep working 24\/7\./g,
  'Deploy a roster of specialist bots on your phone—one on daily companion tasks, one on world watches, one on document extraction. Agents execute in parallel with persistent state.'
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
html = html.replace(/Show a Bot how it[’']s done/g, 'Proactive Background Routines');
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
// 8. VIDEO SECTION
// ========================================================
html = html.replace(/The SpaceXSI team runs on Grok Bot/g, 'The team runs on MOBOT');
html = html.replace(/The team runs on Grok Bot/g, 'The team runs on MOBOT');

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
html = html.replace(/>\/ month</g, '>forever · MIT<');
html = html.replace(/billed annually or \$\d+ billed monthly/g, '100% Free & Open Source on GitHub');
html = html.replace(
  /Already on an eligible Premium, Super, Ultra, Teams, or Enterprise plan\? Grok Bot is included\./g,
  'All agent state, credentials, and SQLite workspaces remain securely on your device. Zero telemetry.'
);
html = html.replace(/Grok Bot is included\./g, 'MIT Open Source License.');
html = html.replace(/Sign in with your plan/g, 'Audit Source on GitHub');
html = html.replace(/Weekly Grok Bot usage included/g, 'Zero Telemetry & Local SQLite Storage');

// Replace pricing card CTA buttons
html = html.replace(
  /<a [^>]*product=grok-bot">Get Premium<\/a>/g,
  '<a href="#download" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-medium py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Download APK</a>'
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
  /One team, wherever you are — on your desk and in your pocket\./g,
  'Autonomous on-device agent companion for Android. Run directly on your phone with zero root required.'
);
html = html.replace(/https:\/\/cursor\.com\/download/g, 'https://github.com/abhayShyam004/MOBOT/releases/latest');

// Linux package dropdown -> Android package dropdown
html = html.replace(
  /<span class="text-sm font-medium">Linux<\/span><span class="text-theme-text-muted text-xs">\.deb, AppImage or \.rpm · x64 and arm64<\/span>/g,
  '<span class="text-sm font-medium">Android (ARM64 & x86_64)</span><span class="text-theme-text-muted text-xs">.apk · Android 10+ · Zero root required</span>'
);
html = html.replace(
  /<span>More downloads<\/span><span class="text-theme-text-muted text-xs font-normal">Other platforms and devices<\/span>/g,
  '<span>Alternative Installs</span><span class="text-theme-text-muted text-xs font-normal">ADB CLI, Termux & source build</span>'
);

const linuxDropdownTrigger = 'data-linux-picker-trigger=true';
const androidDropdownMarkup = `<div id="_r_0_" role="region" aria-label="Android package options" class="linux-picker-panel hidden mt-2 rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur-xl shadow-2xl">
  <div class="flex flex-col gap-2">
    <a href="https://github.com/abhayShyam004/MOBOT/releases/latest" class="flex items-center justify-between rounded-xl p-3 text-sm text-white/90 hover:bg-white/10 transition-colors">
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

if (html.includes(linuxDropdownTrigger) && !html.includes('id="_r_0_"')) {
  const triggerIdx = html.indexOf(linuxDropdownTrigger);
  const closingDivIdx = html.indexOf('</div>', triggerIdx);
  if (closingDivIdx !== -1) {
    html = html.slice(0, closingDivIdx + 6) + androidDropdownMarkup + html.slice(closingDivIdx + 6);
  }
}

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
// 12. FAQ SECTION (ACCORDION & JSON-LD)
// ========================================================
const mobotFaqs = [
  {
    q: 'What is MOBOT and how is it different from AI assistants?',
    a: 'MOBOT is an autonomous companion that runs natively on Android. Unlike cloud chatbots that only return text, MOBOT executes actions using direct Android intents (Google Maps, camera, notifications, background routines), keeps persistent memory in local SQLite, and operates completely offline with zero telemetry.'
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
html = html.replace(/Yes\. Grok Bot is generally available for Enterprise[\s\S]*?don’t already have a seat\./g, mobotFaqs[2].a);

html = html.replace(/Where do I talk to Grok Bot\?/g, mobotFaqs[3].q);
html = html.replace(/Work with Grok Bot from your desktop \(macOS or Windows\) or your phone with the iOS app\./g, mobotFaqs[3].a);

html = html.replace(/How much does Grok Bot cost\?/g, mobotFaqs[4].q);
html = html.replace(/Grok Bot subscriptions come with weekly usage included[\s\S]*?contact sales<\/a>\./g, mobotFaqs[4].a);

html = html.replace(/Do Bots share one computer\?/g, mobotFaqs[5].q);
html = html.replace(/Yes\. Every Grok Bot shares one persistent cloud computer[\s\S]*?not per Grok Bot\./g, mobotFaqs[5].a);

html = html.replace(/How does Grok Bot handle my data &amp; privacy\?/g, mobotFaqs[6].q);
html = html.replace(/How does Grok Bot handle my data & privacy\?/g, mobotFaqs[6].q);
html = html.replace(/Grok Bot uses the same Cursor SSO, auth, and privacy mode you already trust[\s\S]*?network controls at boot\./g, mobotFaqs[6].a);

// ========================================================
// 13. FINAL CTA SECTION & MASCOT SPLIT EYES
// ========================================================
html = html.replace(/Meet your first Bot/g, 'Meet Yuki & Your MOBOT Swarm');
html = html.replace(
  /An AI teammate you can trust to get work done/g,
  'An autonomous Android companion you can trust to orchestrate real work directly on your device.'
);
html = html.replace(/Get started for free/g, 'Download Android APK');

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
html = html.replace(/© \d{4} SpaceX SI LLC/g, '© 2026 MOBOT · MIT Open Source');
html = html.replace(/Built with Grok/g, 'Open Source on GitHub');
html = html.replace(/Grok Bot is here/g, 'MOBOT 1.0 is here');
html = html.replace(/>Grok Bot</g, '>MOBOT<');
html = html.replace(/>Grok Build</g, '>Android APK<');
html = html.replace(/>Grok on X</g, '>GitHub Repo<');
html = html.replace(/>Grokipedia</g, '>Companion Docs<');
html = html.replace(/>grok\.com</g, '>github.com/abhayShyam004/MOBOT<');
html = html.replace(/>@grok</g, '>@mobot<');
html = html.replace(/>@spacexsi</g, '>@mobot<');
html = html.replace(/sam@x\.ai/g, 'companion@mobot.local');
html = html.replace(/https:\/\/grokipedia\.com\/?/g, 'https://github.com/abhayShyam004/MOBOT#readme');
html = html.replace(/ai\.x\.grok/g, 'com.openmausbot.companion');
html = html.replace(/https:\/\/x\.com\/i\/grok/g, 'https://github.com/abhayShyam004/MOBOT');
html = html.replace(/@SpaceXSI/g, '@mobot');

// Replace footer brand logo and copyright
const oldFooterBrandRegex = /<svg width=131 height=16 viewBox="0\.1128 0\.543 146\.6922 17\.8613"[\s\S]*?© \d{4} SpaceXAI LLC<\/span>/;
const mobotFooterBrand = `<div class="flex items-center gap-2.5">
  <img src="/logo.png" alt="MOBOT" width="24" height="24" class="size-6 object-contain drop-shadow select-none pointer-events-none" />
  <span class="font-display text-base font-bold tracking-tight text-white">MOBOT</span>
</div>
<span class="text-primary mt-4 block text-[10px] leading-none">© 2026 MOBOT · MIT Open Source License</span>`;
html = html.replace(oldFooterBrandRegex, mobotFooterBrand);

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
