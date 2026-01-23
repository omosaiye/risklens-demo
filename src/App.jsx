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
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Design Tokens ---
const THEME = {
  bg: 'bg-[#F9FAFB]',       // Clean Ultra-Light Gray (Paper-like)
  card: 'bg-white',
  textMain: 'text-[#111827]',
  textMuted: 'text-[#6B7280]',
  accent: 'text-[#064E3B]', // Deep Emerald (Sovereign)
  gold: 'text-[#D97706]',   // Gold Highlights
  border: 'border-[#E5E7EB]',
};

// --- Mock Data: Secure Vault Files ---
const SECURE_DRIVE_FILES = [
  { id: 1, name: 'Zenith_Construction_Fin_2025.pdf', type: 'Financials', date: 'Jan 12, 2026' },
  { id: 2, name: 'CRC_Credit_Bureau_Report.pdf', type: 'Bureau', date: 'Jan 14, 2026' },
  { id: 3, name: 'Lagos_Land_Registry_Search.pdf', type: 'Legal', date: 'Jan 10, 2026' },
  { id: 4, name: 'CBN_Prudential_Guidelines_2025.pdf', type: 'Regulation', date: 'Dec 01, 2025' },
  { id: 5, name: 'Global_Oil_Price_Forecast_Q1.pdf', type: 'Market Data', date: 'Jan 02, 2026' },
];

// --- Mock Citations ---
const CITATIONS = {
  1: { source: 'CBN_Prudential_Guidelines_2025.pdf', text: 'Sec 3.4: Single Obligor Limit shall not exceed 20% of unimpaired shareholders\' funds.' },
  2: { source: 'Zenith_Construction_Fin_2025.pdf', text: 'Page 14: Projected cash flow for Q3 2026 includes N400m from FG Road Contract.' },
  3: { source: 'Lagos_Land_Registry_Search.pdf', text: 'Status: Unencumbered. Registered Title No: LAG/2021/9928.' }
};

