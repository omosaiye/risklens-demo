import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Send, 
  Mic, 
  Settings,
  FileText, 
  Clock, 
  ChevronDown, 
  Database, 
  Lock, 
  PanelRightClose, 
  PanelRightOpen, 
  Users, 
  Presentation, 
  CheckSquare, 
  FileDown, 
  Edit3, 
  Printer, 
  TrendingUp, 
  Scale, 
  Target, 
  Gavel, 
  Zap, 
  BarChart3, 
  Activity, 
  Cpu, 
  CheckCircle2,
  ShieldCheck,
  Library
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

// Strictly restricted set of tools as per document instructions
const SCENARIOS = [
  { 
    id: 'strat_perf', 
    roles: ['ceo', 'strategy', 'finance', 'secretary'], 
    name: 'Strategic Performance', 
    icon: <TrendingUp size={18}/>, 
    prompt: 'Using our latest management accounts and FY budget, summarize where we are over- or under-performing, identify top three drivers, and highlight implications.' 
  },
  { 
    id: 'credit_und', 
    roles: ['ceo', 'credit'], 
    name: 'Credit Underwriting', 
    icon: <Scale size={18}/>, 
    prompt: 'Based on the attached client financials, transaction history, and our credit policy, prepare a credit assessment highlighting repayment capacity and key risks.' 
  },
  { 
    id: 'stress_test', 
    roles: ['ceo', 'credit', 'finance'], 
    name: 'Stress Testing', 
    icon: <Activity size={18}/>, 
    prompt: 'Re-run this assessment under a stressed scenario: 15% revenue decline and 5% interest rate increase. Summarize impact on repayment capacity.' 
  },
  { 
    id: 'fin_rep', 
    roles: ['ceo', 'finance', 'ops'], 
    name: 'Financial Reporting', 
    icon: <BarChart3 size={18}/>, 
    prompt: 'Using the February monthly performance report and March financial data, create the March performance report highlighting variances versus budget.' 
  },
  { 
    id: 'sales_strat', 
    roles: ['ceo', 'strategy', 'ops'], 
    name: 'Sales Strategy', 
    icon: <Target size={18}/>, 
    prompt: 'Using product performance, customer data, and pipeline data, recommend a sales strategy for next quarter identifying priority segments and revenue impact.' 
  },
  { 
    id: 'board_gov', 
    roles: ['ceo', 'secretary'], 
    name: 'Board Governance', 
    icon: <Gavel size={18}/>, 
    prompt: 'Generate formal board minutes from this meeting recording using our standard format, ensuring all resolutions are captured accurately.' 
  },
  { 
    id: 'proc_opt', 
    roles: ['ceo', 'ops', 'strategy'], 
    name: 'Process Optimization', 
    icon: <Zap size={18}/>, 
    prompt: 'Map this process and identify bottlenecks and cost-reduction opportunities within the organizational workflow.' 
  }
];

