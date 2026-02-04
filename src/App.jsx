import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  FileText, 
  Settings, 
  Plus, 
  Send, 
  Mic, 
  Globe, 
  Clock, 
  ChevronRight, 
  Share2, 
  MoreHorizontal,
  LayoutGrid,
  Library,
  Sparkles,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  Database,
  Lock,
  PanelRightClose,
  PanelRightOpen,
  Info,
  Users,
  Presentation,
  CheckSquare,
  FileDown,
  Edit3,
  Undo2,
  History,
  Printer,
  TrendingUp,
  Scale,
  Target,
  Gavel,
  Zap,
  BarChart3,
  Activity,
  Cpu
} from 'lucide-react';

const ROLES = [
  { id: 'ceo', name: 'Executive Management', icon: '🏢' },
  { id: 'finance', name: 'Finance User', icon: '💰' },
  { id: 'strategy', name: 'Strategy Team', icon: '🎯' },
  { id: 'credit', name: 'Credit Underwriter', icon: '⚖️' },
  { id: 'secretary', name: 'Company Secretary', icon: '📝' },
  { id: 'ops', name: 'Operations Lead', icon: '⚙️' }
];

const MODELS = [
  { id: 'gpt4', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'claude3', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'deepseek', name: 'DeepSeek-V3', provider: 'DeepSeek' },
  { id: 'qwen', name: 'Qwen-2.5', provider: 'Alibaba' },
  { id: 'gemini', name: 'Gemini 1.5 Pro', provider: 'Google' }
];

const SCENARIOS = [
  { id: 'ceo_strat', role: 'ceo', name: 'Strategic Performance', icon: <TrendingUp size={18}/>, prompt: 'Using our latest management accounts and FY budget, summarize where we are over-performing.' },
  { id: 'credit_eval', role: 'credit', name: 'Credit Underwriting', icon: <Scale size={18}/>, prompt: 'Prepare a credit assessment for the attached client financials based on our credit policy.' },
  { id: 'credit_stress', role: 'credit', name: 'Stress Testing', icon: <Activity size={18}/>, prompt: 'Re-run the latest credit assessment under a stressed scenario: 15% revenue decline and 5% interest rate increase.' },
  { id: 'finance_rep', role: 'finance', name: 'Financial Reporting', icon: <BarChart3 size={18}/>, prompt: 'Using the March financial data, create the monthly performance report explaining variances.' },
  { id: 'strategy_sales', role: 'strategy', name: 'Sales Strategy', icon: <Target size={18}/>, prompt: 'Analyze product performance and customer data to recommend a sales strategy for Q3.' },
  { id: 'legal_sec', role: 'secretary', name: 'Board Governance', icon: <Gavel size={18}/>, prompt: 'Generate formal board minutes from the Q1 meeting recording using our standard format.' },
  { id: 'ops_opt', role: 'ops', name: 'Process Optimization', icon: <Zap size={18}/>, prompt: 'Map the supply chain process and identify cost-reduction opportunities.' }
];

