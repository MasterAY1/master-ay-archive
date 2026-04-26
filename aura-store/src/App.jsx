import React, { useState, useEffect } from 'react';
import { ArrowLeft, Box, ShoppingCart, BarChart3, Film, Users, Bot, Wallet, Home } from 'lucide-react';

// Import ALL 8 of your projects
import AuraStore from './AuraStore';
import LuminaStore from './LuminaStore';
import NexusDashboard from './NexusDashboard';
import StudioFolio from './StudioFolio';
import CrmDashboard from './CrmDashboard';
import NovaAI from './NovaAI';
import VaultFinance from './VaultFinance';
import HavenBooking from './HavenBooking';

export default function App() {
  const [activeProject, setActiveProject] = useState('home');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const project = params.get('p');
    if (project) {
      setActiveProject(project);
    }
  }, []);

  useEffect(() => {
    switch (activeProject) {
      case 'home': document.title = 'MASTER_AY | Frontend Archive'; break;
      case 'aura': document.title = 'Aura Immersive | 3D Storefront'; break;
      case 'lumina': document.title = 'Lumina | Modern E-Commerce'; break;
      case 'nexus': document.title = 'Nexus | Analytics Dashboard'; break;
      case 'studio': document.title = 'Studio Folio | Creative Agency'; break;
      case 'crm': document.title = 'Velocity CRM | B2B SaaS Interface'; break;
      case 'ai': document.title = 'Nova AI | Chat Interface'; break;
      case 'fintech': document.title = 'Vault | FinTech Dashboard'; break;
      case 'booking': document.title = 'Haven | Real Estate UI'; break;
      default: document.title = 'MASTER_AY | Frontend Archive';
    }
  }, [activeProject]);

  const navigateTo = (projectId) => {
    const newUrl = projectId === 'home' ? '/' : `/?p=${projectId}`;
    window.history.pushState({}, '', newUrl);
    setActiveProject(projectId);
  };

  const BackButton = () => (
    <button 
      onClick={() => navigateTo('home')}
      className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[9999] px-4 py-3 md:px-5 md:py-3 text-[11px] md:text-sm font-bold text-white bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl hover:bg-black hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
      <span className="uppercase tracking-wider">Hub</span>
    </button>
  );
  // --- ROUTER LOGIC (All 8 Projects) ---
  if (activeProject === 'aura') return <><AuraStore /><BackButton /></>;
  if (activeProject === 'lumina') return <><LuminaStore /><BackButton /></>;
  if (activeProject === 'nexus') return <><NexusDashboard /><BackButton /></>;
  if (activeProject === 'studio') return <><StudioFolio /><BackButton /></>;
  if (activeProject === 'crm') return <><CrmDashboard /><BackButton /></>;
  if (activeProject === 'ai') return <><NovaAI /><BackButton /></>;
  if (activeProject === 'fintech') return <><VaultFinance /><BackButton /></>;
  if (activeProject === 'booking') return <><HavenBooking /><BackButton /></>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-16 lg:p-24 font-sans selection:bg-white selection:text-black">
      
      <header className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          MASTER_AY <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
            Frontend Archive.
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl text-lg md:text-xl font-light leading-relaxed">
          A master collection of production-ready interfaces, complex state architectures, and interactive UIs built with React and Tailwind CSS.
        </p>
      </header>

      {/* Grid updated to lg:grid-cols-4 so the 8 projects form two perfect rows of 4! */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
        
        <button onClick={() => navigateTo('aura')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff]/5 rounded-bl-full pointer-events-none group-hover:bg-[#00e5ff]/10 transition-colors"></div>
          <Box className="text-[#00e5ff] mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Aura Immersive</h2>
          <p className="text-gray-500 mb-6 text-sm">WebGL 3D Product Storefront</p>
        </button>

        <button onClick={() => navigateTo('lumina')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full pointer-events-none group-hover:bg-orange-500/10 transition-colors"></div>
          <ShoppingCart className="text-orange-500 mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Lumina Store</h2>
          <p className="text-gray-500 mb-6 text-sm">State-Driven Shopping Cart</p>
        </button>

        <button onClick={() => navigateTo('nexus')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/5 rounded-bl-full pointer-events-none group-hover:bg-[#8b5cf6]/10 transition-colors"></div>
          <BarChart3 className="text-[#8b5cf6] mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Nexus Analytics</h2>
          <p className="text-gray-500 mb-6 text-sm">Enterprise Data Dashboard</p>
        </button>

        <button onClick={() => navigateTo('studio')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none group-hover:bg-white/10 transition-colors"></div>
          <Film className="text-white mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Studio Folio</h2>
          <p className="text-gray-500 mb-6 text-sm">Interactive Creative Agency Layout</p>
        </button>

        <button onClick={() => navigateTo('crm')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-bl-full pointer-events-none group-hover:bg-pink-500/10 transition-colors"></div>
          <Users className="text-pink-500 mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Velocity CRM</h2>
          <p className="text-gray-500 mb-6 text-sm">B2B SaaS Pipeline & Routing</p>
        </button>

        <button onClick={() => navigateTo('ai')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>
          <Bot className="text-indigo-500 mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Nova AI Interface</h2>
          <p className="text-gray-500 mb-6 text-sm">SaaS Chat & Loading States</p>
        </button>

        <button onClick={() => navigateTo('fintech')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff88]/5 rounded-bl-full pointer-events-none group-hover:bg-[#00ff88]/10 transition-colors"></div>
          <Wallet className="text-[#00ff88] mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Vault FinTech</h2>
          <p className="text-gray-500 mb-6 text-sm">Live Trade Engine & Data Viz</p>
        </button>

        {/* The Final Project */}
        <button onClick={() => navigateTo('booking')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-full pointer-events-none group-hover:bg-rose-500/10 transition-colors"></div>
          <Home className="text-rose-500 mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Haven Booking</h2>
          <p className="text-gray-500 mb-6 text-sm">Complex Search & Image Carousels</p>
        </button>

      </div>
    </div>
  );
}