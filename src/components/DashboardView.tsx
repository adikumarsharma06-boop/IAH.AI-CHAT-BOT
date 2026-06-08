import React, { useState } from 'react';
import { ProjectItem, SystemUsage } from '../types';
import { 
  Terminal, Sparkles, Plus, Calendar, CheckCircle2, Circle, Trash2, 
  ArrowRight, ShieldCheck, Cpu, HardDrive, BarChart3, TrendingUp 
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  projects: ProjectItem[];
  usage: SystemUsage;
  onAddProject: (p: Omit<ProjectItem, 'id'>) => void;
  onToggleProjectStatus: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
  isPremium: boolean;
}

// Staggered Container variant for smooth staggered layouts
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

// Unified fadeInUp transition pattern for individual components or panels
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 16
    }
  }
};

export default function DashboardView({
  projects,
  usage,
  onAddProject,
  onToggleProjectStatus,
  onDeleteProject,
  onNavigateToTab,
  isPremium
}: DashboardViewProps) {
  // New project form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Build');
  const [dueDate, setDueDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddProject({
      name,
      description,
      status: 'active',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      category
    });
    setName('');
    setDescription('');
    setCategory('Build');
    setDueDate('');
    setShowAddForm(false);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 1. Header Hero Welcome */}
      <motion.div 
        variants={fadeInUpVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#111622] to-slate-900 border border-slate-800 p-8 shadow-xl"
      >
        <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider font-display">Active Workspace Engine</span>
            </div>
            <h1 className="text-3xl font-bold font-display text-white tracking-tight">
              IAH.AI Operating System
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              "Intelligence Beyond Limits" — Your unified suite of AI specialists coordinating in real-time to plan, validate, deploy, and review operations.
            </p>
          </div>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl px-5 py-4 flex items-center gap-4">
            <Calendar className="text-blue-400" size={20} />
            <div>
              <div className="text-xs text-slate-500 font-mono">WORKSPACE TIME (UTC)</div>
              <div className="text-sm font-semibold font-mono text-slate-200">
                {new Date().toISOString().substring(0, 16).replace('T', ' ')}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. System Status Bento Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Metric 1 - AI System Status */}
        <motion.div 
          variants={fadeInUpVariants}
          className="glass-panel border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-[135px]"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-mono font-medium">IAH AGENTS ENGINE</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              <Cpu size={20} className="text-blue-400" />
              <span>ACTIVE</span>
            </div>
            <div className="text-xs text-slate-505 text-slate-500">9 Core Specialist personas synced</div>
          </div>
        </motion.div>

        {/* Metric 2 - Active Premium Features Status */}
        <motion.div 
          variants={fadeInUpVariants}
          onClick={() => onNavigateToTab('billing')}
          className={`glass-panel border rounded-xl p-4 flex flex-col justify-between h-[135px] cursor-pointer group transition-all relative overflow-hidden ${
            isPremium 
              ? 'border-amber-500/35 bg-gradient-to-br from-amber-500/10 to-slate-950 hover:border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.06)]' 
              : 'border-slate-800/80 hover:border-indigo-500/40 bg-slate-950/40'
          }`}
        >
          <div className="flex justify-between items-center pb-1 border-b border-slate-900">
            <span className={`text-[10px] font-mono tracking-wider font-bold ${isPremium ? 'text-amber-450' : 'text-slate-400'}`}>
              {isPremium ? '👑 ACTIVE PREMIUM FEATURES' : '🔒 ACTIVE PREMIUM STATUS'}
            </span>
            <Sparkles size={13} className={isPremium ? 'text-amber-400 rotate-12 animate-pulse' : 'text-slate-500'} />
          </div>
          
          <div className="space-y-1 py-1 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
              <span className="flex items-center gap-1">📄 Doc Analyzer</span>
              {isPremium ? (
                <span className="text-[10px] font-mono text-amber-400 font-semibold select-none">✓ UNLOCKED</span>
              ) : (
                <span className="text-[10px] font-mono text-slate-500 select-none">🔒 LOCKED</span>
              )}
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
              <span className="flex items-center gap-1">🚀 Startup MVP</span>
              {isPremium ? (
                <span className="text-[10px] font-mono text-amber-400 font-semibold select-none">✓ UNLOCKED</span>
              ) : (
                <span className="text-[10px] font-mono text-slate-500 select-none">🔒 LOCKED</span>
              )}
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
              <span className="flex items-center gap-1">🎓 Career Academy</span>
              {isPremium ? (
                <span className="text-[10px] font-mono text-amber-400 font-semibold select-none">✓ UNLOCKED</span>
              ) : (
                <span className="text-[10px] font-mono text-slate-500 select-none">🔒 LOCKED</span>
              )}
            </div>
          </div>

          <div className="text-[9px] font-mono flex justify-between items-center pt-1 border-t border-slate-900">
            {isPremium ? (
              <span className="text-amber-400 font-semibold">👑 Gold Core Unrestricted</span>
            ) : (
              <span className="text-amber-500 font-medium animate-pulse">Click to Activate Premium →</span>
            )}
            <span className="text-slate-500 group-hover:text-white transition-colors">Details</span>
          </div>
        </motion.div>

        {/* Metric 3 - Active Plans */}
        <motion.div 
          variants={fadeInUpVariants}
          className="glass-panel border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-[135px]"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-mono font-medium">TOTAL CAMPAIGNS</span>
            <HardDrive size={16} className="text-emerald-400" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-display tracking-tight text-white">
              {projects.length}
            </div>
            <div className="text-xs text-slate-505 text-slate-500">
              {projects.filter(p => p.status === 'completed').length} finalized milestones
            </div>
          </div>
        </motion.div>

        {/* Metric 4 - Workspace Security */}
        <motion.div 
          variants={fadeInUpVariants}
          className="glass-panel border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-[135px]"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-mono font-medium">ENVIRO SECURITY</span>
            <ShieldCheck size={16} className="text-blue-500" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-display tracking-tight text-white">
              VERIFIED
            </div>
            <div className="text-xs text-slate-510 text-slate-500">API Gateway Sandbox Secure</div>
          </div>
        </motion.div>
      </motion.div>

      {/* 3. Main Workspace Action Split */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left 2 cols: Live Workspace Projects Agendas */}
        <motion.div 
          variants={fadeInUpVariants}
          className="lg:col-span-2 glass-panel border border-slate-800/80 rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-2">
                <Terminal size={18} className="text-blue-400" />
                Product Planner & Task Matrix
              </h2>
              <p className="text-xs text-slate-400">Add startup concepts, features, or content plans below.</p>
            </div>
            <button
              id="add-p-btn"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 transition-colors text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus size={14} />
              {showAddForm ? "Collapse" : "New Plan"}
            </button>
          </div>

          {/* Form */}
          {showAddForm && (
            <motion.form 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Concept / Task Name</label>
                  <input
                    id="plan-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lambda Search Grounding API"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Category</label>
                  <select
                    id="plan-cat-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Startup idea">Startup Idea</option>
                    <option value="Build">Development MVP</option>
                    <option value="Research">Competitive Research</option>
                    <option value="Marketing">Growth & SEO Copy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Plan Description</label>
                  <input
                    id="plan-desc-input"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of requirements"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Target Date</label>
                  <input
                    id="plan-date-input"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="submit-p-btn"
                  type="submit"
                  className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 transition-colors text-white text-xs font-semibold rounded-lg shadow"
                >
                  Save Workspace Task
                </button>
              </div>
            </motion.form>
          )}

          {/* Table List */}
          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
                <span className="text-xs text-slate-500">No projects planned yet. Create your first campaign above or consult the Startup Advisor!</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] tracking-wider uppercase">
                      <th className="pb-3 w-[5%] text-center">Status</th>
                      <th className="pb-3 w-[45%]">Project Details</th>
                      <th className="pb-3 w-[20%]">Category</th>
                      <th className="pb-3 w-[20%]">Due Date</th>
                      <th className="pb-3 w-[10%] text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {projects.map((project) => (
                      <tr key={project.id} className="group hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 text-center">
                          <button
                            id={`toggle-status-${project.id}`}
                            onClick={() => onToggleProjectStatus(project.id)}
                            className="text-slate-500 hover:text-blue-400 transition-colors inline-block cursor-pointer"
                            title={project.status === 'completed' ? 'Mark incomplete' : 'Mark completed'}
                          >
                            {project.status === 'completed' ? (
                              <CheckCircle2 size={16} className="text-emerald-500" />
                            ) : (
                              <Circle size={16} />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 pr-2">
                          <div>
                            <div className={`font-semibold font-display text-white ${project.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                              {project.name}
                            </div>
                            <div className="text-slate-400 text-[11px] font-normal mt-0.5 line-clamp-1">
                              {project.description}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                            {project.category}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-slate-400">
                          {project.dueDate}
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            id={`delete-project-${project.id}`}
                            onClick={() => onDeleteProject(project.id)}
                            className="text-slate-505 hover:text-red-400 transition-colors inline-block p-1 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right 1 col: Dynamic Ecosystem Map */}
        <motion.div 
          variants={fadeInUpVariants}
          className="glass-panel border border-slate-800/80 rounded-2xl p-6 space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-lg font-display text-white tracking-tight flex items-center gap-2">
                <Sparkles size={16} className="text-blue-400" />
                Product Modules
              </h3>
              <p className="text-xs text-slate-400">Operate the IAH.AI workspace capabilities directly:</p>
            </div>

            {/* Quick Actions Router */}
            <div className="space-y-2.5">
              <button
                id="route-chat-btn"
                onClick={() => onNavigateToTab('chat')}
                className="w-full font-sans text-left bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3 text-xs flex justify-between items-center transition-all group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">AI Chat & Search Mode</div>
                  <div className="text-[10px] text-slate-400">Grounded research with citation links</div>
                </div>
                <ArrowRight size={14} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="route-analyzer-btn"
                onClick={() => onNavigateToTab('analyzer')}
                className="w-full font-sans text-left bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3 text-xs flex justify-between items-center transition-all group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">AI Document Analyzer</div>
                  <div className="text-[10px] text-slate-400">Generate executive takeaway targets</div>
                </div>
                <ArrowRight size={14} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="route-startup-btn"
                onClick={() => onNavigateToTab('startup')}
                className="w-full font-sans text-left bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3 text-xs flex justify-between items-center transition-all group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">AI Startup Center</div>
                  <div className="text-[10px] text-slate-400">MVP design, monetization pathways</div>
                </div>
                <ArrowRight size={14} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="route-career-btn"
                onClick={() => onNavigateToTab('career')}
                className="w-full font-sans text-left bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3 text-xs flex justify-between items-center transition-all group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">Career & Educational Hub</div>
                  <div className="text-[10px] text-slate-400">Role interview simulators, course structures</div>
                </div>
                <ArrowRight size={14} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-950/20 to-slate-950 border border-blue-900/40 rounded-xl p-4 space-y-1 mt-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
              <TrendingUp size={14} />
              Platform Execution Tip
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Use the **Startup Advisor** tool to refine a business idea, then check back in this main dashboard to schedule your tasks and check off milestones!
            </p>
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
