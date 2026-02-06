import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  isLoading = false,
  placeholder = 'Ask a question about your knowledge base...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSend(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-[#2A2A2A] bg-[#141414] p-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className={cn(
              'w-full resize-none px-4 py-3 pr-12 rounded-sm',
              'bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F5F5] placeholder-[#666666]',
              'focus:outline-none focus:ring-2 focus:ring-[#E80ADE] focus:border-transparent',
              'disabled:opacity-50'
            )}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <span className="text-xs text-[#666666]">
              <Sparkles className="h-3 w-3 inline mr-1 text-[#E80ADE]" />
              AI
            </span>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
          isLoading={isLoading}
          size="lg"
          className="px-4"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-xs text-[#666666] text-center mt-2 max-w-4xl mx-auto">
        Press Enter to send <span className="text-[#E80ADE]">/</span> Shift+Enter for new line
      </p>
    </div>
  );
}
