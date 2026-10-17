import React, { useState } from 'react';
import { SpaceXIcon } from '../common/SpaceXIcon';
import { NAV_ITEMS } from '../../data/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 border-b border-black/[0.06] transition-colors">
      <div className="mx-auto flex h-16 max-w-[var(--site-content-width,1280px)] items-center justify-between px-4 sm:px-6">
        {/* Left: SpaceX Wordmark Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <a
            href="#"
            className="flex items-center text-black hover:opacity-80 transition-opacity"
            aria-label="SpaceX SI"
          >
            <SpaceXIcon className="h-4 w-auto text-black" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-[13px] font-medium text-black/70 hover:text-black transition-colors py-2"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className="size-3.5 opacity-50 transition-transform duration-200" />
                  )}
                </a>

                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === item.label && item.dropdownItems && (
                  <div className="absolute top-full left-0 w-64 rounded-2xl bg-white border border-black/[0.08] p-2 shadow-xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150">
                    {item.dropdownItems.map((subItem) => (
                      <a
                        key={subItem.label}
                        href={subItem.href}
                        className="flex flex-col gap-0.5 rounded-xl px-3 py-2 text-left hover:bg-black/[0.04] transition-colors"
                      >
                        <span className="text-xs font-medium text-black flex items-center justify-between">
                          {subItem.label}
                        </span>
                        {subItem.desc && (
                          <span className="text-[11px] text-black/60 leading-snug">
                            {subItem.desc}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://cursor.com/contact-sales?product=grok-bot"
            className="inline-flex h-8 items-center justify-center px-3 text-[13px] font-medium text-black/70 hover:text-black transition-colors"
          >
            Contact Sales
          </a>
          <div className="relative group">
            <a
              href="#download"
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-black text-white hover:bg-black/85 px-3.5 text-xs font-medium transition-all shadow-xs"
            >
              Download
              <ChevronDown className="size-3" />
            </a>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-black transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-black/[0.08] bg-white px-4 py-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="border-b border-black/[0.05] pb-2">
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-1 text-sm font-medium text-black"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="size-4 opacity-40" />}
                </a>
              </div>
            ))}
            <div className="flex flex-col gap-2.5 pt-4">
              <a
                href="#download"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-full items-center justify-center rounded-full bg-black text-white text-xs font-medium transition-colors"
              >
                Download Grok Bot
              </a>
              <a
                href="https://cursor.com/contact-sales?product=grok-bot"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-full items-center justify-center rounded-full bg-black/[0.05] text-black text-xs font-medium transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
