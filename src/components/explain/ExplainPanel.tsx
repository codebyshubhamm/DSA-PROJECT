import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';
import { BookOpen, Terminal } from 'lucide-react';

export const ExplainPanel: React.FC = () => {
  const {
    currentStepIndex,
    executionResult,
    beginnerMode,
    toggleBeginnerMode,
  } = useLabStore();

  const currentStep = executionResult.steps[currentStepIndex];

  if (!currentStep) {
    return (
      <div className="flex items-center justify-center h-full text-warm-sand font-mono text-xs">
        No active step.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-y-auto p-4 space-y-4 rounded-2xl border border-warm-border shadow-warm-md text-warm-espresso font-sans">
      {/* Top Controls: Mode Switch */}
      <div className="flex items-center justify-between pb-3 border-b border-warm-border">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-warm-espresso">
          <Terminal className="w-3.5 h-3.5 text-warm-terracotta" />
          <span>Execution Step {currentStep.stepIndex + 1} / {executionResult.steps.length}</span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-0.5 rounded-lg bg-warm-subtle border border-warm-border text-xs">
          <button
            onClick={toggleBeginnerMode}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              beginnerMode
                ? 'bg-white text-warm-espresso shadow-warm-sm font-semibold'
                : 'text-warm-mocha hover:text-warm-espresso'
            }`}
          >
            Intuition
          </button>
          <button
            onClick={toggleBeginnerMode}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              !beginnerMode
                ? 'bg-white text-warm-espresso shadow-warm-sm font-semibold'
                : 'text-warm-mocha hover:text-warm-espresso'
            }`}
          >
            Proof / Invariant
          </button>
        </div>
      </div>

      {/* Main Step Narration Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStepIndex}-${beginnerMode ? 'beg' : 'det'}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="p-4 rounded-xl bg-warm-subtle border border-warm-border space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-warm-terracotta font-bold">
              Phase: {currentStep.type.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-warm-mocha bg-white px-2 py-0.5 rounded border border-warm-border">
              C++ Line {currentStep.codeLine}
            </span>
          </div>

          <p className="text-sm font-semibold text-warm-espresso leading-relaxed">
            {currentStep.explanation}
          </p>

          <div className="p-3 rounded-lg bg-white border border-warm-border space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-warm-mocha flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 text-warm-amber" />
              Algorithmic Invariant:
            </span>
            <p className="text-xs text-warm-mocha leading-relaxed">
              {currentStep.detailedWhy}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Concise C++ Reference Notes */}
      <div className="p-3.5 rounded-xl bg-warm-subtle/60 border border-warm-border text-xs text-warm-mocha space-y-2">
        <h4 className="text-[11px] font-bold text-warm-espresso uppercase tracking-wider">
          Dijkstra Key Invariants (C++):
        </h4>
        <ul className="list-disc list-inside space-y-1 text-[11px]">
          <li>
            <strong className="text-warm-espresso">Min-Heap Top:</strong> <code className="text-warm-terracotta font-mono text-[10px]">pq.top()</code> always yields the unvisited vertex with the minimum tentative distance.
          </li>
          <li>
            <strong className="text-warm-espresso">Triangle Relaxation:</strong> If <code className="text-warm-terracotta font-mono text-[10px]">dist[u] + w &lt; dist[v]</code>, we update <code className="text-warm-terracotta font-mono text-[10px]">dist[v]</code> and push <code className="text-warm-terracotta font-mono text-[10px]">&#123;dist[v], v&#125;</code>.
          </li>
          <li>
            <strong className="text-warm-espresso">Settled Invariant:</strong> Once <code className="text-warm-terracotta font-mono text-[10px]">visited.insert(u)</code> runs, its distance is finalized and will never decrease.
          </li>
        </ul>
      </div>
    </div>
  );
};
