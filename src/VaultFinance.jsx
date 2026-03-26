import React, { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Send, Plus, 
  RefreshCw, Bell, Search, LayoutGrid, PieChart, 
  Activity, Settings, CreditCard, ChevronDown, 
  MoreHorizontal, Wallet
} from 'lucide-react';

// --- CROSS-ASSET MOCK DATA ---
const PORTFOLIO_ASSETS = [
  { id: '1', name: 'EUR/USD', type: 'Forex', balance: '€12,500.00', value: '$13,625.00', change: '+0.45%', isUp: true, color: 'text-blue-400' },
  { id: '2', name: 'S&P 500 (SPY)', type: 'Index', balance: '24.5 Shares', value: '$12,345.50', change: '+1.20%', isUp: true, color: 'text-purple-400' },
  { id: '3', name: 'Bitcoin (BTC)', type: 'Crypto', balance: '0.1542 BTC', value: '$10,124.80', change: '-2.15%', isUp: false, color: 'text-orange-400' },
  { id: '4', name: 'Tesla (TSLA)', type: 'Equity', balance: '45 Shares', value: '$7,850.25', change: '+4.30%', isUp: true, color: 'text-red-400' },
];

const RECENT_TRANSACTIONS = [
  { id: 1, title: "Bought TSLA", category: "Market Order", amount: "-$2,450.00", date: "Today, 09:41 AM", icon: <Activity size={16} /> },
  { id: 2, title: "EUR/USD Swap", category: "Forex Execution", amount: "+$415.20", date: "Yesterday, 14:20 PM", icon: <RefreshCw size={16} /> },
  { id: 3, title: "Wire Transfer", category: "Deposit", amount: "+$5,000.00", date: "Oct 22, 10:00 AM", icon: <Plus size={16} /> },
  { id: 4, title: "BTC Network Fee", category: "Withdrawal", amount: "-$12.45", date: "Oct 20, 18:45 PM", icon: <Send size={16} /> },
];

export default function VaultFinance() {
  const [timeframe, setTimeframe] = useState('1W');

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans flex selection:bg-emerald-500/30">
      
      {/* --- SIDEBAR (Stripe-style Minimalist) --- */}
      <aside className="w-20 lg:w-64 border-r border-[#1e1e20] bg-[#050505] flex flex-col justify-between z-20 hidden md:flex">
        <div>
          <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-[#1e1e20]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Wallet className="text-black" size={18} strokeWidth={2.5} />
            </div>
            <span className="hidden lg:block ml-3 font-bold text-xl tracking-tight text-white">Vault.</span>
          </div>
          
          <nav className="p-4 space-y-2 mt-4">
            <NavItem icon={<LayoutGrid size={20} />} label="Dashboard" active />
            <NavItem icon={<PieChart size={20} />} label="Portfolio" />
            <NavItem icon={<RefreshCw size={20} />} label="Trading" />
            <NavItem icon={<CreditCard size={20} />} label="Cards" />
          </nav>
        </div>
        
        <div className="p-4 border-t border-[#1e1e20]">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <div className="mt-4 flex items-center justify-center lg:justify-start lg:px-4 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#1e1e20] border border-[#27272a] flex items-center justify-center font-bold text-xs">AA</div>
            <div className="hidden lg:block ml-3">
              <p className="text-sm font-medium text-white">Pro Trader</p>
              <p className="text-xs text-gray-500">Tier 2 Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN DASHBOARD --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-20 border-b border-[#1e1e20] bg-[#050505]/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white hidden sm:block">Overview</h1>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="bg-[#0a0a0b] border border-[#27272a] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors w-64 text-white"
              />
            </div>
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#000]"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* HERO: Balance & SVG Chart */}
            <div className="bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">Total Equity</p>
                  <div className="flex items-end gap-4">
                    <h2 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter">$43,945.55</h2>
                    <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg text-sm font-bold mb-2">
                      <ArrowUpRight size={16} className="mr-1" /> +2.4%
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <ActionButton icon={<Plus size={16} />} label="Deposit" primary />
                  <ActionButton icon={<Send size={16} />} label="Transfer" />
                  <ActionButton icon={<RefreshCw size={16} />} label="Trade" />
                </div>
              </div>

              {/* High-End SVG Bezier Curve Chart */}
              <div className="h-48 w-full relative group mt-10 border-b border-[#1e1e20] pb-2">
                <div className="absolute top-0 right-0 flex bg-[#1e1e20]/50 rounded-lg p-1 z-10 backdrop-blur-sm">
                  {['1D', '1W', '1M', '1Y', 'ALL'].map(tf => (
                    <button 
                      key={tf} onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeframe === tf ? 'bg-[#27272a] text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
                
                {/* SVG Graph rendering */}
                <svg viewBox="0 0 1000 200" className="w-full h-full preserve-3d drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {/* Fill */}
                  <path d="M0 150 Q 150 180, 250 120 T 500 80 T 750 100 T 1000 30 L 1000 200 L 0 200 Z" fill="url(#chartGradient)" className="transition-all duration-1000 ease-in-out" />
                  {/* Stroke */}
                  <path d="M0 150 Q 150 180, 250 120 T 500 80 T 750 100 T 1000 30" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-1000 ease-in-out" />
                  
                  {/* Interactive Graph Tooltip Point */}
                  <circle cx="1000" cy="30" r="6" fill="#000" stroke="#10b981" strokeWidth="3" className="animate-pulse" />
                </svg>
              </div>
            </div>

            {/* BENTO GRID: Portfolio & Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Assets Breakdown */}
              <div className="xl:col-span-2 bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Open Positions</h3>
                  <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                    View All <ArrowUpRight size={14} />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {PORTFOLIO_ASSETS.map((asset) => (
                    <div key={asset.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-[#121214] border border-transparent hover:border-[#1e1e20] transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full bg-[#1e1e20] flex items-center justify-center font-bold text-sm ${asset.color}`}>
                          {asset.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{asset.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{asset.type} • {asset.balance}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-white">{asset.value}</p>
                        <p className={`text-xs font-bold ${asset.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                          {asset.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-8">
                <h3 className="text-lg font-bold text-white mb-6">Recent History</h3>
                <div className="space-y-6">
                  {RECENT_TRANSACTIONS.map((tx) => (
                    <div key={tx.id} className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 bg-[#1e1e20] rounded-lg text-gray-400">
                          {tx.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{tx.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{tx.category}</p>
                          <p className="text-[10px] text-gray-600 mt-1">{tx.date}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${tx.amount.includes('+') ? 'text-emerald-400' : 'text-white'}`}>
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 border border-[#1e1e20] text-gray-300 text-sm font-bold rounded-xl hover:bg-[#1e1e20] hover:text-white transition-colors">
                  View Statements
                </button>
              </div>

            </div>
          </div>
        </div>

      </main>

      {/* Global Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({ icon, label, active }) {
  return (
    <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
      active ? 'bg-[#1e1e20] text-white shadow-sm' : 'text-gray-500 hover:bg-[#121214] hover:text-white'
    }`}>
      <div className={`${active ? 'text-emerald-400' : 'group-hover:text-emerald-400 transition-colors'}`}>
        {icon}
      </div>
      <span className="hidden lg:block text-sm font-semibold">{label}</span>
    </button>
  );
}

function ActionButton({ icon, label, primary }) {
  return (
    <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 ${
      primary 
        ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_4px_14px_rgba(16,185,129,0.3)]' 
        : 'bg-[#1e1e20] text-white hover:bg-[#27272a] border border-[#27272a]'
    }`}>
      {icon} {label}
    </button>
  );
}