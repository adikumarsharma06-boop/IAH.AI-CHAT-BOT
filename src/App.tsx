/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ProjectItem, ChatMessage, StartupPlan, CareerRoadmap, InterviewMessage, SystemUsage } from './types';
import DashboardView from './components/DashboardView';
import AIChatView from './components/AIChatView';
import DocAnalyzerView from './components/DocAnalyzerView';
import StartupHubView from './components/StartupHubView';
import CareerEduView from './components/CareerEduView';
import OnboardingSplash from './components/OnboardingSplash';
import FloatingChatbot from './components/FloatingChatbot';
import PremiumPaywall from './components/PremiumPaywall';
import { 
  Terminal, Sparkles, LayoutDashboard, MessageSquareShare, FileText, 
  Rocket, GraduationCap, Settings, Cpu, ChevronRight, Sliders, AlertCircle, Info,
  Clock, Crown, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Sidebar stagger entrance variants
const sidebarContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const sidebarItemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 15
    }
  }
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem('iah_premium') === 'true';
  });

  const [showUnlockSplash, setShowUnlockSplash] = useState<boolean>(false);
  const [targetTabAfterUnlock, setTargetTabAfterUnlock] = useState<string>('dashboard');
  const [unlockNotification, setUnlockNotification] = useState<string | null>(null);

  const executePremiumUnlock = (targetTab: string = 'dashboard') => {
    setIsPremium(true);
    localStorage.setItem('iah_premium', 'true');
    setShowUnlockSplash(true);
    setTargetTabAfterUnlock(targetTab);
    setUnlockNotification("👑 Gold Operator Authenticated: High Priority Node Active!");
    
    // Auto clear toast after 6 seconds
    setTimeout(() => {
      setUnlockNotification(null);
    }, 6000);
  };

  // Custom premiumUnlock event handler
  useEffect(() => {
    const handleUnlockEvent = (e: any) => {
      const nextTab = e?.detail?.targetTab || 'dashboard';
      executePremiumUnlock(nextTab);
    };

    window.addEventListener('premiumUnlock', handleUnlockEvent);
    return () => {
      window.removeEventListener('premiumUnlock', handleUnlockEvent);
    };
  }, []);

  // Unified Local Agendas (Projects) List State
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('iah_projects');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'p-1',
        name: 'Launch SEO Blog Campaign',
        description: 'Auto-schedule 15 keyword articles targeting SaaS lead acquisition channels.',
        status: 'planning',
        dueDate: '2026-06-25',
        category: 'Marketing'
      },
      {
        id: 'p-2',
        name: 'Validate Stripe Subscriptions Engine',
        description: 'Connect JWT signature authentications and API security credentials safely.',
        status: 'active',
        dueDate: '2026-06-18',
        category: 'Build'
      }
    ];
  });

  // System usage and compute metrics
  const [usage, setUsage] = useState<SystemUsage>(() => {
    const saved = localStorage.getItem('iah_usage');
    if (saved) return JSON.parse(saved);
    return {
      totalCredits: 100000,
      creditsUsed: 12500,
      requestsCount: 42,
      lastActive: new Date().toISOString()
    };
  });

  // AI Chat Conversation Hist
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('iah_chathist');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [isChatLoading, setIsChatLoading] = useState(false);

  // Operational user profile account setup
  const [userProfile, setUserProfile] = useState<{ name: string; role: string; accentColor: string } | null>(() => {
    const saved = localStorage.getItem('iah_user_profile');
    if (saved) return JSON.parse(saved);
    return null;
  });

  const [isInitializingApp, setIsInitializingApp] = useState<boolean>(true);

  // Native PWA Installability Handlers
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState<boolean>(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;
    setIsPWAInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('[IAH.AI OS] PWA installation prompt generated.');
    };

    const handleAppInstalled = () => {
      setIsPWAInstalled(true);
      setDeferredPrompt(null);
      console.log('[IAH.AI OS] PWA application successfully installed.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerPWAInstall = async () => {
    if (!deferredPrompt) {
      alert("IAH.AI OS is fully installable!\n\n• On Chrome / Edge: Wait a moment and click the 'Install App' icon in the upper-right URL bar, or click 'Install' when prompted.\n• On iOS Safari: Tap 'Share' (square with upward arrow) and choose 'Add to Home Screen'.\n• On Android, check the browser menu options for 'Install App' or 'Add to Home screen'.");
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[IAH.AI PWA] Installation prompt decision: ${outcome}`);
      if (outcome === 'accepted') {
        setIsPWAInstalled(true);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error('[IAH.AI PWA] Trigger prompt failure:', err);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('iah_user_profile');
    setUserProfile(null);
    setActiveTab('dashboard');
    setIsInitializingApp(true);
  };

  // Floating Chatbot Conversation & Input Draft Persistent State
  const [floatingChatHistory, setFloatingChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('iah_floating_chathist');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [floatingChatInput, setFloatingChatInput] = useState<string>(() => {
    return localStorage.getItem('iah_floating_chatinput') || '';
  });

  // Sync to local saves
  useEffect(() => {
    localStorage.setItem('iah_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('iah_usage', JSON.stringify(usage));
  }, [usage]);

  useEffect(() => {
    localStorage.setItem('iah_chathist', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('iah_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('iah_floating_chathist', JSON.stringify(floatingChatHistory));
  }, [floatingChatHistory]);

  useEffect(() => {
    localStorage.setItem('iah_floating_chatinput', floatingChatInput);
  }, [floatingChatInput]);

  const addCreditsUsed = (credits: number) => {
    setUsage(prev => ({
      ...prev,
      creditsUsed: Math.min(prev.totalCredits, prev.creditsUsed + credits),
      requestsCount: prev.requestsCount + 1,
      lastActive: new Date().toISOString()
    }));
  };

  // AGENDA HANDLERS
  const handleAddProject = (p: Omit<ProjectItem, 'id'>) => {
    const newProj: ProjectItem = {
      ...p,
      id: `p-${Date.now()}`
    };
    setProjects(prev => [newProj, ...prev]);
  };

  const handleToggleProjectStatus = (id: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: p.status === 'completed' ? 'active' : 'completed'
        };
      }
      return p;
    }));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleExportTasksToDashboard = (newTasks: Omit<ProjectItem, 'id'>[]) => {
    const compiled = newTasks.map((t, idx) => ({
      ...t,
      id: `exported-${Date.now()}-${idx}`
    }));
    setProjects(prev => [...compiled, ...prev]);
  };

  // MULTI-AGENT CHAT CORE DISPATCHER
  const handleSendChatMessage = async (text: string, mode: 'chat' | 'search' | 'code') => {
    // 1. Append User item
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode
    };

    const currentHist = [...chatHistory, userMsg];
    setChatHistory(currentHist);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          chatHistory: currentHist,
          mode
        })
      });

      if (!response.ok) {
        throw new Error("Target connection disrupted.");
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode,
        sources: data.sources
      };

      setChatHistory(prev => [...prev, aiMsg]);
      addCreditsUsed(120); // Consume metrics credits
    } catch (e: any) {
      console.error(e);
      const errMessage: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'system',
        text: `⚠️ **[System Error]**\n\nFailed to establish connection. Details: \`${e.message || 'Server timeout'}\``,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // DOCUMENT ANALYZER ACTION METHOD
  const handleAnalyzeDocument = async (text: string, titleName: string) => {
    const res = await fetch('/api/analyze-doc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docText: text, docName: titleName })
    });
    if (!res.ok) throw new Error("Document parsing failed.");
    return await res.json();
  };

  // STARTUP ADVISOR ACTION METHOD
  const handleValidateStartupIdea = async (conceptIdea: string) => {
    const res = await fetch('/api/startup-advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: conceptIdea })
    });
    if (!res.ok) throw new Error("Startup framework formulation failed.");
    return await res.json();
  };

  // CAREER EDUCATION INTERACTION ACTIONS
  const handleGenerateAcademyRoadmap = async (roadmapQuery: string) => {
    const res = await fetch('/api/career-edu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: roadmapQuery, type: 'roadmap' })
    });
    if (!res.ok) throw new Error("Roadmap generation failed.");
    return await res.json();
  };

  const handleStartInterviewModule = async (positionRole: string) => {
    const res = await fetch('/api/career-edu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: positionRole, type: 'interview' })
    });
    if (!res.ok) throw new Error("Simulation start disrupted.");
    return await res.json();
  };

  const handleSendInterviewAnswer = async (positionRole: string, history: InterviewMessage[]) => {
    const res = await fetch('/api/career-edu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: positionRole, 
        type: 'interview', 
        answerChat: history.map(h => ({ sender: h.sender, text: h.text }))
      })
    });
    if (!res.ok) throw new Error("Grading logic failed.");
    return await res.json();
  };

  const getAccentBg = () => {
    if (isPremium) return 'bg-gradient-to-r from-amber-500 to-yellow-505 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold';
    if (userProfile?.accentColor === 'emerald') return 'bg-emerald-600';
    if (userProfile?.accentColor === 'cyan') return 'bg-cyan-600';
    if (userProfile?.accentColor === 'violet') return 'bg-violet-600';
    return 'bg-indigo-600';
  };

  const getAccentBgClass = (tab: string) => {
    if (activeTab === tab) {
      if (isPremium) return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/25 text-yellow-300 font-extrabold border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
      if (userProfile?.accentColor === 'emerald') return 'bg-emerald-600 text-white shadow-xl';
      if (userProfile?.accentColor === 'cyan') return 'bg-cyan-600 text-white shadow-xl';
      if (userProfile?.accentColor === 'violet') return 'bg-violet-600 text-white shadow-xl';
      return 'bg-indigo-650 bg-indigo-600 text-white shadow-xl';
    }
    return 'text-cosmic-text-secondary hover:text-white hover:bg-slate-900';
  };

  const getAccentText = () => {
    if (isPremium) return 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 font-extrabold';
    if (userProfile?.accentColor === 'emerald') return 'text-emerald-450 text-emerald-400';
    if (userProfile?.accentColor === 'cyan') return 'text-cyan-450 text-cyan-400';
    if (userProfile?.accentColor === 'violet') return 'text-violet-450 text-violet-400';
    return 'text-indigo-400';
  };

  if (isInitializingApp) {
    return (
      <OnboardingSplash 
        existingProfile={userProfile} 
        onComplete={(profile) => {
          if (profile) {
            setUserProfile(profile);
          }
          setIsInitializingApp(false);
        }} 
      />
    );
  }

  if (!userProfile) {
    return <OnboardingSplash onComplete={setUserProfile} />;
  }

  return (
    <div className="flex h-screen w-screen bg-cosmic-bg text-cosmic-text-primary overflow-hidden font-sans">
      
      {/* SIDEBAR NAVIGATION - Left anchor */}
      <aside className="w-68 bg-cosmic-card/95 border-r border-cosmic-border flex flex-col justify-between hidden md:flex font-sans">
        <motion.div 
          variants={sidebarContainerVariants}
          initial="hidden"
          animate="visible"
          className="p-5 space-y-5"
        >
          {/* Brand Logo Header */}
          <motion.div 
            variants={sidebarItemVariants}
            className="flex items-center justify-between px-1 py-1 border-b border-cosmic-border pb-4"
          >
            <div className="flex items-center gap-2.5">
              <div className={`${getAccentBg()} shadow-lg p-2 rounded-xl text-white`}>
                <Cpu size={20} className="animate-spin-slow" />
              </div>
              <div>
                <div className="text-base font-bold tracking-tight font-display text-white">IAH.AI</div>
                <div className="text-[10px] font-bold tracking-widest font-mono text-blue-450 text-blue-400">OS WORKSPACE</div>
              </div>
            </div>
          </motion.div>

          {/* Active Operator profile card widget */}
          <motion.div 
            variants={sidebarItemVariants}
            className={`px-3.5 py-3 border rounded-xl flex items-center justify-between gap-3 ${
              isPremium 
                ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border-amber-500/35 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                : 'bg-slate-950/50 border-slate-850'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`p-2 rounded-lg ${getAccentBg()} text-slate-950 flex-shrink-0 flex items-center justify-center h-8 w-8 font-mono font-bold text-xs relative overflow-hidden`}>
                <span className={isPremium ? 'text-slate-950 font-extrabold' : 'text-white'}>
                  {userProfile.name.substring(0, 2).toUpperCase()}
                </span>
                {isPremium && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine pointer-events-none"></span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-slate-100 truncate flex items-center gap-1">
                  <span>{userProfile.name}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-500 truncate uppercase mt-0.5 flex items-center gap-1">
                  {isPremium ? (
                    <span className="text-amber-400 font-semibold flex items-center gap-0.5">👑 GOLD OPERATOR</span>
                  ) : (
                    <span>{userProfile.role}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {isPremium && (
                <motion.div
                  initial={{ rotate: -15, scale: 0.8 }}
                  animate={{ rotate: [0, 10, -10, 0], scale: 1 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 3 }}
                  className="text-amber-400 p-1 bg-amber-500/10 rounded-lg flex-shrink-0 border border-amber-500/25"
                  title="IAH Gold King License"
                >
                  <Crown size={12} className="fill-amber-400" />
                </motion.div>
              )}
              
              <button
                onClick={handleLogOut}
                className="p-1 px-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg border border-transparent hover:border-rose-500/15 transition-all cursor-pointer flex items-center justify-center"
                title="Disconnect Workspace Session"
              >
                <LogOut size={13} />
              </button>
            </div>
          </motion.div>

          <motion.nav 
            variants={sidebarContainerVariants}
            className="space-y-1.5"
          >
            <motion.span 
              variants={sidebarItemVariants}
              className="text-[10px] font-bold font-mono tracking-wider text-cosmic-text-muted select-none uppercase block px-1.5 mb-2"
            >
              Workspace Navigation
            </motion.span>
            
            <motion.button
              variants={sidebarItemVariants}
              id="sidebar-dashboard-tab"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${getAccentBgClass('dashboard')}`}
            >
              <LayoutDashboard size={15} />
              <span>Operations Board</span>
            </motion.button>

            <motion.button
              variants={sidebarItemVariants}
              id="sidebar-chat-tab"
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${getAccentBgClass('chat')}`}
            >
              <MessageSquareShare size={15} />
              <span>Multi-Agent Chat</span>
            </motion.button>

            <motion.button
              variants={sidebarItemVariants}
              id="sidebar-analyzer-tab"
              onClick={() => setActiveTab('analyzer')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${getAccentBgClass('analyzer')}`}
            >
              <div className="flex items-center gap-3">
                <FileText size={15} />
                <span>Doc Analyzer</span>
              </div>
              {!isPremium && <span className="text-[10px] text-amber-400" title="Premium Locked">🔒</span>}
            </motion.button>

            <motion.button
              variants={sidebarItemVariants}
              id="sidebar-startup-tab"
              onClick={() => setActiveTab('startup')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${getAccentBgClass('startup')}`}
            >
              <div className="flex items-center gap-3">
                <Rocket size={15} />
                <span>Startup Advisor</span>
              </div>
              {!isPremium && <span className="text-[10px] text-amber-400" title="Premium Locked">🔒</span>}
            </motion.button>

            <motion.button
              variants={sidebarItemVariants}
              id="sidebar-career-tab"
              onClick={() => setActiveTab('career')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${getAccentBgClass('career')}`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap size={15} />
                <span>Career Academy</span>
              </div>
              {!isPremium && <span className="text-[10px] text-amber-400" title="Premium Locked">🔒</span>}
            </motion.button>
          </motion.nav>
        </motion.div>

        {/* Console stats foot */}
        <div className="p-4 border-t border-cosmic-border bg-slate-950/60 font-mono text-[10px] text-cosmic-text-muted space-y-1.5">
          <div className="flex justify-between">
            <span>USER SESSION:</span>
            <span className="text-white">COSMIC_CLIENT</span>
          </div>
          <div className="flex justify-between">
            <span>SUITE ENGINES:</span>
            <span className="text-blue-400">9Persona_Synced</span>
          </div>
          
          {/* SECURE PWA MODULE CONTROL */}
          <div className="pt-1.5 mt-1 border-t border-slate-900 space-y-1.5">
            <div className="flex justify-between text-[9px]">
              <span>PWA CONSOLE:</span>
              {isPWAInstalled ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  ● SEAMLESS OS
                </span>
              ) : deferredPrompt ? (
                <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                  ● READY TO INSTAL
                </span>
              ) : (
                <span className="text-indigo-400 font-medium">READY (BROWSER)</span>
              )}
            </div>
            <button
              id="pwa-install-trigger-btn"
              onClick={triggerPWAInstall}
              className="w-full text-center py-1 mt-0.5 rounded bg-indigo-600/10 border border-indigo-500/30 hover:bg-indigo-600 hover:border-indigo-500 text-indigo-300 hover:text-white transition-all text-[9.5px] font-bold tracking-widest uppercase cursor-pointer"
            >
              {deferredPrompt ? "⚡ Install Desk/Ph" : "ℹ PWA OS Guide"}
            </button>
          </div>

          {/* Settings reset helper */}
          <button
            onClick={() => {
              if (window.confirm("Restore IAH.AI local memory fallbacks?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full text-center mt-2 pt-1 border-t border-slate-900 text-slate-500 hover:text-blue-400 transition-colors uppercase cursor-pointer"
          >
            Reset Memory Cache
          </button>
        </div>
      </aside>

      {/* PRIMARY WORKSPACE CONTENT MODULE */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Navigation Bar Top */}
        <header className="h-16 border-b border-cosmic-border bg-cosmic-card/75 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Header elements */}
            <div className="md:hidden flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1 rounded-lg">
                <Cpu size={14} />
              </div>
              <span className="font-bold text-sm tracking-tight font-display text-white">IAH.AI OS</span>
            </div>
            {/* Desktop header tag */}
            <span className={`hidden md:inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
              isPremium 
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]' 
                : 'bg-[#1e293b]/70 border border-[#334155]/60 text-blue-400'
            }`}>
              {isPremium ? "👑 Gold OS Premium Active" : "Operating System Version 1.0.0"}
            </span>
          </div>

          {/* Quick Info bar */}
          <div className="flex items-center gap-3 md:gap-4 text-xs">
            <span className="hidden lg:flex items-center gap-1.5 text-cosmic-text-secondary">
              <Sliders size={13} className="text-blue-400" />
              API Core Link: <span className="text-emerald-400 font-mono font-medium">ONLINE</span>
            </span>

            {/* Mobile selection dropdown tab router */}
            <div className="md:hidden">
              <select
                id="mobile-nav-select"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="dashboard">Operations Board</option>
                <option value="chat">Multi-Agent Chat</option>
                <option value="analyzer">Doc Analyzer</option>
                <option value="startup">Startup Advisor</option>
                <option value="career">Career Academy</option>
              </select>
            </div>

            {isPremium ? (
              <div 
                onClick={() => setActiveTab('billing')}
                className="bg-indigo-950 px-3.5 py-1.5 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-300 flex items-center gap-1.5 font-mono cursor-pointer hover:bg-slate-900 transition-all font-bold"
                title="Premium Plan active for 50 Days"
              >
                <Sparkles size={11} className="text-indigo-400 rotate-12" />
                <span>STATUS: <strong>🔒 PREMIUM SUITE</strong></span>
              </div>
            ) : (
              <div 
                onClick={() => setActiveTab('billing')}
                className="bg-amber-500/10 px-3.5 py-1.5 border border-amber-500/20 rounded-xl text-[11px] text-amber-400 flex items-center gap-1.5 font-mono cursor-pointer hover:bg-amber-500/20 transition-all animate-pulse"
                title="Click to upgrade to Premium Core"
              >
                <Clock size={11} className="text-amber-500" />
                <span>LIMIT: <strong>16h ACTIVE</strong></span>
              </div>
            )}

            <button
              onClick={handleLogOut}
              className="bg-slate-950 px-3 py-1.5 border border-slate-850 hover:border-rose-500/30 hover:bg-rose-950/20 rounded-xl text-[11px] text-slate-400 hover:text-rose-450 flex items-center gap-1.5 font-sans font-semibold transition-all cursor-pointer"
              title="Disconnect active operator session"
            >
              <LogOut size={12} className="text-slate-500 hover:text-rose-400" />
              <span className="hidden xs:inline">Log Out</span>
            </button>
          </div>
        </header>

        {/* Inner panel area */}
        <div id="inner-view-scroll" className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-b from-[#0a0d14] to-[#0c0f17]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  projects={projects}
                  usage={usage}
                  onAddProject={handleAddProject}
                  onToggleProjectStatus={handleToggleProjectStatus}
                  onDeleteProject={handleDeleteProject}
                  onNavigateToTab={setActiveTab}
                  isPremium={isPremium}
                />
              )}

              {activeTab === 'chat' && (
                <AIChatView
                  chatHistory={chatHistory}
                  onSendMessage={handleSendChatMessage}
                  isLoading={isChatLoading}
                />
              )}

              {activeTab === 'analyzer' && (
                isPremium ? (
                  <DocAnalyzerView
                    onAnalyze={handleAnalyzeDocument}
                    usageAdder={addCreditsUsed}
                  />
                ) : (
                  <PremiumPaywall 
                    onUnlockPremium={() => executePremiumUnlock('analyzer')}
                    userProfile={userProfile}
                  />
                )
              )}

              {activeTab === 'startup' && (
                isPremium ? (
                  <StartupHubView
                    onValidateIdea={handleValidateStartupIdea}
                    onExportTasksToDashboard={handleExportTasksToDashboard}
                    usageAdder={addCreditsUsed}
                  />
                ) : (
                  <PremiumPaywall 
                    onUnlockPremium={() => executePremiumUnlock('startup')}
                    userProfile={userProfile}
                  />
                )
              )}

              {activeTab === 'career' && (
                isPremium ? (
                  <CareerEduView
                    onGenerateRoadmap={handleGenerateAcademyRoadmap}
                    onStartInterview={handleStartInterviewModule}
                    onSendInterviewResponse={handleSendInterviewAnswer}
                    usageAdder={addCreditsUsed}
                  />
                ) : (
                  <PremiumPaywall 
                    onUnlockPremium={() => executePremiumUnlock('career')}
                    userProfile={userProfile}
                  />
                )
              )}

              {activeTab === 'billing' && (
                <PremiumPaywall 
                  onUnlockPremium={() => executePremiumUnlock('dashboard')}
                  userProfile={userProfile}
                />
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* Floating Interactive Chatbot Assist Widget */}
      <FloatingChatbot 
        usageAdder={addCreditsUsed} 
        userProfile={userProfile} 
        onNavigateToTab={setActiveTab} 
        messages={floatingChatHistory}
        setMessages={setFloatingChatHistory}
        inputText={floatingChatInput}
        setInputText={setFloatingChatInput}
      />

      {/* Elegant Premium Toast alert on top-right */}
      <AnimatePresence>
        {unlockNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 max-w-sm w-full bg-slate-950/95 border border-amber-500/50 rounded-2xl p-4 shadow-[0_10px_35px_rgba(245,158,11,0.25)] flex gap-3 items-center backdrop-blur-md"
          >
            <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown size={18} className="fill-amber-400 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-xs font-bold text-white font-display">Premium Mode Active</h4>
              <p className="text-[10px] text-slate-400 truncate">Workspace backed up to: 7980259343</p>
            </div>
            <button 
              onClick={() => setUnlockNotification(null)}
              className="text-slate-500 hover:text-white text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-900 transition-colors cursor-pointer"
            >
              ESC
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Full Screen Golden Sparkle Unlock Celebration Overlay */}
      <AnimatePresence>
        {showUnlockSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-6"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: -20 }}
              className="relative max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-8 text-center space-y-6 shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden"
            >
              {/* Sweeping golden glow background effect */}
              <div className="absolute top-0 inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>

              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 blur-xl opacity-20 animate-pulse"></div>
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 0.95, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg"
                >
                  <Crown size={32} className="fill-slate-950 stroke-slate-950 stroke-[1.5]" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold font-display text-white tracking-tight">
                  Premium Suite Activated!
                </h3>
                <p className="text-[10px] text-amber-300 font-mono tracking-wider font-semibold">
                  👑 ALL MODULE CHECKS RESOLVED SUCCESSFULLY
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-amber-500/15 rounded-2xl text-left space-y-3">
                <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                  The terminal has successfully transitioned to Gold Premium state. Advanced doc diagnostic parsers, sandboxed startup formulations, and career accelerators have been fully unlocked.
                </p>
                <div className="h-px bg-amber-500/15 w-full"></div>
                <div className="text-[9px] text-slate-400 font-mono space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="text-base font-bold">✓</span>
                    <span>Document Analyzer Unlimited Processing</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="text-base font-bold">✓</span>
                    <span>Startup Hub Unlimited Formulators</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="text-base font-bold">✓</span>
                    <span>Career Education Career Roadmaps & Simulator</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <span className="text-base">📱</span>
                    <span>All saves safely linked and dynamic</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowUnlockSplash(false);
                  setActiveTab(targetTabAfterUnlock);
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold font-display text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.25)] cursor-pointer transition-transform"
              >
                Launch Golden Terminal
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
