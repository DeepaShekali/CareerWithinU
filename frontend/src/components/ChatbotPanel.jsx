import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  RotateCcw,
  Compass,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "Which career suits my skills?",
  "How can I become an AI Engineer?",
  "What skills am I missing?",
  "Suggest a roadmap for Data Science",
  "Which career has opportunities for my interests?"
];

export default function ChatbotPanel({ className = '' }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  async function loadChatHistory() {
    try {
      setInitialLoading(true);
      const history = await api.getChatHistory('default');
      setMessages(history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setInitialLoading(false);
    }
  }

  const handleSend = async (textToSend) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || loading) return;

    setInput('');

    // Optimistically add user message
    const tempUserMsg = {
      id: Date.now(),
      sender: 'user',
      message: messageContent,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const response = await api.sendChatMessage(messageContent, 'default');
      const assistantMsg = {
        id: response.message_id || Date.now() + 1,
        sender: 'assistant',
        message: response.reply,
        timestamp: response.timestamp || new Date().toISOString(),
        suggested_actions: response.suggested_actions || []
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error generating AI response:', err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        message: "I encountered an issue connecting to the AI guidance engine. Please ensure the backend is running and try again.",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Reset conversation with CareerWithinU AI?")) return;
    try {
      setLoading(true);
      const res = await api.clearChat('default');
      setMessages([
        {
          id: Date.now(),
          sender: 'assistant',
          message: res.welcome_message,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error('Failed to clear chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatMessageText = (text) => {
    // Basic markdown support for bolding and line breaks
    const parts = text.split('\n');
    return parts.map((line, idx) => {
      // Bold rendering
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <span key={idx} className="block min-h-[1.25rem]">
          <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
        </span>
      );
    });
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={`w-96 bg-white border-l border-purple-100 flex flex-col h-screen sticky top-0 shadow-xs ${className}`}>
      {/* Chat Header */}
      <div className="p-4 border-b border-purple-100 bg-lavender-50/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-purple-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <span>CareerWithinU AI Assistant</span>
              <Sparkles className="w-3 h-3 text-purple-600" />
            </h3>
            <span className="text-[10px] text-emerald-600 font-medium">Online & Ready to Guide</span>
          </div>
        </div>

        <button
          onClick={handleClear}
          title="Reset conversation"
          className="p-1.5 text-gray-400 hover:text-purple-700 hover:bg-purple-100/60 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-lavender-50/30">
        {initialLoading ? (
          <div className="flex items-center justify-center h-32 text-xs text-gray-400">
            <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mr-2"></div>
            Connecting to Career Assistant...
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-700 border border-purple-200'
                  }`}
                >
                  {isUser ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-tr from-purple-700 to-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-purple-100/90 rounded-tl-none'
                  }`}
                >
                  <div className="space-y-1">{formatMessageText(msg.message)}</div>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      isUser ? 'text-purple-200' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-purple-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Pills */}
      <div className="p-2.5 border-t border-purple-100/80 bg-white">
        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1">
          <Lightbulb className="w-3 h-3 text-amber-500" />
          <span>Suggested Questions</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100 font-medium transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-lavender-50/70 border-t border-purple-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask career, skill, or roadmap questions..."
          className="flex-1 bg-white border border-purple-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none shadow-2xs"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shadow-sm shadow-purple-500/20 transition-all shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
