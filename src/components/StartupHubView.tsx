import React, { useState } from 'react';
import { StartupPlan, MVPTriagingTask, ProjectItem } from '../types';
import { 
  Rocket, Layers, TrendingUp, Cpu, Target, ShieldAlert,
  ListTodo, Sparkles, RefreshCw, AlertCircle, CheckCircle, PlusCircle, BookmarkCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface StartupHubViewProps {
  onValidateIdea: (idea: string) => Promise<StartupPlan>;
  onExportTasksToDashboard: (tasks: Omit<ProjectItem, 'id'>[]) => void;
  usageAdder: (credits: number) => void;
}

export default function StartupHubView({ 
  onValidateIdea, 
  onExportTasksToDashboard,
  usageAdder
}: StartupHubViewProps) {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StartupPlan | null>(null);
  const [exported, setExported] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setExported(false);
    try {
      const generatedPlan = await onValidateIdea(idea.trim());
      // Augment generated plan with completed status for checklist UI
      const tasksWithStatus = generatedPlan.tasks.map((t, idx) => ({
        id: `gen-task-${idx}`,
        title: t.title,
        phase: t.phase,
        completed: false
      }));
      setPlan({
        ...generatedPlan,
        tasks: tasksWithStatus
      });
      usageAdder(350); // consume simulated tokens
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      tasks: plan.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    });
  };

  const handleExport = () => {
    if (!plan) return;
    const projectItems: Omit<ProjectItem, 'id'>[] = plan.tasks.map(t => ({
      name: t.title,
      description: `${t.phase} - Derived from Startup Plan: "${plan.idea.substring(0, 30)}..."`,
      status: 'active',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week out
      category: 'Startup idea'
    }));
    onExportTasksToDashboard(projectItems);
    setExported(true);
  };

  const handleLoadSample = () => {
    setIdea("An AI-driven automated search engine optimization tool that generates and posts high-quality blog posts based on trending technical keywords to organically drive SaaS traffic without manual editing.");
  };

  const finishedTasksCount = plan ? plan.tasks.filter(t => t.completed).length : 0;
  const progressPercent = plan ? Math.round((finishedTasksCount / plan.tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <Rocket size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider font-mono">CEO & Founder Assistant</span>
            </div>
            <h2 className="text-xl font-bold font-display text-white tracking-tight">Startup Advisor Hub</h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Pitch your SaaS, marketplace, or technology idea. Our simulated operating agents formulate monetization plans, MVP scoping, and phase-by-phase tasks checklist.
            </p>
          </div>
          <button
            id="startup-sample-btn"
            onClick={handleLoadSample}
            className="text-[10px] uppercase font-mono text-indigo-300 hover:text-indigo-200 bg-slate-950 border border-indigo-950 px-3 py-1.5 rounded-lg transition-colors"
          >
            Load Sample Idea
          </button>
        </div>
      </div>

      {/* 2. Main Pitch Form */}
      <div className="glass-panel border border-slate-800 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-350 uppercase tracking-wide block">Outline your core business idea</label>
            <textarea
              id="startup-pitch-textarea"
              rows={4}
              required
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. A marketplace matching freelance video editors with YouTubers under a flat monthly subscription rate featuring automatic smart file-hosting checkpoints..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <span className="text-[10px] font-mono text-emerald-400">✓ Premium Startup Advisor Active</span>
            <button
              id="validate-idea-btn"
              type="submit"
              disabled={loading || !idea.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-650 transition-colors text-xs font-semibold rounded-xl text-white flex items-center gap-2 shadow"
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Generating Business Framework...
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  Validate & Generate MVP Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Output Advisor Board */}
      {loading ? (
        <div className="glass-panel border border-slate-810 rounded-2xl p-12 text-center space-y-4">
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit mx-auto text-indigo-400">
            <Sparkles size={32} className="animate-spin" />
          </div>
          <div className="space-y-1 mx-auto max-w-sm">
            <span className="text-xs font-mono font-bold text-indigo-350 uppercase">Formulating Competitive Analysis</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our simulated CEO, Growth Marketer, and Product Developers are collaborating on monetization tiers, structural tasks, and validation pipelines.
            </p>
          </div>
        </div>
      ) : plan ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 shadow">
            <span className="text-[11.5px] font-mono font-bold text-indigo-400 flex items-center gap-1.5 uppercase">
              <Sparkles size={12} className="animate-pulse" />
              Active Venture Blueprint Created
            </span>
            <button
              id="cancel-startup-plan-btn"
              onClick={() => {
                setPlan(null);
                setIdea('');
              }}
              className="text-[10.5px] font-mono text-red-450 text-red-500 hover:text-red-450 pointer-events-auto cursor-pointer font-bold uppercase transition"
            >
              Cancel Blueprint
            </button>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
          {/* Left 2 Cols: Main plan parameters */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Validation & Business Model */}
            <div className="glass-panel border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-850 pb-3">
                <BookmarkCheck className="text-indigo-400" size={18} />
                <h3 className="font-bold text-sm tracking-tight font-display text-white uppercase">Competitive Validation</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-mono tracking-wider font-bold text-indigo-400 uppercase">Idea Validation Analysis</h4>
                  <p className="text-xs text-slate-350 leading-relaxed bg-slate-950 p-4 border border-slate-850 rounded-xl">
                    {plan.validation}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-mono tracking-wider font-bold text-indigo-450 uppercase">Proposed Business Model</h4>
                  <p className="text-xs text-slate-350 leading-relaxed bg-slate-950 p-4 border border-slate-850 rounded-xl">
                    {plan.businessModel}
                  </p>
                </div>
              </div>
            </div>

            {/* Tech Stack & Marketing Strategy */}
            <div className="glass-panel border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-850 pb-3">
                <Layers className="text-indigo-400" size={18} />
                <h3 className="font-bold text-sm tracking-tight font-display text-white uppercase">Technical & Growth Scope</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tech specifications */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono tracking-wider font-bold text-indigo-400 uppercase flex items-center gap-1">
                    <Cpu size={12} />
                    Recommended Stack
                  </h4>
                  <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl flex flex-wrap gap-1.5">
                    {plan.techStack.map((tech, idx) => (
                      <span key={idx} className="bg-indigo-950/40 border border-indigo-900/60 text-[10px] font-mono text-indigo-300 rounded px-2.5 py-1">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Growth Strategy */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono tracking-wider font-bold text-indigo-400 uppercase flex items-center gap-1">
                    <Target size={12} />
                    Go-To-Market Route
                  </h4>
                  <p className="text-xs text-slate-350 bg-slate-950 p-3 border border-slate-850 rounded-xl leading-relaxed">
                    {plan.marketingStrategy}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <h4 className="text-[10px] font-mono tracking-wider font-bold text-red-400 uppercase flex items-center gap-1">
                  <ShieldAlert size={12} />
                  Risk Mitigation Assessment
                </h4>
                <p className="text-xs text-slate-350 bg-slate-950 p-4 border border-slate-850 rounded-xl leading-relaxed">
                  {plan.riskAnalysis}
                </p>
              </div>
            </div>

          </div>

          {/* Right 1 Col: Dynamic Phase tasks and checklist checklist */}
          <div className="glass-panel border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              
              <div className="space-y-1">
                <h3 className="font-bold text-sm tracking-tight font-display text-white flex items-center gap-1.5 uppercase">
                  <ListTodo size={16} className="text-indigo-400" />
                  MVP Sprint Milestones
                </h3>
                <p className="text-[11px] text-slate-400">Complete tasks to measure MVP progress:</p>
              </div>

              {/* Progress visual tracker */}
              <div className="space-y-1.5 bg-slate-900/40 border border-slate-850 p-3.5 rounded-xl">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-450 uppercase">MVP BUILD PROGRESS</span>
                  <span className="text-indigo-400 font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-850">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-500 text-right font-mono">
                  {finishedTasksCount} OF {plan.tasks.length} CHECKS FILED
                </div>
              </div>

              {/* Tasks Checklist */}
              <div className="space-y-2">
                {plan.tasks.map((task) => (
                  <button
                    key={task.id}
                    id={`toggle-task-${task.id}`}
                    onClick={() => handleToggleTask(task.id)}
                    className="w-full text-left bg-slate-950 hover:bg-slate-900/50 border border-slate-850 p-3 rounded-xl flex items-start gap-2.5 transition-all group"
                  >
                    <CheckCircle 
                      size={15} 
                      className={`mt-0.5 flex-shrink-0 transition-colors ${task.completed ? 'text-indigo-455 text-indigo-400 font-bold' : 'text-slate-600'}`} 
                    />
                    <div>
                      <div className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </div>
                      <span className="text-[9px] font-mono text-indigo-450 uppercase block mt-0.5">{task.phase}</span>
                    </div>
                  </button>
                ))}
              </div>

            </div>

            {/* Export block */}
            <div className="pt-4 border-t border-slate-850 space-y-3">
              <div className="text-[10px] text-slate-500 font-mono text-center leading-normal">
                Synchronize sprint targets directly to your main planner dashboard list.
              </div>
              <button
                id="export-tasks-btn"
                onClick={handleExport}
                disabled={exported}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-950 border border-slate-800 hover:border-slate-700 disabled:border-slate-900 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <PlusCircle size={14} className="text-indigo-400" />
                {exported ? "Tasks Synced to Agenda!" : "Add sprint tasks to Agenda"}
              </button>
              {exported && (
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono justify-center">
                  <CheckCircle size={10} />
                  <span>Agendas fully loaded under Task Matrix dashboard</span>
                </div>
              )}
            </div>

          </div>

        </motion.div>
        </div>
      ) : (
        <div className="glass-panel border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <div className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-550 w-fit mx-auto">
            <AlertCircle size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-white font-display text-sm">Advisor Assessment Incomplete</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Outline a target SaaS idea or digital service concept above, then query our expert CEO node to forge your business blueprints.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
