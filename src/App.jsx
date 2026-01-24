import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Paperclip, 
  ArrowUp, 
  FileText, 
  X, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  Database,
  Search,
  MoreHorizontal,
  Share,
  Printer,
  User,
  Bell,
  Play,
  Pause,
  Mic,
  FileAudio,
  Sparkles,
  Download,
  Landmark,
  CalendarDays,
  Users,
  Scale,
  Settings,
  Globe,
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  PieChart,
  UserPlus,
  History,
  Archive,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Design Tokens ---
const THEME = {
  bg: 'bg-[#F3F4F6]',       
  card: 'bg-white',
  textMain: 'text-[#111827]', 
  textMuted: 'text-[#6B7280]',
  accent: 'text-[#064E3B]', 
  accentBg: 'bg-[#064E3B]',
  gold: 'text-[#D97706]',
  border: 'border-[#E5E7EB]',
};

// --- Mock Data: Meeting Recordings (Secretariat) ---
const INBOX_RECORDINGS = [
  { id: 1, name: 'Board_Strategy_Q1_2026.mp3', duration: '1h 45m', date: 'Jan 22, 2026', type: 'Teams Recording' },
  { id: 2, name: 'Risk_Committee_Sync.mp3', duration: '45m', date: 'Jan 23, 2026', type: 'Teams Recording' },
  { id: 3, name: 'Audit_Governance_Review.mp3', duration: '1h 15m', date: 'Jan 20, 2026', type: 'Teams Recording' },
];

// --- Mock Data: CEO Dashboard (Executive) ---
const CEO_KPIS = [
  { label: 'Return on Equity (ROE)', value: '18.4%', change: '+2.1%', trend: 'up', color: 'text-purple-600' },
  { label: 'Net Interest Margin', value: '7.8%', change: '+0.4%', trend: 'up', color: 'text-blue-600' },
  { label: 'Cost-to-Income', value: '54.2%', change: '-1.5%', trend: 'good', color: 'text-green-600' }, // Lower is better
  { label: 'NPL Ratio', value: '3.2%', change: '+0.1%', trend: 'bad', color: 'text-red-600' }, // Higher is bad
];

const ORG_USERS = [
  { id: 'cfo', name: 'Adebayo (CFO)', role: 'Chief Financial Officer', avatar: 'AA' },
  { id: 'cro', name: 'Chidinma (CRO)', role: 'Chief Risk Officer', avatar: 'CC' },
  { id: 'head_energy', name: 'Tunde (Energy)', role: 'Head, Energy Desk', avatar: 'TE' },
];

// --- Helper Utilities ---
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// --- Main Application ---
export default function SovereignApp() {
  const [activeModule, setActiveModule] = useState('home'); // 'home' | 'secretariat' | 'executive'
  
  return (
    <div className={`min-h-screen ${THEME.bg} font-sans text-slate-800 flex`}>
      {/* 1. Global Navigation */}
      <nav className="w-16 md:w-20 bg-[#F9FAFB] border-r border-slate-200 flex flex-col items-center py-6 gap-6 fixed h-full z-50">
        <div 
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#064E3B] to-[#042F24] flex items-center justify-center shadow-lg mb-4 ring-1 ring-[#D97706]/50 cursor-pointer hover:scale-105 transition-transform" 
          title="Home - SeeBess Bank Sovereign Vault"
          onClick={() => setActiveModule('home')}
        >
          <Landmark className="text-[#D97706]" size={26} />
        </div>
        
        <NavItem 
          icon={CalendarDays} 
          active={activeModule === 'secretariat'} 
          onClick={() => setActiveModule('secretariat')}
          tooltip="Secretariat Console"
        />
        
        <div className="relative group">
          <NavItem 
            icon={LayoutDashboard} 
            active={activeModule === 'executive'} 
            onClick={() => setActiveModule('executive')}
            tooltip="Group Performance (CEO)"
          />
          {/* Notification Dot for CEO */}
          <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#D97706] rounded-full border-2 border-[#F9FAFB]"></div>
        </div>
        
        <NavItem icon={Search} />
        <NavItem icon={Database} />
        
        <div className="w-8 h-px bg-slate-200 my-1"></div>
        
        <NavItem icon={Users} />
        <NavItem icon={Scale} />
        <NavItem icon={Globe} />

        <div className="mt-auto flex flex-col gap-4 items-center">
          <NavItem icon={Settings} />
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">JS</div>
        </div>
      </nav>

      {/* 2. Main Content Switcher */}
      <main className="flex-1 ml-16 md:ml-20 relative">
        {activeModule === 'home' && <HomeView onNavigate={setActiveModule} />}
        {activeModule === 'secretariat' && <SecretariatView />}
        {activeModule === 'executive' && <ExecutiveView />}
      </main>

    </div>
  );
}

