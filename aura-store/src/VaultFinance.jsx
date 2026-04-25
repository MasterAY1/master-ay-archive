import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Plus, RefreshCw, Bell, Search, LayoutGrid, 
  PieChart, Activity, Settings, Wallet, X, Zap, Menu, ChevronRight
} from 'lucide-react';

// --- INITIAL STATE DATA ---
const INITIAL_ASSETS = [
  { id: '1', name: 'EUR/USD', type: 'Forex', balance: 12500, value: 13625.00, cost: 13500.00, change: '+0.45%', isUp: true, color: 'text-blue-400', ticker: 'EUR' },
  { id: '2', name: 'S&P 500 (SPY)', type: 'Index', balance: 24.5, value: 12345.50, cost: 11000.00, change: '+1.20%', isUp: true, color: 'text-purple-400', ticker: 'SPY' },
  { id: '3', name: 'Bitcoin (BTC)', type: 'Crypto', balance: 0.1542, value: 10124.80, cost: 12000.00, change: '-2.15%', isUp: false, color: 'text-orange-400', ticker: 'BTC' },
  { id: '4', name: 'Tesla (TSLA)', type: 'Equity', balance: 45, value: 7850.25, cost: 6500.00, change: '+4.30%', isUp: true, color: 'text-red-400', ticker: 'TSLA' },
];

const MARKET_NEWS = [
  "Fed announces unexpected rate hike", "Bitcoin ETF trading volume spikes",
  "Tesla earnings beat Wall Street expectations", "Forex volatility increases on job report"
];

