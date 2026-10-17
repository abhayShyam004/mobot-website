import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

export const VideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <section id="video" className="overflow-hidden">
      <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl pt-24 pb-20 sm:pt-36 sm:pb-32">
        <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl mb-10 text-center text-foreground">
          The SpaceXSI team runs on Grok Bot
        </h2>

        <div className="relative">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause launch trailer' : 'Play launch trailer'}
            aria-expanded={isPlaying}
            data-video-card=""
            className="group bg-card relative aspect-video w-full cursor-pointer overflow-hidden rounded-3xl border border-border/40 text-left shadow-2xl transition-all"
          >
            {/* Background Simulated Video Preview */}
            <div className="absolute inset-0 bg-neutral-900 bg-gradient-to-tr from-black/80 via-neutral-900/60 to-neutral-800/80 flex items-center justify-center">
              {/* Starfield / grid background graphic */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:24px_24px]"
              />

              <video
                ref={videoRef}
                src="https://media.x.ai/v1/website/260810_2245_bw_dr_cursor_bot_edit_v8-60724aba.mp4"
                poster="https://media.x.ai/v1/website/launch-trailer-poster-1a559a65.jpg"
                className="absolute inset-0 size-full object-cover"
                loop
                playsInline
                preload="metadata"
                onEnded={() => setIsPlaying(false)}
              />
            </div>

            {/* Play Button Overlay */}
            {!isPlaying && (
              <span className="pointer-events-none absolute inset-0 flex items-center px-6 sm:px-10 lg:px-14 bg-black/30 backdrop-blur-[2px] transition-all group-hover:bg-black/20">
                <span className="inline-flex items-center gap-[0.35em] group-hover:-translate-x-0.5 sm:group-hover:-translate-x-1 text-2xl leading-none font-medium text-white transition-transform duration-300 ease-out sm:text-4xl lg:text-5xl">
                  <Play className="size-[0.8em] fill-current" />
                  Play
                </span>
              </span>
            )}

            {isPlaying && (
              <span className="pointer-events-none absolute bottom-6 right-6 flex items-center rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Pause className="size-3.5 fill-current mr-1.5" /> Pause
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
