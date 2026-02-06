import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquarePlus, Sparkles } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { CitationPopover } from './CitationPopover';
import { ConversationList } from './ConversationList';
import { EmptyState } from '../common/EmptyState';
import { PageLoader } from '../common/Spinner';
import { useAsk, useConversations, useConversation, useDeleteConversation } from '../../hooks/useChat';
import { useToast } from '../../contexts/ToastContext';
import { ROUTES } from '../../config/constants';
import type { Citation, ConversationMessage } from '../../types';

export function FabricChat() {
  const { workspaceId, conversationId } = useParams<{
    workspaceId: string;
    conversationId?: string;
  }>();
  const navigate = useNavigate();
  const { error: showError } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [optimisticMessages, setOptimisticMessages] = useState<ConversationMessage[]>([]);

  // Fetch conversations and current conversation
  const { data: conversationsData, isLoading: loadingConversations } = useConversations(workspaceId);
  const { data: conversation, isLoading: loadingConversation } = useConversation(
    workspaceId,
    conversationId
  );
  const deleteConversation = useDeleteConversation();
  const askMutation = useAsk();

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, optimisticMessages]);

  const handleSend = async (message: string) => {
    if (!workspaceId) return;

    // Add optimistic user message
    const userMessage: ConversationMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };
    setOptimisticMessages((prev) => [...prev, userMessage]);

    try {
      const response = await askMutation.mutateAsync({
        workspaceId,
        data: {
          question: message,
          conversationId,
        },
      });

      // Clear optimistic messages on success
      setOptimisticMessages([]);

      // Navigate to conversation if this was a new chat
      if (!conversationId && response.conversationId) {
        navigate(
          ROUTES.WORKSPACE_CHAT_CONVERSATION.replace(':workspaceId', workspaceId).replace(
            ':conversationId',
            response.conversationId
          )
        );
      }
    } catch (err) {
      showError('Failed to send message. Please try again.');
      // Remove optimistic message on error
      setOptimisticMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    }
  };

  const handleNewChat = () => {
    setOptimisticMessages([]);
    navigate(ROUTES.WORKSPACE_CHAT.replace(':workspaceId', workspaceId || ''));
  };

  const handleSelectConversation = (id: string) => {
    setOptimisticMessages([]);
    navigate(
      ROUTES.WORKSPACE_CHAT_CONVERSATION.replace(':workspaceId', workspaceId || '').replace(
        ':conversationId',
        id
      )
    );
  };

  const handleDeleteConversation = async (id: string) => {
    if (!workspaceId) return;
    try {
      await deleteConversation.mutateAsync({ workspaceId, conversationId: id });
      if (conversationId === id) {
        handleNewChat();
      }
    } catch {
      showError('Failed to delete conversation');
    }
  };

  // Combine stored messages with optimistic ones
  const allMessages = [...(conversation?.messages || []), ...optimisticMessages];

  if (loadingConversations) {
    return <PageLoader />;
  }

  return (
    <div className="flex h-full -m-6">
      {/* Conversation List */}
      <ConversationList
        conversations={conversationsData?.data || []}
        activeId={conversationId}
        onSelect={handleSelectConversation}
        onDelete={handleDeleteConversation}
        onNew={handleNewChat}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {allMessages.length === 0 ? (
            <EmptyState
              icon={<MessageSquarePlus className="h-6 w-6" />}
              title="Start a conversation"
              description="Ask questions about your knowledge base and get AI-powered answers with citations."
              action={
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  Powered by RAG
                </div>
              }
            />
          ) : loadingConversation ? (
            <PageLoader />
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {allMessages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onCitationClick={setActiveCitation}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} isLoading={askMutation.isPending} />
      </div>

      {/* Citation Popover */}
      {activeCitation && (
        <CitationPopover
          citation={activeCitation}
          onClose={() => setActiveCitation(null)}
        />
      )}
    </div>
  );
}
