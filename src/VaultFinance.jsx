import React, { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Send, Plus, 
  RefreshCw, Bell, Search, LayoutGrid, PieChart, 
  Activity, Settings, CreditCard, Wallet, X
} from 'lucide-react';

// --- INITIAL STATE DATA ---
const INITIAL_ASSETS = [
  { id: '1', name: 'EUR/USD', type: 'Forex', balance: 12500, value: 13625.00, change: '+0.45%', isUp: true, color: 'text-blue-400', ticker: 'EUR' },
  { id: '2', name: 'S&P 500 (SPY)', type: 'Index', balance: 24.5, value: 12345.50, change: '+1.20%', isUp: true, color: 'text-purple-400', ticker: 'SPY' },
  { id: '3', name: 'Bitcoin (BTC)', type: 'Crypto', balance: 0.1542, value: 10124.80, change: '-2.15%', isUp: false, color: 'text-orange-400', ticker: 'BTC' },
  { id: '4', name: 'Tesla (TSLA)', type: 'Equity', balance: 45, value: 7850.25, change: '+4.30%', isUp: true, color: 'text-red-400', ticker: 'TSLA' },
];

const INITIAL_TRANSACTIONS = [
  { id: 1, title: "Bought TSLA", category: "Market Order", amount: -2450.00, date: "Today, 09:41 AM", icon: <Activity size={16} /> },
  { id: 2, title: "EUR/USD Swap", category: "Forex Execution", amount: +415.20, date: "Yesterday, 14:20 PM", icon: <RefreshCw size={16} /> },
];

