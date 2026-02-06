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
        'flex gap-4 p-4 rounded-sm',
        isUser
          ? 'bg-[#141414]/50'
          : 'bg-[#141414] border-l-[3px] border-l-[#E80ADE]'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center',
          isUser ? 'bg-[#2A2A2A]' : 'bg-[#E80ADE]'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-[#A0A0A0]" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-[#F5F5F5] text-sm">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-[#666666]" style={{ fontFamily: 'var(--font-mono)' }}>
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
        </div>

        {/* Thinking (for assistant messages) */}
        {!isUser && message.thinking && (
          <div className="mb-3">
            <button
              onClick={() => setShowThinking(!showThinking)}
              className="flex items-center gap-1 text-xs text-[#666666] hover:text-[#A0A0A0] transition-colors"
            >
              {showThinking ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              {showThinking ? 'Hide' : 'Show'} reasoning
            </button>
            {showThinking && (
              <div className="mt-2 p-3 bg-[#0A0A0A] rounded-sm text-sm text-[#666666] border border-[#2A2A2A]" style={{ fontFamily: 'var(--font-mono)' }}>
                {message.thinking}
              </div>
            )}
          </div>
        )}

        {/* Message content */}
        <div className="text-[#A0A0A0] whitespace-pre-wrap text-[15px] leading-relaxed">{message.content}</div>

        {/* Citations */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#666666] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Sources ({message.citations.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {message.citations.map((citation, index) => (
                <button
                  key={citation.id}
                  onClick={() => onCitationClick?.(citation)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-[#2A2A2A] hover:border-[#E80ADE] rounded-sm text-[#A0A0A0] transition-all"
                >
                  <span className="text-[#E80ADE]" style={{ fontFamily: 'var(--font-mono)' }}>[{index + 1}]</span>
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
