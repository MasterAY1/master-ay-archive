import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Copy, ThumbsUp, ThumbsDown, 
  Settings, PanelLeftClose, PanelLeft,
  ChevronDown, Check, PenSquare, MessageSquare, Menu, X
} from 'lucide-react';

export default function NovaAI() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [copiedId, setCopiedId] = useState(null);
  
  // --- NEW SETTINGS STATE ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [globalMemory, setGlobalMemory] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [history, setHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: "Hello, Architect. I am Nova. How can I assist you today?" }
  ]);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch('https://vault-api-master-ay.onrender.com/api/nova/history');
      const data = await res.json();
      if (data.status === 'success') setHistory(data.history);
    } catch (err) { console.error("Failed to load history", err); }
  };

  // --- ENGINE: FETCH & SAVE SETTINGS ---
  const fetchSettings = async () => {
    try {
      const res = await fetch('https://vault-api-master-ay.onrender.com/api/nova/settings');
      const data = await res.json();
      if (data.status === 'success') setGlobalMemory(data.global_memory);
    } catch (err) { console.error("Failed to load settings", err); }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await fetch('https://vault-api-master-ay.onrender.com/api/nova/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ global_memory: globalMemory })
      });
      setIsSettingsOpen(false);
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const loadChat = async (id) => {
    setCurrentChatId(id);
    if (window.innerWidth < 768) setSidebarOpen(false); 
    try {
      const res = await fetch(`https://vault-api-master-ay.onrender.com/api/nova/history/${id}`);
      const data = await res.json();
      if (data.status === 'success' && data.messages.length > 0) setMessages(data.messages);
    } catch (err) { console.error("Failed to load chat", err); }
  };

  useEffect(() => {
    fetchHistory();
    fetchSettings(); // Load the global memory on boot!
    if (window.innerWidth >= 768) setSidebarOpen(true);
  }, []);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, isGenerating]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const userText = prompt.trim();
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userText }]);
    setPrompt('');
    setIsGenerating(true);
    if (textareaRef.current) textareaRef.current.style.height = '56px';

    try {
      const response = await fetch('https://vault-api-master-ay.onrender.com/api/nova/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, chat_id: currentChatId }) 
      });
      const data = await response.json();
      
      if (data.status === "error") {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: "⚠️ Error: " + data.reply }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: data.reply }]);
        if (!currentChatId) {
          setCurrentChatId(data.chat_id);
          fetchHistory(); 
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: "⚠️ Network Error." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([{ id: Date.now(), role: 'ai', content: "Memory cleared. Ready for a new directive." }]);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="flex h-[100dvh] bg-[#171717] text-[#ECECEC] font-sans overflow-hidden selection:bg-purple-500/30">
      
      {/* --- SETTINGS MODAL OVERLAY --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#171717] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col gap-5 relative">
            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-5 right-5 text-[#808080] hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Custom Instructions</h2>
              <p className="text-sm text-[#808080] mt-1">What would you like Nova to know about you to provide better responses across all chats?</p>
            </div>
            
            <textarea 
              value={globalMemory}
              onChange={(e) => setGlobalMemory(e.target.value)}
              placeholder="e.g., My name is Ayomide. I am a Full-Stack developer based in Nigeria. Keep your responses concise and always format code blocks in Python or React."
              className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl p-4 text-[15px] text-[#ECECEC] focus:outline-none focus:border-purple-500/50 resize-none custom-scrollbar"
              rows="6"
            />
            
            <div className="flex justify-end gap-3 mt-2">
              <button onClick={() => setIsSettingsOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-[#808080] hover:text-white hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="px-5 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center min-w-[80px]"
              >
                {isSavingSettings ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />}

      <div className={`fixed md:relative z-40 h-full bg-[#0D0D0D] transition-all duration-300 ease-in-out shrink-0 border-r border-white/5 md:border-none overflow-hidden ${sidebarOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full w-[260px] md:translate-x-0 md:w-0'}`}>
        <div className="w-[260px] h-full flex flex-col">
          <div className="p-3 sticky top-0 bg-[#0D0D0D] z-10 flex justify-between items-center">
            <button onClick={startNewChat} className="flex-1 flex items-center justify-between p-3 rounded-lg hover:bg-[#212121] transition-colors text-sm font-medium group">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#ECECEC] text-[#0D0D0D] flex items-center justify-center"><Sparkles size={14} /></div>
                <span className="text-[#ECECEC]">New chat</span>
              </div>
              <PenSquare size={16} className="text-[#808080] group-hover:text-[#ECECEC] transition-colors" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4">
            <div className="mt-4 mb-2 px-3 text-xs font-semibold text-[#808080]">Recent Chats</div>
            {history.length === 0 ? (
              <div className="px-4 py-3 text-xs text-[#808080] italic">No memory found.</div>
            ) : (
              history.map(chat => (
                <button key={chat.id} onClick={() => loadChat(chat.id)} className={`w-full text-left p-2.5 px-3 rounded-lg transition-colors text-sm truncate flex items-center gap-2 ${currentChatId === chat.id ? 'bg-[#212121] text-white' : 'text-[#CCCCCC] hover:bg-[#212121] hover:text-[#ECECEC]'}`}>
                  <MessageSquare size={14} className="shrink-0 text-[#808080]"/>
                  {chat.title}
                </button>
              ))
            )}
          </div>

          <div className="p-3 bg-[#0D0D0D]">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#212121] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">AA</div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-[#ECECEC]">Ayomide A.</div>
                <div className="text-xs text-[#808080]">Custom Instructions</div>
              </div>
              <Settings size={16} className="text-[#808080]" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-[100dvh] relative bg-[#171717] w-full max-w-full">
        <header className="h-14 flex items-center justify-between px-2 md:px-4 sticky top-0 z-10 bg-[#171717]/80 backdrop-blur-md">
          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[#808080] hover:text-[#ECECEC] rounded-lg hover:bg-[#212121] transition-colors">
              <Menu size={20} className="md:hidden" />
              <PanelLeft size={20} className="hidden md:block" />
            </button>
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#212121] transition-colors group">
              <span className="text-lg font-semibold text-[#ECECEC] tracking-tight">Nova <span className="text-[#808080] font-normal">Live</span></span>
              <ChevronDown size={16} className="text-[#808080]" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-0 custom-scrollbar scroll-smooth">
          <div className="max-w-3xl mx-auto py-4 md:py-8 space-y-8 md:space-y-12 pb-32 md:pb-40">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[90%] md:max-w-[80%] bg-[#2F2F2F] text-[#ECECEC] px-4 md:px-5 py-3 rounded-3xl rounded-tr-sm text-[15px] leading-relaxed shadow-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="flex gap-3 md:gap-5 w-full max-w-3xl">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 mt-1 bg-[#171717]"><Sparkles size={16} className="text-purple-400" /></div>
                    <div className="flex-1 space-y-4 min-w-0">
                      <div className="text-[15px] leading-[1.7] text-[#D1D5DB] font-normal break-words">{msg.content.split('\n').map((line, i) => <p key={i} className={line.trim() === '' ? 'h-4' : 'mb-4 last:mb-0'}>{line}</p>)}</div>
                      <div className="flex items-center gap-1 -ml-2">
                        <button onClick={() => copyToClipboard(msg.content, msg.id)} className="p-2 text-[#808080] hover:text-[#ECECEC] hover:bg-[#212121] rounded-lg transition-colors">{copiedId === msg.id ? <Check size={14} className="text-green-400"/> : <Copy size={14} />}</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isGenerating && (
              <div className="flex gap-3 md:gap-5 w-full max-w-3xl animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 mt-1 bg-[#171717]"><Sparkles size={16} className="text-purple-400" /></div>
                <div className="flex-1 flex items-center mt-2.5">
                  <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-[#808080] animate-bounce" style={{ animationDelay: '0ms' }}></div><div className="w-2 h-2 rounded-full bg-[#808080] animate-bounce" style={{ animationDelay: '150ms' }}></div><div className="w-2 h-2 rounded-full bg-[#808080] animate-bounce" style={{ animationDelay: '300ms' }}></div></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#171717] via-[#171717] to-transparent pt-10 pb-4 md:pb-6 px-2 md:px-4">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSend} className="relative bg-[#212121] border border-white/5 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.1)] focus-within:border-white/20">
              <textarea ref={textareaRef} value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }} placeholder="Message Nova..." disabled={isGenerating} className="w-full bg-transparent px-4 py-3 md:py-4 pr-12 md:pr-14 text-[15px] text-[#ECECEC] resize-none focus:outline-none min-h-[50px] max-h-[150px] custom-scrollbar placeholder-[#808080]" rows="1" />
              <div className="absolute right-2 md:right-3 bottom-2 md:bottom-3">
                <button type="submit" disabled={!prompt.trim() || isGenerating} className={`p-1.5 rounded-lg transition-all ${prompt.trim() && !isGenerating ? 'bg-white text-black' : 'bg-[#2F2F2F] text-[#808080]'}`}><Send size={16} className={prompt.trim() && !isGenerating ? 'translate-x-0.5 -translate-y-0.5' : ''}/></button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style>{` .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; } `}</style>
    </div>
  );
}