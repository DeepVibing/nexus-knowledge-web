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
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-72">
      <div className="p-4 border-b border-slate-800">
        <Button onClick={onNew} className="w-full" leftIcon={<Plus className="h-4 w-4" />}>
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-400 text-sm">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
                  activeId === conversation.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                )}
                onClick={() => onSelect(conversation.id)}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {conversation.title || 'New conversation'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {conversation.messageCount} messages
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conversation.id);
                  }}
                  className={cn(
                    'p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity',
                    activeId === conversation.id
                      ? 'hover:bg-indigo-700 text-white'
                      : 'hover:bg-slate-700 text-slate-400'
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
