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
  isCollapsed = false,
}) => {
  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="baby-grok-bot-sidebar flex h-full flex-col border-r border-black/[0.08] bg-[#f7f7f9] text-[#0d0d0d] select-none">
      {/* Sidebar Header with macOS Traffic Lights & Action */}
      <div className="baby-grok-bot-sidebar-header flex h-11 items-center justify-between px-3.5 border-b border-black/[0.04]">
        <div className="baby-grok-bot-sidebar-header__lead">
          <TrafficLights />
        </div>
        {!isCollapsed && (
          <button
            type="button"
            onClick={onNewAgent}
            aria-label="New agent"
            className="flex size-7 items-center justify-center rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
            title="Create new agent"
          >
            <Plus className="size-4" />
          </button>
        )}
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="px-3 pt-2.5 pb-2">
          <div className="baby-grok-bot-chat-search flex h-8 items-center gap-2 rounded-xl bg-black/[0.04] border border-black/[0.06] px-2.5 text-xs">
            <Search className="size-3.5 text-black/40 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-xs text-black placeholder:text-black/40 outline-none"
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
              className={`group flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-white shadow-xs border border-black/[0.06]'
                  : 'hover:bg-black/[0.04]'
              }`}
              title={agent.name}
            >
              {/* Bot Avatar */}
              <div
                className="relative shrink-0 flex items-center justify-center size-8 rounded-full shadow-2xs"
                style={{ backgroundColor: agent.avatarColor }}
              >
                <GrokBotMark size={16} fgColor="#ffffff" bgColor={agent.avatarColor} />
                {agent.hasUnread && (
                  <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-red-500 border-2 border-white" />
                )}
              </div>

              {/* Bot Info */}
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-xs font-medium text-black">
                      {agent.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-black/40 font-mono">
                      {agent.timeString}
                    </span>
                  </div>
                  <p className="truncate text-[11.5px] text-black/60 leading-tight mt-0.5">
                    {agent.lastMessageSnippet}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* User Profile Footer Row */}
      {!isCollapsed && (
        <div className="baby-grok-bot-sidebar-footer flex h-11 items-center justify-between border-t border-black/[0.06] bg-[#f2f2f4] px-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex size-6 items-center justify-center rounded-full bg-black text-white text-[10px] font-semibold">
              AS
            </div>
            <span className="baby-grok-bot-sidebar-footer__name truncate text-xs font-medium text-black">
              Armand Segall
            </span>
          </div>
          <button
            type="button"
            aria-label="Settings"
            className="flex size-7 items-center justify-center rounded-lg text-black/50 hover:text-black hover:bg-black/5 transition-colors"
          >
            <Settings className="size-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
};
