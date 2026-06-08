import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GroundingSource } from '../types';
import { 
  Send, Sparkles, BookOpen, Terminal, Globe, Link2, AlertCircle, ChevronRight, Check, Copy 
} from 'lucide-react';
import { motion } from 'motion/react';

interface AIChatViewProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string, mode: 'chat' | 'search' | 'code') => void;
  isLoading: boolean;
}

export default function AIChatView({ chatHistory, onSendMessage, isLoading }: AIChatViewProps) {
  const [input, setInput] = useState('');
  const [activeMode, setActiveMode] = useState<'chat' | 'search' | 'code'>('chat');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim(), activeMode);
    setInput('');
  };

  // Quick prompt suggestions
  const suggestions = [
    { text: "Validate a B2B SaaS startup idea", mode: 'chat' as const },
    { text: "Explain React 19 compiler optimization rules", mode: 'code' as const },
    { text: "Who won the latest technological awards this month?", mode: 'search' as const },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
      
      {/* Sidebar - Settings and suggestions */}
      <div className="hidden lg:flex flex-col justify-between glass-panel border border-slate-800/80 rounded-2xl p-5 space-y-6">
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="font-bold text-sm tracking-tight font-display text-white">INTELLIGENCE MODES</h3>
            <p className="text-[11px] text-slate-400">Toggle specialty processor engines:</p>
          </div>

          <div className="space-y-1.5">
            <button
              id="mode-chat-tab"
              onClick={() => setActiveMode('chat')}
              className={`w-full flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl transition-all ${activeMode === 'chat' ? 'bg-blue-600 font-semibold text-white' : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300'}`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} className={activeMode === 'chat' ? 'text-white' : 'text-blue-400'} />
                <span>Standard Assistant</span>
              </div>
              <ChevronRight size={12} />
            </button>

            <button
              id="mode-search-tab"
              onClick={() => setActiveMode('search')}
              className={`w-full flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl transition-all ${activeMode === 'search' ? 'bg-blue-600 font-semibold text-white' : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300'}`}
            >
              <div className="flex items-center gap-2">
                <Globe size={14} className={activeMode === 'search' ? 'text-white' : 'text-blue-400'} />
                <span>Deep Search Grounding</span>
              </div>
              <ChevronRight size={12} />
            </button>

            <button
              id="mode-code-tab"
              onClick={() => setActiveMode('code')}
              className={`w-full flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl transition-all ${activeMode === 'code' ? 'bg-blue-600 font-semibold text-white' : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300'}`}
            >
              <div className="flex items-center gap-2">
                <Terminal size={14} className={activeMode === 'code' ? 'text-white' : 'text-blue-400'} />
                <span>Developer Agent</span>
              </div>
              <ChevronRight size={12} />
            </button>
          </div>

          {/* Prompt cues */}
          <div className="space-y-2 pt-4">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase">SUGGESTED COMMANDS</span>
            <div className="space-y-1.5">
              {suggestions.map((cue, idx) => (
                <button
                  key={idx}
                  id={`cue-btn-${idx}`}
                  onClick={() => {
                    setActiveMode(cue.mode);
                    setInput(cue.text);
                  }}
                  className="w-full text-left text-xs bg-slate-950 hover:bg-slate-900 duration-200 border border-slate-850 p-2.5 rounded-lg text-slate-405 leading-normal"
                >
                  <p className="text-slate-400 font-normal line-clamp-2 hover:text-slate-200 transition-colors">
                    "{cue.text}"
                  </p>
                  <span className="text-[9px] font-mono text-blue-400 mt-1 block uppercase font-medium">➔ {cue.mode} mode</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* System parameters feedback */}
        <div className="border border-slate-800 rounded-xl p-3 bg-slate-950 text-[10px] font-mono text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>MODEL:</span>
            <span className="text-blue-400">gemini-3.5-flash</span>
          </div>
          <div className="flex justify-between">
            <span>TEMPERATURE:</span>
            <span>0.7</span>
          </div>
          <div className="flex justify-between">
            <span>CONVERSATION DEPTH:</span>
            <span className="text-emerald-400">{chatHistory.filter(m => m.sender !== 'system').length} posts</span>
          </div>
        </div>
      </div>

      {/* Main chat pane */}
      <div className="lg:col-span-3 flex flex-col justify-between glass-panel border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-950/25">
        
        {/* Chat window top status info */}
        <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-xl">
              {activeMode === 'chat' && <Sparkles size={16} className="text-blue-400 animate-pulse" />}
              {activeMode === 'search' && <Globe size={16} className="text-blue-400 animate-pulse" />}
              {activeMode === 'code' && <Terminal size={16} className="text-blue-400 animate-pulse" />}
            </div>
            <div>
              <div className="text-sm font-semibold font-display text-white">
                {activeMode === 'chat' && "IAH.AI Core Assistant"}
                {activeMode === 'search' && "Deep Search groundings & reviews"}
                {activeMode === 'code' && "Developer Agent Specialist"}
              </div>
              <div className="text-[10px] text-slate-400">
                {activeMode === 'chat' && "Unified strategizing core"}
                {activeMode === 'search' && "Live Web Search powered by Google"}
                {activeMode === 'code' && "Refining, debugging, optimization"}
              </div>
            </div>
          </div>

          <div className="lg:hidden flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['chat', 'search', 'code'] as const).map((m) => (
              <button
                key={m}
                id={`mobile-mode-${m}`}
                onClick={() => setActiveMode(m)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-colors ${activeMode === m ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'}`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Chat stream renderer */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto pt-10">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
                <Sparkles size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold font-display text-white text-base">Initialize Context Communication</h4>
                <p className="text-xs text-slate-400">
                  Formulate questions regarding technology architectures, startup checklists, SEO campaigns, or market analyses to begin executing plans.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] font-mono text-slate-500 mb-1 px-1 flex items-center gap-1">
                    <span className="font-semibold text-slate-400 uppercase">{msg.sender === 'user' ? 'You' : 'IAH.AI'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.mode && (
                      <>
                        <span>•</span>
                        <span className="text-blue-400 font-bold uppercase">{msg.mode}</span>
                      </>
                    )}
                  </div>

                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white font-medium rounded-tr-none' : 'bg-slate-900 border border-slate-800/80 text-slate-200 rounded-tl-none font-normal'}`}
                  >
                    {msg.isThinking ? (
                      <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></span>
                        <span>IAH OS evaluating parameters...</span>
                      </div>
                    ) : (
                      <div className="space-y-3 prose prose-invert prose-xs max-w-none">
                        <MarkdownFormatter text={msg.text} />
                      </div>
                    )}
                  </div>

                  {/* Grounded Web Sources Display */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pl-2 w-full max-w-[85%] flex flex-col gap-1.5">
                      <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                        <BookOpen size={11} className="text-blue-400" />
                        Grounded Sources Provided:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.uri}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="bg-slate-900/45 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1 text-[10px] text-blue-300 font-sans flex items-center gap-1 transition-all"
                          >
                            <Link2 size={10} className="text-[9px]" />
                            <span className="line-clamp-1 max-w-[150px]">{src.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="text-[10px] font-mono text-slate-500 mb-1 px-1">
                    <span className="font-semibold text-slate-400 uppercase">IAH.AI</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-830/80 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></span>
                      <span>Sourcing multi-agent nodes...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-800">
          <form id="chat-input-form" onSubmit={handleSend} className="relative flex items-center">
            <input
              id="chat-message-input"
              type="text"
              required
              disabled={isLoading}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                activeMode === 'chat' ? "Consult on operations, market research, copywriting..." :
                activeMode === 'search' ? "Query recent facts or search grounding keywords..." :
                "Paste functions/modules to optimize, refactor, or build..."
              }
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 hover:border-slate-700/85 transition-colors focus:outline-none rounded-xl pl-4 pr-12 py-3.5 text-xs text-white placeholder-slate-500"
            />
            <button
              id="send-message-btn"
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg text-white transition-colors flex items-center justify-center p-2"
            >
              <Send size={14} />
            </button>
          </form>
          <div className="flex justify-between items-center mt-2.5 px-1 text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <AlertCircle size={10} className="text-slate-500" />
              Markdown formatting is fully supported.
            </span>
            <span className="text-blue-400 uppercase font-semibold">Active: {activeMode} mode</span>
          </div>
        </div>

      </div>

    </div>
  );
}

// -------------------------------------------------------------
// Markdown Code formatting renderer
// -------------------------------------------------------------
function MarkdownFormatter({ text }: { text: string }) {
  if (!text) return null;

  // Split content by codeblock structures
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const textBefore = text.substring(lastIndex, match.index);
    const language = match[1] || 'code';
    const codeContent = match[2];

    if (textBefore) {
      parts.push(<TextSection key={`txt-${lastIndex}`} rawText={textBefore} />);
    }

    parts.push(
      <CodeBlock key={`code-${match.index}`} language={language} code={codeContent} />
    );

    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<TextSection key={`txt-${lastIndex}`} rawText={text.substring(lastIndex)} />);
  }

  return <div className="space-y-2">{parts}</div>;
}

