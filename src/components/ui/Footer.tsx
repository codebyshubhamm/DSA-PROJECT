import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-warm-border bg-[#F5EFEB] py-12 px-4 text-xs font-mono text-warm-mocha">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-warm-espresso flex items-center justify-center font-bold text-white text-[11px]">
            C++
          </div>
          <div>
            <div className="font-bold text-warm-espresso">DIJKSTRA LAB</div>
            <div className="text-[10px] text-warm-mocha">
              Interactive C++ STL Shortest Path Visualizer
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-warm-mocha">
          <span>Keyboard:</span>
          <span className="px-1.5 py-0.5 rounded bg-white border border-warm-border text-warm-espresso">
            Space
          </span>
          <span>Play/Pause</span>
          <span className="px-1.5 py-0.5 rounded bg-white border border-warm-border text-warm-espresso">
            ← / →
          </span>
          <span>Step</span>
          <span className="px-1.5 py-0.5 rounded bg-white border border-warm-border text-warm-espresso">
            R
          </span>
          <span>Reset</span>
        </div>

        <div className="text-[10px] text-warm-mocha text-center md:text-right">
          Edsger W. Dijkstra (1930 – 2002) • "Simplicity is prerequisite for reliability."
        </div>
      </div>
    </footer>
  );
};
