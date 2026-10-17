import React, { useEffect, useRef } from 'react';
import type { DemoAgent, DemoMessage } from '../../../data/demoAgents';
import { GrokBotMark } from '../../common/GrokBotMark';
import { Check, Mail, MessageSquare, MoreHorizontal, Sparkles } from 'lucide-react';

interface DemoConversationProps {
  agent: DemoAgent;
  isThinking?: boolean;
}

export const DemoConversation: React.FC<DemoConversationProps> = ({
  agent,
  isThinking = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [agent.messages, isThinking]);

  return (
    <div className="flex flex-1 flex-col h-full min-w-0 bg-[#ffffff] text-[#0d0d0d]">
      {/* Header */}
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-black/[0.06] px-4 bg-white">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="flex size-6 items-center justify-center rounded-full shrink-0"
            style={{ backgroundColor: agent.avatarColor }}
          >
            <GrokBotMark size={14} fgColor="#ffffff" bgColor={agent.avatarColor} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xs font-semibold text-black">
              {agent.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-black/50">
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-lg hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
            title="Bot actions"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </header>

      {/* Message Feed */}
      <div
        ref={scrollRef}
        className="baby-grok-bot-transcript flex-1 overflow-y-auto px-5 pt-4 pb-6 space-y-4 text-sm"
      >
        {/* Thinking Indicator at Top or during reply */}
        {(isThinking || agent.messages.length === 0) && (
          <div className="baby-grok-bot-pending flex items-center gap-2.5 py-1 text-xs text-black/60">
            <span
              className="baby-grok-bot-pending__avatar flex size-5 items-center justify-center rounded-full animate-spin"
              style={{ backgroundColor: agent.avatarColor }}
            >
              <GrokBotMark size={12} fgColor="#ffffff" bgColor={agent.avatarColor} />
            </span>
            <span className="baby-grok-bot-pending__label font-sans font-medium text-black/70">
              {agent.defaultThinkingText || 'Thinking'}
            </span>
          </div>
        )}

        {agent.messages.map((msg: DemoMessage) => {
          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="flex flex-col items-end">
                <div className="rounded-2xl rounded-tr-xs bg-black text-white px-4 py-2.5 max-w-[85%] font-sans text-[13px] leading-relaxed shadow-xs">
                  {msg.content}
                </div>
                {msg.timestamp && (
                  <span className="mt-1 text-[10px] text-black/40 font-mono">
                    {msg.timestamp}
                  </span>
                )}
              </div>
            );
          }

          if (msg.role === 'agent') {
            return (
              <div key={msg.id} className="flex items-start gap-3 max-w-[90%]">
                <div
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full shadow-2xs"
                  style={{ backgroundColor: agent.avatarColor }}
                >
                  <GrokBotMark size={14} fgColor="#ffffff" bgColor={agent.avatarColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] leading-relaxed text-black/90">
                    {msg.content}
                  </div>
                  {msg.timestamp && (
                    <span className="mt-1 block text-[10px] text-black/40 font-mono">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              </div>
            );
          }

          if (msg.role === 'system' && msg.event) {
            if (msg.event.type === 'created-routine') {
              return (
                <div
                  key={msg.id}
                  className="baby-grok-bot-card my-2 border border-black/[0.08] rounded-2xl bg-[#f8f8fa] p-3.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="size-4 text-purple-600" />
                      <span className="baby-grok-bot-card-title text-xs font-semibold text-black">
                        {msg.event.name || 'Automated Routine'}
                      </span>
                    </div>
                    <span className="baby-grok-bot-card-badge inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700">
                      <Check className="size-3" /> Ready
                    </span>
                  </div>
                  <p className="baby-grok-bot-card-secondary text-xs text-black/70 mb-2">
                    {msg.event.triggerDescription}
                  </p>
                  <button
                    type="button"
                    className="baby-grok-bot-card-action inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 bg-black text-white hover:bg-black/85 transition-opacity"
                  >
                    View routine configuration
                  </button>
                </div>
              );
            }

            if (msg.event.type === 'outbound-message') {
              const isSlack = msg.event.channel === 'slack';
              return (
                <div
                  key={msg.id}
                  className="baby-grok-bot-message-panel my-2 overflow-hidden rounded-xl border border-black/[0.08] bg-[#f8f8fa] text-xs shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-black/[0.08] bg-black/[0.02] px-3 py-2">
                    <div className="flex items-center gap-1.5 text-black/80 font-mono text-[11px]">
                      {isSlack ? (
                        <MessageSquare className="size-3.5 text-emerald-600" />
                      ) : (
                        <Mail className="size-3.5 text-sky-600" />
                      )}
                      <span>Outbound {isSlack ? 'Slack' : 'Email'}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {msg.event.status}
                    </span>
                  </div>

                  <dl className="divide-y divide-black/[0.06] text-[12px]">
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <dt className="text-black/40 shrink-0 font-mono w-14">To:</dt>
                      <dd className="truncate text-black font-mono">{msg.event.to}</dd>
                    </div>
                    {msg.event.subject && (
                      <div className="flex items-center gap-2 px-3 py-1.5">
                        <dt className="text-black/40 shrink-0 font-mono w-14">Subject:</dt>
                        <dd className="truncate text-black font-medium">{msg.event.subject}</dd>
                      </div>
                    )}
                  </dl>

                  {msg.event.body && (
                    <div className="baby-grok-bot-message-body p-3 text-[12px] text-black/80 space-y-1 bg-white">
                      {msg.event.body.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          }

          return null;
        })}
      </div>
    </div>
  );
};
