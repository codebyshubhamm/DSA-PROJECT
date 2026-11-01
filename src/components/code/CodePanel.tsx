import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';
import { CPP_CODE_LINES } from '../../algo/codeSnippets';
import type { CodeLineInfo } from '../../algo/codeSnippets';
import { VariablesWatchStrip } from './VariablesWatchStrip';
import { Play } from 'lucide-react';

export const CodePanel: React.FC = () => {
  const {
    currentStepIndex,
    executionResult,
    hoveredCodeLine,
    setHoveredCodeLine,
    hoveredGraphElement,
    jumpToStepWhereLine,
  } = useLabStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const [hoveredLineInfo, setHoveredLineInfo] = useState<CodeLineInfo | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ top: number; left: number } | null>(null);

  const currentStep = executionResult.steps[currentStepIndex];
  const activeLineNumber = currentStep?.codeLine ?? 3;

  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLineNumber]);

  const isLineHighlightedByGraphHover = (lineNum: number) => {
    if (!hoveredGraphElement) return false;
    if (hoveredGraphElement.type === 'edge') {
      return [17, 18, 19, 20, 21, 22, 23].includes(lineNum);
    }
    if (hoveredGraphElement.type === 'node') {
      return [13, 14, 15, 16, 21, 22].includes(lineNum);
    }
    return false;
  };

  const getVariableLiveValues = (line: CodeLineInfo) => {
    if (!currentStep) return null;
    const vars = currentStep.activeVariables;
    const values: Array<{ key: string; val: string | number }> = [];

    if (line.variableHints?.includes('u') && vars.u) {
      values.push({ key: 'u', val: `"${vars.u}"` });
      if (currentStep.distSnapshot[vars.u] !== undefined) {
        values.push({ key: `dist["${vars.u}"]`, val: currentStep.distSnapshot[vars.u] });
      }
    }
    if (line.variableHints?.includes('v') && vars.v) {
      values.push({ key: 'v', val: `"${vars.v}"` });
      const currentVDist = currentStep.distSnapshot[vars.v];
      values.push({
        key: `dist["${vars.v}"]`,
        val: currentVDist === Infinity ? 'INF' : currentVDist,
      });
    }
    if (line.variableHints?.includes('w') && vars.w !== undefined) {
      values.push({ key: 'w', val: vars.w });
    }
    if (line.variableHints?.includes('newDist') && vars.newDist !== undefined) {
      values.push({ key: 'new_dist', val: vars.newDist });
    }
    return values.length > 0 ? values : null;
  };

  return (
    <div className="relative flex flex-col h-full bg-white select-none overflow-hidden rounded-2xl border border-warm-border shadow-warm-md">
      {/* Editorial Code Header - C++ Only */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-warm-subtle border-b border-warm-border">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-warm-sand" />
          <span className="font-mono text-xs font-bold text-warm-espresso">
            dijkstra.cpp
          </span>
          <span className="text-[10px] font-mono text-warm-mocha px-1.5 py-0.2 rounded bg-white border border-warm-border">
            C++20 STL
          </span>
        </div>

        <div className="text-[11px] font-mono text-warm-mocha">
          Line <strong className="text-warm-terracotta">{activeLineNumber}</strong> of {CPP_CODE_LINES.length}
        </div>
      </div>

      {/* Code Listing */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-y-auto overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-warm-espresso scroll-smooth bg-white"
      >
        {CPP_CODE_LINES.map((line: CodeLineInfo) => {
          const isActive = line.lineNumber === activeLineNumber;
          const isGraphHovered = isLineHighlightedByGraphHover(line.lineNumber);
          const isSelfHovered = hoveredCodeLine === line.lineNumber;

          return (
            <div
              key={line.lineNumber}
              ref={isActive ? activeLineRef : null}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoveredCodeLine(line.lineNumber);
                setHoveredLineInfo(line);
                setHoverPosition({
                  top: rect.top - 10,
                  left: Math.max(10, rect.left - 290),
                });
              }}
              onMouseLeave={() => {
                setHoveredCodeLine(null);
                setHoveredLineInfo(null);
                setHoverPosition(null);
              }}
              className={`relative flex items-center group py-0.5 px-2 rounded-md transition-colors duration-150 cursor-pointer ${
                isActive
                  ? 'text-warm-espresso font-semibold'
                  : isGraphHovered
                  ? 'bg-warm-subtle text-warm-terracotta'
                  : 'hover:bg-warm-subtle/70'
              }`}
            >
              {/* Active Line Marker in Warm Terracotta */}
              {isActive && (
                <motion.div
                  layoutId="code-highlight-bar"
                  className="absolute inset-0 rounded-md bg-[#FAF0EA] border-l-2 border-warm-terracotta pointer-events-none"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 32,
                  }}
                />
              )}

              {/* Line Number */}
              <span
                className={`w-7 shrink-0 text-right pr-3 select-none text-[11px] font-mono ${
                  isActive
                    ? 'text-warm-terracotta font-bold'
                    : isGraphHovered
                    ? 'text-warm-terracotta'
                    : 'text-warm-sand group-hover:text-warm-mocha'
                }`}
              >
                {line.lineNumber}
              </span>

              {/* Code Text */}
              <span className="relative z-10 whitespace-pre">{line.code}</span>

              {/* Jump to Line Button */}
              {isSelfHovered && !isActive && line.code.trim().length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    jumpToStepWhereLine(line.lineNumber);
                  }}
                  className="ml-auto z-20 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-warm-espresso text-white hover:bg-warm-walnut shadow-warm-sm"
                  title="Run playback to this line"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  Run here
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Line Inspection Tooltip in Warm Paper */}
      <AnimatePresence>
        {hoveredLineInfo && hoveredLineInfo.code.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none max-w-sm p-3.5 rounded-xl bg-white border border-warm-border shadow-warm-lg text-xs space-y-2 font-sans"
            style={{
              top: hoverPosition ? Math.max(10, hoverPosition.top - 60) : 100,
              left: hoverPosition ? Math.max(20, hoverPosition.left) : 100,
            }}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-warm-border">
              <span className="font-mono text-warm-terracotta font-bold text-xs">
                Line {hoveredLineInfo.lineNumber}
              </span>
              <span className="text-[10px] text-warm-sand uppercase tracking-wider font-mono">
                C++ Invariant
              </span>
            </div>

            <p className="text-warm-espresso text-[11px] leading-relaxed">
              {hoveredLineInfo.explanation}
            </p>

            {getVariableLiveValues(hoveredLineInfo) && (
              <div className="pt-1.5 border-t border-warm-border flex flex-wrap gap-1.5 font-mono text-[10px]">
                <span className="text-warm-mocha font-bold">Scope:</span>
                {getVariableLiveValues(hoveredLineInfo)!.map((v, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.2 rounded bg-warm-subtle border border-warm-border text-warm-espresso"
                  >
                    {v.key} = <strong className="text-warm-terracotta">{v.val}</strong>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <VariablesWatchStrip />
    </div>
  );
};
