import { useState, useRef, useEffect } from "react";
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
import { Sparkles } from "lucide-react";

export default function AIChatPage() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const { data: history } = useAIChatHistory();
  const { data: conversation } = useAIConversation(activeChatId);
  const sendMessageMutation = useAISendMessage();
  const saveNoteMutation = useAISaveNote();
  const createConversationMutation = useAICreateConversation();
  const renameConversationMutation = useAIRenameConversation();
  const deleteConversationMutation = useAIDeleteConversation();
  const sendFeedbackMutation = useAISendFeedback();

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
    <div className="flex h-[calc(100vh-theme(spacing.16))] w-full bg-background overflow-hidden relative">
      <ChatSidebar 
        history={normalizedHistory}
        onSelectChat={setActiveChatId} 
        onNewChat={handleNewChat} 
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-40">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="min-h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4 py-12"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 shadow-sm ring-1 ring-primary/20">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
                How can I help you study?
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
                I'm your AI Academic Assistant. Ask me to explain complex topics, generate summaries, or create practice questions.
              </p>
              <PromptSuggestions onSelect={handleSelectPrompt} />
            </motion.div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  onSaveNote={handleSaveNote} 
                  onLikeFeedback={handleLikeFeedback}
                />
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex gap-4 p-5 ml-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 bg-card px-4 py-2 rounded-full border shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-12 pb-6 px-4 md:px-8">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={sendMessageMutation.isPending} 
          />
        </div>
      </div>
    </div>
  );
}
