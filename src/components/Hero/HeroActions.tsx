import React, { useState } from 'react';
import { ChevronDown, Terminal, Apple, Monitor } from 'lucide-react';

export const HeroActions: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-7 sm:mt-8">
      {/* Primary Download Button with Dropdown Selector */}
      <div className="relative">
        <div className="inline-flex rounded-full bg-black text-white shadow-md transition-all hover:bg-black/90">
          <a
            href="https://api2.cursor.sh/updates/download/stable/linux-x64/grok-bot-fb0a830618be0c54"
            download
            className="inline-flex h-11 items-center gap-2.5 px-6 text-sm font-medium"
          >
            <Terminal className="size-4 opacity-80" />
            <span>Download for Linux</span>
          </a>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Other downloads"
            aria-expanded={dropdownOpen}
            className="flex h-11 items-center justify-center border-l border-white/20 px-3 hover:bg-white/10 transition-colors rounded-r-full cursor-pointer"
          >
            <ChevronDown
              className={`size-4 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Platform Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white border border-black/[0.08] p-2 shadow-2xl z-30 animate-in fade-in-0 zoom-in-95 duration-150">
            <a
              href="https://cursor.com/download"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-black hover:bg-black/[0.04] transition-colors"
            >
              <Apple className="size-4 opacity-70" />
              <span>macOS (Apple Silicon & Intel)</span>
            </a>
            <a
              href="https://cursor.com/download"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-black hover:bg-black/[0.04] transition-colors"
            >
              <Monitor className="size-4 opacity-70" />
              <span>Windows x64</span>
            </a>
            <a
              href="https://cursor.com/download"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-black hover:bg-black/[0.04] transition-colors"
            >
              <Terminal className="size-4 opacity-70" />
              <span>Linux (.deb, .rpm, AppImage)</span>
            </a>
          </div>
        )}
      </div>

      {/* Secondary Action: Contact sales */}
      <a
        href="https://cursor.com/contact-sales?product=grok-bot"
        className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium text-black/80 hover:text-black hover:bg-black/[0.04] transition-all"
      >
        Contact sales
      </a>
    </div>
  );
};
