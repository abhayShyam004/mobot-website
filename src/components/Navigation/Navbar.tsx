import React, { useState } from 'react';
import { SpaceXIcon } from '../common/SpaceXIcon';
import { NAV_ITEMS } from '../../data/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/40 transition-colors">
      <div className="mx-auto flex h-16 max-w-[var(--site-content-width)] items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center text-foreground hover:opacity-80 transition-opacity" aria-label="SpaceX SI">
            <SpaceXIcon className="h-5 w-auto text-foreground" />
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
                  className="flex items-center gap-1 text-[14px] font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className="size-3.5 opacity-60 transition-transform duration-200" />
                  )}
                </a>

                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === item.label && item.dropdownItems && (
                  <div className="absolute top-full left-0 w-64 rounded-2xl bg-card border border-border p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150">
                    {item.dropdownItems.map((subItem) => (
                      <a
                        key={subItem.label}
                        href={subItem.href}
                        className="flex flex-col gap-0.5 rounded-xl px-3 py-2 text-left hover:bg-foreground/5 transition-colors"
                      >
                        <span className="text-sm font-medium text-foreground flex items-center justify-between">
                          {subItem.label}
                        </span>
                        {subItem.desc && (
                          <span className="text-xs text-foreground/60 leading-snug">
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
            className="inline-flex h-9 items-center justify-center rounded-full bg-foreground/[0.06] hover:bg-foreground/[0.1] px-4 text-xs font-medium text-foreground transition-colors"
          >
            Contact Sales
          </a>
          <div className="relative group">
            <a
              href="#download"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-foreground text-background hover:bg-foreground/90 px-4 text-xs font-medium transition-colors shadow-sm"
            >
              Download
              <ChevronDown className="size-3.5" />
            </a>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-10 items-center justify-center rounded-full bg-foreground/[0.06] hover:bg-foreground/[0.1] text-foreground transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-background px-4 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="border-b border-border/40 pb-2">
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-1 text-base font-medium text-foreground"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="size-4 opacity-50" />}
                </a>
              </div>
            ))}
            <div className="flex flex-col gap-2.5 pt-4">
              <a
                href="#download"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-full bg-foreground text-background text-sm font-medium transition-colors"
              >
                Download Grok Bot
              </a>
              <a
                href="https://cursor.com/contact-sales?product=grok-bot"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-full bg-foreground/[0.06] text-foreground text-sm font-medium transition-colors"
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
