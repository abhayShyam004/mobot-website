import React, { useState } from 'react';
import { ChevronDown, Download, Grid, Laptop, Smartphone, Terminal } from 'lucide-react';

export const DownloadSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  return (
    <section id="download" className="font-sans overflow-hidden py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-[var(--site-content-width,1280px)] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* Left Column */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
          <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-black">
            Download Grok Bot
          </h2>
          <p className="text-black/65 max-w-md text-base leading-relaxed text-pretty sm:text-lg sm:leading-relaxed font-normal">
            One team, wherever you are — on your desk and in your pocket.
          </p>
        </div>

        {/* Right Column: Platform Selectors */}
        <div className="flex flex-col gap-3">
          {/* Primary Platform Card (Linux) */}
          <div className="rounded-2xl border border-black/[0.06] bg-[#f8f8fa] overflow-hidden shadow-2xs">
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left font-sans transition-colors hover:bg-black/[0.02]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-black/[0.05] text-black">
                <Terminal className="size-4" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium text-black">Linux</span>
                <span className="text-black/50 text-xs">
                  .deb, AppImage or .rpm · x64 and arm64
                </span>
              </span>
              <span
                className={`ml-auto text-black/40 transition-transform duration-200 group-hover:text-black ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown className="size-4" />
              </span>
            </button>

            {/* Dropdown Options */}
            {isExpanded && (
              <div className="border-t border-black/[0.06] bg-white p-3 space-y-1 text-xs">
                <a
                  href="https://cursor.com/download"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-black/[0.03] text-black transition-colors"
                >
                  <span className="font-mono">.deb (Ubuntu / Debian x64)</span>
                  <Download className="size-3.5 text-black/50" />
                </a>
                <a
                  href="https://cursor.com/download"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-black/[0.03] text-black transition-colors"
                >
                  <span className="font-mono">.AppImage (Universal Linux x64)</span>
                  <Download className="size-3.5 text-black/50" />
                </a>
                <a
                  href="https://cursor.com/download"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-black/[0.03] text-black transition-colors"
                >
                  <span className="font-mono">.rpm (Fedora / RHEL x64)</span>
                  <Download className="size-3.5 text-black/50" />
                </a>
              </div>
            )}
          </div>

          {/* More Downloads Trigger */}
          <div className="rounded-2xl border border-black/[0.06] bg-[#f8f8fa] overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setShowAllPlatforms(!showAllPlatforms)}
              className="group flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left text-sm font-medium transition-colors hover:bg-black/[0.02]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-black/[0.05] text-black/40 group-hover:text-black transition-colors">
                <Grid className="size-4" />
              </span>
              <span className="flex min-w-0 flex-col items-start text-left">
                <span className="text-black">More downloads</span>
                <span className="text-black/50 text-xs font-normal">
                  Other platforms and devices
                </span>
              </span>
              <span
                className={`ml-auto text-black/40 transition-transform duration-200 group-hover:text-black ${
                  showAllPlatforms ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown className="size-4" />
              </span>
            </button>

            {/* Extended Platform Grid */}
            {showAllPlatforms && (
              <div className="border-t border-black/[0.06] bg-white p-4 grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-xl border border-black/[0.06] p-3 bg-[#f8f8fa] space-y-1.5">
                  <div className="flex items-center gap-2 font-medium text-black">
                    <Laptop className="size-4" />
                    <span>macOS</span>
                  </div>
                  <p className="text-black/55 text-[11px]">Universal build for Apple Silicon and Intel</p>
                  <a
                    href="https://cursor.com/download"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-black underline underline-offset-2"
                  >
                    <Download className="size-3" /> Download .dmg
                  </a>
                </div>

                <div className="rounded-xl border border-black/[0.06] p-3 bg-[#f8f8fa] space-y-1.5">
                  <div className="flex items-center gap-2 font-medium text-black">
                    <Laptop className="size-4" />
                    <span>Windows</span>
                  </div>
                  <p className="text-black/55 text-[11px]">Windows 10 / 11 64-bit installer</p>
                  <a
                    href="https://cursor.com/download"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-black underline underline-offset-2"
                  >
                    <Download className="size-3" /> Download .exe
                  </a>
                </div>

                <div className="rounded-xl border border-black/[0.06] p-3 bg-[#f8f8fa] space-y-1.5">
                  <div className="flex items-center gap-2 font-medium text-black">
                    <Smartphone className="size-4" />
                    <span>iOS App</span>
                  </div>
                  <p className="text-black/55 text-[11px]">Companion app for iPhone and iPad</p>
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-black underline underline-offset-2"
                  >
                    <Download className="size-3" /> App Store
                  </a>
                </div>

                <div className="rounded-xl border border-black/[0.06] p-3 bg-[#f8f8fa] space-y-1.5">
                  <div className="flex items-center gap-2 font-medium text-black">
                    <Smartphone className="size-4" />
                    <span>Android</span>
                  </div>
                  <p className="text-black/55 text-[11px]">Mobile app for phone & tablet</p>
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-black underline underline-offset-2"
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
