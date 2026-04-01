import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  LayoutDashboard, Users, CreditCard, Activity, Settings, Bell, Search, Menu, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Filter, Download, X, Edit3, Shield, Mail, CheckCircle2 
} from 'lucide-react';

// --- EXPANDED MOCK DATA ---
const revenueData = [
  { month: 'Jan', revenue: 4000, profit: 2400, costs: 1600 }, { month: 'Feb', revenue: 3000, profit: 1398, costs: 1602 },
  { month: 'Mar', revenue: 2000, profit: 9800, costs: -7800 }, { month: 'Apr', revenue: 2780, profit: 3908, costs: -1128 },
  { month: 'May', revenue: 1890, profit: 4800, costs: -2910 }, { month: 'Jun', revenue: 2390, profit: 3800, costs: -1410 },
  { month: 'Jul', revenue: 3490, profit: 4300, costs: -810 },
];

const deviceData = [
  { name: 'Mobile', users: 4500, color: '#00e5ff' }, 
  { name: 'Desktop', users: 3000, color: '#8b5cf6' }, 
  { name: 'Tablet', users: 1500, color: '#00ff88' },
];

const allTransactions = [
  { id: 'TX-0982', user: 'Sarah Jenkins', email: 'sarah.j@example.com', amount: 1240.00, status: 'Completed', date: '2026-03-22T14:43:00', method: 'Visa •••• 4242' },
  { id: 'TX-0983', user: 'Marcus Wright', email: 'm.wright@design.co', amount: 450.50, status: 'Pending', date: '2026-03-22T13:12:00', method: 'Mastercard •••• 8812' },
  { id: 'TX-0984', user: 'Elena Rodriguez', email: 'elena@startup.io', amount: 8920.00, status: 'Completed', date: '2026-03-21T09:15:00', method: 'Wire Transfer' },
  { id: 'TX-0985', user: 'TechFlow Inc.', email: 'billing@techflow.com', amount: 120.00, status: 'Failed', date: '2026-03-21T08:05:00', method: 'Stripe' },
  { id: 'TX-0986', user: 'David Chen', email: 'david.c@gmail.com', amount: 65.00, status: 'Completed', date: '2026-03-20T16:20:00', method: 'PayPal' },
  { id: 'TX-0987', user: 'Amanda Vance', email: 'amandav@outlook.com', amount: 2100.00, status: 'Completed', date: '2026-03-20T11:45:00', method: 'Amex •••• 0092' },
];

const customerData = [
  { id: 1, name: 'Sarah Jenkins', role: 'Enterprise Plan', spent: '$12,450', status: 'Active', lastLogin: '2 hours ago' },
  { id: 2, name: 'Marcus Wright', role: 'Pro Plan', spent: '$2,100', status: 'Active', lastLogin: '5 hours ago' },
  { id: 3, name: 'TechFlow Inc.', role: 'Enterprise Plan', spent: '$45,000', status: 'Inactive', lastLogin: '3 days ago' },
  { id: 4, name: 'David Chen', role: 'Basic Plan', spent: '$320', status: 'Active', lastLogin: '1 week ago' },
];