// --- VIEW 0: Home Screen ---
const HomeView = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#F3F4F6] to-white z-0"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#064E3B]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D97706]/5 rounded-full blur-3xl"></div>

        <div className="z-10 w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#064E3B]/10 text-[#064E3B] text-xs font-bold uppercase tracking-widest mb-6">
                <Shield size={12} /> Sovereign AI Vault
              </div>
              <h1 className="font-serif text-6xl md:text-8xl text-[#111827] font-bold leading-tight mb-2">
                SeeBess<br/><span className="text-[#064E3B]">Bank</span>
              </h1>
              <p className="text-2xl font-serif text-slate-600 italic border-l-4 border-[#D97706] pl-4">
                Banking with Intelligence.
              </p>
              <p className="text-lg text-slate-500 max-w-lg leading-relaxed mt-6">
                Secure, sovereign, and intelligent. Empowering SeeBess Bank with next-generation cognitive capabilities.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('executive')}
                className="flex items-center justify-center gap-3 bg-[#064E3B] text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:bg-[#053d2e] hover:shadow-xl transition-all group"
              >
                <LayoutDashboard size={20} />
                <span>Launch Executive Lens</span>
                <ArrowUpRight size={18} className="opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('secretariat')}
                className="flex items-center justify-center gap-3 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-medium hover:border-[#064E3B] hover:text-[#064E3B] transition-all"
              >
                <CalendarDays size={20} />
                <span>Secretariat Console</span>
              </button>
            </div>
          </div>

          {/* High Fidelity Image */}
          <div className="relative group animate-fade-in-up delay-100">
            <div className="absolute inset-0 bg-[#D97706] rounded-2xl rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-[#064E3B] rounded-2xl -rotate-3 opacity-20 group-hover:-rotate-6 transition-transform duration-500"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
              {/* African Executives Collaboration Image */}
              <img 
                src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=2069&auto=format&fit=crop" 
                alt="African executives in blue suits collaborating around a screen" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#064E3B]/90 to-transparent opacity-40"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="font-serif text-2xl font-bold">Strategic Oversight</p>
                <p className="text-sm opacity-90">Lagos HQ • Boardroom A</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <div className="py-6 text-center text-slate-400 text-xs border-t border-slate-100 bg-[#F9FAFB]">
        <p>© 2026 SeeBess Bank Plc. All Rights Reserved. | NDPA Compliant Architecture</p>
      </div>
    </div>
  );
};

// --- VIEW 1: Secretariat (Existing Functionality) ---
const SecretariatView = () => {
  return <SecretariatComet />; 
};

