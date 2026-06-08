import React, { useState } from 'react';
import { 
  FileText, UploadCloud, Play, FileCheck, HelpCircle, 
  CheckSquare, Sparkles, RefreshCw, Layers, X, Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

interface DocAnalyzerViewProps {
  onAnalyze: (text: string, fileName: string) => Promise<{ summary: string; takeaways: string[]; actionPlan: string[] }>;
  usageAdder: (credits: number) => void;
}

export default function DocAnalyzerView({ onAnalyze, usageAdder }: DocAnalyzerViewProps) {
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileStatus, setUploadedFileStatus] = useState<string | null>(null);
  const [results, setResults] = useState<{
    summary: string;
    takeaways: string[];
    actionPlan: string[];
  } | null>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setInputText(result);
        setUploadedFileStatus(`Compiled "${file.name}" (${(result.length / 1024).toFixed(1)} KB)`);
      }
    };
    reader.onerror = () => {
      setUploadedFileStatus(`Failed to read file: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    const el = document.getElementById('doc-file-upload-input');
    if (el) el.click();
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTxt = inputText.trim();
    if (!finalTxt) return;

    setLoading(true);
    try {
      const data = await onAnalyze(finalTxt, fileName || "Pasted Document");
      setResults(data);
      // Consume simulated credits
      usageAdder(250);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleLoad = () => {
    setInputText(`IAH.AI System Integration Blueprint & Security Protocols v1.02
Target Architecture: Multi-Agent Micro-Execution Environment.
Key Objectives:
1. Orchestrate 9 distinct agent specialties (CEO, Developer, Research, Design, etc.) into a cohesive multi-agent communication loop.
2. Establish secure API channels restricting access to process.env secrets, keeping all JWT signatures and Gemini tokens locked safely in server environment.
3. Keep clients responsive using optimistic UI synchronization, rendering markdown responses without blocking.
4. Implement lightweight LocalStorage fallback systems so offline states handle brief service disruptions comfortably.`);
    setFileName('integration_blueprint.txt');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="glass-panel border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-4 relative">
          <div className="bg-blue-500/15 border border-blue-500/20 p-3 rounded-xl text-blue-400">
            <FileText size={24} />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold font-display text-white tracking-tight">AI Document & Script Analyzer</h2>
            <p className="text-xs text-slate-400">Paste operational transcripts, product requirement docs, or outlines for instant structured actions.</p>
          </div>
        </div>
      </div>

      {/* 2. Form & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Document Card */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                <Layers size={14} className="text-blue-400" />
                Raw Content Input
              </span>
              <button
                id="load-sample-btn"
                onClick={handleSampleLoad}
                className="text-[10px] font-mono text-blue-400 hover:text-blue-300 font-semibold transition-colors bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
              >
                Load Sample Document
              </button>
            </div>

            {/* Real reactive file upload area */}
            <input
              id="doc-file-upload-input"
              type="file"
              className="hidden"
              accept=".txt,.md,.json,.pdf,.csv,.js,.ts,.tsx"
              onChange={handleFileChange}
            />

            {!inputText.trim() ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border border-dashed rounded-xl p-5 bg-slate-950/40 text-center space-y-2 cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.25)]' 
                    : 'border-slate-800 hover:border-blue-500/45'
                }`}
              >
                <UploadCloud size={24} className={`mx-auto transition-colors ${isDragging ? 'text-blue-400' : 'text-slate-500'}`} />
                <div className="text-[11px] text-slate-350">
                  <span className="font-semibold text-blue-400 hover:text-blue-300">Browse file</span> or drag files here
                </div>
                <div className="text-[9px] text-slate-550 font-mono uppercase">TXT, MD, CSV, JSON scripts up to 4MB</div>
                {uploadedFileStatus && (
                  <div className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900/30 py-1 px-2.5 rounded-lg inline-block animate-pulse">
                    {uploadedFileStatus}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-400 flex-shrink-0">
                      <FileCheck size={16} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white tracking-tight truncate max-w-[150px] md:max-w-[200px]">
                        {fileName || 'Pasted Content Stream'}
                      </h4>
                      <p className="text-[9px] font-mono text-slate-500 uppercase">ACTIVE DOCUMENT INSTALLED</p>
                    </div>
                  </div>

                  <button
                    id="cancel-uploaded-file-btn"
                    type="button"
                    onClick={() => {
                      setInputText('');
                      setFileName('');
                      setUploadedFileStatus(null);
                    }}
                    className="p-1 px-2 bg-slate-900 hover:bg-slate-900 border border-slate-800 hover:border-red-500/30 text-rose-405 text-red-500 hover:text-red-400 rounded-lg text-[9px] font-mono uppercase flex items-center gap-1 transition-all flex-shrink-0 pointer-events-auto cursor-pointer font-bold"
                  >
                    <Trash2 size={11} />
                    Cancel File Info
                  </button>
                </div>

                {/* Parsed File Indicators */}
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="bg-slate-900/40 border border-slate-850 p-2 rounded-lg space-y-0.5">
                    <span className="text-slate-500 text-[8px] uppercase tracking-wide block">File Size</span>
                    <span className="text-slate-200 font-semibold block truncate">
                      {((inputText.length * 2) / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-850 p-2 rounded-lg space-y-0.5">
                    <span className="text-slate-500 text-[8px] uppercase tracking-wide block">Words Count</span>
                    <span className="text-slate-200 font-semibold block truncate">
                      {inputText.trim() ? inputText.trim().split(/\s+/).length : 0}
                    </span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-850 p-2 rounded-lg space-y-0.5">
                    <span className="text-slate-500 text-[8px] uppercase tracking-wide block">Lines Count</span>
                    <span className="text-slate-200 font-semibold block truncate">
                      {inputText.split('\n').length} lines
                    </span>
                  </div>
                </div>

                {/* Micro preview */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Extracted Text Preview:</span>
                  <p className="text-[10px] leading-relaxed text-slate-400 italic bg-slate-900/40 p-2 rounded border border-slate-850 max-h-[60px] overflow-y-auto font-sans">
                    {inputText.substring(0, 150)}{inputText.length > 150 ? '...' : ''}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-bold">Document Identifier / File Name</label>
              <input
                id="doc-name-input"
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. Lambda Marketing Spec (Defaults: Pasted Document)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-slate-550 font-mono uppercase tracking-wider block font-bold">Document Content Body</label>
                {inputText.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputText('');
                      setFileName('');
                      setUploadedFileStatus(null);
                    }}
                    className="text-[9px] font-mono text-red-500 hover:text-red-400 uppercase transition-colors font-bold cursor-pointer"
                  >
                    Clear All Content
                  </button>
                )}
              </div>
              <textarea
                id="doc-body-textarea"
                rows={10}
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your research, logs, transcript, or startup blueprints here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800/60">
            <span className="text-[10px] font-mono text-emerald-400">✓ Premium Analysis Core Active</span>
            <button
              id="analyze-doc-btn"
              onClick={handleAnalyze}
              disabled={!inputText.trim() || loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 font-semibold rounded-xl text-xs text-white transition-colors flex items-center gap-2 shadow"
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Running Engine...
                </>
              ) : (
                <>
                  <Play size={12} fill="currentColor" />
                  Request Document Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Results Card */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[400px]">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 animate-pulse">
                <Sparkles size={24} />
              </div>
              <div className="space-y-1 max-w-xs">
                <span className="text-xs font-mono text-slate-200">DECODER ACTIVE</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Our core Document Agent is scanning the text paragraphs, grouping structures, and validating strategic deliverables.
                </p>
              </div>
            </div>
          ) : results ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <FileCheck className="text-emerald-400" size={18} />
                <h3 className="font-bold text-sm tracking-tight font-display text-white uppercase">Analysis Outputs</h3>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase">Executive Summary Narrative</h4>
                <p className="text-xs text-slate-300 bg-slate-950 p-4 border border-slate-800 rounded-xl leading-relaxed">
                  {results.summary}
                </p>
              </div>

              {/* Takeaways */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase">Key Deliverables & Takeaways</h4>
                <ul className="space-y-1.5 pl-1">
                  {results.takeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <Sparkles size={12} className="text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Plan */}
              <div className="space-y-2 pt-2">
                <h4 className="text-[10px] font-mono font-bold tracking-wider text-emerald-405 uppercase">Action Plan Tracker</h4>
                <div className="space-y-1.5">
                  {results.actionPlan.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-slate-900/50 p-2.5 border border-slate-850 rounded-lg">
                      <CheckSquare size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs font-sans text-slate-300 leading-normal">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3">
              <div className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-600">
                <HelpCircle size={24} />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="font-semibold text-white font-display text-sm tracking-tight">Structured Summary Pending</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  Choose a text sample or paste your own data on the left panel, then run the analyzer to compile intelligence models.
                </p>
              </div>
            </div>
          )}

          {results && (
            <div className="pt-4 border-t border-slate-850 flex justify-end">
              <button
                id="reset-analysis-btn"
                onClick={() => {
                  setInputText('');
                  setFileName('');
                  setUploadedFileStatus(null);
                  setResults(null);
                }}
                className="text-[10px] font-mono text-slate-400 hover:text-slate-200 uppercase font-semibold transition-colors cursor-pointer"
              >
                Clear Results
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
