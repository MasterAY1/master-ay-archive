import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, PieChart, Settings, Bell, Search, 
  Plus, MoreHorizontal, Mail, Phone, Calendar, Building, X,
  GripVertical, ArrowUpRight
} from 'lucide-react';

// --- MOCK CRM DATA ---
const INITIAL_DEALS = [
  { id: 1, company: "Quantum Dynamics", contact: "Sarah Jenkins", value: "$45,000", status: "Lead", date: "Oct 24", color: "bg-blue-500" },
  { id: 2, company: "Nebula Systems", contact: "Marcus Chen", value: "$120,000", status: "Negotiation", date: "Oct 22", color: "bg-purple-500" },
  { id: 3, company: "Horizon Ventures", contact: "Elena Rostova", value: "$85,000", status: "Contacted", date: "Oct 20", color: "bg-orange-500" },
  { id: 4, company: "Apex Corp", contact: "David Wright", value: "$32,000", status: "Lead", date: "Oct 25", color: "bg-blue-500" },
  { id: 5, company: "Starlight Inc", contact: "Julia Styles", value: "$210,000", status: "Won", date: "Oct 18", color: "bg-green-500" },
];

const COLUMNS = ["Lead", "Contacted", "Negotiation", "Won"];

export default function CrmDashboard() {
  const [activeDeal, setActiveDeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 font-sans flex overflow-hidden selection:bg-purple-500/30">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <nav className="w-20 md:w-64 border-r border-white/5 bg-[#111113] flex flex-col justify-between transition-all duration-300">
        <div>
          <div className="h-20 flex items-center justify-center md:justify-start md:px-8 border-b border-white/5">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">V</div>
            <span className="hidden md:block ml-3 font-display font-bold text-lg tracking-wide text-white">Velocity</span>
          </div>
          
          <div className="p-4 space-y-2 mt-4">
            <NavItem icon={<LayoutDashboard size={20} />} label="Pipeline" active />
            <NavItem icon={<Users size={20} />} label="Contacts" />
            <NavItem icon={<PieChart size={20} />} label="Reports" />
          </div>
        </div>
        
        <div className="p-4 border-t border-white/5 space-y-2">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <div className="mt-4 flex items-center justify-center md:justify-start md:px-4 cursor-pointer hover:opacity-80 transition-opacity">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="w-8 h-8 rounded-full border border-white/10" />
            <div className="hidden md:block ml-3">
              <p className="text-sm font-medium text-white">Ayomide A.</p>
              <p className="text-xs text-gray-500">Sales Lead</p>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-[#0a0a0b]/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <h1 className="text-2xl font-bold text-white">Sales Pipeline</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search deals..." 
                className="bg-[#111113] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors w-64 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
              <Plus size={16} /> New Deal
            </button>
          </div>
        </header>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
          <div className="flex gap-6 h-full min-w-max pb-4">
            {COLUMNS.map(column => (
              <div key={column} className="w-80 flex flex-col h-full">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-medium text-gray-400 uppercase tracking-wider text-xs">{column}</h3>
                  <span className="bg-white/5 text-gray-400 text-xs px-2 py-1 rounded-md font-mono">
                    {INITIAL_DEALS.filter(d => d.status === column).length}
                  </span>
                </div>

                {/* Column Drop Zone */}
                <div className="flex-1 bg-[#111113]/50 rounded-2xl border border-white/5 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                  {INITIAL_DEALS
                    .filter(deal => deal.status === column)
                    .map(deal => (
                      <DealCard 
                        key={deal.id} 
                        deal={deal} 
                        onClick={() => setActiveDeal(deal)} 
                      />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- SLIDE-OVER PANEL (INTERACTION DESIGN) --- */}
        {activeDeal && (
          <div className="absolute inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer animate-in fade-in duration-300"
              onClick={() => setActiveDeal(null)}
            ></div>
            
            {/* Panel */}
            <div className="relative w-full md:w-[480px] bg-[#111113] border-l border-white/10 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${activeDeal.color}`}></div>
                  <h2 className="text-xl font-bold text-white">Deal Details</h2>
                </div>
                <button onClick={() => setActiveDeal(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{activeDeal.company}</h1>
                    <p className="text-gray-400 flex items-center gap-2">
                      <Building size={14} /> SaaS Platform Migration
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-light text-white">{activeDeal.value}</p>
                    <p className="text-xs font-mono text-purple-400 uppercase tracking-widest">{activeDeal.status}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <button className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all hover:-translate-y-1">
                    <Mail size={18} className="text-gray-400 mb-2" />
                    <span className="text-xs font-medium text-gray-300">Email</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all hover:-translate-y-1">
                    <Phone size={18} className="text-gray-400 mb-2" />
                    <span className="text-xs font-medium text-gray-300">Call</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all hover:-translate-y-1">
                    <Calendar size={18} className="text-gray-400 mb-2" />
                    <span className="text-xs font-medium text-gray-300">Meeting</span>
                  </button>
                </div>

                {/* Contact Info */}
                <div className="bg-[#0a0a0b] rounded-xl p-5 border border-white/5 mb-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Primary Contact</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-lg font-bold text-gray-400">
                      {activeDeal.contact.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{activeDeal.contact}</p>
                      <p className="text-sm text-gray-500">VP of Operations</p>
                    </div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 mt-8">Recent Activity</h3>
                  <div className="space-y-4 border-l border-white/10 ml-2 pl-4">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-purple-500 rounded-full ring-4 ring-[#111113]"></div>
                      <p className="text-sm text-white">Moved to {activeDeal.status}</p>
                      <p className="text-xs text-gray-500 mt-1">Today at 10:42 AM</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-gray-600 rounded-full ring-4 ring-[#111113]"></div>
                      <p className="text-sm text-gray-300">Intro call completed</p>
                      <p className="text-xs text-gray-500 mt-1">Oct 20 at 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-white/5 bg-[#111113]">
                <button className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                  Advance Deal Stage
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
      
      {/* Custom Scrollbar Styles for the UI */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({ icon, label, active }) {
  return (
    <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
      active ? 'bg-white/10 text-white' : 'text-gray-500 hover:bg-white/5 hover:text-white'
    }`}>
      <div className={`${active ? 'text-purple-400' : 'group-hover:text-purple-400 transition-colors'}`}>
        {icon}
      </div>
      <span className="hidden md:block text-sm font-medium">{label}</span>
    </button>
  );
}

function DealCard({ deal, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-[#1a1a1c] border border-white/5 p-4 rounded-xl cursor-pointer hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all group relative overflow-hidden"
    >
      {/* Decorative top color bar */}
      <div className={`absolute top-0 left-0 w-full h-1 ${deal.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
      
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
          {deal.company}
          <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
        </h4>
        <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      <div className="text-2xl font-light text-white mb-4">{deal.value}</div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-300 border border-white/10">
            {deal.contact.charAt(0)}
          </div>
          <span>{deal.contact}</span>
        </div>
        <div className="flex items-center gap-1 group-hover:text-gray-400 transition-colors">
          <GripVertical size={12} className="opacity-30" />
          {deal.date}
        </div>
      </div>
    </div>
  );
}