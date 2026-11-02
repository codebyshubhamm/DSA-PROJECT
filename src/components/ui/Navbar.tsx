import React from 'react';
import { Terminal } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#FBF9F5]/90 border-b border-warm-border transition-all">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-warm-espresso flex items-center justify-center text-white font-mono font-bold text-sm shadow-warm-sm">
            C++
          </div>
          <div>
            <div className="font-bold text-warm-espresso text-base tracking-tight flex items-center gap-1.5">
              <span>DIJKSTRA LAB</span>
              <span className="text-warm-terracotta font-mono text-[10px] px-1.5 py-0.2 rounded bg-warm-subtle border border-warm-border">
                C++20
              </span>
            </div>
            <div className="text-[10px] font-mono text-warm-mocha tracking-wider">
              Shortest Path Algorithm Visualizer
            </div>
          </div>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-warm-mocha">
          <a
            href="#how-it-works"
            className="hover:text-warm-espresso transition"
          >
            Walkthrough
          </a>
          <a
            href="#lab-section"
            className="hover:text-warm-espresso transition"
          >
            Interactive Lab
          </a>
          <a
            href="#complexity"
            className="hover:text-warm-espresso transition"
          >
            Complexity
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <a
            href="#lab-section"
            className="px-4 py-2 rounded-xl bg-warm-espresso hover:bg-warm-walnut text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-warm-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-warm-sand" />
            <span>Launch Lab</span>
          </a>
        </div>
      </div>
    </header>
  );
};
