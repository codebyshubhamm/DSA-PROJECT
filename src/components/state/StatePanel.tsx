import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';
import { DESIGN_TOKENS } from '../../styles/designTokens';
import { ArrowRight, CheckCircle2, Clock, MapPin } from 'lucide-react';

export const StatePanel: React.FC = () => {
  const { currentStepIndex, executionResult, graph, sourceNodeId, targetNodeId } =
    useLabStore();

  const currentStep = executionResult.steps[currentStepIndex];
  const pqItems = currentStep?.pqSnapshot ?? [];
  const distSnapshot = currentStep?.distSnapshot ?? {};
  const prevSnapshot = currentStep?.prevSnapshot ?? {};
  const visitedSet = new Set(currentStep?.visitedSnapshot ?? []);
  const finalPath = currentStep?.finalPath ?? [];
  const totalCost = currentStep?.totalCost ?? 0;

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-y-auto p-4 space-y-4 rounded-2xl border border-warm-border shadow-warm-md text-warm-espresso font-sans">
      {/* 1. Min-Priority Queue */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-warm-amber" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-warm-espresso">
              std::priority_queue (Min-Heap)
            </h3>
          </div>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-warm-subtle border border-warm-border text-warm-mocha">
            {pqItems.length} {pqItems.length === 1 ? 'element' : 'elements'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-warm-subtle border border-warm-border min-h-[56px] flex items-center">
          {pqItems.length === 0 ? (
            <span className="text-xs font-mono text-warm-sand italic">
              Priority queue is empty (all reachable vertices settled)
            </span>
          ) : (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {pqItems.map((item, index) => {
                  const isMin = index === 0;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ scale: 0.85, opacity: 0, y: -4 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.75, opacity: 0, y: 4 }}
                      transition={DESIGN_TOKENS.springs.layoutId}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs border shadow-warm-sm ${
                        isMin
                          ? 'bg-[#FFF7ED] text-warm-amber border-warm-amber/40 font-bold'
                          : 'bg-white text-warm-espresso border-warm-border'
                      }`}
                    >
                      <span className="text-warm-espresso">{item.id}</span>
                      <span className="text-warm-sand">:</span>
                      <span className="font-semibold">{item.dist}</span>
                      {isMin && (
                        <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-warm-amber/15 text-warm-amber uppercase font-sans font-extrabold">
                          top
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* 2. Shortest Path Result Breadcrumb */}
      {finalPath.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 rounded-xl bg-[#FFFDF7] border border-warm-honey/40 space-y-2 shadow-warm-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-warm-amber flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Shortest Path
            </span>
            <span className="font-mono text-xs text-warm-espresso font-bold bg-white px-2 py-0.5 rounded border border-warm-border">
              Total Cost: {totalCost}
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-1.5 font-mono text-xs">
            {finalPath.map((nodeId, idx) => (
              <React.Fragment key={nodeId}>
                <span className="px-2 py-1 rounded-md bg-warm-subtle text-warm-espresso border border-warm-border font-bold">
                  {nodeId}
                </span>
                {idx < finalPath.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-warm-amber" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      )}

      {/* 3. Distance & Predecessor Table */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-warm-espresso flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-warm-sage" />
            Distance Table (std::unordered_map)
          </h3>
          <span className="text-[10px] text-warm-sand font-mono">
            Source: {sourceNodeId} • Target: {targetNodeId}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-warm-border bg-white">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-warm-subtle text-[10px] text-warm-mocha uppercase tracking-wider border-b border-warm-border">
              <tr>
                <th className="py-2 px-3">Vertex</th>
                <th className="py-2 px-3">dist[v]</th>
                <th className="py-2 px-3">prev[v]</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border">
              {graph.nodes.map((node) => {
                const dist = distSnapshot[node.id];
                const prev = prevSnapshot[node.id];
                const isVisited = visitedSet.has(node.id);
                const isInQueue = pqItems.some((item) => item.id === node.id);
                const isCurrent = currentStep?.currentNodeId === node.id;
                const isOnPath = finalPath.includes(node.id);

                return (
                  <tr
                    key={node.id}
                    className={`transition-colors duration-150 ${
                      isCurrent
                        ? 'bg-[#FAF0EA]'
                        : isOnPath
                        ? 'bg-[#FFFDF7]'
                        : 'hover:bg-warm-subtle/50'
                    }`}
                  >
                    <td className="py-2 px-3 font-bold text-warm-espresso flex items-center gap-1.5">
                      <span>{node.label}</span>
                      {node.id === sourceNodeId && (
                        <span className="text-[9px] px-1 rounded bg-warm-terracotta/15 text-warm-terracotta border border-warm-terracotta/30">
                          SRC
                        </span>
                      )}
                      {node.id === targetNodeId && (
                        <span className="text-[9px] px-1 rounded bg-warm-espresso/15 text-warm-espresso border border-warm-espresso/30">
                          TGT
                        </span>
                      )}
                    </td>

                    <td className="py-2 px-3">
                      <span
                        className={`font-semibold ${
                          dist === Infinity
                            ? 'text-warm-sand'
                            : isCurrent
                            ? 'text-warm-terracotta'
                            : 'text-warm-espresso'
                        }`}
                      >
                        {dist === Infinity ? 'INF' : dist}
                      </span>
                    </td>

                    <td className="py-2 px-3 text-warm-mocha">
                      {prev ? (
                        <span className="text-warm-terracotta font-semibold">{prev}</span>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="py-2 px-3">
                      {isOnPath ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#FFF7ED] text-warm-amber border border-warm-amber/30 font-bold">
                          Shortest Path
                        </span>
                      ) : isCurrent ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-warm-terracotta/15 text-warm-terracotta border border-warm-terracotta/30 font-bold">
                          Evaluating
                        </span>
                      ) : isVisited ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-warm-sage/15 text-warm-sage border border-warm-sage/30">
                          Settled
                        </span>
                      ) : isInQueue ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-warm-amber/15 text-warm-amber border border-warm-amber/30">
                          In Heap
                        </span>
                      ) : (
                        <span className="text-[10px] text-warm-sand">Unvisited</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
