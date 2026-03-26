import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Send, Plus, 
  RefreshCw, Bell, Search, LayoutGrid, PieChart, 
  Activity, Settings, CreditCard, Wallet, X,
  Zap, TrendingUp, AlertCircle
} from 'lucide-react';

// --- INITIAL STATE DATA (Now with Cost Basis for PnL) ---
const INITIAL_ASSETS = [
  { id: '1', name: 'EUR/USD', type: 'Forex', balance: 12500, value: 13625.00, cost: 13500.00, change: '+0.45%', isUp: true, color: 'text-blue-400', ticker: 'EUR' },
  { id: '2', name: 'S&P 500 (SPY)', type: 'Index', balance: 24.5, value: 12345.50, cost: 11000.00, change: '+1.20%', isUp: true, color: 'text-purple-400', ticker: 'SPY' },
  { id: '3', name: 'Bitcoin (BTC)', type: 'Crypto', balance: 0.1542, value: 10124.80, cost: 12000.00, change: '-2.15%', isUp: false, color: 'text-orange-400', ticker: 'BTC' },
  { id: '4', name: 'Tesla (TSLA)', type: 'Equity', balance: 45, value: 7850.25, cost: 6500.00, change: '+4.30%', isUp: true, color: 'text-red-400', ticker: 'TSLA' },
];

const INITIAL_TRANSACTIONS = [
  { id: 1, title: "Bought TSLA", category: "Market Order", amount: -2450.00, date: "Today, 09:41 AM", icon: <Activity size={16} /> },
  { id: 2, title: "EUR/USD Swap", category: "Forex Execution", amount: +415.20, date: "Yesterday, 14:20 PM", icon: <RefreshCw size={16} /> },
];

const MARKET_NEWS = [
  "Fed announces unexpected rate hike",
  "Bitcoin ETF trading volume spikes",
  "Tesla earnings beat Wall Street expectations",
  "Forex volatility increases on job report",
  "S&P 500 reaches new all-time high",
  "Whale moves $500M in BTC off exchange"
];

