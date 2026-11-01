import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  FastForward,
  SlidersHorizontal,
} from 'lucide-react';

export const PlaybackBar: React.FC = () => {
  const {
    currentStepIndex,
    executionResult,
    isPlaying,
    playbackSpeed,
    autoPlayOnChange,
    stepForward,
    stepBackward,
    jumpToStart,
    jumpToEnd,
    togglePlay,
    setPlaybackSpeed,
    setAutoPlayOnChange,
    setCurrentStepIndex,
  } = useLabStore();

  const totalSteps = executionResult.steps.length;
  const progressPercent =
    totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(100, Math.round(750 / playbackSpeed));
      timerRef.current = setInterval(() => {
        stepForward();
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, stepForward]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        jumpToStart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, stepForward, stepBackward, jumpToStart]);

  return (
    <div className="w-full px-4 py-3 bg-white border border-warm-border rounded-2xl shadow-warm-md flex flex-col gap-2.5">
      {/* 1. Scrubber Timeline */}
      <div className="relative w-full flex items-center group">
        <div className="relative w-full h-2 rounded-full bg-warm-subtle border border-warm-border overflow-hidden cursor-pointer">
          <motion.div
            className="h-full bg-gradient-to-r from-warm-terracotta via-warm-amber to-warm-honey"
            style={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
          />
        </div>

        {/* Milestone ticks */}
        <div className="absolute inset-0 pointer-events-none flex items-center">
          {executionResult.steps.map((step, idx) => {
            if (step.type === 'visit' || step.type === 'done' || step.type === 'path') {
              const tickPos = (idx / Math.max(1, totalSteps - 1)) * 100;
              return (
                <div
                  key={idx}
                  className="absolute w-1 h-3 -top-0.5 rounded-full bg-warm-terracotta/70"
                  style={{ left: `${tickPos}%` }}
                  title={`Step ${idx + 1}: Settled ${step.currentNodeId}`}
                />
              );
            }
            return null;
          })}
        </div>

        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => setCurrentStepIndex(parseInt(e.target.value, 10))}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>

      {/* 2. Control Buttons & Status */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={jumpToStart}
            className="p-2 rounded-xl bg-warm-subtle hover:bg-warm-latte text-warm-espresso border border-warm-border transition"
            title="Reset (R)"
          >
            <RotateCcw className="w-4 h-4 text-warm-mocha" />
          </button>

          <button
            onClick={stepBackward}
            disabled={currentStepIndex <= 0}
            className="p-2 rounded-xl bg-warm-subtle hover:bg-warm-latte disabled:opacity-35 text-warm-espresso border border-warm-border transition"
            title="Step Back (Left Arrow)"
          >
            <SkipBack className="w-4 h-4 text-warm-mocha" />
          </button>

          <button
            onClick={togglePlay}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition border shadow-warm-sm ${
              isPlaying
                ? 'bg-warm-espresso text-white border-warm-espresso'
                : 'bg-warm-terracotta hover:bg-[#A84E24] text-white border-warm-terracotta'
            }`}
            title="Play / Pause (Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span className="text-xs font-mono">PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span className="text-xs font-mono">PLAY</span>
              </>
            )}
          </button>

          <button
            onClick={stepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 rounded-xl bg-warm-subtle hover:bg-warm-latte disabled:opacity-35 text-warm-espresso border border-warm-border transition"
            title="Step Forward (Right Arrow)"
          >
            <SkipForward className="w-4 h-4 text-warm-mocha" />
          </button>

          <button
            onClick={jumpToEnd}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-warm-subtle hover:bg-warm-latte text-xs font-mono text-warm-espresso border border-warm-border transition"
            title="Skip to final path"
          >
            <FastForward className="w-3.5 h-3.5 text-warm-amber" />
            <span>Result</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-warm-espresso">
            Step <strong className="text-warm-terracotta">{currentStepIndex + 1}</strong> /{' '}
            <span className="text-warm-mocha">{totalSteps}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono text-warm-mocha">
            <span className="px-1.5 py-0.5 rounded bg-warm-subtle border border-warm-border text-warm-espresso">
              Space
            </span>
            <span>play</span>
            <span className="px-1.5 py-0.5 rounded bg-warm-subtle border border-warm-border text-warm-espresso">
              ← / →
            </span>
            <span>step</span>
            <span className="px-1.5 py-0.5 rounded bg-warm-subtle border border-warm-border text-warm-espresso">
              R
            </span>
            <span>reset</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-warm-subtle p-1 rounded-xl border border-warm-border text-xs font-mono">
            <SlidersHorizontal className="w-3.5 h-3.5 text-warm-mocha ml-1" />
            {[0.5, 1, 2, 4].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded-lg transition ${
                  playbackSpeed === speed
                    ? 'bg-warm-espresso text-white font-bold'
                    : 'text-warm-mocha hover:text-warm-espresso'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-mono text-warm-mocha cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoPlayOnChange}
              onChange={(e) => setAutoPlayOnChange(e.target.checked)}
              className="accent-warm-terracotta rounded"
            />
            <span className="hidden sm:inline">Auto-run edits</span>
          </label>
        </div>
      </div>
    </div>
  );
};
