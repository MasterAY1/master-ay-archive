import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Copy, ThumbsUp, ThumbsDown, 
  MessageSquare, Settings, PanelLeftClose, PanelLeft,
  User, ChevronDown, Check, PenSquare, MoreHorizontal
} from 'lucide-react';

export default function NovaAI() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  
  // --- DYNAMIC DATABASE STATE ---
  const [history, setHistory] = useState([]);
  
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: "Hello, Architect. I am Nova. How can I assist you with your codebase or strategy today?" }
  ]);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // --- ENGINE: FETCH DATABASE HISTORY ---
  const fetchHistory = async () => {
    try {
      const res = await fetch('https://vault-api-master-ay.onrender.com/api/nova/history');
      const data = await res.json();
      if (data.status === 'success') setHistory(data.history);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Auto-scroll & Auto-resize
  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, isGenerating]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  // --- ENGINE: CHAT & SAVE TITLE ---
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const userText = prompt.trim();
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userText }]);
    setPrompt('');
    setIsGenerating(true);
    if (textareaRef.current) textareaRef.current.style.height = '56px';

    // ✨ If this is the FIRST message of a new chat, save the title to the database!
    if (messages.length === 1) {
      const chatTitle = userText.split(' ').slice(0, 4).join(' ') + '...';
      try {
        await fetch('https://vault-api-master-ay.onrender.com/api/nova/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: chatTitle })
        });
        fetchHistory(); // Refresh sidebar!
      } catch (err) { console.error("History save failed", err); }
    }

    // Process AI Response
    try {
      const response = await fetch('https://vault-api-master-ay.onrender.com/api/nova/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await response.json();
      if (data.status === "error") {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: "⚠️ Backend Error: " + data.reply }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: "⚠️ Network Error: Could not reach Python server." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startNewChat = () => setMessages([{ id: Date.now(), role: 'ai', content: "Memory cleared. Ready for a new directive." }]);

  return (
    <div className="flex h-screen bg-[#171717] text-[#ECECEC] font-sans overflow-hidden selection:bg-purple-500/30">
      
      {/* --- SIDEBAR --- */}
      <div className={`${sidebarOpen ? 'w-[260px] opacity-100' : 'w-0 opacity-0'} bg-[#0D0D0D] transition-all duration-300 ease-in-out flex flex-col shrink-0 overflow-hidden relative z-20`}>
        
        <div className="p-3 sticky top-0 bg-[#0D0D0D] z-10">
          <button onClick={startNewChat} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#212121] transition-colors text-sm font-medium group">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#ECECEC] text-[#0D0D0D] flex items-center justify-center"><Sparkles size={14} /></div>
              <span className="text-[#ECECEC]">New chat</span>
            </div>
            <PenSquare size={16} className="text-[#808080] group-hover:text-[#ECECEC] transition-colors" />
          </button>
        </div>

        {/* --- DYNAMIC HISTORY RENDER --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4">
          <div className="mt-4 mb-2 px-3 text-xs font-semibold text-[#808080]">Recent Databases Entries</div>
          
          {history.length === 0 ? (
            <div className="px-4 py-3 text-xs text-[#808080] italic">No chats saved yet.</div>
          ) : (
            history.map(chat => (
              <button key={chat.id} className="w-full text-left p-2.5 px-3 rounded-lg hover:bg-[#212121] transition-colors text-sm text-[#CCCCCC] hover:text-[#ECECEC] truncate group relative">
                {chat.title}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gradient-to-l from-[#212121] via-[#212121] pl-4">
                  <MoreHorizontal size={16} className="text-[#808080] hover:text-white" />
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-3 bg-[#0D0D0D]">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#212121] transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">AA</div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-[#ECECEC]">Ayomide A.</div>
              <div className="text-xs text-[#808080]">Master Plan</div>
            </div>
            <Settings size={16} className="text-[#808080]" />
          </button>
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex flex-col h-screen relative bg-[#171717]">
        <header className="h-14 flex items-center justify-between px-4 sticky top-0 z-10 bg-[#171717]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[#808080] hover:text-[#ECECEC] rounded-lg hover:bg-[#212121] transition-colors">
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#212121] transition-colors group">
              <span className="text-lg font-semibold text-[#ECECEC] tracking-tight">Nova <span className="text-[#808080] font-normal">Live</span></span>
              <ChevronDown size={16} className="text-[#808080] group-hover:text-[#ECECEC] transition-colors" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-0 custom-scrollbar scroll-smooth">
          <div className="max-w-3xl mx-auto py-8 space-y-12 pb-40">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[80%] bg-[#2F2F2F] text-[#ECECEC] px-5 py-3.5 rounded-3xl rounded-tr-sm text-[15px] leading-relaxed shadow-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="flex gap-5 w-full max-w-3xl">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 mt-1 bg-[#171717]">
                      <Sparkles size={16} className="text-purple-400" />
                    </div>
                    <div className="flex-1 space-y-4 min-w-0">
                      <div className="text-[15px] leading-[1.7] text-[#D1D5DB] font-normal">
                        {msg.content.split('\n').map((line, i) => <p key={i} className={line.trim() === '' ? 'h-4' : 'mb-4 last:mb-0'}>{line}</p>)}
                      </div>
                      <div className="flex items-center gap-1 -ml-2">
                        <button onClick={() => copyToClipboard(msg.content, msg.id)} className="p-2 text-[#808080] hover:text-[#ECECEC] hover:bg-[#212121] rounded-lg transition-colors flex items-center gap-1.5">
                          {copiedId === msg.id ? <Check size={14} className="text-green-400"/> : <Copy size={14} />}
                        </button>
                        <button className="p-2 text-[#808080] hover:text-[#ECECEC] hover:bg-[#212121] rounded-lg transition-colors"><ThumbsUp size={14} /></button>
                        <button className="p-2 text-[#808080] hover:text-[#ECECEC] hover:bg-[#212121] rounded-lg transition-colors"><ThumbsDown size={14} /></button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isGenerating && (
              <div className="flex gap-5 w-full max-w-3xl animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 mt-1 bg-[#171717]">
                  <Sparkles size={16} className="text-purple-400" />
                </div>
                <div className="flex-1 flex items-center mt-2.5">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#808080] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#808080] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#808080] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#171717] via-[#171717] to-transparent pt-10 pb-6 px-4 md:px-0">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSend} className="relative bg-[#212121] border border-white/5 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-200 focus-within:border-white/20">
              <textarea ref={textareaRef} value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }} placeholder="Message Nova..." disabled={isGenerating} className="w-full bg-transparent px-4 py-4 pr-14 text-[15px] text-[#ECECEC] resize-none focus:outline-none min-h-[56px] max-h-[200px] custom-scrollbar placeholder-[#808080]" rows="1" />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button type="submit" disabled={!prompt.trim() || isGenerating} className={`p-1.5 rounded-lg transition-all ${prompt.trim() && !isGenerating ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#2F2F2F] text-[#808080] cursor-not-allowed'}`}>
                  <Send size={16} className={prompt.trim() && !isGenerating ? 'translate-x-0.5 -translate-y-0.5 transition-transform' : ''}/>
                </button>
              </div>
            </form>
            <div className="text-center mt-3 text-xs text-[#808080]">Nova is powered by Python FastAPI & SQLite.</div>
          </div>
        </div>

      </div>
      <style>{` .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; } `}</style>
    </div>
  );
}