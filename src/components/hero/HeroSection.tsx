import React from 'react';
import { motion } from 'framer-motion';
import { Hero3DScene } from './Hero3DScene';
import { Play, ChevronDown, ArrowUpRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToLab = () => {
    const el = document.getElementById('lab-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[88vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-[#FBF9F5]">
      {/* 3D Background */}
      <Hero3DScene />

      {/* Subtle Warm Amber Gradient Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[#E8DFD5]/40 blur-[110px] rounded-full pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-6 pt-10">
        {/* Subtle Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-warm-border shadow-warm-sm"
        >
          <span className="w-2 h-2 rounded-full bg-warm-terracotta" />
          <span className="font-mono text-xs uppercase tracking-wider text-warm-mocha font-semibold">
            Interactive Algorithm Notes • C++ STL
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-warm-espresso tracking-tight leading-[1.12]"
        >
          Understanding Dijkstra’s{' '}
          <span className="text-warm-terracotta italic font-serif">
            Shortest Path
          </span>{' '}
          in C++
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-base sm:text-lg text-warm-mocha max-w-2xl mx-auto leading-relaxed"
        >
          A tactile, visual study of greedy pathfinding. Watch the min-heap
          order candidate vertices, follow triangle relaxation step-by-step,
          and see the exact C++ lines execute in real time.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
        >
          <button
            onClick={scrollToLab}
            className="group px-7 py-3 rounded-xl bg-warm-espresso hover:bg-warm-walnut text-white font-semibold text-sm shadow-warm-md transition-all duration-200 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current text-warm-sand" />
            <span>Open Interactive Lab</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-warm-sand" />
          </button>

          <a
            href="#how-it-works"
            className="px-6 py-3 rounded-xl bg-white hover:bg-warm-subtle text-warm-espresso border border-warm-border font-medium text-sm transition-all duration-200 flex items-center gap-1.5 shadow-warm-sm"
          >
            <span>Read Algorithm Walkthrough</span>
            <ArrowUpRight className="w-4 h-4 text-warm-sand" />
          </a>
        </motion.div>

        {/* Technical Specs Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 font-mono text-xs text-warm-mocha border-t border-warm-border"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-warm-sage" />
            <span>std::priority_queue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-warm-terracotta" />
            <span>Line-by-Line Code Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-warm-amber" />
            <span>Zero AI-Slop Design</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