// Renders inline text, titles, backticks, bold
function TextSection({ rawText }: { rawText: string; key?: string }) {
  const lines = rawText.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // 1. Headers ###
        if (trimmed.startsWith('###')) {
          return (
            <h4 key={idx} className="font-semibold text-white font-display text-xs tracking-tight mt-3 mb-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              {trimmed.replace(/^###\s*/, '')}
            </h4>
          );
        }

        // 2. Headers ##
        if (trimmed.startsWith('##')) {
          return (
            <h3 key={idx} className="font-bold text-white font-display text-sm tracking-tight border-b border-slate-800 pb-1 mt-4 mb-2">
              {trimmed.replace(/^##\s*/, '')}
            </h3>
          );
        }

        // 3. Bullet points
        if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-3 py-0.5">
              <span className="text-blue-400 mt-1 font-bold">•</span>
              <p className="text-slate-350 m-0 leading-normal font-sans">
                {applyInlineFormatting(trimmed.replace(/^[\*\-]\s*/, ''))}
              </p>
            </div>
          );
        }

        // 4. Numbered Lists
        if (/^\d+\.\s*/.test(trimmed)) {
          const numMatch = trimmed.match(/^(\d+\.)\s*(.*)/);
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 py-0.5">
              <span className="text-slate-500 font-mono text-[10px] mt-0.5">{numMatch?.[1]}</span>
              <p className="text-slate-350 m-0 leading-normal font-sans">
                {applyInlineFormatting(numMatch?.[2] || '')}
              </p>
            </div>
          );
        }

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-slate-300 leading-normal font-sans m-0">
            {applyInlineFormatting(line)}
          </p>
        );
      })}
    </div>
  );
}

// Formats **bold** and `code` inline elements
function applyInlineFormatting(text: string): React.ReactNode[] {
  const inlineRegex = /(\*\*|`)(.*?)\1/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    const before = text.substring(lastIndex, match.index);
    const token = match[1];
    const content = match[2];

    if (before) {
      parts.push(<span key={lastIndex}>{before}</span>);
    }

    if (token === '**') {
      parts.push(<strong key={match.index} className="text-white font-semibold">{content}</strong>);
    } else if (token === '`') {
      parts.push(
        <code key={match.index} className="bg-slate-950 font-mono text-[10px] text-blue-400 px-1 py-0.5 rounded border border-slate-800">
          {content}
        </code>
      );
    }

    lastIndex = inlineRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
  }

  return parts;
}

// Highlighted Code Block Component
function CodeBlock({ language, code }: { language: string; code: string; key?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden mt-3 mb-3 bg-slate-950 neon-glow">
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-[10px] font-mono leading-none py-1 px-2 hover:bg-slate-800/60 rounded"
        >
          {copied ? (
            <>
              <Check size={11} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-left font-mono text-[11px] text-blue-200/90 leading-relaxed bg-[#0b0f19]">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
