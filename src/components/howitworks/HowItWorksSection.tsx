import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  TrendingDown,
  RotateCw,
} from 'lucide-react';

interface StepCard {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  cppCode: string;
  visualType: 'init' | 'extract' | 'relax' | 'repeat' | 'path';
}

const steps: StepCard[] = [
  {
    number: '01',
    title: 'Initialize Distances',
    subtitle: 'Base state setup',
    description:
      'Set dist[src] = 0.0 and all other vertices to infinity. Enqueue {0.0, src} into the C++ min-heap.',
    cppCode: 'dist[src] = 0.0; pq.push({0.0, src});',
    visualType: 'init',
  },
  {
    number: '02',
    title: 'Extract Nearest Unvisited',
    subtitle: 'The greedy choice property',
    description:
      'Extract the pair with smallest tentative distance from pq.top(). Since edge weights are non-negative, this distance is guaranteed to be optimal.',
    cppCode: 'auto [d, u] = pq.top(); pq.pop();',
    visualType: 'extract',
  },
  {
    number: '03',
    title: 'Relax Outgoing Edges',
    subtitle: 'Triangle inequality check',
    description:
      'For each adjacent edge (u → v, w), test if dist[u] + w < dist[v]. If cheaper, update dist[v] and enqueue {dist[v], v}.',
    cppCode: 'if (new_dist < dist[v]) { dist[v] = new_dist; pq.push({new_dist, v}); }',
    visualType: 'relax',
  },
  {
    number: '04',
    title: 'Mark Settled & Repeat',
    subtitle: 'Expanding the known frontier',
    description:
      'Insert u into visited set. Repeat until the priority queue is empty or the target vertex is extracted.',
    cppCode: 'visited.insert(u);',
    visualType: 'repeat',
  },
  {
    number: '05',
    title: 'Reconstruct Shortest Path',
    subtitle: 'Predecessor backtracking',
    description:
      'Follow the predecessor map prev[] backwards from target to source to recover the complete shortest path.',
    cppCode: 'while (curr != src) { path.push_back(curr); curr = prev[curr]; }',
    visualType: 'path',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="relative w-full max-w-7xl mx-auto px-4 py-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-warm-border text-xs font-mono text-warm-terracotta shadow-warm-sm">
          <Compass className="w-3.5 h-3.5" />
          <span>Algorithmic Method</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-warm-espresso tracking-tight">
          How the Algorithm Works
        </h2>
        <p className="text-warm-mocha text-sm leading-relaxed">
          Formulated by Edsger W. Dijkstra in 1959, the algorithm finds the single-source shortest path on graphs with non-negative edge weights across 5 discrete phases.
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="group relative p-6 rounded-2xl warm-card flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-black text-warm-sand group-hover:text-warm-terracotta transition-colors">
                {step.number}
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-warm-subtle border border-warm-border text-warm-mocha">
                Phase {idx + 1}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-warm-espresso">
                {step.title}
              </h3>
              <p className="text-xs text-warm-terracotta font-medium">
                {step.subtitle}
              </p>
              <p className="text-xs text-warm-mocha leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Visual preview box */}
            <div className="h-18 w-full rounded-xl bg-warm-subtle border border-warm-border flex items-center justify-center p-3 relative">
              {step.visualType === 'init' && (
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-warm-terracotta/20 border border-warm-terracotta text-warm-terracotta flex items-center justify-center font-bold text-[11px]">
                      S
                    </span>
                    <span className="text-[10px] text-warm-sage font-bold mt-0.5">0.0</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-warm-sand" />
                  <div className="flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-white border border-warm-border text-warm-mocha flex items-center justify-center text-[11px]">
                      A
                    </span>
                    <span className="text-[10px] text-warm-sand mt-0.5">INF</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-white border border-warm-border text-warm-mocha flex items-center justify-center text-[11px]">
                      B
                    </span>
                    <span className="text-[10px] text-warm-sand mt-0.5">INF</span>
                  </div>
                </div>
              )}

              {step.visualType === 'extract' && (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-1 rounded bg-[#FFF7ED] text-warm-amber border border-warm-amber/30 font-bold">
                    u = pq.top()
                  </span>
                  <ArrowRight className="w-3 h-3 text-warm-sand" />
                  <span className="px-2 py-1 rounded bg-warm-sage/15 text-warm-sage border border-warm-sage/30">
                    visited.insert(u)
                  </span>
                </div>
              )}

              {step.visualType === 'relax' && (
                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="text-center">
                    <span className="text-warm-sand text-[10px]">dist[v]:</span>
                    <span className="text-warm-brick line-through ml-1">9.0</span>
                  </div>
                  <TrendingDown className="w-4 h-4 text-warm-sage" />
                  <div className="text-center">
                    <span className="text-warm-sand text-[10px]">new_dist:</span>
                    <span className="text-warm-sage font-bold ml-1">4.0 + 3.0 = 7.0</span>
                  </div>
                </div>
              )}

              {step.visualType === 'repeat' && (
                <div className="flex items-center gap-2 font-mono text-xs text-warm-mocha">
                  <RotateCw className="w-4 h-4 text-warm-terracotta" />
                  <span>Loop until pq.empty()</span>
                </div>
              )}

              {step.visualType === 'path' && (
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="px-1.5 py-0.5 rounded bg-warm-subtle text-warm-espresso border border-warm-border font-bold">
                    A
                  </span>
                  <ArrowRight className="w-3 h-3 text-warm-amber" />
                  <span className="px-1.5 py-0.5 rounded bg-warm-subtle text-warm-espresso border border-warm-border font-bold">
                    C
                  </span>
                  <ArrowRight className="w-3 h-3 text-warm-amber" />
                  <span className="px-1.5 py-0.5 rounded bg-warm-subtle text-warm-espresso border border-warm-border font-bold">
                    D
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-warm-border font-mono text-[10px] text-warm-mocha truncate">
              <code>{step.cppCode}</code>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
