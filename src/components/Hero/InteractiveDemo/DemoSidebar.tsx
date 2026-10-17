import React from 'react';
import type { DemoAgent } from '../../../data/demoAgents';
import { TrafficLights } from '../../common/TrafficLights';
import { Search, Plus, Settings } from 'lucide-react';
import { GrokBotMark } from '../../common/GrokBotMark';

interface DemoSidebarProps {
  agents: DemoAgent[];
  activeAgentId: string;
  onSelectAgent: (id: string) => void;
  onNewAgent: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isCollapsed?: boolean;
}

export const DemoSidebar: React.FC<DemoSidebarProps> = ({
  agents,
  activeAgentId,
  onSelectAgent,
  onNewAgent,
  searchQuery,
  onSearchChange,
  isCollapsed = false
}) => {
  const filteredAgents = agents.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="baby-grok-bot-sidebar flex h-full flex-col border-r border-[var(--grok-bot-border-default,#ffffff1f)] bg-[var(--grok-bot-bg-chrome,#141414)] text-[var(--grok-bot-sidebar-text-primary,#ffffff)] select-none">
      {/* Sidebar Header with Traffic Lights & Action */}
      <div className="baby-grok-bot-sidebar-header flex h-11 items-center justify-between px-3.5">
        <div className="baby-grok-bot-sidebar-header__lead">
          <TrafficLights />
        </div>
        {!isCollapsed && (
          <button
            type="button"
            onClick={onNewAgent}
            aria-label="New agent"
            className="flex size-7 items-center justify-center rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
            title="Create new agent"
          >
            <Plus className="size-4" />
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      {!isCollapsed && (
        <div className="px-3 pb-2">
          <div className="baby-grok-bot-chat-search flex h-8 items-center gap-2 rounded-xl bg-foreground/[0.04] border border-border/60 px-2.5 text-xs">
            <Search className="size-3.5 text-foreground/40 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-xs text-foreground placeholder:text-foreground/40 outline-none"
            />
          </div>
        </div>
      )}

      {/* Bot Roster List */}
      <div className="baby-grok-bot-sidebar-list flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {filteredAgents.map((agent) => {
          const isActive = agent.id === activeAgentId;
          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => onSelectAgent(agent.id)}
              className={`group flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-colors cursor-pointer ${
                isActive
                  ? 'bg-foreground/[0.08] shadow-sm'
                  : 'hover:bg-foreground/[0.04]'
              }`}
              title={agent.name}
            >
              {/* Bot Avatar */}
              <div className="relative shrink-0 flex items-center justify-center size-8 rounded-full" style={{ backgroundColor: agent.avatarColor }}>
                <span className="size-5 text-white flex items-center justify-center">
                  <GrokBotMark size={18} fgColor="#ffffff" bgColor={agent.avatarColor} />
                </span>
                {agent.hasUnread && (
                  <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-red-500 border-2 border-background" />
                )}
              </div>

              {/* Bot Info (Labels & Snippet) */}
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-xs font-medium text-foreground">
                      {agent.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-foreground/40 font-mono">
                      {agent.timeString}
                    </span>
                  </div>
                  <div className="truncate text-[11px] text-foreground/50 leading-normal mt-0.5">
                    {agent.lastMessageSnippet}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* User Footer Account */}
      {!isCollapsed && (
        <div className="baby-grok-bot-sidebar-footer flex h-12 items-center justify-between border-t border-border/40 px-3 py-2 bg-foreground/[0.01]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              AS
            </div>
            <span className="truncate text-xs font-medium text-foreground/90">
              Armand Segall
            </span>
          </div>
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
            aria-label="Settings"
          >
            <Settings className="size-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
};
