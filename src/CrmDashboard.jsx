import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, PieChart, Settings, Bell, Search, 
  Plus, MoreHorizontal, Mail, Phone, Calendar, Building, X,
  GripVertical, ArrowUpRight, TrendingUp, CheckSquare, Shield,
  UserCircle, Target, Briefcase
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_DEALS = [
  { id: 1, company: "Quantum Dynamics", contact: "Sarah Jenkins", value: "$45,000", status: "Lead", date: "Oct 24", color: "bg-blue-500" },
  { id: 2, company: "Nebula Systems", contact: "Marcus Chen", value: "$120,000", status: "Negotiation", date: "Oct 22", color: "bg-purple-500" },
  { id: 3, company: "Horizon Ventures", contact: "Elena Rostova", value: "$85,000", status: "Contacted", date: "Oct 20", color: "bg-orange-500" },
  { id: 4, company: "Apex Corp", contact: "David Wright", value: "$32,000", status: "Lead", date: "Oct 25", color: "bg-blue-500" },
  { id: 5, company: "Starlight Inc", contact: "Julia Styles", value: "$210,000", status: "Won", date: "Oct 18", color: "bg-green-500" },
];

const CONTACTS = [
  { id: 1, name: "Sarah Jenkins", role: "CTO", company: "Quantum Dynamics", email: "sarah@quantum.io", status: "Active" },
  { id: 2, name: "Marcus Chen", role: "VP Sales", company: "Nebula Systems", email: "m.chen@nebula.com", status: "Pending" },
  { id: 3, name: "Elena Rostova", role: "Director", company: "Horizon Ventures", email: "elena.r@horizon.vc", status: "Active" },
  { id: 4, name: "David Wright", role: "Founder", company: "Apex Corp", email: "david@apex.co", status: "Inactive" },
  { id: 5, name: "Julia Styles", role: "CEO", company: "Starlight Inc", email: "julia@starlight.inc", status: "Active" },
];

const COLUMNS = ["Lead", "Contacted", "Negotiation", "Won"];

