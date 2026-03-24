import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Copy, ThumbsUp, ThumbsDown, 
  MessageSquare, Clock, Settings, LogOut, PanelLeftClose, PanelLeft,
  Bot, User, ChevronDown, Check
} from 'lucide-react';

// --- MOCK HISTORY DATA ---
const CHAT_HISTORY = [
  { id: 1, title: "Product Launch Tweet", time: "2 hrs ago" },
  { id: 2, title: "Cold Email for SaaS", time: "5 hrs ago" },
  { id: 3, title: "Blog Intro: AI in 2026", time: "Yesterday" },
  { id: 4, title: "Landing Page Copy", time: "Yesterday" },
];

export default function NovaAI() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  
  // Initial welcome message
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'ai', 
      content: "Hello! I'm Nova, your AI writing assistant. What are we creating today? I can help you write emails, blog posts, code, or marketing copy." 
    }
  ]);

  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Handle sending a message
  const handleSend = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // 1. Add user message to chat
    const newUserMsg = { id: Date.now(), role: 'user', content: prompt };
    setMessages(prev => [...prev, newUserMsg]);
    setPrompt('');
    
    // 2. Trigger loading state
    setIsGenerating(true);

    // 3. Fake API Call (Simulates waiting for OpenAI)
    setTimeout(() => {
      const newAiMsg = { 
        id: Date.now() + 1, 
        role: 'ai', 
        content: "Here is a draft based on your request. Let me know if you'd like me to adjust the tone, make it shorter, or expand on any specific points.\n\n*This is a simulated AI response demonstrating the frontend state architecture.*" 
      };
      setMessages(prev => [...prev, newAiMsg]);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-200 font-sans flex overflow-hidden selection:bg-indigo-500/30">
      
      {/* --- SIDEBAR --- */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-[#131316] border-r border-white/5 transition-all duration-300 flex flex-col shrink-0 overflow-hidden relative z-20`}>
        <div className="p-4 flex items-center gap-3 border-b border-white/5 h-16 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-lg tracking-wide text-white">Nova AI</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <button className="w-full flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl transition-colors mb-6 border border-white/5">
            <PlusIcon /> New Chat
          </button>

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Recent Chats</div>
          <div className="space-y-1">
            {CHAT_HISTORY.map(chat => (
              <button key={chat.id} className="w-full flex flex-col items-start p-3 rounded-xl hover:bg-white/5 transition-colors group text-left">
                <div className="flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors w-full">
                  <MessageSquare size={14} className="shrink-0" />
                  <span className="text-sm truncate">{chat.title}</span>
                </div>
                <div className="text-[10px] text-gray-600 ml-6 mt-1">{chat.time}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white/5 shrink-0">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="w-6 h-6 rounded-full" />
            <span className="text-sm font-medium flex-1 text-left">Ayomide A.</span>
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex flex-col h-screen relative">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
              <span className="text-sm font-medium text-gray-300">Nova-4 (Advanced)</span>
              <ChevronDown size={14} className="text-gray-500" />
            </div>
          </div>
          <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 px-4 py-2 rounded-lg hover:bg-indigo-500/10 transition-colors">
            Upgrade Plan
          </button>
        </header>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-8 pb-32">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'ai' ? '' : 'flex-row-reverse'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-white'}`}>
                  {msg.role === 'ai' ? <Sparkles size={16} /> : <User size={16} />}
                </div>

                {/* Message Bubble */}
                <div className={`group flex flex-col max-w-[85%] ${msg.role === 'ai' ? 'items-start' : 'items-end'}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'ai' 
                      ? 'bg-[#18181b] border border-white/5 text-gray-200 rounded-tl-sm' 
                      : 'bg-indigo-600 text-white rounded-tr-sm'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {/* AI Action Buttons (Copy, Like, Dislike) */}
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-md transition-colors flex items-center gap-1.5"
                      >
                        {copiedId === msg.id ? <Check size={14} className="text-green-400"/> : <Copy size={14} />}
                        <span className="text-xs">{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-md transition-colors"><ThumbsUp size={14} /></button>
                      <button className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-md transition-colors"><ThumbsDown size={14} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Simulated Loading State */}
            {isGenerating && (
              <div className="flex gap-4 animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-[#18181b] border border-white/5 rounded-tl-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <span className="text-sm text-gray-400 ml-2">Nova is thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* --- INPUT AREA --- */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent pt-10 pb-6 px-4">
          <div className="max-w-3xl mx-auto relative">
            <form 
              onSubmit={handleSend}
              className={`relative bg-[#18181b] border ${isGenerating ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/10 focus-within:border-indigo-500'} rounded-2xl overflow-hidden transition-all duration-300`}
            >
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder={isGenerating ? "Please wait..." : "Ask Nova anything..."}
                disabled={isGenerating}
                className="w-full bg-transparent p-4 pr-16 text-sm text-white resize-none focus:outline-none min-h-[56px] max-h-[200px]"
                rows="1"
              />
              <button 
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all ${
                  prompt.trim() && !isGenerating 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
                    : 'bg-white/5 text-gray-500'
                }`}
              >
                <Send size={18} />
              </button>
            </form>
            <div className="text-center mt-3 text-xs text-gray-500">
              Nova AI can make mistakes. Consider verifying important information.
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

function PlusIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
}