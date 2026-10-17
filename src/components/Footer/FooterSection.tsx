import React from 'react';
import { FOOTER_DATA } from '../../data/footer';
import { SpaceXIcon } from '../common/SpaceXIcon';
import { Moon, Sun } from 'lucide-react';

interface FooterSectionProps {
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  isDarkMode = false,
  onToggleTheme,
}) => {
  return (
    <footer className="w-full border-t border-black/[0.08] bg-white text-black/80">
      <div className="mx-auto w-full max-w-[var(--site-content-width,1280px)] px-4 sm:px-6 pt-12 pb-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          {/* Brand Left Column */}
          <div className="flex shrink-0 flex-col gap-4 lg:w-[220px]">
            <div>
              <SpaceXIcon className="h-4 w-auto text-black" />
            </div>
            <p className="text-[11px] text-black/50 leading-none">
              © {new Date().getFullYear()} SpaceX SI LLC
            </p>

            <div className="mt-auto flex items-center gap-3 pt-6">
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  aria-label="Toggle theme"
                  className="flex size-7 items-center justify-center rounded-full border border-black/[0.08] bg-black/[0.03] text-black/60 hover:text-black transition-colors"
                >
                  {isDarkMode ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                </button>
              )}

              <a
                href="https://grok.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-black/[0.02] px-3 py-1 text-[11px] font-sans text-black/60 hover:text-black transition-colors"
              >
                Built with Grok
              </a>
            </div>
          </div>

          {/* 10 Columns Links Grid */}
          <div className="grid flex-1 grid-cols-2 gap-7 sm:grid-cols-5 lg:grid-cols-10">
            {FOOTER_DATA.map((col, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-black">
                  {col.title}
                </span>
                <ul className="flex flex-col gap-2 text-xs">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        className="text-black/60 hover:text-black transition-colors"
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
      </div>
    </footer>
  );
};