export default function VaultFinance() {
  const [timeframe, setTimeframe] = useState('1W');
  
  // --- APPLICATION STATE ---
  const [buyingPower, setBuyingPower] = useState(25000.00);
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState(false);
  
  // Modal State
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [tradeAction, setTradeAction] = useState('Buy'); 
  const [selectedAsset, setSelectedAsset] = useState(INITIAL_ASSETS[0]);
  const [tradeAmount, setTradeAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // Fake API state

  // --- ENGINE 1: REAL-TIME PRICE TICKER ---
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prevAssets => 
        prevAssets.map(asset => {
          // Fluctuate between -0.5% and +0.5%
          const changePercent = (Math.random() - 0.5) * 0.01; 
          const newValue = asset.value * (1 + changePercent);
          
          return {
            ...asset,
            value: newValue,
            change: `${changePercent >= 0 ? '+' : ''}${(changePercent * 100).toFixed(2)}%`,
            isUp: changePercent >= 0
          };
        })
      );
    }, 2500); // Ticks every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  // --- ENGINE 2: LIVE MARKET NEWS FEED ---
  useEffect(() => {
    const eventInterval = setInterval(() => {
      const randomEvent = MARKET_NEWS[Math.floor(Math.random() * MARKET_NEWS.length)];
      
      const newTx = {
        id: Date.now(),
        title: "Market News",
        category: randomEvent,
        amount: 0,
        date: "Just now",
        icon: <Bell size={16} className="text-yellow-400" />
      };
      
      setTransactions(prev => [newTx, ...prev].slice(0, 20)); // Keep last 20
      setNotifications(true); // Trigger UI bell ping
      setTimeout(() => setNotifications(false), 2000);
    }, 15000); // News every 15 seconds

    return () => clearInterval(eventInterval);
  }, []);

  const totalEquity = buyingPower + assets.reduce((sum, asset) => sum + asset.value, 0);

  // --- ENGINE 3: FAKE API TRADE EXECUTION ---
  const handleExecuteTrade = (e) => {
    e.preventDefault();
    const amount = parseFloat(tradeAmount);
    
    if (isNaN(amount) || amount <= 0) return alert("Please enter a valid amount");
    if (tradeAction === 'Buy' && amount > buyingPower) return alert("⚠️ Insufficient Buying Power!");
    if (tradeAction === 'Sell' && amount > selectedAsset.value) return alert("⚠️ Insufficient Asset Balance!");

    setIsProcessing(true); // Start loading state

    // Simulate Network Latency (800ms)
    setTimeout(() => {
      if (tradeAction === 'Buy') {
        setBuyingPower(prev => prev - amount);
        setAssets(assets.map(a => a.id === selectedAsset.id ? { 
          ...a, 
          value: a.value + amount,
          cost: a.cost + amount // Update cost basis
        } : a));
      } else {
        setBuyingPower(prev => prev + amount);
        setAssets(assets.map(a => a.id === selectedAsset.id ? { 
          ...a, 
          value: a.value - amount,
          cost: Math.max(0, a.cost - amount) // Reduce cost basis
        } : a));
      }

      // Log the execution
      const newTx = {
        id: Date.now(),
        title: `${tradeAction} ${selectedAsset.ticker}`,
        category: "Market Execution",
        amount: tradeAction === 'Buy' ? -amount : +amount,
        date: "Just now",
        icon: tradeAction === 'Buy' ? <Activity size={16} className="text-blue-400"/> : <RefreshCw size={16} className="text-purple-400"/>
      };
      setTransactions(prev => [newTx, ...prev]);

      // Reset UI
      setIsProcessing(false);
      setTradeAmount('');
      setIsTradeOpen(false);
    }, 800);
  };

  // Quick Trade Helper
  const openQuickTrade = (asset, action) => {
    setSelectedAsset(asset);
    setTradeAction(action);
    setIsTradeOpen(true);
  };

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
            <NavItem icon={<LayoutGrid size={20} />} label="Terminal" active />
            <NavItem icon={<PieChart size={20} />} label="Portfolio" />
            <NavItem icon={<Zap size={20} />} label="Quick Trade" />
          </nav>
        </div>
        <div className="p-4 border-t border-[#1e1e20]">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <div className="mt-4 flex items-center justify-center lg:justify-start lg:px-4 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#1e1e20] border border-[#27272a] flex items-center justify-center font-bold text-xs text-white">AA</div>
            <div className="hidden lg:block ml-3">
              <p className="text-sm font-medium text-white">Ayomide A.</p>
              <p className="text-xs text-emerald-400">Live Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN DASHBOARD --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-20 border-b border-[#1e1e20] bg-[#050505]/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h1 className="text-xl font-bold text-white hidden sm:block">Live Trading Terminal</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Buying Power</p>
              <p className="text-sm font-bold text-emerald-400 transition-all duration-300">{formatMoney(buyingPower)}</p>
            </div>
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} className={notifications ? 'text-yellow-400 animate-bounce' : ''} />
              {notifications && <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full border-2 border-[#000]"></span>}
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* HERO: Live Net Liq */}
            <div className="bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                    Net Liquidation Value <span className="text-[10px] bg-[#1e1e20] px-2 py-0.5 rounded text-emerald-400 animate-pulse">LIVE</span>
                  </p>
                  <div className="flex items-end gap-4">
                    <h2 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter transition-all duration-300">
                      {formatMoney(totalEquity)}
                    </h2>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => openQuickTrade(assets[2], 'Buy')} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#1e1e20] text-white hover:bg-[#27272a] border border-[#27272a] transition-all hover:-translate-y-0.5">
                    <Plus size={16} /> Add Funds
                  </button>
                  <button onClick={() => setIsTradeOpen(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5">
                    <Zap size={16} /> Execute Trade
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
              
              {/* Active Positions with PnL & Quick Trade */}
              <div className="xl:col-span-2 bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><PieChart size={18}/> Active Positions</h3>
                  <span className="text-xs text-gray-500 uppercase tracking-widest">Live PnL</span>
                </div>
                
                <div className="space-y-3">
                  {assets.map((asset) => {
                    const pnl = asset.value - asset.cost;
                    return (
                      <div key={asset.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#121214] border border-[#1e1e20] hover:border-emerald-500/30 transition-all">
                        
                        <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                          <div className={`w-10 h-10 rounded-full bg-[#1e1e20] flex items-center justify-center font-bold text-sm shrink-0 ${asset.color}`}>
                            {asset.ticker.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white flex items-center gap-2">
                              {asset.name} 
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${asset.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {asset.change}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 font-medium tracking-wide">
                              {asset.type} • {formatMoney(asset.value)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-[#1e1e20] pt-3 sm:pt-0">
                          {/* Real-time PnL Calculation */}
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] text-gray-500 uppercase mb-0.5">Unrealized P&L</p>
                            <p className={`text-sm font-bold font-mono transition-colors duration-300 ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {pnl >= 0 ? '+' : ''}{formatMoney(pnl)}
                            </p>
                          </div>
                          
                          {/* Quick Trade Buttons */}
                          <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openQuickTrade(asset, 'Buy')} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg transition-colors">Buy</button>
                            <button onClick={() => openQuickTrade(asset, 'Sell')} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-colors">Sell</button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Market Feed */}
              <div className="bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-8 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Activity size={18} className="text-emerald-400"/> Live Feed
                </h3>
                <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {transactions.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="flex items-start justify-between group">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-2 bg-[#1e1e20] rounded-lg ${tx.amount === 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {tx.icon}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${tx.amount === 0 ? 'text-yellow-400' : 'text-white'}`}>{tx.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{tx.category}</p>
                          <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-wider font-mono">{tx.date}</p>
                        </div>
                      </div>
                      {tx.amount !== 0 && (
                        <span className={`text-xs font-bold font-mono ${tx.amount > 0 ? 'text-emerald-400' : 'text-gray-300'}`}>
                          {tx.amount > 0 ? '+' : ''}{formatMoney(tx.amount)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- TRADE MODAL WITH FAKE API LATENCY --- */}
        {isTradeOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isProcessing && setIsTradeOpen(false)}></div>
            <div className="relative w-full max-w-md bg-[#09090b] border border-[#27272a] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Order Ticket</h2>
                <button onClick={() => !isProcessing && setIsTradeOpen(false)} className="text-gray-500 hover:text-white" disabled={isProcessing}><X size={20}/></button>
              </div>

              {/* Buy / Sell Toggle */}
              <div className="flex bg-[#1e1e20] rounded-xl p-1 mb-6">
                <button 
                  onClick={() => setTradeAction('Buy')} disabled={isProcessing}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tradeAction === 'Buy' ? 'bg-emerald-500 text-black shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >Buy</button>
                <button 
                  onClick={() => setTradeAction('Sell')} disabled={isProcessing}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tradeAction === 'Sell' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >Sell</button>
              </div>

              <form onSubmit={handleExecuteTrade} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Asset</label>
                  <select 
                    value={selectedAsset.id} disabled={isProcessing}
                    onChange={(e) => setSelectedAsset(assets.find(a => a.id === e.target.value))}
                    className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                  >
                    {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.ticker})</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notional Value (USD)</label>
                    <span className="text-xs text-gray-500">Live: <span className="text-emerald-400 font-mono">{formatMoney(selectedAsset.value)}</span></span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      type="number" step="0.01" placeholder="0.00"
                      value={tradeAmount} disabled={isProcessing}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      className="w-full bg-[#121214] border border-[#27272a] rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-lg font-bold font-mono"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] uppercase tracking-wider font-bold">
                    <span className="text-gray-500">Available Power:</span>
                    <span className="text-emerald-400">{formatMoney(buyingPower)}</span>
                  </div>
                </div>

                {/* API Loading Button */}
                <button 
                  type="submit" disabled={isProcessing}
                  className={`w-full py-4 mt-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex justify-center items-center gap-2 ${
                    isProcessing ? 'bg-[#1e1e20] text-gray-400 cursor-not-allowed' :
                    tradeAction === 'Buy' ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 
                    'bg-red-500 text-white hover:bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                  }`}
                >
                  {isProcessing ? (
                    <><RefreshCw size={18} className="animate-spin" /> Routing to Exchange...</>
                  ) : (
                    `Submit ${tradeAction} Order`
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e20; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #27272a; }
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