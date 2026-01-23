import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Printer, 
  Share2, 
  Send, 
  Search, 
  Lock, 
  Server, 
  RefreshCw,
  Cpu,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Theme Constants ---
const COLORS = {
  bg: 'bg-[#FDFCF5]',     // Cream
  sidebar: 'bg-[#1E293B]', // Slate
  primary: 'bg-[#064E3B]', // Deep Emerald
  primaryText: 'text-[#064E3B]',
  accent: 'text-[#D97706]', // Muted Gold
  accentBorder: 'border-[#D97706]',
  lightGray: 'bg-[#F8FAFC]'
};

// --- Mock Data ---
const MOCK_RAW_DATA = `Borrower: Zenith Construction Ltd
RC Number: 1492201
Director: Emeka Okafor (BVN: 22190983211)
Request: N250,000,000 Term Loan
Collateral: Warehouse at Plot 4, Agbara Estate`;

const MOCK_SANITIZED_DATA = `Borrower: [ORG_1]
RC Number: [REDACTED_ID_1]
Director: [PERSON_A] (BVN: [REDACTED_ID_2])
Request: [AMT_1] Term Loan
Collateral: Warehouse at [LOC_1]`;

const MOCK_REASONING = `> Initiating Risk Assessment Protocol...
> Analyzing Debt Service Coverage Ratio (DSCR)...
> DSCR calculated at 1.45x (Pass > 1.25x).
> Checking CBN Single Obligor Limit...
> Exposure is within 15% shareholder funds cap.
> Analyzing [LOC_1] collateral liquidity...
> Applied "Industrial Zone" premium to valuation.
> Flagging potential FX exposure on raw material imports.
> Generating recommendation...`;

// --- Components ---

const Sidebar = ({ activeGem }) => (
  <div className={`w-[250px] flex-shrink-0 ${COLORS.sidebar} text-white flex flex-col h-screen border-r border-slate-700`}>
    <div className="p-6 border-b border-slate-700">
      <div className="flex items-center gap-2">
        <Shield className="text-[#D97706]" size={24} />
        <h1 className="font-serif font-bold text-lg tracking-wide">SAIV Vault</h1>
      </div>
      <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Sovereign AI</p>
    </div>

    <div className="flex-1 overflow-y-auto py-6">
      <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase">Business Gems</div>
      <div className="space-y-1">
        <GemItem icon={FileText} label="Credit RiskLens" active={true} />
        <GemItem icon={Shield} label="Legal Guardian" />
        <GemItem icon={Search} label="Audit Master" />
      </div>
    </div>

    <div className="p-4 border-t border-slate-700">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
          <User size={16} />
        </div>
        <div>
          <div className="text-sm font-medium">Exec. User</div>
          <div className="text-xs text-slate-400">Chief Risk Office</div>
        </div>
      </div>
    </div>
  </div>
);

