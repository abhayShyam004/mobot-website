import React, { useState } from 'react';
import { ChevronDown, Download, Grid, Laptop, Smartphone } from 'lucide-react';

export const DownloadSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  return (
    <section id="download" className="font-sans overflow-hidden py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-[var(--site-content-width,1280px)] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* Left Column */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
          <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-foreground">
            Download Grok Bot
          </h2>
          <p className="text-muted-foreground max-w-md text-base leading-relaxed text-pretty sm:text-lg sm:leading-relaxed">
            One team, wherever you are — on your desk and in your pocket.
          </p>
        </div>

        {/* Right Column: Downloads Accordion & Platform Selectors */}
        <div className="flex flex-col gap-3">
          {/* Primary Platform Card (Auto-detected: Linux / macOS / Windows) */}
          <div className="rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm">
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left font-sans transition-colors hover:bg-foreground/[0.04]"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.06] text-foreground">
                <Laptop className="size-5" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium text-foreground">Linux Desktop</span>
                <span className="text-muted-foreground text-xs">
                  .deb, AppImage or .rpm · x64 and arm64
                </span>
              </span>
              <span
                className={`ml-auto text-muted-foreground transition-transform duration-200 group-hover:text-foreground ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown className="size-4" />
              </span>
            </button>

            {/* Dropdown Options */}
            {isExpanded && (
              <div className="border-t border-border/30 bg-foreground/[0.02] p-3 space-y-1 text-xs">
                <a
                  href="https://cursor.com/download"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-foreground/[0.06] text-foreground transition-colors"
                >
                  <span className="font-mono">.deb (Ubuntu / Debian x64)</span>
                  <Download className="size-3.5 text-muted-foreground" />
                </a>
                <a
                  href="https://cursor.com/download"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-foreground/[0.06] text-foreground transition-colors"
                >
                  <span className="font-mono">.AppImage (Universal Linux x64)</span>
                  <Download className="size-3.5 text-muted-foreground" />
                </a>
                <a
                  href="https://cursor.com/download"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-foreground/[0.06] text-foreground transition-colors"
                >
                  <span className="font-mono">.rpm (Fedora / RHEL x64)</span>
                  <Download className="size-3.5 text-muted-foreground" />
                </a>
              </div>
            )}
          </div>

          {/* More Downloads Trigger */}
          <div className="rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => setShowAllPlatforms(!showAllPlatforms)}
              className="group flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.06] text-foreground/50 group-hover:text-foreground transition-colors">
                <Grid className="size-5" />
              </span>
              <span className="flex min-w-0 flex-col items-start text-left">
                <span className="text-foreground">More downloads</span>
                <span className="text-muted-foreground text-xs font-normal">
                  macOS, Windows, iOS, and Android
                </span>
              </span>
              <span
                className={`ml-auto text-muted-foreground transition-transform duration-200 group-hover:text-foreground ${
                  showAllPlatforms ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown className="size-4" />
              </span>
            </button>

            {/* Extended Platform Grid */}
            {showAllPlatforms && (
              <div className="border-t border-border/30 bg-foreground/[0.02] p-4 grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-xl border border-border/30 p-3 bg-card space-y-2">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Laptop className="size-4" />
                    <span>macOS</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Universal build for Apple Silicon and Intel</p>
                  <a
                    href="https://cursor.com/download"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] text-primary hover:underline"
                  >
                    <Download className="size-3" /> Download .dmg
                  </a>
                </div>

                <div className="rounded-xl border border-border/30 p-3 bg-card space-y-2">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Laptop className="size-4" />
                    <span>Windows</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Windows 10 / 11 64-bit installer</p>
                  <a
                    href="https://cursor.com/download"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] text-primary hover:underline"
                  >
                    <Download className="size-3" /> Download .exe
                  </a>
                </div>

                <div className="rounded-xl border border-border/30 p-3 bg-card space-y-2">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Smartphone className="size-4" />
                    <span>iOS App</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Companion app for iPhone and iPad</p>
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] text-primary hover:underline"
                  >
                    <Download className="size-3" /> App Store
                  </a>
                </div>

                <div className="rounded-xl border border-border/30 p-3 bg-card space-y-2">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Smartphone className="size-4" />
                    <span>Android</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Mobile app for phone & tablet</p>
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] text-primary hover:underline"
                  >
                    <Download className="size-3" /> Google Play
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