// --- VIEW 2: Executive Dashboard (New "CEO" Scenario) ---
const ExecutiveView = () => {
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState([]); 
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [activeArtifactId, setActiveArtifactId] = useState(null);
  const [appState, setAppState] = useState('dashboard'); // dashboard | analyzing
  
  // State for Invite Modal Logic
  const [selectedInviteUser, setSelectedInviteUser] = useState(null);
  const [inviteNote, setInviteNote] = useState('');

  const messagesEndRef = useRef(null);
  
  // FIX: Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Handler: CEO asks a question
  const handleAsk = async () => {
    if (!query.trim()) return;
    
    setAppState('analyzing');
    const userQuery = query;
    setQuery('');

    // Simulate "Thinking"
    await delay(1500);

    // Create a new "Artifact" (Insight Card)
    const newInsight = {
      id: Date.now(),
      type: 'insight',
      question: userQuery,
      title: 'Energy Desk Variance Analysis (Q1)',
      summary: 'Analysis reveals a significant OPEX spike in Q3 driven primarily by a 40% increase in diesel procurement costs due to subsidy removal, alongside unplanned maintenance at the Port Harcourt facility. Recommendation: Accelerate solar hybrid deployment.',
      chartType: 'bar', // Mock chart type
      status: 'active', // active | frozen
      collaborators: [],
      auditTrail: [
        { user: 'CEO', action: 'Created Inquiry', date: 'Jan 24, 10:42 AM' }
      ],
      // Dynamic Data for the Chart
      chartData: [
        { label: 'Q1', value: 45 },
        { label: 'Q2', value: 48 },
        { label: 'Q3', value: 85, highlight: true, annotation: 'Diesel Cost Spike (+40%)' },
        { label: 'Q4', value: 55 }
      ]
    };

    setInsights(prev => [...prev, newInsight]);
    setAppState('dashboard');
    // Scroll to bottom of list, but wait for render
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSendInvite = () => {
    if (!selectedInviteUser) return;
    
    const userWithNote = { ...selectedInviteUser, note: inviteNote };

    setInsights(prev => prev.map(insight => {
      if (insight.id === activeArtifactId) {
        return {
          ...insight,
          collaborators: [...insight.collaborators, userWithNote],
          auditTrail: [...insight.auditTrail, { user: 'CEO', action: `Invited ${selectedInviteUser.name}`, date: 'Jan 24, 10:45 AM' }]
        };
      }
      return insight;
    }));
    
    // Reset Modal State
    setIsInviteOpen(false);
    setSelectedInviteUser(null);
    setInviteNote('');
  };

  const handleFreeze = (id) => {
    setInsights(prev => prev.map(insight => {
      if (insight.id === id) {
        return {
          ...insight,
          status: 'frozen',
          auditTrail: [...insight.auditTrail, { user: 'CEO', action: 'FROZEN INQUIRY (Sovereign Lock)', date: 'Jan 24, 10:50 AM' }]
        };
      }
      return insight;
    }));
  };

  return (
    <>
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-[#F3F4F6]/90 backdrop-blur-md px-8 py-4 flex justify-between items-center border-b border-transparent transition-all">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="font-serif font-bold text-xl text-[#064E3B] tracking-tight">SeeBess Bank</h1>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Executive Lens</span>
          </div>
          <span className="ml-2 px-2 py-0.5 bg-[#064E3B]/10 text-[#064E3B] text-[10px] font-bold uppercase rounded tracking-wider border border-[#064E3B]/20 flex items-center gap-1">
            <User size={10} /> CEO View
          </span>
        </div>
        <div className="flex items-center gap-3">
            <button className="text-slate-500 hover:text-[#064E3B] transition-colors"><Settings size={18} /></button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pb-40 pt-8 min-h-screen">
        
        {/* --- CEO COCKPIT START --- */}
        
        {/* 1. Top Row: The "Ticker" (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {CEO_KPIS.map((kpi, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-default flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</div>
                <div className={`p-1.5 rounded-full ${kpi.trend === 'up' || kpi.trend === 'good' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <Activity size={14} className={kpi.trend === 'up' || kpi.trend === 'good' ? 'text-green-600' : 'text-red-500'} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-slate-800">{kpi.value}</div>
                <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${kpi.trend === 'up' || kpi.trend === 'good' ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.trend === 'up' || kpi.trend === 'good' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {kpi.change} <span className="text-slate-400 font-normal">vs last quarter</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Middle Row: Vibrant Visuals (The Story) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Chart 1: The Jaws (Revenue vs Cost) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-700">Financial Trajectory (The "Jaws")</h3>
                <p className="text-xs text-slate-400">Gross Earnings vs. Operating Expenses (Trailing 12M)</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 text-xs"><div className="w-2 h-2 rounded-full bg-[#064E3B]"></div>Revenue</div>
                <div className="flex items-center gap-1 text-xs"><div className="w-2 h-2 rounded-full bg-red-500"></div>OPEX</div>
              </div>
            </div>
            {/* CSS-Only Line Chart Mock */}
            <div className="h-48 relative flex items-end justify-between px-2 gap-4">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-t border-slate-100 w-full h-0"></div>
                <div className="border-t border-slate-100 w-full h-0"></div>
                <div className="border-t border-slate-100 w-full h-0"></div>
                <div className="border-t border-slate-100 w-full h-0"></div>
              </div>
              
              {/* Bars representing trend points to simulate lines visually */}
              {[40, 45, 42, 50, 55, 60, 58, 65, 70, 75, 80, 85].map((h, i) => (
                <div key={i} className="w-full flex flex-col justify-end gap-1 h-full z-10 group cursor-pointer">
                  {/* Revenue Point */}
                  <div className="w-full bg-[#064E3B] rounded-t-sm opacity-90 hover:opacity-100 transition-all relative" style={{ height: `${h}%` }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">N {h*5}B</div>
                  </div>
                  {/* OPEX Point (Lower) */}
                  <div className="w-full bg-red-400/80 rounded-t-sm" style={{ height: `${h * 0.55}%` }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Portfolio Exposure (Donut) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-700 mb-1">Risk Exposure Mix</h3>
            <p className="text-xs text-slate-400 mb-6">Loan Portfolio by Sector</p>
            
            <div className="flex-1 flex items-center justify-center relative">
              {/* CSS Conic Gradient for Donut Chart */}
              <div className="w-40 h-40 rounded-full" style={{ background: `conic-gradient(#064E3B 0% 40%, #D97706 40% 65%, #3B82F6 65% 85%, #9333EA 85% 100%)` }}>
                <div className="w-28 h-28 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-slate-800">40%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Energy</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#064E3B]"></div> Energy (40%)</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#D97706]"></div> Trade (25%)</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div> Manuf. (20%)</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#9333EA]"></div> Retail (15%)</div>
            </div>
          </div>

        </div>
        
        {/* --- CEO COCKPIT END --- */}

        {/* 3. The Artifact Stream (Ad-hoc Analysis) */}
        <div className="space-y-8 max-w-4xl mx-auto">
          
          <div className="flex items-center gap-4 py-4 border-b border-slate-200">
            <h2 className="font-serif text-lg font-bold text-slate-700">Inquiry Stream</h2>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{insights.length} active threads</span>
          </div>

          {/* Welcome Message if empty */}
          {insights.length === 0 && appState !== 'analyzing' && (
            <div className="text-center py-10 opacity-60">
              <Sparkles size={48} className="text-[#D97706] mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-slate-700">Explore Group Data</h3>
              <p className="text-slate-500">Ask about variance, trends, or specific desk performance.</p>
            </div>
          )}

          {/* Render Insights */}
          {insights.map((insight) => (
            <InsightCard 
              key={insight.id} 
              data={insight} 
              onInvite={() => { setActiveArtifactId(insight.id); setIsInviteOpen(true); }}
              onFreeze={() => handleFreeze(insight.id)}
            />
          ))}

          {/* Loading State */}
          {appState === 'analyzing' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#D97706]/10 flex items-center justify-center">
                  <Sparkles size={16} className="text-[#D97706] animate-spin-slow" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </div>
              <div className="h-32 bg-slate-100 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 4. Executive Input Bar */}
      <div className="fixed bottom-0 left-16 md:left-20 right-0 p-6 bg-gradient-to-t from-[#F3F4F6] via-[#F3F4F6] to-transparent z-40">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl border border-slate-200 focus-within:border-[#064E3B] transition-all overflow-hidden">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about Group Performance..."
              className="w-full pl-6 pr-16 py-4 bg-transparent outline-none text-lg resize-none min-h-[70px] text-slate-800 placeholder:text-slate-400 font-serif"
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); }}}
            />
            <button 
              onClick={handleAsk}
              disabled={!query.trim()}
              className={`absolute bottom-3 right-3 p-2 rounded-xl transition-all ${!query.trim() ? 'bg-slate-100 text-slate-300' : 'bg-[#064E3B] text-white hover:bg-[#053d2e] shadow-md'}`}
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Invite Modal (Multi-Step) */}
      <AnimatePresence>
        {isInviteOpen && (
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#F9FAFB]">
                <div className="flex items-center gap-2">
                  {selectedInviteUser && (
                    <button onClick={() => setSelectedInviteUser(null)} className="mr-1 text-slate-400 hover:text-slate-600"><ArrowLeft size={18} /></button>
                  )}
                  <h3 className="font-bold text-slate-700">{selectedInviteUser ? 'Add Context' : 'Invite to Artifact'}</h3>
                </div>
                <button onClick={() => { setIsInviteOpen(false); setSelectedInviteUser(null); }}><X size={18} className="text-slate-400" /></button>
              </div>
              
              <div className="p-2">
                {!selectedInviteUser ? (
                  // Step 1: Select User
                  <div>
                    {ORG_USERS.map(user => (
                      <div key={user.id} onClick={() => setSelectedInviteUser(user)} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-xs font-bold">{user.avatar}</div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-800">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.role}</div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-[#064E3B]" />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Step 2: Add Note & Send
                  <div className="p-2 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-[10px] font-bold">{selectedInviteUser.avatar}</div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{selectedInviteUser.name}</div>
                        <div className="text-xs text-slate-500">{selectedInviteUser.role}</div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Context Note (Optional)</label>
                      <textarea 
                        value={inviteNote}
                        onChange={(e) => setInviteNote(e.target.value)}
                        placeholder="e.g., Please review the variance in Q3..."
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-[#064E3B] outline-none min-h-[100px]"
                        autoFocus
                      />
                    </div>

                    <button 
                      onClick={handleSendInvite}
                      className="w-full bg-[#064E3B] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#053d2e] flex items-center justify-center gap-2"
                    >
                      <UserPlus size={16} /> Send Invitation
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Component: Insight Card (The Artifact) ---
const InsightCard = ({ data, onInvite, onFreeze }) => {
  const isFrozen = data.status === 'frozen';

  return (
    <div className={`bg-white rounded-2xl border ${isFrozen ? 'border-slate-300 bg-slate-50' : 'border-slate-200'} shadow-sm overflow-hidden transition-all hover:shadow-md`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-start">
        <div className="flex gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isFrozen ? 'bg-slate-200 text-slate-500' : 'bg-[#D97706]/10 text-[#D97706]'}`}>
            {isFrozen ? <Lock size={20} /> : <BarChart3 size={20} />}
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
              Query: "{data.question}"
            </div>
            <h3 className="font-serif text-xl font-bold text-[#111827]">{data.title}</h3>
          </div>
        </div>
        
        {/* Status Badge */}
        {isFrozen && (
          <div className="flex items-center gap-1 bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            <Lock size={10} /> Archived
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-6">
        {/* Mock Chart Area - Specific to the Insight */}
        <div className="h-48 bg-[#F9FAFB] rounded-lg border border-dashed border-slate-200 flex items-center justify-center mb-6 relative overflow-hidden group">
          <div className="absolute inset-0 flex items-end justify-around px-12 pb-4 opacity-50">
            {/* Simple CSS Bars for visualization */}
            <div className="w-12 bg-[#064E3B] h-[60%] rounded-t-sm"></div>
            <div className="w-12 bg-[#064E3B] h-[40%] rounded-t-sm"></div>
            <div className="w-12 bg-[#D97706] h-[85%] rounded-t-sm relative">
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-[#D97706]">+12%</div>
            </div>
            <div className="w-12 bg-[#064E3B] h-[55%] rounded-t-sm"></div>
          </div>
          <div className="z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-lg shadow-sm text-xs font-bold text-slate-600">
            Interactive Visualization (Q1 OPEX)
          </div>
        </div>

        {/* Narrative */}
        <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed">
          <p>{data.summary}</p>
        </div>

        {/* Collaborators Row - UPDATED TO SHOW NOTES */}
        {data.collaborators.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase mb-3 block">Shared With:</span>
            <div className="space-y-3">
              {data.collaborators.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm flex-shrink-0" title={c.name}>
                      {c.avatar}
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-slate-700">{c.name}</div>
                      {c.note && (
                        <div className="bg-slate-50 border border-slate-200 rounded-tr-xl rounded-br-xl rounded-bl-xl p-2 mt-1 text-slate-600 italic">
                          "{c.note}"
                        </div>
                      )}
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {!isFrozen && (
        <div className="bg-[#F9FAFB] px-6 py-3 border-t border-slate-100 flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={onInvite}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#064E3B] hover:border-[#064E3B] transition-colors"
            >
              <UserPlus size={14} /> Invite
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#064E3B] hover:border-[#064E3B] transition-colors">
              <Download size={14} /> Save
            </button>
          </div>
          
          <button 
            onClick={onFreeze}
            className="flex items-center gap-2 px-4 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-[#D97706] hover:text-white transition-colors uppercase tracking-wide"
          >
            <Lock size={12} /> Freeze & Archive
          </button>
        </div>
      )}

      {/* Frozen Footer (Audit Trail) */}
      {isFrozen && (
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-bold uppercase">
            <History size={12} /> Audit Trail
          </div>
          <div className="space-y-1">
            {data.auditTrail.map((log, i) => (
              <div key={i} className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{log.user}: {log.action}</span>
                <span>{log.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Reusing Secretariat Component from Previous Iteration ---
// (We include this here so the full app works in one file for the demo)
function SecretariatComet() {
  const [query, setQuery] = useState('');
  const [thread, setThread] = useState([]);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [appState, setAppState] = useState('idle'); // idle, processing, viewing
  const [showInbox, setShowInbox] = useState(true);
  const [suggestedPrompt, setSuggestedPrompt] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [thread]);

  // Handler: Select Audio from Inbox
  const handleFileSelect = (file) => {
    if (!selectedFiles.find(f => f.id === file.id)) {
      setSelectedFiles([...selectedFiles, file]);
    }
    // Set the pre-canned prompt
    setSuggestedPrompt(`Transcribe and draft executive minutes for the ${file.name.replace('.mp3', '').replace(/_/g, ' ')} meeting. Focus on key strategic decisions, action items, and dissent.`);
    setIsVaultOpen(false);
    setShowInbox(false); // Clear the main inbox notification once engaged
  };

  // Handler: Submit Query
  const handleSubmit = async () => {
    const finalQuery = query || suggestedPrompt;
    if (!finalQuery.trim() && selectedFiles.length === 0) return;

    // Capture files at moment of send
    const currentFiles = [...selectedFiles];

    const newQuery = { 
      type: 'user', 
      content: finalQuery, 
      files: currentFiles 
    };
    
    setThread(prev => [...prev, newQuery]);
    setQuery('');
    setSuggestedPrompt(''); // Clear suggestion
    setSelectedFiles([]); // Clear input
    setAppState('processing');

    // Add placeholder AI message
    setThread(prev => [...prev, { 
      type: 'ai', 
      isThinking: true, 
      steps: ['sanitizing'], 
      content: null 
    }]);

    // DEMO LOGIC: Check if this is the specific update request
    const isUpdateRequest = finalQuery.toLowerCase().includes("update the reduction");

    if (isUpdateRequest) {
        // Shorter processing for updates
        await delay(1000);
        updateLastMessage({ steps: ['sanitizing', 'verifying'] });
        await delay(1000);
        updateLastMessage({ steps: ['sanitizing', 'verifying', 'updating'] });
        await delay(800);
        updateLastMessage({ 
            isThinking: false,
            content: MOCK_MEETING_MINUTES_UPDATED,
            sources: [
                INBOX_RECORDINGS[0], // Original context
                { name: 'Project_Status.pdf', type: 'Vault Doc', date: 'Jan 23, 2026' }
            ]
        });
    } else {
        // Standard initial processing
        await delay(1200);
        updateLastMessage({ steps: ['sanitizing', 'transcribing'] });
        
        await delay(1500);
        updateLastMessage({ steps: ['sanitizing', 'transcribing', 'drafting'] });
        
        await delay(1500);
        updateLastMessage({ 
            isThinking: false,
            content: MOCK_MEETING_MINUTES,
            sources: currentFiles
        });
    }
    
    setAppState('viewing');
  };

  const updateLastMessage = (updates) => {
    setThread(prev => {
      const newThread = [...prev];
      const lastMsg = newThread[newThread.length - 1];
      newThread[newThread.length - 1] = { ...lastMsg, ...updates };
      return newThread;
    });
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  return (
    // ... (This is the exact same structure as the previous Secretariat code, omitting for brevity in the combined file, but fully functional in deployment)
    <div className="flex-1 relative">
       {/* Sticky Header */}
       <header className="sticky top-0 z-30 bg-[#F3F4F6]/90 backdrop-blur-md px-8 py-4 flex justify-between items-center border-b border-transparent transition-all">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="font-serif font-bold text-xl text-[#064E3B] tracking-tight">SeeBess Bank</h1>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Secretariat Intelligent Console</span>
            </div>
            <span className="ml-2 px-2 py-0.5 bg-[#D97706]/10 text-[#D97706] text-[10px] font-bold uppercase rounded tracking-wider border border-[#D97706]/20 flex items-center gap-1">
              <Shield size={10} />
              Confidential
            </span>
          </div>
          <div className="flex items-center gap-3">
             <button className="text-slate-500 hover:text-[#064E3B] transition-colors"><Share size={18} /></button>
          </div>
        </header>

        {/* Scrollable Feed */}
        <div className="max-w-3xl mx-auto px-4 pb-48 pt-8 min-h-screen">
          
          {/* Welcome / Empty State */}
          {thread.length === 0 && (
            <div className="mt-16 text-center animate-fade-in-up">
              <h2 className="font-serif text-4xl text-[#111827] mb-3">Meet Intelligence</h2>
              <p className="text-slate-500 text-lg mb-12">Draft minutes, analyze compliance, and query records.</p>
              
              {/* Inbox Notification Card */}
              {showInbox && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm max-w-lg mx-auto text-left mb-8 cursor-pointer hover:shadow-md transition-shadow ring-1 ring-[#064E3B]/5"
                  onClick={() => setIsVaultOpen(true)}
                >
                  <div className="bg-[#FEF3C7] px-4 py-2 rounded-t-lg flex items-center gap-2 text-[#92400E] text-xs font-bold uppercase tracking-wide">
                    <Bell size={12} /> Action Required
                  </div>
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mic size={24} className="text-[#064E3B]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">Unprocessed Meeting Notes</h3>
                      <p className="text-sm text-slate-500">3 new recordings from MS Teams pending transcription.</p>
                    </div>
                    <ChevronRight className="text-slate-300" />
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Conversation Thread */}
          <div className="space-y-12">
            {thread.map((msg, idx) => (
              <div key={idx}>
                {msg.type === 'user' ? (
                  <h2 className="text-2xl md:text-3xl font-serif text-[#111827] mb-6 leading-tight border-l-4 border-[#D97706] pl-4">
                    {msg.content}
                  </h2>
                ) : (
                  <AiResponse 
                    content={msg.content} 
                    isThinking={msg.isThinking} 
                    steps={msg.steps}
                    sources={msg.sources}
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 3. Floating Input Bar (Sticky Bottom) */}
        <div className="fixed bottom-0 left-16 md:left-20 right-0 p-6 bg-gradient-to-t from-[#F3F4F6] via-[#F3F4F6] to-transparent z-40">
        <div className="max-w-3xl mx-auto">
          
          {/* Active File Pills */}
          {selectedFiles.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto">
              {selectedFiles.map(file => (
                <div key={file.id} className="flex items-center gap-2 bg-white border border-[#E5E7EB] pl-2 pr-1 py-1 rounded-full text-xs font-medium text-slate-700 shadow-sm">
                  <FileAudio size={12} className="text-[#D97706]" />
                  <span className="max-w-[200px] truncate">{file.name}</span>
                  <button onClick={() => setSelectedFiles(selectedFiles.filter(f => f.id !== file.id))} className="hover:bg-slate-100 rounded-full p-1"><X size={12} /></button>
                </div>
              ))}
            </div>
          )}

          <div className="relative bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl border border-slate-200 focus-within:border-[#064E3B] transition-all overflow-hidden group">
            
            {/* Auto-Prompt Suggestion Overlay */}
            {suggestedPrompt && !query && (
              <div className="absolute top-4 left-4 right-16 pointer-events-none text-slate-400 italic">
                {suggestedPrompt}
              </div>
            )}

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={suggestedPrompt ? "" : "Ask a follow up question..."}
              className="w-full pl-4 pr-14 py-4 bg-transparent outline-none text-base resize-none max-h-40 min-h-[84px] text-slate-800 placeholder:text-slate-400"
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }}}
            />
            
            <div className="absolute bottom-2 left-2 flex gap-1">
               <button 
                 onClick={() => setIsVaultOpen(true)}
                 className="p-2 text-slate-400 hover:text-[#064E3B] hover:bg-slate-50 rounded-lg transition-colors"
                 title="Attach from Vault"
               >
                 <Paperclip size={18} />
               </button>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={(!query.trim() && !suggestedPrompt && selectedFiles.length === 0)}
              className={`absolute bottom-3 right-3 p-1.5 rounded-lg transition-all ${(!query.trim() && !suggestedPrompt && selectedFiles.length === 0) ? 'bg-slate-100 text-slate-300' : 'bg-[#064E3B] text-white hover:bg-[#053d2e]'}`}
            >
              <ArrowUp size={20} />
            </button>
          </div>
          
          <div className="mt-3 flex justify-center items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            <Lock size={10} /> SeeBess Sovereign Privacy Shield Active
          </div>
        </div>
      </div>

      {/* Vault Modal */}
      <AnimatePresence>
        {isVaultOpen && (
          <InboxModal 
            onClose={() => setIsVaultOpen(false)} 
            onSelect={handleFileSelect} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Shared Components (Nav, etc) ---
const NavItem = ({ icon: Icon, active, onClick, tooltip }) => (
  <button 
    onClick={onClick}
    title={tooltip}
    className={`p-3 rounded-xl transition-all ${active ? 'bg-white shadow-sm text-[#064E3B]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
  >
    <Icon size={22} />
  </button>
);

// --- Sub-Components ---
const AiResponse = ({ content, isThinking, steps, sources }) => {
  return (
    <div className="w-full">
      {/* Sources Row (Perplexity Style) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Database size={12} /> Sources
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {sources && sources.map((source, i) => (
            <div key={i} className="flex-shrink-0 w-48 bg-white border border-slate-200 rounded-lg p-3 hover:border-[#D97706] transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                {source.name.endsWith('mp3') ? (
                  <FileAudio size={16} className="text-slate-400 group-hover:text-[#D97706]" />
                ) : (
                  <FileText size={16} className="text-slate-400 group-hover:text-[#D97706]" />
                )}
                <span className="text-[10px] text-slate-400 font-mono">{i + 1}</span>
              </div>
              <div className="text-xs font-medium text-slate-800 line-clamp-2 leading-snug mb-1">
                {source.name}
              </div>
              <div className="text-[10px] text-slate-400">{source.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reasoning Engine (Inline) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Sparkles size={12} /> Reasoning
        </div>
        <ReasoningAccordion steps={steps} isThinking={isThinking} />
      </div>

      {/* Main Content */}
      <div className="border-t border-slate-200 pt-6">
        {!isThinking && content ? (
          <div className="prose prose-slate max-w-none prose-h2:font-serif prose-h2:text-[#064E3B] prose-strong:text-[#111827]">
            <FormattedOutput text={content} />
            
            {/* Download/Export Actions */}
            <div className="mt-8 flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors shadow-sm">
                <Download size={16} /> Export PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors shadow-sm">
                <Share size={16} /> Circulate Draft
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const ReasoningAccordion = ({ steps, isThinking }) => {
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => { if (!isThinking) setIsOpen(false); }, [isThinking]);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          {isThinking ? (
            <span className="text-[#D97706] flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D97706]"></span>
              </span>
              Processing Meeting Data...
            </span>
          ) : (
            <span className="text-[#064E3B] flex items-center gap-2">
              <CheckCircle2 size={16} /> Analysis Complete
            </span>
          )}
        </div>
        {isOpen ? <ChevronDown size={16} className="text-slate-400"/> : <ChevronRight size={16} className="text-slate-400"/>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="border-t border-slate-100"
          >
            <div className="p-4 space-y-3">
              {steps.includes('updating') ? (
                 <>
                    <Step label="Accessing Credit Risk Project Notebook" active={false} done={true} />
                    <Step label="Verifying Data Points" active={false} done={true} />
                    <Step label="Applying Redline Updates" active={false} done={true} />
                 </>
              ) : (
                 <>
                    <Step label="Ingesting Audio Stream (Secure Tunnel)" active={steps.length >= 1} done={steps.includes('transcribing')} />
                    <Step label="Sanitizing PII (Voice Biometrics & Names)" active={steps.includes('sanitizing')} done={steps.includes('transcribing')} />
                    <Step label="Transcribing (Whisper-Sovereign)" active={steps.includes('transcribing')} done={steps.includes('drafting')} />
                    <Step label="Drafting Minutes (Board Format)" active={steps.includes('drafting')} done={!isThinking} />
                 </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Step = ({ label, active, done }) => (
  <div className="flex items-center gap-3 text-sm">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${done ? 'bg-[#064E3B] border-[#064E3B] text-white' : active ? 'border-[#D97706] text-[#D97706]' : 'border-slate-200 text-slate-300'}`}>
      {done ? <CheckCircle2 size={12} /> : <div className={`w-2 h-2 rounded-full ${active ? 'bg-[#D97706] animate-pulse' : 'bg-slate-200'}`} />}
    </div>
    <span className={done ? 'text-slate-700' : active ? 'text-[#D97706] font-medium' : 'text-slate-400'}>{label}</span>
  </div>
);

const InboxModal = ({ onClose, onSelect }) => {
  const [playing, setPlaying] = useState(null);

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#F9FAFB]">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#111827]">Unprocessed Recordings</h2>
            <p className="text-sm text-slate-500">Select a meeting to generate minutes.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-2">
          {INBOX_RECORDINGS.map(file => (
            <div 
              key={file.id} 
              onClick={() => onSelect(file)}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#D97706] hover:bg-[#FFFBEB] cursor-pointer group transition-all"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setPlaying(playing === file.id ? null : file.id); }}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#064E3B] hover:text-white transition-colors"
              >
                {playing === file.id ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
              </button>
              
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-800">{file.name}</span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{file.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{file.date}</span>
                  <span>•</span>
                  <span>{file.type}</span>
                  {playing === file.id && <span className="text-[#D97706] animate-pulse font-bold">• Playing Preview...</span>}
                </div>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-[#064E3B] text-white px-4 py-2 rounded-lg text-xs font-bold">Select</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Formatter for bolding and structure + Red Dashed Highlights
const FormattedOutput = ({ text }) => {
  // Regex to split by **bold** or __highlight__
  const parts = text.split(/(\*\*.*?\*\*|__.*?__)/g);
  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={i} className="font-bold text-[#111827] block mt-4 mb-2 text-lg font-serif">{part.slice(2, -2)}</span>;
        }
        if (part.startsWith('__') && part.endsWith('__')) {
          // The requested visual style: red dashed underline
          return (
            <span key={i} className="font-bold text-[#111827] border-b-2 border-dashed border-red-500 bg-red-50 px-1 rounded-sm">
                {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={i} className="text-slate-600">{part}</span>;
      })}
    </div>
  );
};

// --- Mock Content: Board Minutes ---
const MOCK_MEETING_MINUTES = `**MEETING MINUTES: BOARD STRATEGY COMMITTEE (Q1 2026)**

**Date:** January 22, 2026  
**Time:** 10:00 AM - 11:45 AM  
**Location:** Lagos HQ (Boardroom A) & MS Teams  

**ATTENDEES:** • Chairman (Presiding)  
• MD/CEO  
• Executive Director, Risk  
• Company Secretary (Scribe)

**1. AGENDA ITEM: Q4 PERFORMANCE REVIEW**
The MD presented the Q4 financial results. Key highlight: **Revenue grew by 15% YoY**, driven primarily by the Energy sector desk. However, OPEX increased by 8% due to rising diesel costs.

**2. DECISION: FX HEDGING STRATEGY**
The Board deliberated on the exposure to foreign currency liabilities.  
**RESOLVED:** The Treasury unit is mandated to execute a **Forward Contract** for 50% of the Q3 import obligations immediately to mitigate devaluation risk.  
**ACTION:** CFO to report on execution by Friday, Jan 26.

**3. DISCUSSION: DIGITAL TRANSFORMATION (PROJECT NAIRAFLOW)**
The CTO presented the pilot results for the Sovereign AI implementation.  
**OBSERVATION:** The pilot in Credit Risk demonstrated a **60% reduction in processing time**.  
**DECISION:** The Board **APPROVED** the budget for full hardware acquisition (Sovereign Node) to expand the project to Legal and HR.

**4. ADJOURNMENT**
Meeting adjourned at 11:45 AM. Next meeting scheduled for April 15, 2026.`;

const MOCK_MEETING_MINUTES_UPDATED = `**MEETING MINUTES: BOARD STRATEGY COMMITTEE (Q1 2026)**

**Date:** January 22, 2026  
**Time:** 10:00 AM - 11:45 AM  
**Location:** Lagos HQ (Boardroom A) & MS Teams  

**ATTENDEES:** • Chairman (Presiding)  
• MD/CEO  
• Executive Director, Risk  
• Company Secretary (Scribe)

**1. AGENDA ITEM: Q4 PERFORMANCE REVIEW**
The MD presented the Q4 financial results. Key highlight: **Revenue grew by 15% YoY**, driven primarily by the Energy sector desk. However, OPEX increased by 8% due to rising diesel costs.

**2. DECISION: FX HEDGING STRATEGY**
The Board deliberated on the exposure to foreign currency liabilities.  
**RESOLVED:** The Treasury unit is mandated to execute a **Forward Contract** for 50% of the Q3 import obligations immediately to mitigate devaluation risk.  
**ACTION:** CFO to report on execution by Friday, Jan 26.

**3. DISCUSSION: DIGITAL TRANSFORMATION (PROJECT NAIRAFLOW)**
The CTO presented the pilot results for the Sovereign AI implementation.  
**OBSERVATION:** The pilot in Credit Risk demonstrated a __63.5% reduction in processing time__.  
**DECISION:** The Board **APPROVED** the budget for full hardware acquisition (Sovereign Node) to expand the project to Legal and HR.

**4. ADJOURNMENT**
Meeting adjourned at 11:45 AM. Next meeting scheduled for April 15, 2026.`;