const GemItem = ({ icon: Icon, label, active }) => (
  <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${active ? 'bg-[#064E3B]/50 border-r-4 border-[#D97706] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
    <Icon size={18} className={active ? 'text-[#D97706]' : ''} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const UploadWidget = ({ onAnalyze }) => (
  <div className="max-w-2xl mx-auto mt-20 text-center">
    <div className="mb-8">
      <h2 className="font-serif text-3xl font-bold text-[#064E3B] mb-2">New Credit Assessment</h2>
      <p className="text-slate-500">Upload the borrower's application pack to begin the Sovereign Analysis.</p>
    </div>

    <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 bg-white/50 hover:bg-white transition-all cursor-pointer group">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
        <Upload className="text-[#064E3B]" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-slate-700">Drag & Drop Documents Here</h3>
      <p className="text-sm text-slate-400 mt-2">Required: Financial Stmts, Bureau Report, Application Letter</p>
      
      <div className="mt-8 flex justify-center gap-4">
        <FileBadge label="Zenith_Fin_2025.pdf" />
        <FileBadge label="CRC_Report_Q4.pdf" />
        <FileBadge label="App_Letter.pdf" />
      </div>
    </div>

    <button 
      onClick={onAnalyze}
      className="mt-8 bg-[#064E3B] text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:bg-[#053d2e] transition-colors flex items-center gap-2 mx-auto"
    >
      <Shield size={18} />
      Analyze Application
    </button>
  </div>
);

const FileBadge = ({ label }) => (
  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded text-xs font-medium text-slate-600 border border-slate-200">
    <FileText size={12} />
    {label}
  </div>
);

const LoadingState = ({ step }) => (
  <div className="h-full flex flex-col items-center justify-center">
    <div className="w-24 h-24 relative mb-8">
      <motion.div 
        className="absolute inset-0 border-4 border-slate-200 rounded-full"
      />
      <motion.div 
        className="absolute inset-0 border-4 border-[#D97706] rounded-full border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {step === 'sanitizing' && <Lock className="text-[#064E3B]" size={32} />}
        {step === 'reasoning' && <Cpu className="text-[#064E3B]" size={32} />}
        {step === 'rehydrating' && <RefreshCw className="text-[#064E3B]" size={32} />}
      </div>
    </div>
    
    <h3 className="text-xl font-serif font-bold text-[#064E3B] mb-2">
      {step === 'sanitizing' && 'Engaging Privacy Shield...'}
      {step === 'reasoning' && 'Sovereign Logic Processing...'}
      {step === 'rehydrating' && 'Rehydrating Sensitive Data...'}
    </h3>
    <p className="text-slate-500 text-sm">Processing securely within Lagos Gateway</p>
  </div>
);

const ReportView = () => (
  <div className="max-w-4xl mx-auto h-full flex flex-col">
    {/* Document Header */}
    <div className="bg-white p-8 shadow-sm border-b border-slate-100 flex-shrink-0">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-serif text-3xl font-bold text-[#064E3B]">Credit Assessment Memo</h1>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded border border-green-200 uppercase tracking-wider">Approved</span>
          </div>
          <p className="text-slate-500 font-medium">Subject: Zenith Construction Ltd | Facility: N250m Term Loan</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-serif font-bold text-[#D97706]">B+</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Risk Rating</div>
        </div>
      </div>
    </div>

    {/* Document Body */}
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white/50">
      
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <MetricCard label="DSCR" value="1.45x" status="pass" sub="Policy > 1.25x" />
        <MetricCard label="Leverage" value="0.8x" status="pass" sub="Within Cap" />
        <MetricCard label="Collateral Coverage" value="130%" status="pass" sub="Agbara Warehouse" />
      </div>

      {/* Analysis Sections */}
      <section>
        <h3 className="font-serif text-xl font-bold text-[#064E3B] mb-3 border-b border-slate-200 pb-2">1. Executive Summary</h3>
        <p className="text-slate-700 leading-relaxed text-sm">
          Zenith Construction demonstrates strong capability to service the requested facility. Cash flow projections for 2026 are robust, supported by two new government contracts. The requested N250m is primarily for equipment acquisition which directly drives revenue. 
          <span className="ml-1 text-[#D97706] cursor-pointer hover:underline font-medium">[Ref: Biz_Plan_Pg4]</span>
        </p>
      </section>

      <section>
        <h3 className="font-serif text-xl font-bold text-[#064E3B] mb-3 border-b border-slate-200 pb-2">2. Risk Factors & Mitigants</h3>
        <div className="space-y-4">
          <RiskItem 
            title="FX Exposure on Imports" 
            desc="Raw material imports constitute 30% of COGS. Potential naira devaluation could compress margins."
            mitigant="Borrower has agreed to execute an FX Forward Contract for Q3 imports."
          />
          <RiskItem 
            title="Key Person Risk" 
            desc="Operations heavily reliant on the Technical Director."
            mitigant="Keyman Insurance policy is active and assigned to the Bank."
          />
        </div>
      </section>
      
      <div className="h-12"></div> {/* Spacer */}
    </div>
  </div>
);

const MetricCard = ({ label, value, status, sub }) => (
  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-1">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      {status === 'pass' ? <CheckCircle size={14} className="text-green-600" /> : <AlertTriangle size={14} className="text-amber-500" />}
    </div>
    <div className="text-2xl font-serif font-bold text-slate-800">{value}</div>
    <div className="text-xs text-slate-500 mt-1">{sub}</div>
  </div>
);

const RiskItem = ({ title, desc, mitigant }) => (
  <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-[#D97706]">
    <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
    <p className="text-xs text-slate-600 mb-2">{desc}</p>
    <div className="text-xs font-medium text-[#064E3B] flex items-center gap-1">
      <Shield size={12} />
      Mitigant: {mitigant}
    </div>
  </div>
);

const RightPanel = ({ appState, privacyStep }) => (
  <div className={`w-[350px] bg-slate-50 border-l border-slate-200 flex flex-col h-screen transition-all duration-500`}>
    {/* Top Half: Privacy Shield */}
    <div className="flex-1 flex flex-col border-b border-slate-200 min-h-[50%]">
      <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Lock size={12} />
          Privacy Shield Monitor
        </span>
        <div className="flex gap-1">
          <div className={`w-2 h-2 rounded-full ${privacyStep === 'sanitizing' ? 'bg-[#D97706] animate-pulse' : 'bg-slate-200'}`} />
          <div className={`w-2 h-2 rounded-full ${privacyStep === 'reasoning' ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'}`} />
          <div className={`w-2 h-2 rounded-full ${privacyStep === 'rehydrating' ? 'bg-[#064E3B] animate-pulse' : 'bg-slate-200'}`} />
        </div>
      </div>
      
      <div className="flex-1 bg-[#1E293B] p-4 font-mono text-xs overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#064E3B] via-[#D97706] to-[#064E3B] opacity-50" />
        
        {/* Dynamic Code Display */}
        <AnimatePresence mode="wait">
          {privacyStep === 'sanitizing' && (
            <motion.div 
              key="sanitizing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-slate-300"
            >
              <div className="text-[#D97706] mb-2">// INGESTING PAYLOAD...</div>
              {MOCK_RAW_DATA.split('\n').map((line, i) => (
                <div key={i} className="mb-1 opacity-50">{line}</div>
              ))}
              <div className="text-[#D97706] mt-4 mb-2">// DETECTING PII & TOKENIZING...</div>
              {MOCK_SANITIZED_DATA.split('\n').map((line, i) => (
                <div key={i} className="mb-1 text-green-400">{line}</div>
              ))}
            </motion.div>
          )}

          {privacyStep === 'reasoning' && (
            <motion.div 
              key="reasoning"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-blue-300"
            >
              <div className="text-blue-400 mb-2">// SENDING TO LLM (STATELESS)...</div>
              <div className="mb-4 text-slate-400 border-l-2 border-slate-600 pl-2">
                {MOCK_SANITIZED_DATA}
              </div>
              <div className="text-blue-400 mb-2">// REASONING STREAM...</div>
              <Typewriter text={MOCK_REASONING} />
            </motion.div>
          )}

          {privacyStep === 'rehydrating' && (
            <motion.div 
              key="rehydrating"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-slate-300"
            >
               <div className="text-[#064E3B] mb-2 text-green-400">// RECEIVING RESPONSE...</div>
               <div className="text-[#D97706] mb-2">// REHYDRATING TOKENS [ORG_1] -&gt; "Zenith"...</div>
               <div className="p-2 bg-slate-800 rounded text-slate-300">
                 Status: Success<br/>
                 Latency: 1.2s<br/>
                 PII Leakage: 0%
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Idle State for Privacy Shield when Report is ready */}
        {appState === 'report' && (
           <div className="text-green-500 flex flex-col items-center justify-center h-full">
             <CheckCircle size={32} className="mb-2" />
             <div>Transmission Secure</div>
             <div className="text-slate-500">Vault Locked</div>
           </div>
        )}
      </div>
    </div>

    {/* Bottom Half: Actions */}
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-3 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
        Actions
      </div>
      <div className="p-6 space-y-4">
        <ActionButton icon={FileText} label="Generate PDF Report" disabled={appState !== 'report'} />
        <ActionButton icon={Printer} label="Print Summary" disabled={appState !== 'report'} />
        <ActionButton icon={Share2} label="Share Secure Link" disabled={appState !== 'report'} />
        
        {appState === 'report' && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            <strong>Executive Note:</strong> This assessment utilized the 2026 Credit Policy (v2.1).
          </div>
        )}
      </div>
    </div>
  </div>
);

const ActionButton = ({ icon: Icon, label, disabled }) => (
  <button 
    disabled={disabled}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${disabled ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:border-[#064E3B] hover:text-[#064E3B] shadow-sm'}`}
  >
    <Icon size={16} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// Utility for typing effect
const Typewriter = ({ text }) => {
  const [display, setDisplay] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplay(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [text]);

  return <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{display}</div>;
};

// --- Main App Component ---

export default function RiskLensApp() {
  const [appState, setAppState] = useState('upload'); // upload | processing | report
  const [privacyStep, setPrivacyStep] = useState('idle'); // idle | sanitizing | reasoning | rehydrating
  const [chatInput, setChatInput] = useState('');

  const startAnalysis = () => {
    setAppState('processing');
    
    // Sequence the Privacy Shield Animation
    setPrivacyStep('sanitizing');
    
    setTimeout(() => setPrivacyStep('reasoning'), 2000);
    setTimeout(() => setPrivacyStep('rehydrating'), 5500);
    setTimeout(() => {
      setPrivacyStep('idle');
      setAppState('report');
    }, 7500);
  };

  return (
    <div className={`flex h-screen ${COLORS.bg} font-sans text-slate-800 overflow-hidden`}>
      {/* Pane 1: Left Sidebar */}
      <Sidebar activeGem="Credit RiskLens" />

      {/* Pane 2: Center Workspace */}
      <div className="flex-1 flex flex-col relative">
        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {appState === 'upload' && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <UploadWidget onAnalyze={startAnalysis} />
              </motion.div>
            )}

            {appState === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full"
              >
                <LoadingState step={privacyStep} />
              </motion.div>
            )}

            {appState === 'report' && (
              <motion.div 
                key="report"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full pb-20" // Padding for chat bar
              >
                <ReportView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Chat Bar (Sticky) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FDFCF5] via-[#FDFCF5] to-transparent">
          <div className="max-w-3xl mx-auto relative shadow-lg rounded-xl bg-white border border-slate-200 flex items-center p-2">
            <input 
              type="text" 
              placeholder={appState === 'report' ? "Ask follow-up questions or request adjustments..." : "Analysis not yet started..."}
              disabled={appState !== 'report'}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2 bg-transparent outline-none text-sm disabled:cursor-not-allowed"
            />
            <button 
              disabled={appState !== 'report'}
              className={`p-2 rounded-lg transition-colors ${appState === 'report' ? 'bg-[#064E3B] text-white hover:bg-[#053d2e]' : 'bg-slate-100 text-slate-300'}`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Pane 3: Right Panel */}
      <RightPanel appState={appState} privacyStep={privacyStep} />
    </div>
  );
}