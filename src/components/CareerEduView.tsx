import React, { useState } from 'react';
import { CareerRoadmap, InterviewMessage } from '../types';
import { 
  GraduationCap, Briefcase, Play, RefreshCw, Send, CheckCircle2, 
  HelpCircle, AlertCircle, Award, Star, ThumbsUp, Compass 
} from 'lucide-react';
import { motion } from 'motion/react';

interface CareerEduViewProps {
  onGenerateRoadmap: (query: string) => Promise<CareerRoadmap>;
  onStartInterview: (role: string) => Promise<{ feedbackMessage: string }>;
  onSendInterviewResponse: (role: string, chat: InterviewMessage[]) => Promise<{
    feedbackMessage: string;
    score: number;
    strengths: string;
    improvements: string;
    idealAnswerExcerpt: string;
  }>;
  usageAdder: (credits: number) => void;
}

export default function CareerEduView({
  onGenerateRoadmap,
  onStartInterview,
  onSendInterviewResponse,
  usageAdder
}: CareerEduViewProps) {
  // Navigation inside the Career hub
  const [activeSubTab, setActiveSubTab] = useState<'roadmap' | 'interview'>('roadmap');

  // ROADMAP STATES
  const [roleQuery, setRoleQuery] = useState('');
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapResults, setRoadmapResults] = useState<CareerRoadmap | null>(null);

  // INTERVIEW SIMULATOR STATES
  const [targetRole, setTargetRole] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState<InterviewMessage[]>([]);
  const [userAnswer, setUserAnswer] = useState('');

  // Latest evaluation feedback from Gemini
  const [latestEval, setLatestEval] = useState<{
    score: number;
    strengths: string;
    improvements: string;
    idealAnswerExcerpt: string;
  } | null>(null);

  // ROADMAP ACTIONS
  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleQuery.trim()) return;

    setRoadmapLoading(true);
    try {
      const data = await onGenerateRoadmap(roleQuery.trim());
      setRoadmapResults(data);
      usageAdder(200);
    } catch (err) {
      console.error(err);
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleLoadSampleRoadmap = () => {
    setRoleQuery("AI Product Manager (Search & Grounding Specialties)");
  };

  // INTERVIEW ACTIONS
  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) return;

    setInterviewLoading(true);
    setLatestEval(null);
    try {
      const data = await onStartInterview(targetRole.trim());
      setInterviewHistory([
        { id: 'q-0', sender: 'ai', text: data.feedbackMessage }
      ]);
      setInterviewStarted(true);
      usageAdder(150);
    } catch (err) {
      console.error(err);
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || interviewLoading) return;

    const textToSubmit = userAnswer.trim();
    setUserAnswer('');
    
    // Add user answer to state
    const updatedHistory: InterviewMessage[] = [
      ...interviewHistory,
      { id: `u-${Date.now()}`, sender: 'user', text: textToSubmit }
    ];
    setInterviewHistory(updatedHistory);
    setInterviewLoading(true);

    try {
      const evalData = await onSendInterviewResponse(targetRole, updatedHistory);
      setLatestEval({
        score: evalData.score,
        strengths: evalData.strengths,
        improvements: evalData.improvements,
        idealAnswerExcerpt: evalData.idealAnswerExcerpt
      });
      setInterviewHistory([
        ...updatedHistory,
        { id: `q-${Date.now()}`, sender: 'ai', text: evalData.feedbackMessage }
      ]);
      usageAdder(300);
    } catch (err) {
      console.error(err);
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleResetInterview = () => {
    setTargetRole('');
    setInterviewStarted(false);
    setInterviewHistory([]);
    setLatestEval(null);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Module Shell Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400">
            <GraduationCap size={20} />
          </div>
          <div>
            <h2 className="text-sm font-semibold font-display text-white tracking-tight uppercase">Career and Academy Node</h2>
            <p className="text-[11px] text-slate-400">Expand operational competence and validate individual skills portfolios.</p>
          </div>
        </div>

        {/* Action Toggle buttons */}
        <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-lg">
          <button
            id="subtab-roadmap-btn"
            onClick={() => setActiveSubTab('roadmap')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold font-sans transition-all ${activeSubTab === 'roadmap' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}
          >
            Learning Roadmap
          </button>
          <button
            id="subtab-interview-btn"
            onClick={() => setActiveSubTab('interview')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold font-sans transition-all ${activeSubTab === 'interview' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}
          >
            Interview Simulator
          </button>
        </div>
      </div>

      {/* 3. Render ROADMAP SUBVIEW */}
      {activeSubTab === 'roadmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Query Planner card */}
          <div className="glass-panel border border-slate-850 rounded-2xl p-6 h-fit space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm tracking-tight font-display text-white uppercase flex items-center gap-1.5">
                <Compass size={15} className="text-blue-400 animate-pulse" />
                Forge Roadmap
              </h3>
              <p className="text-xs text-slate-400 leading-normal">
                Input your target job discipline, platform framework, or research topic to compile structured study milestones.
              </p>
            </div>

            <form onSubmit={handleGenerateRoadmap} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Target Role or Technique</label>
                <input
                  id="roadmap-query-input"
                  type="text"
                  required
                  value={roleQuery}
                  onChange={(e) => setRoleQuery(e.target.value)}
                  placeholder="e.g. Web3 Rust smart contract architect"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  id="roadmap-sample-load"
                  onClick={handleLoadSampleRoadmap}
                  className="text-[10px] font-mono text-blue-405 text-blue-400 hover:text-blue-300 font-medium"
                >
                  Load Sample Concept
                </button>
                <span className="text-[9px] text-slate-500 font-mono">CONSUMES: 200 UNIT DEB</span>
              </div>

              <button
                id="generate-roadmap-btn"
                type="submit"
                disabled={roadmapLoading || !roleQuery.trim()}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 transition-colors rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow"
              >
                {roadmapLoading ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    Assembling Curriculum...
                  </>
                ) : (
                  <>
                    <Star size={13} fill="currentColor" />
                    Forge Learning Roadmap
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6 min-h-[350px] flex flex-col justify-between">
            {roadmapLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-10">
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 animate-pulse">
                  <GraduationCap size={24} />
                </div>
                <div className="space-y-1 max-w-xs">
                  <span className="text-xs font-mono text-slate-200">CURRICULUM DECODER INITIALIZED</span>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Education Agent is compiling reference guidelines, core competencies, and textbook references for your roadmap.
                  </p>
                </div>
              </div>
            ) : roadmapResults ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-850 pb-3 space-y-1">
                  <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded uppercase font-semibold">Active Syllabus Loaded</span>
                  <h3 className="font-bold font-display text-white text-base mt-2">{roadmapResults.role}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{roadmapResults.overview}</p>
                </div>

                <div className="space-y-4">
                  {roadmapResults.steps.map((step, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-3 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 h-20 w-20 bg-blue-500/2 rounded-full blur-xl group-hover:bg-blue-500/5 duration-300"></div>
                      <div className="flex items-start gap-3">
                        <span className="h-6 w-6 rounded-full bg-blue-500/15 border border-blue-500/20 text-xs font-mono text-blue-300 font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-100 text-xs tracking-tight">{step.title}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{step.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between gap-2.5 pt-2 border-t border-slate-950/40 text-[10px]">
                        {/* Skills column */}
                        <div className="space-y-1">
                          <span className="font-bold uppercase tracking-wider text-slate-500 font-mono">Competencies Targeted:</span>
                          <div className="flex flex-wrap gap-1">
                            {step.skills.map((sk, skIdx) => (
                              <span key={skIdx} className="bg-slate-950 border border-slate-850 text-slate-350 px-2 py-0.5 rounded text-[9px] font-mono">{sk}</span>
                            ))}
                          </div>
                        </div>

                        {/* Resources column */}
                        <div className="space-y-1 md:max-w-[45%]">
                          <span className="font-bold uppercase tracking-wider text-slate-500 font-mono">Learning Platforms:</span>
                          <div className="flex flex-wrap gap-1">
                            {step.resources.map((re, reIdx) => (
                              <span key={reIdx} className="bg-blue-950/20 border border-blue-900/40 text-blue-300 px-2 py-0.5 rounded text-[9px] leading-none flex items-center gap-1">
                                {re}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3">
                <div className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-650">
                  <HelpCircle size={24} />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="font-semibold text-white font-display text-sm">Roadmap Board Empty</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Set your target engineering job specification or technique on the controller pane, and launch the roadmap forge framework.
                  </p>
                </div>
              </div>
            )}

            {roadmapResults && (
              <div className="pt-4 border-t border-slate-850 flex justify-end">
                <button
                  onClick={() => setRoadmapResults(null)}
                  className="text-[10px] font-mono text-slate-500 hover:text-slate-300 uppercase font-bold"
                >
                  Clear Syllabus
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 4. Render INTERVIEW SIMULATOR SUBVIEW */}
      {activeSubTab === 'interview' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Interview setup / results sidebar */}
          <div className="lg:col-span-1 flex flex-col justify-between glass-panel border border-slate-850 rounded-2xl p-5 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm font-display text-white tracking-tight flex items-center gap-1.5 uppercase">
                  <Briefcase size={14} className="text-blue-400" />
                  Simulator Setup
                </h3>
                <p className="text-[10px] text-slate-400">Launch a technical interview roleplay:</p>
              </div>

              {!interviewStarted ? (
                <form onSubmit={handleStartInterview} className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Target Job Position</label>
                    <input
                      id="interview-role-input"
                      type="text"
                      required
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Senior Backend Architect"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    id="launch-interview-btn"
                    type="submit"
                    disabled={interviewLoading || !targetRole.trim()}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-850 transition-all rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1 shadow"
                  >
                    {interviewLoading ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Play size={10} fill="currentColor" />
                    )}
                    Launch Simulation
                  </button>
                </form>
              ) : (
                <div className="space-y-3.5 bg-slate-900/60 p-4 border border-slate-850 rounded-xl relative overflow-hidden">
                  <div className="text-xs text-slate-300 font-sans leading-normal">
                    Interview in progress for: <strong className="text-white block mt-0.5">{targetRole}</strong>
                  </div>
                  <button
                    id="quit-interview-btn"
                    onClick={handleResetInterview}
                    className="w-full py-1.5 bg-slate-950 border border-slate-800 hover:border-red-900/40 text-[10px] font-mono text-red-400 hover:text-red-300 rounded-lg transition-colors"
                  >
                    Reset Interview Simulation
                  </button>
                </div>
              )}

              {/* Latest score evaluation banner from AI */}
              {latestEval && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-950 pb-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">EVAL RESPONSE REPORT</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span>{latestEval.score}/100</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-tight block">✔ Candidate Strengths:</span>
                      <p className="text-[10px] text-slate-300 leading-normal">{latestEval.strengths}</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-red-450 text-amber-400 uppercase tracking-tight block">💡 Recommended Enhancements:</span>
                      <p className="text-[10px] text-slate-300 leading-normal">{latestEval.improvements}</p>
                    </div>

                    <div className="space-y-0.5 pt-1 border-t border-slate-950">
                      <span className="text-[9px] font-mono text-blue-400 uppercase tracking-tight block">★ Reference Engineering Sample Excerpt:</span>
                      <p className="text-[10px] text-blue-200/90 font-mono italic leading-relaxed pt-0.5 bg-slate-950 p-2 rounded">
                        "{latestEval.idealAnswerExcerpt}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="border border-slate-800 bg-slate-950 rounded-xl p-3 text-[10px] font-mono text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>AGENT FOCUS:</span>
                <span className="text-blue-400 uppercase">CAREER PERSONA</span>
              </div>
              <div className="flex justify-between">
                <span>CONVERSATION TURNS:</span>
                <span>{interviewHistory.length}</span>
              </div>
            </div>
          </div>

          {/* Interview Message Thread pane */}
          <div className="lg:col-span-3 flex flex-col justify-between glass-panel border border-slate-850 rounded-2xl min-h-[400px] bg-slate-950/25 overflow-hidden">
            
            {/* Thread feed */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {!interviewStarted ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3 pt-15">
                  <div className="p-3 bg-slate-900 border border-slate-800 text-slate-600 rounded-2xl">
                    <Award size={32} />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="font-semibold text-white font-display text-xs uppercase tracking-wide">Interview Thread Closed</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enter your desired job title in the setup panel (e.g. "Lead React Engineer") and hit "Launch Simulation" to begin responding to challenges.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {interviewHistory.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[9px] font-mono text-slate-500 mb-1">
                        <span className="font-semibold uppercase">{m.sender === 'user' ? 'You' : 'Interviewer agent'}</span>
                      </div>
                      <div className={`text-xs px-4 py-3 leading-relaxed rounded-2xl max-w-[85%] ${m.sender === 'user' ? 'bg-blue-600 font-medium text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none font-normal'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {interviewLoading && (
                    <div className="flex flex-col items-start">
                      <span className="text-[9px] font-mono text-slate-500 mb-1">Interviewer Agent</span>
                      <div className="bg-slate-900 border border-slate-850 rounded-2xl rounded-tl-none px-4 py-2 text-[11px] font-mono text-slate-400">
                        Analyzing technical details and formulating criteria score...
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Answer Box footer */}
            <div className="p-4 bg-slate-900/50 border-t border-slate-805">
              <form onSubmit={handleSendResponse} className="relative flex items-center">
                <input
                  id="interview-ans-input"
                  type="text"
                  required
                  disabled={!interviewStarted || interviewLoading}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={
                    !interviewStarted ? "Please start the simulation first..." :
                    "Input your detailed engineering answer here to submit for review..."
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:border-blue-500 text-xs text-white placeholder-slate-500 disabled:bg-slate-950/60"
                />
                <button
                  id="submit-interview-ans-btn"
                  type="submit"
                  disabled={!userAnswer.trim() || interviewLoading || !interviewStarted}
                  className="absolute right-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-650 text-white rounded-lg transition-colors flex items-center justify-center p-2"
                >
                  <Send size={12} />
                </button>
              </form>
              <div className="text-[9px] font-mono text-slate-500 mt-2.5 flex items-center gap-1.5 pl-1">
                <AlertCircle size={10} />
                Each response scores technically against industrial best-practices.
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
