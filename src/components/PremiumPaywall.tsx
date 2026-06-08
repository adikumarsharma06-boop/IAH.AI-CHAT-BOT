import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Sparkles, Check, Server, Clock, HelpCircle, 
  ChevronRight, CreditCard, MessageSquare, Mail, AlertCircle, Info, Heart,
  Lock, Unlock, Key, Send, PhoneCall, CheckCircle2, Award
} from 'lucide-react';

interface PremiumPaywallProps {
  onUnlockPremium: () => void;
  userProfile: { name: string; role: string; accentColor: string } | null;
}

export default function PremiumPaywall({ onUnlockPremium, userProfile }: PremiumPaywallProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('premium');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('7980259343');
  const [emailInput, setEmailInput] = useState('7980259343');

  // Animation States for Key Turn Lock Opening
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0); 
  const [logs, setLogs] = useState<string[]>([]);

  // 10-day Countdown Timer State for payment options offline mode
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // 10 days from current date (June 8, 2026 to June 18, 2026)
    const targetDate = new Date("2026-06-18T10:21:07Z");
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSimulateActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnId.trim() || !whatsappPhone.trim()) return;

    setIsPlayingAnimation(true);
    setAnimationStep(1);
    setLogs([]);

    // 1. Setup simulated logs showing data dispatching & key verification
    const logQueue = [
      { text: "⚡ Initiating FamPay high-priority transaction verification...", delay: 200 },
      { text: "🔍 Validating UTR: '" + txnId + "' against FamPay UPI ledger...", delay: 800 },
      { text: "📱 Preparing workspace data payloads & notes histories...", delay: 1400 },
      { text: "📤 Sending WhatsApp message containing backup payloads to 7980259343...", delay: 2000 },
      { text: "✉️ Sending emails and configuration backups to 7980259343...", delay: 2600 },
      { text: "🔑 Verified successfully! Launching golden workspace upgrade protocol...", delay: 3200 },
    ];

    logQueue.forEach((log) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log.text]);
      }, log.delay);
    });

    // 2. Lock-to-Unlock interactive stage transitions
    setTimeout(() => {
      setAnimationStep(2); // Show the heavy cosmic lock with the golden key
    }, 3500);

    // 3. Key rotation turn animation triggers
    setTimeout(() => {
      setAnimationStep(3); // Key rotates, lock clicks OPEN!
    }, 5000);

    // 4. Gold sparkle boom, unlock is complete!
    setTimeout(() => {
      setAnimationStep(4); // Sparkles and Success crown dashboard!
    }, 6500);
  };

  const finalizeUnlock = () => {
    onUnlockPremium();
  };

  const triggerBypassTrial = () => {
    setIsPlayingAnimation(true);
    setAnimationStep(1);
    setLogs([]);

    const logQueue = [
      { text: "⚡ Initializing 10-Day Free Maintenance Bypass Gateway...", delay: 200 },
      { text: "🔍 Setting operator state bypass token: 'MAINTENANCE-FREE-GP-2026'...", delay: 800 },
      { text: "🖥️ Deploying sandboxed local credentials for session explorer...", delay: 1400 },
      { text: "🔒 Bypassing UPI ledger transfer check safely...", delay: 2000 },
      { text: "🌟 Deploying temporary golden OS telemetry configurations...", delay: 2650 },
      { text: "🔑 Activated via Maintenance Override! Snapping workspace lock...", delay: 3200 },
    ];

    logQueue.forEach((log) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log.text]);
      }, log.delay);
    });

    setTimeout(() => {
      setAnimationStep(2);
    }, 3500);

    setTimeout(() => {
      setAnimationStep(3);
    }, 5000);

    setTimeout(() => {
      setAnimationStep(4);
    }, 6500);
  };

  // Build the live UPI Payment Scheme URI for the generated QR code (₹99)
  const upiUrl = "upi://pay?pa=7980259343@fam&pn=IAH.AI%20Premium%20Workspace&am=99&cu=INR&tn=Activate%20IAH.AI%20Premium";
  const qrCodeImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=255-215-0&bgcolor=11-17-29&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      
      <AnimatePresence mode="wait">
        {!isPlayingAnimation ? (
          <motion.div
            key="paywall-selection"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            {/* 1. Header Shield info */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-semibold uppercase tracking-wider font-mono">
                🔒 Premium Core Modules Restricted
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
                Upgrade to IAH.AI Gold Premium
              </h1>
              <p className="text-sm text-slate-400">
                Unlock full access to the Doc Analyzer, Startup Advisor, and Career Academy. All your workspace data, reports, and simulated transcripts will be safely synced and sent directly to your phone.
              </p>
            </div>

            {/* 2. Simple Two Cards Setup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-2">
              
              {/* Card 1: Currently Free Card */}
              <div 
                onClick={() => setSelectedPlan('free')}
                className={`relative rounded-2xl p-6 bg-slate-950/80 border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlan === 'free' ? 'border-slate-700 shadow-lg ring-1 ring-slate-700' : 'border-slate-900 opacity-60 hover:opacity-90'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase">TIER 1</span>
                      <h3 className="text-xl font-bold font-display text-slate-200 mt-1">Current Free Plan</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono tracking-wider uppercase font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div className="py-2">
                    <span className="text-3xl font-extrabold text-white">₹0</span>
                    <span className="text-xs text-slate-500 font-mono ml-1.5">/ Standard Access</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Standard workspace access with basic limits. Perfect for simple general conversation models, drafting single thoughts, and layout testing.
                  </p>

                  <ul className="space-y-2.5 pt-3 border-t border-slate-900 text-xs">
                    <li className="flex items-center gap-2.5 text-rose-400 font-medium">
                      <Clock size={14} className="flex-shrink-0" />
                      <span>Workspace limited to <strong>16 Hours Only</strong> total use</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-slate-500">
                      <Check size={14} className="flex-shrink-0" />
                      <span>Restricted Doc Analyzer module</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-slate-500">
                      <Check size={14} className="flex-shrink-0" />
                      <span>Restricted Startup Advisor module</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-slate-500">
                      <Check size={14} className="flex-shrink-0" />
                      <span>Restricted Career Academy workspace</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <div className="w-full text-center py-2 bg-slate-900 border border-slate-850 rounded-xl text-xs font-semibold text-slate-400">
                    Active Current Plan
                  </div>
                </div>
              </div>

              {/* Card 2: Premium Upgrade Card - ₹99 with GOLDEN Shine styling */}
              <div 
                onClick={() => setSelectedPlan('premium')}
                className={`relative rounded-2xl p-6 bg-gradient-to-b from-amber-950/20 to-slate-950 border transition-all cursor-pointer flex flex-col justify-between overflow-hidden group ${
                  selectedPlan === 'premium' ? `border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.2)] ring-2 ring-amber-500/20` : 'border-slate-850 opacity-65 hover:opacity-90'
                }`}
              >
                {/* Golden sweeping shine overlay */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine"></div>

                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-[9px] font-bold font-mono tracking-widest text-slate-950 uppercase shadow-lg">
                  👑 GOLD PREMIUM UPGRADE
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold font-mono tracking-wider text-amber-400 uppercase">TIER 2</span>
                      <h3 className="text-xl font-bold font-display text-white mt-1">Unlimited Pro Core</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono tracking-wider uppercase font-bold">
                      PRO ACCESS
                    </span>
                  </div>

                  <div className="py-2">
                    <span className="text-3xl font-extrabold text-white text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">₹99</span>
                    <span className="text-xs text-amber-450 text-amber-400 font-mono ml-1.5 font-semibold">/ Unlimited 50 Days</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Gain absolute, unrestricted full-stack access to all premium modules. All transaction records and analysis histories are sent directly to your mobile/email.
                  </p>

                  <ul className="space-y-2.5 pt-3 border-t border-slate-900 text-xs">
                    <li className="flex items-center gap-2.5 text-amber-250 text-amber-200">
                      <Award size={14} className="text-amber-400 flex-shrink-0" />
                      <span><strong>Unlimited use for 50 Days</strong> - no countdown limits</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-amber-200">
                      <Check size={14} className="text-amber-400 flex-shrink-0" />
                      <span>Full Doc Analyzer & Script Summarizer active</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-amber-200">
                      <Check size={14} className="text-amber-400 flex-shrink-0" />
                      <span>Full Startup Validation Suite (CEO model)</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-amber-200">
                      <Check size={14} className="text-amber-400 flex-shrink-0" />
                      <span>Full Career Interview & Practice Simulator</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-amber-200">
                      <Check size={14} className="text-amber-400 flex-shrink-0" />
                      <span>Auto-dispatch layout details to WhatsApp/Email</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      setSelectedPlan('premium');
                      setShowPaymentDetails(true);
                    }}
                    className="w-full py-2.5 text-xs font-bold rounded-xl text-slate-950 font-display bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-350 shadow-lg cursor-pointer transition-colors"
                  >
                    Get Gold Premium for ₹99
                  </button>
                </div>
              </div>

            </div>

            {/* 3. Sliding Payment Gateway Box / 10-Day Scheduled Maintenance block */}
            <AnimatePresence>
              {(showPaymentDetails || selectedPlan === 'premium') && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="max-w-xl mx-auto rounded-2xl bg-slate-950/95 border border-amber-500/20 p-6 shadow-2xl relative overflow-hidden"
                >
                  {/* Ambient golden glow circle */}
                  <div className="absolute -top-12 -right-12 h-24 w-24 bg-amber-500/10 rounded-full blur-2xl"></div>

                  <div className="space-y-6 relative">
                    <div className="flex items-start gap-4 pb-4 border-b border-slate-900">
                      <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                        <Clock size={20} className="animate-spin-slow text-amber-450" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">Scheduled Gateway Maintenance Node</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">UPI and QR payment buy vectors are offline for system ledger upgrades.</p>
                      </div>
                    </div>

                    {/* Highly interactive 10-day countdown timer */}
                    <div className="bg-slate-900/60 border border-slate-850 p-5 rounded-2xl text-center space-y-4">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-amber-400 font-bold block">NORMAL BILLING CHANNELS RESUME IN:</span>
                      
                      <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto">
                        <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl">
                          <span className="text-2xl font-extrabold font-mono text-white block">
                            {String(timeLeft.days).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono tracking-wide uppercase">D</span>
                        </div>
                        <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl">
                          <span className="text-2xl font-extrabold font-mono text-white block">
                            {String(timeLeft.hours).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono tracking-wide uppercase">H</span>
                        </div>
                        <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl">
                          <span className="text-2xl font-extrabold font-mono text-white block">
                            {String(timeLeft.minutes).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono tracking-wide uppercase">M</span>
                        </div>
                        <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl">
                          <span className="text-2xl font-extrabold font-mono text-amber-400 block animate-pulse">
                            {String(timeLeft.seconds).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono tracking-wide uppercase">S</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl max-w-md mx-auto">
                        <p className="text-[11px] leading-relaxed text-slate-400">
                          In compliance with system transition protocols commencing <strong>June 8, 2026</strong>, all direct UPI/₹99 purchases are suspended to protect transaction ledger safety. Automatic persistent billing turns on after exactly <strong>10 Days</strong> on <strong>June 18, 2026</strong>.
                        </p>
                      </div>
                    </div>

                    {/* Developer Free Trial Active Bypass Section */}
                    <div className="space-y-3.5 pt-1">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold font-mono tracking-widest text-amber-500 uppercase block">CLAIM FREE MAINTENANCE LICENSE</span>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Get immediate, complimentary 10-day unlimited operating system core rights during our ledger reconstruction window.
                        </p>
                      </div>

                      <button
                        type="button"
                        id="claim-bypass-trial-btn"
                        onClick={triggerBypassTrial}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-450 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-0.5"
                      >
                        <ShieldCheck size={14} className="text-slate-950" />
                        Deploy Temporary 10-Day Free Workspace Access
                        <ChevronRight size={14} className="text-slate-950 animate-pulse" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Lock-to-Unlock Visual Key Animation Experience */
          <motion.div
            key="unlock-animation-flow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto rounded-3xl bg-slate-950 border border-amber-500/40 p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] text-center relative overflow-hidden"
          >
            {/* Space Grid lines inside bg */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
            
            <div className="space-y-8 relative z-10 py-6">
              
              {/* Animation Frame Container */}
              <div className="h-48 flex items-center justify-center relative">
                
                {/* Simulated Sparkles loop */}
                {animationStep >= 3 && (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="w-40 h-40 rounded-full border-2 border-amber-500/30 blur-md bg-amber-500/5"></div>
                  </motion.div>
                )}

                {/* The visual transitioning Locked / Unlocked Engine */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {animationStep <= 2 ? (
                      <motion.div
                        key="locked-state"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative p-6 rounded-full bg-slate-900 border-2 border-slate-800 text-amber-500 shadow-xl"
                      >
                        <Lock size={64} className="animate-pulse" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="unlocked-state"
                        initial={{ scale: 1.3, rotate: -25, opacity: 0 }}
                        animate={{ scale: 1.1, rotate: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="relative p-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-2xl skew-y-1"
                      >
                        <Unlock size={64} className="stroke-[2.5]" />
                        <span className="absolute -top-3 -right-3 text-2xl animate-bounce">👑</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Golden flying key animation */}
                  {animationStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: -120, y: 10, rotate: -45 }}
                      animate={{ opacity: 1, x: 0, y: 0, rotate: 180 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="absolute top-1/2 -left-4 transform -translate-y-1/2 text-yellow-300 pointer-events-none filter drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                    >
                      <Key size={32} className="rotate-45 animate-pulse" />
                    </motion.div>
                  )}
                </div>

              </div>

              {/* Status Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold font-display text-white tracking-tight">
                  {animationStep === 1 && "Verifying UPI Transfer Payload..."}
                  {animationStep === 2 && "Synchronizing Workspace Logs..."}
                  {animationStep === 3 && "Workspace Lock Snapping Open!"}
                  {animationStep >= 4 && "Upgrade Completed! Gold Core Active"}
                </h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {animationStep < 4 ? "Please wait while IAH.AI secure protocols process payment ledgers & sync user caches." : "Full workspace databases, checklists & summaries linked and delivered. Welcome, Gold Operator."}
                </p>
              </div>

              {/* Output log display */}
              <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-xl p-4 text-left font-mono text-[10px] space-y-1.5 h-32 overflow-y-auto shadow-inner text-slate-350">
                {logs.map((logText, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-1.5"
                  >
                    <span className="text-amber-500 font-bold select-none">&gt;&gt;</span>
                    <span>{logText}</span>
                  </motion.div>
                ))}
              </div>

              {/* Action buttons on finish */}
              <div className="pt-2">
                {animationStep >= 4 ? (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={finalizeUnlock}
                    className="px-8 py-3 rounded-xl text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 font-extrabold font-display text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer transition-colors"
                  >
                    🚀 Enter Premium Workspace (Golden Shine Applied)
                  </motion.button>
                ) : (
                  <div className="flex justify-center items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-ping"></span>
                    Secure Handshake Processed on Core Gateway: Port 3000
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
