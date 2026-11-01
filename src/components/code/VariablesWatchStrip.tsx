import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';

export const VariablesWatchStrip: React.FC = () => {
  const { currentStepIndex, executionResult } = useLabStore();
  const currentStep = executionResult.steps[currentStepIndex];
  const vars = currentStep?.activeVariables ?? {};

  return (
    <div className="w-full px-4 py-2.5 bg-white border-t border-warm-border flex items-center justify-between gap-3 overflow-x-auto text-[11px] font-mono select-none">
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-warm-sand">
          State Watch:
        </span>

        {/* Current Node u */}
        <div className="flex items-center gap-1 bg-warm-subtle px-2 py-0.5 rounded border border-warm-border">
          <span className="text-warm-mocha">u=</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={vars.u ?? 'none'}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              className="text-warm-terracotta font-bold"
            >
              {vars.u ?? '—'}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Target Node v */}
        <div className="flex items-center gap-1 bg-warm-subtle px-2 py-0.5 rounded border border-warm-border">
          <span className="text-warm-mocha">v=</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={vars.v ?? 'none'}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              className="text-warm-walnut font-bold"
            >
              {vars.v ?? '—'}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Weight w */}
        <div className="flex items-center gap-1 bg-warm-subtle px-2 py-0.5 rounded border border-warm-border">
          <span className="text-warm-mocha">w=</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={vars.w ?? 'none'}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              className="text-warm-amber font-bold"
            >
              {vars.w !== undefined ? vars.w : '—'}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Candidate newDist */}
        <div className="flex items-center gap-1 bg-warm-subtle px-2 py-0.5 rounded border border-warm-border">
          <span className="text-warm-mocha">new_dist=</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={vars.newDist ?? 'none'}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              className="text-warm-sage font-bold"
            >
              {vars.newDist !== undefined ? vars.newDist : '—'}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-warm-mocha shrink-0">
        <span>
          Heap: <strong className="text-warm-espresso font-semibold">{currentStep?.pqSnapshot?.length ?? 0}</strong>
        </span>
        <span className="text-warm-latte">•</span>
        <span>
          Settled: <strong className="text-warm-espresso font-semibold">{currentStep?.visitedSnapshot?.length ?? 0}</strong>
        </span>
      </div>
    </div>
  );
};
