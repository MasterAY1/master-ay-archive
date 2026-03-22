import React, { useState, useEffect, useRef } from 'react';
import { Play, ArrowUpRight, Instagram, Twitter, Mail, MoveRight, X, Volume2, Maximize } from 'lucide-react';

// --- MOCK PROJECT DATA ---
const PROJECTS = [
  { id: 1, title: "Echoes of Silence", category: "Short Film", year: "2026", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop", duration: "12:40" },
  { id: 2, title: "Neon Genesis", category: "Motion Ads", year: "2025", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop", duration: "01:15" },
  { id: 3, title: "Urban Decay", category: "Documentary", year: "2025", image: "https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=1000&auto=format&fit=crop", duration: "45:20" },
  { id: 4, title: "Vogue Spring", category: "Brand Campaign", year: "2026", image: "https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=1000&auto=format&fit=crop", duration: "02:30" }
];

export default function StudioFolio() {
  // --- STATE ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorStyle, setCursorStyle] = useState('default'); // 'default', 'play', 'talk'
  const [activeProject, setActiveProject] = useState(null);

  // --- MOUSE TRACKING ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // --- PARALLAX IMAGE COMPONENT ---
  const ParallaxImage = ({ project }) => {
    const cardRef = useRef(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setOffset({ x: x * 30, y: y * 30 }); // Max 30px shift
    };

    return (
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setOffset({ x: 0, y: 0 })}
        className="relative aspect-[4/5] overflow-hidden bg-white/5 mb-6"
      >
        <img 
          src={project.image} 
          alt={project.title} 
          style={{ transform: `scale(1.15) translate(${offset.x}px, ${offset.y}px)` }}
          className="w-full h-full object-cover transition-transform duration-200 ease-out grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-700"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans cursor-default selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* --- INJECT CUSTOM CSS FOR MARQUEE --- */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-block; white-space: nowrap; animation: marquee 25s linear infinite; }
      `}</style>

      {/* --- CONTEXTUAL CUSTOM CURSOR --- */}
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference flex items-center justify-center transition-all duration-300 ease-out"
        style={{ 
          transform: `translate(${mousePos.x}px, ${mousePos.y}px) translate(-50%, -50%)`,
          width: cursorStyle !== 'default' ? '80px' : '24px',
          height: cursorStyle !== 'default' ? '80px' : '24px',
          backgroundColor: cursorStyle !== 'default' ? 'white' : 'transparent',
          border: cursorStyle !== 'default' ? 'none' : '2px solid white',
          borderRadius: '50%'
        }}
      >
        {cursorStyle === 'play' && <span className="text-black text-[10px] font-bold tracking-widest uppercase ml-1">Play</span>}
        {cursorStyle === 'talk' && <span className="text-black text-[10px] font-bold tracking-widest uppercase">Talk</span>}
      </div>

      {/* --- FULLSCREEN VIDEO MODAL --- */}
      {activeProject && (
        <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in duration-500">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 text-white absolute w-full top-0 z-10">
            <div className="font-mono text-sm tracking-widest uppercase opacity-70">Now Playing: {activeProject.title}</div>
            <button 
              onClick={() => { setActiveProject(null); setCursorStyle('default'); }}
              onMouseEnter={() => setCursorStyle('default')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Simulated Video Player */}
          <div className="flex-1 flex items-center justify-center p-6 md:p-20 relative group">
            <img src={activeProject.image} alt="Video Thumbnail" className="w-full h-full object-cover rounded-2xl md:rounded-3xl shadow-2xl opacity-80" />
            
            <button className="absolute bg-white/10 hover:bg-white/30 backdrop-blur-lg border border-white/20 text-white w-24 h-24 rounded-full flex items-center justify-center transition-all scale-100 group-hover:scale-110">
              <Play size={32} fill="white" className="ml-2" />
            </button>

            {/* Simulated Player Controls */}
            <div className="absolute bottom-10 md:bottom-28 left-10 md:left-28 right-10 md:right-28 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play size={16} fill="white" />
              <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-[#00e5ff]"></div>
              </div>
              <span className="font-mono text-xs">00:00 / {activeProject.duration}</span>
              <Volume2 size={16} />
              <Maximize size={16} />
            </div>
          </div>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full top-0 z-40 mix-blend-difference">
        <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center text-white">
          <div className="text-xl font-bold tracking-tighter uppercase cursor-none">Studio<br/>Folio</div>
          <div className="hidden md:flex gap-12 text-sm font-medium tracking-widest uppercase cursor-none">
            <a href="#" className="hover:text-gray-400 transition-colors">Work</a>
            <a href="#" className="hover:text-gray-400 transition-colors">About</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Contact</a>
          </div>
          <button className="text-sm font-medium tracking-widest uppercase border-b border-transparent hover:border-white transition-colors pb-1 cursor-none">
            Menu
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex flex-col justify-end pb-20 px-6 max-w-7xl mx-auto">
        <div className="z-10 animate-in slide-in-from-bottom-10 fade-in duration-1000">
          <h1 className="text-[14vw] md:text-[9vw] font-bold leading-[0.85] tracking-tighter uppercase text-white hover:italic transition-all duration-700">
            Visual <br />
            <span className="text-transparent border-text" style={{ WebkitTextStroke: '2px white' }}>Storyteller.</span>
          </h1>
          <div className="mt-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-end w-full max-w-4xl">
            <p className="text-gray-400 max-w-sm text-lg md:text-xl font-light leading-relaxed">
              Directing motion, shaping light, and crafting narratives for visionary brands worldwide.
            </p>
            <div className="flex items-center gap-4 text-sm font-medium tracking-widest uppercase animate-pulse">
              <span className="w-12 h-[1px] bg-[#00e5ff]"></span>
              Scroll to explore
            </div>
          </div>
        </div>
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] opacity-20 blur-3xl rounded-full bg-gradient-to-tr from-gray-600 to-[#8b5cf6] -z-10 animate-pulse duration-[10000ms]"></div>
      </section>

      {/* --- INFINITE SCROLLING MARQUEE --- */}
      <div className="w-full bg-white text-black py-4 overflow-hidden border-y border-white/20 flex rotate-1 origin-left mt-10">
        <div className="animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-3xl md:text-5xl font-black tracking-tighter uppercase mx-8 inline-flex items-center gap-8">
              Motion Graphics <Play fill="black" size={24}/> Videography <Play fill="black" size={24}/> Creative Direction <Play fill="black" size={24}/>
            </span>
          ))}
        </div>
      </div>

      {/* --- SELECTED WORKS GRID --- */}
      <section className="px-6 py-32 max-w-7xl mx-auto -mt-10">
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Selected Works</h2>
          <span className="text-gray-500 font-mono tracking-widest text-sm">(2025 — 2026)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-20">
          {PROJECTS.map((project, index) => (
            <div 
              key={project.id} 
              className={`group cursor-none ${index % 2 !== 0 ? 'md:mt-32' : ''}`}
              onMouseEnter={() => setCursorStyle('play')}
              onMouseLeave={() => setCursorStyle('default')}
              onClick={() => { setActiveProject(project); setCursorStyle('default'); }}
            >
              {/* Animated Parallax Image */}
              <ParallaxImage project={project} />

              {/* Project Meta */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">{project.title}</h3>
                  <p className="text-[#00e5ff] font-mono text-sm tracking-widest uppercase">{project.category}</p>
                </div>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="font-mono text-white/50 text-sm group-hover:-translate-y-full transition-transform duration-300">{project.year}</span>
                  <ArrowUpRight className="text-white absolute translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <footer className="px-6 py-32 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex flex-col items-center text-center">
          <h2 
            className="text-6xl md:text-[8rem] font-bold tracking-tighter text-white mb-8 hover:italic transition-all duration-500 cursor-none" 
            onMouseEnter={() => setCursorStyle('talk')} 
            onMouseLeave={() => setCursorStyle('default')}
          >
            Let's Talk.
          </h2>
          <button className="flex items-center gap-4 text-xl md:text-2xl font-medium tracking-tight border-b-2 border-white pb-2 hover:text-[#00e5ff] hover:border-[#00e5ff] transition-colors cursor-none">
            hello@studiofolio.com <MoveRight />
          </button>
          
          <div className="flex gap-8 mt-24 text-gray-500 font-mono text-sm tracking-widest uppercase">
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Instagram size={16}/> IG</a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Twitter size={16}/> TW</a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Mail size={16}/> EM</a>
          </div>
        </div>
      </footer>

    </div>
  );
}