import React from 'react';
import { AnnouncementBadge } from './AnnouncementBadge';
import { HeroTitle } from './HeroTitle';
import { HeroActions } from './HeroActions';
import { DemoWindow } from './InteractiveDemo/DemoWindow';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden"
      >
        <div className="h-[520px] w-[1000px] opacity-30 blur-[130px] bg-gradient-to-b from-orange-200/40 via-pink-100/30 to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-[var(--site-content-width,1280px)] flex-col items-center gap-8 px-4 text-center sm:gap-10 sm:px-6">
        {/* Top Hero Column */}
        <div className="flex flex-col items-center">
          <AnnouncementBadge />
          <HeroTitle />
          <HeroActions />
        </div>

        {/* Interactive Desktop Bot Window */}
        <div className="w-full pt-4 sm:pt-6">
          <DemoWindow />
        </div>
      </div>
    </section>
  );
};