export default function CrmDashboard() {
  const [activeDeal, setActiveDeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  // ✨ NEW: State to manage active sidebar view
  const [currentView, setCurrentView] = useState('pipeline'); 

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 font-sans flex overflow-hidden selection:bg-purple-500/30">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <nav className="w-20 md:w-64 border-r border-white/5 bg-[#111113] flex flex-col justify-between transition-all duration-300 z-20">
        <div>
          <div className="h-20 flex items-center justify-center md:justify-start md:px-8 border-b border-white/5 cursor-pointer" onClick={() => setCurrentView('pipeline')}>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">V</div>
            <span className="hidden md:block ml-3 font-display font-bold text-lg tracking-wide text-white">Velocity</span>
          </div>
          
          <div className="p-4 space-y-2 mt-4">
            <NavItem icon={<LayoutDashboard size={20} />} label="Pipeline" active={currentView === 'pipeline'} onClick={() => setCurrentView('pipeline')} />
            <NavItem icon={<Users size={20} />} label="Contacts" active={currentView === 'contacts'} onClick={() => setCurrentView('contacts')} />
            <NavItem icon={<PieChart size={20} />} label="Reports" active={currentView === 'reports'} onClick={() => setCurrentView('reports')} />
          </div>
        </div>
        
        <div className="p-4 border-t border-white/5 space-y-2">
          <NavItem icon={<Settings size={20} />} label="Settings" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
          
          {/* Profile Quick Link */}
          <div 
            onClick={() => setCurrentView('profile')}
            className={`mt-4 flex items-center justify-center md:justify-start md:px-4 cursor-pointer p-2 rounded-xl transition-all ${currentView === 'profile' ? 'bg-white/10' : 'hover:bg-white/5'}`}
          >
            <div className="w-8 h-8 rounded-full border border-white/10 bg-gradient-to-tr from-purple-900 to-blue-900 flex items-center justify-center text-white font-bold text-xs">
              AA
            </div>
            <div className="hidden md:block ml-3">
              <p className="text-sm font-medium text-white">Ayomide A.</p>
              <p className="text-xs text-gray-500">Sales Lead</p>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header (Shared across all views) */}
        <header className="h-20 border-b border-white/5 bg-[#0a0a0b]/80 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          <h1 className="text-2xl font-bold text-white capitalize">{currentView}</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-[#111113] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors w-64 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            </button>
            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
              <Plus size={16} /> Create New
            </button>
          </div>
        </header>

        {/* --- DYNAMIC VIEW ROUTER --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          
          {/* VIEW: PIPELINE (Kanban) */}
          {currentView === 'pipeline' && (
            <div className="absolute inset-0 p-8 overflow-x-auto">
              <div className="flex gap-6 h-full min-w-max pb-4">
                {COLUMNS.map(column => (
                  <div key={column} className="w-80 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="font-medium text-gray-400 uppercase tracking-wider text-xs">{column}</h3>
                      <span className="bg-white/5 text-gray-400 text-xs px-2 py-1 rounded-md font-mono">
                        {INITIAL_DEALS.filter(d => d.status === column).length}
                      </span>
                    </div>
                    <div className="flex-1 bg-[#111113]/50 rounded-2xl border border-white/5 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                      {INITIAL_DEALS.filter(deal => deal.status === column).map(deal => (
                          <DealCard key={deal.id} deal={deal} onClick={() => setActiveDeal(deal)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: CONTACTS (Data Table) */}
          {currentView === 'contacts' && (
            <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-[#1a1a1c]">
                      <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                      <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONTACTS.map((contact, i) => (
                      <tr key={contact.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold">{contact.name.charAt(0)}</div>
                            <div>
                              <p className="text-white font-medium">{contact.name}</p>
                              <p className="text-xs text-gray-500">{contact.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 flex items-center gap-2"><Building size={14} className="text-gray-500"/>{contact.company}</td>
                        <td className="p-4 text-gray-400">{contact.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            contact.status === 'Active' ? 'bg-green-500/10 text-green-400' : 
                            contact.status === 'Pending' ? 'bg-orange-500/10 text-orange-400' : 
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {contact.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: REPORTS (Analytics) */}
          {currentView === 'reports' && (
            <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Revenue" value="$492,000" trend="+12.5%" icon={<TrendingUp size={20} className="text-green-400"/>} />
                <StatCard title="Active Deals" value="24" trend="+4" icon={<Briefcase size={20} className="text-purple-400"/>} />
                <StatCard title="Win Rate" value="68%" trend="+2.1%" icon={<Target size={20} className="text-blue-400"/>} />
              </div>
              
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 h-80 flex flex-col justify-end relative">
                <h3 className="absolute top-6 left-6 font-bold text-white">Revenue Forecast (Q4)</h3>
                <div className="flex items-end gap-4 h-48 w-full mt-auto border-b border-white/10 pb-4">
                  {/* CSS-based Bar Chart */}
                  <div className="flex-1 bg-purple-500/20 hover:bg-purple-500/40 transition-colors rounded-t-sm h-[40%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">$40k</span></div>
                  <div className="flex-1 bg-purple-500/40 hover:bg-purple-500/60 transition-colors rounded-t-sm h-[60%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">$60k</span></div>
                  <div className="flex-1 bg-purple-500/60 hover:bg-purple-500/80 transition-colors rounded-t-sm h-[35%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">$35k</span></div>
                  <div className="flex-1 bg-purple-500 hover:bg-purple-400 transition-colors rounded-t-sm h-[90%] relative group shadow-[0_0_20px_rgba(168,85,247,0.4)]"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">$90k</span></div>
                  <div className="flex-1 bg-purple-500/30 hover:bg-purple-500/50 transition-colors rounded-t-sm h-[50%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">$50k</span></div>
                </div>
                <div className="flex justify-between w-full text-xs text-gray-500 mt-2 font-mono">
                  <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span><span>Week 5</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {currentView === 'settings' && (
            <div className="p-8 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Shield size={20} className="text-purple-400"/> Security & Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-white/5">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Secure your account with an extra layer of security.</p>
                    </div>
                    <div className="w-12 h-6 bg-purple-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-white/5">
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive daily summaries of your pipeline activity.</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Workspace Name</label>
                    <input type="text" defaultValue="Velocity Global Sales" className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
                  </div>
                  <button className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PROFILE */}
          {currentView === 'profile' && (
            <div className="p-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-900/50 to-blue-900/50"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start mt-12">
                  <div className="w-32 h-32 rounded-full border-4 border-[#111113] bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                    AA
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-1">Ayomide Adenuga</h1>
                    <p className="text-purple-400 font-mono tracking-widest text-sm uppercase mb-4">Senior Sales Engineer</p>
                    <p className="text-gray-400 max-w-lg leading-relaxed mb-6">
                      Specializing in B2B SaaS architecture and enterprise-grade software solutions. Bridging the gap between UI/UX interaction design and robust React.js frontend development.
                    </p>
                    
                    <div className="flex gap-4">
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/5 flex items-center gap-2">
                        <Mail size={16}/> Edit Profile
                      </button>
                      <button className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/5 relative z-10">
                  <div className="p-4 bg-black/20 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Q3 Target Reached</p>
                    <p className="text-2xl font-bold text-green-400">114%</p>
                  </div>
                  <div className="p-4 bg-black/20 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Deals Closed (YTD)</p>
                    <p className="text-2xl font-bold text-white">42</p>
                  </div>
                  <div className="p-4 bg-black/20 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Avg. Cycle Time</p>
                    <p className="text-2xl font-bold text-white">18 Days</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* --- SLIDE-OVER PANEL (For Pipeline Deals) --- */}
        {activeDeal && (
          <div className="absolute inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer animate-in fade-in duration-300" onClick={() => setActiveDeal(null)}></div>
            <div className="relative w-full md:w-[480px] bg-[#111113] border-l border-white/10 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${activeDeal.color}`}></div>
                  <h2 className="text-xl font-bold text-white">Deal Details</h2>
                </div>
                <button onClick={() => setActiveDeal(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"><X size={18} /></button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{activeDeal.company}</h1>
                    <p className="text-gray-400 flex items-center gap-2"><Building size={14} /> SaaS Platform Migration</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-light text-white">{activeDeal.value}</p>
                    <p className="text-xs font-mono text-purple-400 uppercase tracking-widest">{activeDeal.status}</p>
                  </div>
                </div>

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

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
      active ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:bg-white/5 hover:text-white'
    }`}>
      <div className={`${active ? 'text-purple-400' : 'group-hover:text-purple-400 transition-colors'}`}>
        {icon}
      </div>
      <span className="hidden md:block text-sm font-medium">{label}</span>
    </button>
  );
}

function StatCard({ title, value, trend, icon }) {
  return (
    <div className="bg-[#111113] border border-white/5 p-6 rounded-2xl flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <h4 className="text-gray-400 text-sm font-medium mb-1">{title}</h4>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function DealCard({ deal, onClick }) {
  return (
    <div onClick={onClick} className="bg-[#1a1a1c] border border-white/5 p-4 rounded-xl cursor-pointer hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all group relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 ${deal.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
          {deal.company}
          <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
        </h4>
        <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal size={16} /></button>
      </div>
      <div className="text-2xl font-light text-white mb-4">{deal.value}</div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-300 border border-white/10">{deal.contact.charAt(0)}</div>
          <span>{deal.contact}</span>
        </div>
        <div className="flex items-center gap-1 group-hover:text-gray-400 transition-colors"><GripVertical size={12} className="opacity-30" />{deal.date}</div>
      </div>
    </div>
  );
}