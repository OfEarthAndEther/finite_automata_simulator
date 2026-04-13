import { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import GraphCanvas from './components/GraphCanvas';
import TransitionTable from './components/TransitionTable';
import ThemeToggle from './components/ThemeToggle';
import { useAutomata } from './hooks/useAutomata';
import { Settings, Play, FastForward, Rewind, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

import { PRESET_EXAMPLES } from './examples';

export default function App() {
  const [nodes, setNodes] = useState(PRESET_EXAMPLES.DFA.nodes);
  const [edges, setEdges] = useState(PRESET_EXAMPLES.DFA.edges);
  const [mode, setMode] = useState('DFA'); // 'DFA' or 'NFA'

  const loadExample = (key) => {
    if (!key) return;
    const example = PRESET_EXAMPLES[key];
    setMode(example.mode);
    setNodes(example.nodes);
    setEdges(example.edges);
  };

  const { engine, state, setInputString, step, stepBack, reset, syncEngine } = useAutomata(nodes, edges, mode);

  // Sync engine when nodes/edges/mode change
  useEffect(() => {
    syncEngine();
  }, [nodes, edges, mode, syncEngine]);

  const handleInputString = (e) => setInputString(e.target.value);

  const getReasoning = () => {
    if (state.status === 'idle') return "System Idle / Awaiting String. Active subsets initialized strictly via recursive ε-closure bounds stemming from the primary initial state q₀.";
    if (state.status === 'running') return "Executing real-time branch computation. Transitions actuate systematically against graph intersections; non-determinism forces parallel state branching naturally.";
    if (state.status === 'accepted') {
      return "Mathematical Convergence: String completely parsed. The ultimate terminal nodes definitively overlap the designated accepting constraints subset F.";
    }
    if (state.status === 'rejected') {
      if (state.activeStates.size === 0) {
        return "Trap Extinction: Parsing fatally collapsed due to a distinct input sequence unmapped against any outgoing graph edges on the active state(s).";
      } else {
        return "Failed Convergence Validated: String exhausted perfectly, however the resultant terminal states are completely disjoint from the final acceptable language boundaries F.";
      }
    }
    return "";
  };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen overflow-hidden font-sans">

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Top Bar */}
          <header className="h-16 px-6 bg-white/40 backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-between shadow-sm z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-[var(--primary-color)] text-white p-2 rounded-lg shadow-sm">
                <Settings size={20} />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-800 leading-tight">Finite Automata Simulator</h1>
                <p className="text-xs text-gray-500 font-medium">Design • Simulate • Understand</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-4">
                <span className="text-xs font-semibold text-gray-500">EXAMPLES:</span>
                <select
                  onChange={(e) => loadExample(e.target.value)}
                  className="text-sm bg-white border border-gray-200 rounded px-2 py-1 shadow-sm focus:outline-none"
                  defaultValue="DFA"
                >
                  <option value="" disabled>Load Preset...</option>
                  {Object.keys(PRESET_EXAMPLES).map(key => (
                    <option key={key} value={key}>{PRESET_EXAMPLES[key].name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-100 p-1 rounded-lg flex shadow-inner">
                <button
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${mode === 'DFA' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}
                  onClick={() => setMode('DFA')}
                >
                  DFA
                </button>
                <button
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${mode === 'NFA' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}
                  onClick={() => setMode('NFA')}
                >
                  NFA
                </button>
              </div>
              <ThemeToggle />
            </div>
          </header>

          {/* Canvas Area */}
          <main className="flex-1 relative bg-[var(--bg-color)]">
            <GraphCanvas
              nodes={nodes}
              setNodes={setNodes}
              edges={edges}
              setEdges={setEdges}
              activeStates={state.activeStates}
            />
          </main>

          {/* Bottom Table Panel */}
          <div className="h-48 shrink-0 bg-white/30 backdrop-blur-md border-t border-[var(--border-color)] p-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">Transition Matrix M = (Q, Σ, δ, q₀, F)</h3>
              <TransitionTable engine={engine} activeStates={state.activeStates} />
            </div>
          </div>

        </div>

        {/* Right Panel: Simulation Container */}
        <aside className="w-80 bg-white/60 backdrop-blur-xl border-l border-[var(--border-color)] flex flex-col z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-5 border-b border-[var(--border-color)]">
            <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-4">
              <Play size={18} className="text-[var(--primary-color)]" /> Simulation
            </h2>

            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 block">Input String</label>
            <input
              type="text"
              value={state.inputString}
              onChange={handleInputString}
              placeholder="e.g. 1001"
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all"
            />

            {mode === 'DFA' && !state.validationInfo.valid && (
              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-xs text-red-600 font-semibold mb-1">! DFA Incomplete</p>
                <p className="text-[10px] text-red-500 leading-snug">{state.validationInfo.error}</p>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={stepBack}
                disabled={state.history.length === 0}
                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 text-sm font-semibold py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                title="Step Backward"
              >
                <Rewind size={14} /> Back
              </button>
              <button
                onClick={step}
                disabled={state.currentIndex >= state.inputString.length && state.status !== 'idle'}
                className="flex-1 bg-[var(--primary-color)] hover:opacity-90 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
              >
                Forward <FastForward size={14} />
              </button>
              <button
                onClick={reset}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold p-2 rounded-lg transition-all"
                title="Reset"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 pb-8 flex flex-col gap-5">
            {/* Input Tape Viz */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Input Tape</div>
              <div className="flex flex-wrap gap-1.5">
                {state.inputString === '' ? (
                  <span className="text-xs italic text-gray-400">Empty string $\epsilon$</span>
                ) : (
                  state.inputString.split('').map((char, idx) => (
                    <motion.div
                      key={idx}
                      className={`w-7 h-8 flex items-center justify-center rounded text-sm font-mono font-bold border transition-all ${idx < state.currentIndex ? 'bg-gray-100 border-gray-200 text-gray-400' :
                        idx === state.currentIndex ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)] shadow-md -translate-y-0.5' :
                          'bg-white border-gray-200 text-gray-700 shadow-sm'
                        }`}
                    >
                      {char}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Active Nodes Tracker */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Current State(s)</div>
              <div className="flex flex-wrap gap-2">
                {Array.from(state.activeStates).map(nodeId => (
                  <div key={nodeId} className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-xs font-mono font-bold shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    {nodeId}
                  </div>
                ))}
                {state.activeStates.size === 0 && (
                  <span className="text-xs italic text-red-400 font-semibold px-2 py-1 bg-red-50 rounded-full border border-red-100">DEAD NODE / CRASH</span>
                )}
              </div>
            </div>

            {/* Status Output */}
            {(state.status === 'accepted' || state.status === 'rejected') && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`mt-2 p-4 rounded-xl border-2 text-center shadow-lg ${state.status === 'accepted'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : 'bg-rose-50 border-rose-200 text-rose-600'
                  }`}
              >
                <div className="text-sm font-black uppercase tracking-widest mb-1">
                  {state.status === 'accepted' ? '✓ Accepted' : '✗ Rejected'}
                </div>
                <div className="text-xs opacity-80 font-medium">
                  {state.status === 'accepted' ? 'Halted on final state' : 'Did not halt on final state'}
                </div>
              </motion.div>
            )}

            {/* Runtime Concept & Validation Theoretical Reasoning */}
            <div className="mt-auto pt-2 space-y-3 shrink-0">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                  <span>Theoretical Validation</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${state.status === 'running' ? 'bg-blue-400 animate-pulse' : state.status === 'accepted' ? 'bg-emerald-400' : state.status === 'rejected' ? 'bg-rose-400' : 'bg-gray-400'}`}></span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {getReasoning()}
                </p>
              </div>

              {/* Engineering Hints */}
              <details className="group bg-slate-50 border border-slate-200 rounded-lg open:bg-slate-100 transition-colors shadow-sm">
                <summary className="text-[10px] font-bold text-slate-600 uppercase tracking-widest p-3 cursor-pointer list-none flex justify-between items-center focus:outline-none">
                  Simulation Design Hints
                  <span className="group-open:rotate-180 transition-transform text-slate-400">▼</span>
                </summary>
                <div className="px-3 pb-3 text-[11px] text-slate-700 leading-relaxed space-y-2 font-medium border-t border-slate-200 pt-2">
                  <p><strong>• Form Planarity:</strong> Organize discrete states strictly linearly (Start → End). Resolving dense graph permutations geometrically minimizes unverified looping behavior.</p>
                  <p><strong>• ε-Bridges:</strong> Modularly join discrete NFA domains (like a concatenated logic string) exclusively using independent ε-closures rather than hard-coding nested absolute paths.</p>
                  <p><strong>• Explicit Traps:</strong> Specifically for DFA engineering, physically represent unhandled transition permutations via a labeled 'Dead Node' rather than allowing the engine to implicitly collapse the path.</p>
                  <p><strong>• Edge-Case Bounds:</strong> Always simulate initial disruptions first (e.g. empty strings). Verify immediate topological loop behavior before establishing standard traversal branches.</p>
                </div>
              </details>
            </div>

          </div>
        </aside>

      </div>
    </ReactFlowProvider>
  );
}
