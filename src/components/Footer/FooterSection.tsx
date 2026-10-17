import React from 'react';
import { FOOTER_DATA } from '../../data/footer';
import { SpaceXIcon } from '../common/SpaceXIcon';
import { Moon, Sun } from 'lucide-react';

interface FooterSectionProps {
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  isDarkMode = true,
  onToggleTheme,
}) => {
  return (
    <footer className="w-full border-t border-border/40 bg-background text-foreground/80">
      <div className="mx-auto w-full max-w-[var(--site-content-width,1280px)] px-4 lg:px-6 xl:max-w-7xl pb-16 pt-12 max-lg:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Brand Left Column */}
          <div className="flex shrink-0 flex-col gap-4 lg:w-[260px]">
            <div>
              <SpaceXIcon className="h-4 w-auto text-foreground" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Advancing human exploration and intelligence through accelerated computing and autonomous systems.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  aria-label="Toggle theme"
                  className="flex size-8 items-center justify-center rounded-full border border-border/60 bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08] transition-colors"
                >
                  {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </button>
              )}

              <a
                href="https://grok.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-foreground/[0.03] px-3 py-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                Built with Grok
              </a>
            </div>
          </div>

          {/* 8 Columns Links Grid */}
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8">
            {FOOTER_DATA.map((col, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  {col.title}
                </span>
                <ul className="flex flex-col gap-2 text-xs">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-border/30 pt-8 text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} SpaceX / xAI Corporation. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All systems operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
