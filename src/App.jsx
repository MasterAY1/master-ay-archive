import React, { useState, useEffect } from 'react';
import { ArrowLeft, Box, ShoppingCart, BarChart3, Film, Users } from 'lucide-react';

// Import all 5 of your projects
import AuraStore from './AuraStore';
import LuminaStore from './LuminaStore';
import NexusDashboard from './NexusDashboard';
import StudioFolio from './StudioFolio';
import CrmDashboard from './CrmDashboard';
import NovaAI from './NovaAI';
import { Bot } from 'lucide-react'; // We need the Bot icon for the grid!

export default function App() {
  // State to track which project we are currently viewing
  const [activeProject, setActiveProject] = useState('home');

  // 1. Check the URL when the site first loads
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const project = params.get('p');
    if (project) {
      setActiveProject(project);
    }
  }, []);

  // 2. Dynamically update the browser tab title
  useEffect(() => {
    switch (activeProject) {
      case 'home':
        document.title = 'MASTER_AY | Frontend Archive';
        break;
      case 'aura':
        document.title = 'Aura Immersive | 3D Storefront';
        break;
      case 'lumina':
        document.title = 'Lumina | Modern E-Commerce';
        break;
      case 'nexus':
        document.title = 'Nexus | Analytics Dashboard';
        break;
      case 'studio':
        document.title = 'Studio Folio | Creative Agency';
        break;
      case 'crm':
        document.title = 'Velocity CRM | B2B SaaS Interface';
        break;
      case 'ai':
        document.title = 'Nova AI | Chat Interface';
        break;
      default:
        document.title = 'MASTER_AY | Frontend Archive';
    }
  }, [activeProject]);

  // 3. Function to change the URL without reloading the page
  const navigateTo = (projectId) => {
    const newUrl = projectId === 'home' ? '/' : `/?p=${projectId}`;
    window.history.pushState({}, '', newUrl);
    setActiveProject(projectId);
  };

  // --- FLOATING BACK BUTTON ---
  const BackButton = () => (
    <button 
      onClick={() => navigateTo('home')}
      className="fixed bottom-6 right-6 z-[999] bg-white text-black px-6 py-3 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform flex items-center gap-2"
    >
      <ArrowLeft size={18} /> Back to Hub
    </button>
  );

  // --- ROUTER LOGIC ---
  if (activeProject === 'aura') return <><AuraStore /><BackButton /></>;
  if (activeProject === 'lumina') return <><LuminaStore /><BackButton /></>;
  if (activeProject === 'nexus') return <><NexusDashboard /><BackButton /></>;
  if (activeProject === 'studio') return <><StudioFolio /><BackButton /></>;
  if (activeProject === 'crm') return <><CrmDashboard /><BackButton /></>;
  if (activeProject === 'ai') return <><NovaAI /><BackButton /></>;

  // --- MAIN DIRECTORY (HOME) ---
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-16 lg:p-24 font-sans selection:bg-white selection:text-black">
      
      {/* Header */}
      <header className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          MASTER_AY <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
            Frontend Archive.
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl text-lg md:text-xl font-light leading-relaxed">
          A collection of production-ready interfaces, interactive 3D experiences, and complex state architectures built with React and Tailwind CSS.
        </p>
      </header>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
        
        {/* Project 1: Aura */}
        <button onClick={() => navigateTo('aura')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff]/5 rounded-bl-full pointer-events-none group-hover:bg-[#00e5ff]/10 transition-colors"></div>
          <Box className="text-[#00e5ff] mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Aura Immersive</h2>
          <p className="text-gray-500 mb-6">WebGL 3D Product Storefront</p>
          <div className="flex gap-2">
            <span className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-gray-400">React Three Fiber</span>
            <span className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-gray-400">Three.js</span>
          </div>
        </button>

        {/* Project 2: Lumina */}
        <button onClick={() => navigateTo('lumina')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full pointer-events-none group-hover:bg-orange-500/10 transition-colors"></div>
          <ShoppingCart className="text-orange-500 mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Lumina E-Commerce</h2>
          <p className="text-gray-500 mb-6">State-Driven Shopping Cart UI</p>
          <div className="flex gap-2">
            <span className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-gray-400">React State</span>
            <span className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-gray-400">Tailwind CSS</span>
          </div>
        </button>

        {/* Project 3: Nexus */}
        <button onClick={() => navigateTo('nexus')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/5 rounded-bl-full pointer-events-none group-hover:bg-[#8b5cf6]/10 transition-colors"></div>
          <BarChart3 className="text-[#8b5cf6] mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Nexus Analytics</h2>
          <p className="text-gray-500 mb-6">Enterprise Data Dashboard (SPA)</p>
          <div className="flex gap-2 text-xs font-mono text-gray-400 flex-wrap">
            <span className="bg-white/5 px-3 py-1 rounded-full">Recharts</span>
            <span className="bg-white/5 px-3 py-1 rounded-full">Data Viz</span>
            <span className="bg-white/5 px-3 py-1 rounded-full">Routing</span>
          </div>
        </button>

        {/* Project 4: Studio */}
        <button onClick={() => navigateTo('studio')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none group-hover:bg-white/10 transition-colors"></div>
          <Film className="text-white mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Studio Folio</h2>
          <p className="text-gray-500 mb-6">Interactive Creative Agency Layout</p>
          <div className="flex gap-2">
            <span className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-gray-400">Micro-interactions</span>
            <span className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-gray-400">Custom Cursors</span>
          </div>
        </button>

        {/* Project 5: CRM Dashboard (Spans 2 columns on desktop) */}
        <button onClick={() => navigateTo('crm')} className="group text-left bg-[#111] border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-all hover:-translate-y-2 relative overflow-hidden md:col-span-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-bl-full pointer-events-none group-hover:bg-pink-500/10 transition-colors"></div>
          <Users className="text-pink-500 mb-6" size={32} />
          <h2 className="text-2xl font-bold mb-2">Velocity CRM</h2>
          <p className="text-gray-500 mb-6">B2B SaaS Pipeline & Interaction Design</p>
          <div className="flex gap-2">
            <span className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-gray-400">UI/UX</span>
            <span className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-gray-400">React Flow</span>
          </div>
        </button>

      </div>
    </div>
  );
}