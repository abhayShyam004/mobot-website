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
    <section id="video" className="overflow-hidden py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[var(--site-content-width,1280px)] px-4 sm:px-6">
        <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl mb-10 text-center text-black">
          The SpaceXSI team runs on Grok Bot
        </h2>

        <div className="relative">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause launch trailer' : 'Play launch trailer'}
            aria-expanded={isPlaying}
            data-video-card=""
            className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-3xl border border-black/[0.08] text-left shadow-xl transition-all"
          >
            {/* Background Simulated Video Preview */}
            <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src="https://media.x.ai/v1/website/260810_2245_bw_dr_cursor_bot_edit_v8-60724aba.mp4"
                poster="https://media.x.ai/v1/website/launch-trailer-poster-1a559a65.jpg"
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                loop
                playsInline
                preload="metadata"
                onEnded={() => setIsPlaying(false)}
              />
            </div>

            {/* Play Button Overlay */}
            {!isPlaying && (
              <span className="pointer-events-none absolute inset-0 flex items-center px-6 sm:px-12 lg:px-16 bg-black/20 transition-all group-hover:bg-black/10">
                <span className="inline-flex items-center gap-[0.35em] text-3xl sm:text-5xl lg:text-6xl font-medium text-white transition-transform duration-300 ease-out group-hover:translate-x-1">
                  <Play className="size-[0.75em] fill-current" />
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