const DATA_SOURCES = {
  ceo: [
    { name: 'Management Accounts', dept: 'Finance', date: '31 Mar 2025', status: '✅' },
    { name: 'FY Budget', dept: 'Finance', date: '01 Jan 2025', status: '✅' },
    { name: 'Strategic Risk Register', dept: 'Legal', date: '15 Mar 2025', status: '✅' }
  ],
  credit: [
    { name: 'Borrower Financials', dept: 'Credit', date: '28 Mar 2025', status: '✅' },
    { name: 'Transaction History', dept: 'Credit', date: '30 Mar 2025', status: '✅' },
    { name: 'Credit Policy Manual', dept: 'Legal/Risk', date: '01 Mar 2025', status: '✅' }
  ],
  finance: [
    { name: 'Management Accounts', dept: 'Finance', date: '31 Mar 2025', status: '✅' },
    { name: 'FY Budget', dept: 'Finance', date: '01 Jan 2025', status: '✅' },
    { name: 'General Ledger Data', dept: 'Finance', date: '30 Mar 2025', status: '✅' }
  ],
  strategy: [
    { name: 'Product Performance', dept: 'Strategy', date: '30 Mar 2025', status: '✅' },
    { name: 'Sales Pipeline Data', dept: 'Sales', date: '29 Mar 2025', status: '✅' },
    { name: 'Competitor Benchmarks', dept: 'Strategy', date: '15 Mar 2025', status: '✅' }
  ],
  secretary: [
    { name: 'Board Minutes Archive', dept: 'Sec', date: '15 Mar 2025', status: '✅' },
    { name: 'Governing Articles', dept: 'Legal', date: '01 Jan 2025', status: '✅' },
    { name: 'Resolution Tracker', dept: 'Sec', date: '30 Mar 2025', status: '✅' }
  ],
  ops: [
    { name: 'Process Flow Charts', dept: 'Ops', date: '20 Mar 2025', status: '✅' },
    { name: 'Resource Allocation Data', dept: 'Finance', date: '28 Feb 2025', status: '⚠' }
  ]
};

