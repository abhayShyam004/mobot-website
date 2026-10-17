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
    <div className="flex flex-1 flex-col h-full min-w-0 bg-[var(--grok-bot-bg-editor,#1c1c1c)] text-[var(--grok-bot-text-primary,#f2f2f2)]">
      {/* Conversation Header */}
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--grok-bot-border-default,#ffffff1f)] px-4 bg-[var(--grok-bot-bg-editor,#1c1c1c)]/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="flex size-6 items-center justify-center rounded-full shrink-0"
            style={{ backgroundColor: agent.avatarColor }}
          >
            <GrokBotMark size={14} fgColor="#ffffff" bgColor={agent.avatarColor} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xs font-medium text-[var(--grok-bot-text-primary,#f2f2f2)]">
              {agent.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-foreground/50">
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-lg hover:text-foreground hover:bg-foreground/5 transition-colors"
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
        {agent.messages.map((msg: DemoMessage) => {
          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="flex flex-col items-end">
                <div className="rounded-2xl rounded-tr-xs bg-[var(--grok-bot-bubble-user,#ecece8)] px-4 py-2.5 text-[var(--grok-bot-bubble-user-ink,#141414)] max-w-[85%] font-sans text-[13.5px] leading-relaxed shadow-xs">
                  {msg.content}
                </div>
                {msg.timestamp && (
                  <span className="mt-1 text-[10px] text-foreground/40 font-mono">
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
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: agent.avatarColor }}
                >
                  <GrokBotMark size={14} fgColor="#ffffff" bgColor={agent.avatarColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] leading-relaxed text-[var(--grok-bot-text-primary,#f2f2f2)]">
                    {msg.content}
                  </div>
                  {msg.timestamp && (
                    <span className="mt-1 block text-[10px] text-foreground/40 font-mono">
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
                  className="baby-grok-bot-card my-2 border border-[var(--grok-bot-border-default,#ffffff1f)] rounded-2xl bg-[var(--grok-bot-bubble-agent,#ffffff0f)] p-3.5"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="size-4 text-[var(--grok-bot-current-agent-coat,#885cf5)]" />
                      <span className="baby-grok-bot-card-title text-xs font-semibold text-foreground">
                        {msg.event.name || 'Automated Routine'}
                      </span>
                    </div>
                    <span className="baby-grok-bot-card-badge inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                      <Check className="size-3" /> Ready
                    </span>
                  </div>
                  <p className="baby-grok-bot-card-secondary text-xs text-foreground/70 mb-2">
                    {msg.event.triggerDescription}
                  </p>
                  <button
                    type="button"
                    className="baby-grok-bot-card-action inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 bg-[var(--grok-bot-fill-emphasis,#f0f0f0)] text-[var(--grok-bot-bubble-user-ink,#141414)] hover:opacity-90 transition-opacity"
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
                  className="baby-grok-bot-message-panel my-2 overflow-hidden rounded-xl border border-[var(--grok-bot-border-default,#ffffff1f)] bg-[var(--grok-bot-bg-elevated,#262626)] text-xs"
                >
                  <div className="flex items-center justify-between border-b border-[var(--grok-bot-border-default,#ffffff1f)] bg-foreground/[0.03] px-3 py-2">
                    <div className="flex items-center gap-1.5 text-foreground/80 font-mono text-[11px]">
                      {isSlack ? (
                        <MessageSquare className="size-3.5 text-emerald-400" />
                      ) : (
                        <Mail className="size-3.5 text-sky-400" />
                      )}
                      <span>Outbound {isSlack ? 'Slack' : 'Email'}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      {msg.event.status}
                    </span>
                  </div>

                  <dl className="divide-y divide-[var(--grok-bot-border-default,#ffffff1f)] text-[12px]">
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <dt className="text-foreground/40 shrink-0 font-mono w-14">To:</dt>
                      <dd className="truncate text-foreground font-mono">{msg.event.to}</dd>
                    </div>
                    {msg.event.subject && (
                      <div className="flex items-center gap-2 px-3 py-1.5">
                        <dt className="text-foreground/40 shrink-0 font-mono w-14">Subject:</dt>
                        <dd className="truncate text-foreground font-medium">{msg.event.subject}</dd>
                      </div>
                    )}
                  </dl>

                  {msg.event.body && (
                    <div className="baby-grok-bot-message-body p-3 text-[12px] text-foreground/80 space-y-1 bg-foreground/[0.01]">
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

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="baby-grok-bot-pending flex items-center gap-2.5 pt-2 text-xs text-foreground/60">
            <span
              className="baby-grok-bot-pending__avatar flex size-6 items-center justify-center rounded-full animate-spin"
              style={{ backgroundColor: agent.avatarColor }}
            >
              <GrokBotMark size={14} fgColor="#ffffff" bgColor={agent.avatarColor} />
            </span>
            <span className="baby-grok-bot-pending__label font-mono tracking-wide">
              {agent.defaultThinkingText || 'Thinking'}...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
