const fs = require('fs');
const path = require('path');

const candidates = [
  '/run/media/abhay/Abhay/Downloads/AI teammates that finish the work ｜ Grok Bot (10_17_2026 11：53：09 AM).html',
  '/tmp/user_xai_bot.html'
];

let srcPath = candidates.find(p => fs.existsSync(p));
if (!srcPath) {
  console.error('Source HTML not found in candidates');
  process.exit(1);
}

console.log('Using source:', srcPath);
let html = fs.readFileSync(srcPath, 'utf8');

// 1. Remove autofill wizard extension artifact
const autofillIdx = html.indexOf('<div id=autofill-wizard');
if (autofillIdx !== -1) {
  html = html.slice(0, autofillIdx);
}

// 2. Remove CSP and other offline restrictions injected by SingleFile
html = html.replace(/<meta\s+http-equiv=[\"']?content-security-policy[\"']?[^>]*>/gi, '');
html = html.replace(/<style[^>]*>\s*\.sf-hidden\{display:none!important\}\s*<\/style>/gi, '');
html = html.replace(/<style[^>]*>\s*:host\{--accent-color:[\s\S]*?<\/style>/gi, '');

// 3. Remove sf-hidden class so responsive classes work as designed
html = html.replace(/\bsf-hidden\b/g, '');
html = html.replace(/class=\s*>/g, '>');
html = html.replace(/value\s*>/g, '>');

// 4. Ensure composer input in hero demo is interactive
html = html.replace('contenteditable=false data-empty', 'contenteditable=true data-empty tabindex=0');
html = html.replace('aria-readonly=true class=baby-grok-bot-composer-field-input', 'aria-readonly=false class=baby-grok-bot-composer-field-input');

// 5. Ensure mobile menu button has aria-label for accessibility
html = html.replace(/(<button[^>]*)(class=[\"'][^\"']*visible nav:hidden[^\"']*[\"'])/g, '$1aria-label=\"Open menu\" $2');
if (!html.includes('aria-label=\"Open menu\"')) {
  html = html.replace(/<button type=button([^>]*><svg[^>]*><g id=\"name=drawer\")/g, '<button type=button aria-label=\"Open menu\"$1');
}

// 6. Ensure hero header uses h2 for active bot heading
html = html.replace(/<span class=\"block truncate text-\[13px\] leading-\[18px\] tracking-\[-0\.08px\]\" style=color:var\(--cursor-text-primary\);opacity:1;transform:none>Sales Outbound<\/span>/g, '<h2 class=\"block truncate text-[13px] leading-[18px] tracking-[-0.08px] font-normal\" style=\"color:var(--cursor-text-primary);opacity:1;transform:none\">Sales Outbound</h2>');

// 6. Ensure Linux download dropdown options panel is present inside #download
const linuxDropdownTrigger = 'data-linux-picker-trigger=true';
const linuxDropdownMarkup = `<div id="_r_0_" role="region" aria-label="Linux package options" class="linux-picker-panel hidden mt-2 rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur-xl shadow-2xl">
  <div class="flex flex-col gap-2">
    <a href="#" class="flex items-center justify-between rounded-xl p-3 text-sm text-white/90 hover:bg-white/10 transition-colors">
      <span class="font-medium">.deb (Ubuntu / Debian x64)</span>
      <span class="text-xs text-white/50">Debian Package</span>
    </a>
    <a href="#" class="flex items-center justify-between rounded-xl p-3 text-sm text-white/90 hover:bg-white/10 transition-colors">
      <span class="font-medium">.deb (Ubuntu / Debian ARM64)</span>
      <span class="text-xs text-white/50">ARM64</span>
    </a>
    <a href="#" class="flex items-center justify-between rounded-xl p-3 text-sm text-white/90 hover:bg-white/10 transition-colors">
      <span class="font-medium">.rpm (Fedora / RHEL x64)</span>
      <span class="text-xs text-white/50">RPM Package</span>
    </a>
    <a href="#" class="flex items-center justify-between rounded-xl p-3 text-sm text-white/90 hover:bg-white/10 transition-colors">
      <span class="font-medium">.tar.gz (Generic Linux x64)</span>
      <span class="text-xs text-white/50">Tarball</span>
    </a>
  </div>
</div>`;

if (html.includes(linuxDropdownTrigger) && !html.includes('id=\"_r_0_\"')) {
  // Insert after the parent div of the linux trigger
  const triggerIdx = html.indexOf(linuxDropdownTrigger);
  const closingDivIdx = html.indexOf('</div>', triggerIdx);
  if (closingDivIdx !== -1) {
    html = html.slice(0, closingDivIdx + 6) + linuxDropdownMarkup + html.slice(closingDivIdx + 6);
  }
}

// 7. Ensure module script is connected before body closing tag
const targetHtml = path.resolve(__dirname, '../index.html');
const scriptTag = '\n    <script type=\"module\" src=\"/src/main.ts\"></script>\n  </body>\n</html>';
html += scriptTag;

fs.writeFileSync(targetHtml, html, 'utf8');
console.log('Successfully wrote synchronized index.html (' + (html.length / 1024).toFixed(1) + ' KB)');
