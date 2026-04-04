import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, RefreshCw } from 'lucide-react';

export default function NovaAI() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello, architect. I am Nova, running securely on your Python backend. What are we building today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      // ✨ The connection to your Python Master API! ✨
      const response = await fetch('https://vault-api-master-ay.onrender.com/api/nova/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });

      const data = await response.json();

      if (data.status === "error") {
        setMessages(prev => [...prev, { role: 'ai', text: "⚠️ Connection error: " + data.reply, isError: true }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "⚠️ Network Error: Could not reach the Python server.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => setMessages([{ role: 'ai', text: "Memory wiped. Ready for a new directive." }]);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex items-center justify-center p-4 lg:p-10 font-sans selection:bg-purple-500/30">
      
      {/* Background Glow */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-4xl h-[85vh] bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col shadow-2xl relative z-10 overflow-hidden">
        
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Nova AI</h1>
              <p className="text-xs text-purple-400 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                Python Backend Connected
              </p>
            </div>
          </div>
          <button onClick={handleClear} className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5" title="Clear Chat">
            <RefreshCw size={18} />
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                msg.role === 'user' 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : msg.isError 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>

              {/* Message Bubble */}
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-white/5 border border-white/5 text-gray-200 rounded-tr-sm'
                  : msg.isError
                    ? 'bg-red-500/5 border border-red-500/10 text-red-200 rounded-tl-sm'
                    : 'bg-purple-500/5 border border-purple-500/10 text-gray-300 rounded-tl-sm'
              }`}>
                {msg.text.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 text-purple-400">
                <Bot size={18} />
              </div>
              <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-gray-400 flex items-center gap-2 rounded-tl-sm">
                <Loader2 size={16} className="animate-spin text-purple-500" />
                <span className="text-xs uppercase tracking-widest font-mono">Synthesizing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-[#0a0a0a] border-t border-white/5">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Nova..."
              disabled={isLoading}
              className="w-full bg-[#121214] border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder-gray-600"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:hover:bg-purple-600 flex items-center justify-center"
            >
              <Send size={18} className={input.trim() && !isLoading ? 'translate-x-0.5 -translate-y-0.5 transition-transform' : ''} />
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Powered by Google Gemini & FastAPI</p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168,85,247,0.5); }
      `}</style>
    </div>
  );
}