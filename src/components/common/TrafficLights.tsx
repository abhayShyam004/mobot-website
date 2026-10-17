import React from 'react';

export const TrafficLights: React.FC = () => {
  return (
    <div className="baby-grok-bot-traffic-lights" aria-hidden="true">
      <span className="relative h-3 w-[52px] shrink-0 inline-flex items-center">
        <span className="absolute inset-y-0 left-0 w-3 h-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.2)]" />
        <span className="absolute inset-y-0 left-1/2 w-3 h-3 -translate-x-1/2 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.2)]" />
        <span className="absolute inset-y-0 right-0 w-3 h-3 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.2)]" />
      </span>
    </div>
  );
};
