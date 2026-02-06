import { MessageSquare, Trash2, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ConversationListDto } from '../../types';
import { Button } from '../common/Button';

interface ConversationListProps {
  conversations: ConversationListDto[];
  activeId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNew,
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full bg-[#141414] border-r border-[#2A2A2A] w-72">
      <div className="p-4 border-b border-[#2A2A2A]">
        <Button onClick={onNew} className="w-full" leftIcon={<Plus className="h-4 w-4" />}>
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 ? (
          <div className="px-4 py-8 text-center text-[#666666] text-sm">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-0.5 px-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors relative',
                  activeId === conversation.id
                    ? 'bg-[rgba(232,10,222,0.08)] text-[#E80ADE]'
                    : 'text-[#A0A0A0] hover:bg-[#1C1C1C]'
                )}
                onClick={() => onSelect(conversation.id)}
              >
                {activeId === conversation.id && (
                  <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#E80ADE]" />
                )}
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {conversation.title || 'New conversation'}
                  </p>
                  <p className="text-xs text-[#666666] truncate">
                    {conversation.messageCount} messages
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conversation.id);
                  }}
                  className={cn(
                    'p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity',
                    'hover:bg-[#2A2A2A] text-[#666666] hover:text-red-400'
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
