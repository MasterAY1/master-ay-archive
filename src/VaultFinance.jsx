import React, { useState } from 'react';
import { 
  Wallet, LineChart, Activity, Clock, ArrowUpRight, 
  ArrowDownRight, CreditCard, Send, Plus, MoreVertical, 
  Bitcoin, DollarSign, PieChart, TrendingUp 
} from 'lucide-react';

// --- MOCK DATA ---
const ASSETS = [
  { id: 1, name: "Bitcoin", symbol: "BTC", balance: "0.452", value: "$29,450.20", change: "+5.2%", isPositive: true },
  { id: 2, name: "Ethereum", symbol: "ETH", balance: "4.200", value: "$9,240.50", change: "+2.1%", isPositive: true },
  { id: 3, name: "Solana", symbol: "SOL", balance: "145.0", value: "$14,065.00", change: "-1.4%", isPositive: false },
  { id: 4, name: "USDC Coin", symbol: "USDC", balance: "5,000", value: "$5,000.00", change: "0.0%", isPositive: true },
];

const TRANSACTIONS = [
  { id: 1, type: "Received", asset: "BTC", amount: "+0.05 BTC", value: "$3,250.00", date: "Today, 14:30", status: "Completed" },
  { id: 2, type: "Sent", asset: "ETH", amount: "-1.2 ETH", value: "$2,640.00", date: "Yesterday", status: "Completed" },
  { id: 3, type: "Swapped", asset: "SOL", amount: "+45 SOL", value: "$4,365.00", date: "Oct 22", status: "Completed" },
  { id: 4, type: "Deposit", asset: "USD", amount: "+$10,000", value: "$10,000.00", date: "Oct 20", status: "Completed" },
];

const CHART_DATA = {
  '1W': [40, 30, 60, 50, 80, 70, 90],
  '1M': [30, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 90],
  '1Y': [20, 30, 25, 40, 35, 50, 45, 60, 75, 65, 85, 95],
};

export default function VaultFinance() {
  const [timeframe, setTimeframe] = useState('1W');
  const activeData = CHART_DATA[timeframe];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans p-4 md:p-8 selection:bg-[#00ff88]/30">
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* --- LEFT COLUMN: OVERVIEW & CHART --- */}
        <div className="flex-1 space-y-8">
          
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00ff88]/10 rounded-xl flex items-center justify-center border border-[#00ff88]/20">
                <Wallet className="text-[#00ff88]" size={20} />
              </div>
              <h1 className="text-2xl font-bold text-white">Vault Finance</h1>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium border border-white/5 transition-colors flex items-center gap-2">
                <Send size={16} /> Send
              </button>
              <button className="bg-[#00ff88] hover:bg-[#00e5ff] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                <Plus size={16} /> Deposit
              </button>
            </div>
          </header>

          {/* Total Balance Card */}
          <div className="bg-[#111] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff88]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00ff88]/10 transition-colors duration-700"></div>
            
            <p className="text-gray-400 font-medium mb-2 flex items-center gap-2">
              Total Portfolio Balance <PieChart size={14} />
            </p>
            <div className="flex items-end gap-4 mb-6">
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">$57,755.70</h2>
              <span className="flex items-center text-[#00ff88] bg-[#00ff88]/10 px-2 py-1 rounded-md text-sm font-bold mb-2">
                <ArrowUpRight size={16} className="mr-1" /> +$4,250 (24h)
              </span>
            </div>

            {/* Dynamic CSS Chart */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-white flex items-center gap-2"><LineChart size={16}/> Performance</h3>
                <div className="flex bg-black border border-white/10 rounded-lg p-1">
                  {['1W', '1M', '1Y'].map(tf => (
                    <button 
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeframe === tf ? 'bg-[#222] text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* The actual chart bars */}
              <div className="h-48 flex items-end gap-2 w-full pt-4">
                {activeData.map((val, i) => (
                  <div key={`${timeframe}-${i}`} className="flex-1 flex flex-col justify-end h-full group/bar">
                    <div 
                      className="w-full bg-[#00ff88]/20 rounded-t-sm group-hover/bar:bg-[#00ff88] transition-all duration-500 ease-out relative"
                      style={{ height: `${val}%` }}
                    >
                      {/* Tooltip on hover */}
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none">
                        ${(val * 850).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Clock size={18}/> Recent Activity</h3>
            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
              {TRANSACTIONS.map((tx, i) => (
                <div key={tx.id} className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer ${i !== TRANSACTIONS.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1c] flex items-center justify-center border border-white/5">
                      {tx.type === 'Received' || tx.type === 'Deposit' ? <ArrowDownRight size={18} className="text-[#00ff88]" /> : 
                       tx.type === 'Sent' ? <ArrowUpRight size={18} className="text-red-400" /> : 
                       <Activity size={18} className="text-blue-400" />}
                    </div>
                    <div>
                      <p className="text-white font-medium">{tx.type} {tx.asset}</p>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${tx.type === 'Received' || tx.type === 'Deposit' ? 'text-[#00ff88]' : 'text-white'}`}>{tx.amount}</p>
                    <p className="text-xs text-gray-500">{tx.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* --- RIGHT COLUMN: ASSETS --- */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
              Your Assets
              <button className="text-gray-500 hover:text-white transition-colors"><MoreVertical size={16}/></button>
            </h3>
            
            <div className="space-y-4">
              {ASSETS.map((asset) => (
                <div key={asset.id} className="p-4 bg-[#1a1a1c] border border-white/5 rounded-2xl hover:border-white/20 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white text-xs font-bold border border-white/10 group-hover:scale-110 transition-transform">
                        {asset.symbol.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{asset.name}</h4>
                        <p className="text-xs text-gray-500">{asset.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h4 className="text-white font-bold">{asset.value}</h4>
                      <p className="text-xs text-gray-500">{asset.balance} {asset.symbol}</p>
                    </div>
                  </div>
                  
                  {/* Mini Trend Line */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="h-8 w-24 flex items-end gap-1 opacity-60">
                      {[4, 7, 5, 8, 6, 9, 10].map((bar, i) => (
                        <div key={i} className={`w-full rounded-sm ${asset.isPositive ? 'bg-[#00ff88]' : 'bg-red-500'}`} style={{ height: `${bar * 10}%` }}></div>
                      ))}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${asset.isPositive ? 'text-[#00ff88] bg-[#00ff88]/10' : 'text-red-400 bg-red-400/10'}`}>
                      {asset.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
              <Search size={16} /> Explore Assets
            </button>
          </div>
          
          {/* Quick Action Card */}
          <div className="bg-gradient-to-br from-[#00ff88]/20 to-[#00e5ff]/20 border border-[#00ff88]/30 rounded-3xl p-6 relative overflow-hidden">
            <TrendingUp className="absolute -right-4 -bottom-4 text-[#00ff88] opacity-20 w-32 h-32" />
            <h3 className="text-xl font-bold text-white mb-2 relative z-10">Earn Yield</h3>
            <p className="text-gray-300 text-sm mb-6 relative z-10">Stake your crypto assets and earn up to 8.5% APY paid out daily.</p>
            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors w-fit relative z-10">
              Start Earning
            </button>
          </div>
          
        </div>

      </div>
    </div>
  );
}