const DATA_SOURCES = {
  ceo: [
    { name: 'Management Accounts', dept: 'Finance', date: '31 Mar 2025', status: '✅' },
    { name: 'FY Budget', dept: 'Finance', date: '01 Jan 2025', status: '✅' },
    { name: 'Monthly Performance Reports', dept: 'Finance', date: '28 Feb 2025', status: '⚠' }
  ],
  finance: [
    { name: 'Management Accounts', dept: 'Finance', date: '31 Mar 2025', status: '✅' },
    { name: 'FY Budget', dept: 'Finance', date: '01 Jan 2025', status: '✅' },
    { name: 'Monthly Performance Reports', dept: 'Finance', date: '28 Feb 2025', status: '⚠' }
  ],
  strategy: [
    { name: 'Product Performance Data', dept: 'Strategy', date: '30 Mar 2025', status: '✅' },
    { name: 'Customer & Sales Data', dept: 'Strategy', date: '29 Mar 2025', status: '✅' },
    { name: 'Industry Risk Briefs', dept: 'Strategy', date: '15 Mar 2025', status: '✅' }
  ],
  credit: [
    { name: 'Borrower Financials', dept: 'Credit', date: '28 Mar 2025', status: '✅' },
    { name: 'Transaction History', dept: 'Credit', date: '30 Mar 2025', status: '✅' },
    { name: 'Credit Policy Manual', dept: 'Risk', date: '01 Mar 2025', status: '✅' }
  ],
  secretary: [
    { name: 'Board & Committee Minutes', dept: 'Sec', date: '15 Mar 2025', status: '✅' },
    { name: 'Credit Policy Manual', dept: 'Legal', date: '01 Mar 2025', status: '✅' }
  ],
  ops: [
    { name: 'Monthly Performance Reports', dept: 'Finance', date: '28 Feb 2025', status: '⚠' },
    { name: 'Process Flow Charts', dept: 'Ops', date: '20 Mar 2025', status: '✅' }
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

  // Distribute scenarios based on the user document requirements
  const filteredScenarios = activeRole.id === 'ceo' 
    ? SCENARIOS 
    : SCENARIOS.filter(s => s.roles.includes(activeRole.id));

  useEffect(() => {
    const isCurrentScenarioValid = activeRole.id === 'ceo' || activeScenario.roles.includes(activeRole.id);
    if (!isCurrentScenarioValid && filteredScenarios.length > 0) {
      setActiveScenario(filteredScenarios[0]);
    }
  }, [activeRole]);

  useEffect(() => {
    setMessages([{ 
      role: 'assistant', 
      content: `System initialized for **${activeScenario.name}** workspace. As **${activeRole.name}**, you have secure access to ${DATA_SOURCES[activeRole.id]?.length || 0} departmental data sources. Command processing via **${activeModel.name}**.`,
      timestamp: 'Just now',
      isHero: true
    }]);
    setCollabDoc(null);
    setViewMode('chat');
  }, [activeScenario, activeRole, activeModel]);

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
        content: `Analysis for ${activeScenario.name} successfully synthesized. I have identified critical outcomes based on internal policy and current fiscal data. Review the draft artifact below.`,
        hasArtifact: true,
        timestamp: 'Just now'
      }]);
    }, 1200);
  };

  const generateBoardMemo = () => {
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    setCollabDoc({
      type: 'board-memo',
      title: `Executive Brief: ${activeScenario.name}`,
      status: 'Draft (SAIV)',
      updated: 'Just now',
      metadata: {
        to: 'Board of Directors / Executive Management',
        from: activeRole.name,
        date: today,
        subject: `STRATEGIC ASSESSMENT: ${activeScenario.name} Status Report`
      },
      content: {
        execSummary: `Following a comprehensive SAIV synthesis of departmental data sources for ${activeScenario.name}, we have identified core drivers of current performance and quantified key risks. Repayment capacity and resource utilization align with internal policy thresholds.`,
        background: `This assessment utilizes verified internal data repositories specific to the ${activeRole.name} workspace, ensuring zero exposure to public intelligence models and maintaining 100% data residency.`,
        analysis: `1. PERFORMANCE METRICS: Analysis confirms positive trend alignment in ${activeScenario.name}.\n2. RISK MITIGATION: Strategic buffers are adequate based on current stress-testing modeling.\n3. SECURE PROCESSING: All data was encrypted at rest and in transit through the Vault infrastructure.`,
        recommendations: `1. Approve the reallocation strategy based on ${activeScenario.name} outcomes.\n2. Finalize the internal brief for board distribution.\n3. Update the Audit Register to reflect these findings.`
      }
    });
    setViewMode('collab');
    setIsRightPanelOpen(false);
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      {/* Sidebar - Tool Navigator */}
      <aside className={`border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${viewMode === 'collab' ? 'w-20' : 'w-72'} flex bg-slate-50`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0">
              <ShieldCheck size={26} className="text-white" />
            </div>
            {viewMode !== 'collab' && (
              <div className="animate-in fade-in duration-500 text-left">
                <span className="font-black text-2xl tracking-tighter block leading-none text-slate-900">SAIV</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Vault Intelligence</span>
              </div>
            )}
          </div>

          {viewMode !== 'collab' && (
            <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all mb-8 shadow-md">
              <Plus size={16} /> NEW ANALYSIS
            </button>
          )}
        </div>
        
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {viewMode !== 'collab' && (
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">
              {activeRole.id === 'ceo' ? 'All Enterprise Scenarios' : `${activeRole.name} Tools`}
            </p>
          )}
          {filteredScenarios.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => setActiveScenario(scenario)}
              className={`
                flex items-center gap-4 w-full rounded-xl transition-all p-3 text-sm group
                ${activeScenario.id === scenario.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-200 ring-1 ring-slate-100' : 'text-slate-500 hover:bg-white hover:text-slate-900'}
              `}
            >
              <span className={`shrink-0 ${activeScenario.id === scenario.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {scenario.icon}
              </span>
              {viewMode !== 'collab' && <span className="flex-1 text-left truncate font-bold">{scenario.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className={`flex items-center gap-4 w-full rounded-xl p-3 text-slate-500 hover:bg-white hover:text-slate-900 transition-all ${viewMode === 'collab' ? 'justify-center' : ''}`}>
            <Settings size={20} />
            {viewMode !== 'collab' && <span className="font-bold text-sm">Vault Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-white">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full shrink-0">
              <Lock size={12} className="text-indigo-600" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Secure Protocol</span>
            </div>
            
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
            
            <div className="flex items-center gap-2 text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">Active Role:</span>
              <div className="relative">
                <button 
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all border border-slate-200 shadow-sm"
                >
                  <span className="text-sm">{activeRole.icon}</span>
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{activeRole.name}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                
                {showRoleMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl overflow-hidden z-[100] shadow-xl animate-in fade-in zoom-in-95 duration-150">
                    <p className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Workspace Selection</p>
                    {ROLES.map(role => (
                      <button
                        key={role.id}
                        onClick={() => { setActiveRole(role); setShowRoleMenu(false); }}
                        className={`flex items-center gap-3 w-full p-4 text-left hover:bg-slate-50 transition-colors ${activeRole.id === role.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                      >
                        <span className="text-xl">{role.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{role.name}</p>
                          <p className="text-[9px] text-slate-500 uppercase font-medium mt-0.5 tracking-tighter">
                            {role.id === 'ceo' ? 'Global Suite' : `Role Restricted`}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all shadow-sm"
              >
                <Cpu size={14} className="text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{activeModel.name}</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>
              
              {showModelMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl overflow-hidden z-[100] shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <p className="px-4 py-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">LLM Selector</p>
                  {MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => { setActiveModel(model); setShowModelMenu(false); }}
                      className={`flex items-center justify-between w-full p-3 text-left hover:bg-slate-50 transition-colors ${activeModel.id === model.id ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600'}`}
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] truncate font-bold">{model.name}</p>
                        <p className="text-[9px] font-medium opacity-60 tracking-tighter uppercase">{model.provider}</p>
                      </div>
                      {activeModel.id === model.id && <CheckCircle2 size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className={`p-2 rounded-lg transition-all ${isRightPanelOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {isRightPanelOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat/Scenario Pane */}
          <div className={`flex-1 flex flex-col transition-all duration-300 ${viewMode === 'collab' ? 'max-w-md border-r border-slate-200 bg-slate-50' : 'max-w-full'}`}>
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
              <div className={`mx-auto w-full py-12 px-6 space-y-12 ${viewMode === 'collab' ? 'max-w-md' : 'max-w-3xl'}`}>
                {messages.map((m, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-start gap-5 text-left">
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-[11px] font-black tracking-tighter shadow-sm ${m.role === 'assistant' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-slate-200 text-slate-700'}`}>
                        {m.role === 'assistant' ? 'SAIV' : 'YOU'}
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex items-center gap-2">
                           <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em]">{m.role === 'assistant' ? 'Intelligence' : 'User Session'}</span>
                           <span className="text-[10px] text-slate-400 font-medium">• {m.timestamp}</span>
                        </div>
                        <div className="text-[16px] leading-relaxed text-slate-700">
                          {m.content}
                        </div>
                        
                        {m.isHero && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            <HeroButton 
                              title={`Analyze ${activeScenario.name}`} 
                              desc={`Using Internal Data & ${activeModel.name}`} 
                              onClick={() => setInput(activeScenario.prompt)} 
                            />
                            <HeroButton 
                              title="Departmental Audit" 
                              desc="Check for policy variance" 
                              onClick={() => setInput(`Perform an audit of the current ${activeScenario.name} context against internal manuals.`)} 
                            />
                          </div>
                        )}

                        {m.hasArtifact && viewMode === 'chat' && (
                          <div className="mt-8 pt-8 border-t border-slate-200 space-y-6">
                            <div className="flex flex-wrap gap-3">
                              <ActionButton icon={<Edit3 size={14} />} label="Open in Collaboration" primary onClick={() => generateBoardMemo()} />
                              <ActionButton icon={<Users size={14} />} label="Invite Reviewer" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <ArtifactButton icon={<FileText size={18} className="text-blue-600" />} label="Board Memo" onClick={generateBoardMemo} />
                              <ArtifactButton icon={<Presentation size={18} className="text-orange-600" />} label="Export PowerPoint" />
                              <ArtifactButton icon={<CheckSquare size={18} className="text-green-600" />} label="Action Tracker" />
                              <ArtifactButton icon={<Library size={18} className="text-purple-600" />} label="Knowledge Vault" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-6 bg-gradient-to-t from-white via-white to-transparent shrink-0">
              <div className={`mx-auto ${viewMode === 'collab' ? 'max-w-full' : 'max-w-3xl'}`}>
                <div className={`relative transition-all duration-300 rounded-2xl bg-white border-2 border-slate-200 shadow-lg ${isFocused ? 'border-indigo-600 ring-4 ring-indigo-50' : ''}`}>
                  <textarea 
                    className="w-full bg-transparent border-none outline-none resize-none text-[15px] p-5 pb-16 min-h-[120px] placeholder:text-slate-400 text-slate-900"
                    placeholder={`Command ${activeModel.name} for ${activeScenario.name}...`}
                    value={input}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <div className="absolute bottom-4 left-5 flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-600 tracking-wider uppercase">
                      <Database size={13} /> Internal Sources Connected
                    </button>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <button onClick={handleSend} disabled={!input.trim()} className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg disabled:opacity-30 hover:bg-indigo-700 transition-all active:scale-95">
                      <Send size={20} />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-4 font-medium tracking-wide italic">
                   "SAIV delivers real executive outcomes that public AI tools cannot safely provide."
                </p>
              </div>
            </div>
          </div>

          {/* Collaboration Pane */}
          {viewMode === 'collab' && collabDoc && (
            <div className="flex-1 flex flex-col bg-slate-50 animate-in slide-in-from-right duration-500 border-l border-slate-200">
              <div className="flex items-center justify-between p-6 bg-white border-b border-slate-200 shadow-sm z-10">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-slate-50 rounded-xl text-indigo-600 border border-slate-200 shadow-sm">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">{collabDoc.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest border border-slate-200">{collabDoc.status}</span>
                      <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1"><Clock size={12} /> {collabDoc.updated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <Printer size={16} /> Print
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-xs font-black text-white hover:bg-indigo-700 transition-all shadow-lg">
                    <FileDown size={16} /> Export Final
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-slate-100">
                <div className="max-w-4xl mx-auto">
                  <div className="p-16 bg-white text-gray-900 shadow-2xl rounded-sm min-h-[1100px] font-serif leading-relaxed relative text-left border border-slate-200">
                    <div className="absolute top-10 right-12 text-[10px] text-indigo-600 font-black tracking-widest uppercase border-2 border-indigo-600 px-4 py-1.5 opacity-60 rotate-3 select-none font-sans">
                      PROTECTED ASSET
                    </div>

                    <div className="mb-16 border-b-8 border-slate-900 pb-8 text-left">
                      <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-slate-950 font-sans">Internal Memorandum</h1>
                      <div className="flex items-center gap-4">
                         <span className="text-xs font-black bg-slate-900 text-white px-4 py-1.5 uppercase tracking-widest font-sans">Confidential</span>
                         <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] font-sans">Corporate Intelligence Unit</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] gap-y-6 mb-16 text-[16px] text-left">
                      <span className="font-black uppercase text-slate-400 tracking-[0.2em] text-[11px] font-sans">To:</span>
                      <span className="font-black text-slate-950 underline underline-offset-4 font-sans">{collabDoc.metadata.to}</span>
                      
                      <span className="font-black uppercase text-slate-400 tracking-[0.2em] text-[11px] font-sans">From:</span>
                      <span className="font-black text-slate-950 underline underline-offset-4 font-sans">{collabDoc.metadata.from}</span>
                      
                      <span className="font-black uppercase text-slate-400 tracking-[0.2em] text-[11px] font-sans">Date:</span>
                      <span className="font-bold text-slate-700 font-sans">{collabDoc.metadata.date}</span>
                      
                      <span className="font-black uppercase text-slate-400 tracking-[0.2em] text-[11px] font-sans">Subject:</span>
                      <span className="font-black text-slate-950 border-b-2 border-slate-100 pb-1 font-sans">{collabDoc.metadata.subject}</span>
                    </div>

                    <div className="space-y-12 text-left font-serif">
                      <MemoSection title="1. Executive Summary" content={collabDoc.content.execSummary} />
                      <MemoSection title="2. Background & Scope" content={collabDoc.content.background} />
                      <MemoSection title="3. Data-Driven Analysis" content={collabDoc.content.analysis} />
                      
                      <section className="bg-indigo-50 p-10 border-l-[8px] border-indigo-600 rounded-r-xl shadow-inner font-sans">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-indigo-950 mb-6">4. Key Recommendations</h2>
                        <div className="whitespace-pre-line text-indigo-900 font-bold italic leading-loose text-lg font-serif">{collabDoc.content.recommendations}</div>
                      </section>
                    </div>

                    <div className="mt-24 pt-12 border-t border-slate-100 flex justify-between items-end font-sans">
                      <div className="space-y-2 text-left">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">Vault Audit Log</p>
                        <p className="text-[11px] font-mono text-indigo-500 font-black tracking-tighter">SID_{activeScenario.id.toUpperCase()}_{activeModel.id.toUpperCase()}_REV2</p>
                      </div>
                      <div className="text-right">
                         <div className="text-xs font-black text-slate-950 uppercase tracking-widest mb-3">Certified Internal Document</div>
                         <div className="h-1.5 w-40 bg-indigo-600 ml-auto rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Data Vault Panel */}
      {viewMode === 'chat' && isRightPanelOpen && (
        <aside className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 animate-in slide-in-from-right duration-300">
          <div className="p-6 text-left">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
              <Database size={16} className="text-indigo-600" /> Internal Data Vault
            </h3>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
                  <ShieldCheck size={40} className="text-indigo-600" />
                </div>
                <p className="text-[10px] text-slate-400 mb-1.5 font-black uppercase tracking-widest">Active Context</p>
                <p className="text-[15px] font-black text-slate-900">{activeScenario.name}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-500">
                    {DATA_SOURCES[activeRole.id]?.length || 0} Connected Repositories
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="px-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source Transparency</p>
                {DATA_SOURCES[activeRole.id]?.map((source, idx) => (
                  <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-indigo-600/40 hover:shadow-sm transition-all flex items-center justify-between group cursor-default">
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] font-black text-slate-800 truncate leading-tight">{source.name}</span>
                        <span className="text-[10px]">{source.status}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400">{source.dept} • {source.date}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-slate-200 bg-slate-50 text-indigo-600 focus:ring-indigo-600 h-3.5 w-3.5 shrink-0 shadow-sm" />
                  </div>
                ))}
              </div>
              
              <div className="mt-10 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
                 <p className="text-[11px] text-indigo-800 font-bold leading-relaxed italic text-left">
                   "Multiplying Intelligence. Securing Advantage."
                 </p>
              </div>
            </div>
          </div>
        </aside>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
};

const MemoSection = ({ title, content }) => (
  <section className="text-left mb-12 last:mb-0 font-sans">
    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950 border-l-[6px] border-slate-900 pl-6 mb-6">{title}</h2>
    <p className="text-slate-800 text-[18px] whitespace-pre-line leading-[1.8] font-serif">{content}</p>
  </section>
);

const HeroButton = ({ title, desc, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-start p-5 rounded-2xl border-2 border-slate-100 bg-white hover:border-indigo-600 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group">
    <div className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5 leading-tight">{title}</div>
    <div className="text-[11px] text-slate-400 font-bold leading-snug">{desc}</div>
  </button>
);

const ActionButton = ({ icon, label, primary = false, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[13px] font-black transition-all border shadow-md active:scale-95 ${primary ? 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
    {icon} {label}
  </button>
);

const ArtifactButton = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-4 w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-indigo-600 hover:bg-white hover:shadow-md transition-all text-left group border-dashed">
    <div className="p-2.5 bg-white rounded-xl shrink-0 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-[13px] font-black text-slate-800 tracking-tight leading-tight">{label}</span>
  </button>
);

const NavItem = ({ icon, label, active = false, collapsed = false }) => (
  <button className={`flex items-center gap-4 w-full rounded-xl transition-all p-3 text-sm font-bold ${active ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}>
    <span className={`shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{icon}</span>
    {!collapsed && <span className="flex-1 text-left truncate">{label}</span>}
  </button>
);

export default App;