import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useAIChatHistory,
  useAIConversation,
  useAISendMessage,
  useAISaveNote,
  useAICreateConversation,
  useAIRenameConversation,
  useAIDeleteConversation,
  useAISendFeedback,
} from "../hooks/useAIChat";
import ChatSidebar from "../components/ChatSidebar";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import PromptSuggestions from "../components/PromptSuggestions";

export default function AIChatPage() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const { data: history } = useAIChatHistory();
  const { data: conversation } = useAIConversation(activeChatId);
  const sendMessageMutation = useAISendMessage();
  const saveNoteMutation = useAISaveNote();
  const createConversationMutation = useAICreateConversation();
  const renameConversationMutation = useAIRenameConversation();
  const deleteConversationMutation = useAIDeleteConversation();
  const sendFeedbackMutation = useAISendFeedback();

  useEffect(() => {
    const stateChatId = location.state?.activeChatId;
    if (stateChatId) {
      setActiveChatId(stateChatId);
    }
  }, [location.state]);

  useEffect(() => {
    if (Array.isArray(conversation?.messages)) {
      setMessages(conversation.messages);
    }
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content, files) => {
    const newUserMsg = {
      id: Date.now().toString(),
      role: 'user',
      content,
      files: files?.map(f => f.name) || [],
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMsg]);

    try {
      const response = await sendMessageMutation.mutateAsync({
        content,
        conversationId: activeChatId,
        files,
        messages: [...messages, newUserMsg],
      });

      if (response?.conversation_id && !activeChatId) {
        setActiveChatId(response.conversation_id);
      }
      
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleLikeFeedback = async (message, reaction) => {
    const queryId = message?.query_id || message?.id;
    if (!queryId) {
      return;
    }

    try {
      await sendFeedbackMutation.mutateAsync({
        queryId,
        reaction,
        metadata: {
          conversationId: activeChatId,
          messageId: message.id,
        },
      });
    } catch (error) {
      console.error("Failed to send feedback", error);
    }
  };

  const handleSelectPrompt = (prompt) => {
    handleSendMessage(prompt, []);
  };

  const handleSaveNote = async (message) => {
    try {
      await saveNoteMutation.mutateAsync({
        title: "Saved Concept from Chat",
        topic: "General AI Study",
        content: message.content,
        preview: message.content.substring(0, 110) + '...',
        dateSaved: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to save note", error);
    }
  };

  const handleNewChat = async () => {
    setMessages([]);

    try {
      const created = await createConversationMutation.mutateAsync("New Conversation");
      setActiveChatId(created?.id || null);
    } catch (error) {
      console.error("Failed to create conversation", error);
      setActiveChatId(null);
    }
  };

  const handleDeleteChat = async (chat) => {
    if (!chat?.id) {
      return;
    }
    const accepted = window.confirm(`Delete conversation \"${chat.title || "New Conversation"}\"?`);
    if (!accepted) {
      return;
    }

    try {
      await deleteConversationMutation.mutateAsync(chat.id);
      if (activeChatId === chat.id) {
        setActiveChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete conversation", error);
    }
  };

  const handleRenameChat = async (chat) => {
    if (!chat?.id) {
      return;
    }
    const nextTitle = window.prompt("Rename conversation", chat.title || "New Conversation");
    if (!nextTitle || !nextTitle.trim()) {
      return;
    }

    try {
      await renameConversationMutation.mutateAsync({
        conversationId: chat.id,
        title: nextTitle.trim(),
      });
    } catch (error) {
      console.error("Failed to rename conversation", error);
    }
  };

  const normalizedHistory = Array.isArray(history) ? history : history?.conversations || [];

  return (
    <div className="chat-theme-shell flex h-[calc(100vh-theme(spacing.16))] min-h-[640px] w-full overflow-hidden rounded-[28px] border border-[var(--border-soft)] shadow-[0_16px_48px_rgba(37,99,235,0.06)]">
      <ChatSidebar 
        history={normalizedHistory}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId} 
        onNewChat={handleNewChat} 
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
      
      <main className="flex min-w-0 flex-1 justify-center">
        <div className="flex h-full w-full max-w-3xl min-w-0 flex-col">
          <div className="flex-1 overflow-y-auto px-4 pb-6 pt-6 sm:px-6 sm:pt-8">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex min-h-full flex-col items-center justify-center px-4 py-12 text-center"
            >
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                How can I help you study?
              </h1>
              <p className="mt-3 max-w-md text-base leading-7 text-[var(--text-secondary)]">
                Ask questions, generate summaries, or create quizzes.
              </p>
              <PromptSuggestions onSelect={handleSelectPrompt} />
            </motion.div>
          ) : (
            <div className="flex flex-col gap-6 py-6">
              {messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  onSaveNote={handleSaveNote} 
                  onLikeFeedback={handleLikeFeedback}
                />
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex justify-start">
                  <div className="chat-theme-card flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--text-secondary)]">
                    <div className="h-2 w-2 rounded-full bg-[var(--accent-solid)]/70 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-[var(--accent-solid)]/70 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 rounded-full bg-[var(--accent-solid)]/70 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
          </div>

          <div className="px-4 pb-4 pt-3 sm:px-6 sm:pb-6">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={sendMessageMutation.isPending} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
