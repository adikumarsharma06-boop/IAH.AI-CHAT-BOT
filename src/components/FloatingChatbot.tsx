import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Cpu, Sparkles, RefreshCw, 
  HelpCircle, ChevronRight, CornerDownLeft, AlertCircle, Info, Flame
} from 'lucide-react';
import { ChatMessage, SystemUsage } from '../types';

interface FloatingChatbotProps {
  usageAdder: (credits: number) => void;
  userProfile: { name: string; role: string; accentColor: string } | null;
  onNavigateToTab: (tabName: string) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  inputText: string;
  setInputText: (text: string) => void;
}

export default function FloatingChatbot({ 
  usageAdder, 
  userProfile,
  onNavigateToTab,
  messages,
  setMessages,
  inputText,
  setInputText
}: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message configured to the username if available and history is empty
  useEffect(() => {
    if (messages.length === 0 && userProfile) {
      const userName = userProfile.name || 'Explorer';
      setMessages([
        {
          id: 'init-1',
          sender: 'ai',
          text: `**Greetings, ${userName}!** 👋\n\nI am **Synapse Node-7**, your persistent workspace concierge. I can optimize your business ideas, generate tailored career syllabus, draft immediate task objectives, or assist with anything in real-time.\n\nType a query or tap a quick-start chip below to command!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'chat'
        }
      ]);
    }
  }, [messages, userProfile, setMessages]);

  // Auto scroll
  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `bot-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'chat'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: [...messages, userMsg],
          mode: 'chat'
        })
      });

      if (!response.ok) {
        throw new Error("Handshake connection broken.");
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `bot-ai-${Date.now()}`,
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'chat'
      };

      setMessages(prev => [...prev, aiMsg]);
      usageAdder(100); // consume simulated credit metrics unit
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'system',
          text: `⚠️ **[System Link Disrupted]**\n\nFailed to receive response from Synapse. Click retry or check connection.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  // Color mappings
  const getThemeColorClass = () => {
    if (!userProfile) return 'from-indigo-600 to-blue-600';
    if (userProfile.accentColor === 'emerald') return 'from-emerald-600 to-teal-600';
    if (userProfile.accentColor === 'cyan') return 'from-cyan-600 to-blue-500';
    if (userProfile.accentColor === 'violet') return 'from-violet-600 to-fuchsia-600';
    return 'from-indigo-600 to-blue-600';
  };

  const getThemeRingClass = () => {
    if (!userProfile) return 'border-indigo-500 shadow-indigo-600/30';
    if (userProfile.accentColor === 'emerald') return 'border-emerald-500 shadow-emerald-600/30';
    if (userProfile.accentColor === 'cyan') return 'border-cyan-500 shadow-cyan-600/30';
    if (userProfile.accentColor === 'violet') return 'border-violet-500 shadow-violet-600/30';
    return 'border-indigo-500 shadow-indigo-600/30';
  };

  const presetChips = [
    { label: "🚀 Analyze SaaS Idea", prompt: "Help me evaluate an idea of: A SaaS matching global remote writers using automated smart SEO clusters." },
    { label: "📋 Write Sprint Tasks", prompt: "What are 5 essential MVP launch tasks checklist for a web-based document visualizer?" },
    { label: "🎓 Learn Next.js Fast", prompt: "Create a 3-step learning roadmap with targeted competencies for Next.js 15 routing." },
    { label: "💡 Marketing Tactic", prompt: "Suggest a low-cost traffic generation blueprint to launch micro-SaaS organically on Reddit." }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      <AnimatePresence>
        
        {/* CHAT WINDOW OVERLAY */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 25 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute bottom-18 right-0 w-[380px] h-[520px] bg-[#111622]/98 border border-slate-800 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* 1. Header with dynamic ring animation logo */}
            <div className={`p-4 bg-gradient-to-r ${getThemeColorClass()} flex items-center justify-between border-b border-white/5`}>
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 flex items-center justify-center bg-slate-950 rounded-lg border border-white/10">
                  {/* Rotating spinner ring inside header */}
                  <div className="absolute inset-0.5 rounded-lg border border-transparent border-t-white/30 animate-spin"></div>
                  <Cpu size={14} className="text-white relative z-10 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-xs tracking-wide text-white uppercase font-display flex items-center gap-1">
                    Synapse Assistant
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-450 bg-emerald-400 animate-ping"></span>
                  </h3>
                  <p className="text-[9px] text-white/70 font-mono">IAH.AI PROTOCOL NODE-7 // ONLINE</p>
                </div>
              </div>

              {/* Action utilities */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (window.confirm("Format conversation timeline?")) {
                      setMessages([
                        {
                          id: 'reset-1',
                          sender: 'ai',
                          text: `**Conversation timeline synchronized.** Core session renewed. Ask helper anything!`,
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          mode: 'chat'
                        }
                      ]);
                    }
                  }}
                  title="Clear dialog logs"
                  className="p-1 px-1.5 hover:bg-white/10 rounded-md text-white/80 hover:text-white transition-colors"
                >
                  <RefreshCw size={11} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-md text-white/80 hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* 2. Chat Timeline messages feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20">
              
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1 px-1">
                    {msg.sender === 'user' ? 'Local Commander' : 'Synapse Node'}
                  </span>
                  
                  <div 
                    className={`text-xs px-3.5 py-2.5 leading-relaxed rounded-xl max-w-[85%] ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600/90 text-white font-medium rounded-tr-none shadow-md' 
                        : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none font-normal'
                    }`}
                  >
                    {/* Basic Markdown rendering helper */}
                    <div className="space-y-1.5 whitespace-pre-wrap">
                      {msg.text.split('\n\n').map((para, pIdx) => {
                        // Custom rendering for simple markdown tags
                        let text = para;
                        const startsWithBullet = text.startsWith('- ') || text.startsWith('* ');
                        if (startsWithBullet) {
                          return (
                            <ul key={pIdx} className="list-disc pl-4 space-y-1">
                              {text.split('\n').map((li, liIdx) => (
                                <li key={liIdx}>
                                  {li.replace(/^(\-\s*|\*\s*)/, '')}
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        
                        return (
                          <p key={pIdx} className="leading-relaxed">
                            {/* Simple render of bold tag ** */}
                            {text.split('**').map((chunk, cIdx) => (
                              cIdx % 2 === 1 ? <strong key={cIdx} className="text-white font-semibold">{chunk}</strong> : chunk
                            ))}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex flex-col items-start">
                  <span className="text-[8px] font-mono text-slate-500 uppercase mb-1">Synapse Node</span>
                  <div className="bg-slate-900/40 border border-slate-850 rounded-xl rounded-tl-none px-3.5 py-2.5 text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <RefreshCw size={11} className="animate-spin text-indigo-400" />
                    Connecting API network telemetry...
                  </div>
                </div>
              )}

              <div ref={feedEndRef} />
            </div>

            {/* 3. Preset chips shortcut helper */}
            <div className="p-3 bg-slate-950 border-t border-slate-900 space-y-1.5">
              <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest block px-1">Quick Synapse Starters:</span>
              <div className="flex flex-wrap gap-1">
                {presetChips.slice(0, 3).map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetPrompt(chip.prompt)}
                    className="bg-slate-900 hover:bg-slate-850 hover:border-slate-700 text-slate-400 hover:text-white px-2 py-1 border border-slate-850 rounded text-[9px] font-sans transition-colors cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Terminal Input footer */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-850">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputText);
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={inputText}
                  disabled={loading}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Synapse anything..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || loading}
                  className="absolute right-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-650 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <Send size={11} />
                </button>
              </form>
              <div className="flex justify-between items-center text-[8px] font-mono text-slate-550 mt-2 px-1">
                <span className="flex items-center gap-1"><Info size={9} /> Syncs to dashboard logs</span>
                <span>CONSUMES: ~100 U</span>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* FLOATING ACTION TRIGGER BUTTON */}
      <div className="relative">
        {/* Animated outer glowing ring (effect) */}
        <div className={`absolute -inset-1.5 rounded-full border border-dashed border-spacing-1 ${getThemeRingClass()} animate-spin-slow opacity-60`}></div>
        
        {/* Dynamic breathing glowing circle effect behind button */}
        <div className="absolute inset-0.5 bg-blue-600 blur-md rounded-full -z-10 animate-pulse opacity-40"></div>

        <button
          id="floating-synapse-chatbot-btn"
          onClick={() => setIsOpen(!isOpen)}
          title="Open AI Synapse Guide"
          className={`w-14 h-14 bg-gradient-to-br ${getThemeColorClass()} rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform relative z-10 cursor-pointer`}
        >
          {isOpen ? <X size={22} className="animate-none" /> : <MessageSquare size={22} className="animate-pulse" />}
        </button>
      </div>

    </div>
  );
}