export default function VaultFinance() {
  const [timeframe, setTimeframe] = useState('1W');
  
  // --- APPLICATION STATE (THE ENGINE) ---
  const [buyingPower, setBuyingPower] = useState(25000.00);
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  
  // Modal State
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [tradeAction, setTradeAction] = useState('Buy'); // 'Buy' or 'Sell'
  const [selectedAsset, setSelectedAsset] = useState(INITIAL_ASSETS[0]);
  const [tradeAmount, setTradeAmount] = useState('');

  // Calculate Total Equity dynamically based on state
  const totalEquity = buyingPower + assets.reduce((sum, asset) => sum + asset.value, 0);

  // --- THE TRADE LOGIC ---
  const handleExecuteTrade = (e) => {
    e.preventDefault();
    const amount = parseFloat(tradeAmount);
    
    if (isNaN(amount) || amount <= 0) return alert("Please enter a valid amount");

    if (tradeAction === 'Buy') {
      if (amount > buyingPower) return alert("Insufficient Buying Power!");
      
      // 1. Deduct Cash
      setBuyingPower(prev => prev - amount);
      // 2. Add to Asset Value
      setAssets(assets.map(a => a.id === selectedAsset.id ? { ...a, value: a.value + amount } : a));
      // 3. Log Transaction
      const newTx = {
        id: Date.now(),
        title: `Bought ${selectedAsset.ticker}`,
        category: "Market Execution",
        amount: -amount,
        date: "Just now",
        icon: <Activity size={16} />
      };
      setTransactions([newTx, ...transactions]);

    } else {
      // Selling
      if (amount > selectedAsset.value) return alert("You don't own that much of this asset!");
      
      // 1. Add Cash
      setBuyingPower(prev => prev + amount);
      // 2. Deduct from Asset Value
      setAssets(assets.map(a => a.id === selectedAsset.id ? { ...a, value: a.value - amount } : a));
      // 3. Log Transaction
      const newTx = {
        id: Date.now(),
        title: `Sold ${selectedAsset.ticker}`,
        category: "Market Execution",
        amount: +amount,
        date: "Just now",
        icon: <RefreshCw size={16} />
      };
      setTransactions([newTx, ...transactions]);
    }

    // Reset and Close Modal
    setTradeAmount('');
    setIsTradeOpen(false);
  };

  // Format currency helper
  const formatMoney = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans flex selection:bg-emerald-500/30">
      
      {/* --- SIDEBAR --- */}
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
          </nav>
        </div>
        <div className="p-4 border-t border-[#1e1e20]">
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      {/* --- MAIN DASHBOARD --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-20 border-b border-[#1e1e20] bg-[#050505]/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 z-10 shrink-0">
          <h1 className="text-xl font-bold text-white hidden sm:block">Live Trading Desk</h1>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Buying Power</p>
              <p className="text-sm font-bold text-emerald-400">{formatMoney(buyingPower)}</p>
            </div>
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* HERO: Balance */}
            <div className="bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">Total Net Liq (Equity)</p>
                  <div className="flex items-end gap-4">
                    <h2 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter">{formatMoney(totalEquity)}</h2>
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* ✨ This button opens the trading modal */}
                  <button 
                    onClick={() => setIsTradeOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5"
                  >
                    <RefreshCw size={16} /> Execute Trade
                  </button>
                </div>
              </div>

              {/* Chart */}
              <div className="h-48 w-full relative group mt-10 border-b border-[#1e1e20] pb-2">
                <svg viewBox="0 0 1000 200" className="w-full h-full preserve-3d drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0 150 Q 150 180, 250 120 T 500 80 T 750 100 T 1000 30 L 1000 200 L 0 200 Z" fill="url(#chartGradient)" />
                  <path d="M0 150 Q 150 180, 250 120 T 500 80 T 750 100 T 1000 30" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="1000" cy="30" r="6" fill="#000" stroke="#10b981" strokeWidth="3" className="animate-pulse" />
                </svg>
              </div>
            </div>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Assets Breakdown */}
              <div className="xl:col-span-2 bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-8">
                <h3 className="text-lg font-bold text-white mb-6">Open Positions</h3>
                <div className="space-y-2">
                  {assets.map((asset) => (
                    <div key={asset.id} className="group flex items-center justify-between p-4 rounded-2xl bg-[#121214] border border-[#1e1e20]">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full bg-[#1e1e20] flex items-center justify-center font-bold text-sm ${asset.color}`}>
                          {asset.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{asset.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{asset.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {/* Dynamic Value Render */}
                        <p className="font-bold text-white">{formatMoney(asset.value)}</p>
                        <p className={`text-xs font-bold ${asset.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                          {asset.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transactions */}
              <div className="bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-8">
                <h3 className="text-lg font-bold text-white mb-6">Execution Log</h3>
                <div className="space-y-6">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 bg-[#1e1e20] rounded-lg text-gray-400">
                          {tx.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{tx.title}</p>
                          <p className="text-[10px] text-gray-600 mt-1">{tx.date}</p>
                        </div>
                      </div>
                      {/* Dynamic Amount Render */}
                      <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatMoney(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- TRADE MODAL --- */}
        {isTradeOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsTradeOpen(false)}></div>
            <div className="relative w-full max-w-md bg-[#09090b] border border-[#27272a] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Execute Trade</h2>
                <button onClick={() => setIsTradeOpen(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
              </div>

              {/* Buy / Sell Toggle */}
              <div className="flex bg-[#1e1e20] rounded-xl p-1 mb-6">
                <button 
                  onClick={() => setTradeAction('Buy')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tradeAction === 'Buy' ? 'bg-emerald-500 text-black shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >Buy</button>
                <button 
                  onClick={() => setTradeAction('Sell')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tradeAction === 'Sell' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >Sell</button>
              </div>

              <form onSubmit={handleExecuteTrade} className="space-y-4">
                {/* Asset Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Asset</label>
                  <select 
                    value={selectedAsset.id}
                    onChange={(e) => setSelectedAsset(assets.find(a => a.id === e.target.value))}
                    className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {assets.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.ticker})</option>
                    ))}
                  </select>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      className="w-full bg-[#121214] border border-[#27272a] rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-lg font-bold"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-gray-500">Available Power:</span>
                    <span className="text-emerald-400 font-bold">{formatMoney(buyingPower)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className={`w-full py-4 mt-4 rounded-xl font-bold text-lg transition-transform hover:-translate-y-0.5 ${tradeAction === 'Buy' ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]'}`}
                >
                  Confirm {tradeAction}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
      active ? 'bg-[#1e1e20] text-white' : 'text-gray-500 hover:bg-[#121214] hover:text-white'
    }`}>
      <div className={`${active ? 'text-emerald-400' : 'group-hover:text-emerald-400'}`}>{icon}</div>
      <span className="hidden lg:block text-sm font-semibold">{label}</span>
    </button>
  );
}