const App = () => {
  const [activeRole, setActiveRole] = useState(ROLES[0]);
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
  const [activeModel, setActiveModel] = useState(MODELS[0]);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [viewMode, setViewMode] = useState('chat'); 
  const [messages, setMessages] = useState([]);
  const [collabDoc, setCollabDoc] = useState(null);
  
  const scrollRef = useRef(null);

  const filteredScenarios = activeRole.id === 'ceo' 
    ? SCENARIOS 
    : SCENARIOS.filter(s => s.role === activeRole.id);

  useEffect(() => {
    const isCurrentScenarioValid = activeRole.id === 'ceo' || activeScenario.role === activeRole.id;
    if (!isCurrentScenarioValid && filteredScenarios.length > 0) {
      setActiveScenario(filteredScenarios[0]);
    }
  }, [activeRole]);

  useEffect(() => {
    setMessages([{ 
      role: 'assistant', 
      content: `I've prepared the **${activeScenario.name}** environment for your review as **${activeRole.name}**. I have context-aware access to ${DATA_SOURCES[activeScenario.role]?.length || 0} secure data sources using **${activeModel.name}**.`,
      timestamp: 'Just now',
      isHero: true
    }]);
    setCollabDoc(null);
    setViewMode('chat');
  }, [activeScenario, activeRole]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input, timestamp: 'Now' };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Analysis for ${activeScenario.name} complete. Based on the integrated datasets and processed via ${activeModel.name}, I have identified the following critical path items. Would you like to review the generated Board Memo?`,
        hasArtifact: true,
        timestamp: 'Just now'
      }]);
    }, 1200);
  };

  const generateBoardMemo = () => {
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    setCollabDoc({
      type: 'board-memo',
      title: 'Formal Board Memorandum',
      status: 'Ready for Review',
      updated: 'Just now',
      metadata: {
        to: 'Board of Directors',
        from: activeRole.name,
        date: today,
        subject: `STRATEGIC UPDATE: ${activeScenario.name} Assessment`
      },
      content: {
        execSummary: `Comprehensive analysis performed within the SAIV environment for ${activeScenario.name}. Key findings indicate structural stability with opportunistic upsides in core KPIs.`,
        background: `This assessment utilizes verified internal data sources from the ${activeScenario.role.toUpperCase()} repository, processed through ${activeModel.name}, ensuring 100% data residency compliance.`,
        analysis: `1. CONTEXTUAL DRIVERS: Analysis confirms positive trend alignment in ${activeScenario.name}.\n2. RISK MITIGATION: Strategic buffers are adequate based on current stress-testing scenarios.\n3. GOVERNANCE: All data processing followed the Sovereign AI Vault encryption protocols.`,
        recommendations: `1. Proceed with the suggested reallocation strategy based on ${activeScenario.name}.\n2. Finalize the internal memo for board distribution.\n3. Update the Risk Register to reflect these findings.`
      }
    });
    setViewMode('collab');
    setIsRightPanelOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#FFFFFF] text-[#E8E8E8] font-sans overflow-hidden">
      {/* Sidebar - Scenario Navigator */}
      <aside className={`w-72 border-r border-[#2D2E2E] flex flex-col shrink-0 transition-all ${viewMode === 'collab' ? 'w-16' : 'w-72'} hidden lg:flex bg-[#161717]`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <ShieldCheck size={24} className="text-white" />
            </div>
            {viewMode !== 'collab' && (
              <div>
                <span className="font-black text-xl tracking-tighter block leading-none">SAIV</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Sovereign AI Vault</span>
              </div>
            )}
          </div>

          {viewMode !== 'collab' && (
            <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition-all mb-8 shadow-lg shadow-indigo-600/10">
              <Plus size={16} /> NEW ANALYSIS
            </button>
          )}
        </div>
        
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {viewMode !== 'collab' && (
            <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3">
              {activeRole.id === 'ceo' ? 'All Enterprise Scenarios' : `${activeRole.name} Tools`}
            </p>
          )}
          {filteredScenarios.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => setActiveScenario(scenario)}
              className={`
                flex items-center gap-3 w-full rounded-xl transition-all p-3 text-sm group
                ${activeScenario.id === scenario.id ? 'bg-[#202222] text-white shadow-sm ring-1 ring-indigo-500/30' : 'text-gray-400 hover:bg-[#202222] hover:text-gray-200'}
              `}
            >
              <span className={`shrink-0 ${activeScenario.id === scenario.id ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                {scenario.icon}
              </span>
              {viewMode !== 'collab' && <span className="flex-1 text-left truncate font-semibold">{scenario.name}</span>}
              {activeScenario.id === scenario.id && viewMode !== 'collab' && <div className="w-1 h-4 bg-indigo-500 rounded-full" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2D2E2E]">
          <NavItem icon={<Settings size={18} />} label="Vault Admin" collapsed={viewMode === 'collab'} />
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="h-16 border-b border-[#2D2E2E] flex items-center justify-between px-6 bg-[#FFFFFF]/95 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full shrink-0">
              <Lock size={12} className="text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Encrypted Session</span>
            </div>
            
            <div className="h-8 w-px bg-gray-800 mx-1 hidden sm:block" />
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest hidden md:block">Active Role:</span>
              <div className="relative">
                <button 
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-3 px-3 py-1.5 bg-[#202222]/50 hover:bg-[#202222] rounded-lg transition-all border border-[#2D2E2E]"
                >
                  <span className="text-sm">{activeRole.icon}</span>
                  <span className="text-xs font-bold text-gray-200">{activeRole.name}</span>
                  <ChevronDown size={14} className="text-gray-600" />
                </button>
                
                {showRoleMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#252727] border border-[#2D2E2E] rounded-xl overflow-hidden z-[100] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                    <p className="px-4 py-3 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#2D2E2E]">Select Identity for Demo</p>
                    {ROLES.map(role => (
                      <button
                        key={role.id}
                        onClick={() => { setActiveRole(role); setShowRoleMenu(false); }}
                        className={`flex items-center gap-3 w-full p-4 text-left hover:bg-indigo-600 transition-colors ${activeRole.id === role.id ? 'bg-[#2D2E2E] border-l-4 border-indigo-500' : ''}`}
                      >
                        <span className="text-xl">{role.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-white">{role.name}</p>
                          <p className="text-[9px] text-gray-400 uppercase font-medium mt-0.5 tracking-tighter">
                            {role.id === 'ceo' ? 'Access All Scenarios' : `Filtered to ${role.name}`}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#202222] border border-[#2D2E2E] rounded-lg shadow-inner hover:bg-[#2D2E2E] transition-all"
              >
                <Cpu size={14} className="text-indigo-400" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{activeModel.name}</span>
                <ChevronDown size={12} className="text-gray-600" />
              </button>
              
              {showModelMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#252727] border border-[#2D2E2E] rounded-xl overflow-hidden z-[100] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <p className="px-4 py-2.5 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#2D2E2E]">Model Selector</p>
                  {MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => { setActiveModel(model); setShowModelMenu(false); }}
                      className={`flex items-center justify-between w-full p-3 text-left hover:bg-indigo-600 transition-colors ${activeModel.id === model.id ? 'bg-[#2D2E2E] text-indigo-400' : 'text-gray-400'}`}
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold truncate">{model.name}</p>
                        <p className="text-[9px] font-medium opacity-60 tracking-tighter uppercase">{model.provider}</p>
                      </div>
                      {activeModel.id === model.id && <CheckCircle2 size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {viewMode === 'chat' && (
              <button 
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                className={`p-2 rounded-lg transition-all ${isRightPanelOpen ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-400 hover:bg-[#202222]'}`}
              >
                {isRightPanelOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
              </button>
            )}
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className={`flex-1 flex flex-col transition-all ${viewMode === 'collab' ? 'max-w-md border-r border-[#2D2E2E] bg-[#161717]' : 'max-w-full'}`}>
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
              <div className={`mx-auto w-full py-12 px-6 space-y-12 ${viewMode === 'collab' ? 'max-w-md' : 'max-w-3xl'}`}>
                {messages.map((m, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <div className="flex items-start gap-5 text-left">
                      <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] font-black tracking-tighter ${m.role === 'assistant' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-[#2D2E2E]'}`}>
                        {m.role === 'assistant' ? 'SAIV' : 'YOU'}
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex items-center gap-2">
                           <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">{m.role === 'assistant' ? 'Vault Intelligence' : 'User Session'}</span>
                           <span className="text-[10px] text-gray-600">| {m.timestamp}</span>
                        </div>
                        <div className="text-[15px] leading-relaxed text-gray-200">
                          {m.content}
                        </div>
                        
                        {m.isHero && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                            <HeroButton 
                              title={`Analyze ${activeScenario.name}`} 
                              desc={`Using ${activeModel.name}`} 
                              onClick={() => setInput(activeScenario.prompt)} 
                            />
                            <HeroButton 
                              title="Internal Audit" 
                              desc="Check context for variance" 
                              onClick={() => setInput(`Perform an internal audit for ${activeScenario.name}.`)} 
                            />
                          </div>
                        )}

                        {m.hasArtifact && viewMode === 'chat' && (
                          <div className="mt-8 pt-8 border-t border-[#2D2E2E] space-y-6">
                            <div className="flex flex-wrap gap-3">
                              <ActionButton icon={<Edit3 size={14} />} label="Enter Collaboration" primary onClick={() => generateBoardMemo()} />
                              <ActionButton icon={<Users size={14} />} label="Invite Reviewer" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <ArtifactButton icon={<FileText size={16} className="text-blue-400" />} label="Generate Board Memo" onClick={generateBoardMemo} />
                              <ArtifactButton icon={<Presentation size={16} className="text-orange-400" />} label="Slide Deck" />
                              <ArtifactButton icon={<CheckSquare size={16} className="text-green-400" />} label="Action Items" />
                              <ArtifactButton icon={<Library size={16} className="text-purple-400" />} label="Knowledge Vault" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-t from-[#FFFFFF] via-[#FFFFFF] to-transparent shrink-0">
              <div className={`mx-auto ${viewMode === 'collab' ? 'max-w-full' : 'max-w-3xl'}`}>
                <div className={`relative transition-all duration-300 rounded-2xl bg-[#202222] border-2 shadow-2xl ${isFocused ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-[#2D2E2E]'}`}>
                  <textarea 
                    className="w-full bg-transparent border-none outline-none resize-none text-[15px] p-5 pb-14 min-h-[100px] placeholder:text-gray-600"
                    placeholder={`Query ${activeModel.name} about ${activeScenario.name}...`}
                    value={input}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <div className="absolute bottom-4 left-5 flex items-center gap-3">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 tracking-wider">
                      <Database size={12} /> INTERNAL DATA ON
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white transition-colors"><Paperclip size={18} /></button>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <button onClick={handleSend} disabled={!input.trim()} className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 disabled:opacity-20 transition-all active:scale-95">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {viewMode === 'collab' && collabDoc && (
            <div className="flex-1 flex flex-col bg-[#FFFFFF] animate-in slide-in-from-right duration-500 border-l border-[#2D2E2E]">
              <div className="flex items-center justify-between p-6 bg-[#161717] border-b border-[#2D2E2E]">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 shadow-inner">
                    <FileText size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-black text-white tracking-tight">{collabDoc.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{collabDoc.status}</span>
                      <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1"><Clock size={11} /> {collabDoc.updated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D2E2E] text-xs font-bold text-gray-300 hover:bg-[#383939] transition-all border border-[#383939]">
                    <Printer size={16} /> Print
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 text-xs font-black text-white hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                    <FileDown size={16} /> Export Final
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#0D0D0D]">
                <div className="max-w-4xl mx-auto">
                  <div className="p-16 bg-white text-gray-900 shadow-2xl rounded-sm min-h-[1100px] font-serif leading-relaxed relative text-left">
                    <div className="absolute top-10 right-12 text-[10px] text-indigo-600 font-black tracking-widest uppercase border-2 border-indigo-600 px-3 py-1 opacity-70 rotate-3">
                      SAIV Secure
                    </div>

                    <div className="mb-16 border-b-8 border-gray-900 pb-8 text-left">
                      <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-gray-950">Internal Memorandum</h1>
                      <div className="flex items-center gap-4 mt-4">
                         <span className="text-xs font-black bg-gray-900 text-white px-3 py-1 uppercase tracking-widest">Confidential</span>
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Secure Executive Asset</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] gap-y-5 mb-16 text-[15px] text-left">
                      <span className="font-black uppercase text-gray-400 tracking-widest text-[11px]">To:</span>
                      <span className="font-black text-gray-900">{collabDoc.metadata.to}</span>
                      <span className="font-black uppercase text-gray-400 tracking-widest text-[11px]">From:</span>
                      <span className="font-black text-gray-900">{collabDoc.metadata.from}</span>
                      <span className="font-black uppercase text-gray-400 tracking-widest text-[11px]">Date:</span>
                      <span className="font-medium text-gray-700">{collabDoc.metadata.date}</span>
                      <span className="font-black uppercase text-gray-400 tracking-widest text-[11px]">Subject:</span>
                      <span className="font-black text-gray-900 border-b-2 border-gray-100 pb-1">{collabDoc.metadata.subject}</span>
                    </div>

                    <div className="space-y-12 text-left">
                      <MemoSection title="1. Executive Summary" content={collabDoc.content.execSummary} />
                      <MemoSection title="2. Background & Context" content={collabDoc.content.background} />
                      <MemoSection title="3. Contextual Analysis" content={collabDoc.content.analysis} />
                      <section className="bg-indigo-50 p-8 border-l-[6px] border-indigo-600 rounded-r-lg">
                        <h2 className="text-xl font-black uppercase tracking-tight text-indigo-950 mb-4">4. Strategic Recommendations</h2>
                        <div className="whitespace-pre-line text-indigo-900 font-bold italic leading-loose">{collabDoc.content.recommendations}</div>
                      </section>
                    </div>

                    <div className="mt-24 pt-12 border-t border-gray-100 flex justify-between items-end">
                      <div className="space-y-1 text-left">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.3em]">Vault Audit</p>
                        <p className="text-[10px] font-mono text-indigo-400 font-bold tracking-tighter">SECURE_SESSION_UID_{activeScenario.id.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                         <div className="text-xs font-black text-gray-950 uppercase tracking-widest mb-2">Authenticated by SAIV Architecture</div>
                         <div className="h-1 w-32 bg-indigo-600 ml-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {viewMode === 'chat' && isRightPanelOpen && (
        <aside className="w-80 border-l border-[#2D2E2E] bg-[#FFFFFF] flex flex-col shrink-0 animate-in slide-in-from-right duration-300">
          <div className="p-6 text-left">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
              <Database size={14} className="text-indigo-500" /> Internal Data Vault
            </h3>
            <div className="space-y-4">
              <div className="bg-[#202222] p-4 rounded-xl border border-[#2D2E2E] shadow-inner">
                <p className="text-[9px] text-gray-500 mb-1 font-black uppercase tracking-widest">Connected Context</p>
                <p className="text-sm font-black text-white">{activeScenario.name}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-gray-400">
                    {DATA_SOURCES[activeScenario.role]?.length || 0} Secure Repositories
                  </span>
                </div>
              </div>
              <div className="space-y-2 mt-6">
                <p className="px-1 text-[9px] font-black text-gray-600 uppercase tracking-widest">Governance Log</p>
                {DATA_SOURCES[activeScenario.role]?.map((source, idx) => (
                  <div key={idx} className="p-3 bg-[#202222] rounded-xl border border-[#2D2E2E] hover:border-indigo-500/40 transition-all flex items-center justify-between group">
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-gray-200 truncate">{source.name}</span>
                        <span className="text-[10px]">{source.status}</span>
                      </div>
                      <p className="text-[10px] font-medium text-gray-500">{source.dept} • {source.date}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-black text-indigo-600 focus:ring-indigo-500 h-3 w-3 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2D2E2E; border-radius: 10px; }
      `}} />
    </div>
  );
};

const MemoSection = ({ title, content }) => (
  <section className="text-left mb-10">
    <h2 className="text-lg font-black uppercase tracking-tight text-gray-950 border-l-4 border-gray-900 pl-5 mb-5">{title}</h2>
    <p className="text-gray-800 text-[16px] whitespace-pre-line leading-[1.8]">{content}</p>
  </section>
);

const NavItem = ({ icon, label, active = false, collapsed = false }) => (
  <button className={`flex items-center gap-3 w-full rounded-xl transition-all p-3 text-sm ${active ? 'bg-[#202222] text-white' : 'text-gray-400 hover:bg-[#202222] hover:text-gray-200'}`}>
    <span className={`${active ? 'text-indigo-400' : 'text-gray-500'}`}>{icon}</span>
    {!collapsed && <span className="flex-1 text-left truncate font-bold">{label}</span>}
  </button>
);

const HeroButton = ({ title, desc, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-start p-4 rounded-xl border-2 border-[#2D2E2E] bg-[#202222]/50 hover:border-indigo-500 hover:bg-[#202222] transition-all text-left group">
    <div className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors mb-1">{title}</div>
    <div className="text-[10px] text-gray-500 font-medium">{desc}</div>
  </button>
);

const ActionButton = ({ icon, label, primary = false, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all border shadow-lg ${primary ? 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-indigo-600/20' : 'bg-[#2D2E2E] border-[#383939] text-gray-300 hover:bg-[#383939]'}`}>
    {icon} {label}
  </button>
);

const ArtifactButton = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-3 w-full p-3 rounded-xl border border-[#2D2E2E] bg-[#202222]/50 hover:border-indigo-500/30 hover:bg-[#252727] transition-all text-left">
    <div className="p-2 bg-[#2D2E2E] rounded-lg shrink-0 shadow-inner">{icon}</div>
    <span className="text-xs font-bold text-gray-300 tracking-tight">{label}</span>
  </button>
);

export default App;