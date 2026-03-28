import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Send, Plus, 
  RefreshCw, Bell, Search, LayoutGrid, PieChart, 
  Activity, Settings, CreditCard, Wallet, X,
  Zap
} from 'lucide-react';

// --- INITIAL STATE DATA ---
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
  const [buyingPower, setBuyingPower] = useState(25000.00);
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState(false);
  
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [tradeAction, setTradeAction] = useState('Buy'); 
  const [selectedAsset, setSelectedAsset] = useState(INITIAL_ASSETS[0]);
  const [tradeAmount, setTradeAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); 

  // --- ENGINE 1: LIVE MARKET TICKER ---
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prevAssets => 
        prevAssets.map(asset => {
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
    }, 2500); 
    return () => clearInterval(interval);
  }, []);

  // --- ENGINE 2: NEWS FEED ---
  useEffect(() => {
    const eventInterval = setInterval(() => {
      const randomEvent = MARKET_NEWS[Math.floor(Math.random() * MARKET_NEWS.length)];
      const newTx = {
        id: Date.now(), title: "Market News", category: randomEvent, amount: 0,
        date: "Just now", icon: <Bell size={16} className="text-yellow-400" />
      };
      setTransactions(prev => [newTx, ...prev].slice(0, 20)); 
      setNotifications(true); 
      setTimeout(() => setNotifications(false), 2000);
    }, 15000); 
    return () => clearInterval(eventInterval);
  }, []);

  const totalEquity = buyingPower + assets.reduce((sum, asset) => sum + asset.value, 0);

  // --- ENGINE 3: TRADE EXECUTION ---
  const handleExecuteTrade = (e) => {
    e.preventDefault();
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) return alert("Please enter a valid amount");
    if (tradeAction === 'Buy' && amount > buyingPower) return alert("⚠️ Insufficient Buying Power!");
    if (tradeAction === 'Sell' && amount > selectedAsset.value) return alert("⚠️ Insufficient Asset Balance!");

    setIsProcessing(true); 

    setTimeout(() => {
      if (tradeAction === 'Buy') {
        setBuyingPower(prev => prev - amount);
        setAssets(assets.map(a => a.id === selectedAsset.id ? { ...a, value: a.value + amount, cost: a.cost + amount } : a));
      } else {
        setBuyingPower(prev => prev + amount);
        setAssets(assets.map(a => a.id === selectedAsset.id ? { ...a, value: a.value - amount, cost: Math.max(0, a.cost - amount) } : a));
      }

      const newTx = {
        id: Date.now(), title: `${tradeAction} ${selectedAsset.ticker}`, category: "Market Execution",
        amount: tradeAction === 'Buy' ? -amount : +amount, date: "Just now",
        icon: tradeAction === 'Buy' ? <Activity size={16} className="text-blue-400"/> : <RefreshCw size={16} className="text-purple-400"/>
      };
      setTransactions(prev => [newTx, ...prev]);

      setIsProcessing(false);
      setTradeAmount('');
      setIsTradeOpen(false);
    }, 800);
  };

  const openQuickTrade = (asset, action) => {
    setSelectedAsset(asset);
    setTradeAction(action);
    setIsTradeOpen(true);
  };

  const formatMoney = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans flex selection:bg-emerald-500/30">
      
      {/* SIDEBAR */}
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
      </aside>

      {/* MAIN DASHBOARD */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 border-b border-[#1e1e20] bg-[#050505]/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h1 className="text-xl font-bold text-white hidden sm:block">Live Trading Terminal</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Buying Power</p>
              <p className="text-sm font-bold text-emerald-400">{formatMoney(buyingPower)}</p>
            </div>
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} className={notifications ? 'text-yellow-400 animate-bounce' : ''} />
              {notifications && <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full border-2 border-[#000]"></span>}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* HERO: Live Net Liq & CANDLESTICK CHART */}
            <div className="bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-10 relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                    Net Liquidation Value <span className="text-[10px] bg-[#1e1e20] px-2 py-0.5 rounded text-emerald-400 animate-pulse">LIVE</span>
                  </p>
                  <h2 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter transition-all duration-300">
                    {formatMoney(totalEquity)}
                  </h2>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsTradeOpen(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5">
                    <Zap size={16} /> Execute Trade
                  </button>
                </div>
              </div>

              {/* ✨ NEW LIVE CANDLESTICK CHART ✨ */}
              <div className="h-64 w-full mt-10 border-b border-[#1e1e20] pb-2">
                 <LiveCandlestickChart currentPrice={totalEquity} />
              </div>
            </div>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><PieChart size={18}/> Active Positions</h3>
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
                            <p className="font-bold text-white flex items-center gap-2">{asset.name}</p>
                            <p className="text-xs text-gray-500 font-medium tracking-wide">{formatMoney(asset.value)}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-[#1e1e20] pt-3 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] text-gray-500 uppercase mb-0.5">Unrealized P&L</p>
                            <p className={`text-sm font-bold font-mono transition-colors duration-300 ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {pnl >= 0 ? '+' : ''}{formatMoney(pnl)}
                            </p>
                          </div>
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

              <div className="bg-[#09090b] border border-[#1e1e20] rounded-3xl p-6 lg:p-8 flex flex-col h-96 xl:h-auto">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Activity size={18} className="text-emerald-400"/> Live Feed</h3>
                <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {transactions.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-2 bg-[#1e1e20] rounded-lg ${tx.amount === 0 ? 'text-yellow-400' : 'text-gray-400'}`}>{tx.icon}</div>
                        <div>
                          <p className={`text-sm font-bold ${tx.amount === 0 ? 'text-yellow-400' : 'text-white'}`}>{tx.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{tx.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRADE MODAL */}
        {isTradeOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isProcessing && setIsTradeOpen(false)}></div>
            <div className="relative w-full max-w-md bg-[#09090b] border border-[#27272a] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Order Ticket</h2>
                <button onClick={() => !isProcessing && setIsTradeOpen(false)} className="text-gray-500"><X size={20}/></button>
              </div>
              <form onSubmit={handleExecuteTrade} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Asset</label>
                  <select value={selectedAsset.id} disabled={isProcessing} onChange={(e) => setSelectedAsset(assets.find(a => a.id === e.target.value))} className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-4 py-3 text-white focus:outline-none">
                    {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.ticker})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input type="number" step="0.01" placeholder="0.00" value={tradeAmount} disabled={isProcessing} onChange={(e) => setTradeAmount(e.target.value)} className="w-full bg-[#121214] border border-[#27272a] rounded-xl pl-8 pr-4 py-3 text-white text-lg font-bold font-mono" />
                  </div>
                </div>
                <button type="submit" disabled={isProcessing} className="w-full py-4 mt-4 rounded-xl font-bold text-sm uppercase bg-emerald-500 text-black">
                  {isProcessing ? "Routing..." : `Submit Order`}
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
function NavItem({ icon, label, active }) {
  return (
    <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-[#1e1e20] text-white' : 'text-gray-500 hover:bg-[#121214] hover:text-white'}`}>
      <div className={`${active ? 'text-emerald-400' : ''}`}>{icon}</div>
      <span className="hidden lg:block text-sm font-semibold">{label}</span>
    </button>
  );
}

// ✨ THE CANDLESTICK ENGINE ✨
function LiveCandlestickChart({ currentPrice }) {
  // 1. Generate 40 initial fake historical candles leading up to the current price
  const [candles, setCandles] = useState(() => {
    let price = currentPrice - 500; // Start a bit lower
    const initial = [];
    for(let i=0; i<40; i++) {
      const open = price;
      const close = open + (Math.random() - 0.45) * 200; 
      const high = Math.max(open, close) + Math.random() * 100;
      const low = Math.min(open, close) - Math.random() * 100;
      initial.push({ id: i, open, close, high, low });
      price = close;
    }
    return initial;
  });

  // 2. React to the live totalEquity price moving
  useEffect(() => {
    setCandles(prev => {
      const newCandles = [...prev];
      const lastCandle = { ...newCandles[newCandles.length - 1] };
      
      // Update the close price
      lastCandle.close = currentPrice;
      
      // Stretch the wick if price goes higher/lower than recorded
      if (currentPrice > lastCandle.high) lastCandle.high = currentPrice;
      if (currentPrice < lastCandle.low) lastCandle.low = currentPrice;
      
      newCandles[newCandles.length - 1] = lastCandle;
      return newCandles;
    });
  }, [currentPrice]);

  // 3. Every 10 seconds, "close" the candle and start a new one to simulate time moving forward
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCandles(prev => {
        const newCandles = [...prev.slice(1)]; // Remove the oldest candle on the far left
        const lastPrice = newCandles[newCandles.length - 1].close;
        // Spawn a new candle on the right starting at the last close price
        newCandles.push({ id: Date.now(), open: lastPrice, close: lastPrice, high: lastPrice, low: lastPrice });
        return newCandles;
      });
    }, 10000); 
    return () => clearInterval(timeInterval);
  }, []);

  // Calculate rendering scale
  const minPrice = Math.min(...candles.map(c => c.low)) - 100;
  const maxPrice = Math.max(...candles.map(c => c.high)) + 100;
  const priceRange = maxPrice - minPrice;
  const getPercent = (val) => ((val - minPrice) / priceRange) * 100;

  return (
    <div className="w-full h-full flex items-end justify-between gap-[2px] pt-4">
      {candles.map((candle, i) => {
        const isGreen = candle.close >= candle.open;
        const color = isGreen ? 'bg-emerald-500' : 'bg-red-500';
        const isLast = i === candles.length - 1; // Pulse the live candle
        
        const topWick = 100 - getPercent(candle.high);
        const bottomWick = getPercent(candle.low);
        const bodyTop = 100 - getPercent(Math.max(candle.open, candle.close));
        const bodyBottom = getPercent(Math.min(candle.open, candle.close));
        
        // Ensure minimum 1px body height so doji candles (open==close) still show up
        const bodyHeight = Math.max((bodyBottom - bodyTop), 0.5);

        return (
          <div key={candle.id} className="relative flex-1 h-full group">
            {/* The Wick (High to Low) */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 w-[1px] ${color} opacity-40`}
              style={{ top: `${topWick}%`, bottom: `${bottomWick}%` }}
            />
            {/* The Body (Open to Close) */}
            <div 
              className={`absolute left-0 right-0 ${color} rounded-[1px] ${isLast ? 'animate-pulse shadow-[0_0_10px_currentColor]' : ''}`}
              style={{ top: `${bodyTop}%`, height: `${bodyHeight}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}