// --- Main Application ---
export default function RiskLensComet() {
  const [query, setQuery] = useState('');
  const [thread, setThread] = useState([]); // Stores the conversation history
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [appState, setAppState] = useState('idle'); // idle, processing, viewing

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [thread]);

  // Handler: Submit Query
  const handleSubmit = async () => {
    if (!query.trim() && selectedFiles.length === 0) return;

    const newQuery = { 
      type: 'user', 
      content: query, 
      files: [...selectedFiles] 
    };
    
    setThread(prev => [...prev, newQuery]);
    setQuery('');
    setSelectedFiles([]);
    setAppState('processing');

    // Simulate AI Response with Reasoning
    // We add a placeholder "AI" message that will stream updates
    setThread(prev => [...prev, { 
      type: 'ai', 
      isThinking: true, 
      steps: ['sanitizing'], // Start mock steps
      content: null 
    }]);

    // Simulate the "Privacy Shield" Pipeline
    await delay(1500);
    updateLastMessage({ steps: ['sanitizing', 'reasoning'] });
    
    await delay(2500);
    updateLastMessage({ steps: ['sanitizing', 'reasoning', 'rehydrating'] });
    
    await delay(1500);
    updateLastMessage({ 
      isThinking: false,
      content: MOCK_CREDIT_MEMO,
      sources: [SECURE_DRIVE_FILES[0], SECURE_DRIVE_FILES[3], SECURE_DRIVE_FILES[2]]
    });
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
    <div className={`min-h-screen ${THEME.bg} font-sans text-slate-800 flex flex-col`}>
      
      {/* 1. Minimal Header */}
      <header className="sticky top-0 z-50 bg-[#F9FAFB]/80 backdrop-blur-md border-b border-transparent transition-all duration-300 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer">
          <Shield className="text-[#064E3B] fill-[#064E3B]/10" size={24} />
          <span className="font-serif font-bold text-xl tracking-tight text-[#064E3B]">RiskLens</span>
        </div>
        <div className="flex items-center gap-4">
           <button className="text-sm font-medium text-slate-500 hover:text-[#064E3B]">History</button>
           <div className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-xs font-bold">EO</div>
        </div>
      </header>

      {/* 2. Main Scroll Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pb-40 pt-10">
        
        {/* Empty State / Welcome */}
        {thread.length === 0 && (
          <div className="text-center mt-20 mb-10">
            <h1 className="font-serif text-4xl text-[#111827] mb-4">Good afternoon, Emeka.</h1>
            <p className="text-slate-500 text-lg">Ready to analyze a new credit opportunity?</p>
            
            {/* Suggested Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <SuggestionPill icon={FileText} text="New Credit Assessment" onClick={() => setQuery("Analyze this credit application for Zenith Construction...")} />
              <SuggestionPill icon={Search} text="Review Regulatory Compliance" />
              <SuggestionPill icon={Database} text="Search Golden Memos" />
            </div>
          </div>
        )}

        {/* Conversation Thread */}
        <div className="space-y-10">
          {thread.map((msg, idx) => (
            <div key={idx}>
              {msg.type === 'user' ? (
                <UserMessage content={msg.content} files={msg.files} />
              ) : (
                <AiMessage 
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

      </main>

      {/* 3. Floating Input Bar (Sticky Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB] to-transparent z-40">
        <div className="max-w-3xl mx-auto">
          {/* Selected Files Chips */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedFiles.map(file => (
                <div key={file.id} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm text-sm text-slate-700">
                  <FileText size={14} className="text-[#D97706]" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button onClick={() => setSelectedFiles(files => files.filter(f => f.id !== file.id))} className="hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* The Input Box */}
          <div className="relative bg-white shadow-xl rounded-2xl border border-slate-200 focus-within:border-[#064E3B] focus-within:ring-1 focus-within:ring-[#064E3B] transition-all">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything..."
              className="w-full pl-4 pr-16 py-4 bg-transparent outline-none text-base resize-none max-h-40 min-h-[60px]"
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }}}
            />
            
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
               <button 
                 onClick={() => setIsVaultOpen(true)}
                 className="flex items-center gap-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-600 px-2 py-1 rounded transition-colors border border-slate-200"
               >
                 <Paperclip size={14} />
                 Attach from Vault
               </button>
            </div>

            <div className="absolute bottom-3 right-3">
              <button 
                onClick={handleSubmit}
                disabled={!query.trim() && selectedFiles.length === 0}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${(!query.trim() && selectedFiles.length === 0) ? 'bg-slate-200 text-slate-400' : 'bg-[#064E3B] text-white hover:bg-[#053d2e]'}`}
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">
            Sovereign AI uses <span className="font-semibold text-slate-500">Privacy Shield™</span> to sanitize data before inference.
          </p>
        </div>
      </div>

      {/* Vault Modal */}
      <AnimatePresence>
        {isVaultOpen && (
          <VaultModal 
            onClose={() => setIsVaultOpen(false)} 
            onSelect={(file) => {
              if (!selectedFiles.find(f => f.id === file.id)) {
                setSelectedFiles([...selectedFiles, file]);
              }
              setIsVaultOpen(false);
            }} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// --- Sub-Components ---

const UserMessage = ({ content, files }) => (
  <div className="flex flex-col items-end mb-8">
    <div className="bg-[#F3F4F6] text-[#111827] px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] text-lg leading-relaxed shadow-sm">
      {content}
    </div>
    {files && files.length > 0 && (
      <div className="mt-2 flex flex-col items-end gap-1">
        {files.map(file => (
          <div key={file.id} className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">
            <FileText size={12} /> {file.name}
          </div>
        ))}
      </div>
    )}
  </div>
);

const AiMessage = ({ content, isThinking, steps, sources }) => {
  return (
    <div className="flex gap-4 mb-8 w-full">
      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
        <Shield size={16} className="text-[#064E3B]" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-[#111827] mb-2">RiskLens</div>
        
        {/* Reasoning Accordion (The Privacy Shield Visual) */}
        <ReasoningAccordion steps={steps} isThinking={isThinking} />

        {/* Sources Row */}
        {!isThinking && sources && (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {sources.map((source, i) => (
              <SourceCard key={i} source={source} index={i + 1} />
            ))}
          </div>
        )}

        {/* Main Content */}
        {!isThinking && content ? (
          <div className="prose prose-slate max-w-none text-[16px] leading-7 text-[#374151]">
            <FormattedOutput text={content} />
            
            {/* Action Chips */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
              <button className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#064E3B] transition-colors">
                <Share size={14} /> Share
              </button>
              <button className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#064E3B] transition-colors">
                <Printer size={14} /> Executive PDF
              </button>
              <button className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#064E3B] transition-colors">
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// The "Thinking" Accordion - Critical for Sovereign Trust
const ReasoningAccordion = ({ steps, isThinking }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // Auto-collapse when done thinking
  useEffect(() => {
    if (!isThinking) setIsOpen(false);
  }, [isThinking]);

  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
      >
        {isThinking ? (
          <span className="flex items-center gap-2 animate-pulse text-[#D97706]">
            <div className="w-2 h-2 bg-[#D97706] rounded-full" />
            Analyzing Sovereign Data...
          </span>
        ) : (
          <span className="flex items-center gap-2 text-[#064E3B]">
            <CheckCircle2 size={14} />
            Processed Securely
          </span>
        )}
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-4 border-l-2 border-slate-100 mt-2 space-y-2">
              <ReasoningStep 
                label="Sanitizing Sensitive PII (BVN, Names)" 
                status={steps.includes('sanitizing') ? 'done' : 'pending'} 
                active={isThinking && steps.length === 1}
              />
              <ReasoningStep 
                label="Consulting Sovereign Logic (Local Vector DB)" 
                status={steps.includes('reasoning') ? 'done' : 'pending'} 
                active={isThinking && steps.length === 2}
              />
              <ReasoningStep 
                label="Rehydrating & Formatting Response" 
                status={steps.includes('rehydrating') ? 'done' : 'pending'} 
                active={isThinking && steps.length === 3}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReasoningStep = ({ label, status, active }) => (
  <div className={`flex items-center gap-2 text-xs ${status === 'done' ? 'text-slate-600' : 'text-slate-300'}`}>
    {status === 'done' ? (
      <Lock size={12} className={active ? "text-[#D97706] animate-pulse" : "text-[#064E3B]"} />
    ) : (
      <div className="w-3 h-3 rounded-full border border-slate-200" />
    )}
    <span>{label}</span>
  </div>
);

const SourceCard = ({ source, index }) => (
  <div className="min-w-[160px] max-w-[180px] bg-white border border-slate-200 rounded-lg p-3 hover:bg-slate-50 cursor-pointer transition-colors group shadow-sm">
    <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">{source.type}</div>
    <div className="font-semibold text-xs text-slate-700 line-clamp-2 mb-2 leading-tight group-hover:text-[#064E3B]">{source.name}</div>
    <div className="flex items-center gap-1">
      <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[9px] font-bold">{index}</div>
      <div className="text-[10px] text-slate-400">{source.date}</div>
    </div>
  </div>
);

const SuggestionPill = ({ icon: Icon, text, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#D97706] px-4 py-2 rounded-full text-sm text-slate-600 shadow-sm hover:shadow-md transition-all"
  >
    <Icon size={16} className="text-slate-400" />
    {text}
  </button>
);

const VaultModal = ({ onClose, onSelect }) => (
  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#F9FAFB]">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Database size={18} className="text-[#064E3B]" />
          Internal Secure Drive
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full"><X size={18} /></button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-2">
        {SECURE_DRIVE_FILES.map(file => (
          <div 
            key={file.id} 
            onClick={() => onSelect(file)}
            className="flex items-center gap-3 p-3 hover:bg-[#F3F4F6] rounded-lg cursor-pointer group transition-colors"
          >
            <div className="w-10 h-10 rounded bg-[#E5E7EB] flex items-center justify-center group-hover:bg-white group-hover:shadow-sm">
              <FileText size={20} className="text-slate-500 group-hover:text-[#D97706]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-800">{file.name}</div>
              <div className="text-xs text-slate-400">{file.type} • {file.date}</div>
            </div>
            <ArrowUp size={16} className="text-slate-300 group-hover:text-[#064E3B] rotate-45" />
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

// Helper: Formats the text with bolding and Citation Tooltips
const FormattedOutput = ({ text }) => {
  // Simple parser to handle bolding **text** and citations [1]
  const parts = text.split(/(\*\*.*?\*\*|\[\d+\])/g);
  
  return (
    <p>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        if (part.match(/^\[\d+\]$/)) {
          const id = part.slice(1, -1);
          return (
            <span key={i} className="relative inline-block group ml-1 align-super text-[10px]">
              <span className="cursor-pointer text-[#D97706] font-bold hover:underline bg-[#FEF3C7] px-1 rounded">{id}</span>
              {/* Tooltip */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed text-left border border-slate-700">
                <span className="block font-bold text-slate-400 mb-1 text-[10px] uppercase">{CITATIONS[id]?.source}</span>
                "{CITATIONS[id]?.text}"
              </span>
            </span>
          );
        }
        return part;
      })}
    </p>
  );
};

// --- Mock Content for the Credit Memo ---
const MOCK_CREDIT_MEMO = `**Executive Summary**
Zenith Construction Ltd has requested a **N250,000,000 Term Loan** for heavy equipment acquisition. The company demonstrates strong repayment capacity with a projected DSCR of **1.45x** [2], comfortably exceeding our internal policy threshold of 1.25x.

**Regulatory Compliance**
The request complies with all CBN Prudential Guidelines. The exposure represents 12% of the bank's unimpaired shareholders' funds, which is within the **Single Obligor Limit of 20%** [1]. The collateral offered (Agbara Warehouse) is unencumbered and registered [3].

**Risk Factors**
1. **FX Exposure:** The borrower relies on imported raw materials. A 20% devaluation could impact margins.
2. **Key Person Risk:** Operations are heavily centralized around the Managing Director.

**Recommendation**
**APPROVE** subject to the execution of an FX Forward Contract 