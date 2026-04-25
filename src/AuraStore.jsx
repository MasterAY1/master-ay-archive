import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Float, 
  MeshTransmissionMaterial, 
  ContactShadows,
  Sparkles
} from '@react-three/drei';
import { ShoppingBag, Menu, ArrowRight, Play, Star } from 'lucide-react';

// --- 3D COMPONENTS ---

function AuraCrystal() {
  const crystalRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (crystalRef.current) {
        crystalRef.current.rotation.y = t * 0.2;
        crystalRef.current.rotation.x = t * 0.1;
    }
    if (innerRef.current) {
        innerRef.current.rotation.y = -t * 0.5;
        innerRef.current.rotation.z = t * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      {/* Outer Premium Glass Shell */}
      <mesh ref={crystalRef} castShadow>
        <octahedronGeometry args={[2.5, 0]} />
        <MeshTransmissionMaterial 
          backside 
          resolution={1024} 
          thickness={0.8} 
          roughness={0.05} 
          transmission={1} 
          ior={1.2} 
          chromaticAberration={0.8} 
          color="#e0e7ff" 
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial 
          color="#00e5ff" 
          emissive="#8b5cf6" 
          emissiveIntensity={2} 
          wireframe 
        />
      </mesh>
      
      {/* Decorative Particles */}
      <Sparkles count={50} scale={6} size={2} speed={0.4} color="#00ff88" />
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#8b5cf6" />
      
      <AuraCrystal />
      
      <ContactShadows 
        position={[0, -3.5, 0]} 
        opacity={0.6} 
        scale={20} 
        blur={2.5} 
        far={4} 
      />
      <Environment preset="city" />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        maxPolarAngle={Math.PI / 2} 
        minPolarAngle={Math.PI / 2.5} 
      />
    </>
  );
}

// --- UI COMPONENTS ---

export default function AuraStore() { 
  // ... the rest of the code{
  const [cartCount, setCartCount] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setCartCount(prev => prev + 1);
      setIsAdding(false);
    }, 800);
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-[#00e5ff] selection:text-black">
      
      {/* WebGL Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className={`absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-12 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Navigation */}
        <nav className="flex justify-between items-center pointer-events-auto">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00e5ff] to-[#8b5cf6] flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
            AURA
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Products</a>
            <a href="#" className="hover:text-white transition-colors">Technology</a>
            <a href="#" className="hover:text-white transition-colors">Studio</a>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative hover:text-[#00e5ff] transition-colors group">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff3366] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden">
              <Menu size={24} />
            </button>
          </div>
        </nav>

        {/* Main Content Layout */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 items-center mt-12 md:mt-0">
          
          <div className="flex flex-col gap-6 max-w-xl pointer-events-auto z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md">
              <Star size={14} className="text-[#eab308] fill-[#eab308]" />
              <span className="text-xs font-bold tracking-wide uppercase text-gray-200">Award-Winning Design</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
              Spatial <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#8b5cf6]">
                Presence.
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-md">
              Experience the next evolution of immersive sound. The Aura Crystal utilizes quantum resonance to map audio directly to your environment.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mt-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 line-through font-mono">$499</span>
                <span className="text-4xl font-bold">$299</span>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <span className="relative z-10">{isAdding ? 'Authenticating...' : 'Add to Cart'}</span>
                <ArrowRight size={18} className={`relative z-10 transition-transform ${isAdding ? 'translate-x-10 opacity-0' : 'group-hover:translate-x-1'}`} />
                <div className="absolute inset-0 bg-gradient-to-r from-[#00e5ff] to-[#8b5cf6] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ease-out duration-300"></div>
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-end items-end h-full pb-12 pointer-events-auto">
            <div className="bg-black/20 p-6 rounded-2xl w-72 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00e5ff] to-[#8b5cf6]"></div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                <Play size={16} className="text-[#00e5ff]" />
                Tech Specs
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Material</span>
                  <span className="text-white font-medium">Quantum Glass</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Battery</span>
                  <span className="text-white font-medium">48 Hours</span>
                </li>
                <li className="flex justify-between">
                  <span>Latency</span>
                  <span className="text-[#00ff88] font-bold">Zero</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
        
        <div className="flex justify-between items-end pointer-events-auto mt-8 md:mt-0">
          <div className="text-[10px] md:text-xs text-gray-500 font-mono tracking-widest">
            // MASTER_AY_FRONTEND_ARCHIVE
          </div>
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono font-bold tracking-widest text-[#00e5ff] animate-pulse bg-[#00e5ff]/10 px-3 py-1.5 rounded-full border border-[#00e5ff]/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 9l4-4 4 4M9 5v14"/>
              <path d="M19 15l-4 4-4-4M15 19V5"/>
            </svg>
            DRAG TO ROTATE
          </div>
        </div>

      </div>
    </div>
  );
}