import React from 'react';
import { useLabStore } from '../../store/useLabStore';
import { GraphCanvas } from '../../three/GraphCanvas';
import { CodePanel } from '../code/CodePanel';
import { StatePanel } from '../state/StatePanel';
import { ExplainPanel } from '../explain/ExplainPanel';
import { PlaybackBar } from './PlaybackBar';
import { Code2, Activity, MessageSquareText } from 'lucide-react';

export const LabWorkspace: React.FC = () => {
  const { activeTab, setActiveTab } = useLabStore();

  return (
    <section id="lab-section" className="relative w-full max-w-7xl mx-auto px-4 py-8 space-y-4">
      {/* Workspace Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-warm-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-warm-terracotta" />
            <h2 className="text-xl sm:text-2xl font-bold text-warm-espresso tracking-tight">
              Interactive Lab
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-warm-mocha mt-0.5">
            C++ STL implementation synchronized with 3D graph relaxation and priority queue state
          </p>
        </div>

        {/* Tab Controls for Right Panel */}
        <div className="flex items-center p-1 rounded-xl bg-warm-subtle border border-warm-border shadow-warm-sm">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'code'
                ? 'bg-white text-warm-espresso shadow-warm-sm border border-warm-border'
                : 'text-warm-mocha hover:text-warm-espresso'
            }`}
          >
            <Code2 className="w-4 h-4 text-warm-terracotta" />
            <span>C++ Code</span>
          </button>
          <button
            onClick={() => setActiveTab('state')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'state'
                ? 'bg-white text-warm-espresso shadow-warm-sm border border-warm-border'
                : 'text-warm-mocha hover:text-warm-espresso'
            }`}
          >
            <Activity className="w-4 h-4 text-warm-sage" />
            <span>Heap & Distances</span>
          </button>
          <button
            onClick={() => setActiveTab('explain')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'explain'
                ? 'bg-white text-warm-espresso shadow-warm-sm border border-warm-border'
                : 'text-warm-mocha hover:text-warm-espresso'
            }`}
          >
            <MessageSquareText className="w-4 h-4 text-warm-amber" />
            <span>Step Details</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left 60% Canvas | Right 40% Tab Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[620px]">
        {/* Left 60% 3D Graph Canvas */}
        <div className="lg:col-span-7 h-[420px] sm:h-[480px] lg:h-full">
          <GraphCanvas />
        </div>

        {/* Right 40% Tabbed Interactive Panel */}
        <div className="lg:col-span-5 h-[460px] lg:h-full">
          {activeTab === 'code' && <CodePanel />}
          {activeTab === 'state' && <StatePanel />}
          {activeTab === 'explain' && <ExplainPanel />}
        </div>
      </div>

      {/* Bottom Full-Width Playback Bar */}
      <PlaybackBar />
    </section>
  );
};
