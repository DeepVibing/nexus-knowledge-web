import { useState } from 'react';
import { User, Bot, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ConversationMessage, Citation } from '../../types';

interface MessageBubbleProps {
  message: ConversationMessage;
  onCitationClick?: (citation: Citation) => void;
}

export function MessageBubble({ message, onCitationClick }: MessageBubbleProps) {
  const [showThinking, setShowThinking] = useState(false);
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-4 p-4 rounded-lg',
        isUser ? 'bg-slate-800/50' : 'bg-slate-800'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-indigo-600' : 'bg-emerald-600'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-white">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-slate-500">
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
        </div>

        {/* Thinking (for assistant messages) */}
        {!isUser && message.thinking && (
          <div className="mb-3">
            <button
              onClick={() => setShowThinking(!showThinking)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 transition-colors"
            >
              {showThinking ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              {showThinking ? 'Hide' : 'Show'} reasoning
            </button>
            {showThinking && (
              <div className="mt-2 p-3 bg-slate-900 rounded-lg text-sm text-slate-400 border border-slate-700">
                {message.thinking}
              </div>
            )}
          </div>
        )}

        {/* Message content */}
        <div className="text-slate-200 whitespace-pre-wrap">{message.content}</div>

        {/* Citations */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-2">
              Sources ({message.citations.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {message.citations.map((citation, index) => (
                <button
                  key={citation.id}
                  onClick={() => onCitationClick?.(citation)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                >
                  <span className="text-indigo-400">[{index + 1}]</span>
                  <span className="truncate max-w-[150px]">
                    {citation.sourceName}
                  </span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
