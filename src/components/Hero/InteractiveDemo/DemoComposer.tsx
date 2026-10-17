import React, { useState } from 'react';
import { ArrowUp, Mic, Plus } from 'lucide-react';

interface DemoComposerProps {
  agentName: string;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const DemoComposer: React.FC<DemoComposerProps> = ({
  agentName,
  onSendMessage,
  disabled = false,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="shrink-0 relative z-10 px-5 pb-4 bg-[var(--grok-bot-bg-editor,#1c1c1c)]">
      {/* Top gradient fade */}
      <div
        aria-hidden="true"
        className="baby-grok-bot-composer-fade pointer-events-none absolute inset-x-0 bottom-full h-10 bg-gradient-to-t from-[var(--grok-bot-bg-editor,#1c1c1c)] to-transparent"
      />

      <form
        onSubmit={handleSubmit}
        className="baby-grok-bot-composer flex items-center gap-2 rounded-full border border-[var(--grok-bot-border-default,#ffffff1f)] bg-[var(--grok-bot-bg-elevated,#262626)] px-2.5 py-1.5 shadow-sm transition-all focus-within:border-foreground/30 focus-within:ring-1 focus-within:ring-foreground/20"
      >
        {/* Plus / Attach Action Button */}
        <button
          type="button"
          aria-label="Add attachment"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--grok-bot-fill-secondary,#ffffff0f)] text-foreground/70 hover:text-foreground hover:bg-foreground/15 transition-colors"
        >
          <Plus className="size-3.5" />
        </button>

        {/* Text Input Field */}
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={`Message ${agentName}`}
            className="baby-grok-bot-composer-field-input w-full bg-transparent text-[13.5px] text-foreground placeholder:text-foreground/40 outline-none px-1"
          />
        </div>

        {/* Voice or Send Button */}
        {text.trim() ? (
          <button
            type="submit"
            disabled={disabled}
            aria-label="Send message"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--grok-bot-fill-emphasis,#f0f0f0)] text-[var(--grok-bot-bubble-user-ink,#141414)] hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <ArrowUp className="size-4 stroke-[2.5]" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Voice input"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--grok-bot-fill-secondary,#ffffff0f)] text-foreground/50 hover:text-foreground hover:bg-foreground/15 transition-colors cursor-pointer"
          >
            <Mic className="size-3.5" />
          </button>
        )}
      </form>
    </div>
  );
};
