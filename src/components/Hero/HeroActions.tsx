import React, { useState } from 'react';
import { ChevronDown, Terminal, Apple, Monitor } from 'lucide-react';

export const HeroActions: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 sm:mt-8">
      {/* Primary Download Button with Dropdown */}
      <div className="relative">
        <div className="inline-flex rounded-full bg-foreground text-background shadow-lg transition-all hover:bg-foreground/90">
          <a
            href="https://api2.cursor.sh/updates/download/stable/linux-x64/grok-bot-fb0a830618be0c54"
            download
            className="inline-flex h-12 items-center gap-2.5 px-6 text-sm font-medium"
          >
            <Terminal className="size-4" />
            <span>Download for Linux</span>
          </a>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex h-12 items-center border-l border-background/20 px-3.5 hover:bg-foreground/80 rounded-r-full transition-colors"
            aria-label="Download options"
          >
            <ChevronDown className={`size-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* OS Platform Dropdown */}
        {dropdownOpen && (
          <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 rounded-2xl bg-card border border-border p-2 shadow-2xl backdrop-blur-xl z-30 animate-in fade-in-0 zoom-in-95 duration-150">
            <a
              href="#"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-foreground/5 text-left transition-colors"
            >
              <Apple className="size-5 text-foreground/80 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-foreground">macOS</div>
                <div className="text-[11px] text-foreground/60">Universal (.dmg) · Apple Silicon & Intel</div>
              </div>
            </a>
            <a
              href="#"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-foreground/5 text-left transition-colors"
            >
              <Monitor className="size-5 text-foreground/80 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-foreground">Windows</div>
                <div className="text-[11px] text-foreground/60">x64 Installer (.exe)</div>
              </div>
            </a>
            <a
              href="#"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-foreground/5 text-left transition-colors"
            >
              <Terminal className="size-5 text-foreground/80 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-foreground">Linux</div>
                <div className="text-[11px] text-foreground/60">.deb, .AppImage, or .rpm</div>
              </div>
            </a>
          </div>
        )}
      </div>

      {/* Secondary Button */}
      <a
        href="https://cursor.com/contact-sales?product=grok-bot"
        className="inline-flex h-12 items-center justify-center rounded-full bg-foreground/[0.06] hover:bg-foreground/[0.1] px-6 text-sm font-medium text-foreground transition-colors"
      >
        Contact sales
      </a>
    </div>
  );
};
