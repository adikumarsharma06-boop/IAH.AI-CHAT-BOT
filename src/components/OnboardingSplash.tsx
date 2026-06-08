import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, User, Shield, Sparkles, Sliders, ChevronRight, CheckCircle2, RotateCw, Crown } from 'lucide-react';

interface OnboardingSplashProps {
  onComplete: (userProfile: { name: string; role: string; accentColor: string }) => void;
  existingProfile?: { name: string; role: string; accentColor: string } | null;
}

export default function OnboardingSplash({ onComplete, existingProfile = null }: OnboardingSplashProps) {
  const [step, setStep] = useState<'initial-loading' | 'register' | 'initiating'>('initial-loading');
  const [onboardTab, setOnboardTab] = useState<'create' | 'login'>('create');
  const [name, setName] = useState('');
  const [role, setRole] = useState('SaaS Entrepreneur');
  const [accentColor, setAccentColor] = useState('indigo'); // indigo, emerald, cyan, violet

  const [bootLogIndex, setBootLogIndex] = useState(0);
  const bootLogs = [
    'Initializing IAH.AI Core Kernel...',
    'Mounting distributed neural processors...',
    'Establishing secure handshake with Gemini API...',
    'Synchronizing multi-agent expert nodes (CEO, Marketer, Recruiter)...',
    'Local database cache indexed and verified.',
    'System status: 100% operational. Core ready for allocation.'
  ];

  const [initialStatusIdx, setInitialStatusIdx] = useState(0);
  const initialStatuses = [
    'BOOTING SECURE MASTER KERNEL V1.0.0...',
    'VALIDATING OPERATOR CREDENTIALS...',
    'ESTABLISHING GOLD ENCRYPTED LINK...',
    'IAH.AI GOLD OPERATOR ONLINE.'
  ];

  // Status message cycler
  useEffect(() => {
    if (step === 'initial-loading') {
      const interval = setInterval(() => {
        setInitialStatusIdx(prev => (prev < initialStatuses.length - 1 ? prev + 1 : prev));
      }, 600);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Initial loading delay with spinning rings
  useEffect(() => {
    if (step === 'initial-loading') {
      const timer = setTimeout(() => {
        if (existingProfile) {
          onComplete(existingProfile);
        } else {
          setStep('register');
        }
      }, 2600); // 2.6s initial premium boot screen
      return () => clearTimeout(timer);
    }
  }, [step, existingProfile, onComplete]);

  // Automated logs display during the backend compilation boot cycle
  useEffect(() => {
    if (step === 'initiating') {
      if (bootLogIndex < bootLogs.length) {
        const interval = setTimeout(() => {
          setBootLogIndex(prev => prev + 1);
        }, 600);
        return () => clearTimeout(interval);
      } else {
        // Finished! Trigger navigation to main app
        const finalizeTimer = setTimeout(() => {
          onComplete({ name: name || 'Explorer', role, accentColor });
        }, 800);
        return () => clearTimeout(finalizeTimer);
      }
    }
  }, [step, bootLogIndex, name, role, accentColor, onComplete]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep('initiating');
  };

  const colorThemes = [
    { key: 'indigo', name: 'Cosmic Indigo', class: 'bg-indigo-550 bg-indigo-600 border-indigo-400 text-indigo-400 shadow-indigo-600/30' },
    { key: 'emerald', name: 'Terminal Emerald', class: 'bg-emerald-550 bg-emerald-600 border-emerald-400 text-emerald-400 shadow-emerald-600/30' },
    { key: 'cyan', name: 'Cyber Cyan', class: 'bg-cyan-550 bg-cyan-600 border-cyan-400 text-cyan-400 shadow-cyan-600/30' },
    { key: 'violet', name: 'Hyper Violet', class: 'bg-violet-550 bg-violet-600 border-violet-400 text-violet-400 shadow-violet-600/30' },
  ];

  const getGlowColor = () => {
    if (accentColor === 'indigo') return 'border-indigo-500 shadow-indigo-550/20';
    if (accentColor === 'emerald') return 'border-emerald-500 shadow-emerald-550/20';
    if (accentColor === 'cyan') return 'border-cyan-500 shadow-cyan-550/20';
    return 'border-violet-500 shadow-violet-550/20';
  };

  const getTextColor = () => {
    if (accentColor === 'indigo') return 'text-indigo-400';
    if (accentColor === 'emerald') return 'text-emerald-400';
    if (accentColor === 'cyan') return 'text-cyan-400';
    return 'text-violet-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070a] overflow-hidden">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080b11_1px,transparent_1px),linear-gradient(to_bottom,#080b11_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35"></div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: INITIAL BOOT SPINNER WITH LOGO AND RING */}
        {step === 'initial-loading' && (
          <motion.div
            key="initial-loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="text-center relative max-w-sm px-6 flex flex-col items-center space-y-8"
          >
            {/* Spinning Neon Ring Container */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Outer Golden Ambient Aura Blur */}
              <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-2xl animate-pulse pointer-events-none"></div>
              
              {/* External Ring 1 - counter clockwise fast in Gold */}
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-amber-500/30 p-1"
              />

              {/* Glowing Interactive Ring 2 - clockwise gorgeous golden gradient glow */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
                className="absolute inset-2 rounded-full border-t border-b border-gradient border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.35)]"
              />

              {/* Inner glowing core ring in Gold */}
              <div className="absolute inset-4 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center shadow-inner relative overflow-hidden">
                {/* Dynamic gold gradient background highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-yellow-500/10 pointer-events-none"></div>
                
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="p-5 flex flex-col items-center justify-center space-y-1 relative z-10"
                >
                  {/* Luxury Tiny Floating Crown */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="text-amber-400 stroke-[1.5]"
                  >
                    <Crown size={18} className="fill-amber-400/20" />
                  </motion.div>
                  
                  {/* Centered IAH.AI logo with Gold Gradient Clipping */}
                  <span className="text-xl font-extrabold tracking-widest font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-250 to-amber-300 drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)] select-none">
                    IAH.AI
                  </span>
                  
                  <span className="text-[7.5px] font-extrabold tracking-[0.25em] font-mono text-amber-500/70 uppercase select-none">
                    GOLD SECURE
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-2.5">
              <h1 className="text-xl font-black font-display text-white tracking-widest uppercase flex items-center justify-center gap-2 select-none">
                <span>IAH.AI</span>
                <span className="text-amber-400 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 rounded text-[8px] tracking-normal font-mono font-bold align-middle">GOLD OS v1.0</span>
              </h1>
              
              {/* Dynamic Status message switcher */}
              <p className="text-[10px] text-amber-400 font-mono tracking-widest uppercase min-h-[16px] animate-pulse flex items-center justify-center gap-1.5 select-none animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                {initialStatuses[initialStatusIdx]}
              </p>
            </div>

            {/* Gold linear loader */}
            <div className="w-48 bg-slate-950 h-1 rounded-full overflow-hidden border border-slate-850">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.3, ease: "easeInOut" }}
                className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 h-full shadow-[0_0_10px_rgba(245,158,11,0.6)]"
              />
            </div>
          </motion.div>
        )}

        {/* STEP 2: REGISTER PROFILE / ACCOUNT CREATION */}
        {step === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-md px-4"
          >
            <div className="glass-panel border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              
              {/* Absolute glowing element */}
              <div className="absolute -top-12 -right-12 h-36 w-36 bg-indigo-500/5 rounded-full blur-2xl"></div>

              {/* Logo Header */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-800">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850 text-indigo-405 text-indigo-400 relative">
                  <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/20 animate-ping duration-1000"></div>
                  <Cpu size={24} />
                </div>
                <div>
                  <h2 className="text-base font-bold font-display text-white tracking-tight uppercase">Initiation Protocol</h2>
                  <p className="text-[11px] text-slate-400">Establish or connect your operational profile below.</p>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-xl mb-5">
                <button
                  type="button"
                  id="tab-onboard-create"
                  onClick={() => setOnboardTab('create')}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide uppercase transition-all ${onboardTab === 'create' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  Create Profile
                </button>
                <button
                  type="button"
                  id="tab-onboard-login"
                  onClick={() => setOnboardTab('login')}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide uppercase transition-all ${onboardTab === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  Quick Log In
                </button>
              </div>

              {onboardTab === 'create' ? (
                /* Profile setup input form */
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  
                  {/* 1. Name Field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wide">Commander Identification (Name)</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-550" />
                      <input
                        required
                        type="text"
                        id="onboarding-name-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Commander Arthur"
                        className="w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* 2. Custom Role select */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wide">Target Objective focus</label>
                    <div className="relative">
                      <Sliders size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-550" />
                      <select
                        id="onboarding-role-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-slate-300 appearance-none transition-all cursor-pointer font-sans"
                      >
                        <option value="SaaS Entrepreneur">SaaS Entrepreneur (Startup Hub)</option>
                        <option value="Full Stack Architect">Full Stack Architect (Workspace Dev)</option>
                        <option value="Growth Marketer">Growth Marketer (Traffic Specialist)</option>
                        <option value="Executive Researcher">Executive Researcher (Syllabus & Docs)</option>
                        <option value="General Operator">General Operator (Core Operations)</option>
                      </select>
                    </div>
                  </div>

                  {/* 3. Global Core Color selections */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wide">Select OS Core Glow Color</label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorThemes.map(ct => (
                        <button
                          key={ct.key}
                          id={`theme-select-${ct.key}`}
                          type="button"
                          onClick={() => setAccentColor(ct.key)}
                          className={`py-2 rounded-xl border text-[10px] font-mono transition-all text-center uppercase tracking-tighter ${accentColor === ct.key ? ct.class + ' font-bold' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'}`}
                        >
                          {ct.key}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Safety and authorization prompt code values */}
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 flex gap-2.5 items-start">
                    <Shield size={14} className="text-slate-450 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] leading-relaxed text-slate-500 font-mono">
                      All telemetry, metrics, and artificial intelligence chats are stored locally and bound securely to your explorer browser container.
                    </p>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    id="submit-register-btn"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-blue-900/20 active:translate-y-0.5 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    <Sparkles size={14} />
                    Initiate IAH.AI Core Workspace
                    <ChevronRight size={14} />
                  </button>
                </form>
              ) : (
                /* Preset Quick Login buttons */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wide">Select Operator Authorization Identity</label>
                    <p className="text-[10px] text-slate-500 leading-normal">Choose an elite profile below to log in immediately with preloaded configurations.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { name: 'Arthur Pendragon', role: 'SaaS Entrepreneur', color: 'indigo', text: 'Senior Venture Strategist & Builder' },
                      { name: 'Dr. Sarah Lin', role: 'Executive Researcher', color: 'cyan', text: 'Educational Research & NLP Specialist' },
                      { name: 'Marcus Aurelius', role: 'Full Stack Architect', color: 'emerald', text: 'Enterprise Lead Cloud Engineer' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        id={`login-preset-${preset.name.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => {
                          setName(preset.name);
                          setRole(preset.role);
                          setAccentColor(preset.color);
                          setStep('initiating');
                        }}
                        className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-indigo-500/50 p-3 rounded-2xl text-left transition-all flex items-start justify-between group cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${preset.color === 'indigo' ? 'bg-indigo-500 animate-pulse' : preset.color === 'cyan' ? 'bg-cyan-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
                            {preset.name}
                          </div>
                          <div className="text-[9px] font-mono text-slate-400 uppercase">{preset.role}</div>
                          <p className="text-[10px] text-slate-500 leading-tight font-sans italic">{preset.text}</p>
                        </div>
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg mt-0.5 font-bold uppercase">
                          Login
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 flex gap-2.5 items-start">
                    <Shield size={14} className="text-slate-450 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] leading-relaxed text-slate-500 font-mono">
                      Your previous credentials can also be set or reset anytime from the configuration settings panel.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 3: COLLABORATING AGENTS / BOOTING SCREEN WITH COGNITIVE LOGS */}
        {step === 'initiating' && (
          <motion.div
            key="initiating"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md px-4 text-center space-y-6"
          >
            {/* Pulsating Glowing Logo with dynamic ring */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              
              {/* Glowing Orbiting Loader Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className={`absolute inset-0 rounded-full border-2 border-t-transparent ${getGlowColor()} shadow-glow`}
              />

              <div className="absolute inset-3 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center">
                <div className={`${getTextColor()} font-mono text-xs font-bold uppercase tracking-widest`}>
                  {accentColor.substring(0, 3)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm tracking-wide font-display text-white uppercase">Assembling Workspace Sandbox</h3>
                <p className="text-[11px] text-slate-400 font-mono uppercase">User profile initialized for: {name}</p>
              </div>

              {/* Console log dynamic block */}
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl min-h-[95px] text-left font-mono text-[10px] space-y-1.5 overflow-hidden">
                {bootLogs.slice(0, bootLogIndex + 1).map((log, idx) => (
                  <div key={idx} className="flex gap-2 text-slate-300">
                    <span className={idx === bootLogIndex ? getTextColor() + ' animate-pulse' : 'text-slate-500'}>
                      {idx === bootLogIndex ? '❯' : '✔'}
                    </span>
                    <span className={idx === bootLogIndex ? 'text-white font-medium' : 'text-slate-400'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>

              {/* Core load visualization bar */}
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                <div 
                  className={`h-full transition-all duration-300 ${
                    accentColor === 'indigo' ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' :
                    accentColor === 'emerald' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
                    accentColor === 'cyan' ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' :
                    'bg-violet-500 shadow-[0_0_8px_#8b5cf6]'
                  }`}
                  style={{ width: `${Math.min(100, ((bootLogIndex + 1) / bootLogs.length) * 100)}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