export default function VaultFinance() {
  // --- CORE STATE ---
  const [buyingPower, setBuyingPower] = useState(0);
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [transactions, setTransactions] = useState([]);
  
  // --- UI INTERACTION STATE ---
  const [activeTab, setActiveTab] = useState('Terminal');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeChartAsset, setActiveChartAsset] = useState({ name: 'Total Net Liquidation', isTotal: true });
  
  // --- MODAL STATE ---
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [tradeAction, setTradeAction] = useState('Buy'); 
  const [selectedAsset, setSelectedAsset] = useState(INITIAL_ASSETS[0]);
  const [tradeAmount, setTradeAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); 

 // --- ENGINE 1: FULL-STACK BACKEND CONNECTION ---
  useEffect(() => {
    fetch('https://vault-api-master-ay.onrender.com/api/portfolio')
      .then(res => res.json())
      .then(data => setBuyingPower(data.buying_power))
      .catch(err => console.error("API Error:", err));
  }, []);

  // --- ENGINE 2: LIVE MARKET TICKER ---
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        const changePercent = (Math.random() - 0.5) * 0.01; 
        return {
          ...asset,
          value: asset.value * (1 + changePercent),
          change: `${changePercent >= 0 ? '+' : ''}${(changePercent * 100).toFixed(2)}%`,
          isUp: changePercent >= 0
        };
      }));
    }, 2500); 
    return () => clearInterval(interval);
  }, []);

  // --- ENGINE 3: LIVE NEWS ALERTS ---
  useEffect(() => {
    const eventInterval = setInterval(() => {
      const randomEvent = MARKET_NEWS[Math.floor(Math.random() * MARKET_NEWS.length)];
      const newTx = {
        id: Date.now(), title: "Market Alert", category: randomEvent, amount: 0,
        date: "Just now", icon: <Bell size={16} className="text-yellow-400" />
      };
      setTransactions(prev => [newTx, ...prev].slice(0, 20)); 
    }, 20000); 
    return () => clearInterval(eventInterval);
  }, []);

  // --- ENGINE 4: TRADE EXECUTION (POST TO PYTHON) ---
  const handleExecuteTrade = async (e) => {
    e.preventDefault();
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) return alert("Please enter a valid amount");

    setIsProcessing(true); 
    try {
      // ✨ LIVE CLOUD API URL ✨
      const response = await fetch('https://vault-api-master-ay.onrender.com/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, action: tradeAction })
      });
      const data = await response.json();
      
      if (data.status === "error") { 
        alert("⚠️ " + data.message); 
        setIsProcessing(false);
        return; 
      }

      // Update UI with cloud data
      setBuyingPower(data.new_buying_power);
      setAssets(assets.map(a => a.id === selectedAsset.id ? { 
        ...a, 
        value: tradeAction === 'Buy' ? a.value + amount : a.value - amount,
        cost: tradeAction === 'Buy' ? a.cost + amount : Math.max(0, a.cost - amount) 
      } : a));

      setTransactions(prev => [{
        id: Date.now(), title: `${tradeAction} ${selectedAsset.ticker}`, category: "Market Execution",
        amount: tradeAction === 'Buy' ? -amount : +amount, date: "Just now",
        icon: tradeAction === 'Buy' ? <Activity size={16} className="text-blue-400"/> : <RefreshCw size={16} className="text-purple-400"/>
      }, ...prev]);

    } catch (error) {
      console.error("Trade failed:", error);
    } finally {
      setIsProcessing(false); setTradeAmount(''); setIsTradeOpen(false);
    }
  };

  const totalEquity = buyingPower + assets.reduce((sum, asset) => sum + asset.value, 0);
  const formatMoney = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  // --- SEARCH FILTERING ---
  const filteredAssets = assets.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.ticker.toLowerCase().includes(searchQuery.toLowerCase()));

  // Determine what value the chart is currently tracking
  const currentChartValue = activeChartAsset.isTotal ? totalEquity : (assets.find(a => a.id === activeChartAsset.id)?.value || totalEquity);

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans flex selection:bg-emerald-500/30 overflow-hidden">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-20 lg:w-64 border-r border-[#1e1e20] bg-[#050505] flex-col justify-between z-30 hidden md:flex shrink-0 h-screen">
        <div>
          <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-[#1e1e20]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Wallet className="text-black" size={18} strokeWidth={2.5} />
            </div>
            <span className="hidden lg:block ml-3 font-bold text-xl tracking-tight text-white">Vault.</span>
          </div>
          <nav className="p-4 space-y-2 mt-4">
            <NavItem icon={<LayoutGrid size={20} />} label="Terminal" active={activeTab === 'Terminal'} onClick={() => setActiveTab('Terminal')} />
            <NavItem icon={<PieChart size={20} />} label="Portfolio" active={activeTab === 'Portfolio'} onClick={() => setActiveTab('Portfolio')} />
            <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
          </nav>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="relative w-64 bg-[#050505] border-r border-[#1e1e20] h-full flex flex-col justify-between animate-in slide-in-from-left duration-300">
            <div>
              <div className="h-20 flex items-center px-8 border-b border-[#1e1e20] justify-between">
                <div className="flex items-center">
                  <Wallet className="text-emerald-500 mr-3" size={24} />
                  <span className="font-bold text-xl text-white">Vault.</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} className="text-gray-400" /></button>
              </div>
              <nav className="p-4 space-y-2">
                <NavItem icon={<LayoutGrid size={20} />} label="Terminal" active={activeTab === 'Terminal'} onClick={() => { setActiveTab('Terminal'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<PieChart size={20} />} label="Portfolio" active={activeTab === 'Portfolio'} onClick={() => { setActiveTab('Portfolio'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'Settings'} onClick={() => { setActiveTab('Settings'); setIsMobileMenuOpen(false); }} />
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen relative">
        
        {/* --- TOP NAVBAR --- */}
        <header className="h-20 border-b border-[#1e1e20] bg-[#050505]/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-10 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:block"></div>
              <h1 className="text-lg lg:text-xl font-bold text-white hidden sm:block">{activeTab}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Interactive Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" placeholder="Search assets..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#121214] border border-[#27272a] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white w-64 transition-all"
              />
            </div>
            
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Buying Power</p>
              <p className="text-sm font-bold text-emerald-400">{formatMoney(buyingPower)}</p>
            </div>
            
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors bg-[#121214] rounded-full border border-[#27272a]"
              >
                <Bell size={18} />
                {transactions.some(tx => tx.amount === 0) && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#000]"></span>}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-[#09090b] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-[#1e1e20] flex justify-between items-center bg-[#121214]">
                    <h4 className="font-bold text-white">Notifications</h4>
                    <button onClick={() => setIsNotificationsOpen(false)}><X size={16} className="text-gray-500"/></button>
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                    {transactions.filter(tx => tx.amount === 0).length === 0 ? (
                      <p className="text-center text-gray-500 py-4 text-sm">No new alerts</p>
                    ) : (
                      transactions.filter(tx => tx.amount === 0).map(tx => (
                        <div key={tx.id} className="p-3 hover:bg-[#121214] rounded-xl transition-colors cursor-pointer mb-1">
                          <p className="text-sm font-bold text-white">{tx.category}</p>
                          <p className="text-xs text-gray-500 mt-1">{tx.date}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- SCROLLABLE CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar relative bg-[#000000]">
          
          {/* DYNAMIC VIEW ROUTER */}
          {activeTab === 'Settings' ? (
             <div className="max-w-3xl mx-auto py-10 text-center animate-in fade-in">
               <Settings size={48} className="mx-auto text-gray-600 mb-4" />
               <h2 className="text-2xl font-bold text-white mb-2">Account Settings</h2>
               <p className="text-gray-500">Connect bank accounts, manage API keys, and update security preferences here.</p>
             </div>
          ) : activeTab === 'Portfolio' ? (
             <div className="max-w-6xl mx-auto animate-in fade-in">
               <h2 className="text-2xl font-bold text-white mb-6">Your Portfolio Breakdown</h2>
               {/* Just reusing the asset cards in a grid for the portfolio view */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {assets.map(asset => (
                   <div key={asset.id} className="bg-[#09090b] border border-[#1e1e20] p-6 rounded-3xl">
                     <div className={`w-12 h-12 rounded-xl bg-[#1e1e20] flex items-center justify-center font-bold text-lg mb-4 ${asset.color}`}>{asset.ticker.charAt(0)}</div>
                     <h3 className="font-bold text-white text-xl">{asset.name}</h3>
                     <p className="text-gray-500 text-sm mb-4">{asset.balance} {asset.ticker}</p>
                     <p className="text-3xl font-bold text-white mb-2">{formatMoney(asset.value)}</p>
                     <p className={`text-sm font-bold ${asset.isUp ? 'text-emerald-400' : 'text-red-400'}`}>{asset.change} All Time</p>
                   </div>
                 ))}
               </div>
             </div>
          ) : (
          
          // --- TERMINAL VIEW (DEFAULT) ---
          <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in">
            
            {/* THE CHART HERO */}
            <div className="bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-gray-400 text-sm font-medium">{activeChartAsset.name}</p>
                    {activeChartAsset.isTotal && <span className="text-[10px] bg-[#1e1e20] px-2 py-0.5 rounded text-emerald-400 animate-pulse">LIVE</span>}
                    {!activeChartAsset.isTotal && (
                      <button onClick={() => setActiveChartAsset({ name: 'Total Net Liquidation', isTotal: true })} className="text-[10px] bg-[#27272a] hover:bg-[#3f3f46] px-2 py-0.5 rounded text-white transition-colors">Reset View</button>
                    )}
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tighter transition-all duration-300">
                    {formatMoney(currentChartValue)}
                  </h2>
                </div>

                <div className="flex gap-3 w-full lg:w-auto">
                  <button onClick={() => setIsTradeOpen(true)} className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5">
                    <Zap size={16} /> Trade
                  </button>
                </div>
              </div>

              {/* Timeframe Toggles */}
              <div className="flex gap-2 mb-4">
                {['1D', '1W', '1M', '3M', 'ALL'].map(tf => (
                  <button key={tf} className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${tf === '1D' ? 'bg-[#27272a] text-white' : 'text-gray-500 hover:text-white hover:bg-[#1e1e20]'}`}>{tf}</button>
                ))}
              </div>

              {/* Interactive Candlestick Chart */}
              <div className="h-64 w-full border-b border-[#1e1e20] pb-2">
                 {/* We pass a key so the chart completely redraws when we click a new asset */}
                 <LiveCandlestickChart key={activeChartAsset.name} currentPrice={currentChartValue} />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* ASSET LIST (Interactive) */}
              <div className="xl:col-span-2 bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-8 flex flex-col max-h-[600px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><PieChart size={18}/> Active Markets</h3>
                  {/* Mobile Search Input */}
                  <div className="relative md:hidden w-32">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#121214] border border-[#27272a] rounded-full pl-7 pr-3 py-1 text-xs text-white" />
                  </div>
                </div>
                
                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
                  {filteredAssets.length === 0 ? (
                     <div className="text-center text-gray-500 py-10">No assets found matching "{searchQuery}"</div>
                  ) : filteredAssets.map((asset) => {
                    const pnl = asset.value - asset.cost;
                    const isActive = activeChartAsset.id === asset.id;
                    
                    return (
                      <div 
                        key={asset.id} 
                        onClick={() => setActiveChartAsset(asset)}
                        className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${isActive ? 'bg-[#1e1e20] border-emerald-500/50' : 'bg-[#121214] border-[#1e1e20] hover:border-gray-600'}`}
                      >
                        <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                          <div className={`w-10 h-10 rounded-full bg-[#1e1e20] flex items-center justify-center font-bold text-sm shrink-0 ${asset.color}`}>
                            {asset.ticker.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white flex items-center gap-2">{asset.name}</p>
                            <p className="text-xs text-gray-500 font-medium tracking-wide">{formatMoney(asset.value)}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-[#1e1e20] pt-3 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] text-gray-500 uppercase mb-0.5">P&L</p>
                            <p className={`text-sm font-bold font-mono transition-colors duration-300 ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {pnl >= 0 ? '+' : ''}{formatMoney(pnl)}
                            </p>
                          </div>
                          <ChevronRight size={18} className={`transition-transform ${isActive ? 'text-emerald-500 translate-x-1' : 'text-gray-600 group-hover:text-white'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* EXECUTION LOG */}
              <div className="bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-8 flex flex-col h-[500px] xl:h-[600px]">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Activity size={18} className="text-emerald-400"/> Execution Log</h3>
                <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {transactions.filter(tx => tx.amount !== 0).length === 0 ? (
                    <div className="text-center text-gray-500 py-10 text-sm">No recent trades.</div>
                  ) : transactions.filter(tx => tx.amount !== 0).map((tx) => (
                    <div key={tx.id} className="flex items-start justify-between bg-[#121214] p-3 rounded-xl border border-[#1e1e20]">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 bg-[#1e1e20] rounded-lg text-gray-400">{tx.icon}</div>
                        <div>
                          <p className="text-sm font-bold text-white">{tx.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{tx.date}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold font-mono ${tx.amount > 0 ? 'text-emerald-400' : 'text-gray-300'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatMoney(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* --- TRADE MODAL --- */}
        {isTradeOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isProcessing && setIsTradeOpen(false)}></div>
            <div className="relative w-full max-w-md bg-[#09090b] border border-[#27272a] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Order Ticket</h2>
                <button onClick={() => !isProcessing && setIsTradeOpen(false)} className="text-gray-500"><X size={20}/></button>
              </div>
              <form onSubmit={handleExecuteTrade} className="space-y-4">
                <div className="flex bg-[#1e1e20] rounded-xl p-1 mb-4">
                  <button type="button" onClick={() => setTradeAction('Buy')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${tradeAction === 'Buy' ? 'bg-emerald-500 text-black' : 'text-gray-400'}`}>Buy</button>
                  <button type="button" onClick={() => setTradeAction('Sell')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${tradeAction === 'Sell' ? 'bg-red-500 text-white' : 'text-gray-400'}`}>Sell</button>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Asset</label>
                  <select value={selectedAsset.id} onChange={(e) => setSelectedAsset(assets.find(a => a.id === e.target.value))} className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-4 py-3 text-white focus:outline-none">
                    {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.ticker})</option>)}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Amount (USD)</label>
                    <span className="text-xs text-gray-500">Avail: <span className="text-emerald-400">{formatMoney(buyingPower)}</span></span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input type="number" step="0.01" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} required className="w-full bg-[#121214] border border-[#27272a] rounded-xl pl-8 pr-4 py-3 text-white text-lg font-bold font-mono" />
                  </div>
                </div>
                <button type="submit" disabled={isProcessing} className="w-full py-4 mt-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-emerald-500 text-black flex justify-center items-center gap-2 hover:bg-emerald-400 transition-colors">
                  {isProcessing ? <><RefreshCw size={16} className="animate-spin" /> Routing...</> : `Confirm ${tradeAction}`}
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
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-[#1e1e20] text-white' : 'text-gray-500 hover:bg-[#121214] hover:text-white'}`}>
      <div className={`${active ? 'text-emerald-400' : ''}`}>{icon}</div>
      <span className="text-sm font-semibold block lg:block">{label}</span>
    </button>
  );
}

function LiveCandlestickChart({ currentPrice }) {
  const [candles, setCandles] = useState(() => {
    let price = currentPrice - 100; 
    const initial = [];
    for(let i=0; i<40; i++) {
      const open = price;
      const close = open + (Math.random() - 0.45) * 50; 
      const high = Math.max(open, close) + Math.random() * 20;
      const low = Math.min(open, close) - Math.random() * 20;
      initial.push({ id: i, open, close, high, low });
      price = close;
    }
    return initial;
  });

  useEffect(() => {
    setCandles(prev => {
      const newCandles = [...prev];
      const lastCandle = { ...newCandles[newCandles.length - 1] };
      lastCandle.close = currentPrice;
      if (currentPrice > lastCandle.high) lastCandle.high = currentPrice;
      if (currentPrice < lastCandle.low) lastCandle.low = currentPrice;
      newCandles[newCandles.length - 1] = lastCandle;
      return newCandles;
    });
  }, [currentPrice]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCandles(prev => {
        const newCandles = [...prev.slice(1)]; 
        const lastPrice = newCandles[newCandles.length - 1].close;
        newCandles.push({ id: Date.now(), open: lastPrice, close: lastPrice, high: lastPrice, low: lastPrice });
        return newCandles;
      });
    }, 10000); 
    return () => clearInterval(timeInterval);
  }, []);

  const minPrice = Math.min(...candles.map(c => c.low)) - 20;
  const maxPrice = Math.max(...candles.map(c => c.high)) + 20;
  const priceRange = maxPrice - minPrice;
  const getPercent = (val) => ((val - minPrice) / priceRange) * 100;

  return (
    <div className="w-full h-full flex items-end justify-between gap-[2px] pt-4">
      {candles.map((candle, i) => {
        const isGreen = candle.close >= candle.open;
        const color = isGreen ? 'bg-emerald-500' : 'bg-red-500';
        const isLast = i === candles.length - 1; 
        
        const topWick = 100 - getPercent(candle.high);
        const bottomWick = getPercent(candle.low);
        const bodyTop = 100 - getPercent(Math.max(candle.open, candle.close));
        const bodyBottom = getPercent(Math.min(candle.open, candle.close));
        const bodyHeight = Math.max((bodyBottom - bodyTop), 0.5);

        return (
          <div key={candle.id} className="relative flex-1 h-full group">
            <div className={`absolute left-1/2 -translate-x-1/2 w-[1px] ${color} opacity-40`} style={{ top: `${topWick}%`, bottom: `${bottomWick}%` }} />
            <div className={`absolute left-0 right-0 ${color} rounded-[1px] ${isLast ? 'animate-pulse shadow-[0_0_10px_currentColor]' : ''}`} style={{ top: `${bodyTop}%`, height: `${bodyHeight}%` }} />
          </div>
        );
      })}
    </div>
  );
}