export default function NexusDashboard() {
  // --- GLOBAL STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- REUSABLE COMPONENTS ---
  const StatCard = ({ title, value, trend, isPositive }) => (
    <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl shadow-xl hover:border-white/10 transition-colors">
      <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-[#00ff88]' : 'text-red-400'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trend}
        </div>
      </div>
    </div>
  );

  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${activeTab === id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
    >
      <Icon size={18} className={activeTab === id ? 'text-[#00e5ff]' : ''} /> {label}
    </button>
  );

  // ==========================================
  // VIEW: 1. DASHBOARD (Overview)
  // ==========================================
  const DashboardView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Financial Overview</h1>
        <p className="text-gray-500 text-sm">Welcome back, check your metrics for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$128,430" trend="+14.2%" isPositive={true} />
        <StatCard title="Active Users" value="84,209" trend="+5.4%" isPositive={true} />
        <StatCard title="Churn Rate" value="2.4%" trend="-1.2%" isPositive={true} />
        <StatCard title="Refunds" value="$1,240" trend="+8.1%" isPositive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Revenue vs Profit</h3>
            <button className="text-gray-400 hover:text-white"><MoreHorizontal size={20} /></button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Line type="monotone" dataKey="profit" stroke="#00e5ff" strokeWidth={3} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Traffic Source</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="users">
                  {deviceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {deviceData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>{d.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // VIEW: 2. TRANSACTIONS (Filterable Table & Modal)
  // ==========================================
  const TransactionsView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedTx, setSelectedTx] = useState(null);

    const filteredTx = useMemo(() => {
      return allTransactions.filter(tx => {
        const matchesSearch = tx.user.toLowerCase().includes(searchTerm.toLowerCase()) || tx.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    }, [searchTerm, statusFilter]);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative h-full flex flex-col">
        {/* Transaction Detail Modal */}
        {selectedTx && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTx(null)}></div>
            <div className="relative bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <button onClick={() => setSelectedTx(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold text-white mb-6">Transaction Details</h2>
              
              <div className="flex justify-center mb-6">
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-1">Amount</p>
                  <p className="text-4xl font-bold text-white">${selectedTx.amount.toFixed(2)}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                      selectedTx.status === 'Completed' ? 'bg-[#00ff88]/10 text-[#00ff88]' :
                      selectedTx.status === 'Pending' ? 'bg-[#eab308]/10 text-[#eab308]' : 'bg-[#ff3366]/10 text-[#ff3366]'
                    }`}>{selectedTx.status}</span>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/5 pt-6 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Transaction ID</span><span className="font-mono text-white">{selectedTx.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="text-white">{selectedTx.user}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-white">{selectedTx.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="text-white">{new Date(selectedTx.date).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Payment Method</span><span className="text-white">{selectedTx.method}</span></div>
              </div>
              
              <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <Download size={16} /> Download Receipt
              </button>
            </div>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Transactions</h1>
          <p className="text-gray-500 text-sm">Manage and view all platform payments.</p>
        </div>

        <div className="bg-[#111111] border border-white/5 rounded-2xl shadow-xl flex-1 flex flex-col overflow-hidden">
          {/* Controls */}
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2 w-full sm:w-72 focus-within:border-[#00e5ff] transition-colors">
              <Search size={16} className="text-gray-500 mr-2" />
              <input type="text" placeholder="Search ID or Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent text-sm focus:outline-none w-full text-white" />
            </div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {['All', 'Completed', 'Pending', 'Failed'].map(status => (
                <button 
                  key={status} onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status ? 'bg-[#8b5cf6] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] text-xs uppercase tracking-widest text-gray-500 font-bold">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredTx.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">No transactions found.</td></tr>
                ) : (
                  filteredTx.map((tx) => (
                    <tr key={tx.id} onClick={() => setSelectedTx(tx)} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                      <td className="p-4 pl-6 font-mono text-gray-400 group-hover:text-[#00e5ff] transition-colors">{tx.id}</td>
                      <td className="p-4 font-medium text-gray-200">{tx.user}</td>
                      <td className="p-4 font-medium text-white">${tx.amount.toFixed(2)}</td>
                      <td className="p-4 text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="p-4 pr-6 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          tx.status === 'Completed' ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20' :
                          tx.status === 'Pending' ? 'bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20' : 'bg-[#ff3366]/10 text-[#ff3366] border border-[#ff3366]/20'
                        }`}>{tx.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW: 3. CUSTOMERS (Grid Cards)
  // ==========================================
  const CustomersView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Customers</h1>
          <p className="text-gray-500 text-sm">View and manage your user base.</p>
        </div>
        <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-[#8b5cf6]/20">
          + Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {customerData.map(customer => (
          <div key={customer.id} className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00e5ff]/5 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold text-lg">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{customer.name}</h3>
                  <p className="text-xs text-gray-400">{customer.role}</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><MoreHorizontal size={20} /></button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Total Spent</span><span className="font-medium text-white">{customer.spent}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Last Login</span><span className="text-gray-300">{customer.lastLogin}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#00ff88]"><CheckCircle2 size={14} /> Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==========================================
  // VIEW: 4. SETTINGS (Interactive Forms)
  // ==========================================
  const SettingsView = () => {
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [marketingNotifs, setMarketingNotifs] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000);
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Preferences</h1>
          <p className="text-gray-500 text-sm">Manage your account settings and preferences.</p>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          {/* Profile Section */}
          <div className="p-8 border-b border-white/5">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings className="text-[#00e5ff]" size={20}/> Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                <input type="text" defaultValue="MASTER_AY" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input type="email" defaultValue="admin@masteray.com" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-colors" />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="p-8 border-b border-white/5">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Mail className="text-[#00e5ff]" size={20}/> Notifications</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">System Alerts</p>
                  <p className="text-sm text-gray-500">Receive emails regarding system downtime and security.</p>
                </div>
                {/* Custom Toggle Switch */}
                <button 
                  onClick={() => setEmailNotifs(!emailNotifs)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${emailNotifs ? 'bg-[#00ff88]' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${emailNotifs ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Receive weekly newsletters and feature updates.</p>
                </div>
                <button 
                  onClick={() => setMarketingNotifs(!marketingNotifs)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${marketingNotifs ? 'bg-[#00ff88]' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${marketingNotifs ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-white/[0.02] flex justify-end gap-4">
            <button className="px-6 py-2.5 text-gray-400 font-medium hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2.5 bg-[#8b5cf6] text-white rounded-xl font-bold hover:bg-[#7c3aed] transition-colors w-32 flex justify-center">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- RENDER ROUTER ---
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'transactions': return <TransactionsView />;
      case 'customers': return <CustomersView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans flex overflow-hidden selection:bg-[#8b5cf6] selection:text-white">
      
      {/* SIDEBAR */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#0a0a0a] border-r border-white/5 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00e5ff] to-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.4)]"></div>
            NEXUS
          </div>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="px-4 py-6 space-y-1">
          <p className="px-3 text-xs font-bold tracking-widest uppercase text-gray-600 mb-4">Overview</p>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="transactions" icon={CreditCard} label="Transactions" />
          <NavItem id="customers" icon={Users} label="Customers" />
          
          <p className="px-3 text-xs font-bold tracking-widest uppercase text-gray-600 mb-4 mt-8">System</p>
          <NavItem id="settings" icon={Settings} label="Preferences" />
        </nav>
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 px-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#0a0a0a]/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-[#111] border border-white/10 rounded-full px-4 py-2 focus-within:border-[#8b5cf6] transition-colors w-64">
              <Search size={16} className="text-gray-500 mr-2" />
              <input type="text" placeholder="Global search..." className="bg-transparent text-sm focus:outline-none w-full text-white placeholder-gray-600" />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff3366] rounded-full border-2 border-[#0a0a0a]"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00ff88] to-[#00e5ff] p-[2px] cursor-pointer hover:scale-105 transition-transform">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-[#0a0a0a]" />
            </div>
          </div>
        </header>

        {/* Dynamic View Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 hide-scrollbar bg-gradient-to-b from-transparent to-black/20">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}