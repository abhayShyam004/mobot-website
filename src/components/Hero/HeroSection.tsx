import React from 'react';
import { AnnouncementBadge } from './AnnouncementBadge';
import { HeroTitle } from './HeroTitle';
import { HeroActions } from './HeroActions';
import { DemoWindow } from './InteractiveDemo/DemoWindow';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden"
      >
        <div className="h-[480px] w-[800px] opacity-20 blur-[120px] bg-gradient-to-b from-primary/30 to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-[var(--site-content-width,1280px)] flex-col items-center gap-10 px-4 text-center sm:gap-14 sm:px-6">
        <div className="flex flex-col items-center">
          <AnnouncementBadge />
          <HeroTitle />
          <HeroActions />
        </div>

        {/* Interactive Desktop Demo */}
        <div className="w-full">
          <DemoWindow />
        </div>
      </div>
    </section>
  );
};
