import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DEMO_AGENTS } from '../../../data/demoAgents';
import type { DemoAgent, DemoMessage } from '../../../data/demoAgents';
import { DemoSidebar } from './DemoSidebar';
import { DemoConversation } from './DemoConversation';
import { DemoComposer } from './DemoComposer';

export const DemoWindow: React.FC = () => {
  const [agents, setAgents] = useState<DemoAgent[]>(DEMO_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState<string>('new-agent');
  const [sidebarWidth, setSidebarWidth] = useState<number>(280);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeAgent = agents.find((a) => a.id === activeAgentId) || agents[0];

  // Responsive sidebar collapse on window resize
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  useEffect(() => {
    const checkScreen = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const isCollapsed = isMobileScreen || sidebarWidth < 180;

  // Drag-to-resize sidebar handling
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;

      if (newWidth < 120) {
        setSidebarWidth(84); // Snap collapsed
      } else if (newWidth > 420) {
        setSidebarWidth(420); // Max bound
      } else {
        setSidebarWidth(Math.max(218, newWidth)); // Min standard width
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSelectAgent = (id: string) => {
    setActiveAgentId(id);
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, hasUnread: false, unreadCount: 0 } : agent
      )
    );
  };

  const handleNewAgent = () => {
    const newId = `agent-${Date.now()}`;
    const newAgent: DemoAgent = {
      id: newId,
      name: `Agent ${agents.length + 1}`,
      title: 'Custom Agent',
      avatarHue: 'purple',
      avatarColor: '#885cf5',
      lastMessageSnippet: 'Ready for action',
      timeString: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'agent',
          content: 'Hello! I am ready to handle your tasks. What can I do for you?',
          timestamp: 'Just now',
        },
      ],
    };
    setAgents((prev) => [newAgent, ...prev]);
    setActiveAgentId(newId);
  };

  const handleSendMessage = (content: string) => {
    const userMsg: DemoMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: 'Just now',
    };

    // Append user message immediately
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === activeAgentId) {
          return {
            ...a,
            messages: [...a.messages, userMsg],
            lastMessageSnippet: content,
            timeString: 'Just now',
          };
        }
        return a;
      })
    );

    // Simulate thinking and intelligent agent response
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);

      const agentReplies: Record<string, string> = {
        'new-agent': `I've analyzed that request and started drafting the necessary workflow. Would you like me to run this automatically on a scheduled trigger?`,
        'chief': `Got it. I've updated the executive sync agenda and cross-referenced with your calendar. Let me know if you want me to ping the team.`,
        'inbox-manager': `Archived and filed under priority follow-ups. You have 2 pending items requiring approval today.`,
      };

      const replyContent =
        agentReplies[activeAgentId] ||
        `Understood. I am processing "${content}" and coordinating with connected tools.`;

      const botMsg: DemoMessage = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: replyContent,
        timestamp: 'Just now',
      };

      setAgents((prev) =>
        prev.map((a) => {
          if (a.id === activeAgentId) {
            return {
              ...a,
              messages: [...a.messages, botMsg],
              lastMessageSnippet: replyContent,
            };
          }
          return a;
        })
      );
    }, 1000);
  };

  return (
    <div
      ref={containerRef}
      className={`baby-grok-bot-shell relative mx-auto w-full max-w-5xl rounded-3xl border border-black/[0.1] bg-white shadow-2xl overflow-hidden transition-all duration-300 ${
        isDragging ? 'select-none cursor-col-resize' : ''
      }`}
      style={{
        height: '640px',
        boxShadow:
          '0 24px 60px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex h-full w-full">
        {/* Resizable Sidebar */}
        <div
          style={{ width: isCollapsed ? 76 : sidebarWidth }}
          className="shrink-0 transition-[width] duration-150 ease-out h-full overflow-hidden"
        >
          <DemoSidebar
            agents={agents}
            activeAgentId={activeAgentId}
            onSelectAgent={handleSelectAgent}
            onNewAgent={handleNewAgent}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Draggable Divider Handle */}
        {!isMobileScreen && (
          <div
            onMouseDown={handleMouseDown}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            className="group relative w-[1px] bg-black/[0.08] hover:w-[3px] hover:bg-black/30 transition-all cursor-col-resize z-20 shrink-0"
          >
            <div className="absolute inset-y-0 -left-1.5 -right-1.5 cursor-col-resize" />
          </div>
        )}

        {/* Conversation Area */}
        <div className="flex flex-1 flex-col h-full min-w-0 bg-white">
          <DemoConversation agent={activeAgent} isThinking={isThinking} />
          <DemoComposer
            agentName={activeAgent.name}
            onSendMessage={handleSendMessage}
            disabled={isThinking}
          />
        </div>
      </div>
    </div>
  );
};
