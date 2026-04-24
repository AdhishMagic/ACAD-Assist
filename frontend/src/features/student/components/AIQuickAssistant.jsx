import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Sparkles, Send, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAISendMessage } from '@/features/ai/hooks/useAIChat';

const suggestedPrompts = [
  "Explain Dijkstra's Algorithm",
  "Summarize my OS notes",
  "Generate a quick React quiz"
];

const AIQuickAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const sendMessageMutation = useAISendMessage();

  const handleAsk = async (e) => {
    e.preventDefault();
    const content = prompt.trim();
    if (!content || sendMessageMutation.isPending) return;

    setError('');

    try {
      const response = await sendMessageMutation.mutateAsync({
        content,
        title: content,
        entryPoint: 'student_dashboard_quick_assistant',
      });
      setPrompt('');
      navigate('/student/ai', {
        state: {
          activeChatId: response?.conversation_id,
        },
      });
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to save this chat right now.');
    }
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          AI Study Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Stuck on a concept? Ask our AI assistant for instant explanations, summaries, or practice questions.
        </p>
        
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((suggestion, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge
                variant="secondary"
                className="cursor-pointer border-indigo-200 bg-white/60 hover:bg-white dark:border-indigo-800 dark:bg-card dark:text-gray-100 dark:hover:bg-surface-hover"
                onClick={() => setPrompt(suggestion)}
              >
                {suggestion}
              </Badge>
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleAsk} className="flex gap-2 mt-2">
          <Input 
            placeholder="Ask anything..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={sendMessageMutation.isPending}
            className="border-indigo-200 bg-white/80 focus-visible:ring-indigo-500 dark:border-indigo-800 dark:bg-secondary dark:text-gray-50 dark:placeholder:text-gray-400"
          />
          <Button type="submit" size="icon" disabled={sendMessageMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
          onClick={() => navigate('/student/ai')}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Open Full Chat
        </Button>
      </CardFooter>
    </Card>
  );
};



export default AIQuickAssistant;
