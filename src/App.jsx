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
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Design Tokens (Perplexity-inspired Enterprise Theme) ---
const THEME = {
  bg: 'bg-[#F3F4F6]',       // Light Gray Background
  card: 'bg-white',
  textMain: 'text-[#111827]', // Near Black
  textMuted: 'text-[#6B7280]',
  accent: 'text-[#064E3B]', // Sovereign Green
  accentBg: 'bg-[#064E3B]',
  gold: 'text-[#D97706]',
  border: 'border-[#E5E7EB]',
};

// --- Mock Data: Meeting Recordings ---
const INBOX_RECORDINGS = [
  { id: 1, name: 'Board_Strategy_Q1_2026.mp3', duration: '1h 45m', date: 'Jan 22, 2026', type: 'Teams Recording' },
  { id: 2, name: 'Risk_Committee_Sync.mp3', duration: '45m', date: 'Jan 23, 2026', type: 'Teams Recording' },
  { id: 3, name: 'Audit_Governance_Review.mp3', duration: '1h 15m', date: 'Jan 20, 2026', type: 'Teams Recording' },
];

// --- Main Application ---
export default function SecretariatComet() {
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
    <div className={`min-h-screen ${THEME.bg} font-sans text-slate-800 flex`}>
      
      {/* 1. Slim Left Navigation (Perplexity Style) */}
      <nav className="w-16 md:w-20 bg-[#F9FAFB] border-r border-slate-200 flex flex-col items-center py-6 gap-6 fixed h-full z-50">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#064E3B] to-[#042F24] flex items-center justify-center shadow-lg mb-4 ring-1 ring-[#D97706]/50" title="SeeBess Bank Sovereign Vault">
          <Landmark className="text-[#D97706]" size={26} />
        </div>
        
        <NavItem icon={CalendarDays} active />
        
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

      {/* 2. Main Content Area */}
      <main className="flex-1 ml-16 md:ml-20 relative">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-[#F3F4F6]/90 backdrop-blur-md px-8 py-4 flex justify-between items-center border-b border-transparent transition-all">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="font-serif font-bold text-xl text-[#064E3B] tracking-tight">SeeBess Bank</h1>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Banking with Intelligence</span>
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

      </main>

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

// --- Sub-Components ---

const NavItem = ({ icon: Icon, active }) => (
  <button className={`p-3 rounded-xl transition-all ${active ? 'bg-white shadow-sm text-[#064E3B]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
    <Icon size={22} />
  </button>
);

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