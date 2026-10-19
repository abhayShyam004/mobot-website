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
  <div class="shrink-0" style="width:28px;height:28px;border-radius:6px;overflow:hidden;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="28" height="28" style="width:28px;height:28px;display:block" role="img" aria-hidden="true">
      <defs>
        <clipPath id="mobot-app-tile"><rect width="1024" height="1024" rx="224" /></clipPath>
        <linearGradient id="mobot-mascot-silver" x1="18%" y1="10%" x2="84%" y2="94%">
          <stop offset="0" stop-color="#FFFFFF" />
          <stop offset="0.28" stop-color="#E6E8EB" />
          <stop offset="0.58" stop-color="#B7BBC2" />
          <stop offset="0.82" stop-color="#848A94" />
          <stop offset="1" stop-color="#5B616B" />
        </linearGradient>
      </defs>
      <g clip-path="url(#mobot-app-tile)">
        <rect width="1024" height="1024" fill="#000000" />
        <path fill="url(#mobot-mascot-silver)" fill-rule="evenodd" d="M 855.02 307.86 C 853.52 311.72 852.03 315.58 850.54 319.44 C 847.65 326.93 844.71 334.40 841.76 341.87 C 836.84 354.31 832.20 366.84 827.57 379.39 C 821.95 394.57 816.25 409.71 810.56 424.86 C 805.83 437.46 801.11 450.05 796.40 462.65 C 787.38 486.76 778.27 510.81 768.83 534.76 C 763.60 548.10 758.73 561.55 753.95 575.06 C 749.45 587.42 744.60 599.64 739.78 611.88 C 735.43 622.96 731.25 634.06 727.28 645.28 C 721.93 660.40 716.12 675.31 710.24 690.23 C 705.89 701.30 701.71 712.41 697.74 723.63 C 693.08 736.80 688.09 749.80 682.97 762.80 C 676.91 778.19 671.13 793.65 665.60 809.25 C 653.91 841.70 641.59 873.92 628.95 906.00 C 623.71 919.35 618.85 932.79 614.07 946.31 C 609.57 958.67 604.72 970.89 599.90 983.13 C 595.55 994.20 591.37 1005.31 587.40 1016.53 C 553.14 1112.62 553.14 1112.62 516.31 1130.67 C 484.93 1144.17 457.26 1148.81 424.19 1137.67 C 400.29 1127.05 375.46 1112.10 364.88 1086.92 C 364.25 1085.10 363.61 1083.28 362.96 1081.41 C 362.22 1079.31 361.48 1077.21 360.72 1075.05 C 359.54 1071.62 359.54 1071.62 358.33 1068.13 C 357.48 1065.70 356.63 1063.28 355.75 1060.79 C 353.91 1055.53 352.07 1050.26 350.24 1045.00 C 347.33 1036.64 344.40 1028.28 341.47 1019.93 C 333.12 996.17 324.81 972.41 316.52 948.64 C 311.44 934.09 306.34 919.55 301.23 905.02 C 299.29 899.50 297.37 893.99 295.45 888.47 C 270.91 817.76 240.19 757.92 170.76 721.70 C 153.30 713.50 134.62 708.21 116.24 702.53 C 101.98 698.05 87.84 693.23 73.67 688.47 C 50.38 680.71 27.06 673.07 3.70 665.52 C -1.79 663.74 -7.29 661.95 -12.78 660.17 C -23.39 656.72 -34.01 653.33 -44.64 649.96 C -82.46 637.86 -119.55 625.93 -140.31 589.31 C -154.81 554.43 -162.14 524.71 -148.01 488.11 C -134.11 458.09 -112.06 437.84 -81.52 425.66 C -78.53 424.47 -75.54 423.27 -72.47 422.04 C -69.20 420.74 -65.93 419.44 -62.56 418.10 C -59.04 416.70 -55.53 415.30 -52.02 413.89 C -42.38 410.04 -32.74 406.21 -23.10 402.37 C -12.74 398.25 -2.38 394.11 7.98 389.97 C 32.87 380.04 57.78 370.12 82.69 360.20 C 94.40 355.54 106.10 350.87 117.81 346.21 C 121.30 344.82 121.30 344.82 124.87 343.40 C 129.59 341.52 134.31 339.63 139.04 337.75 C 150.99 332.99 162.93 328.23 174.88 323.47 C 177.26 322.52 179.65 321.57 182.10 320.59 C 196.72 314.77 211.34 308.95 225.96 303.13 C 287.71 278.54 349.42 253.88 411.11 229.15 C 439.23 217.88 467.36 206.64 495.49 195.39 C 518.02 186.39 540.53 177.37 563.04 168.32 C 578.42 162.13 593.81 155.98 609.20 149.84 C 618.02 146.33 626.84 142.80 635.64 139.24 C 739.26 97.41 739.26 97.41 793.85 115.12 C 875.04 150.01 884.06 234.58 855.02 307.86 Z M 350.90 440.19 L 359.96 440.49 L 368.77 442.38 L 377.08 445.97 L 384.54 451.07 L 390.86 457.56 L 395.84 465.11 L 399.38 473.41 L 401.23 482.26 L 401.49 491.28 L 400.39 500.26 L 398.62 509.16 L 396.72 518.01 L 395.08 526.90 L 393.43 535.80 L 391.79 544.69 L 390.02 553.59 L 388.12 562.44 L 385.34 571.04 L 381.13 579.05 L 375.48 586.09 L 368.61 591.99 L 360.77 596.50 L 352.25 599.53 L 343.36 601.01 L 334.29 600.80 L 325.44 598.90 L 317.18 595.32 L 309.76 590.18 L 303.48 583.64 L 298.50 576.10 L 295.01 567.75 L 293.19 558.90 L 293.07 549.88 L 294.25 540.90 L 296.02 532.05 L 297.91 523.19 L 299.68 514.30 L 301.41 505.40 L 303.10 496.51 L 304.74 487.62 L 306.47 478.72 L 309.04 470.08 L 313.13 461.99 L 318.74 454.90 L 325.57 449.00 L 333.45 444.53 L 341.97 441.58 Z M 582.49 477.08 L 590.84 479.14 L 598.39 483.19 L 604.88 488.80 L 610.06 495.62 L 613.86 503.34 L 616.13 511.60 L 616.93 520.16 L 616.60 528.76 L 615.50 537.27 L 614.11 545.75 L 612.68 554.22 L 611.16 562.69 L 609.60 571.12 L 607.87 579.55 L 605.97 587.94 L 603.95 596.29 L 601.25 604.42 L 597.46 612.18 L 592.65 619.26 L 586.75 625.50 L 579.88 630.64 L 572.21 634.48 L 563.90 636.71 L 555.35 637.13 L 546.92 635.53 L 539.16 631.91 L 532.50 626.47 L 527.40 619.60 L 523.90 611.80 L 522.00 603.41 L 521.62 594.85 L 522.64 586.30 L 524.53 577.91 L 526.43 569.52 L 528.16 561.13 L 529.84 552.70 L 531.45 544.23 L 532.75 535.75 L 534.06 527.24 L 535.58 518.81 L 537.73 510.50 L 541.10 502.58 L 545.65 495.33 L 551.38 488.92 L 558.09 483.57 L 565.67 479.56 L 573.94 477.29 Z M 376.40 708.21 L 378.08 708.79 L 379.81 709.36 L 381.54 709.92 L 383.28 710.48 L 385.01 711.02 L 386.75 711.56 L 388.49 712.08 L 390.23 712.60 L 391.97 713.10 L 393.72 713.60 L 395.46 714.08 L 397.21 714.56 L 398.96 715.03 L 400.71 715.48 L 402.47 715.93 L 404.22 716.36 L 405.98 716.79 L 407.74 717.20 L 409.50 717.61 L 411.26 718.00 L 413.02 718.39 L 414.79 718.76 L 416.56 719.13 L 418.33 719.48 L 420.10 719.83 L 421.87 720.16 L 423.65 720.49 L 425.42 720.81 L 427.20 721.11 L 428.98 721.41 L 430.76 721.69 L 432.54 721.97 L 434.33 722.23 L 436.11 722.49 L 437.90 722.73 L 439.69 722.97 L 441.48 723.19 L 443.28 723.41 L 445.07 723.61 L 446.87 723.81 L 448.66 723.99 L 450.46 724.17 L 452.26 724.33 L 454.07 724.49 L 455.87 724.63 L 457.68 724.77 L 459.48 724.89 L 461.29 725.01 L 463.10 725.11 L 464.91 725.21 L 466.73 725.29 L 468.54 725.37 L 470.36 725.43 L 472.17 725.49 L 473.99 725.53 L 475.81 725.57 L 477.63 725.59 L 479.46 725.61 L 481.24 725.61 L 481.24 725.61 L 484.53 725.28 L 487.67 724.27 L 490.54 722.62 L 493.00 720.42 L 494.95 717.75 L 496.30 714.73 L 497.00 711.50 L 497.01 708.20 L 496.33 704.96 L 494.99 701.94 L 493.06 699.26 L 490.61 697.04 L 487.75 695.38 L 484.61 694.35 L 481.33 694.00 L 481.33 694.00 L 479.63 694.00 L 477.98 693.98 L 476.33 693.96 L 474.69 693.93 L 473.04 693.89 L 471.40 693.84 L 469.76 693.78 L 468.12 693.71 L 466.48 693.63 L 464.84 693.55 L 463.21 693.45 L 461.58 693.35 L 459.95 693.24 L 458.32 693.11 L 456.69 692.98 L 455.06 692.84 L 453.44 692.69 L 451.82 692.54 L 450.19 692.37 L 448.57 692.19 L 446.96 692.01 L 445.34 691.81 L 443.72 691.61 L 442.11 691.40 L 440.50 691.18 L 438.89 690.95 L 437.28 690.71 L 435.67 690.46 L 434.07 690.20 L 432.46 689.94 L 430.86 689.66 L 429.26 689.38 L 427.66 689.08 L 426.06 688.78 L 424.47 688.47 L 422.87 688.15 L 421.28 687.82 L 419.68 687.48 L 418.09 687.13 L 416.50 686.78 L 414.92 686.41 L 413.33 686.04 L 411.75 685.65 L 410.16 685.26 L 408.58 684.86 L 407.00 684.45 L 405.42 684.03 L 403.84 683.60 L 402.26 683.16 L 400.69 682.71 L 399.11 682.26 L 397.54 681.79 L 395.97 681.32 L 394.40 680.84 L 392.83 680.34 L 391.26 679.84 L 389.70 679.33 L 388.13 678.81 L 386.53 678.27 L 386.53 678.27 L 383.31 677.54 L 380.00 677.50 L 376.76 678.15 L 373.73 679.46 L 371.03 681.37 L 368.79 683.80 L 367.10 686.64 L 366.04 689.77 L 365.66 693.05 L 365.96 696.34 L 366.95 699.49 L 368.56 702.38 L 370.74 704.86 L 373.39 706.83 L 376.40 708.21 Z" />
      </g>
    </svg>
  </div>
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
  <div class="shrink-0" style="width:24px;height:24px;border-radius:5px;overflow:hidden;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="24" height="24" style="width:24px;height:24px;display:block" role="img" aria-hidden="true">
      <defs>
        <clipPath id="mobot-footer-tile"><rect width="1024" height="1024" rx="224" /></clipPath>
        <linearGradient id="mobot-mascot-silver-footer" x1="18%" y1="10%" x2="84%" y2="94%">
          <stop offset="0" stop-color="#FFFFFF" />
          <stop offset="0.28" stop-color="#E6E8EB" />
          <stop offset="0.58" stop-color="#B7BBC2" />
          <stop offset="0.82" stop-color="#848A94" />
          <stop offset="1" stop-color="#5B616B" />
        </linearGradient>
      </defs>
      <g clip-path="url(#mobot-footer-tile)">
        <rect width="1024" height="1024" fill="#000000" />
        <path fill="url(#mobot-mascot-silver-footer)" fill-rule="evenodd" d="M 855.02 307.86 C 853.52 311.72 852.03 315.58 850.54 319.44 C 847.65 326.93 844.71 334.40 841.76 341.87 C 836.84 354.31 832.20 366.84 827.57 379.39 C 821.95 394.57 816.25 409.71 810.56 424.86 C 805.83 437.46 801.11 450.05 796.40 462.65 C 787.38 486.76 778.27 510.81 768.83 534.76 C 763.60 548.10 758.73 561.55 753.95 575.06 C 749.45 587.42 744.60 599.64 739.78 611.88 C 735.43 622.96 731.25 634.06 727.28 645.28 C 721.93 660.40 716.12 675.31 710.24 690.23 C 705.89 701.30 701.71 712.41 697.74 723.63 C 693.08 736.80 688.09 749.80 682.97 762.80 C 676.91 778.19 671.13 793.65 665.60 809.25 C 653.91 841.70 641.59 873.92 628.95 906.00 C 623.71 919.35 618.85 932.79 614.07 946.31 C 609.57 958.67 604.72 970.89 599.90 983.13 C 595.55 994.20 591.37 1005.31 587.40 1016.53 C 553.14 1112.62 553.14 1112.62 516.31 1130.67 C 484.93 1144.17 457.26 1148.81 424.19 1137.67 C 400.29 1127.05 375.46 1112.10 364.88 1086.92 C 364.25 1085.10 363.61 1083.28 362.96 1081.41 C 362.22 1079.31 361.48 1077.21 360.72 1075.05 C 359.54 1071.62 359.54 1071.62 358.33 1068.13 C 357.48 1065.70 356.63 1063.28 355.75 1060.79 C 353.91 1055.53 352.07 1050.26 350.24 1045.00 C 347.33 1036.64 344.40 1028.28 341.47 1019.93 C 333.12 996.17 324.81 972.41 316.52 948.64 C 311.44 934.09 306.34 919.55 301.23 905.02 C 299.29 899.50 297.37 893.99 295.45 888.47 C 270.91 817.76 240.19 757.92 170.76 721.70 C 153.30 713.50 134.62 708.21 116.24 702.53 C 101.98 698.05 87.84 693.23 73.67 688.47 C 50.38 680.71 27.06 673.07 3.70 665.52 C -1.79 663.74 -7.29 661.95 -12.78 660.17 C -23.39 656.72 -34.01 653.33 -44.64 649.96 C -82.46 637.86 -119.55 625.93 -140.31 589.31 C -154.81 554.43 -162.14 524.71 -148.01 488.11 C -134.11 458.09 -112.06 437.84 -81.52 425.66 C -78.53 424.47 -75.54 423.27 -72.47 422.04 C -69.20 420.74 -65.93 419.44 -62.56 418.10 C -59.04 416.70 -55.53 415.30 -52.02 413.89 C -42.38 410.04 -32.74 406.21 -23.10 402.37 C -12.74 398.25 -2.38 394.11 7.98 389.97 C 32.87 380.04 57.78 370.12 82.69 360.20 C 94.40 355.54 106.10 350.87 117.81 346.21 C 121.30 344.82 121.30 344.82 124.87 343.40 C 129.59 341.52 134.31 339.63 139.04 337.75 C 150.99 332.99 162.93 328.23 174.88 323.47 C 177.26 322.52 179.65 321.57 182.10 320.59 C 196.72 314.77 211.34 308.95 225.96 303.13 C 287.71 278.54 349.42 253.88 411.11 229.15 C 439.23 217.88 467.36 206.64 495.49 195.39 C 518.02 186.39 540.53 177.37 563.04 168.32 C 578.42 162.13 593.81 155.98 609.20 149.84 C 618.02 146.33 626.84 142.80 635.64 139.24 C 739.26 97.41 739.26 97.41 793.85 115.12 C 875.04 150.01 884.06 234.58 855.02 307.86 Z M 350.90 440.19 L 359.96 440.49 L 368.77 442.38 L 377.08 445.97 L 384.54 451.07 L 390.86 457.56 L 395.84 465.11 L 399.38 473.41 L 401.23 482.26 L 401.49 491.28 L 400.39 500.26 L 398.62 509.16 L 396.72 518.01 L 395.08 526.90 L 393.43 535.80 L 391.79 544.69 L 390.02 553.59 L 388.12 562.44 L 385.34 571.04 L 381.13 579.05 L 375.48 586.09 L 368.61 591.99 L 360.77 596.50 L 352.25 599.53 L 343.36 601.01 L 334.29 600.80 L 325.44 598.90 L 317.18 595.32 L 309.76 590.18 L 303.48 583.64 L 298.50 576.10 L 295.01 567.75 L 293.19 558.90 L 293.07 549.88 L 294.25 540.90 L 296.02 532.05 L 297.91 523.19 L 299.68 514.30 L 301.41 505.40 L 303.10 496.51 L 304.74 487.62 L 306.47 478.72 L 309.04 470.08 L 313.13 461.99 L 318.74 454.90 L 325.57 449.00 L 333.45 444.53 L 341.97 441.58 Z M 582.49 477.08 L 590.84 479.14 L 598.39 483.19 L 604.88 488.80 L 610.06 495.62 L 613.86 503.34 L 616.13 511.60 L 616.93 520.16 L 616.60 528.76 L 615.50 537.27 L 614.11 545.75 L 612.68 554.22 L 611.16 562.69 L 609.60 571.12 L 607.87 579.55 L 605.97 587.94 L 603.95 596.29 L 601.25 604.42 L 597.46 612.18 L 592.65 619.26 L 586.75 625.50 L 579.88 630.64 L 572.21 634.48 L 563.90 636.71 L 555.35 637.13 L 546.92 635.53 L 539.16 631.91 L 532.50 626.47 L 527.40 619.60 L 523.90 611.80 L 522.00 603.41 L 521.62 594.85 L 522.64 586.30 L 524.53 577.91 L 526.43 569.52 L 528.16 561.13 L 529.84 552.70 L 531.45 544.23 L 532.75 535.75 L 534.06 527.24 L 535.58 518.81 L 537.73 510.50 L 541.10 502.58 L 545.65 495.33 L 551.38 488.92 L 558.09 483.57 L 565.67 479.56 L 573.94 477.29 Z M 376.40 708.21 L 378.08 708.79 L 379.81 709.36 L 381.54 709.92 L 383.28 710.48 L 385.01 711.02 L 386.75 711.56 L 388.49 712.08 L 390.23 712.60 L 391.97 713.10 L 393.72 713.60 L 395.46 714.08 L 397.21 714.56 L 398.96 715.03 L 400.71 715.48 L 402.47 715.93 L 404.22 716.36 L 405.98 716.79 L 407.74 717.20 L 409.50 717.61 L 411.26 718.00 L 413.02 718.39 L 414.79 718.76 L 416.56 719.13 L 418.33 719.48 L 420.10 719.83 L 421.87 720.16 L 423.65 720.49 L 425.42 720.81 L 427.20 721.11 L 428.98 721.41 L 430.76 721.69 L 432.54 721.97 L 434.33 722.23 L 436.11 722.49 L 437.90 722.73 L 439.69 722.97 L 441.48 723.19 L 443.28 723.41 L 445.07 723.61 L 446.87 723.81 L 448.66 723.99 L 450.46 724.17 L 452.26 724.33 L 454.07 724.49 L 455.87 724.63 L 457.68 724.77 L 459.48 724.89 L 461.29 725.01 L 463.10 725.11 L 464.91 725.21 L 466.73 725.29 L 468.54 725.37 L 470.36 725.43 L 472.17 725.49 L 473.99 725.53 L 475.81 725.57 L 477.63 725.59 L 479.46 725.61 L 481.24 725.61 L 481.24 725.61 L 484.53 725.28 L 487.67 724.27 L 490.54 722.62 L 493.00 720.42 L 494.95 717.75 L 496.30 714.73 L 497.00 711.50 L 497.01 708.20 L 496.33 704.96 L 494.99 701.94 L 493.06 699.26 L 490.61 697.04 L 487.75 695.38 L 484.61 694.35 L 481.33 694.00 L 481.33 694.00 L 479.63 694.00 L 477.98 693.98 L 476.33 693.96 L 474.69 693.93 L 473.04 693.89 L 471.40 693.84 L 469.76 693.78 L 468.12 693.71 L 466.48 693.63 L 464.84 693.55 L 463.21 693.45 L 461.58 693.35 L 459.95 693.24 L 458.32 693.11 L 456.69 692.98 L 455.06 692.84 L 453.44 692.69 L 451.82 692.54 L 450.19 692.37 L 448.57 692.19 L 446.96 692.01 L 445.34 691.81 L 443.72 691.61 L 442.11 691.40 L 440.50 691.18 L 438.89 690.95 L 437.28 690.71 L 435.67 690.46 L 434.07 690.20 L 432.46 689.94 L 430.86 689.66 L 429.26 689.38 L 427.66 689.08 L 426.06 688.78 L 424.47 688.47 L 422.87 688.15 L 421.28 687.82 L 419.68 687.48 L 418.09 687.13 L 416.50 686.78 L 414.92 686.41 L 413.33 686.04 L 411.75 685.65 L 410.16 685.26 L 408.58 684.86 L 407.00 684.45 L 405.42 684.03 L 403.84 683.60 L 402.26 683.16 L 400.69 682.71 L 399.11 682.26 L 397.54 681.79 L 395.97 681.32 L 394.40 680.84 L 392.83 680.34 L 391.26 679.84 L 389.70 679.33 L 388.13 678.81 L 386.53 678.27 L 386.53 678.27 L 383.31 677.54 L 380.00 677.50 L 376.76 678.15 L 373.73 679.46 L 371.03 681.37 L 368.79 683.80 L 367.10 686.64 L 366.04 689.77 L 365.66 693.05 L 365.96 696.34 L 366.95 699.49 L 368.56 702.38 L 370.74 704.86 L 373.39 706.83 L 376.40 708.21 Z" />
      </g>
    </svg>
  </div>
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
